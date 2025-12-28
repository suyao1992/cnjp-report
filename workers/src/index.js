/**
 * 留学趋势看板 - e-Stat API 代理服务
 * Cloudflare Worker
 * 
 * 功能：
 * 1. API 代理 - 转发请求到 e-stat
 * 2. Cron 定时任务 - 每周一自动同步数据
 * 3. D1 数据存储 - 历史数据积累
 */

// ==================== 配置 ====================

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
};

// KV 缓存 TTL（秒）
const CACHE_TTL = {
    dashboard: 3600,      // Dashboard 聚合数据：1小时
    indicators: 86400,    // 单个指标：1天
    sync_status: 600      // 同步状态：10分钟
};

// 重试配置
const RETRY_CONFIG = {
    maxAttempts: 3,
    baseDelayMs: 1000,
    maxDelayMs: 5000
};

// e-stat API 统计表ID映射
// 这些ID需要从 e-stat.go.jp 查找对应数据集
const ESTAT_STATS_IDS = {
    // 消费者物价指数（総務省統計局）
    cpi_total: {
        statsDataId: '0003143513',  // 消費者物価指数 全国 総合
        parseType: 'cpi'
    },
    // 完全失業率（総務省統計局 労働力調査）
    unemployment_rate: {
        statsDataId: '0003015885',  // 労働力調査 完全失業率
        parseType: 'rate'
    },
    // 有効求人倍率（厚生労働省）
    job_ratio: {
        statsDataId: '0003026005',  // 一般職業紹介状況 有効求人倍率
        parseType: 'ratio'
    }
    // 留学生数据来自 JASSO，不在 e-stat 上，保持静态数据
};

// World Bank 指标映射
const WORLD_BANK_INDICATORS = {
    gdp_growth: 'NY.GDP.MKTP.KD.ZG',
    cpi: 'FP.CPI.TOTL.ZG',
    unemployment: 'SL.UEM.TOTL.ZS'
};

// ==================== 工具函数 ====================

/**
 * 带重试的 fetch 请求
 */
async function fetchWithRetry(url, options = {}, config = RETRY_CONFIG) {
    let lastError;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            lastError = error;
            console.warn(`Fetch attempt ${attempt}/${config.maxAttempts} failed:`, error.message);

            if (attempt < config.maxAttempts) {
                const delay = Math.min(
                    config.baseDelayMs * Math.pow(2, attempt - 1),
                    config.maxDelayMs
                );
                await new Promise(r => setTimeout(r, delay));
            }
        }
    }

    throw lastError;
}

// ==================== 主入口 ====================

export default {
    // HTTP 请求处理
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS 预检
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        try {
            // API 路由
            return await handleRequest(url.pathname, env, url.searchParams);
        } catch (error) {
            console.error('API Error:', error);
            return jsonResponse({ success: false, error: error.message }, 500);
        }
    },

    // 定时任务处理（每周一 16:00 东京时间）
    async scheduled(event, env, ctx) {
        console.log('Cron triggered:', new Date().toISOString());
        ctx.waitUntil(runDataSync(env));
    }
};

// ==================== 路由处理 ====================

async function handleRequest(pathname, env, params) {
    // API v1 路由
    if (pathname === '/api/health') {
        return handleHealth(env);
    }

    if (pathname === '/api/v1/dashboard/overview') {
        return handleDashboardOverview(env, params);
    }

    if (pathname === '/api/v1/meta/last-sync') {
        return handleLastSync(env);
    }

    if (pathname === '/api/v1/indicators') {
        return handleIndicatorsList(env);
    }

    if (pathname.startsWith('/api/v1/indicators/')) {
        const indicatorId = pathname.replace('/api/v1/indicators/', '').replace('/series', '');
        if (pathname.endsWith('/series')) {
            return handleIndicatorSeries(env, indicatorId, params);
        }
        return handleIndicatorLatest(env, indicatorId);
    }

    // 中日宏观对比 API (World Bank)
    if (pathname.startsWith('/api/v1/macro/comparison/')) {
        const indicator = pathname.replace('/api/v1/macro/comparison/', '');
        return handleMacroComparison(env, indicator);
    }

    if (pathname === '/api/stats/students') {
        return handleLegacyStudents(env);
    }
    if (pathname === '/api/stats/cpi') {
        return handleLegacyCPI(env);
    }
    if (pathname === '/api/stats/jobs') {
        return handleLegacyJobs(env);
    }
    if (pathname === '/api/stats/visa') {
        return handleLegacyVisa(env);
    }

    // 手动触发同步（调试用）
    if (pathname === '/api/admin/sync') {
        return handleManualSync(env);
    }

    return jsonResponse({ success: false, error: 'Not Found', path: pathname }, 404);
}

// ==================== API 处理函数 ====================

async function handleHealth(env) {
    const db = env.DB;
    let dbStatus = 'unknown';

    try {
        await db.prepare('SELECT 1').first();
        dbStatus = 'connected';
    } catch (e) {
        dbStatus = 'error: ' + e.message;
    }

    return jsonResponse({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus
    });
}

async function handleLastSync(env) {
    const db = env.DB;

    // 获取最后同步时间
    const config = await db.prepare(
        'SELECT value FROM config WHERE key = ?'
    ).bind('last_sync_time').first();

    // 获取最后一条同步日志
    const lastLog = await db.prepare(
        'SELECT * FROM sync_logs ORDER BY completed_at DESC LIMIT 1'
    ).first();

    return jsonResponse({
        success: true,
        data: {
            lastSyncTime: config?.value || null,
            nextSyncTime: getNextSyncTime(),
            lastSyncLog: lastLog || null
        }
    });
}

function getNextSyncTime() {
    // 计算下一个周一 16:00 东京时间
    const now = new Date();
    const tokyo = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

    const daysUntilMonday = (8 - tokyo.getDay()) % 7 || 7;
    const nextMonday = new Date(tokyo);
    nextMonday.setDate(tokyo.getDate() + daysUntilMonday);
    nextMonday.setHours(16, 0, 0, 0);

    return nextMonday.toISOString();
}

async function handleIndicatorsList(env) {
    const cacheKey = 'indicators:list';

    // 尝试从缓存获取
    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ success: true, data: cached, fromCache: true });
    }

    const db = env.DB;
    const indicators = await db.prepare(
        'SELECT * FROM indicators ORDER BY category, id'
    ).all();

    // 写入缓存（1天）
    await saveToCache(env, cacheKey, indicators.results, CACHE_TTL.indicators);

    return jsonResponse({
        success: true,
        data: indicators.results
    });
}

async function handleIndicatorLatest(env, indicatorId) {
    const db = env.DB;

    const latest = await db.prepare(`
        SELECT ts.*, i.name_zh, i.name_ja, i.unit, i.source
        FROM time_series ts
        JOIN indicators i ON ts.indicator_id = i.id
        WHERE ts.indicator_id = ?
        ORDER BY ts.time_period DESC
        LIMIT 1
    `).bind(indicatorId).first();

    if (!latest) {
        return jsonResponse({ success: false, error: 'Indicator not found' }, 404);
    }

    return jsonResponse({
        success: true,
        data: {
            indicator: indicatorId,
            latest: {
                period: latest.time_period,
                value: latest.value,
                yoy_change: latest.yoy_change,
                mom_change: latest.mom_change
            },
            meta: {
                name_zh: latest.name_zh,
                unit: latest.unit,
                source: latest.source
            }
        }
    });
}

async function handleIndicatorSeries(env, indicatorId, params) {
    const db = env.DB;
    const limit = parseInt(params.get('limit')) || 60;  // 默认5年月度数据

    const series = await db.prepare(`
        SELECT time_period, value, yoy_change, mom_change
        FROM time_series
        WHERE indicator_id = ?
        ORDER BY time_period DESC
        LIMIT ?
    `).bind(indicatorId, limit).all();

    return jsonResponse({
        success: true,
        data: {
            indicator: indicatorId,
            series: series.results.reverse()  // 按时间正序
        }
    });
}

async function handleDashboardOverview(env, params) {
    const db = env.DB;
    const cacheKey = 'dashboard:overview';

    // 尝试从 KV 缓存获取
    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ success: true, data: cached, fromCache: true });
    }

    // 获取各核心指标的最新值
    const indicators = ['students_total', 'cpi_total', 'job_ratio', 'unemployment_rate'];
    const results = {};

    for (const id of indicators) {
        const latest = await db.prepare(`
            SELECT value, yoy_change, mom_change, time_period
            FROM time_series
            WHERE indicator_id = ?
            ORDER BY time_period DESC
            LIMIT 1
        `).bind(id).first();

        results[id] = latest || { value: null };
    }

    // 获取最后同步时间
    const lastSync = await db.prepare(
        'SELECT value FROM config WHERE key = ?'
    ).bind('last_sync_time').first();

    const data = {
        indicators: results,
        lastSync: lastSync?.value,
        nextSync: getNextSyncTime()
    };

    // 写入缓存
    await saveToCache(env, cacheKey, data, CACHE_TTL.dashboard);

    return jsonResponse({ success: true, data });
}

// ==================== 旧版 API 兼容 ====================

async function handleLegacyStudents(env) {
    const db = env.DB;

    // 从 D1 获取数据
    const series = await db.prepare(`
        SELECT time_period as year, value
        FROM time_series
        WHERE indicator_id = 'students_total'
        ORDER BY time_period DESC
        LIMIT 6
    `).all();

    const latest = series.results[0];
    const prevYear = series.results[1];

    const yoyChange = latest && prevYear
        ? ((latest.value - prevYear.value) / prevYear.value * 100).toFixed(1)
        : null;

    return jsonResponse({
        summary: {
            total: latest?.value || 33.67,
            yoyChange: parseFloat(yoyChange) || 20.6,
            yoyChangePercent: parseFloat(yoyChange) || 20.6
        },
        trend: series.results.reverse().map(r => ({
            year: parseInt(r.year),
            value: r.value
        })),
        insight: `2024年${latest?.value || 33.67}万人，创历史新高`
    });
}

async function handleLegacyCPI(env) {
    const db = env.DB;

    const series = await db.prepare(`
        SELECT time_period as month, value
        FROM time_series
        WHERE indicator_id = 'cpi_total'
        ORDER BY time_period DESC
        LIMIT 6
    `).all();

    const latest = series.results[0];

    return jsonResponse({
        summary: {
            current: latest?.value || 110.0,
            momChange: 0.4,
            yoyChange: 2.9
        },
        trend: series.results.reverse().map(r => ({
            month: r.month,
            value: r.value
        })),
        insight: `11月CPI ${latest?.value || 110.0}（2020年=100），同比+2.9%`
    });
}

async function handleLegacyJobs(env) {
    const db = env.DB;

    const series = await db.prepare(`
        SELECT time_period as month, value
        FROM time_series
        WHERE indicator_id = 'job_ratio'
        ORDER BY time_period DESC
        LIMIT 6
    `).all();

    const latest = series.results[0];

    return jsonResponse({
        summary: {
            ratio: latest?.value || 1.25,
            trend: 'stable'
        },
        trend: series.results.reverse().map(r => ({
            month: r.month,
            value: r.value
        })),
        insight: `求人倍率${latest?.value || 1.25}倍，就业市场保持温和`
    });
}

async function handleLegacyVisa(env) {
    return handleLegacyStudents(env);  // 暂时共用数据
}

// ==================== 数据同步 ====================

async function handleManualSync(env) {
    try {
        const result = await runDataSync(env);
        return jsonResponse({ success: true, result });
    } catch (error) {
        return jsonResponse({ success: false, error: error.message }, 500);
    }
}

async function runDataSync(env) {
    const db = env.DB;
    const startTime = new Date();

    console.log('Starting data sync...');

    // 记录同步开始
    const logResult = await db.prepare(`
        INSERT INTO sync_logs (sync_type, status, started_at)
        VALUES (?, ?, ?)
    `).bind('cron', 'running', startTime.toISOString()).run();

    const logId = logResult.meta.last_row_id;

    let recordsAdded = 0;
    let recordsUpdated = 0;
    let indicatorsUpdated = 0;
    let failedIndicators = 0;
    let errorMessage = null;

    try {
        // 获取所有指标
        const indicators = await db.prepare('SELECT * FROM indicators').all();

        for (const indicator of indicators.results) {
            try {
                const result = await syncIndicator(env, db, indicator);
                recordsAdded += result.added;
                recordsUpdated += result.updated;
                if (result.added > 0 || result.updated > 0) {
                    indicatorsUpdated++;
                }
            } catch (e) {
                console.error(`Error syncing ${indicator.id}:`, e.message);
                failedIndicators++;
            }
        }

        // 更新最后同步时间
        await db.prepare(`
            UPDATE config SET value = ?, updated_at = CURRENT_TIMESTAMP
            WHERE key = 'last_sync_time'
        `).bind(new Date().toISOString()).run();

        // 清除缓存
        if (env.CACHE) {
            await env.CACHE.delete('dashboard:overview');
            await env.CACHE.delete('indicators:list');
        }

    } catch (error) {
        errorMessage = error.message;
        console.error('Sync error:', error);
    }

    // 更新同步日志 - 改进状态判断
    const endTime = new Date();
    let status;
    if (errorMessage) {
        status = 'failed';
    } else if (failedIndicators > 0 && indicatorsUpdated > 0) {
        status = 'partial';  // 部分成功
    } else if (failedIndicators > 0 && indicatorsUpdated === 0) {
        status = 'failed';
    } else {
        status = 'success';
    }

    await db.prepare(`
        UPDATE sync_logs 
        SET status = ?, 
            indicators_updated = ?,
            records_added = ?,
            records_updated = ?,
            error_message = ?,
            completed_at = ?
        WHERE id = ?
    `).bind(status, indicatorsUpdated, recordsAdded, recordsUpdated, errorMessage, endTime.toISOString(), logId).run();

    console.log(`Sync completed: ${status}, ${recordsAdded} added, ${recordsUpdated} updated, ${failedIndicators} failed`);

    return {
        status,
        indicatorsUpdated,
        recordsAdded,
        recordsUpdated,
        failedIndicators,
        duration: endTime - startTime
    };
}

async function syncIndicator(env, db, indicator) {
    let data = [];

    // 尝试从真实 e-stat API 获取数据
    const estatConfig = ESTAT_STATS_IDS[indicator.id];
    if (estatConfig && env.ESTAT_APP_ID) {
        try {
            console.log(`Fetching ${indicator.id} from e-stat API...`);
            data = await fetchEstatData(env, estatConfig);
            console.log(`Fetched ${data.length} records for ${indicator.id}`);
        } catch (e) {
            console.warn(`e-stat API failed for ${indicator.id}, using static data:`, e.message);
            data = getStaticData(indicator.id);
        }
    } else {
        // 没有配置 appId 或该指标不在 e-stat 上，使用静态数据
        data = getStaticData(indicator.id);
    }

    if (!data || data.length === 0) {
        return { added: 0, updated: 0 };
    }

    let added = 0;
    let updated = 0;

    for (const record of data) {
        // 检查是否已存在
        const existing = await db.prepare(`
            SELECT id, value FROM time_series 
            WHERE indicator_id = ? AND time_period = ?
        `).bind(indicator.id, record.period).first();

        if (!existing) {
            // 插入新记录
            await db.prepare(`
                INSERT INTO time_series (indicator_id, time_period, value, yoy_change, mom_change, fetched_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
                indicator.id,
                record.period,
                record.value,
                record.yoy || null,
                record.mom || null,
                new Date().toISOString()
            ).run();
            added++;
        } else if (existing.value !== record.value) {
            // 更新已存在但值变化的记录
            await db.prepare(`
                UPDATE time_series 
                SET value = ?, yoy_change = ?, mom_change = ?, revision_number = revision_number + 1, fetched_at = ?
                WHERE id = ?
            `).bind(record.value, record.yoy || null, record.mom || null, new Date().toISOString(), existing.id).run();
            updated++;
        }
    }

    return { added, updated };
}

/**
 * 从 e-stat API 获取数据
 */
async function fetchEstatData(env, config) {
    const { statsDataId, parseType } = config;
    const appId = env.ESTAT_APP_ID;
    const baseUrl = env.ESTAT_API_BASE || 'https://api.e-stat.go.jp/rest/3.0/app';

    // 获取最近2年的数据
    const url = `${baseUrl}/json/getStatsData?appId=${appId}&statsDataId=${statsDataId}&lang=J&limit=24`;

    const response = await fetchWithRetry(url);
    const json = await response.json();

    // 检查 API 响应状态
    if (json.GET_STATS_DATA?.RESULT?.STATUS !== 0) {
        const errorMsg = json.GET_STATS_DATA?.RESULT?.ERROR_MSG || 'Unknown error';
        throw new Error(`e-stat API error: ${errorMsg}`);
    }

    return parseEstatResponse(json, parseType);
}

/**
 * 解析 e-stat API 响应
 */
function parseEstatResponse(json, parseType) {
    const data = [];

    try {
        const statData = json.GET_STATS_DATA?.STATISTICAL_DATA;
        if (!statData?.DATA_INF?.VALUE) {
            return data;
        }

        const values = statData.DATA_INF.VALUE;
        const classInfo = statData.CLASS_INF?.CLASS_OBJ || [];

        // 找到时间分类
        const timeClass = classInfo.find(c => c['@id'] === 'time' || c['@id']?.includes('時間'));

        for (const item of values) {
            // 提取时间标签
            const timeCode = item['@time'] || item['@cat01'];
            if (!timeCode) continue;

            // 转换为标准格式 (YYYY-MM 或 YYYY)
            let period = timeCode;
            if (timeCode.match(/^\d{6}$/)) {
                // 200001 -> 2000-01
                period = `${timeCode.slice(0, 4)}-${timeCode.slice(4, 6)}`;
            } else if (timeCode.match(/^\d{4}$/)) {
                period = timeCode;
            }

            // 提取数值
            const value = parseFloat(item.$);
            if (isNaN(value)) continue;

            data.push({
                period,
                value: parseType === 'cpi' ? value : value  // CPI 原值，其他指标也是原值
            });
        }

        // 按时间排序
        data.sort((a, b) => a.period.localeCompare(b.period));

    } catch (e) {
        console.error('Error parsing e-stat response:', e);
    }

    return data;
}

// 静态数据（真实官方数据，用于初始化）
function getStaticData(indicatorId) {
    const data = {
        students_total: [
            { period: '2019', value: 31.22 },
            { period: '2020', value: 27.94 },
            { period: '2021', value: 24.26 },
            { period: '2022', value: 23.14 },
            { period: '2023', value: 27.93, yoy: 20.7 },
            { period: '2024', value: 33.67, yoy: 20.6 }
        ],
        students_china: [
            { period: '2019', value: 12.44 },
            { period: '2020', value: 12.16 },
            { period: '2021', value: 11.45 },
            { period: '2022', value: 10.39 },
            { period: '2023', value: 11.56 },
            { period: '2024', value: 12.35, yoy: 6.9 }
        ],
        cpi_total: [
            { period: '2024-06', value: 108.2, yoy: 2.8 },
            { period: '2024-07', value: 108.6, yoy: 2.8 },
            { period: '2024-08', value: 108.9, yoy: 3.0 },
            { period: '2024-09', value: 109.2, yoy: 2.5 },
            { period: '2024-10', value: 109.6, yoy: 2.3 },
            { period: '2024-11', value: 110.0, yoy: 2.9 }
        ],
        job_ratio: [
            { period: '2024-06', value: 1.24 },
            { period: '2024-07', value: 1.24 },
            { period: '2024-08', value: 1.24 },
            { period: '2024-09', value: 1.24 },
            { period: '2024-10', value: 1.25 },
            { period: '2024-11', value: 1.25 }
        ],
        unemployment_rate: [
            { period: '2024-06', value: 2.5 },
            { period: '2024-07', value: 2.6 },
            { period: '2024-08', value: 2.5 },
            { period: '2024-09', value: 2.4 },
            { period: '2024-10', value: 2.5 },
            { period: '2024-11', value: 2.5 }
        ],
        gdp_growth: [
            { period: '2023-Q1', value: 0.8 },
            { period: '2023-Q2', value: 1.2 },
            { period: '2023-Q3', value: -0.7 },
            { period: '2023-Q4', value: 0.1 },
            { period: '2024-Q1', value: -0.5 },
            { period: '2024-Q2', value: 0.7 },
            { period: '2024-Q3', value: 0.3 }
        ],
        population_total: [
            { period: '2024-06', value: 12393 },
            { period: '2024-07', value: 12390 },
            { period: '2024-08', value: 12387 },
            { period: '2024-09', value: 12384 },
            { period: '2024-10', value: 12381 },
            { period: '2024-11', value: 12378 }
        ],
        foreign_residents: [
            { period: '2019', value: 293.3 },
            { period: '2020', value: 288.7 },
            { period: '2021', value: 276.1 },
            { period: '2022', value: 296.1 },
            { period: '2023', value: 322.3 },
            { period: '2024', value: 341.0, yoy: 5.8 }
        ]
    };

    return data[indicatorId] || [];
}

// ==================== World Bank API 处理 ====================

async function handleMacroComparison(env, indicator) {
    // 验证指标
    const wbIndicatorCode = WORLD_BANK_INDICATORS[indicator];
    if (!wbIndicatorCode) {
        return jsonResponse({
            success: false,
            error: 'Invalid indicator. Valid indicators: gdp_growth, cpi, unemployment'
        }, 400);
    }

    // 检查缓存
    const cacheKey = `wb:${indicator}:v2`; // Update cache key version
    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({
            success: true,
            data: cached,
            fromCache: true
        });
    }

    try {
        // 并行获取中国和日本的数据
        const [chinaData, japanData] = await Promise.all([
            fetchWorldBankData('CHN', wbIndicatorCode),
            fetchWorldBankData('JPN', wbIndicatorCode)
        ]);

        const result = {
            china: chinaData,
            japan: japanData,
            indicator: indicator,
            source: 'World Bank'
        };

        // 缓存1天
        await saveToCache(env, cacheKey, result, 86400);

        return jsonResponse({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('World Bank API error:', error);
        return jsonResponse({
            success: false,
            error: 'Failed to fetch World Bank data: ' + error.message
        }, 500);
    }
}

async function fetchWorldBankData(countryCode, indicatorCode) {
    const baseUrl = 'https://api.worldbank.org/v2';
    // Update to 2025
    const url = `${baseUrl}/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=100&date=1990:2025`;

    const response = await fetchWithRetry(url);
    const json = await response.json();

    // World Bank 响应格式: [metadata, data]
    if (!json || !Array.isArray(json) || json.length < 2) {
        throw new Error('Invalid World Bank response format');
    }

    const dataArray = json[1];
    if (!dataArray || !Array.isArray(dataArray)) {
        return [];
    }

    // 转换为标准格式并过滤null值
    return dataArray
        .filter(item => item.value !== null && item.value !== undefined)
        .map(item => ({
            year: parseInt(item.date),
            value: parseFloat(item.value)
        }))
        .sort((a, b) => a.year - b.year);
}

// ==================== 缓存工具 ====================

async function getFromCache(env, key) {
    if (!env.CACHE) return null;
    try {
        return await env.CACHE.get(key, 'json');
    } catch (e) {
        console.error('Cache read error:', e);
        return null;
    }
}

async function saveToCache(env, key, value, ttl) {
    if (!env.CACHE) return;
    try {
        await env.CACHE.put(key, JSON.stringify(value), { expirationTtl: ttl });
    } catch (e) {
        console.error('Cache write error:', e);
    }
}

// ==================== 响应工具 ====================

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: CORS_HEADERS
    });
}

/**
 * 留学趋势看板 - e-Stat API 代理服务
 * Cloudflare Worker
 */

// CORS 配置
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
};

// 缓存时间配置（秒）
const CACHE_TTL = {
    students: 86400,      // 学生数据：1天
    visa: 86400,          // 签证数据：1天
    cpi: 3600,            // CPI数据：1小时
    jobs: 3600,           // 就业数据：1小时
    default: 3600         // 默认：1小时
};

// e-Stat 统计表ID配置
const STAT_TABLE_IDS = {
    // 学校基本調査 - 外国人学生数
    foreignStudents: '0003147040',
    // 在留外国人統計
    foreignResidents: '0003423913',
    // 消費者物価指数
    cpi: '0003143513',
    // 一般職業紹介状況（有効求人倍率）
    jobOpenings: '0003212549',
    // 労働力調査
    laborForce: '0003130078'
};

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 处理 CORS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        // 路由处理
        try {
            if (url.pathname === '/api/stats/students') {
                return await handleStudentsData(env);
            }
            if (url.pathname === '/api/stats/visa') {
                return await handleVisaData(env);
            }
            if (url.pathname === '/api/stats/cpi') {
                return await handleCPIData(env);
            }
            if (url.pathname === '/api/stats/jobs') {
                return await handleJobsData(env);
            }
            if (url.pathname.startsWith('/api/compare/')) {
                const cities = url.pathname.replace('/api/compare/', '').split(',');
                return await handleCityComparison(env, cities);
            }
            if (url.pathname === '/api/health') {
                return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
            }

            return jsonResponse({ error: 'Not Found', path: url.pathname }, 404);
        } catch (error) {
            console.error('API Error:', error);
            return jsonResponse({ error: error.message }, 500);
        }
    }
};

/**
 * 获取留学生数据
 */
async function handleStudentsData(env) {
    const cacheKey = 'stats:students';

    // 尝试从缓存获取
    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ ...cached, fromCache: true });
    }

    // 调用 e-Stat API
    const data = await fetchEstatData(env, STAT_TABLE_IDS.foreignStudents, {
        // 可以添加筛选参数
    });

    // 处理数据
    const processed = processStudentsData(data);

    // 存入缓存
    await saveToCache(env, cacheKey, processed, CACHE_TTL.students);

    return jsonResponse(processed);
}

/**
 * 获取在留资格（签证）数据
 */
async function handleVisaData(env) {
    const cacheKey = 'stats:visa';

    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ ...cached, fromCache: true });
    }

    const data = await fetchEstatData(env, STAT_TABLE_IDS.foreignResidents, {});
    const processed = processVisaData(data);

    await saveToCache(env, cacheKey, processed, CACHE_TTL.visa);

    return jsonResponse(processed);
}

/**
 * 获取CPI数据
 */
async function handleCPIData(env) {
    const cacheKey = 'stats:cpi';

    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ ...cached, fromCache: true });
    }

    const data = await fetchEstatData(env, STAT_TABLE_IDS.cpi, {});
    const processed = processCPIData(data);

    await saveToCache(env, cacheKey, processed, CACHE_TTL.cpi);

    return jsonResponse(processed);
}

/**
 * 获取就业市场数据
 */
async function handleJobsData(env) {
    const cacheKey = 'stats:jobs';

    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ ...cached, fromCache: true });
    }

    const data = await fetchEstatData(env, STAT_TABLE_IDS.jobOpenings, {});
    const processed = processJobsData(data);

    await saveToCache(env, cacheKey, processed, CACHE_TTL.jobs);

    return jsonResponse(processed);
}

/**
 * 城市对比数据
 */
async function handleCityComparison(env, cities) {
    const cacheKey = `compare:${cities.sort().join('-')}`;

    const cached = await getFromCache(env, cacheKey);
    if (cached) {
        return jsonResponse({ ...cached, fromCache: true });
    }

    // 并行获取各项数据
    const [cpiData, jobsData, visaData] = await Promise.all([
        fetchEstatData(env, STAT_TABLE_IDS.cpi, {}),
        fetchEstatData(env, STAT_TABLE_IDS.jobOpenings, {}),
        fetchEstatData(env, STAT_TABLE_IDS.foreignResidents, {})
    ]);

    const processed = processCityComparison(cities, { cpiData, jobsData, visaData });

    await saveToCache(env, cacheKey, processed, CACHE_TTL.default);

    return jsonResponse(processed);
}

/**
 * 调用 e-Stat API
 */
async function fetchEstatData(env, statsDataId, params = {}) {
    const baseUrl = env.ESTAT_API_BASE || 'https://api.e-stat.go.jp/rest/3.0/app';
    const appId = env.ESTAT_APP_ID;

    if (!appId) {
        throw new Error('ESTAT_APP_ID not configured');
    }

    const queryParams = new URLSearchParams({
        appId,
        statsDataId,
        ...params
    });

    const url = `${baseUrl}/json/getStatsData?${queryParams}`;

    console.log('Fetching e-Stat data:', { statsDataId });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`e-Stat API error: ${response.status}`);
    }

    return await response.json();
}

/**
 * 数据处理函数
 */
function processStudentsData(raw) {
    // TODO: 根据实际API响应结构处理数据
    return {
        type: 'students',
        updatedAt: new Date().toISOString(),
        summary: {
            total: 0,
            yoyChange: 0,
            yoyChangePercent: 0
        },
        trend: [],
        byNationality: [],
        byField: [],
        bySchoolType: []
    };
}

function processVisaData(raw) {
    return {
        type: 'visa',
        updatedAt: new Date().toISOString(),
        summary: {
            total: 0,
            yoyChange: 0
        },
        trend: [],
        byPrefecture: [],
        byNationality: []
    };
}

function processCPIData(raw) {
    return {
        type: 'cpi',
        updatedAt: new Date().toISOString(),
        summary: {
            current: 0,
            momChange: 0,
            yoyChange: 0
        },
        trend: [],
        byCategory: [],
        byRegion: []
    };
}

function processJobsData(raw) {
    return {
        type: 'jobs',
        updatedAt: new Date().toISOString(),
        summary: {
            ratio: 0,
            trend: ''
        },
        trend: [],
        byPrefecture: []
    };
}

function processCityComparison(cities, data) {
    return {
        type: 'comparison',
        cities,
        updatedAt: new Date().toISOString(),
        metrics: {
            rent: {},
            cpi: {},
            jobs: {},
            students: {}
        }
    };
}

/**
 * 缓存操作
 */
async function getFromCache(env, key) {
    if (!env.CACHE) return null;

    try {
        const value = await env.CACHE.get(key, 'json');
        return value;
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

/**
 * JSON 响应辅助函数
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: CORS_HEADERS
    });
}

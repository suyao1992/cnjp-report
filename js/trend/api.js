/**
 * 留学趋势看板 - API 调用封装
 */

const TrendAPI = (function () {
    // API 端点配置
    // 开发环境使用本地 Worker，生产环境使用 Cloudflare Worker
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:8787'  // 本地开发
        : 'https://estat-api.suyao1992.workers.dev';  // 生产环境

    // 缓存配置
    const CACHE_PREFIX = 'trend_cache_';
    const CACHE_TTL = 30 * 60 * 1000; // 30分钟

    // 错误类型
    const ERROR_TYPES = {
        NETWORK: 'network',
        TIMEOUT: 'timeout',
        SERVER: 'server',
        UNKNOWN: 'unknown'
    };

    // 用户友好的错误信息
    const ERROR_MESSAGES = {
        network: '网络连接失败，请检查网络设置',
        timeout: '请求超时，服务器响应过慢',
        server: '服务暂时不可用，请稍后重试',
        unknown: '发生未知错误，请刷新页面重试'
    };

    /**
     * 发起 API 请求（带超时和重试）
     */
    async function fetchAPI(endpoint, params = {}, options = {}) {
        const url = new URL(`${API_BASE}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const timeout = options.timeout || 10000; // 默认10秒超时
        const maxRetries = options.retries || 2;  // 默认重试2次

        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(url.toString(), {
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw { type: ERROR_TYPES.SERVER, status: response.status };
                }

                return await response.json();
            } catch (error) {
                clearTimeout(timeoutId);

                // 判断错误类型
                if (error.name === 'AbortError') {
                    lastError = { type: ERROR_TYPES.TIMEOUT, message: ERROR_MESSAGES.timeout };
                } else if (error.type === ERROR_TYPES.SERVER) {
                    lastError = { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.server, status: error.status };
                } else if (!navigator.onLine) {
                    lastError = { type: ERROR_TYPES.NETWORK, message: ERROR_MESSAGES.network };
                    break; // 离线不重试
                } else {
                    lastError = { type: ERROR_TYPES.UNKNOWN, message: ERROR_MESSAGES.unknown };
                }

                console.warn(`API attempt ${attempt}/${maxRetries} failed for ${endpoint}:`, error);

                // 最后一次尝试失败
                if (attempt === maxRetries) {
                    break;
                }

                // 等待后重试
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }

        // 抛出用户友好的错误
        const friendlyError = new Error(lastError.message);
        friendlyError.type = lastError.type;
        friendlyError.userMessage = lastError.message;
        throw friendlyError;
    }

    /**
     * 带缓存的请求
     */
    async function fetchWithCache(endpoint, params = {}) {
        const cacheKey = CACHE_PREFIX + endpoint + JSON.stringify(params);

        // 尝试从缓存读取
        const cached = getCachedData(cacheKey);
        if (cached) {
            console.log(`Cache hit for ${endpoint}`);
            return { ...cached, fromCache: true };
        }

        try {
            // 发起请求
            const data = await fetchAPI(endpoint, params);

            // 存入缓存
            setCachedData(cacheKey, data);

            return data;
        } catch (error) {
            // 如果有过期缓存，网络失败时返回过期数据
            const expiredCache = getExpiredCache(cacheKey);
            if (expiredCache) {
                console.warn('Using expired cache due to network error');
                return { ...expiredCache, fromCache: true, stale: true };
            }
            throw error;
        }
    }

    /**
     * 获取过期缓存（用于网络失败时的备用）
     */
    function getExpiredCache(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            const { data } = JSON.parse(item);
            return data;
        } catch (e) {
            return null;
        }
    }

    /**
     * 缓存读取
     */
    function getCachedData(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const { data, timestamp } = JSON.parse(item);

            if (Date.now() - timestamp > CACHE_TTL) {
                localStorage.removeItem(key);
                return null;
            }

            return data;
        } catch (e) {
            return null;
        }
    }

    /**
     * 缓存写入
     */
    function setCachedData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Cache write failed:', e);
        }
    }

    /**
     * 清除所有缓存
     */
    function clearCache() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(CACHE_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
    }

    // 公开 API 方法
    return {
        /**
         * 获取 Dashboard 概览数据（新 API）
         */
        getDashboardOverview: async function () {
            return await fetchWithCache('/api/v1/dashboard/overview');
        },

        /**
         * 获取同步状态
         */
        getSyncStatus: async function () {
            return await fetchAPI('/api/v1/meta/last-sync');
        },

        /**
         * 获取所有指标列表
         */
        getAllIndicators: async function () {
            return await fetchWithCache('/api/v1/indicators');
        },

        /**
         * 获取中日宏观对比数据 (World Bank)
         * @param {string} indicator - 'gdp_growth', 'cpi', 'unemployment'
         */
        getMacroComparison: async function (indicator) {
            return await fetchWithCache(`/api/v1/macro/comparison/${indicator}`);
        },

        /**
         * 获取单个指标最新值
         */
        getIndicator: async function (indicatorId) {
            return await fetchWithCache(`/api/v1/indicators/${indicatorId}`);
        },

        /**
         * 获取单个指标时序数据
         */
        getIndicatorSeries: async function (indicatorId, years = 5) {
            return await fetchWithCache(`/api/v1/indicators/${indicatorId}/series`, { years });
        },

        /**
         * 获取留学生数据（兼容旧方法）
         */
        getStudentsData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/students', { range: timeRange });
        },

        /**
         * 获取签证数据（兼容旧方法）
         */
        getVisaData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/visa', { range: timeRange });
        },

        /**
         * 获取CPI数据（兼容旧方法）
         */
        getCPIData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/cpi', { range: timeRange });
        },

        /**
         * 获取就业市场数据（兼容旧方法）
         */
        getJobsData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/jobs', { range: timeRange });
        },

        /**
         * 获取城市对比数据
         */
        getCityComparison: async function (cities) {
            const cityParam = cities.join(',');
            return await fetchWithCache(`/api/compare/${cityParam}`);
        },

        /**
         * 健康检查
         */
        healthCheck: async function () {
            return await fetchAPI('/api/health');
        },

        /**
         * 清除缓存
         */
        clearCache: clearCache
    };
})();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrendAPI;
}

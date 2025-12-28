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

    /**
     * 发起 API 请求
     */
    async function fetchAPI(endpoint, params = {}) {
        const url = new URL(`${API_BASE}${endpoint}`);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        try {
            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API fetch failed for ${endpoint}:`, error);
            throw error;
        }
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

        // 发起请求
        const data = await fetchAPI(endpoint, params);

        // 存入缓存
        setCachedData(cacheKey, data);

        return data;
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
         * 获取留学生数据
         */
        getStudentsData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/students', { range: timeRange });
        },

        /**
         * 获取签证数据
         */
        getVisaData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/visa', { range: timeRange });
        },

        /**
         * 获取CPI数据
         */
        getCPIData: async function (timeRange = '5y') {
            return await fetchWithCache('/api/stats/cpi', { range: timeRange });
        },

        /**
         * 获取就业市场数据
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

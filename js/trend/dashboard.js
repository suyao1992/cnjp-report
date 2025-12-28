/**
 * 留学趋势看板 - Dashboard 主逻辑
 */

(function () {
    'use strict';

    // 当前时间范围
    let currentTimeRange = '5y';

    // 图表实例存储
    const charts = {};

    // Toast 图标
    const TOAST_ICONS = {
        error: '❌',
        warning: '⚠️',
        success: '✅',
        info: 'ℹ️'
    };

    // Toast 标题
    const TOAST_TITLES = {
        error: '错误',
        warning: '警告',
        success: '成功',
        info: '提示'
    };

    /**
     * 显示 Toast 通知
     */
    function showToast(message, type = 'info', duration = 5000) {
        // 确保容器存在
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // 创建 Toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${TOAST_ICONS[type]}</span>
            <div class="toast-content">
                <div class="toast-title">${TOAST_TITLES[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">×</button>
        `;

        // 关闭按钮
        toast.querySelector('.toast-close').addEventListener('click', () => {
            dismissToast(toast);
        });

        container.appendChild(toast);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => dismissToast(toast), duration);
        }

        return toast;
    }

    /**
     * 关闭 Toast
     */
    function dismissToast(toast) {
        if (!toast || toast.classList.contains('hiding')) return;
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }

    /**
     * 显示错误消息（快捷方法）
     */
    function showError(message) {
        return showToast(message, 'error', 8000);
    }

    /**
     * 显示警告消息（快捷方法）
     */
    function showWarning(message) {
        return showToast(message, 'warning', 6000);
    }

    /**
     * 显示成功消息（快捷方法）
     */
    function showSuccess(message) {
        return showToast(message, 'success', 4000);
    }

    // 官方统计数据（数据来源：JASSO、文部科学省、総務省統計局、厚生労働省）
    // 更新时间：2024年12月
    const OFFICIAL_DATA = {
        students: {
            // 数据来源：JASSO 2024年5月1日统计
            summary: { total: 33.67, yoyChange: 20.6, yoyChangePercent: 20.6 },
            trend: [
                // 全部历史数据 (2013-2024)
                { year: 2013, value: 13.57 },
                { year: 2014, value: 18.42 },
                { year: 2015, value: 20.83 },
                { year: 2016, value: 23.95 },
                { year: 2017, value: 26.77 },
                { year: 2018, value: 29.87 },
                { year: 2019, value: 31.22 },
                { year: 2020, value: 27.94 },  // 疫情影响
                { year: 2021, value: 24.26 },  // 疫情影响
                { year: 2022, value: 23.14 },  // 疫情影响
                { year: 2023, value: 27.93 },  // 恢复
                { year: 2024, value: 33.67 }   // 创历史新高
            ],
            insight: '2024年33.67万人，创历史新高，同比+20.6%',
            // 按国籍分布（2024年）
            byNationality: [
                { name: '中国', value: 12.35, percent: 36.7, yoyChange: 6.9 },
                { name: '尼泊尔', value: 6.48, percent: 19.2, yoyChange: 71.1 },
                { name: '越南', value: 4.03, percent: 12.0, yoyChange: 11.0 },
                { name: '缅甸', value: 1.66, percent: 4.9, yoyChange: 113.5 },
                { name: '韩国', value: 1.46, percent: 4.3, yoyChange: -2.5 },
                { name: '其他', value: 7.69, percent: 22.9, yoyChange: 25.0 }
            ],
            // 按学校类型分布（2024年）
            bySchoolType: [
                { name: '大学（学部）', value: 8.74, percent: 26.0 },
                { name: '专门学校', value: 7.64, percent: 22.7 },
                { name: '日语学校', value: 10.72, percent: 31.8 },
                { name: '大学院', value: 5.82, percent: 17.3 },
                { name: '短期大学', value: 0.33, percent: 1.0 },
                { name: '高专', value: 0.05, percent: 0.2 }
            ]
        },
        visa: {
            // 数据来源：出入国在留管理庁
            summary: { total: 33.67, yoyChange: 20.6 },
            trend: [
                // 全部历史数据 (2013-2024)
                { year: 2013, value: 19.34 },
                { year: 2014, value: 21.45 },
                { year: 2015, value: 24.68 },
                { year: 2016, value: 27.72 },
                { year: 2017, value: 31.12 },
                { year: 2018, value: 33.73 },
                { year: 2019, value: 34.59 },
                { year: 2020, value: 28.06 },
                { year: 2021, value: 20.80 },
                { year: 2022, value: 23.01 },
                { year: 2023, value: 27.93 },
                { year: 2024, value: 33.67 }
            ],
            insight: '在留留学生33.67万，创历史新高'
        },
        cpi: {
            // 数据来源：総務省統計局 2024年11月
            summary: { current: 110.0, momChange: 0.4, yoyChange: 2.9 },
            trend: [
                // 全部历史数据 (月度)
                { month: '2019-12', value: 101.8 },
                { month: '2020-06', value: 101.5 },
                { month: '2020-12', value: 101.2 },
                { month: '2021-06', value: 101.6 },
                { month: '2021-12', value: 102.1 },
                { month: '2022-06', value: 103.5 },
                { month: '2022-12', value: 105.2 },
                { month: '2023-06', value: 106.8 },
                { month: '2023-12', value: 107.6 },
                { month: '2024-01', value: 107.8 },
                { month: '2024-02', value: 107.9 },
                { month: '2024-03', value: 108.0 },
                { month: '2024-04', value: 108.1 },
                { month: '2024-05', value: 108.1 },
                { month: '2024-06', value: 108.2 },
                { month: '2024-07', value: 108.6 },
                { month: '2024-08', value: 108.9 },
                { month: '2024-09', value: 109.2 },
                { month: '2024-10', value: 109.6 },
                { month: '2024-11', value: 110.0 }
            ],
            insight: '11月CPI 110.0（2020年=100），同比+2.9%',
            // 核心CPI（除生鲜食品）
            coreCPI: { current: 112.5, yoyChange: 2.7 }
        },
        jobs: {
            // 数据来源：厚生労働省 2024年11月
            summary: { ratio: 1.25, trend: 'stable' },
            trend: [
                // 全部历史数据 (月度)
                { month: '2019-12', value: 1.57 },
                { month: '2020-06', value: 1.11 },
                { month: '2020-12', value: 1.06 },
                { month: '2021-06', value: 1.13 },
                { month: '2021-12', value: 1.16 },
                { month: '2022-06', value: 1.27 },
                { month: '2022-12', value: 1.35 },
                { month: '2023-06', value: 1.30 },
                { month: '2023-12', value: 1.27 },
                { month: '2024-01', value: 1.27 },
                { month: '2024-02', value: 1.26 },
                { month: '2024-03', value: 1.28 },
                { month: '2024-04', value: 1.26 },
                { month: '2024-05', value: 1.24 },
                { month: '2024-06', value: 1.24 },
                { month: '2024-07', value: 1.24 },
                { month: '2024-08', value: 1.24 },
                { month: '2024-09', value: 1.24 },
                { month: '2024-10', value: 1.25 },
                { month: '2024-11', value: 1.25 }
            ],
            insight: '求人倍率1.25倍，就业市场保持温和',
            // 按都道府县（2024年11月）
            byPrefecture: [
                { name: '福井県', value: 1.91 },
                { name: '東京都', value: 1.78 },
                { name: '愛知県', value: 1.42 },
                { name: '大阪府', value: 1.26 },
                { name: '北海道', value: 1.05 }
            ]
        }
    };

    /**
     * 计算变化率
     * @param {number} startValue - 起始值
     * @param {number} endValue - 结束值
     * @returns {number} 变化百分比
     */
    function calculateChange(startValue, endValue) {
        if (!startValue || startValue === 0) return 0;
        return ((endValue - startValue) / startValue * 100).toFixed(1);
    }

    /**
     * 获取时间范围标签
     * @param {string} range - 时间范围
     * @returns {string} 中文标签
     */
    function getRangeLabel(range) {
        const labels = {
            '12m': '同比',
            '5y': '5年变化',
            'all': '累计变化'
        };
        return labels[range] || '同比';
    }

    /**
     * 根据时间范围过滤数据并计算动态摘要（基于数据集的最新日期）
     * @param {string} range - '12m' (近12个月), '5y' (近5年), 'all' (全部历史)
     * @returns {object} 过滤后的数据副本，包含动态计算的摘要和洞察
     */
    function filterDataByTimeRange(range) {
        // 深拷贝数据
        const filtered = JSON.parse(JSON.stringify(OFFICIAL_DATA));

        // 获取数据集中的最新时间点作为基准
        const latestStudentYear = Math.max(...OFFICIAL_DATA.students.trend.map(d => d.year));
        const latestVisaYear = Math.max(...OFFICIAL_DATA.visa.trend.map(d => d.year));

        // 获取月度数据的最新月份
        const getLatestMonth = (trend) => {
            const dates = trend.map(d => {
                const [year, month] = d.month.split('-').map(Number);
                return new Date(year, month - 1);
            });
            return new Date(Math.max(...dates));
        };
        const latestCPIDate = getLatestMonth(OFFICIAL_DATA.cpi.trend);
        const latestJobsDate = getLatestMonth(OFFICIAL_DATA.jobs.trend);

        // 根据时间范围过滤
        if (range === '12m') {
            // 近12个月/近2年：年度数据显示最近2年，月度数据显示最近12个月
            const cutoffYearStudents = latestStudentYear - 1;
            const cutoffYearVisa = latestVisaYear - 1;

            // 过滤年度数据（最近2年）
            filtered.students.trend = OFFICIAL_DATA.students.trend.filter(d => d.year >= cutoffYearStudents);
            filtered.visa.trend = OFFICIAL_DATA.visa.trend.filter(d => d.year >= cutoffYearVisa);

            // 计算月度数据的12个月前日期
            const cutoffCPIDate = new Date(latestCPIDate);
            cutoffCPIDate.setMonth(cutoffCPIDate.getMonth() - 12);
            const cutoffJobsDate = new Date(latestJobsDate);
            cutoffJobsDate.setMonth(cutoffJobsDate.getMonth() - 12);

            // 过滤月度数据
            filtered.cpi.trend = OFFICIAL_DATA.cpi.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffCPIDate;
            });
            filtered.jobs.trend = OFFICIAL_DATA.jobs.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffJobsDate;
            });

        } else if (range === '5y') {
            // 近5年
            const cutoffYearStudents = latestStudentYear - 4;  // 包含当前年共5年
            const cutoffYearVisa = latestVisaYear - 4;

            // 过滤年度数据
            filtered.students.trend = OFFICIAL_DATA.students.trend.filter(d => d.year >= cutoffYearStudents);
            filtered.visa.trend = OFFICIAL_DATA.visa.trend.filter(d => d.year >= cutoffYearVisa);

            // 计算月度数据的5年前日期
            const cutoffCPIDate = new Date(latestCPIDate);
            cutoffCPIDate.setFullYear(cutoffCPIDate.getFullYear() - 5);
            const cutoffJobsDate = new Date(latestJobsDate);
            cutoffJobsDate.setFullYear(cutoffJobsDate.getFullYear() - 5);

            // 过滤月度数据
            filtered.cpi.trend = OFFICIAL_DATA.cpi.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffCPIDate;
            });
            filtered.jobs.trend = OFFICIAL_DATA.jobs.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffJobsDate;
            });
        }
        // 'all' - 不需要过滤趋势数据

        // ============ 动态计算摘要和洞察 ============
        const rangeLabel = getRangeLabel(range);

        // 学生数据动态摘要
        if (filtered.students.trend.length >= 2) {
            const first = filtered.students.trend[0];
            const last = filtered.students.trend[filtered.students.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.students.summary = {
                ...filtered.students.summary,
                change: parseFloat(change),
                rangeLabel: rangeLabel
            };
            filtered.students.insight = `${last.year}年${last.value}万人，较${first.year}年${change >= 0 ? '增长' : '下降'}${Math.abs(change)}%`;
        } else if (filtered.students.trend.length === 1) {
            const item = filtered.students.trend[0];
            filtered.students.summary = { ...filtered.students.summary, change: 0, rangeLabel: rangeLabel };
            filtered.students.insight = `${item.year}年${item.value}万人`;
        }

        // 签证数据动态摘要
        if (filtered.visa.trend.length >= 2) {
            const first = filtered.visa.trend[0];
            const last = filtered.visa.trend[filtered.visa.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.visa.summary = {
                ...filtered.visa.summary,
                change: parseFloat(change),
                rangeLabel: rangeLabel
            };
            filtered.visa.insight = `在留留学生${last.value}万，较${first.year}年${change >= 0 ? '增长' : '下降'}${Math.abs(change)}%`;
        } else if (filtered.visa.trend.length === 1) {
            const item = filtered.visa.trend[0];
            filtered.visa.summary = { ...filtered.visa.summary, change: 0, rangeLabel: rangeLabel };
            filtered.visa.insight = `在留留学生${item.value}万`;
        }

        // CPI数据动态摘要
        if (filtered.cpi.trend.length >= 2) {
            const first = filtered.cpi.trend[0];
            const last = filtered.cpi.trend[filtered.cpi.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.cpi.summary = {
                ...filtered.cpi.summary,
                change: parseFloat(change),
                rangeLabel: rangeLabel
            };
            filtered.cpi.insight = `${last.month} CPI ${last.value}，较${first.month}上涨${Math.abs(change)}%`;
        } else if (filtered.cpi.trend.length === 1) {
            const item = filtered.cpi.trend[0];
            filtered.cpi.summary = { ...filtered.cpi.summary, change: 0, rangeLabel: rangeLabel };
            filtered.cpi.insight = `${item.month} CPI ${item.value}`;
        }

        // 就业数据动态摘要
        if (filtered.jobs.trend.length >= 2) {
            const first = filtered.jobs.trend[0];
            const last = filtered.jobs.trend[filtered.jobs.trend.length - 1];
            const change = (last.value - first.value).toFixed(2);
            const changePercent = calculateChange(first.value, last.value);
            filtered.jobs.summary = {
                ...filtered.jobs.summary,
                change: parseFloat(changePercent),
                rangeLabel: rangeLabel
            };
            if (Math.abs(change) < 0.05) {
                filtered.jobs.insight = `求人倍率${last.value}倍，保持平稳`;
            } else {
                filtered.jobs.insight = `求人倍率${last.value}倍，较${first.month}${change >= 0 ? '上升' : '下降'}${Math.abs(change)}`;
            }
        } else if (filtered.jobs.trend.length === 1) {
            const item = filtered.jobs.trend[0];
            filtered.jobs.summary = { ...filtered.jobs.summary, change: 0, rangeLabel: rangeLabel };
            filtered.jobs.insight = `求人倍率${item.value}倍`;
        }

        return filtered;
    }

    /**
     * 根据时间范围过滤数据并计算动态摘要（支持外部传入数据）
     * @param {string} range - '12m' (近12个月), '5y' (近5年), 'all' (全部历史)
     * @param {object} sourceData - 外部传入的数据对象
     * @returns {object} 过滤后的数据副本，包含动态计算的摘要和洞察
     */
    function filterDataByTimeRangeWithData(range, sourceData) {
        // 深拷贝数据
        const filtered = JSON.parse(JSON.stringify(sourceData));

        // 获取数据集中的最新时间点作为基准
        const latestStudentYear = Math.max(...sourceData.students.trend.map(d => d.year));
        const latestVisaYear = Math.max(...sourceData.visa.trend.map(d => d.year));

        // 获取月度数据的最新月份
        const getLatestMonth = (trend) => {
            if (!trend || trend.length === 0) return new Date();
            const dates = trend.map(d => {
                const [year, month] = d.month.split('-').map(Number);
                return new Date(year, month - 1);
            });
            return new Date(Math.max(...dates));
        };
        const latestCPIDate = getLatestMonth(sourceData.cpi.trend);
        const latestJobsDate = getLatestMonth(sourceData.jobs.trend);

        // 根据时间范围过滤
        if (range === '12m') {
            const cutoffYearStudents = latestStudentYear - 1;
            const cutoffYearVisa = latestVisaYear - 1;

            filtered.students.trend = sourceData.students.trend.filter(d => d.year >= cutoffYearStudents);
            filtered.visa.trend = sourceData.visa.trend.filter(d => d.year >= cutoffYearVisa);

            const cutoffCPIDate = new Date(latestCPIDate);
            cutoffCPIDate.setMonth(cutoffCPIDate.getMonth() - 12);
            const cutoffJobsDate = new Date(latestJobsDate);
            cutoffJobsDate.setMonth(cutoffJobsDate.getMonth() - 12);

            filtered.cpi.trend = sourceData.cpi.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffCPIDate;
            });
            filtered.jobs.trend = sourceData.jobs.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffJobsDate;
            });

        } else if (range === '5y') {
            const cutoffYearStudents = latestStudentYear - 4;
            const cutoffYearVisa = latestVisaYear - 4;

            filtered.students.trend = sourceData.students.trend.filter(d => d.year >= cutoffYearStudents);
            filtered.visa.trend = sourceData.visa.trend.filter(d => d.year >= cutoffYearVisa);

            const cutoffCPIDate = new Date(latestCPIDate);
            cutoffCPIDate.setFullYear(cutoffCPIDate.getFullYear() - 5);
            const cutoffJobsDate = new Date(latestJobsDate);
            cutoffJobsDate.setFullYear(cutoffJobsDate.getFullYear() - 5);

            filtered.cpi.trend = sourceData.cpi.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffCPIDate;
            });
            filtered.jobs.trend = sourceData.jobs.trend.filter(d => {
                const [year, month] = d.month.split('-').map(Number);
                const date = new Date(year, month - 1);
                return date >= cutoffJobsDate;
            });
        }

        // 动态计算摘要和洞察
        const rangeLabel = getRangeLabel(range);

        // 复制 source 字段
        filtered.students.source = sourceData.students.source;
        filtered.visa.source = sourceData.visa.source;
        filtered.cpi.source = sourceData.cpi.source;
        filtered.jobs.source = sourceData.jobs.source;

        // 学生数据动态摘要
        if (filtered.students.trend.length >= 2) {
            const first = filtered.students.trend[0];
            const last = filtered.students.trend[filtered.students.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.students.summary = { ...filtered.students.summary, change: parseFloat(change), rangeLabel };
            filtered.students.insight = `${last.year}年${last.value}万人，较${first.year}年${change >= 0 ? '增长' : '下降'}${Math.abs(change)}%`;
        } else if (filtered.students.trend.length === 1) {
            const item = filtered.students.trend[0];
            filtered.students.summary = { ...filtered.students.summary, change: 0, rangeLabel };
            filtered.students.insight = `${item.year}年${item.value}万人`;
        }

        // 签证数据动态摘要
        if (filtered.visa.trend.length >= 2) {
            const first = filtered.visa.trend[0];
            const last = filtered.visa.trend[filtered.visa.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.visa.summary = { ...filtered.visa.summary, change: parseFloat(change), rangeLabel };
            filtered.visa.insight = `在留留学生${last.value}万，较${first.year}年${change >= 0 ? '增长' : '下降'}${Math.abs(change)}%`;
        } else if (filtered.visa.trend.length === 1) {
            const item = filtered.visa.trend[0];
            filtered.visa.summary = { ...filtered.visa.summary, change: 0, rangeLabel };
            filtered.visa.insight = `在留留学生${item.value}万`;
        }

        // CPI数据动态摘要
        if (filtered.cpi.trend.length >= 2) {
            const first = filtered.cpi.trend[0];
            const last = filtered.cpi.trend[filtered.cpi.trend.length - 1];
            const change = calculateChange(first.value, last.value);
            filtered.cpi.summary = { ...filtered.cpi.summary, change: parseFloat(change), rangeLabel };
            filtered.cpi.insight = `${last.month} CPI ${last.value}，较${first.month}上涨${Math.abs(change)}%`;
        } else if (filtered.cpi.trend.length === 1) {
            const item = filtered.cpi.trend[0];
            filtered.cpi.summary = { ...filtered.cpi.summary, change: 0, rangeLabel };
            filtered.cpi.insight = `${item.month} CPI ${item.value}`;
        }

        // 就业数据动态摘要
        if (filtered.jobs.trend.length >= 2) {
            const first = filtered.jobs.trend[0];
            const last = filtered.jobs.trend[filtered.jobs.trend.length - 1];
            const change = (last.value - first.value).toFixed(2);
            const changePercent = calculateChange(first.value, last.value);
            filtered.jobs.summary = { ...filtered.jobs.summary, change: parseFloat(changePercent), rangeLabel };
            if (Math.abs(change) < 0.05) {
                filtered.jobs.insight = `求人倍率${last.value}倍，保持平稳`;
            } else {
                filtered.jobs.insight = `求人倍率${last.value}倍，较${first.month}${change >= 0 ? '上升' : '下降'}${Math.abs(change)}`;
            }
        } else if (filtered.jobs.trend.length === 1) {
            const item = filtered.jobs.trend[0];
            filtered.jobs.summary = { ...filtered.jobs.summary, change: 0, rangeLabel };
            filtered.jobs.insight = `求人倍率${item.value}倍`;
        }

        return filtered;
    }

    /**
     * 初始化
     */
    function init() {
        console.log('Dashboard initializing...');

        // 初始化时间范围选择器
        initTimeRangeSelector();

        // 初始化导航
        initNavigation();

        // 初始化移动端菜单
        initMobileMenu();

        // 加载数据并渲染
        loadAndRenderAll();

        // 初始化城市对比
        initCityComparison();

        // 更新时间戳
        updateTimestamp();
    }

    /**
     * 时间范围选择器
     */
    function initTimeRangeSelector() {
        const buttons = document.querySelectorAll('.time-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                currentTimeRange = this.dataset.range;
                loadAndRenderAll();
            });
        });
    }

    /**
     * 导航高亮
     */
    function initNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    /**
     * 移动端菜单
     */
    function initMobileMenu() {
        const toggle = document.getElementById('navbarToggle');
        const nav = document.getElementById('navbarNav');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    /**
     * 从 API 获取时序数据并转换格式
     */
    async function fetchAPIData() {
        try {
            // 根据时间范围确定请求的年份数
            const yearsMap = { '12m': 2, '5y': 5, 'all': 15 };
            const years = yearsMap[currentTimeRange] || 5;

            // 并行请求多个指标的时序数据
            const [studentsRes, cpiRes, jobsRes] = await Promise.all([
                TrendAPI.getIndicatorSeries('students_total', years),
                TrendAPI.getIndicatorSeries('cpi_total', years),
                TrendAPI.getIndicatorSeries('job_ratio', years)
            ]);

            const apiData = {};

            // 转换学生数据格式
            if (studentsRes.success && studentsRes.data?.series) {
                apiData.students = {
                    summary: OFFICIAL_DATA.students.summary,
                    trend: studentsRes.data.series.map(d => ({
                        year: parseInt(d.time_period),
                        value: d.value
                    })),
                    insight: OFFICIAL_DATA.students.insight,
                    byNationality: OFFICIAL_DATA.students.byNationality,
                    bySchoolType: OFFICIAL_DATA.students.bySchoolType,
                    source: 'JASSO'
                };
            }

            // 转换 CPI 数据格式
            if (cpiRes.success && cpiRes.data?.series) {
                apiData.cpi = {
                    summary: OFFICIAL_DATA.cpi.summary,
                    trend: cpiRes.data.series.map(d => ({
                        month: d.time_period,
                        value: d.value
                    })),
                    insight: OFFICIAL_DATA.cpi.insight,
                    coreCPI: OFFICIAL_DATA.cpi.coreCPI,
                    source: '総務省統計局'
                };
            }

            // 转换就业数据格式
            if (jobsRes.success && jobsRes.data?.series) {
                apiData.jobs = {
                    summary: OFFICIAL_DATA.jobs.summary,
                    trend: jobsRes.data.series.map(d => ({
                        month: d.time_period,
                        value: d.value
                    })),
                    insight: OFFICIAL_DATA.jobs.insight,
                    byPrefecture: OFFICIAL_DATA.jobs.byPrefecture,
                    source: '厚生労働省'
                };
            }

            console.log('API data loaded successfully');
            return apiData;
        } catch (error) {
            console.warn('Failed to fetch API data, using static data:', error);
            return null;
        }
    }

    /**
     * 加载所有数据并渲染
     */
    async function loadAndRenderAll() {
        try {
            // 优先尝试从 API 获取数据
            const apiData = await fetchAPIData();

            // 合并 API 数据和静态数据，API 数据优先
            const mergedData = {
                students: apiData?.students || OFFICIAL_DATA.students,
                visa: OFFICIAL_DATA.visa,  // 签证数据暂无 API，使用静态数据
                cpi: apiData?.cpi || OFFICIAL_DATA.cpi,
                jobs: apiData?.jobs || OFFICIAL_DATA.jobs
            };

            // 添加数据来源标识
            mergedData.students.source = mergedData.students.source || 'JASSO';
            mergedData.visa.source = '出入国在留管理庁';
            mergedData.cpi.source = mergedData.cpi.source || '総務省統計局';
            mergedData.jobs.source = mergedData.jobs.source || '厚生労働省';

            // 根据时间范围过滤数据（使用合并后的数据）
            const filteredData = filterDataByTimeRangeWithData(currentTimeRange, mergedData);

            const students = filteredData.students;
            const visa = filteredData.visa;
            const cpi = filteredData.cpi;
            const jobs = filteredData.jobs;

            // 渲染核心指标卡片
            renderMetricCard('students', students);
            renderMetricCard('visa', visa);
            renderMetricCard('cpi', cpi);
            renderMetricCard('jobs', jobs);

            // 渲染宏观经济指标
            await renderMacroIndicators();

            // 渲染详细图表
            renderStudentsCharts(students);
            renderVisaCharts(visa);
            renderLivingCharts(cpi);
            renderJobsCharts(jobs);

        } catch (error) {
            console.error('Failed to load data:', error);
            showError('数据加载失败，请稍后重试');
        }
    }

    /**
     * 渲染宏观经济指标
     */
    async function renderMacroIndicators() {
        try {
            // 从 API 获取宏观数据
            const result = await TrendAPI.getDashboardOverview();

            if (result.success && result.data?.indicators) {
                const indicators = result.data.indicators;

                // GDP 增长率
                const gdpEl = document.getElementById('gdpValue');
                if (gdpEl) {
                    // 使用静态数据（API暂未包含GDP）
                    gdpEl.textContent = '+0.3';
                }

                // 日本总人口
                const popEl = document.getElementById('populationValue');
                if (popEl) {
                    popEl.textContent = '12,378';
                }

                // 外国人住民
                const foreignEl = document.getElementById('foreignResidentsValue');
                if (foreignEl) {
                    foreignEl.textContent = '341';
                }

                // 失业率
                const unemployEl = document.getElementById('unemploymentValue');
                if (unemployEl && indicators.unemployment_rate) {
                    unemployEl.textContent = indicators.unemployment_rate.value;
                } else if (unemployEl) {
                    unemployEl.textContent = '2.5';
                }
            }
        } catch (error) {
            console.error('Failed to load macro indicators:', error);

            // 使用静态数据作为后备
            const gdpEl = document.getElementById('gdpValue');
            const popEl = document.getElementById('populationValue');
            const foreignEl = document.getElementById('foreignResidentsValue');
            const unemployEl = document.getElementById('unemploymentValue');

            if (gdpEl) gdpEl.textContent = '+0.3';
            if (popEl) popEl.textContent = '12,378';
            if (foreignEl) foreignEl.textContent = '341';
            if (unemployEl) unemployEl.textContent = '2.5';
        }
    }

    /**
     * 渲染指标卡片
     */
    function renderMetricCard(type, data) {
        const valueEl = document.getElementById(`${type}Value`);
        const changeEl = document.getElementById(`${type}Change`);
        const insightEl = document.getElementById(`${type}Insight`);
        const chartEl = document.getElementById(`chart${capitalize(type)}Mini`);

        if (!valueEl || !data.summary) return;

        // 更新数值（始终显示最新值）
        if (type === 'students' || type === 'visa') {
            valueEl.textContent = data.summary.total || '--';
        } else if (type === 'cpi') {
            valueEl.textContent = data.summary.current || '--';
        } else if (type === 'jobs') {
            valueEl.textContent = data.summary.ratio || '--';
        }

        // 更新变化率（优先使用动态计算的 change，否则使用原有的 yoyChange）
        if (changeEl) {
            const change = data.summary.change !== undefined
                ? data.summary.change
                : (data.summary.yoyChange || data.summary.yoyChangePercent || 0);
            const isPositive = change >= 0;
            const rangeLabel = data.summary.rangeLabel || '同比';

            changeEl.className = `metric-change ${isPositive ? 'positive' : (change < 0 ? 'negative' : 'neutral')}`;
            changeEl.querySelector('.arrow').textContent = isPositive ? '↑' : (change < 0 ? '↓' : '→');
            changeEl.querySelector('.percent').textContent = `${Math.abs(change)}%`;
            changeEl.querySelector('.period').textContent = rangeLabel;
        }

        // 更新洞察
        if (insightEl) {
            insightEl.textContent = data.insight || '';
        }

        // 渲染迷你图表
        if (chartEl && data.trend) {
            renderMiniChart(chartEl, data.trend, type);
        }
    }

    /**
     * 渲染迷你图表
     */
    function renderMiniChart(container, trendData, type) {
        const chartKey = `mini_${type}`;

        if (charts[chartKey]) {
            charts[chartKey].dispose();
        }

        const chart = echarts.init(container);
        charts[chartKey] = chart;

        const xData = trendData.map(d => d.year || d.month);
        const yData = trendData.map(d => d.value);

        const color = {
            students: '#4ecdc4',
            visa: '#45b7d1',
            cpi: '#f39c12',
            jobs: '#9b59b6'
        }[type] || '#4ecdc4';

        chart.setOption({
            grid: {
                left: 0, right: 0, top: 5, bottom: 5
            },
            xAxis: {
                type: 'category',
                data: xData,
                show: false
            },
            yAxis: {
                type: 'value',
                show: false,
                min: 'dataMin',
                max: 'dataMax'
            },
            series: [{
                type: 'line',
                data: yData,
                smooth: true,
                symbol: 'none',
                lineStyle: { color, width: 2 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: color + '40' },
                            { offset: 1, color: color + '00' }
                        ]
                    }
                }
            }]
        });
    }

    /**
     * 渲染留学生详细图表
     */
    function renderStudentsCharts(data) {
        // 年度趋势图
        renderChart('chartStudentsTrend', {
            title: { text: '', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: data.trend.map(d => d.year),
                axisLabel: { color: '#8b949e' },
                axisLine: { lineStyle: { color: '#30363d' } }
            },
            yAxis: {
                type: 'value',
                name: '万人',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [{
                type: 'bar',
                data: data.trend.map(d => d.value),
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#4ecdc4' },
                            { offset: 1, color: '#44a08d' }
                        ]
                    },
                    borderRadius: [4, 4, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#f0f6fc',
                    formatter: '{c}万'
                }
            }]
        });

        // 国籍分布（2024年JASSO官方数据）
        renderChart('chartStudentsNationality', {
            tooltip: { trigger: 'item', formatter: '{b}: {c}万人 ({d}%)' },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 'center',
                textStyle: { color: '#8b949e' }
            },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['35%', '50%'],
                data: OFFICIAL_DATA.students.byNationality.map(d => ({ value: d.value, name: d.name })),
                label: { show: false },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        });

        // 学科分布（模拟数据）
        renderChart('chartStudentsField', {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { textStyle: { color: '#8b949e' }, top: 0 },
            grid: { left: 60, right: 20, bottom: 30, top: 40 },
            xAxis: {
                type: 'category',
                data: ['2020', '2021', '2022', '2023', '2024'],
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [
                { name: '人文科学', type: 'bar', stack: 'total', data: [30, 32, 31, 33, 35] },
                { name: '社会科学', type: 'bar', stack: 'total', data: [25, 24, 26, 27, 28] },
                { name: '工学', type: 'bar', stack: 'total', data: [20, 22, 23, 24, 25] },
                { name: '艺术', type: 'bar', stack: 'total', data: [15, 16, 17, 18, 20] },
                { name: '其他', type: 'bar', stack: 'total', data: [10, 9, 8, 8, 9] }
            ]
        });

        // 学校类型分布（2024年JASSO官方数据）
        renderChart('chartStudentsSchool', {
            tooltip: { trigger: 'item', formatter: '{b}: {c}万人 ({d}%)' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: OFFICIAL_DATA.students.bySchoolType.map(d => ({ value: d.value, name: d.name })),
                label: {
                    color: '#f0f6fc',
                    formatter: '{b}: {d}%'
                }
            }]
        });
    }

    /**
     * 渲染签证详细图表
     */
    function renderVisaCharts(data) {
        renderChart('chartVisaTrend', {
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: data.trend.map(d => d.year),
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '万人',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [{
                type: 'line',
                data: data.trend.map(d => d.value),
                smooth: true,
                lineStyle: { color: '#45b7d1', width: 3 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(69,183,209,0.4)' },
                            { offset: 1, color: 'rgba(69,183,209,0)' }
                        ]
                    }
                },
                symbol: 'circle',
                symbolSize: 8

            }]
        });

        // 都道府县分布
        renderChart('chartVisaPrefecture', {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 80, right: 20, bottom: 30, top: 10 },
            xAxis: {
                type: 'value',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            yAxis: {
                type: 'category',
                data: ['東京都', '大阪府', '福岡県', '愛知県', '京都府', '埼玉県', '千葉県', '兵庫県'],
                axisLabel: { color: '#8b949e' }
            },
            series: [{
                type: 'bar',
                data: [12.5, 4.2, 2.8, 2.5, 2.2, 1.8, 1.6, 1.4],
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 1, y2: 0,
                        colorStops: [
                            { offset: 0, color: '#45b7d1' },
                            { offset: 1, color: '#96e6a1' }
                        ]
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    color: '#f0f6fc',
                    formatter: '{c}万'
                }
            }]
        });

        // 国籍分布
        renderChart('chartVisaNationality', {
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['35%', '65%'],
                data: [
                    { value: 40, name: '中国' },
                    { value: 18, name: '越南' },
                    { value: 10, name: '尼泊尔' },
                    { value: 8, name: '韩国' },
                    { value: 6, name: '缅甸' },
                    { value: 18, name: '其他' }
                ],
                label: { color: '#f0f6fc' }
            }]
        });
    }

    /**
     * 渲染生活成本图表
     */
    function renderLivingCharts(data) {
        renderChart('chartCPITrend', {
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#8b949e' }, top: 0 },
            xAxis: {
                type: 'category',
                data: data.trend.map(d => d.month),
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '指数',
                min: 100,
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [{
                name: 'CPI总指数',
                type: 'line',
                data: data.trend.map(d => d.value),
                lineStyle: { color: '#f39c12', width: 3 },
                symbol: 'circle',
                symbolSize: 6
            }]
        });

        // 城市租金对比
        renderChart('chartRentCompare', {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: 80, right: 20, bottom: 30, top: 10 },
            xAxis: {
                type: 'value',
                name: '万日元/月',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            yAxis: {
                type: 'category',
                data: ['東京23区', '大阪市', '名古屋市', '福岡市', '京都市', '札幌市'],
                axisLabel: { color: '#8b949e' }
            },
            series: [{
                type: 'bar',
                data: [8.5, 5.8, 5.2, 4.8, 5.5, 4.2],
                itemStyle: {
                    color: '#e74c3c',
                    borderRadius: [0, 4, 4, 0]
                },
                label: {
                    show: true,
                    position: 'right',
                    color: '#f0f6fc',
                    formatter: '{c}万'
                }
            }]
        });

        // 生活篮子
        renderChart('chartLivingBasket', {
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#8b949e' }, top: 0 },
            xAxis: {
                type: 'category',
                data: ['2020', '2021', '2022', '2023', '2024'],
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '指数',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [
                { name: '食品', type: 'line', data: [100, 101, 104, 108, 110] },
                { name: '交通', type: 'line', data: [100, 99, 101, 103, 104] },
                { name: '通信', type: 'line', data: [100, 97, 95, 93, 92] },
                { name: '住居', type: 'line', data: [100, 100, 101, 102, 103] }
            ]
        });
    }

    /**
     * 渲染就业图表
     */
    function renderJobsCharts(data) {
        renderChart('chartJobsTrend', {
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: data.trend.map(d => d.month),
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '倍',
                min: 1,
                max: 1.5,
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [{
                type: 'line',
                data: data.trend.map(d => d.value),
                lineStyle: { color: '#9b59b6', width: 3 },
                markLine: {
                    data: [{ yAxis: 1.0, name: '供需平衡线' }],
                    lineStyle: { color: '#e74c3c', type: 'dashed' },
                    label: { color: '#e74c3c' }
                }
            }]
        });

        // 就业失业
        renderChart('chartEmployment', {
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#8b949e' }, top: 0 },
            xAxis: {
                type: 'category',
                data: ['2020', '2021', '2022', '2023', '2024'],
                axisLabel: { color: '#8b949e' }
            },
            yAxis: [
                { type: 'value', name: '就业率%', min: 55, max: 65, axisLabel: { color: '#8b949e' } },
                { type: 'value', name: '失业率%', min: 2, max: 4, axisLabel: { color: '#8b949e' } }
            ],
            series: [
                { name: '就业率', type: 'bar', data: [60.2, 58.5, 59.8, 60.5, 61.2] },
                { name: '失业率', type: 'line', yAxisIndex: 1, data: [2.8, 3.0, 2.6, 2.5, 2.4] }
            ]
        });

        // 工资趋势
        renderChart('chartWages', {
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#8b949e' }, top: 0 },
            xAxis: {
                type: 'category',
                data: ['2020', '2021', '2022', '2023', '2024'],
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '指数',
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [
                { name: '名目工资', type: 'line', data: [100, 100.5, 101.2, 102.8, 104.5], lineStyle: { width: 3 } },
                { name: '实际工资', type: 'line', data: [100, 99.8, 98.5, 97.2, 96.8], lineStyle: { width: 3, type: 'dashed' } }
            ]
        });
    }

    /**
     * 城市对比功能
     */
    function initCityComparison() {
        const runBtn = document.getElementById('runCompare');
        const shareBtn = document.getElementById('shareLink');
        const exportBtn = document.getElementById('exportImage');

        if (runBtn) {
            runBtn.addEventListener('click', runCityComparison);
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', generateShareLink);
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', exportAsImage);
        }
    }

    /**
     * 执行城市对比
     */
    async function runCityComparison() {
        const checkboxes = document.querySelectorAll('.city-option input:checked');
        const cities = Array.from(checkboxes).map(cb => cb.value);

        if (cities.length < 2) {
            alert('请至少选择2个城市');
            return;
        }

        if (cities.length > 4) {
            alert('最多选择4个城市');
            return;
        }

        // 模拟对比数据渲染
        renderComparisonCharts(cities);
    }

    /**
     * 渲染对比图表
     */
    function renderComparisonCharts(cities) {
        const cityNames = {
            tokyo: '東京都',
            osaka: '大阪府',
            kyoto: '京都府',
            fukuoka: '福岡県',
            aichi: '愛知県',
            hyogo: '兵庫県',
            chiba: '千葉県',
            saitama: '埼玉県'
        };

        const labels = cities.map(c => cityNames[c]);

        // 租金对比
        renderChart('chartCompareRent', {
            xAxis: { type: 'category', data: labels, axisLabel: { color: '#8b949e' } },
            yAxis: { type: 'value', name: '万日元', axisLabel: { color: '#8b949e' } },
            series: [{ type: 'bar', data: cities.map(() => (Math.random() * 5 + 4).toFixed(1)) }]
        });

        // CPI对比
        renderChart('chartCompareCPI', {
            xAxis: { type: 'category', data: labels, axisLabel: { color: '#8b949e' } },
            yAxis: { type: 'value', name: '指数', min: 100, axisLabel: { color: '#8b949e' } },
            series: [{ type: 'bar', data: cities.map(() => (Math.random() * 5 + 103).toFixed(1)) }]
        });

        // 求人倍率对比
        renderChart('chartCompareJobs', {
            xAxis: { type: 'category', data: labels, axisLabel: { color: '#8b949e' } },
            yAxis: { type: 'value', name: '倍', min: 1, axisLabel: { color: '#8b949e' } },
            series: [{ type: 'bar', data: cities.map(() => (Math.random() * 0.5 + 1).toFixed(2)) }]
        });

        // 留学生对比
        renderChart('chartCompareStudents', {
            xAxis: { type: 'category', data: labels, axisLabel: { color: '#8b949e' } },
            yAxis: { type: 'value', name: '万人', axisLabel: { color: '#8b949e' } },
            series: [{ type: 'bar', data: cities.map(() => (Math.random() * 10 + 1).toFixed(1)) }]
        });
    }

    /**
     * 生成分享链接
     */
    function generateShareLink() {
        const checkboxes = document.querySelectorAll('.city-option input:checked');
        const cities = Array.from(checkboxes).map(cb => cb.value);

        const url = new URL(window.location.href);
        url.searchParams.set('compare', cities.join(','));

        navigator.clipboard.writeText(url.toString()).then(() => {
            alert('分享链接已复制到剪贴板！');
        });
    }

    /**
     * 导出为图片
     */
    function exportAsImage() {
        alert('导出功能开发中...');
        // TODO: 使用 html2canvas 实现
    }

    /**
     * 通用图表渲染
     */
    function renderChart(containerId, option) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (charts[containerId]) {
            charts[containerId].dispose();
        }

        const chart = echarts.init(container);
        charts[containerId] = chart;

        // 应用通用暗色主题配置
        const darkOption = {
            backgroundColor: 'transparent',
            textStyle: { color: '#f0f6fc' },
            ...option
        };

        chart.setOption(darkOption);
    }

    /**
     * 更新同步状态
     */
    async function updateTimestamp() {
        const statusEl = document.getElementById('syncStatus');
        const lastUpdateEl = document.getElementById('lastUpdate');
        const nextUpdateEl = document.getElementById('nextUpdate');
        const syncTextEl = statusEl?.querySelector('.sync-text');

        if (!statusEl) return;

        try {
            // 从 API 获取同步状态
            const result = await TrendAPI.getSyncStatus();

            if (result.success && result.data) {
                const { lastSyncTime, nextSyncTime, lastSyncLog } = result.data;

                // 更新最后同步时间
                if (lastSyncTime && lastUpdateEl) {
                    const date = new Date(lastSyncTime);
                    lastUpdateEl.textContent = date.toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }

                // 更新下次同步时间
                if (nextSyncTime && nextUpdateEl) {
                    const nextDate = new Date(nextSyncTime);
                    nextUpdateEl.textContent = nextDate.toLocaleString('zh-CN', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }

                // 更新同步状态
                if (lastSyncLog) {
                    if (lastSyncLog.status === 'success') {
                        statusEl.className = 'sync-status success';
                        syncTextEl.textContent = '数据正常';
                    } else if (lastSyncLog.status === 'partial') {
                        statusEl.className = 'sync-status warning';
                        syncTextEl.textContent = '部分更新';
                    } else {
                        statusEl.className = 'sync-status error';
                        syncTextEl.textContent = '同步失败';
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch sync status:', error);
            statusEl.className = 'sync-status warning';
            syncTextEl.textContent = '离线模式';
        }
    }

    /**
     * 显示错误
     */
    function showError(message) {
        console.error(message);
        // TODO: 显示用户友好的错误提示
    }

    /**
     * 首字母大写
     */
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * 响应式处理
     */
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    });

    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
})();

/**
 * 留学趋势看板 - Dashboard 主逻辑
 */

(function () {
    'use strict';

    // 当前时间范围
    let currentTimeRange = '5y';

    // 图表实例存储
    const charts = {};

    // 模拟数据（在 API 未就绪时使用）
    const MOCK_DATA = {
        students: {
            summary: { total: 12.3, yoyChange: 6.9, yoyChangePercent: 6.9 },
            trend: [
                { year: 2019, value: 12.35 },
                { year: 2020, value: 13.1 },
                { year: 2021, value: 12.7 },
                { year: 2022, value: 12.1 },
                { year: 2023, value: 12.2 },
                { year: 2024, value: 12.9 }
            ],
            insight: '2024年12.3万人，同比+6.9%，恢复增长态势'
        },
        visa: {
            summary: { total: 32.3, yoyChange: 8.2 },
            trend: [
                { year: 2019, value: 31.2 },
                { year: 2020, value: 28.0 },
                { year: 2021, value: 24.5 },
                { year: 2022, value: 26.8 },
                { year: 2023, value: 29.8 },
                { year: 2024, value: 32.3 }
            ],
            insight: '在留留学生32.3万，创历史新高'
        },
        cpi: {
            summary: { current: 106.2, momChange: 0.2, yoyChange: 2.5 },
            trend: [
                { month: '2024-06', value: 105.2 },
                { month: '2024-07', value: 105.5 },
                { month: '2024-08', value: 105.8 },
                { month: '2024-09', value: 106.0 },
                { month: '2024-10', value: 106.1 },
                { month: '2024-11', value: 106.2 }
            ],
            insight: '11月CPI 106.2，通胀趋势放缓'
        },
        jobs: {
            summary: { ratio: 1.25, trend: 'stable' },
            trend: [
                { month: '2024-06', value: 1.26 },
                { month: '2024-07', value: 1.25 },
                { month: '2024-08', value: 1.25 },
                { month: '2024-09', value: 1.24 },
                { month: '2024-10', value: 1.25 },
                { month: '2024-11', value: 1.25 }
            ],
            insight: '求人倍率1.25，就业市场温和平稳'
        }
    };

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
     * 加载所有数据并渲染
     */
    async function loadAndRenderAll() {
        try {
            // 尝试从 API 加载数据
            // const [students, visa, cpi, jobs] = await Promise.all([
            //     TrendAPI.getStudentsData(currentTimeRange),
            //     TrendAPI.getVisaData(currentTimeRange),
            //     TrendAPI.getCPIData(currentTimeRange),
            //     TrendAPI.getJobsData(currentTimeRange)
            // ]);

            // 暂时使用模拟数据
            const students = MOCK_DATA.students;
            const visa = MOCK_DATA.visa;
            const cpi = MOCK_DATA.cpi;
            const jobs = MOCK_DATA.jobs;

            // 渲染核心指标卡片
            renderMetricCard('students', students);
            renderMetricCard('visa', visa);
            renderMetricCard('cpi', cpi);
            renderMetricCard('jobs', jobs);

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
     * 渲染指标卡片
     */
    function renderMetricCard(type, data) {
        const valueEl = document.getElementById(`${type}Value`);
        const changeEl = document.getElementById(`${type}Change`);
        const insightEl = document.getElementById(`${type}Insight`);
        const chartEl = document.getElementById(`chart${capitalize(type)}Mini`);

        if (!valueEl || !data.summary) return;

        // 更新数值
        if (type === 'students' || type === 'visa') {
            valueEl.textContent = data.summary.total || '--';
        } else if (type === 'cpi') {
            valueEl.textContent = data.summary.current || '--';
        } else if (type === 'jobs') {
            valueEl.textContent = data.summary.ratio || '--';
        }

        // 更新变化
        if (changeEl) {
            const change = data.summary.yoyChange || data.summary.yoyChangePercent || 0;
            const isPositive = change >= 0;

            changeEl.className = `metric-change ${isPositive ? 'positive' : 'negative'}`;
            changeEl.querySelector('.arrow').textContent = isPositive ? '↑' : '↓';
            changeEl.querySelector('.percent').textContent = `${Math.abs(change)}%`;
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

        // 国籍分布（模拟数据）
        renderChart('chartStudentsNationality', {
            tooltip: { trigger: 'item' },
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
                data: [
                    { value: 45, name: '中国' },
                    { value: 20, name: '越南' },
                    { value: 12, name: '尼泊尔' },
                    { value: 8, name: '韩国' },
                    { value: 5, name: '印度尼西亚' },
                    { value: 10, name: '其他' }
                ],
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

        // 学校类型（模拟数据）
        renderChart('chartStudentsSchool', {
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: '60%',
                data: [
                    { value: 40, name: '大学' },
                    { value: 25, name: '专门学校' },
                    { value: 20, name: '日语学校' },
                    { value: 10, name: '大学院' },
                    { value: 5, name: '短期大学' }
                ],
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
     * 更新时间戳
     */
    function updateTimestamp() {
        const el = document.getElementById('lastUpdate');
        if (el) {
            el.textContent = new Date().toLocaleString('zh-CN');
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

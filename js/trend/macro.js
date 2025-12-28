/**
 * 留学趋势看板 - 中日宏观对比模块
 * js/trend/macro.js
 */

(function () {
    // ECharts 实例管理
    const charts = {};

    /**
     * 初始化
     */
    function init() {
        console.log('Initializing Macro Comparison Module...');
        initMacroComparison();

        // 响应式处理
        window.addEventListener('resize', () => {
            Object.values(charts).forEach(chart => {
                if (chart && chart.resize) {
                    chart.resize();
                }
            });
        });
    }

    /**
     * 初始化中日宏观对比数据
     */
    async function initMacroComparison() {
        // 定义指标配置
        const indicators = [
            { id: 'gdp_growth', element: 'chartMacroGDP', title: 'GDP增长率 (%)', colorCn: '#e74c3c', colorJp: '#3498db' },
            { id: 'cpi', element: 'chartMacroCPI', title: 'CPI通胀率 (%)', colorCn: '#f39c12', colorJp: '#2ecc71' },
            { id: 'unemployment', element: 'chartMacroUnemployment', title: '失业率 (%)', colorCn: '#9b59b6', colorJp: '#1abc9c' }
        ];

        // 并行加载所有数据
        await Promise.all(indicators.map(async (ind) => {
            try {
                const response = await TrendAPI.getMacroComparison(ind.id);
                if (response.success && response.data) {
                    renderMacroChart(ind.element, response.data, ind);
                } else {
                    console.warn(`Failed to load macro data for ${ind.id}`);
                }
            } catch (error) {
                console.error(`Error loading ${ind.id}:`, error);
            }
        }));
    }

    /**
     * 渲染宏观对比图表
     */
    function renderMacroChart(containerId, data, config) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (charts[containerId]) {
            charts[containerId].dispose();
        }

        const chart = echarts.init(container);
        charts[containerId] = chart;

        // 提取年份并去重排序
        const years = [...new Set([
            ...data.china.map(d => d.year),
            ...data.japan.map(d => d.year)
        ])].sort((a, b) => a - b);

        // 构建对齐的数据序列
        const getValue = (dataset, year) => {
            const item = dataset.find(d => d.year === year);
            return item ? item.value : null;
        };

        const cnData = years.map(y => getValue(data.china, y));
        const jpData = years.map(y => getValue(data.japan, y));

        chart.setOption({
            backgroundColor: 'transparent',
            textStyle: { color: '#f0f6fc' },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let res = `${params[0].name}<br/>`;
                    params.forEach(param => {
                        const value = param.value !== null ? param.value.toFixed(2) + '%' : '--';
                        res += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${param.color}"></span>${param.seriesName}: ${value}<br/>`;
                    });
                    return res;
                }
            },
            legend: {
                data: ['中国', '日本'],
                textStyle: { color: '#8b949e' },
                top: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: years,
                axisLabel: { color: '#8b949e' },
                axisLine: { lineStyle: { color: '#30363d' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#8b949e', formatter: '{value}%' },
                splitLine: { lineStyle: { color: '#21262d' } }
            },
            series: [
                {
                    name: '中国',
                    type: 'line',
                    data: cnData,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: { width: 3, color: config.colorCn },
                    itemStyle: { color: config.colorCn }
                },
                {
                    name: '日本',
                    type: 'line',
                    data: jpData,
                    smooth: true,
                    showSymbol: false,
                    lineStyle: { width: 3, color: config.colorJp },
                    itemStyle: { color: config.colorJp }
                }
            ]
        });
    }

    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);
})();

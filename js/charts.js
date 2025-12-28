/**
 * 中日留学调研报告 - ECharts图表配置
 * 严格基于调研数据
 */

const ChartConfigs = {
    // 通用主题配置
    theme: {
        backgroundColor: 'transparent',
        textStyle: {
            fontFamily: "'Inter', 'Noto Sans SC', sans-serif",
            color: '#8b949e'
        },
        title: {
            textStyle: {
                color: '#f0f6fc',
                fontWeight: 600
            }
        },
        tooltip: {
            backgroundColor: 'rgba(22, 27, 34, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            textStyle: {
                color: '#f0f6fc'
            }
        },
        legend: {
            textStyle: {
                color: '#8b949e'
            }
        },
        grid: {
            left: 60,
            right: 60,
            top: 60,
            bottom: 60
        }
    },

    // =====================================================
    // 图表1：全体 vs 艺术类双轴对比（2024-2029）
    // =====================================================
    dualAxisComparison: function () {
        return {
            title: {
                text: '全体 vs 艺术类：两条增长曲线的对比（2024-2029）',
                subtext: '艺术类占比从11.8%升至18.6%',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' },
                axisPointer: { type: 'cross' }
            },
            legend: {
                data: ['全体留学生', '艺术类留学生'],
                top: 40,
                textStyle: { color: '#8b949e' }
            },
            xAxis: {
                type: 'category',
                data: ['2024', '2025', '2026', '2027', '2028', '2029'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '全体 (万人)',
                    min: 12,
                    max: 14,
                    axisLine: { lineStyle: { color: '#1e3a5f' } },
                    axisLabel: { color: '#8b949e', formatter: '{value}' },
                    splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
                },
                {
                    type: 'value',
                    name: '艺术类 (千人)',
                    min: 12,
                    max: 26,
                    axisLine: { lineStyle: { color: '#e74c3c' } },
                    axisLabel: { color: '#8b949e', formatter: '{value}' }
                }
            ],
            series: [
                {
                    name: '全体留学生',
                    type: 'line',
                    yAxisIndex: 0,
                    data: [12.35, 13.1, 12.7, 12.1, 12.2, 12.9], // 单位：万人
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#1e3a5f' },
                    lineStyle: { color: '#1e3a5f', width: 2 },
                    label: {
                        show: true,
                        position: 'bottom',
                        formatter: function (params) {
                            if (params.dataIndex === 0) return '11.8%';
                            return '';
                        },
                        color: '#e74c3c',
                        fontSize: 11
                    }
                },
                {
                    name: '艺术类留学生',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [14.572, 16.5, 19, 21, 22.5, 24], // 单位：千人
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 2 },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            if (params.dataIndex === 2) return '15.0%';
                            if (params.dataIndex === 5) return '18.6%';
                            return '';
                        },
                        color: '#e74c3c',
                        fontSize: 11
                    }
                }
            ]
        };
    },

    // =====================================================
    // 图表2：艺术类三情景预测（2024-2029）
    // =====================================================
    artThreeScenarios: function () {
        return {
            title: {
                text: '中国赴日艺术类留学生三情景预测（2024-2029）',
                subtext: '基准情景概率60%，即使悲观情景仍增长37.3%',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                data: ['基准情景 (60%)', '乐观情景 (30%)', '悲观情景 (10%)'],
                top: 40,
                textStyle: { color: '#8b949e' }
            },
            xAxis: {
                type: 'category',
                data: ['2024', '2025', '2026', '2027', '2028', '2029'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '留学生 (千人)',
                min: 10,
                max: 28,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '基准情景 (60%)',
                    type: 'line',
                    data: [14.572, 16.5, 19, 21, 22.5, 24],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#1e3a5f' },
                    lineStyle: { color: '#1e3a5f', width: 3 },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            const labels = {
                                1: '申请占比33.4%',
                                3: '学费上涨\n相对影响小',
                                4: '日本2030\n计划见效',
                                5: '艺术教育成为\n申请主流'
                            };
                            return labels[params.dataIndex] || '';
                        },
                        color: '#8b949e',
                        fontSize: 10
                    }
                },
                {
                    name: '乐观情景 (30%)',
                    type: 'line',
                    data: [14.572, 17, 20, 23, 25, 26.5],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 2, type: 'dashed' }
                },
                {
                    name: '悲观情景 (10%)',
                    type: 'line',
                    data: [14.572, 16, 17.5, 18.5, 19.2, 20],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 2, type: 'dotted' }
                }
            ]
        };
    },

    // =====================================================
    // 图表3：艺术类20年历史（2005-2024）
    // =====================================================
    artHistory20Years: function () {
        return {
            title: {
                text: '中国赴日艺术类留学生持续增长（2005-2024）',
                subtext: '2024年同比增长26.1%，达历史新高',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' },
                formatter: function (params) {
                    const p = params[0];
                    return `${p.name}年<br/>留学生人数: ${p.value}千人`;
                }
            },
            legend: {
                data: ['开放初期萌芽(05-10)', '知名度扩展期(11-15)', '互联网传播期(16-20)', '爆发增长期(21-24)'],
                top: 40,
                textStyle: { color: '#8b949e', fontSize: 10 }
            },
            xAxis: {
                type: 'category',
                name: '年份',
                data: ['2005', '2008', '2011', '2014', '2017', '2020', '2021', '2022', '2024'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '留学生人数 (千人)',
                min: 0,
                max: 16,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '开放初期萌芽(05-10)',
                    type: 'line',
                    data: [3.5, 4.2, null, null, null, null, null, null, null],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#87CEEB' },
                    lineStyle: { color: '#87CEEB', width: 2 }
                },
                {
                    name: '知名度扩展期(11-15)',
                    type: 'line',
                    data: [null, null, 5.0, 5.8, 6.75, null, null, null, null],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#1e3a5f' },
                    lineStyle: { color: '#1e3a5f', width: 2 }
                },
                {
                    name: '互联网传播期(16-20)',
                    type: 'line',
                    data: [null, null, null, null, 6.75, 8.5, null, null, null],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 2 }
                },
                {
                    name: '爆发增长期(21-24)',
                    type: 'line',
                    data: [null, null, null, null, null, null, 10.855, 11, 14.572],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 3 },
                    markPoint: {
                        data: [
                            {
                                coord: ['2024', 14.572],
                                symbol: 'pin',
                                symbolSize: 50,
                                itemStyle: { color: '#d4a84b' },
                                label: {
                                    show: true,
                                    formatter: '+26.1%',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }
                            }
                        ]
                    },
                    markArea: {
                        itemStyle: { color: 'rgba(231, 76, 60, 0.1)' },
                        data: [[{ xAxis: '2020' }, { xAxis: '2022' }]]
                    }
                }
            ],
            graphic: [
                {
                    type: 'text',
                    left: '68%',
                    top: '38%',
                    style: {
                        text: '东艺中国学生\n占比62%（美术）',
                        fill: '#e74c3c',
                        fontSize: 10,
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        padding: [4, 8],
                        borderRadius: 4
                    }
                }
            ]
        };
    },

    // =====================================================
    // 图表4：全体留学生三情景预测（2024-2029）
    // =====================================================
    totalThreeScenarios: function () {
        return {
            title: {
                text: '中国赴日留学生数量预测趋势 (2024-2029)',
                subtext: '政策冲击后逐步恢复，基准情景最可能',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                data: ['基准情景-实线 (60%)', '乐观情景-虚线 (30%)', '悲观预测-点线 (10-15%)'],
                top: 40,
                textStyle: { color: '#8b949e', fontSize: 10 }
            },
            xAxis: {
                type: 'category',
                name: '年份',
                data: ['2024', '2025', '2026', '2027', '2028', '2029'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '人数(万人)',
                min: 10,
                max: 14,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '基准情景-实线 (60%)',
                    type: 'line',
                    data: [12.35, 13.1, 12.7, 12.1, 12.2, 12.9],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#00d4ff' },
                    lineStyle: { color: '#00d4ff', width: 3 },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            const labels = {
                                0: '基准',
                                2: '政策冲击',
                                5: '缓慢反弹'
                            };
                            return labels[params.dataIndex] || '';
                        },
                        color: '#8b949e',
                        fontSize: 10
                    }
                },
                {
                    name: '乐观情景-虚线 (30%)',
                    type: 'line',
                    data: [12.35, 13.1, 13.1, 13.0, 13.1, 13.5],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 2, type: 'dashed' }
                },
                {
                    name: '悲观预测-点线 (10-15%)',
                    type: 'line',
                    data: [12.35, 12.8, 12.0, 11.0, 11.2, 11.5],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 2, type: 'dotted' },
                    label: {
                        show: true,
                        position: 'bottom',
                        formatter: function (params) {
                            if (params.dataIndex === 4) return '底部';
                            return '';
                        },
                        color: '#e74c3c',
                        fontSize: 10
                    }
                }
            ]
        };
    },

    // =====================================================
    // 图表5：全体留学生20年历史（2005-2024）
    // =====================================================
    totalHistory20Years: function () {
        return {
            title: {
                text: '中国赴日留学生疫后恢复（2005-2024）',
                subtext: '2019年峰值12.44万人，疫情低谷10.39万人，2024年恢复至12.35万人',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                data: ['扩大开放初期', '金融危机与复苏', '高速增长期', '疫情冲击期', '疫后恢复期'],
                top: 40,
                textStyle: { color: '#8b949e', fontSize: 10 }
            },
            xAxis: {
                type: 'category',
                name: 'Year',
                data: ['2005', '2007', '2008', '2009', '2011', '2013', '2015', '2017', '2019', '2020', '2021', '2022', '2023', '2024'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '留学生 (万人)',
                min: 0,
                max: 14,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '扩大开放初期',
                    type: 'line',
                    data: [3.2, 4.0, 5.2, null, null, null, null, null, null, null, null, null, null, null],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#87CEEB' },
                    lineStyle: { color: '#87CEEB', width: 2 }
                },
                {
                    name: '金融危机与复苏',
                    type: 'line',
                    data: [null, null, 5.2, 6.0, 8.5, null, null, null, null, null, null, null, null, null],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#1e3a5f' },
                    lineStyle: { color: '#1e3a5f', width: 2 },
                    markPoint: {
                        data: [{ coord: ['2008', 5.2], symbol: 'rect', symbolSize: [60, 20], itemStyle: { color: 'rgba(30, 58, 95, 0.8)' }, label: { show: true, formatter: '北京奥运', color: '#fff', fontSize: 9 } }]
                    }
                },
                {
                    name: '高速增长期',
                    type: 'line',
                    data: [null, null, null, null, null, 9.5, 10.2, 10.4, 12.44, null, null, null, null, null],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 2 },
                    markPoint: {
                        data: [
                            { coord: ['2013', 9.5], symbol: 'rect', symbolSize: [60, 20], itemStyle: { color: 'rgba(45, 143, 78, 0.8)' }, label: { show: true, formatter: '钓鱼岛危机', color: '#fff', fontSize: 9 } },
                            { coord: ['2019', 12.44], symbol: 'rect', symbolSize: [50, 20], itemStyle: { color: 'rgba(45, 143, 78, 0.8)' }, label: { show: true, formatter: '历史峰值', color: '#fff', fontSize: 9 } }
                        ]
                    }
                },
                {
                    name: '疫情冲击期',
                    type: 'line',
                    data: [null, null, null, null, null, null, null, null, 12.44, 11.69, 11.4, null, null, null],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 2 },
                    markPoint: {
                        data: [{ coord: ['2020', 11.69], symbol: 'rect', symbolSize: [50, 20], itemStyle: { color: 'rgba(231, 76, 60, 0.8)' }, label: { show: true, formatter: '疫情开始', color: '#fff', fontSize: 9 } }]
                    }
                },
                {
                    name: '疫后恢复期',
                    type: 'line',
                    data: [null, null, null, null, null, null, null, null, null, null, null, 10.39, 11.55, 12.35],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#f39c12' },
                    lineStyle: { color: '#f39c12', width: 2 },
                    markPoint: {
                        data: [{ coord: ['2024', 12.35], symbol: 'rect', symbolSize: [50, 20], itemStyle: { color: 'rgba(243, 156, 18, 0.8)' }, label: { show: true, formatter: '接近峰值', color: '#fff', fontSize: 9 } }]
                    }
                }
            ]
        };
    },

    // =====================================================
    // 图表6：外交关系指数曲线
    // =====================================================
    diplomacyIndex: function () {
        // 使用 data.js 中的数据
        const diplomacyData = ReportData.diplomacy.chartData;

        return {
            title: {
                text: '中日外交关系指数变化（2024.11-2025.11）',
                subtext: '基于政治稳定度(33%) + 经贸活力(33%) + 民众好感度(34%)',
                left: 'center',
                top: 0,
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            xAxis: {
                type: 'category',
                data: diplomacyData.dates,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e', rotate: 15 }
            },
            yAxis: {
                type: 'value',
                name: '指数',
                min: 0,
                max: 60,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [{
                type: 'line',
                data: diplomacyData.values,
                symbol: 'circle',
                symbolSize: 12,
                itemStyle: {
                    color: function (params) {
                        const colors = ['#2d8f4e', '#2d8f4e', '#e74c3c', '#e74c3c'];
                        return colors[params.dataIndex];
                    }
                },
                lineStyle: { color: '#d4a84b', width: 3 },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(212, 168, 75, 0.3)' },
                            { offset: 1, color: 'rgba(212, 168, 75, 0)' }
                        ]
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                        const labels = ['首脑会谈\n(APEC利马)', '岩屋毅访华\n+5', '高市言论\n-30', '磋商失败\n(历史低点)'];
                        return labels[params.dataIndex];
                    },
                    color: '#8b949e',
                    fontSize: 10
                },
                markLine: {
                    data: [
                        { yAxis: 20, lineStyle: { color: '#e74c3c', type: 'dashed' }, label: { formatter: '历史低点', color: '#e74c3c' } }
                    ]
                }
            }]
        };
    },

    // =====================================================
    // 图表7：专业方向占比对比（2024 vs 2029）
    // =====================================================
    majorDistribution: function () {
        return {
            title: {
                text: '专业方向占比变化：艺术类跃升第二',
                subtext: '2024年 vs 2029年预测',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                orient: 'horizontal',
                bottom: 10,
                textStyle: { color: '#8b949e' }
            },
            series: [
                {
                    name: '2024年',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    center: ['30%', '50%'],
                    label: { color: '#8b949e', fontSize: 10 },
                    data: [
                        { value: 40, name: '理工科', itemStyle: { color: '#3498db' } },
                        { value: 11.8, name: '艺术类', itemStyle: { color: '#e74c3c' } },
                        { value: 15, name: '商科', itemStyle: { color: '#2d8f4e' } },
                        { value: 12, name: '文法', itemStyle: { color: '#9b59b6' } },
                        { value: 21.2, name: '其他', itemStyle: { color: '#7f8c8d' } }
                    ]
                },
                {
                    name: '2029年预测',
                    type: 'pie',
                    radius: ['30%', '50%'],
                    center: ['70%', '50%'],
                    label: { color: '#8b949e', fontSize: 10 },
                    data: [
                        { value: 40, name: '理工科', itemStyle: { color: '#3498db' } },
                        { value: 18.6, name: '艺术类', itemStyle: { color: '#e74c3c' } },
                        { value: 15, name: '商科', itemStyle: { color: '#2d8f4e' } },
                        { value: 12, name: '文法', itemStyle: { color: '#9b59b6' } },
                        { value: 14.4, name: '其他', itemStyle: { color: '#7f8c8d' } }
                    ]
                }
            ],
            graphic: [
                { type: 'text', left: '25%', top: '15%', style: { text: '2024年', fill: '#f0f6fc', fontSize: 14, fontWeight: 600 } },
                { type: 'text', left: '65%', top: '15%', style: { text: '2029年预测', fill: '#f0f6fc', fontSize: 14, fontWeight: 600 } }
            ]
        };
    },

    // =====================================================
    // 图表8：名校中国学生占比
    // =====================================================
    topSchoolsShare: function () {
        return {
            title: {
                text: '日本顶尖艺术院校中国学生占比',
                subtext: '中国学生已成为"主体学生"',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            xAxis: {
                type: 'category',
                data: ['东京艺术大学\n(GEIDAI)', '多摩美术大学', '武藏野美术大学', '日本艺术系\n平均值'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e', interval: 0 }
            },
            yAxis: {
                type: 'value',
                name: '中国学生占比 (%)',
                min: 0,
                max: 100,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e', formatter: '{value}%' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [{
                type: 'bar',
                data: [
                    { value: 67.7, itemStyle: { color: '#d4a84b' } },
                    { value: 65, itemStyle: { color: '#e74c3c' } },
                    { value: 65, itemStyle: { color: '#e74c3c' } },
                    { value: 70, itemStyle: { color: '#1e3a5f' } }
                ],
                barWidth: '50%',
                label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                        if (params.dataIndex === 0) return '67.7%';
                        if (params.dataIndex === 1 || params.dataIndex === 2) return '60-70%';
                        return '70%';
                    },
                    color: '#f0f6fc',
                    fontWeight: 'bold'
                },
                markLine: {
                    data: [
                        { yAxis: 50, lineStyle: { color: '#f39c12', type: 'dashed' }, label: { formatter: '过半', color: '#f39c12' } }
                    ]
                }
            }]
        };
    },

    // =====================================================
    // 图表9：音乐大学热力图对比矩阵（中文版）
    // =====================================================
    musicUniversityHeatmap: function () {
        const universities = ['东京艺大', '东京音大', '国立音大', '昭和音大', '武蔵野', '多摩美', '日大艺术', '京都艺大', '爱知艺大', '洗足学園', '上野学園', '大阪音大', '名古屋音大', '大阪国立', '专门学校'];
        const dimensions = ['教学质量', '录取难度', '年学费(万日元)', '中国学生数', '就业前景', '国际友好度'];

        // 热力图数据: [x, y, value] - x是院校索引, y是维度索引, value是数值
        const rawData = [
            // 教学质量
            [0, 0, 10], [1, 0, 9.5], [2, 0, 9], [3, 0, 8.5], [4, 0, 9], [5, 0, 8], [6, 0, 8], [7, 0, 8.5], [8, 0, 7], [9, 0, 8], [10, 0, 7.5], [11, 0, 7], [12, 0, 7], [13, 0, 6.5], [14, 0, 6],
            // 录取难度
            [0, 1, 9], [1, 1, 8], [2, 1, 7], [3, 1, 5], [4, 1, 7], [5, 1, 7], [6, 1, 6], [7, 1, 7], [8, 1, 4], [9, 1, 6], [10, 1, 5], [11, 1, 6], [12, 1, 5], [13, 1, 5], [14, 1, 2],
            // 年学费
            [0, 2, 120], [1, 2, 87], [2, 2, 100], [3, 2, 120], [4, 2, 105], [5, 2, 110], [6, 2, 95], [7, 2, 50], [8, 2, 30], [9, 2, 100], [10, 2, 90], [11, 2, 100], [12, 2, 95], [13, 2, 100], [14, 2, 60],
            // 中国学生数
            [0, 3, 25], [1, 3, 140], [2, 3, 290], [3, 3, 180], [4, 3, 175], [5, 3, 100], [6, 3, 80], [7, 3, 55], [8, 3, 40], [9, 3, 85], [10, 3, 65], [11, 3, 75], [12, 3, 50], [13, 3, 65], [14, 3, 800],
            // 就业前景
            [0, 4, 10], [1, 4, 9.5], [2, 4, 9], [3, 4, 9], [4, 4, 8.5], [5, 4, 8], [6, 4, 8], [7, 4, 8], [8, 4, 7], [9, 4, 8.5], [10, 4, 7], [11, 4, 7], [12, 4, 7], [13, 4, 6.5], [14, 4, 7.5],
            // 国际友好度
            [0, 5, 7], [1, 5, 9], [2, 5, 10], [3, 5, 9.5], [4, 5, 7], [5, 5, 8], [6, 5, 7], [7, 5, 6], [8, 5, 6], [9, 5, 8], [10, 5, 6], [11, 5, 7], [12, 5, 6], [13, 5, 6], [14, 5, 8]
        ];

        return {
            tooltip: {
                position: 'top',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' },
                formatter: function (params) {
                    const uni = universities[params.data[0]];
                    const dim = dimensions[params.data[1]];
                    let val = params.data[3];
                    if (dim.includes('学费')) val = val + '万日元/年';
                    else if (dim.includes('学生')) val = val + '人';
                    return `${uni}<br/>${dim}: ${val}`;
                }
            },
            grid: {
                left: 110,
                right: 50,
                top: 10,
                bottom: 140
            },
            xAxis: {
                type: 'category',
                data: universities,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: {
                    color: '#8b949e',
                    rotate: 45,
                    interval: 0,
                    fontSize: 10
                },
                splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } }
            },
            yAxis: {
                type: 'category',
                data: dimensions,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e', fontSize: 11 },
                splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } }
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                inRange: {
                    color: ['#2d8f4e', '#f39c12', '#e74c3c'] // 绿→黄→红
                },
                textStyle: { color: '#8b949e' }
            },
            series: [{
                name: '对比矩阵',
                type: 'heatmap',
                data: rawData.map(d => {
                    // 标准化数值到0-10范围用于颜色映射
                    let normalized = d[2];
                    if (d[1] === 2) { // 学费
                        normalized = d[2] / 12; // 120万 -> 10
                    } else if (d[1] === 3) { // 学生数
                        normalized = Math.min(d[2] / 100, 10); // 100人 -> 1, 最大10
                    }
                    return [d[0], d[1], normalized, d[2]]; // 保留原始值
                }),
                label: {
                    show: true,
                    formatter: function (params) {
                        const originalVal = params.data[3];
                        return originalVal;
                    },
                    color: '#fff',
                    fontSize: 9
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
    },

    // =====================================================
    // 图表10：音乐专业方向分布条形图（中文版-基于新数据）
    // =====================================================
    musicSpecialization: function () {
        return {
            title: {
                text: '中国赴日音乐留学生专业分布（2024年）',
                subtext: '声乐和钢琴专业领先，共计约2,500名学生',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' },
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    const p = params[0];
                    return `${p.name}<br/>人数: ${p.value}人<br/>占比: ${(p.value / 2500 * 100).toFixed(1)}%`;
                }
            },
            grid: {
                left: 100,
                right: 60,
                top: 80,
                bottom: 60
            },
            xAxis: {
                type: 'value',
                name: '学生人数',
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            yAxis: {
                type: 'category',
                data: ['声乐/演唱', '钢琴/键盘', '管弦乐', '作曲', '爵士/流行', '音乐商务', '电子音乐', '音乐教育', '指挥'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e', fontSize: 11 },
                inverse: true
            },
            series: [{
                name: '学生人数',
                type: 'bar',
                data: [
                    { value: 525, itemStyle: { color: '#00bcd4' } },  // 声乐 21%
                    { value: 475, itemStyle: { color: '#e74c3c' } },  // 钢琴 19%
                    { value: 400, itemStyle: { color: '#2d8f4e' } },  // 管弦乐 16%
                    { value: 275, itemStyle: { color: '#607d8b' } },  // 作曲 11%
                    { value: 275, itemStyle: { color: '#c9a227' } },  // 爵士/流行 11%
                    { value: 225, itemStyle: { color: '#8b4513' } },  // 音乐商务 9%
                    { value: 150, itemStyle: { color: '#800020' } },  // 电子音乐 6%
                    { value: 100, itemStyle: { color: '#1e3a5f' } },  // 音乐教育 4%
                    { value: 75, itemStyle: { color: '#e91e63' } }    // 指挥 3%
                ],
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'right',
                    formatter: function (params) {
                        return params.value + '人 (' + (params.value / 2500 * 100).toFixed(0) + '%)';
                    },
                    color: '#f0f6fc',
                    fontSize: 11
                }
            }]
        };
    },

    // =====================================================
    // 图表11：音乐留学10年演变（2014-2024）
    // =====================================================
    musicHistory10Years: function () {
        return {
            title: {
                text: '中国赴日音乐留学生10年演变（2014-2024）',
                subtext: '经历安保法、疫情和中日紧张，招生规模仍增长3倍',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                data: ['保守估计', '乐观估计'],
                top: 45,
                textStyle: { color: '#8b949e' }
            },
            xAxis: {
                type: 'category',
                name: '年份',
                data: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '学生人数',
                min: 0,
                max: 3500,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '保守估计',
                    type: 'line',
                    data: [750, 800, 850, 900, 950, 1000, 900, 1000, 1100, 1800, 2500],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#00bcd4' },
                    lineStyle: { color: '#00bcd4', width: 2 },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0, 188, 212, 0.3)' },
                                { offset: 1, color: 'rgba(0, 188, 212, 0.05)' }
                            ]
                        }
                    }
                },
                {
                    name: '乐观估计',
                    type: 'line',
                    data: [950, 1050, 1150, 1250, 1300, 1400, 1200, 1400, 1600, 2200, 3000],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 2 },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(45, 143, 78, 0.3)' },
                                { offset: 1, color: 'rgba(45, 143, 78, 0.05)' }
                            ]
                        }
                    }
                }
            ],
            graphic: [
                {
                    type: 'text',
                    left: '18%',
                    top: '50%',
                    style: {
                        text: '2015年\n安保法',
                        fill: '#f39c12',
                        fontSize: 10,
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        padding: [4, 8],
                        borderRadius: 4
                    }
                },
                {
                    type: 'text',
                    left: '53%',
                    top: '55%',
                    style: {
                        text: '2020年\n新冠疫情',
                        fill: '#e74c3c',
                        fontSize: 10,
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        padding: [4, 8],
                        borderRadius: 4
                    }
                },
                {
                    type: 'text',
                    right: '10%',
                    top: '25%',
                    style: {
                        text: '2024年\n中日紧张',
                        fill: '#e74c3c',
                        fontSize: 10,
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        padding: [4, 8],
                        borderRadius: 4
                    }
                }
            ]
        };
    },

    // =====================================================
    // 图表12：音乐留学5年预测（2024-2029）
    // =====================================================
    musicForecast5Years: function () {
        return {
            title: {
                text: '中国赴日音乐留学生5年预测（2024-2029）',
                subtext: '三种情景呈现不同增长路径',
                left: 'center',
                textStyle: { color: '#f0f6fc', fontSize: 16, fontWeight: 600 },
                subtextStyle: { color: '#8b949e', fontSize: 12 }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(22, 27, 34, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                textStyle: { color: '#f0f6fc' }
            },
            legend: {
                data: ['乐观情景 (25%)', '基准情景 (60%)', '保守情景 (15%)'],
                top: 45,
                textStyle: { color: '#8b949e' }
            },
            xAxis: {
                type: 'category',
                name: '年份',
                data: ['2024', '2025', '2026', '2027', '2028', '2029'],
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' }
            },
            yAxis: {
                type: 'value',
                name: '学生人数',
                min: 2000,
                max: 5500,
                axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
                axisLabel: { color: '#8b949e' },
                splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [
                {
                    name: '乐观情景 (25%)',
                    type: 'line',
                    data: [2500, 3200, 3600, 4000, 4500, 5000],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#2d8f4e' },
                    lineStyle: { color: '#2d8f4e', width: 3 },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            if (params.dataIndex === 5) return '5,000人\n(+100%)';
                            return '';
                        },
                        color: '#2d8f4e',
                        fontSize: 10
                    }
                },
                {
                    name: '基准情景 (60%)',
                    type: 'line',
                    data: [2500, 2800, 3100, 3400, 3700, 3900],
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: { color: '#00bcd4' },
                    lineStyle: { color: '#00bcd4', width: 3 },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0, 188, 212, 0.2)' },
                                { offset: 1, color: 'rgba(0, 188, 212, 0.02)' }
                            ]
                        }
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: function (params) {
                            if (params.dataIndex === 5) return '3,900人\n(+56%)';
                            return '';
                        },
                        color: '#00bcd4',
                        fontSize: 10
                    }
                },
                {
                    name: '保守情景 (15%)',
                    type: 'line',
                    data: [2500, 2550, 2700, 2800, 2900, 3000],
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: { color: '#e74c3c' },
                    lineStyle: { color: '#e74c3c', width: 2, type: 'dashed' },
                    label: {
                        show: true,
                        position: 'bottom',
                        formatter: function (params) {
                            if (params.dataIndex === 5) return '3,000人\n(+20%)';
                            return '';
                        },
                        color: '#e74c3c',
                        fontSize: 10
                    }
                }
            ]
        };
    }
};

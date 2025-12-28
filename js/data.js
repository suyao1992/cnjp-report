/**
 * 中日留学调研报告 - 数据文件
 * 数据来源：JASSO官方统计 + 调研材料
 * 数据精度：官方数据±0.5% | 预测数据±3-5%
 */

const ReportData = {
    // 报告元信息
    meta: {
        title: '中日关系、中国赴日留学变化与前景预测',
        subtitle: '2025年12月综合调研报告',
        date: '2025年12月26日',
        coverage: '2005-2024年历史数据 + 2025-2029年前瞻预测'
    },

    // =====================================================
    // 第一部分：外交关系指数
    // =====================================================
    diplomacy: {
        events: [
            { date: '2024.11.15', event: '中日首脑会谈（秘鲁APEC）', index: 50, change: '基准' },
            { date: '2024.12.25', event: '岩屋毅外相访华', index: 55, change: '+5（关键转机）' },
            { date: '2025.11.7', event: '高市早苗首相国会发言', index: 25, change: '-30' },
            { date: '2025.11.18', event: '外交磋商未果', index: 20, change: '-5（历史低点）' }
        ],
        chartData: {
            dates: ['2024.11.15', '2024.12.25', '2025.11.7', '2025.11.18'],
            values: [50, 55, 25, 20],
            labels: ['首脑会谈', '外相访华', '首相发言', '磋商未果']
        }
    },

    // =====================================================
    // 第二部分：全体中国赴日留学生历史数据（2005-2024）
    // =====================================================
    totalStudents: {
        history: {
            years: [2005, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2019, 2020, 2021, 2022, 2023, 2024],
            values: [32000, 40000, 52000, 60000, 73795, 85000, 95000, 100000, 105557, 102000, 103000, 104000, 124436, 116911, 114000, 103882, 115500, 123485],
            // 阶段划分
            phases: [
                { name: '扩大开放初期', start: 2005, end: 2008, color: '#87CEEB' },
                { name: '金融危机与复苏', start: 2008, end: 2012, color: '#1e3a5f' },
                { name: '高速增长期', start: 2012, end: 2019, color: '#2d8f4e' },
                { name: '疫情冲击期', start: 2019, end: 2022, color: '#e74c3c' },
                { name: '疫后恢复期', start: 2022, end: 2024, color: '#f39c12' }
            ],
            keyEvents: [
                { year: 2008, label: '北京奥运' },
                { year: 2012, label: '钓鱼岛危机' },
                { year: 2019, label: '历史峰值' },
                { year: 2020, label: '疫情开始' },
                { year: 2024, label: '接近峰值' }
            ]
        },
        milestones: {
            peak2019: 124436,
            low2022: 103882,
            current2024: 123485,
            growth20years: '+286%（3.86倍）'
        }
    },

    // =====================================================
    // 第三部分：艺术类留学生历史数据（2005-2024）
    // =====================================================
    artStudents: {
        history: {
            years: [2005, 2010, 2015, 2020, 2021, 2022, 2024],
            values: [3500, 5000, 6750, 8500, 10855, 11000, 14572],
            // 阶段划分
            phases: [
                { name: '开放初期萌芽', start: 2005, end: 2010, color: '#87CEEB' },
                { name: '知名度扩展期', start: 2010, end: 2015, color: '#1e3a5f' },
                { name: '互联网传播期', start: 2015, end: 2020, color: '#2d8f4e' },
                { name: '爆发增长期', start: 2021, end: 2024, color: '#e74c3c' }
            ],
            keyEvents: [
                { year: 2020, label: '东艺中国学生占比62%（美术）' },
                { year: 2024, label: '+26.1%', highlight: true }
            ]
        },
        milestones: {
            current2024: 14572,
            growth2024: '+26.1%',
            share2024: '11.8%',
            applicationShare: '33.4%',
            growth20years: '+316%（4.16倍）'
        }
    },

    // =====================================================
    // 第四部分：预测数据（2024-2029）
    // =====================================================
    predictions: {
        // 全体留学生预测
        total: {
            baseline: {
                probability: '60%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [123485, 131000, 127000, 121000, 122000, 129000],
                growth: [null, '+6.0%', '-3.0%', '-4.7%', '+0.8%', '+5.7%'],
                events: ['官方数据', '惯性延续', '博士补助删减', '触底', '缓慢复苏', '温和增长']
            },
            optimistic: {
                probability: '30%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [123485, 131000, 131000, 130000, 131000, 135000]
            },
            pessimistic: {
                probability: '10%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [123485, 128000, 120000, 110000, 111000, 115000]
            },
            netGrowth5Years: '+5,515人（+4.4%）'
        },
        // 艺术类预测
        art: {
            baseline: {
                probability: '60%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [14572, 16500, 19000, 21000, 22500, 24000],
                growth: [null, '+13.3%', '+15.2%', '+10.5%', '+7.1%', '+6.7%'],
                events: ['官方数据', '申请占比33.4%', '名校虹吸强', '世博+2030计划', '稳定增长', '成为主流']
            },
            optimistic: {
                probability: '30%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [14572, 17000, 20000, 23000, 25000, 26500]
            },
            pessimistic: {
                probability: '10%',
                years: [2024, 2025, 2026, 2027, 2028, 2029],
                values: [14572, 16000, 17500, 18500, 19200, 20000]
            },
            netGrowth5Years: '+9,428人（+64.7%）'
        },
        // 占比变化
        shareChange: {
            from: { year: 2024, value: '11.8%', ratio: '1/8.5' },
            to: { year: 2029, value: '18.6%', ratio: '1/5.4' }
        }
    },

    // =====================================================
    // 第五部分：名校数据
    // =====================================================
    topSchools: {
        geidai: {
            name: '东京艺术大学',
            chineseShare: '67.7%',
            details: [
                { dept: '美术学部', students: 119, share: '62%', estimate2024: '150-160人' },
                { dept: '音乐学部', students: 30, share: '~30%', estimate2024: '38-42人' },
                { dept: '映像研究科', students: 32, share: '~25%', estimate2024: '50-60人' },
                { dept: '其他', students: 11, share: '—', estimate2024: '15-18人' }
            ],
            total2020: 192,
            shareOfForeign: '39.5%',
            estimate2024: '250-280人（占50-60%）'
        },
        others: [
            { name: '多摩美术大学', chineseShare: '60-70%' },
            { name: '武藏野美术大学', chineseShare: '60-70%' }
        ],
        avgArtSchoolShare: '70%'
    },

    // =====================================================
    // 第六部分：专业方向占比
    // =====================================================
    majorDistribution: {
        current2024: [
            { name: '理工科', share: 40 },
            { name: '艺术类', share: 11.8 },
            { name: '商科', share: 15 },
            { name: '文法', share: 12 },
            { name: '其他', share: 21.2 }
        ],
        predicted2029: [
            { name: '理工科', share: 40, count: 51600 },
            { name: '艺术类', share: 18.6, count: 24000 },
            { name: '商科', share: 15, count: 19350 },
            { name: '文法', share: 12, count: 15480 },
            { name: '其他', share: 14.4, count: 18570 }
        ]
    },

    // =====================================================
    // 第七部分：艺术类细分领域
    // =====================================================
    artSubfields: {
        current2024: [
            { name: '美术类', share: '70-75%', count: 10200, growth: '12-15%/年' },
            { name: '音乐类', share: '15-20%', count: 2300, growth: '8-10%/年' },
            { name: '电影新媒体', share: '5-10%', count: 1500, growth: '18-22%/年' }
        ],
        predicted2029: [
            { name: '美术类', count: 17000, growth: '+66.7%' },
            { name: '音乐类', count: 3600, growth: '+56.5%' },
            { name: '电影新媒体', count: 3400, growth: '+126.7%' }
        ]
    },

    // =====================================================
    // 关键发现
    // =====================================================
    keyFindings: [
        {
            title: '艺术类是"政治脱钩"的完美证明',
            data: '艺术增速64.7% vs 全体4.4%（差14.7倍）',
            meaning: '教育相对政治独立性'
        },
        {
            title: '艺术教育成为新支柱',
            data: '占比11.8%→18.6%（预测2029年）',
            meaning: '仅次于理工科第二大'
        },
        {
            title: '名校虹吸效应强化',
            data: 'GEIDAI中国学生占比67.7%',
            meaning: '学生向顶尖名校集中'
        }
    ],

    // =====================================================
    // 风险评估
    // =====================================================
    risks: {
        high: [
            { risk: '台海局势变化', probability: '40-50%', impact: '全体-30%，艺术-20%' },
            { risk: '学费持续大幅上涨', probability: '40-50%', impact: '全体-10~15%' }
        ],
        medium: [
            { risk: '他国吸引力上升', probability: '20-30%', impact: '分流20-30%' },
            { risk: '中国基数放缓', probability: '20-30%', impact: '全体-5~10%' }
        ],
        low: [
            { risk: '经济波动', probability: '10-15%', impact: '全体-5%' },
            { risk: '技术替代', probability: '10-15%', impact: '全体-5%' }
        ]
    },

    // =====================================================
    // 第八部分：音乐留学数据
    // =====================================================
    musicStudents: {
        // 概览数据
        overview: {
            total2024: '2,500-3,000',
            annualGrowth: '+11-12%',
            shareOfChinese: '2.0-2.4%',
            shareOfArt: '17-21%',
            predicted2029: '3,900-5,000'
        },

        // 15所院校对比数据 (教学质量、录取难度、学费千日元/年、中国学生数、就业前景、特色专业、国际友好度、推荐星级)
        universities: [
            { id: 'GEIDAI', name: '东京艺术大学', teaching: 10, difficulty: 9, tuition: 1200, chinese: 25, employment: 10, specialty: 'Classical', intlFriendly: 7, rating: 5 },
            { id: 'Tokyo Ondai', name: '东京音乐大学', teaching: 9.5, difficulty: 8, tuition: 870, chinese: 140, employment: 9.5, specialty: 'Classical', intlFriendly: 9, rating: 5 },
            { id: 'Kunitachi', name: '国立音乐大学', teaching: 9, difficulty: 7, tuition: 1000, chinese: 290, employment: 9, specialty: 'Classical/Jazz/Electronic', intlFriendly: 10, rating: 5 },
            { id: 'Shobi', name: '昭和音乐大学', teaching: 8.5, difficulty: 5, tuition: 1200, chinese: 180, employment: 9, specialty: 'Jazz/Electronic', intlFriendly: 9.5, rating: 5 },
            { id: 'Musashino', name: '武蔵野音乐大学', teaching: 9, difficulty: 7, tuition: 1050, chinese: 175, employment: 8.5, specialty: 'Classical', intlFriendly: 7, rating: 5 },
            { id: 'Tama', name: '多摩美术大学', teaching: 8, difficulty: 7, tuition: 1100, chinese: 100, employment: 8, specialty: 'Contemporary', intlFriendly: 8, rating: 5 },
            { id: 'Nihon', name: '日本大学艺术部', teaching: 8, difficulty: 6, tuition: 950, chinese: 80, employment: 8, specialty: 'Composition', intlFriendly: 7, rating: 4 },
            { id: 'Kyoto', name: '京都市立艺术', teaching: 8.5, difficulty: 7, tuition: 500, chinese: 55, employment: 8, specialty: 'Traditional', intlFriendly: 6, rating: 4 },
            { id: 'Aichi', name: '爱知县立艺术', teaching: 7, difficulty: 4, tuition: 300, chinese: 40, employment: 7, specialty: 'Contemporary', intlFriendly: 6, rating: 4 },
            { id: 'Senzoku', name: '洗足学園音乐', teaching: 8, difficulty: 6, tuition: 1000, chinese: 85, employment: 8.5, specialty: 'Pop/Jazz', intlFriendly: 8, rating: 4 },
            { id: 'Ueno', name: '上野学園大学', teaching: 7.5, difficulty: 5, tuition: 900, chinese: 65, employment: 7, specialty: 'Classical', intlFriendly: 6, rating: 3 },
            { id: 'Osaka Music', name: '大阪音乐大学', teaching: 7, difficulty: 6, tuition: 1000, chinese: 75, employment: 7, specialty: 'Classical', intlFriendly: 7, rating: 3 },
            { id: 'Nagoya', name: '名古屋音乐大学', teaching: 7, difficulty: 5, tuition: 950, chinese: 50, employment: 7, specialty: 'General', intlFriendly: 6, rating: 3 },
            { id: 'Osaka National', name: '大阪国立音乐', teaching: 6.5, difficulty: 5, tuition: 1000, chinese: 65, employment: 6.5, specialty: 'Traditional', intlFriendly: 6, rating: 3 },
            { id: 'Vocational', name: '专门学校', teaching: 6, difficulty: 2, tuition: 600, chinese: 800, employment: 7.5, specialty: 'Pop/Practical', intlFriendly: 8, rating: 3 }
        ],

        // Top 5 推荐院校
        top5: [
            { rank: 1, name: 'GEIDAI', nameCN: '东京艺术大学', type: '国立精英', score: '9.8/10', chinese: '20-30', recommend: 5, emoji: '🥇' },
            { rank: 2, name: 'Tokyo Ondai', nameCN: '东京音乐大学', type: '私立顶尖', score: '9.2/10', chinese: '120-158', recommend: 5, emoji: '🥈' },
            { rank: 3, name: 'Kunitachi', nameCN: '国立音乐大学', type: '私立顶尖', score: '9.0/10', chinese: '225-360', recommend: 5, emoji: '🥉' },
            { rank: 4, name: 'Shobi', nameCN: '昭和音乐大学', type: '私立优秀', score: '8.5/10', chinese: '140-220', recommend: 4, emoji: '4️⃣' },
            { rank: 5, name: 'Musashino', nameCN: '武蔵野音乐大学', type: '私立优秀', score: '8.3/10', chinese: '150-200', recommend: 4, emoji: '5️⃣' }
        ],

        // 专业方向分布
        specializations: [
            { name: '爵士/流行/电音', share: 26, growth: '+18-20%/年', highlight: true },
            { name: '器乐（钢琴/弦乐/管乐）', share: 30, growth: '+8-10%/年' },
            { name: '声乐', share: 21, growth: '+10-12%/年' },
            { name: '作曲/指挥', share: 15, growth: '+12-15%/年' },
            { name: '音乐教育/理论', share: 8, growth: '+5-8%/年' }
        ],

        // 热力图维度标签
        dimensions: ['教学质量', '录取难度', '年学费(¥1000s)', '中国学生数', '就业前景', '国际友好度'],

        // 成本估算
        costEstimate: {
            minInvestment: '500万日元（24万RMB）',
            normalInvestment: '700-900万日元（34-43万RMB）',
            highEndInvestment: '1,000-1,200万日元（48-58万RMB）'
        },

        // 2029年预测
        prediction2029: {
            baseline: { total: '3,900人', growth: '+56%' },
            optimistic: { total: '5,000人', growth: '+100%' },
            newFieldsGrowth: '+85-115%（爵士/电音/制作）'
        }
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportData;
}

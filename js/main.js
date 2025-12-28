/**
 * 中日留学调研报告 - 主逻辑
 */

document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有图表
    initCharts();

    // 初始化导航高亮
    initNavigation();

    // 初始化数字动画
    initCountAnimation();

    // 初始化滚动动画
    initScrollAnimations();

    // 初始化移动端菜单
    initMobileMenu();
});

/**
 * 初始化所有ECharts图表
 */
function initCharts() {
    // 确保ECharts已加载
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载');
        return;
    }

    // 图表配置
    const chartInstances = {};

    // 1. 外交关系指数图表
    const diplomacyChart = document.getElementById('chart-diplomacy');
    if (diplomacyChart) {
        chartInstances.diplomacy = echarts.init(diplomacyChart);
        chartInstances.diplomacy.setOption(ChartConfigs.diplomacyIndex());
    }

    // 2. 全体留学生20年历史
    const totalHistoryChart = document.getElementById('chart-total-history');
    if (totalHistoryChart) {
        chartInstances.totalHistory = echarts.init(totalHistoryChart);
        chartInstances.totalHistory.setOption(ChartConfigs.totalHistory20Years());
    }

    // 3. 艺术类20年历史
    const artHistoryChart = document.getElementById('chart-art-history');
    if (artHistoryChart) {
        chartInstances.artHistory = echarts.init(artHistoryChart);
        chartInstances.artHistory.setOption(ChartConfigs.artHistory20Years());
    }

    // 4. 名校占比
    const topSchoolsChart = document.getElementById('chart-top-schools');
    if (topSchoolsChart) {
        chartInstances.topSchools = echarts.init(topSchoolsChart);
        chartInstances.topSchools.setOption(ChartConfigs.topSchoolsShare());
    }

    // 5. 双轴对比图
    const dualAxisChart = document.getElementById('chart-dual-axis');
    if (dualAxisChart) {
        chartInstances.dualAxis = echarts.init(dualAxisChart);
        chartInstances.dualAxis.setOption(ChartConfigs.dualAxisComparison());
    }

    // 6. 全体留学生三情景
    const totalScenariosChart = document.getElementById('chart-total-scenarios');
    if (totalScenariosChart) {
        chartInstances.totalScenarios = echarts.init(totalScenariosChart);
        chartInstances.totalScenarios.setOption(ChartConfigs.totalThreeScenarios());
    }

    // 7. 艺术类三情景
    const artScenariosChart = document.getElementById('chart-art-scenarios');
    if (artScenariosChart) {
        chartInstances.artScenarios = echarts.init(artScenariosChart);
        chartInstances.artScenarios.setOption(ChartConfigs.artThreeScenarios());
    }

    // 8. 专业占比变化
    const majorDistChart = document.getElementById('chart-major-distribution');
    if (majorDistChart) {
        chartInstances.majorDist = echarts.init(majorDistChart);
        chartInstances.majorDist.setOption(ChartConfigs.majorDistribution());
    }

    // 9. 音乐大学热力图对比矩阵
    const musicHeatmapChart = document.getElementById('chart-music-heatmap');
    if (musicHeatmapChart) {
        chartInstances.musicHeatmap = echarts.init(musicHeatmapChart);
        chartInstances.musicHeatmap.setOption(ChartConfigs.musicUniversityHeatmap());
    }

    // 10. 音乐专业方向分布
    const musicSpecChart = document.getElementById('chart-music-specialization');
    if (musicSpecChart) {
        chartInstances.musicSpec = echarts.init(musicSpecChart);
        chartInstances.musicSpec.setOption(ChartConfigs.musicSpecialization());
    }

    // 11. 音乐留学10年演变
    const musicHistoryChart = document.getElementById('chart-music-history');
    if (musicHistoryChart) {
        chartInstances.musicHistory = echarts.init(musicHistoryChart);
        chartInstances.musicHistory.setOption(ChartConfigs.musicHistory10Years());
    }

    // 12. 音乐留学5年预测
    const musicForecastChart = document.getElementById('chart-music-forecast');
    if (musicForecastChart) {
        chartInstances.musicForecast = echarts.init(musicForecastChart);
        chartInstances.musicForecast.setOption(ChartConfigs.musicForecast5Years());
    }

    // 响应式调整
    window.addEventListener('resize', function () {
        Object.values(chartInstances).forEach(chart => {
            if (chart) chart.resize();
        });
    });

    // 保存到全局以便调试
    window.chartInstances = chartInstances;
}

/**
 * 导航高亮
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav a');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
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
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // 平滑滚动（仅对锚点链接生效）
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 如果是外部链接或页面链接（非锚点），不拦截
            if (!href.startsWith('#')) {
                return; // 让浏览器正常处理
            }

            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 数字递增动画
 */
function initCountAnimation() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateNumber(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => observer.observe(el));
}

/**
 * 数字动画函数
 */
function animateNumber(element, target) {
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * 滚动动画
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.chart-container, .finding-card, .stat-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));
}

/**
 * 移动端菜单切换
 */
function initMobileMenu() {
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarNav = document.getElementById('navbarNav');

    if (!navbarToggle || !navbarNav) return;

    // 点击汉堡按钮切换菜单
    navbarToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        navbarNav.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    const navLinks = navbarNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navbarToggle.classList.remove('active');
            navbarNav.classList.remove('active');
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function (e) {
        if (!navbarToggle.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarToggle.classList.remove('active');
            navbarNav.classList.remove('active');
        }
    });
}

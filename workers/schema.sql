-- 指标定义表
CREATE TABLE IF NOT EXISTS indicators (
    id TEXT PRIMARY KEY,           -- 如 'cpi_total', 'job_ratio'
    name_zh TEXT NOT NULL,          -- 中文名称
    name_ja TEXT,                   -- 日文名称
    category TEXT NOT NULL,         -- 分类: student/job/cost/macro
    unit TEXT,                      -- 单位
    source TEXT,                    -- 数据来源
    estat_id TEXT,                  -- e-stat 统计表ID
    update_frequency TEXT,          -- monthly/quarterly/yearly
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 时序数据表（核心）
CREATE TABLE IF NOT EXISTS time_series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    indicator_id TEXT NOT NULL,     -- 关联 indicators.id
    time_period TEXT NOT NULL,      -- 格式: 2024-11 或 2024 或 2024-Q4
    value REAL NOT NULL,
    yoy_change REAL,                -- 同比变化（预计算）
    mom_change REAL,                -- 环比变化（预计算）
    raw_value REAL,                 -- 原始值（未处理）
    revision_number INTEGER DEFAULT 0,  -- 修正版本号
    is_preliminary INTEGER DEFAULT 0,   -- 是否速报值
    fetched_at DATETIME,            -- 拉取时间
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(indicator_id, time_period)
);

-- 数据更新日志
CREATE TABLE IF NOT EXISTS sync_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_type TEXT,                 -- full/incremental/cron
    status TEXT,                    -- success/failed/partial
    indicators_updated INTEGER DEFAULT 0,
    records_added INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_unchanged INTEGER DEFAULT 0,
    error_message TEXT,
    started_at DATETIME,
    completed_at DATETIME
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_time_series_indicator ON time_series(indicator_id);
CREATE INDEX IF NOT EXISTS idx_time_series_period ON time_series(indicator_id, time_period);
CREATE INDEX IF NOT EXISTS idx_time_series_fetched ON time_series(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_time ON sync_logs(started_at DESC);

-- 初始化配置
INSERT OR IGNORE INTO config (key, value) VALUES ('last_sync_time', NULL);
INSERT OR IGNORE INTO config (key, value) VALUES ('sync_enabled', 'true');
INSERT OR IGNORE INTO config (key, value) VALUES ('default_time_range', '5y');

-- 初始化指标定义
-- 留学生类
INSERT OR IGNORE INTO indicators (id, name_zh, name_ja, category, unit, source, update_frequency) VALUES
('students_total', '外国人留学生总数', '外国人留学生数', 'student', '万人', 'JASSO', 'yearly'),
('students_china', '中国留学生数', '中国人留学生数', 'student', '万人', 'JASSO', 'yearly'),
('students_nepal', '尼泊尔留学生数', 'ネパール人留学生数', 'student', '万人', 'JASSO', 'yearly'),
('students_vietnam', '越南留学生数', 'ベトナム人留学生数', 'student', '万人', 'JASSO', 'yearly');

-- 就业类
INSERT OR IGNORE INTO indicators (id, name_zh, name_ja, category, unit, source, update_frequency) VALUES
('job_ratio', '有效求人倍率', '有効求人倍率', 'job', '倍', '厚生労働省', 'monthly'),
('unemployment_rate', '完全失业率', '完全失業率', 'job', '%', '総務省', 'monthly'),
('foreign_workers', '外国人劳动者数', '外国人労働者数', 'job', '万人', '厚生労働省', 'yearly');

-- 生活成本类
INSERT OR IGNORE INTO indicators (id, name_zh, name_ja, category, unit, source, update_frequency) VALUES
('cpi_total', 'CPI总指数', '消費者物価指数（総合）', 'cost', '指数', '総務省統計局', 'monthly'),
('cpi_core', '核心CPI', 'コアCPI（生鮮食品除く）', 'cost', '指数', '総務省統計局', 'monthly');

-- 宏观经济类
INSERT OR IGNORE INTO indicators (id, name_zh, name_ja, category, unit, source, update_frequency) VALUES
('gdp_growth', 'GDP增长率', 'GDP成長率', 'macro', '%', '内閣府', 'quarterly'),
('population_total', '日本总人口', '総人口', 'macro', '万人', '総務省', 'monthly'),
('foreign_residents', '外国人住民数', '外国人住民数', 'macro', '万人', '総務省', 'yearly');

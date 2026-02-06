-- =============================================
-- Shift Manager - D1 Schema
-- =============================================

-- พนักงาน
CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nickname TEXT,
  role TEXT DEFAULT 'staff',         -- admin, lead, staff
  department TEXT DEFAULT 'general',
  default_shift TEXT DEFAULT 'morning', -- morning, afternoon, night
  avatar TEXT DEFAULT '👤',
  phone TEXT,
  line_id TEXT,
  max_sick_leave INTEGER DEFAULT 30,
  max_personal_leave INTEGER DEFAULT 6,
  max_vacation_leave INTEGER DEFAULT 10,
  max_maternity_leave INTEGER DEFAULT 90,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ตารางกะรายวัน
CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date TEXT NOT NULL,                -- YYYY-MM-DD
  shift_type TEXT NOT NULL,          -- morning, afternoon, night, off
  note TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE(employee_id, date)
);

-- วันลา
CREATE TABLE IF NOT EXISTS leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date TEXT NOT NULL,                -- YYYY-MM-DD
  leave_type TEXT NOT NULL,          -- sick, personal, vacation, maternity
  status TEXT DEFAULT 'pending',     -- pending, approved, rejected
  reason TEXT,
  approved_by INTEGER,
  approved_at TEXT,
  attachment_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE(employee_id, date)
);

-- คำขอสลับกะ
CREATE TABLE IF NOT EXISTS swap_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  from_employee_id INTEGER NOT NULL,
  to_employee_id INTEGER NOT NULL,
  from_shift TEXT NOT NULL,
  to_shift TEXT NOT NULL,
  status TEXT DEFAULT 'pending',     -- pending, approved, rejected
  reason TEXT,
  approved_by INTEGER,
  approved_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_employee_id) REFERENCES employees(id),
  FOREIGN KEY (to_employee_id) REFERENCES employees(id)
);

-- วันหยุดนักขัตฤกษ์
CREATE TABLE IF NOT EXISTS holidays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,         -- YYYY-MM-DD
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public',        -- public, company, special
  created_at TEXT DEFAULT (datetime('now'))
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,              -- shift_change, leave_request, swap_request, etc.
  description TEXT,
  employee_id INTEGER,
  performed_by INTEGER,
  metadata TEXT,                     -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shifts_date ON shifts(date);
CREATE INDEX IF NOT EXISTS idx_shifts_employee ON shifts(employee_id);
CREATE INDEX IF NOT EXISTS idx_shifts_employee_date ON shifts(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leaves_date ON leaves(date);
CREATE INDEX IF NOT EXISTS idx_leaves_employee ON leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_swap_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at);

-- ========== Seed Data ==========

-- วันหยุดนักขัตฤกษ์ 2568 (2025)
INSERT OR IGNORE INTO holidays (date, name, type) VALUES
  ('2025-01-01', 'วันขึ้นปีใหม่', 'public'),
  ('2025-02-12', 'วันมาฆบูชา', 'public'),
  ('2025-04-06', 'วันจักรี', 'public'),
  ('2025-04-13', 'วันสงกรานต์', 'public'),
  ('2025-04-14', 'วันสงกรานต์', 'public'),
  ('2025-04-15', 'วันสงกรานต์', 'public'),
  ('2025-05-01', 'วันแรงงาน', 'public'),
  ('2025-05-04', 'วันฉัตรมงคล', 'public'),
  ('2025-05-12', 'วันวิสาขบูชา', 'public'),
  ('2025-06-03', 'วันเฉลิมพระชนมพรรษา ร.10', 'public'),
  ('2025-07-10', 'วันอาสาฬหบูชา', 'public'),
  ('2025-07-11', 'วันเข้าพรรษา', 'public'),
  ('2025-07-28', 'วันเฉลิมพระชนมพรรษา ร.10', 'public'),
  ('2025-08-12', 'วันแม่แห่งชาติ', 'public'),
  ('2025-10-13', 'วันคล้ายวันสวรรคต ร.9', 'public'),
  ('2025-10-23', 'วันปิยมหาราช', 'public'),
  ('2025-12-05', 'วันพ่อแห่งชาติ', 'public'),
  ('2025-12-10', 'วันรัฐธรรมนูญ', 'public'),
  ('2025-12-31', 'วันสิ้นปี', 'public');

-- วันหยุดนักขัตฤกษ์ 2569 (2026)
INSERT OR IGNORE INTO holidays (date, name, type) VALUES
  ('2026-01-01', 'วันขึ้นปีใหม่', 'public'),
  ('2026-03-03', 'วันมาฆบูชา', 'public'),
  ('2026-04-06', 'วันจักรี', 'public'),
  ('2026-04-13', 'วันสงกรานต์', 'public'),
  ('2026-04-14', 'วันสงกรานต์', 'public'),
  ('2026-04-15', 'วันสงกรานต์', 'public'),
  ('2026-05-01', 'วันแรงงาน', 'public'),
  ('2026-05-04', 'วันฉัตรมงคล', 'public'),
  ('2026-05-31', 'วันวิสาขบูชา', 'public'),
  ('2026-06-03', 'วันเฉลิมพระชนมพรรษา ร.10', 'public'),
  ('2026-07-28', 'วันเฉลิมพระชนมพรรษา ร.10', 'public'),
  ('2026-08-12', 'วันแม่แห่งชาติ', 'public'),
  ('2026-10-13', 'วันคล้ายวันสวรรคต ร.9', 'public'),
  ('2026-10-23', 'วันปิยมหาราช', 'public'),
  ('2026-12-05', 'วันพ่อแห่งชาติ', 'public'),
  ('2026-12-10', 'วันรัฐธรรมนูญ', 'public'),
  ('2026-12-31', 'วันสิ้นปี', 'public');

-- Sample employees
INSERT OR IGNORE INTO employees (id, name, nickname, role, default_shift, avatar, department) VALUES
  (1, 'สมชาย ใจดี', 'ชาย', 'admin', 'morning', '👨‍💼', 'management'),
  (2, 'สมหญิง รักงาน', 'หญิง', 'lead', 'morning', '👩‍💻', 'production'),
  (3, 'วิชัย เก่งมาก', 'ชัย', 'staff', 'afternoon', '👨‍🔧', 'production'),
  (4, 'นภา สดใส', 'นภา', 'staff', 'afternoon', '👩‍🔬', 'production'),
  (5, 'ธนา มั่นคง', 'ธนา', 'staff', 'night', '👨‍🍳', 'warehouse'),
  (6, 'ปิยะ สุขสันต์', 'ปิยะ', 'staff', 'night', '👩‍⚕️', 'warehouse');

-- =============================================
-- Shift Manager - D1 Schema v5
-- =============================================

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS swap_requests;
DROP TABLE IF EXISTS leaves;
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS holidays;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS settings;

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  nickname TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'staff',
  department TEXT DEFAULT 'general',
  default_shift TEXT DEFAULT 'day',
  shift_start TEXT DEFAULT '09:00',
  shift_end TEXT DEFAULT '17:00',
  default_off_day TEXT DEFAULT '6',
  avatar TEXT DEFAULT '👤',
  profile_image TEXT,
  phone TEXT,
  line_id TEXT,
  max_leave_per_year INTEGER DEFAULT 20,
  is_active INTEGER DEFAULT 1,
  show_in_calendar INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  shift_type TEXT NOT NULL,
  note TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  leave_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  approved_by INTEGER,
  approved_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS swap_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  from_employee_id INTEGER NOT NULL,
  to_employee_id INTEGER NOT NULL,
  from_shift TEXT NOT NULL,
  to_shift TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reason TEXT,
  approved_by INTEGER,
  approved_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (from_employee_id) REFERENCES employees(id),
  FOREIGN KEY (to_employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS holidays (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  description TEXT,
  employee_id INTEGER,
  performed_by INTEGER,
  metadata TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_shifts_employee_date ON shifts(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leaves_employee ON leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_swap_status ON swap_requests(status);
CREATE INDEX IF NOT EXISTS idx_holidays_date ON holidays(date);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);

-- ========== ตั้งค่า ==========
INSERT INTO settings (key, value) VALUES
  ('company_holidays_per_year', '20'),
  ('company_name', 'บริษัท'),
  ('start_year', '2026');

-- ========== พนักงาน ==========
INSERT INTO employees (id, name, nickname, email, role, default_shift, shift_start, shift_end, default_off_day, avatar, show_in_calendar, max_leave_per_year) VALUES
  (1, 'น้ำตาล', 'น้ำตาล', 'iiiiinamtaniiiii@gmail.com', 'staff', 'evening', '17:00', '00:00', '6', '👩', 1, 20),
  (2, 'ปุ้มปุ้ย', 'ปุ้ย', 'r.suwimonn@gmail.com', 'staff', 'evening', '17:00', '00:00', '0', '👩‍🦱', 1, 20),
  (3, 'แตมป์', 'แตม', 'orawantam12@gmail.com', 'staff', 'day', '09:00', '17:00', '6', '👨', 1, 20),
  (4, 'เหมี่ยว', 'เหมี่ยว', 'phanaarusth2465@gmail.com', 'staff', 'day', '09:00', '17:00', '3', '🐱', 1, 20),
  (5, 'ToP', 'ToP', 'wyvernorm@gmail.com', 'owner', 'day', '09:00', '17:00', '0,6', '👨‍💼', 0, 20);

-- ========== วันหยุดนักขัตฤกษ์ 2569 (เริ่ม ม.ค. 2569 เป็นต้นไป) ==========
INSERT OR IGNORE INTO holidays (date, name, type) VALUES
  ('2026-01-01', 'วันขึ้นปีใหม่', 'public'),
  ('2026-01-02', 'ชดเชยวันขึ้นปีใหม่', 'public'),
  ('2026-03-03', 'วันมาฆบูชา', 'public'),
  ('2026-04-06', 'วันจักรี', 'public'),
  ('2026-04-13', 'วันสงกรานต์', 'public'),
  ('2026-04-14', 'วันสงกรานต์', 'public'),
  ('2026-04-15', 'วันสงกรานต์', 'public'),
  ('2026-05-01', 'วันแรงงาน', 'public'),
  ('2026-05-04', 'วันฉัตรมงคล', 'public'),
  ('2026-05-31', 'วันวิสาขบูชา', 'public'),
  ('2026-06-03', 'วันเฉลิมพระชนมพรรษา สมเด็จพระราชินี', 'public'),
  ('2026-07-28', 'วันเฉลิมพระชนมพรรษา ร.10', 'public'),
  ('2026-07-29', 'วันอาสาฬหบูชา', 'public'),
  ('2026-07-30', 'วันเข้าพรรษา', 'public'),
  ('2026-08-12', 'วันแม่แห่งชาติ', 'public'),
  ('2026-10-13', 'วันคล้ายวันสวรรคต ร.9', 'public'),
  ('2026-10-23', 'วันปิยมหาราช', 'public'),
  ('2026-12-05', 'วันพ่อแห่งชาติ', 'public'),
  ('2026-12-10', 'วันรัฐธรรมนูญ', 'public'),
  ('2026-12-31', 'วันสิ้นปี', 'public');

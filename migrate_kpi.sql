-- Migration: KPI error tracking system
CREATE TABLE IF NOT EXISTS kpi_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1'
);

CREATE TABLE IF NOT EXISTS kpi_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  notes TEXT,
  FOREIGN KEY (category_id) REFERENCES kpi_categories(id)
);

CREATE TABLE IF NOT EXISTS kpi_errors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  employee_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  detail_id INTEGER,
  points INTEGER DEFAULT 1,
  damage_cost REAL DEFAULT 0,
  note TEXT,
  created_by INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (category_id) REFERENCES kpi_categories(id),
  FOREIGN KEY (detail_id) REFERENCES kpi_details(id)
);

-- Insert default categories from Google Sheet
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('ระหว่างขาย', '#ef4444');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('การสรุปงาน', '#3b82f6');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('การนำงานเข้าระบบ', '#f59e0b');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('หลังการขาย', '#8b5cf6');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('งานตรวจสอบ', '#06b6d4');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('งานรับประกัน', '#10b981');
INSERT OR IGNORE INTO kpi_categories (name, color) VALUES ('เสียหายต้องหักเงิน', '#dc2626');

-- Insert details from Google Sheet
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'แจ้งราคา / แพ็กเกจผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'ทำใบเสนอราคา/วางบิลผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'เช็คยอดคงเหลือautolikeผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'รับงานผิดเงื่อนไข', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'ตอบไม่ตรงคำถาม / ตอบคำถามตกหล่น', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (1, 'แจ้ง-รับ โอนผิดบัญชี', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปลิงก์ไม่ครบ / ไม่สมบูรณ์ / รูปแบบผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปลิงก์งานผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปลิงก์ซ้ำ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'ยอดเริ่มต้น', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'ยอดแพ็กเกจ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'ยอดสิ้นสุด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'ยอดคงเหลือ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'วันหมดอายุไม่ถูกต้อง', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปงานผิดซ้ำซ้อน', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปงานแพทเทิลซ้ำ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (2, 'สรุปงานผิดเซิฟเวอร์', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (3, 'ใส่ปริมาณผิด (ขาด)', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (3, 'ใส่ลิงก์ผิด / ขาด / เกิน', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (3, 'นำงานเข้าระบบซ้ำ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (3, 'นำงานเข้าผิดเซิฟเวอร์ / แพ็กเกจ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ลืมนำงานเข้าระบบ', 2);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ลืมอัพเดทจำนวนงาน / สลิป', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ละเลยงานยกเลิก / คืนบางส่วน / Fail ในเวลางาน', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'แจ้งส่งงานผิด / ลิงก์ไม่สมบูรณ์', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ลืมอัพเดทยอดคงเหลือ / โน๊ตแจ้ทลูกค้า', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ออกใบกำกับที่อยู่ลูกค้าผิด / ลืมส่งใบเสร็จ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ลืมอัพเดททวงาน/ใบกำกับภาษี บน Trello', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'เช็ด/แจ้ง เงื่อนไขงานลูกค้าไม่ครบ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (4, 'ลืมลงปฏิทินงานทราฟฟิค', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (5, 'ละเลยติดตามงานที่ลูกค้าแจ้งตรวจสอบ', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (5, 'ลืมอัพเดทเหลืองานในปฏิทินทราฟฟิค', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (6, 'รับประกันยอดผิด', 1);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (7, 'คิดราคาผิด', 5);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (7, 'นำเข้าระบบผิด (มีผลต่อค่าทุนเพิ่มขึ้น)', 5);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (7, 'รับยอดโอนไม่ครบ', 5);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (7, 'สรุปยอดเริ่มต้ำ (ทำให้ต้นทุนเพิ่ม)', 5);
INSERT OR IGNORE INTO kpi_details (category_id, description, points) VALUES (7, 'ใส่ปริมาณผิด (เกิน) เช่น ทำ 10 ใส่ 100', 5);

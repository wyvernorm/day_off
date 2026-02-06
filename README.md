# 📅 ระบบจัดการกะ & วันลา

ระบบจัดการตารางกะทำงาน วันลา สลับกะ สำหรับทีมขนาดเล็ก-กลาง  
สร้างด้วย **Cloudflare Worker + D1 Database**

## ✨ Features

| Feature | รายละเอียด |
|---------|-----------|
| 📅 ปฏิทิน | มุมมองปฏิทินแบบ Google Calendar เห็นกะทุกคนในหน้าเดียว |
| 📋 ตารางกะ | Roster view ดูกะทั้งเดือนของทุกคนในตาราง |
| 📊 สถิติ | ดูจำนวนวันลาที่ใช้/เหลือ พร้อม progress bar |
| 🔄 สลับกะ | ส่งคำขอสลับกะระหว่างพนักงาน พร้อมระบบอนุมัติ |
| 📅 สลับวันหยุด | สลับวันหยุดประจำระหว่าง 2 คน |
| 📝 ลางาน | ลาป่วย/กิจ/พักร้อน พร้อม quota tracking |
| 🔔 อนุมัติ | หน้ารออนุมัติ — approve/reject วันลาและสลับกะ |
| 📜 ประวัติ | ดูประวัติการอนุมัติทั้งหมด พร้อม filter |
| ⚡ KPI | ระบบติดตามข้อผิดพลาด พร้อมสรุปแต้ม/หมวดหมู่ |
| 🔴 วันหยุด | รองรับวันหยุดนักขัตฤกษ์ |
| 👤 จัดการพนักงาน | เพิ่ม/แก้ไข/ลบพนักงาน |
| 🔐 Google OAuth | ล็อกอินด้วย Google Account |
| 📱 Telegram | แจ้งเตือนผ่าน Telegram Bot |

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd shift-manager
npm install
```

### 2. สร้าง D1 Database

```bash
wrangler d1 create shift-manager-db
# จะได้ database_id กลับมา — เอาไปใส่ใน wrangler.toml
```

### 3. แก้ `wrangler.toml`

```toml
[[d1_databases]]
binding = "DB"
database_name = "shift-manager-db"
database_id = "ใส่_DATABASE_ID_ที่ได้จากขั้นตอน_2"
```

### 4. ตั้งค่า Secrets

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put SESSION_SECRET
npx wrangler secret put TG_BOT_TOKEN
npx wrangler secret put TG_CHAT_ID
```

### 5. Init Database Schema

```bash
npm run db:init:local   # สำหรับ local dev
npm run db:init          # สำหรับ production
```

### 6. Run / Deploy

```bash
npm run dev      # Local development
npm run deploy   # Deploy to Cloudflare
```

## 📁 Project Structure

```
shift-manager/
├── wrangler.toml     # Cloudflare Worker config
├── package.json
├── README.md
├── index.js          # Main Worker entry point + OAuth + rate limiting
├── api.js            # API routes handler
└── frontend.js       # Frontend HTML/CSS/JS (served from Worker)
```

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | เริ่ม Google OAuth flow |
| GET | `/auth/callback` | Google OAuth callback |
| GET | `/auth/logout` | ออกจากระบบ |

### Me (โปรไฟล์ตัวเอง)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/me` | ข้อมูลตัวเอง |
| PUT | `/api/me` | แก้ไข nickname, avatar, phone, line_id |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | รายชื่อพนักงานทั้งหมด |
| POST | `/api/employees` | เพิ่มพนักงานใหม่ (admin/owner) |
| PUT | `/api/employees/:id` | แก้ไขข้อมูลพนักงาน |
| DELETE | `/api/employees/:id` | ลบพนักงาน (soft delete, admin/owner) |

### Shifts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/shifts` | ตั้ง/เปลี่ยนกะ (upsert) |

### Leaves
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves?month=&status=&year=&limit=&offset=` | ดูวันลา (paginated) |
| POST | `/api/leaves` | ลงวันลา (วันเดียว) |
| POST | `/api/leaves/range` | ลงวันลา (หลายวัน) |
| PUT | `/api/leaves/:id/approve` | อนุมัติวันลา |
| PUT | `/api/leaves/:id/reject` | ปฏิเสธวันลา |
| DELETE | `/api/leaves/:id` | ยกเลิกวันลา (เจ้าของหรือ admin) |

### Swap Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/swaps?status=pending` | ดูคำขอสลับกะ |
| POST | `/api/swaps` | ส่งคำขอสลับกะ |
| POST | `/api/swaps/dayoff` | ส่งคำขอสลับวันหยุด |
| PUT | `/api/swaps/:id/approve` | อนุมัติ |
| PUT | `/api/swaps/:id/reject` | ปฏิเสธ |

### Holidays
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/holidays?year=2026` | ดูวันหยุด |
| POST | `/api/holidays` | เพิ่มวันหยุด (admin/owner) |
| DELETE | `/api/holidays/:id` | ลบวันหยุด (admin/owner) |

### KPI Error Tracking
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kpi/categories` | หมวดหมู่ข้อผิดพลาด |
| GET | `/api/kpi/details?category_id=` | รายละเอียดข้อผิดพลาด |
| POST | `/api/kpi/details` | เพิ่มรายละเอียด (admin/owner) |
| PUT | `/api/kpi/details/:id` | แก้ไข (admin/owner) |
| DELETE | `/api/kpi/details/:id` | ลบ (admin/owner) |
| GET | `/api/kpi/errors?year=&month=&limit=&offset=` | รายการข้อผิดพลาด (paginated) |
| POST | `/api/kpi/errors` | บันทึกข้อผิดพลาด (admin/owner) |
| DELETE | `/api/kpi/errors/:id` | ลบ (admin/owner) |
| GET | `/api/kpi/summary?year=&month=` | สรุป KPI |

### Overview & History
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/overview?month=YYYY-MM` | ข้อมูลทั้งเดือน |
| GET | `/api/history?year=YYYY` | ประวัติการอนุมัติ |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | ดูการตั้งค่า |
| PUT | `/api/settings` | บันทึกการตั้งค่า (admin/owner) |

## ⚙️ Settings Keys

| Key | Description | ตัวอย่าง |
|-----|-------------|---------|
| `company_name` | ชื่อบริษัท | `My Company` |
| `company_holidays_per_year` | วันหยุดบริษัท/ปี | `20` |
| `sick_approvers` | อีเมลผู้มีสิทธิ์อนุมัติลาป่วย (คั่น ,) | `admin@x.com,hr@x.com` |
| `blackout_dates` | วันที่ไม่แสดงข้อมูล (คั่น ,) | `2026-01-01,2026-01-02` |
| `kpi_admins` | อีเมลผู้ดูแล KPI (คั่น ,) | `admin@x.com` |

## 📄 License

MIT

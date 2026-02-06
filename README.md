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
| 📝 ลางาน | ลาป่วย/กิจ/พักร้อน/คลอด พร้อม quota tracking |
| 🔔 อนุมัติ | หน้ารออนุมัติ — approve/reject วันลาและสลับกะ |
| 🔴 วันหยุด | รองรับวันหยุดนักขัตฤกษ์ไทย 2568-2569 |
| 👤 จัดการพนักงาน | เพิ่ม/แก้ไข/ลบพนักงาน |

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd shift-manager
npm install
```

### 2. สร้าง D1 Database

```bash
# สร้าง database
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

### 4. Init Database Schema

```bash
# สำหรับ local dev
npm run db:init:local

# สำหรับ production
npm run db:init
```

### 5. Run / Deploy

```bash
# Local development
npm run dev

# Deploy to Cloudflare
npm run deploy
```

## 📁 Project Structure

```
shift-manager/
├── wrangler.toml        # Cloudflare Worker config
├── schema.sql           # D1 database schema + seed data
├── package.json
├── README.md
└── src/
    ├── index.js          # Main Worker entry point
    ├── api.js            # API routes handler
    └── frontend.js       # Frontend HTML (served from Worker)
```

## 🔌 API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | รายชื่อพนักงานทั้งหมด |
| POST | `/api/employees` | เพิ่มพนักงานใหม่ |
| PUT | `/api/employees/:id` | แก้ไขข้อมูลพนักงาน |
| DELETE | `/api/employees/:id` | ลบพนักงาน (soft delete) |

### Shifts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shifts?month=YYYY-MM` | ดูกะทั้งเดือน |
| POST | `/api/shifts` | ตั้ง/เปลี่ยนกะ |
| POST | `/api/shifts/bulk` | ตั้งกะทั้งเดือน (batch) |

### Leaves
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaves?month=YYYY-MM&status=pending` | ดูวันลา |
| POST | `/api/leaves` | ลงวันลา (วันเดียว) |
| POST | `/api/leaves/range` | ลงวันลา (หลายวัน) |
| PUT | `/api/leaves/:id/approve` | อนุมัติวันลา |
| PUT | `/api/leaves/:id/reject` | ปฏิเสธวันลา |
| DELETE | `/api/leaves/:id` | ยกเลิกวันลา |

### Leave Quota
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leave-quota?employee_id=1&year=2025` | ดูโควต้าวันลา |

### Swap Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/swaps?status=pending` | ดูคำขอสลับกะ |
| POST | `/api/swaps` | ส่งคำขอสลับกะ |
| PUT | `/api/swaps/:id/approve` | อนุมัติ (สลับกะจริง) |
| PUT | `/api/swaps/:id/reject` | ปฏิเสธ |

### Holidays
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/holidays?year=2025` | ดูวันหยุด |
| POST | `/api/holidays` | เพิ่มวันหยุด |
| DELETE | `/api/holidays/:id` | ลบวันหยุด |

### Dashboard & Overview
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | สรุปวันนี้ |
| GET | `/api/overview?month=YYYY-MM` | ข้อมูลทั้งเดือน (ใช้ load หน้าหลัก) |
| GET | `/api/logs?limit=50` | Activity logs |

## 🎯 ฟีเจอร์ที่เพิ่มได้ในอนาคต

- [ ] Authentication (Cloudflare Access / JWT)
- [ ] LINE Notify แจ้งเตือน
- [ ] Export รายงานเป็น Excel
- [ ] Auto-generate กะตาม pattern
- [ ] พิมพ์ตารางกะ (Print-friendly)
- [ ] Dark mode

## 📄 License

MIT

@echo off
REM ==========================================
REM 🚀 Refactored Version - Auto Install Script
REM สำหรับ Windows
REM ==========================================

echo.
echo ========================================
echo 📦 Refactored Version - Auto Install
echo ========================================
echo.

REM ตรวจสอบว่าอยู่ใน folder ถูกต้อง
if not exist "package.json" (
    echo ❌ Error: ไม่พบ package.json
    echo กรุณารัน script นี้ใน folder day_off
    echo.
    pause
    exit /b 1
)

REM 1. Backup ไฟล์เดิม
echo [1/6] 💾 Backup ไฟล์เดิม...
if exist "frontend.js" (
    copy /Y frontend.js frontend-backup.js >nul
    echo ✅ Backup frontend.js → frontend-backup.js
) else (
    echo ⚠️  ไม่พบ frontend.js (ข้ามขั้นตอนนี้)
)
echo.

REM 2. แตก refactored.zip
echo [2/6] 📦 แตก refactored.zip...
if exist "refactored.zip" (
    powershell -command "Expand-Archive -Path refactored.zip -DestinationPath . -Force"
    echo ✅ แตกไฟล์สำเร็จ
) else (
    echo ❌ Error: ไม่พบ refactored.zip
    echo กรุณาดาวน์โหลด refactored.zip แล้ววางในโฟลเดอร์นี้
    echo.
    pause
    exit /b 1
)
echo.

REM 3. Copy ไฟล์จาก refactored/
echo [3/6] 📋 Copy ไฟล์...
xcopy /E /I /Y refactored\src src\ >nul
copy /Y refactored\build.js build.js >nul
copy /Y refactored\package.json package.json >nul
echo ✅ Copy ไฟล์สำเร็จ
echo.

REM 4. ติดตั้ง dependencies
echo [4/6] 📥 ติดตั้ง dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error: npm install ไม่สำเร็จ
    pause
    exit /b 1
)
echo ✅ ติดตั้ง dependencies สำเร็จ
echo.

REM 5. Build
echo [5/6] 🔨 Building...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Build ไม่สำเร็จ
    pause
    exit /b 1
)
echo ✅ Build สำเร็จ
echo.

REM 6. Clean up
echo [6/6] 🧹 ทำความสะอาด...
rmdir /S /Q refactored >nul 2>&1
echo ✅ ลบ folder refactored ชั่วคราว
echo.

echo ========================================
echo ✅ ติดตั้งสำเร็จ!
echo ========================================
echo.
echo 📁 โครงสร้างใหม่:
echo    E:\day_off\
echo    ├── src\                (ใหม่)
echo    │   ├── modules\
echo    │   ├── styles\
echo    │   └── main.js
echo    ├── build.js            (ใหม่)
echo    ├── frontend.js         (ถูก rebuild แล้ว)
echo    └── frontend-backup.js  (backup)
echo.
echo 🚀 พร้อมใช้งาน!
echo.
echo ขั้นตอนต่อไป:
echo    npm run dev    - ทดสอบ local
echo    npm run deploy - Deploy ขึ้น Cloudflare
echo.
pause

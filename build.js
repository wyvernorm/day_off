// ==========================================
// 🔨 build.js - Build Script
// รวมไฟล์ modules กลับเป็น frontend.js
// ==========================================

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Building frontend.js...');

// อ่านไฟล์ต้นฉบับ
const originalFrontend = readFileSync(join(__dirname, '../day_off3_check/frontend.js'), 'utf-8');

// อ่าน modules
const constants = readFileSync(join(__dirname, 'src/modules/constants.js'), 'utf-8');
const helpers = readFileSync(join(__dirname, 'src/modules/helpers.js'), 'utf-8');

// แปลง ES modules เป็น inline code
function moduleToInline(moduleCode) {
  // ลบ import/export statements
  let code = moduleCode;
  code = code.replace(/^export /gm, '');
  code = code.replace(/^import .+ from .+;$/gm, '');
  return code;
}

const constantsInline = moduleToInline(constants);
const helpersInline = moduleToInline(helpers);

// สร้าง frontend.js ใหม่โดยแทนที่ส่วน constants
let newFrontend = originalFrontend;

// แทนที่ constants section
const constantsPattern = /const DAYS = \['อา\.'.+?const KPI_ADMINS_DEFAULT = \[\];/s;
newFrontend = newFrontend.replace(constantsPattern, constantsInline);

// เขียนไฟล์ออก
writeFileSync(join(__dirname, 'frontend.js'), newFrontend, 'utf-8');

console.log('✅ Build complete!');
console.log('📦 Output: frontend.js');

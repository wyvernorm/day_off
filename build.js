#!/usr/bin/env node
// ==========================================
// 🔨 build.js - Simple Build Script
// รวม modules กลับเป็น frontend.js
// ไม่ต้อง install อะไร ใช้ Node.js ธรรมดา!
// ==========================================

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Building frontend.js...\n');

// อ่านไฟล์ต้นฉบับ
const originalPath = join(__dirname, '../day_off3_check/frontend.js');
let original = readFileSync(originalPath, 'utf-8');

// อ่าน modules
const constants = readFileSync(join(__dirname, 'src/modules/constants.js'), 'utf-8');
const state = readFileSync(join(__dirname, 'src/modules/state.js'), 'utf-8');
const api = readFileSync(join(__dirname, 'src/modules/api.js'), 'utf-8');
const helpers = readFileSync(join(__dirname, 'src/modules/helpers.js'), 'utf-8');

console.log('✅ อ่านไฟล์ต้นฉบับ');
console.log('✅ อ่าน modules ทั้งหมด');

// แปลง ES modules เป็น inline code
function moduleToInline(code, moduleName) {
  let inline = code;
  
  // ลบ comments ส่วนหัว
  inline = inline.replace(/\/\/ ={40,}[\s\S]*?\/\/ ={40,}\n/g, '');
  
  // แปลง export เป็น const/function ธรรมดา
  inline = inline.replace(/^export const /gm, 'const ');
  inline = inline.replace(/^export function /gm, 'function ');
  inline = inline.replace(/^export async function /gm, 'async function ');
  
  // ลบ import statements
  inline = inline.replace(/^import .+;$/gm, '');
  
  // ลบบรรทัดว่างซ้อนกัน
  inline = inline.replace(/\n{3,}/g, '\n\n');
  
  return inline.trim();
}

const constantsInline = moduleToInline(constants, 'constants');
const stateInline = moduleToInline(state, 'state');
const apiInline = moduleToInline(api, 'api');
const helpersInline = moduleToInline(helpers, 'helpers');

console.log('✅ แปลง modules เป็น inline code\n');

// สร้าง frontend.js ใหม่
let newFrontend = original;

// 1. แทนที่ Constants section
const constantsStart = newFrontend.indexOf('const DAYS = [');
const constantsEnd = newFrontend.indexOf('let KPI_ADMINS = KPI_ADMINS_DEFAULT;') + 'let KPI_ADMINS = KPI_ADMINS_DEFAULT;'.length;
if (constantsStart !== -1 && constantsEnd !== -1) {
  const before = newFrontend.substring(0, constantsStart);
  const after = newFrontend.substring(constantsEnd);
  newFrontend = before + constantsInline + '\nlet KPI_ADMINS = KPI_ADMINS_DEFAULT;' + after;
  console.log('✅ แทนที่ Constants section');
}

// 2. แทนที่ API section  
const apiStart = newFrontend.indexOf('async function api(p, m = \'GET\'');
const apiEnd = newFrontend.indexOf('// === TOAST');
if (apiStart !== -1 && apiEnd !== -1) {
  const before = newFrontend.substring(0, apiStart);
  const after = newFrontend.substring(apiEnd);
  newFrontend = before + apiInline + '\n\n' + after;
  console.log('✅ แทนที่ API section');
}

// 3. แทนที่ Helpers section
const helpersStart = newFrontend.indexOf('function toast(msg, err = false)');
const helpersEnd = newFrontend.indexOf('// === DATA ===');
if (helpersStart !== -1 && helpersEnd !== -1) {
  const before = newFrontend.substring(0, helpersStart);
  const after = newFrontend.substring(helpersEnd);
  newFrontend = before + helpersInline + '\n\n' + after;
  console.log('✅ แทนที่ Helpers section');
}

// เขียนไฟล์ออก
const outputPath = join(__dirname, 'frontend.js');
writeFileSync(outputPath, newFrontend, 'utf-8');

console.log('\n✅ Build complete!');
console.log('📦 Output: frontend.js');
console.log(`📏 Size: ${Math.round(newFrontend.length / 1024)}KB\n`);

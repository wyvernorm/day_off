// ==========================================
// 📦 main.js - Entry Point
// รวม modules ทั้งหมดที่นี่
// ==========================================

// Import modules
import { DAYS, MON, SHIFT, LEAVE, ROLE_LEVEL, ROLE_LABELS } from './modules/constants.js';
import { api, loadOverview, getPendingLeaves, approveLeave, rejectLeave } from './modules/api.js';
import { toast, h, ce, dk, formatDateThai } from './modules/ui.js';
import { state, setState } from './modules/state.js';

// Import components (จะสร้างภายหลัง)
// import { Calendar } from './components/Calendar.js';
// import { Roster } from './components/Roster.js';

// Export เพื่อให้ใช้ใน frontend.js
export function getLoginHTML(appUrl, errorMsg = '', appName = '') {
  const title = appName || 'ระบบจัดการกะ & วันลา';
  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 ${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans Thai',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center}
.card{background:#fff;border-radius:24px;padding:48px 40px;max-width:420px;width:90%;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.3)}
.icon{font-size:64px;margin-bottom:16px}
.title{font-size:28px;font-weight:800;color:#1e293b;margin-bottom:8px}
.sub{font-size:15px;color:#64748b;margin-bottom:32px;line-height:1.6}
.google-btn{display:inline-flex;align-items:center;gap:12px;padding:14px 32px;border:2px solid #e2e8f0;border-radius:14px;background:#fff;font-size:16px;font-weight:700;color:#1e293b;text-decoration:none;transition:all 0.2s}
.google-btn:hover{border-color:#4285f4;background:#f8faff;transform:translateY(-1px)}
.google-btn img{width:24px;height:24px}
.error{background:#fef2f2;color:#ef4444;padding:12px 16px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:20px}
</style></head><body>
<div class="card">
  <div class="icon">📅</div>
  <div class="title">${title}</div>
  <div class="sub">เข้าสู่ระบบด้วย Google Account</div>
  ${errorMsg ? '<div class="error">⚠️ ' + errorMsg.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') + '</div>' : ''}
  <a href="/auth/login" class="google-btn">
    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G">
    เข้าสู่ระบบด้วย Google
  </a>
</div></body></html>`;
}

export function getHTML(currentUser) {
  const UJ = JSON.stringify({
    id: currentUser.employee_id,
    name: currentUser.name,
    nickname: currentUser.nickname,
    email: currentUser.email,
    role: currentUser.role,
    avatar: currentUser.avatar,
    profile_image: currentUser.profile_image,
    show_in_calendar: currentUser.show_in_calendar,
  });

  // CSS จะถูก inject ตอน build
  const CSS = typeof __CSS__ !== 'undefined' ? __CSS__ : '';

  return `<!DOCTYPE html><html lang="th-u-hc-h23"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>
${CSS}
</style>
</head><body>
<div class="ctn" id="app"></div>
<div class="tst" id="toast"></div>

<script type="module">
// ==========================================
// 📦 Constants (from modules/constants.js)
// ==========================================
const DAYS = ${JSON.stringify(DAYS)};
const MON = ${JSON.stringify(MON)};
const SHIFT = ${JSON.stringify(SHIFT)};
const LEAVE = ${JSON.stringify(LEAVE)};
const ROLE_LEVEL = ${JSON.stringify(ROLE_LEVEL)};
const ROLE_LABELS = ${JSON.stringify(ROLE_LABELS)};

// ==========================================
// 👤 User Data
// ==========================================
const U = ${UJ};

// ==========================================
// 🗂️ State Management
// ==========================================
let D = {
  y: ${new Date().getFullYear()},
  m: ${new Date().getMonth()},
  v: 'calendar',
  days: {},
  employees: [],
  leaves: [],
  swaps: [],
  holidays: [],
  settings: {},
};

// ==========================================
// 🌐 API Functions
// ==========================================
async function api(path, method = 'GET', body = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  const r = await fetch(path, options);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Error');
  return d;
}

async function load() {
  try {
    const monthStr = D.y + '-' + String(D.m + 1).padStart(2, '0');
    const data = await api('/api/overview?month=' + monthStr);
    Object.assign(D, data);
    render();
  } catch (err) {
    toast(err.message, true);
  }
}

// ==========================================
// 🎨 UI Helpers
// ==========================================
let _toastTimer;
function toast(msg, err = false) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = 'tst show' + (err ? ' err' : '');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'tst'; }, 2500);
}

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.substring(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  children.flat().forEach(c => {
    if (typeof c === 'string' || typeof c === 'number') el.appendChild(document.createTextNode(c));
    else if (c instanceof HTMLElement) el.appendChild(c);
  });
  return el;
}

// ==========================================
// 🖼️ Render Function
// ==========================================
function render() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = '';
  app.appendChild(h('div', {}, 
    h('h1', {}, '📅 ระบบจัดการกะ & วันลา'),
    h('p', {}, 'กำลังพัฒนา... (Built with Modules!)')
  ));
}

// ==========================================
// 🚀 Initialize
// ==========================================
load();
</script>
</body></html>`;
}

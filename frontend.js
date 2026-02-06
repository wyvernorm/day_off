// =============================================
// Frontend - Single HTML served from Worker
// =============================================

export function getHTML() {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #f7f8fc;
  --surface: #ffffff;
  --border: #e5e7eb;
  --text: #1e293b;
  --text-sub: #64748b;
  --primary: #3b82f6;
  --primary-bg: #eff6ff;
  --danger: #ef4444;
  --danger-bg: #fef2f2;
  --success: #10b981;
  --success-bg: #ecfdf5;
  --warning: #f59e0b;
  --warning-bg: #fffbeb;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Noto Sans Thai', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}
button { font-family: inherit; cursor: pointer; }
.container { max-width: 1400px; margin: 0 auto; padding: 16px 20px; }

/* Header */
.header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
}
.header h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
.header p { font-size: 13px; color: var(--text-sub); margin-top: 2px; }

/* Tabs */
.tabs {
  display: flex; gap: 3px; background: var(--surface); padding: 4px;
  border-radius: 10px; border: 1px solid var(--border);
}
.tab {
  padding: 8px 16px; border: none; border-radius: 8px; font-size: 13px;
  font-weight: 600; background: transparent; color: var(--text-sub);
  transition: all 0.15s;
}
.tab.active { background: var(--primary); color: #fff; }
.tab:hover:not(.active) { background: #f1f5f9; }

/* Month nav */
.month-nav {
  display: flex; align-items: center; gap: 10px; background: var(--surface);
  padding: 10px 16px; border-radius: var(--radius); border: 1px solid var(--border);
  margin-bottom: 16px; flex-wrap: wrap;
}
.month-nav h2 { font-size: 18px; font-weight: 700; min-width: 180px; text-align: center; }
.nav-btn {
  border: none; background: #f1f5f9; width: 34px; height: 34px; border-radius: 8px;
  font-size: 16px; font-weight: 700; color: #475569;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.nav-btn:hover { background: #e2e8f0; }
.today-btn {
  border: 1px solid var(--primary); background: var(--primary-bg); padding: 5px 14px;
  border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--primary);
}
.spacer { flex: 1; }
.action-btn {
  border: none; padding: 7px 14px; border-radius: 8px; font-size: 12px;
  font-weight: 700; transition: all 0.15s;
}
.action-btn:hover { filter: brightness(0.95); }
.action-btn.leave { background: var(--danger-bg); color: var(--danger); }
.action-btn.swap { background: var(--success-bg); color: var(--success); }

/* Legend */
.legend {
  display: flex; gap: 10px; flex-wrap: wrap; padding: 8px 14px;
  background: var(--surface); border-radius: 10px; border: 1px solid var(--border);
  margin-bottom: 16px; font-size: 12px;
}
.legend-item { display: flex; align-items: center; gap: 4px; color: var(--text-sub); }
.legend-icon {
  width: 20px; height: 20px; border-radius: 6px; display: flex;
  align-items: center; justify-content: center; font-size: 11px;
}
.legend-sep { width: 1px; background: var(--border); align-self: stretch; }

/* Calendar Grid */
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-header {
  text-align: center; padding: 8px 0; font-weight: 700; font-size: 13px; color: #475569;
}
.cal-header.weekend { color: var(--danger); }
.cal-day {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 8px; min-height: 95px; cursor: pointer; transition: all 0.15s; position: relative;
}
.cal-day:hover { box-shadow: var(--shadow-lg); transform: translateY(-1px); z-index: 1; }
.cal-day.today { border: 2px solid var(--primary); background: var(--primary-bg); }
.cal-day.weekend-day { background: #fefefe; }
.cal-day.holiday { background: #fffbf0; border-color: #fbbf24; }
.day-num {
  font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px;
  display: flex; align-items: center; gap: 4px;
}
.day-num.today-num { font-weight: 800; color: var(--primary); }
.day-num .badge {
  font-size: 8px; padding: 1px 5px; border-radius: 6px; font-weight: 700;
}
.holiday-name {
  font-size: 9px; color: #d97706; font-weight: 600; margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.shift-tag {
  display: flex; align-items: center; gap: 2px; font-size: 10px;
  font-weight: 600; padding: 2px 5px; border-radius: 5px; margin-bottom: 2px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.leave-tag {
  font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 5px;
  margin-top: 1px;
}

/* Roster Table */
.roster-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); }
.roster { width: 100%; border-collapse: collapse; font-size: 12px; }
.roster th {
  padding: 10px 4px; text-align: center; background: #f8fafc;
  border-bottom: 2px solid var(--border); font-weight: 700; position: relative;
}
.roster th.sticky { position: sticky; left: 0; z-index: 3; min-width: 130px; text-align: left; padding-left: 14px; }
.roster th.today-col { background: var(--primary-bg); }
.roster th.weekend-col { background: #fff1f2; color: var(--danger); }
.roster th.holiday-col { background: #fffbeb; color: #d97706; }
.roster th .day-label { font-size: 9px; opacity: 0.7; }
.roster td { text-align: center; padding: 3px; border-bottom: 1px solid #f1f5f9; }
.roster td.sticky {
  position: sticky; left: 0; background: #fff; z-index: 2;
  text-align: left; padding: 8px 14px;
}
.roster td.today-col { background: #f0f7ff; }
.emp-cell { display: flex; align-items: center; gap: 8px; }
.emp-avatar { font-size: 20px; }
.emp-name { font-weight: 700; color: var(--text); font-size: 12px; }
.emp-role { font-size: 10px; color: var(--text-sub); }
.shift-cell {
  width: 32px; height: 32px; border-radius: 8px; display: flex;
  align-items: center; justify-content: center; margin: 0 auto;
  font-size: 13px; cursor: pointer; transition: all 0.15s;
}
.shift-cell:hover { transform: scale(1.25); }

/* Stats Cards */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
.stat-card {
  background: var(--surface); border-radius: var(--radius); padding: 18px;
  border: 1px solid var(--border); transition: all 0.2s;
}
.stat-card:hover { box-shadow: var(--shadow); }
.stat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.stat-avatar { font-size: 32px; }
.stat-name { font-size: 15px; font-weight: 700; }
.stat-role { font-size: 11px; color: var(--text-sub); }
.stat-section-title { font-size: 11px; font-weight: 700; color: var(--text-sub); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
.stat-tag {
  display: flex; align-items: center; gap: 3px; padding: 3px 8px;
  border-radius: 6px; font-size: 11px; font-weight: 600;
}
.quota-row { margin-bottom: 8px; }
.quota-header { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-sub); margin-bottom: 3px; }
.quota-bar { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.quota-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }

/* Pending cards */
.pending-section { margin-top: 20px; }
.pending-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.pending-card {
  background: var(--surface); border-radius: var(--radius); padding: 14px 18px;
  border: 1px solid var(--border); margin-bottom: 8px;
  display: flex; justify-content: space-between; align-items: center; gap: 12px;
  flex-wrap: wrap;
}
.pending-info { display: flex; align-items: center; gap: 10px; }
.pending-actions { display: flex; gap: 6px; }
.btn-approve {
  border: none; background: var(--success); color: #fff; padding: 6px 14px;
  border-radius: 8px; font-size: 12px; font-weight: 700;
}
.btn-reject {
  border: 1px solid var(--danger); background: #fff; color: var(--danger); padding: 6px 14px;
  border-radius: 8px; font-size: 12px; font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);
  animation: fadeIn 0.15s ease;
}
.modal {
  background: #fff; border-radius: 16px; padding: 24px; min-width: 380px; max-width: 520px;
  box-shadow: var(--shadow-lg); max-height: 85vh; overflow: auto;
  animation: slideUp 0.2s ease;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.modal-title { font-size: 16px; font-weight: 700; }
.modal-close {
  border: none; background: #f1f5f9; width: 30px; height: 30px; border-radius: 8px;
  font-size: 14px; display: flex; align-items: center; justify-content: center;
}
.emp-row {
  padding: 10px 12px; border-radius: 10px; margin-bottom: 6px;
  border: 1px solid var(--border); cursor: pointer; transition: all 0.15s;
}
.emp-row:hover { border-color: var(--primary); }
.emp-row.selected { border-color: var(--primary); background: var(--primary-bg); }
.emp-row-header { display: flex; align-items: center; gap: 8px; }
.emp-row-shift {
  margin-left: auto; padding: 3px 8px; border-radius: 6px;
  font-size: 11px; font-weight: 700;
}
.pill-group { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 8px; }
.pill {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px;
  border-radius: 16px; border: 2px solid transparent; font-size: 12px;
  font-weight: 600; background: #f8fafc; color: var(--text-sub);
  transition: all 0.15s;
}
.pill.active { transform: scale(1.05); }
.section-label { font-size: 11px; font-weight: 700; color: var(--text-sub); margin: 8px 0 4px; text-transform: uppercase; }
.submit-btn {
  width: 100%; padding: 11px 0; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 700; color: #fff; margin-top: 12px;
}
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Form */
.form-group { margin-bottom: 14px; }
.form-label { display: block; font-size: 12px; font-weight: 700; color: var(--text-sub); margin-bottom: 6px; }
.form-input {
  width: 100%; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px;
  font-size: 13px; font-family: inherit; outline: none; transition: border 0.15s;
}
.form-input:focus { border-color: var(--primary); }
select.form-input { cursor: pointer; }
textarea.form-input { resize: vertical; min-height: 60px; }

/* Toast */
.toast {
  position: fixed; top: 20px; right: 20px; z-index: 2000;
  background: #fff; padding: 12px 20px; border-radius: 10px;
  box-shadow: var(--shadow-lg); font-weight: 600; font-size: 13px;
  border-left: 4px solid var(--success); animation: notifIn 0.3s ease;
}
.toast.error { border-left-color: var(--danger); }

/* Responsive */
@media (max-width: 768px) {
  .cal-grid { grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .cal-day { padding: 4px; min-height: 70px; }
  .shift-tag { font-size: 8px; padding: 1px 3px; }
  .header h1 { font-size: 18px; }
  .month-nav h2 { font-size: 15px; min-width: 140px; }
  .stats-grid { grid-template-columns: 1fr; }
  .modal { min-width: 320px; margin: 10px; }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes notifIn { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }
</style>
</head>
<body>
<div class="container" id="app"></div>

<script>
// =============================================
// App State & Config
// =============================================
const API = '';
const DAYS_TH = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const MONTHS_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const SHIFT_TYPES = {
  morning: { label: 'เช้า', time: '06:00-14:00', color: '#f59e0b', bg: '#fef3c7', icon: '☀️' },
  afternoon: { label: 'บ่าย', time: '14:00-22:00', color: '#f97316', bg: '#ffedd5', icon: '🌤️' },
  night: { label: 'ดึก', time: '22:00-06:00', color: '#6366f1', bg: '#e0e7ff', icon: '🌙' },
  off: { label: 'วันหยุด', time: '', color: '#10b981', bg: '#d1fae5', icon: '🏖️' },
};

const LEAVE_TYPES = {
  sick: { label: 'ลาป่วย', color: '#ef4444', bg: '#fee2e2', icon: '🏥', max: 30 },
  personal: { label: 'ลากิจ', color: '#8b5cf6', bg: '#ede9fe', icon: '📋', max: 6 },
  vacation: { label: 'พักร้อน', color: '#06b6d4', bg: '#cffafe', icon: '✈️', max: 10 },
  maternity: { label: 'ลาคลอด', color: '#ec4899', bg: '#fce7f3', icon: '👶', max: 90 },
};

const state = {
  view: 'calendar',
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  employees: [],
  shifts: {},        // "empId-YYYY-MM-DD" -> shift_type
  leaves: {},        // "empId-YYYY-MM-DD" -> {type, status, id}
  holidays: {},      // "YYYY-MM-DD" -> name
  pendingLeaves: [],
  pendingSwaps: [],
  selectedDate: null,
  selectedEmployee: null,
  modal: null,       // null, 'day', 'leave', 'swap', 'employee'
  loading: false,
  toast: null,
};

// =============================================
// API Helpers
// =============================================
async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด');
  return data;
}

function showToast(msg, isError = false) {
  state.toast = { msg, isError };
  render();
  setTimeout(() => { state.toast = null; render(); }, 2500);
}

// =============================================
// Data Loading
// =============================================
async function loadData() {
  state.loading = true;
  render();
  try {
    const monthStr = state.year + '-' + String(state.month + 1).padStart(2, '0');

    const [overview, pendLeaves, pendSwaps] = await Promise.all([
      api('/api/overview?month=' + monthStr),
      api('/api/leaves?status=pending'),
      api('/api/swaps?status=pending'),
    ]);

    state.employees = overview.data.employees;

    // Index shifts
    state.shifts = {};
    overview.data.shifts.forEach(s => {
      state.shifts[s.employee_id + '-' + s.date] = s.shift_type;
    });

    // Index leaves
    state.leaves = {};
    overview.data.leaves.forEach(l => {
      state.leaves[l.employee_id + '-' + l.date] = { type: l.leave_type, status: l.status, id: l.id };
    });

    // Index holidays
    state.holidays = {};
    overview.data.holidays.forEach(h => {
      state.holidays[h.date] = h.name;
    });

    state.pendingLeaves = pendLeaves.data;
    state.pendingSwaps = pendSwaps.data;
  } catch (err) {
    console.error(err);
    showToast('โหลดข้อมูลไม่สำเร็จ: ' + err.message, true);
  }
  state.loading = false;
  render();
}

// =============================================
// Utility
// =============================================
function dateKey(y, m, d) {
  return y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
}
function isToday(y, m, d) {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
}
function getDayOfWeek(y, m, d) { return new Date(y, m, d).getDay(); }
function isWeekend(y, m, d) { const dow = getDayOfWeek(y, m, d); return dow === 0 || dow === 6; }
function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfMonth(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

function getShift(empId, date) {
  return state.shifts[empId + '-' + date];
}
function getLeave(empId, date) {
  return state.leaves[empId + '-' + date];
}
function getDefaultShift(empId) {
  const emp = state.employees.find(e => e.id === empId);
  return emp?.default_shift || 'morning';
}
function getDisplayShift(empId, date) {
  const leave = getLeave(empId, date);
  if (leave) return { isLeave: true, ...LEAVE_TYPES[leave.type], leaveStatus: leave.status };
  const shift = getShift(empId, date) || getDefaultShift(empId);
  return { isLeave: false, ...SHIFT_TYPES[shift], shiftType: shift };
}

// =============================================
// Rendering
// =============================================
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style' && typeof v === 'object') {
      Object.assign(el.style, v);
    } else if (k.startsWith('on')) {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'className') {
      el.className = v;
    } else if (k === 'innerHTML') {
      el.innerHTML = v;
    } else {
      el.setAttribute(k, v);
    }
  }
  children.flat(Infinity).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
  });
  return el;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(renderHeader());
  app.appendChild(renderMonthNav());
  app.appendChild(renderLegend());

  if (state.view === 'calendar') app.appendChild(renderCalendar());
  else if (state.view === 'roster') app.appendChild(renderRoster());
  else if (state.view === 'stats') app.appendChild(renderStats());
  else if (state.view === 'pending') app.appendChild(renderPending());

  if (state.modal === 'day') app.appendChild(renderDayModal());
  if (state.modal === 'leave') app.appendChild(renderLeaveModal());
  if (state.modal === 'swap') app.appendChild(renderSwapModal());
  if (state.modal === 'employee') app.appendChild(renderEmployeeModal());

  if (state.toast) {
    app.appendChild(h('div', { className: 'toast' + (state.toast.isError ? ' error' : '') }, state.toast.msg));
  }
}

function renderHeader() {
  const pendingCount = state.pendingLeaves.length + state.pendingSwaps.length;
  return h('div', { className: 'header' },
    h('div', {},
      h('h1', {}, '📅 ระบบจัดการกะ & วันลา'),
      h('p', {}, 'จัดตารางกะ สลับกะ ลางาน ดูสถิติ — ทุกอย่างในที่เดียว'),
    ),
    h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } },
      h('div', { className: 'tabs' },
        ...['calendar','roster','stats','pending'].map(v => {
          const labels = { calendar: '📅 ปฏิทิน', roster: '📋 ตารางกะ', stats: '📊 สถิติ', pending: '🔔 รออนุมัติ' };
          let label = labels[v];
          if (v === 'pending' && pendingCount > 0) label += ' (' + pendingCount + ')';
          return h('button', {
            className: 'tab' + (state.view === v ? ' active' : ''),
            onClick: () => { state.view = v; render(); },
          }, label);
        })
      ),
    )
  );
}

function renderMonthNav() {
  return h('div', { className: 'month-nav' },
    h('button', { className: 'nav-btn', onClick: () => {
      if (state.month === 0) { state.month = 11; state.year--; } else state.month--;
      loadData();
    }}, '‹'),
    h('h2', {}, MONTHS_TH[state.month] + ' ' + (state.year + 543)),
    h('button', { className: 'nav-btn', onClick: () => {
      if (state.month === 11) { state.month = 0; state.year++; } else state.month++;
      loadData();
    }}, '›'),
    h('button', { className: 'today-btn', onClick: () => {
      state.month = new Date().getMonth();
      state.year = new Date().getFullYear();
      loadData();
    }}, 'วันนี้'),
    h('div', { className: 'spacer' }),
    h('button', { className: 'action-btn leave', onClick: () => {
      state.modal = 'leave'; state.selectedDate = dateKey(state.year, state.month, new Date().getDate());
      render();
    }}, '+ ลางาน'),
    h('button', { className: 'action-btn swap', onClick: () => {
      state.modal = 'swap'; state.selectedDate = dateKey(state.year, state.month, new Date().getDate());
      render();
    }}, '🔄 สลับกะ'),
    h('button', { className: 'action-btn', style: { background: '#eff6ff', color: '#3b82f6' }, onClick: () => {
      state.modal = 'employee'; render();
    }}, '👤 จัดการพนักงาน'),
  );
}

function renderLegend() {
  return h('div', { className: 'legend' },
    ...Object.entries(SHIFT_TYPES).map(([k, v]) =>
      h('div', { className: 'legend-item' },
        h('span', { className: 'legend-icon', style: { background: v.bg } }, v.icon),
        h('span', { style: { fontWeight: 600 } }, v.label),
        v.time ? h('span', { style: { color: '#94a3b8' } }, v.time) : null,
      )
    ),
    h('div', { className: 'legend-sep' }),
    ...Object.entries(LEAVE_TYPES).map(([k, v]) =>
      h('div', { className: 'legend-item' },
        h('span', {}, v.icon),
        h('span', { style: { fontWeight: 600 } }, v.label),
      )
    ),
  );
}

// =============================================
// Calendar View
// =============================================
function renderCalendar() {
  const grid = h('div', { className: 'cal-grid' });

  // Headers
  DAYS_TH.forEach((d, i) => {
    grid.appendChild(h('div', { className: 'cal-header' + (i >= 5 ? ' weekend' : '') }, d));
  });

  // Empty cells
  const fd = firstDayOfMonth(state.year, state.month);
  for (let i = 0; i < fd; i++) grid.appendChild(h('div'));

  // Days
  const dim = daysInMonth(state.year, state.month);
  for (let d = 1; d <= dim; d++) {
    const dk = dateKey(state.year, state.month, d);
    const td = isToday(state.year, state.month, d);
    const we = isWeekend(state.year, state.month, d);
    const hol = state.holidays[dk];

    const dayEl = h('div', {
      className: 'cal-day' + (td ? ' today' : '') + (we ? ' weekend-day' : '') + (hol ? ' holiday' : ''),
      onClick: () => { state.selectedDate = dk; state.modal = 'day'; state.selectedEmployee = null; render(); },
    });

    // Day number
    const numEl = h('div', { className: 'day-num' + (td ? ' today-num' : '') }, String(d));
    if (td) numEl.appendChild(h('span', { className: 'badge', style: { background: '#3b82f6', color: '#fff' } }, 'วันนี้'));
    dayEl.appendChild(numEl);

    // Holiday
    if (hol) dayEl.appendChild(h('div', { className: 'holiday-name' }, '🔴 ' + hol));

    // Group shifts
    const shiftGroups = {};
    const onLeave = [];
    state.employees.forEach(emp => {
      const leave = getLeave(emp.id, dk);
      if (leave) { onLeave.push(emp); return; }
      const shift = getShift(emp.id, dk) || (we ? 'off' : getDefaultShift(emp.id));
      if (!shiftGroups[shift]) shiftGroups[shift] = [];
      shiftGroups[shift].push(emp);
    });

    let shown = 0;
    for (const [type, emps] of Object.entries(shiftGroups)) {
      if (shown >= 3) break;
      const info = SHIFT_TYPES[type];
      if (!info) continue;
      const names = emps.map(e => (e.nickname || e.name).slice(0, 5)).join(', ');
      dayEl.appendChild(h('div', { className: 'shift-tag', style: { background: info.bg, color: info.color } },
        info.icon + ' ' + names
      ));
      shown++;
    }

    if (onLeave.length > 0) {
      dayEl.appendChild(h('div', { className: 'leave-tag', style: { background: '#fee2e2', color: '#ef4444' } },
        '🏥 ลา ' + onLeave.length + ' คน'
      ));
    }

    grid.appendChild(dayEl);
  }

  return grid;
}

// =============================================
// Roster View
// =============================================
function renderRoster() {
  const dim = daysInMonth(state.year, state.month);
  const wrap = h('div', { className: 'roster-wrap' });
  const table = h('table', { className: 'roster' });
  const thead = h('thead');
  const hrow = h('tr');

  hrow.appendChild(h('th', { className: 'sticky' }, 'พนักงาน'));
  for (let d = 1; d <= dim; d++) {
    const dk = dateKey(state.year, state.month, d);
    const td = isToday(state.year, state.month, d);
    const we = isWeekend(state.year, state.month, d);
    const hol = state.holidays[dk];
    let cls = '';
    if (td) cls = 'today-col';
    else if (hol) cls = 'holiday-col';
    else if (we) cls = 'weekend-col';

    const dow = getDayOfWeek(state.year, state.month, d);
    const dowIdx = dow === 0 ? 6 : dow - 1;
    hrow.appendChild(h('th', { className: cls, style: { minWidth: '38px' } },
      h('div', {}, String(d)),
      h('div', { className: 'day-label' }, DAYS_TH[dowIdx]),
    ));
  }
  thead.appendChild(hrow);
  table.appendChild(thead);

  const tbody = h('tbody');
  state.employees.forEach(emp => {
    const row = h('tr');
    row.appendChild(h('td', { className: 'sticky' },
      h('div', { className: 'emp-cell' },
        h('span', { className: 'emp-avatar' }, emp.avatar),
        h('div', {},
          h('div', { className: 'emp-name' }, emp.nickname || emp.name),
          h('div', { className: 'emp-role' }, emp.role === 'admin' ? 'แอดมิน' : emp.role === 'lead' ? 'หัวหน้า' : 'พนักงาน'),
        ),
      ),
    ));

    for (let d = 1; d <= dim; d++) {
      const dk = dateKey(state.year, state.month, d);
      const td = isToday(state.year, state.month, d);
      const we = isWeekend(state.year, state.month, d);
      const info = getDisplayShift(emp.id, dk);
      // If no shift data and is weekend, show off
      let displayInfo = info;
      if (!info.isLeave && !getShift(emp.id, dk) && we) {
        displayInfo = { isLeave: false, ...SHIFT_TYPES.off, shiftType: 'off' };
      }

      const cell = h('td', { className: td ? 'today-col' : '' },
        h('div', {
          className: 'shift-cell',
          style: { background: displayInfo.bg },
          title: displayInfo.isLeave ? displayInfo.label : (displayInfo.label + ' ' + (displayInfo.time || '')),
          onClick: () => {
            state.selectedDate = dk; state.selectedEmployee = emp.id; state.modal = 'day'; render();
          },
        }, displayInfo.icon),
      );
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

// =============================================
// Stats View
// =============================================
function renderStats() {
  const grid = h('div', { className: 'stats-grid' });
  const dim = daysInMonth(state.year, state.month);

  state.employees.forEach(emp => {
    const shiftCounts = { morning: 0, afternoon: 0, night: 0, off: 0 };
    const leaveCounts = { sick: 0, personal: 0, vacation: 0, maternity: 0 };

    for (let d = 1; d <= dim; d++) {
      const dk = dateKey(state.year, state.month, d);
      const leave = getLeave(emp.id, dk);
      if (leave) { leaveCounts[leave.type] = (leaveCounts[leave.type] || 0) + 1; continue; }
      const shift = getShift(emp.id, dk) || (isWeekend(state.year, state.month, d) ? 'off' : getDefaultShift(emp.id));
      shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
    }

    const card = h('div', { className: 'stat-card' },
      h('div', { className: 'stat-header' },
        h('span', { className: 'stat-avatar' }, emp.avatar),
        h('div', {},
          h('div', { className: 'stat-name' }, emp.nickname || emp.name),
          h('div', { className: 'stat-role' }, emp.role === 'admin' ? 'แอดมิน' : emp.role === 'lead' ? 'หัวหน้า' : 'พนักงาน'),
        ),
      ),
      h('div', { className: 'stat-section-title' }, 'กะทำงานเดือนนี้'),
      h('div', { className: 'stat-tags' },
        ...Object.entries(shiftCounts).filter(([_, v]) => v > 0).map(([type, count]) => {
          const info = SHIFT_TYPES[type];
          return h('div', { className: 'stat-tag', style: { background: info.bg, color: info.color } },
            info.icon + ' ' + info.label + ' ' + count + ' วัน'
          );
        }),
      ),
      h('div', { className: 'stat-section-title' }, 'โควต้าวันลา (ทั้งปี)'),
      ...Object.entries(LEAVE_TYPES).map(([type, info]) => {
        const used = leaveCounts[type];
        const max = emp['max_' + type + '_leave'] || info.max;
        const pct = max > 0 ? (used / max) * 100 : 0;
        return h('div', { className: 'quota-row' },
          h('div', { className: 'quota-header' },
            h('span', {}, info.icon + ' ' + info.label),
            h('span', { style: { fontWeight: 700, color: info.color } }, used + '/' + max),
          ),
          h('div', { className: 'quota-bar' },
            h('div', { className: 'quota-fill', style: { width: pct + '%', background: info.color } }),
          ),
        );
      }),
    );
    grid.appendChild(card);
  });

  return grid;
}

// =============================================
// Pending View
// =============================================
function renderPending() {
  const section = h('div', { className: 'pending-section' });

  // Pending leaves
  section.appendChild(h('div', { className: 'pending-title' }, '📋 วันลารออนุมัติ (' + state.pendingLeaves.length + ')'));
  if (state.pendingLeaves.length === 0) {
    section.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '13px', marginBottom: '20px' } }, 'ไม่มีรายการรออนุมัติ ✅'));
  }
  state.pendingLeaves.forEach(leave => {
    const info = LEAVE_TYPES[leave.leave_type];
    section.appendChild(h('div', { className: 'pending-card' },
      h('div', { className: 'pending-info' },
        h('span', { style: { fontSize: '24px' } }, leave.avatar),
        h('div', {},
          h('div', { style: { fontWeight: 700, fontSize: '13px' } }, leave.employee_name),
          h('div', { style: { fontSize: '12px', color: '#64748b' } },
            info.icon + ' ' + info.label + ' — ' + leave.date + (leave.reason ? ' (' + leave.reason + ')' : '')
          ),
        ),
      ),
      h('div', { className: 'pending-actions' },
        h('button', { className: 'btn-approve', onClick: async () => {
          try {
            await api('/api/leaves/' + leave.id + '/approve', 'PUT', { approved_by: 1 });
            showToast('✅ อนุมัติวันลาสำเร็จ');
            loadData();
          } catch (e) { showToast(e.message, true); }
        }}, '✅ อนุมัติ'),
        h('button', { className: 'btn-reject', onClick: async () => {
          try {
            await api('/api/leaves/' + leave.id + '/reject', 'PUT', { approved_by: 1 });
            showToast('❌ ปฏิเสธวันลา');
            loadData();
          } catch (e) { showToast(e.message, true); }
        }}, '❌ ปฏิเสธ'),
      ),
    ));
  });

  // Pending swaps
  section.appendChild(h('div', { className: 'pending-title', style: { marginTop: '24px' } }, '🔄 สลับกะรออนุมัติ (' + state.pendingSwaps.length + ')'));
  if (state.pendingSwaps.length === 0) {
    section.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '13px' } }, 'ไม่มีรายการรออนุมัติ ✅'));
  }
  state.pendingSwaps.forEach(swap => {
    section.appendChild(h('div', { className: 'pending-card' },
      h('div', { className: 'pending-info' },
        h('span', { style: { fontSize: '20px' } }, swap.from_avatar),
        h('div', {},
          h('div', { style: { fontWeight: 700, fontSize: '13px' } },
            swap.from_name + ' ↔ ' + swap.to_name
          ),
          h('div', { style: { fontSize: '12px', color: '#64748b' } },
            'วันที่ ' + swap.date + ' | ' +
            SHIFT_TYPES[swap.from_shift]?.icon + SHIFT_TYPES[swap.from_shift]?.label + ' ↔ ' +
            SHIFT_TYPES[swap.to_shift]?.icon + SHIFT_TYPES[swap.to_shift]?.label
          ),
        ),
      ),
      h('div', { className: 'pending-actions' },
        h('button', { className: 'btn-approve', onClick: async () => {
          try {
            await api('/api/swaps/' + swap.id + '/approve', 'PUT', { approved_by: 1 });
            showToast('✅ อนุมัติสลับกะสำเร็จ');
            loadData();
          } catch (e) { showToast(e.message, true); }
        }}, '✅ อนุมัติ'),
        h('button', { className: 'btn-reject', onClick: async () => {
          try {
            await api('/api/swaps/' + swap.id + '/reject', 'PUT', { approved_by: 1 });
            showToast('❌ ปฏิเสธ');
            loadData();
          } catch (e) { showToast(e.message, true); }
        }}, '❌ ปฏิเสธ'),
      ),
    ));
  });

  return section;
}

// =============================================
// Day Detail Modal
// =============================================
function renderDayModal() {
  const dk = state.selectedDate;
  if (!dk) return h('div');
  const parts = dk.split('-');
  const dayNum = parseInt(parts[2]);
  const monthIdx = parseInt(parts[1]) - 1;
  const hol = state.holidays[dk];

  const overlay = h('div', { className: 'modal-overlay', onClick: () => { state.modal = null; render(); } });
  const modal = h('div', { className: 'modal', onClick: e => e.stopPropagation() });

  modal.appendChild(h('div', { className: 'modal-header' },
    h('div', { className: 'modal-title' }, '📅 ' + dayNum + ' ' + MONTHS_TH[monthIdx] + ' ' + (parseInt(parts[0]) + 543) + (hol ? ' — 🔴 ' + hol : '')),
    h('button', { className: 'modal-close', onClick: () => { state.modal = null; render(); } }, '✕'),
  ));

  state.employees.forEach(emp => {
    const leave = getLeave(emp.id, dk);
    const shift = getShift(emp.id, dk) || (isWeekend(parseInt(parts[0]), monthIdx, dayNum) ? 'off' : getDefaultShift(emp.id));
    const isSel = state.selectedEmployee === emp.id;

    const row = h('div', {
      className: 'emp-row' + (isSel ? ' selected' : ''),
      onClick: () => { state.selectedEmployee = isSel ? null : emp.id; render(); },
    });

    const header = h('div', { className: 'emp-row-header' },
      h('span', { style: { fontSize: '22px' } }, emp.avatar),
      h('div', {},
        h('div', { style: { fontWeight: 700, fontSize: '13px' } }, emp.nickname || emp.name),
        h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, emp.role === 'admin' ? 'แอดมิน' : emp.role === 'lead' ? 'หัวหน้า' : 'พนักงาน'),
      ),
    );

    if (leave) {
      const info = LEAVE_TYPES[leave.type];
      header.appendChild(h('span', { className: 'emp-row-shift', style: { background: info.bg, color: info.color } },
        info.icon + ' ' + info.label + (leave.status === 'pending' ? ' (รออนุมัติ)' : '')
      ));
    } else {
      const info = SHIFT_TYPES[shift];
      if (info) {
        header.appendChild(h('span', { className: 'emp-row-shift', style: { background: info.bg, color: info.color } },
          info.icon + ' ' + info.label + ' ' + (info.time || '')
        ));
      }
    }
    row.appendChild(header);

    // Expanded edit
    if (isSel) {
      row.appendChild(h('div', { className: 'section-label' }, 'เปลี่ยนกะ'));
      const shiftPills = h('div', { className: 'pill-group' });
      Object.entries(SHIFT_TYPES).forEach(([type, info]) => {
        const isActive = !leave && shift === type;
        const pill = h('button', {
          className: 'pill' + (isActive ? ' active' : ''),
          style: isActive ? { borderColor: info.color, background: info.bg, color: info.color } : {},
          onClick: async (e) => {
            e.stopPropagation();
            try {
              // Remove leave if exists
              if (leave) await api('/api/leaves/' + leave.id, 'DELETE');
              await api('/api/shifts', 'POST', { employee_id: emp.id, date: dk, shift_type: type });
              showToast(info.icon + ' ' + (emp.nickname || emp.name) + ' → ' + info.label);
              loadData();
            } catch (err) { showToast(err.message, true); }
          },
        }, info.icon + ' ' + info.label);
        shiftPills.appendChild(pill);
      });
      row.appendChild(shiftPills);

      row.appendChild(h('div', { className: 'section-label' }, 'ลางาน'));
      const leavePills = h('div', { className: 'pill-group' });
      Object.entries(LEAVE_TYPES).forEach(([type, info]) => {
        const isActive = leave && leave.type === type;
        const pill = h('button', {
          className: 'pill' + (isActive ? ' active' : ''),
          style: isActive ? { borderColor: info.color, background: info.bg, color: info.color } : {},
          onClick: async (e) => {
            e.stopPropagation();
            try {
              if (isActive) {
                await api('/api/leaves/' + leave.id, 'DELETE');
                showToast('❌ ยกเลิกลา ' + (emp.nickname || emp.name));
              } else {
                await api('/api/leaves', 'POST', { employee_id: emp.id, date: dk, leave_type: type });
                showToast(info.icon + ' ' + (emp.nickname || emp.name) + ' → ' + info.label);
              }
              loadData();
            } catch (err) { showToast(err.message, true); }
          },
        }, info.icon + ' ' + info.label);
        leavePills.appendChild(pill);
      });
      row.appendChild(leavePills);
    }

    modal.appendChild(row);
  });

  overlay.appendChild(modal);
  return overlay;
}

// =============================================
// Leave Modal
// =============================================
function renderLeaveModal() {
  const overlay = h('div', { className: 'modal-overlay', onClick: () => { state.modal = null; render(); } });
  const modal = h('div', { className: 'modal', onClick: e => e.stopPropagation() });

  modal.appendChild(h('div', { className: 'modal-header' },
    h('div', { className: 'modal-title' }, '📝 ลงวันลา'),
    h('button', { className: 'modal-close', onClick: () => { state.modal = null; render(); } }, '✕'),
  ));

  // Employee select
  const empGroup = h('div', { className: 'form-group' });
  empGroup.appendChild(h('label', { className: 'form-label' }, 'เลือกพนักงาน'));
  const empPills = h('div', { className: 'pill-group' });
  state.employees.forEach(emp => {
    const isActive = state.selectedEmployee === emp.id;
    empPills.appendChild(h('button', {
      className: 'pill' + (isActive ? ' active' : ''),
      style: isActive ? { borderColor: '#3b82f6', background: '#eff6ff', color: '#3b82f6' } : {},
      onClick: () => { state.selectedEmployee = emp.id; render(); },
    }, emp.avatar + ' ' + (emp.nickname || emp.name)));
  });
  empGroup.appendChild(empPills);
  modal.appendChild(empGroup);

  // Leave type
  let selectedLeaveType = 'sick';
  const typeGroup = h('div', { className: 'form-group' });
  typeGroup.appendChild(h('label', { className: 'form-label' }, 'ประเภทการลา'));
  const typePills = h('div', { className: 'pill-group' });
  Object.entries(LEAVE_TYPES).forEach(([type, info]) => {
    typePills.appendChild(h('button', {
      className: 'pill',
      id: 'ltype-' + type,
      style: type === 'sick' ? { borderColor: info.color, background: info.bg, color: info.color } : {},
      onClick: () => {
        selectedLeaveType = type;
        document.querySelectorAll('[id^=ltype-]').forEach(el => {
          const t = el.id.replace('ltype-', '');
          const i = LEAVE_TYPES[t];
          if (t === type) { el.style.borderColor = i.color; el.style.background = i.bg; el.style.color = i.color; }
          else { el.style.borderColor = 'transparent'; el.style.background = '#f8fafc'; el.style.color = '#64748b'; }
        });
      },
    }, info.icon + ' ' + info.label));
  });
  typeGroup.appendChild(typePills);
  modal.appendChild(typeGroup);

  // Date range
  const dateGroup = h('div', { className: 'form-group', style: { display: 'flex', gap: '10px' } });
  const startDate = h('input', { type: 'date', className: 'form-input', id: 'leave-start', value: state.selectedDate || '' });
  const endDate = h('input', { type: 'date', className: 'form-input', id: 'leave-end', value: state.selectedDate || '' });
  dateGroup.appendChild(h('div', { style: { flex: 1 } },
    h('label', { className: 'form-label' }, 'วันที่เริ่ม'), startDate));
  dateGroup.appendChild(h('div', { style: { flex: 1 } },
    h('label', { className: 'form-label' }, 'วันที่สิ้นสุด'), endDate));
  modal.appendChild(dateGroup);

  // Reason
  const reasonGroup = h('div', { className: 'form-group' });
  reasonGroup.appendChild(h('label', { className: 'form-label' }, 'เหตุผล (ถ้ามี)'));
  const reason = h('textarea', { className: 'form-input', id: 'leave-reason', placeholder: 'ระบุเหตุผล...' });
  reasonGroup.appendChild(reason);
  modal.appendChild(reasonGroup);

  // Submit
  modal.appendChild(h('button', {
    className: 'submit-btn',
    style: { background: '#3b82f6' },
    onClick: async () => {
      if (!state.selectedEmployee) { showToast('กรุณาเลือกพนักงาน', true); return; }
      const sd = document.getElementById('leave-start').value;
      const ed = document.getElementById('leave-end').value;
      const r = document.getElementById('leave-reason').value;
      if (!sd) { showToast('กรุณาเลือกวันที่', true); return; }
      try {
        if (sd === ed || !ed) {
          await api('/api/leaves', 'POST', {
            employee_id: state.selectedEmployee, date: sd,
            leave_type: selectedLeaveType, reason: r || null,
          });
        } else {
          await api('/api/leaves/range', 'POST', {
            employee_id: state.selectedEmployee, start_date: sd, end_date: ed,
            leave_type: selectedLeaveType, reason: r || null,
          });
        }
        showToast('✅ บันทึกวันลาสำเร็จ');
        state.modal = null;
        loadData();
      } catch (err) { showToast(err.message, true); }
    },
  }, 'บันทึกวันลา'));

  overlay.appendChild(modal);
  return overlay;
}

// =============================================
// Swap Modal
// =============================================
function renderSwapModal() {
  const overlay = h('div', { className: 'modal-overlay', onClick: () => { state.modal = null; render(); } });
  const modal = h('div', { className: 'modal', onClick: e => e.stopPropagation() });

  modal.appendChild(h('div', { className: 'modal-header' },
    h('div', { className: 'modal-title' }, '🔄 สลับกะทำงาน'),
    h('button', { className: 'modal-close', onClick: () => { state.modal = null; render(); } }, '✕'),
  ));

  // Date
  const dateGroup = h('div', { className: 'form-group' });
  dateGroup.appendChild(h('label', { className: 'form-label' }, 'วันที่สลับ'));
  dateGroup.appendChild(h('input', {
    type: 'date', className: 'form-input', id: 'swap-date',
    value: state.selectedDate || '',
  }));
  modal.appendChild(dateGroup);

  // Employee 1
  let swapFrom = null, swapTo = null;
  const emp1Group = h('div', { className: 'form-group' });
  emp1Group.appendChild(h('label', { className: 'form-label' }, 'พนักงานคนที่ 1'));
  const emp1Pills = h('div', { className: 'pill-group' });
  state.employees.forEach(emp => {
    emp1Pills.appendChild(h('button', {
      className: 'pill', id: 'sf-' + emp.id,
      onClick: () => {
        swapFrom = emp.id;
        document.querySelectorAll('[id^=sf-]').forEach(el => {
          el.style.borderColor = el.id === 'sf-' + emp.id ? '#f59e0b' : 'transparent';
          el.style.background = el.id === 'sf-' + emp.id ? '#fef3c7' : '#f8fafc';
          el.style.color = el.id === 'sf-' + emp.id ? '#f59e0b' : '#64748b';
        });
      },
    }, emp.avatar + ' ' + (emp.nickname || emp.name)));
  });
  emp1Group.appendChild(emp1Pills);
  modal.appendChild(emp1Group);

  modal.appendChild(h('div', { style: { textAlign: 'center', fontSize: '20px', margin: '4px 0' } }, '⇅'));

  // Employee 2
  const emp2Group = h('div', { className: 'form-group' });
  emp2Group.appendChild(h('label', { className: 'form-label' }, 'พนักงานคนที่ 2'));
  const emp2Pills = h('div', { className: 'pill-group' });
  state.employees.forEach(emp => {
    emp2Pills.appendChild(h('button', {
      className: 'pill', id: 'st-' + emp.id,
      onClick: () => {
        swapTo = emp.id;
        document.querySelectorAll('[id^=st-]').forEach(el => {
          el.style.borderColor = el.id === 'st-' + emp.id ? '#6366f1' : 'transparent';
          el.style.background = el.id === 'st-' + emp.id ? '#e0e7ff' : '#f8fafc';
          el.style.color = el.id === 'st-' + emp.id ? '#6366f1' : '#64748b';
        });
      },
    }, emp.avatar + ' ' + (emp.nickname || emp.name)));
  });
  emp2Group.appendChild(emp2Pills);
  modal.appendChild(emp2Group);

  // Reason
  const reasonGroup = h('div', { className: 'form-group' });
  reasonGroup.appendChild(h('label', { className: 'form-label' }, 'เหตุผล (ถ้ามี)'));
  reasonGroup.appendChild(h('textarea', { className: 'form-input', id: 'swap-reason', placeholder: 'ระบุเหตุผล...' }));
  modal.appendChild(reasonGroup);

  // Submit
  modal.appendChild(h('button', {
    className: 'submit-btn',
    style: { background: '#16a34a' },
    onClick: async () => {
      const date = document.getElementById('swap-date').value;
      const reason = document.getElementById('swap-reason').value;
      if (!swapFrom || !swapTo) { showToast('กรุณาเลือกพนักงานทั้ง 2 คน', true); return; }
      if (swapFrom === swapTo) { showToast('ต้องเลือกคนละคน', true); return; }
      if (!date) { showToast('กรุณาเลือกวันที่', true); return; }
      try {
        await api('/api/swaps', 'POST', {
          date, from_employee_id: swapFrom, to_employee_id: swapTo, reason: reason || null,
        });
        showToast('✅ ส่งคำขอสลับกะสำเร็จ');
        state.modal = null;
        loadData();
      } catch (err) { showToast(err.message, true); }
    },
  }, 'ส่งคำขอสลับกะ'));

  overlay.appendChild(modal);
  return overlay;
}

// =============================================
// Employee Management Modal
// =============================================
function renderEmployeeModal() {
  const overlay = h('div', { className: 'modal-overlay', onClick: () => { state.modal = null; render(); } });
  const modal = h('div', { className: 'modal', style: { maxWidth: '560px' }, onClick: e => e.stopPropagation() });

  modal.appendChild(h('div', { className: 'modal-header' },
    h('div', { className: 'modal-title' }, '👤 จัดการพนักงาน'),
    h('button', { className: 'modal-close', onClick: () => { state.modal = null; render(); } }, '✕'),
  ));

  // Current employees list
  state.employees.forEach(emp => {
    modal.appendChild(h('div', {
      className: 'emp-row',
      style: { cursor: 'default', display: 'flex', alignItems: 'center', gap: '10px' },
    },
      h('span', { style: { fontSize: '24px' } }, emp.avatar),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontWeight: 700, fontSize: '13px' } }, emp.name + (emp.nickname ? ' (' + emp.nickname + ')' : '')),
        h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, emp.department + ' | กะ: ' + SHIFT_TYPES[emp.default_shift]?.label),
      ),
      h('span', {
        style: { fontSize: '11px', padding: '3px 8px', borderRadius: '6px', fontWeight: 700,
          background: emp.role === 'admin' ? '#fef3c7' : emp.role === 'lead' ? '#e0e7ff' : '#f1f5f9',
          color: emp.role === 'admin' ? '#f59e0b' : emp.role === 'lead' ? '#6366f1' : '#94a3b8',
        }
      }, emp.role === 'admin' ? 'แอดมิน' : emp.role === 'lead' ? 'หัวหน้า' : 'พนักงาน'),
    ));
  });

  // Add new employee form
  modal.appendChild(h('div', { style: { borderTop: '1px solid #e2e8f0', marginTop: '14px', paddingTop: '14px' } },
    h('div', { className: 'section-label' }, 'เพิ่มพนักงานใหม่'),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
      h('input', { type: 'text', className: 'form-input', id: 'new-name', placeholder: 'ชื่อ-สกุล', style: { flex: 2 } }),
      h('input', { type: 'text', className: 'form-input', id: 'new-nickname', placeholder: 'ชื่อเล่น', style: { flex: 1 } }),
    ),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
      h('select', { className: 'form-input', id: 'new-role', style: { flex: 1 } },
        h('option', { value: 'staff' }, 'พนักงาน'),
        h('option', { value: 'lead' }, 'หัวหน้า'),
        h('option', { value: 'admin' }, 'แอดมิน'),
      ),
      h('select', { className: 'form-input', id: 'new-shift', style: { flex: 1 } },
        h('option', { value: 'morning' }, '☀️ กะเช้า'),
        h('option', { value: 'afternoon' }, '🌤️ กะบ่าย'),
        h('option', { value: 'night' }, '🌙 กะดึก'),
      ),
    ),
    h('button', {
      className: 'submit-btn', style: { background: '#3b82f6' },
      onClick: async () => {
        const name = document.getElementById('new-name').value.trim();
        const nickname = document.getElementById('new-nickname').value.trim();
        const role = document.getElementById('new-role').value;
        const shift = document.getElementById('new-shift').value;
        if (!name) { showToast('กรุณากรอกชื่อ', true); return; }
        try {
          await api('/api/employees', 'POST', { name, nickname, role, default_shift: shift });
          showToast('✅ เพิ่มพนักงานสำเร็จ');
          loadData();
        } catch (err) { showToast(err.message, true); }
      },
    }, '+ เพิ่มพนักงาน'),
  ));

  overlay.appendChild(modal);
  return overlay;
}

// =============================================
// Init
// =============================================
loadData();
</script>
</body>
</html>`;
}

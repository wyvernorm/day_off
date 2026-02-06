// =============================================
// Frontend v3 - with Auth, Profile, Settings
// =============================================

export function getLoginHTML(appUrl, errorMsg = '') {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>📅 เข้าสู่ระบบ - ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Noto Sans Thai', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.login-card { background: #fff; border-radius: 24px; padding: 48px 40px; max-width: 420px; width: 90%; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
.login-icon { font-size: 64px; margin-bottom: 16px; }
.login-title { font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
.login-sub { font-size: 15px; color: #64748b; margin-bottom: 32px; line-height: 1.6; }
.google-btn { display: inline-flex; align-items: center; gap: 12px; padding: 14px 32px; border: 2px solid #e2e8f0; border-radius: 14px; background: #fff; font-size: 16px; font-weight: 700; color: #1e293b; cursor: pointer; transition: all 0.2s; font-family: inherit; text-decoration: none; }
.google-btn:hover { border-color: #4285f4; background: #f8faff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(66,133,244,0.15); }
.google-btn img { width: 24px; height: 24px; }
.error-msg { background: #fef2f2; color: #ef4444; padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 20px; }
</style>
</head>
<body>
<div class="login-card">
  <div class="login-icon">📅</div>
  <div class="login-title">ระบบจัดการกะ & วันลา</div>
  <div class="login-sub">เข้าสู่ระบบด้วย Google Account<br>เพื่อจัดการตารางกะและวันลาของคุณ</div>
  ${errorMsg ? '<div class="error-msg">⚠️ ' + errorMsg + '</div>' : ''}
  <a href="/auth/login" class="google-btn">
    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
    เข้าสู่ระบบด้วย Google
  </a>
</div>
</body>
</html>`;
}

export function getHTML(currentUser) {
  const userJson = JSON.stringify({
    id: currentUser.employee_id,
    name: currentUser.name,
    nickname: currentUser.nickname,
    email: currentUser.email,
    role: currentUser.role,
    avatar: currentUser.avatar,
    profile_image: currentUser.profile_image,
  });

  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root { --bg:#f7f8fc; --surface:#fff; --border:#e5e7eb; --text:#1e293b; --text-sub:#64748b; --primary:#3b82f6; --primary-bg:#eff6ff; --danger:#ef4444; --danger-bg:#fef2f2; --success:#10b981; --success-bg:#ecfdf5; --warning:#f59e0b; --warning-bg:#fffbeb; --radius:12px; --shadow:0 1px 3px rgba(0,0,0,0.06); --shadow-lg:0 10px 30px rgba(0,0,0,0.1); }
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Noto Sans Thai',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; font-size:15px; }
button { font-family:inherit; cursor:pointer; }
.container { max-width:1400px; margin:0 auto; padding:16px 20px; }

/* Header */
.header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.header h1 { font-size:26px; font-weight:800; }
.header p { font-size:14px; color:var(--text-sub); margin-top:2px; }
.user-bar { display:flex; align-items:center; gap:10px; background:var(--surface); padding:8px 16px; border-radius:12px; border:1px solid var(--border); }
.user-avatar { width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid var(--border); }
.user-avatar-emoji { font-size:28px; line-height:36px; }
.user-name { font-weight:700; font-size:14px; }
.user-role { font-size:11px; color:var(--text-sub); }
.user-btn { border:none; background:#f1f5f9; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600; color:var(--text-sub); }
.user-btn:hover { background:#e2e8f0; }

/* Tabs */
.tabs { display:flex; gap:3px; background:var(--surface); padding:4px; border-radius:10px; border:1px solid var(--border); flex-wrap:wrap; }
.tab { padding:8px 16px; border:none; border-radius:8px; font-size:14px; font-weight:600; background:transparent; color:var(--text-sub); transition:all 0.15s; }
.tab.active { background:var(--primary); color:#fff; }

/* Month nav */
.month-nav { display:flex; align-items:center; gap:10px; background:var(--surface); padding:10px 16px; border-radius:var(--radius); border:1px solid var(--border); margin-bottom:16px; flex-wrap:wrap; }
.month-nav h2 { font-size:20px; font-weight:700; min-width:200px; text-align:center; }
.nav-btn { border:none; background:#f1f5f9; width:36px; height:36px; border-radius:8px; font-size:18px; font-weight:700; color:#475569; display:flex; align-items:center; justify-content:center; }
.today-btn { border:1px solid var(--primary); background:var(--primary-bg); padding:6px 16px; border-radius:8px; font-size:13px; font-weight:700; color:var(--primary); }
.spacer { flex:1; }
.action-btn { border:none; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; }
.action-btn.leave { background:var(--danger-bg); color:var(--danger); }
.action-btn.swap { background:var(--success-bg); color:var(--success); }

/* Legend */
.legend { display:flex; gap:12px; flex-wrap:wrap; padding:10px 16px; background:var(--surface); border-radius:10px; border:1px solid var(--border); margin-bottom:16px; font-size:13px; }
.legend-item { display:flex; align-items:center; gap:5px; color:var(--text-sub); }
.legend-icon { width:22px; height:22px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:13px; }
.legend-sep { width:1px; background:var(--border); }

/* Calendar */
.cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:6px; }
.cal-header { text-align:center; padding:10px 0; font-weight:700; font-size:14px; color:#475569; }
.cal-header.weekend { color:var(--danger); }
.cal-day { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:8px; min-height:110px; cursor:pointer; transition:all 0.15s; }
.cal-day:hover { box-shadow:var(--shadow-lg); transform:translateY(-1px); z-index:1; }
.cal-day.today { border:2px solid var(--primary); background:var(--primary-bg); }
.cal-day.holiday { background:#fffbf0; border-color:#fbbf24; }
.day-num { font-size:15px; font-weight:600; color:#334155; margin-bottom:4px; display:flex; align-items:center; gap:4px; }
.day-num.today-num { font-weight:800; color:var(--primary); }
.day-num .badge { font-size:9px; padding:2px 6px; border-radius:6px; font-weight:700; }
.holiday-name { font-size:10px; color:#d97706; font-weight:600; margin-bottom:3px; }
.emp-tag { display:flex; align-items:center; gap:3px; font-size:12px; font-weight:600; padding:2px 6px; border-radius:5px; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

/* Roster */
.roster-wrap { overflow-x:auto; border-radius:var(--radius); border:1px solid var(--border); background:var(--surface); }
.roster { width:100%; border-collapse:collapse; font-size:13px; }
.roster th { padding:10px 4px; text-align:center; background:#f8fafc; border-bottom:2px solid var(--border); font-weight:700; }
.roster th.sticky { position:sticky; left:0; z-index:3; min-width:140px; text-align:left; padding-left:14px; }
.roster th.today-col { background:var(--primary-bg); }
.roster th.holiday-col { background:#fffbeb; color:#d97706; }
.roster th .day-label { font-size:10px; opacity:0.7; }
.roster td { text-align:center; padding:3px; border-bottom:1px solid #f1f5f9; }
.roster td.sticky { position:sticky; left:0; background:#fff; z-index:2; text-align:left; padding:8px 14px; }
.roster td.today-col { background:#f0f7ff; }
.emp-cell { display:flex; align-items:center; gap:8px; }
.emp-avatar { font-size:22px; }
.emp-img { width:28px; height:28px; border-radius:50%; object-fit:cover; }
.emp-name { font-weight:700; font-size:13px; }
.emp-role { font-size:11px; color:var(--text-sub); }
.shift-cell { width:36px; height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; margin:0 auto; font-size:15px; cursor:pointer; transition:all 0.15s; }
.shift-cell:hover { transform:scale(1.25); }

/* Stats */
.stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:14px; }
.stat-card { background:var(--surface); border-radius:var(--radius); padding:20px; border:1px solid var(--border); }
.stat-header { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.stat-avatar { font-size:36px; }
.stat-img { width:44px; height:44px; border-radius:50%; object-fit:cover; }
.stat-name { font-size:17px; font-weight:700; }
.stat-role { font-size:12px; color:var(--text-sub); }
.stat-section-title { font-size:12px; font-weight:700; color:var(--text-sub); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px; }
.stat-tags { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
.stat-tag { display:flex; align-items:center; gap:4px; padding:4px 10px; border-radius:6px; font-size:13px; font-weight:600; }
.quota-row { margin-bottom:10px; }
.quota-header { display:flex; justify-content:space-between; font-size:12px; color:var(--text-sub); margin-bottom:4px; }
.quota-bar { height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden; }
.quota-fill { height:100%; border-radius:3px; transition:width 0.4s; }

/* Pending */
.pending-section { margin-top:20px; }
.pending-title { font-size:18px; font-weight:700; margin-bottom:12px; }
.pending-card { background:var(--surface); border-radius:var(--radius); padding:14px 18px; border:1px solid var(--border); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; }
.btn-approve { border:none; background:var(--success); color:#fff; padding:7px 16px; border-radius:8px; font-size:13px; font-weight:700; }
.btn-reject { border:1px solid var(--danger); background:#fff; color:var(--danger); padding:7px 16px; border-radius:8px; font-size:13px; font-weight:700; }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:1000; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35); backdrop-filter:blur(4px); animation:fadeIn 0.15s; }
.modal { background:#fff; border-radius:16px; padding:28px; min-width:400px; max-width:540px; box-shadow:var(--shadow-lg); max-height:88vh; overflow:auto; animation:slideUp 0.2s; }
.modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
.modal-title { font-size:18px; font-weight:700; }
.modal-close { border:none; background:#f1f5f9; width:32px; height:32px; border-radius:8px; font-size:15px; display:flex; align-items:center; justify-content:center; }
.emp-row { padding:12px; border-radius:10px; margin-bottom:6px; border:1px solid var(--border); cursor:pointer; transition:all 0.15s; }
.emp-row:hover { border-color:var(--primary); }
.emp-row.selected { border-color:var(--primary); background:var(--primary-bg); }
.emp-row-header { display:flex; align-items:center; gap:10px; }
.emp-row-shift { margin-left:auto; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700; }
.pill-group { display:flex; gap:6px; flex-wrap:wrap; margin-top:8px; }
.pill { display:inline-flex; align-items:center; gap:4px; padding:6px 14px; border-radius:16px; border:2px solid transparent; font-size:13px; font-weight:600; background:#f8fafc; color:var(--text-sub); transition:all 0.15s; }
.pill.active { transform:scale(1.05); }
.section-label { font-size:12px; font-weight:700; color:var(--text-sub); margin:10px 0 6px; text-transform:uppercase; }
.submit-btn { width:100%; padding:12px 0; border:none; border-radius:10px; font-size:14px; font-weight:700; color:#fff; margin-top:14px; }
.form-group { margin-bottom:16px; }
.form-label { display:block; font-size:13px; font-weight:700; color:var(--text-sub); margin-bottom:6px; }
.form-input { width:100%; padding:10px 14px; border:1px solid var(--border); border-radius:8px; font-size:14px; font-family:inherit; outline:none; }
.form-input:focus { border-color:var(--primary); }
textarea.form-input { resize:vertical; min-height:60px; }
.toast { position:fixed; top:20px; right:20px; z-index:2000; background:#fff; padding:14px 22px; border-radius:10px; box-shadow:var(--shadow-lg); font-weight:600; font-size:14px; border-left:4px solid var(--success); animation:notifIn 0.3s; }
.toast.error { border-left-color:var(--danger); }

/* Profile */
.profile-img-large { width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid var(--border); }
.profile-emoji-large { font-size:60px; line-height:80px; }

@media (max-width:768px) {
  .cal-grid { gap:3px; } .cal-day { padding:4px; min-height:75px; }
  .emp-tag { font-size:10px; } .header h1 { font-size:20px; }
  .stats-grid { grid-template-columns:1fr; } .modal { min-width:320px; margin:10px; }
}
@keyframes fadeIn { from{opacity:0}to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
@keyframes notifIn { from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)} }
</style>
</head>
<body>
<div class="container" id="app"></div>
<script>
const CURRENT_USER = ${userJson};
const API = '';
const DAYS_TH = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const DAYS_FULL = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const MONTHS_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const SHIFT_TYPES = {
  day:     { label:'กลางวัน', time:'09:00-17:00', color:'#f59e0b', bg:'#fef3c7', icon:'☀️' },
  evening: { label:'กลางคืน', time:'17:00-00:00', color:'#6366f1', bg:'#e0e7ff', icon:'🌙' },
  off:     { label:'วันหยุด', time:'', color:'#10b981', bg:'#d1fae5', icon:'🏖️' },
};
const LEAVE_TYPES = {
  sick:     { label:'ลาป่วย', color:'#ef4444', bg:'#fee2e2', icon:'🏥', max:30 },
  personal: { label:'ลากิจ', color:'#8b5cf6', bg:'#ede9fe', icon:'📋', max:6 },
  vacation: { label:'พักร้อน', color:'#06b6d4', bg:'#cffafe', icon:'✈️', max:10 },
  maternity:{ label:'ลาคลอด', color:'#ec4899', bg:'#fce7f3', icon:'👶', max:90 },
};
const isAdmin = CURRENT_USER.role === 'admin';

const state = {
  view:'calendar', year:new Date().getFullYear(), month:new Date().getMonth(),
  employees:[], shifts:{}, leaves:{}, holidays:{}, settings:{},
  pendingLeaves:[], pendingSwaps:[],
  selectedDate:null, selectedEmployee:null, modal:null, toast:null,
};

async function api(p,m='GET',b=null){const o={method:m,headers:{'Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);const r=await fetch(API+p,o);const d=await r.json();if(!r.ok)throw new Error(d.error||'เกิดข้อผิดพลาด');return d;}
function showToast(msg,err=false){state.toast={msg,isError:err};render();setTimeout(()=>{state.toast=null;render();},2500);}

async function loadData(){
  try{
    const ms=state.year+'-'+String(state.month+1).padStart(2,'0');
    const[ov,pl,ps]=await Promise.all([api('/api/overview?month='+ms),api('/api/leaves?status=pending'),api('/api/swaps?status=pending')]);
    state.employees=ov.data.employees; state.settings=ov.data.settings||{};
    state.shifts={}; ov.data.shifts.forEach(s=>{state.shifts[s.employee_id+'-'+s.date]=s.shift_type;});
    state.leaves={}; ov.data.leaves.forEach(l=>{state.leaves[l.employee_id+'-'+l.date]={type:l.leave_type,status:l.status,id:l.id};});
    state.holidays={}; ov.data.holidays.forEach(h=>{state.holidays[h.date]=h.name;});
    state.pendingLeaves=pl.data; state.pendingSwaps=ps.data;
  }catch(e){showToast('โหลดข้อมูลไม่สำเร็จ: '+e.message,true);}
  render();
}

function dateKey(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');}
function isToday(y,m,d){const t=new Date();return t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d;}
function getDOW(y,m,d){return new Date(y,m,d).getDay();}
function daysInMonth(y,m){return new Date(y,m+1,0).getDate();}
function firstDayOfMonth(y,m){const d=new Date(y,m,1).getDay();return d===0?6:d-1;}
function isOffDay(emp,y,m,d){return getDOW(y,m,d)===emp.default_off_day;}

function getDisplayShift(emp,dk,y,m,d){
  const lv=state.leaves[emp.id+'-'+dk];
  if(lv)return{isLeave:true,...LEAVE_TYPES[lv.type],leaveStatus:lv.status,leaveId:lv.id};
  const s=state.shifts[emp.id+'-'+dk];
  if(s)return{isLeave:false,...SHIFT_TYPES[s],shiftType:s};
  if(isOffDay(emp,y,m,d))return{isLeave:false,...SHIFT_TYPES.off,shiftType:'off'};
  return{isLeave:false,...SHIFT_TYPES[emp.default_shift],shiftType:emp.default_shift};
}

function empDisplay(emp){return emp.nickname||emp.name;}
function empAvatarEl(emp,size){
  if(emp.profile_image)return h('img',{src:emp.profile_image,className:size==='large'?'profile-img-large':'emp-img'});
  return h('span',{className:size==='large'?'profile-emoji-large':'emp-avatar'},emp.avatar);
}

function h(tag,attrs={},...ch){const el=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k==='style'&&typeof v==='object')Object.assign(el.style,v);else if(k.startsWith('on'))el.addEventListener(k.slice(2).toLowerCase(),v);else if(k==='className')el.className=v;else if(k==='innerHTML')el.innerHTML=v;else if(k==='src')el.src=v;else el.setAttribute(k,v);}ch.flat(Infinity).forEach(c=>{if(c==null)return;el.appendChild(typeof c==='string'||typeof c==='number'?document.createTextNode(c):c);});return el;}

function render(){
  const app=document.getElementById('app'); app.innerHTML='';
  app.appendChild(renderHeader()); app.appendChild(renderMonthNav()); app.appendChild(renderLegend());
  if(state.view==='calendar')app.appendChild(renderCalendar());
  else if(state.view==='roster')app.appendChild(renderRoster());
  else if(state.view==='stats')app.appendChild(renderStats());
  else if(state.view==='pending')app.appendChild(renderPending());
  if(state.modal==='day')app.appendChild(renderDayModal());
  if(state.modal==='leave')app.appendChild(renderLeaveModal());
  if(state.modal==='swap')app.appendChild(renderSwapModal());
  if(state.modal==='employee')app.appendChild(renderEmployeeModal());
  if(state.modal==='profile')app.appendChild(renderProfileModal());
  if(state.modal==='settings')app.appendChild(renderSettingsModal());
  if(state.toast)app.appendChild(h('div',{className:'toast'+(state.toast.isError?' error':'')},state.toast.msg));
}

function renderHeader(){
  const pc=state.pendingLeaves.length+state.pendingSwaps.length;
  const tabs=['calendar','roster','stats'];
  if(isAdmin)tabs.push('pending');
  return h('div',{className:'header'},
    h('div',{},h('h1',{},'📅 ระบบจัดการกะ & วันลา'),h('p',{},'จัดตารางกะ สลับกะ ลางาน ดูสถิติ')),
    h('div',{style:{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}},
      h('div',{className:'tabs'},
        ...tabs.map(v=>{const lbl={calendar:'📅 ปฏิทิน',roster:'📋 ตารางกะ',stats:'📊 สถิติ',pending:'🔔 รออนุมัติ'};let t=lbl[v];if(v==='pending'&&pc>0)t+=' ('+pc+')';return h('button',{className:'tab'+(state.view===v?' active':''),onClick:()=>{state.view=v;render();}},t);})
      ),
      h('div',{className:'user-bar'},
        CURRENT_USER.profile_image?h('img',{src:CURRENT_USER.profile_image,className:'user-avatar'}):h('span',{className:'user-avatar-emoji'},CURRENT_USER.avatar),
        h('div',{},h('div',{className:'user-name'},CURRENT_USER.nickname||CURRENT_USER.name),h('div',{className:'user-role'},isAdmin?'👑 Admin':'พนักงาน')),
        h('button',{className:'user-btn',onClick:()=>{state.modal='profile';render();}},'โปรไฟล์'),
        isAdmin?h('button',{className:'user-btn',onClick:()=>{state.modal='settings';render();}},'⚙️'):'',
        h('button',{className:'user-btn',style:{color:'#ef4444'},onClick:()=>{window.location.href='/auth/logout';}},'ออก'),
      ),
    )
  );
}

function renderMonthNav(){
  return h('div',{className:'month-nav'},
    h('button',{className:'nav-btn',onClick:()=>{if(state.month===0){state.month=11;state.year--;}else state.month--;loadData();}},'‹'),
    h('h2',{},MONTHS_TH[state.month]+' '+(state.year+543)),
    h('button',{className:'nav-btn',onClick:()=>{if(state.month===11){state.month=0;state.year++;}else state.month++;loadData();}},'›'),
    h('button',{className:'today-btn',onClick:()=>{state.month=new Date().getMonth();state.year=new Date().getFullYear();loadData();}},'วันนี้'),
    h('div',{className:'spacer'}),
    h('button',{className:'action-btn leave',onClick:()=>{state.modal='leave';state.selectedDate=dateKey(state.year,state.month,new Date().getDate());render();}},'+ ลางาน'),
    h('button',{className:'action-btn swap',onClick:()=>{state.modal='swap';state.selectedDate=dateKey(state.year,state.month,new Date().getDate());render();}},'🔄 สลับกะ'),
    isAdmin?h('button',{className:'action-btn',style:{background:'#eff6ff',color:'#3b82f6'},onClick:()=>{state.modal='employee';render();}},'👤 จัดการพนักงาน'):'',
  );
}

function renderLegend(){
  return h('div',{className:'legend'},
    ...Object.entries(SHIFT_TYPES).map(([k,v])=>h('div',{className:'legend-item'},h('span',{className:'legend-icon',style:{background:v.bg}},v.icon),h('span',{style:{fontWeight:600}},v.label),v.time?h('span',{style:{color:'#94a3b8'}},v.time):null)),
    h('div',{className:'legend-sep'}),
    ...Object.entries(LEAVE_TYPES).map(([k,v])=>h('div',{className:'legend-item'},h('span',{},v.icon),h('span',{style:{fontWeight:600}},v.label))),
  );
}

function renderCalendar(){
  const grid=h('div',{className:'cal-grid'});
  DAYS_TH.forEach((d,i)=>grid.appendChild(h('div',{className:'cal-header'+(i>=5?' weekend':'')},d)));
  for(let i=0;i<firstDayOfMonth(state.year,state.month);i++)grid.appendChild(h('div'));
  const dim=daysInMonth(state.year,state.month);
  for(let d=1;d<=dim;d++){
    const dk=dateKey(state.year,state.month,d),td=isToday(state.year,state.month,d),hol=state.holidays[dk];
    const day=h('div',{className:'cal-day'+(td?' today':'')+(hol?' holiday':''),onClick:()=>{state.selectedDate=dk;state.modal='day';state.selectedEmployee=null;render();}});
    const num=h('div',{className:'day-num'+(td?' today-num':'')},String(d));
    if(td)num.appendChild(h('span',{className:'badge',style:{background:'#3b82f6',color:'#fff'}},'วันนี้'));
    day.appendChild(num);
    if(hol)day.appendChild(h('div',{className:'holiday-name'},'🔴 '+hol));
    state.employees.forEach(emp=>{
      const info=getDisplayShift(emp,dk,state.year,state.month,d);
      day.appendChild(h('div',{className:'emp-tag',style:{background:info.bg,color:info.color}},info.icon+' '+empDisplay(emp)));
    });
    grid.appendChild(day);
  }
  return grid;
}

function renderRoster(){
  const dim=daysInMonth(state.year,state.month);
  const wrap=h('div',{className:'roster-wrap'}),table=h('table',{className:'roster'}),thead=h('thead'),hrow=h('tr');
  hrow.appendChild(h('th',{className:'sticky'},'พนักงาน'));
  for(let d=1;d<=dim;d++){const dk=dateKey(state.year,state.month,d),td=isToday(state.year,state.month,d),hol=state.holidays[dk];let cls=td?'today-col':hol?'holiday-col':'';const dow=getDOW(state.year,state.month,d),di=dow===0?6:dow-1;hrow.appendChild(h('th',{className:cls,style:{minWidth:'40px'}},h('div',{},String(d)),h('div',{className:'day-label'},DAYS_TH[di])));}
  thead.appendChild(hrow);table.appendChild(thead);
  const tbody=h('tbody');
  state.employees.forEach(emp=>{
    const row=h('tr');
    row.appendChild(h('td',{className:'sticky'},h('div',{className:'emp-cell'},empAvatarEl(emp),h('div',{},h('div',{className:'emp-name'},empDisplay(emp)),h('div',{className:'emp-role'},'หยุด: '+DAYS_FULL[emp.default_off_day])))));
    for(let d=1;d<=dim;d++){const dk=dateKey(state.year,state.month,d),td=isToday(state.year,state.month,d),info=getDisplayShift(emp,dk,state.year,state.month,d);row.appendChild(h('td',{className:td?'today-col':''},h('div',{className:'shift-cell',style:{background:info.bg},title:info.label+' '+(info.time||''),onClick:()=>{state.selectedDate=dk;state.selectedEmployee=emp.id;state.modal='day';render();}},info.icon)));}
    tbody.appendChild(row);
  });
  table.appendChild(tbody);wrap.appendChild(table);return wrap;
}

function renderStats(){
  const grid=h('div',{className:'stats-grid'}),dim=daysInMonth(state.year,state.month);
  state.employees.forEach(emp=>{
    const sc={day:0,evening:0,off:0},lc={sick:0,personal:0,vacation:0,maternity:0};
    for(let d=1;d<=dim;d++){const dk=dateKey(state.year,state.month,d),info=getDisplayShift(emp,dk,state.year,state.month,d);if(info.isLeave)lc[state.leaves[emp.id+'-'+dk]?.type]++;else sc[info.shiftType]=(sc[info.shiftType]||0)+1;}
    grid.appendChild(h('div',{className:'stat-card'},
      h('div',{className:'stat-header'},empAvatarEl(emp,'large'),h('div',{},h('div',{className:'stat-name'},empDisplay(emp)),h('div',{className:'stat-role'},'หยุดประจำ: '+DAYS_FULL[emp.default_off_day]+' | '+SHIFT_TYPES[emp.default_shift]?.label))),
      h('div',{className:'stat-section-title'},'กะทำงานเดือนนี้'),
      h('div',{className:'stat-tags'},...Object.entries(sc).filter(([_,v])=>v>0).map(([t,c])=>{const i=SHIFT_TYPES[t];return i?h('div',{className:'stat-tag',style:{background:i.bg,color:i.color}},i.icon+' '+i.label+' '+c+' วัน'):null;}).filter(Boolean)),
      h('div',{className:'stat-section-title'},'โควต้าวันลา (ทั้งปี)'),
      ...Object.entries(LEAVE_TYPES).map(([type,info])=>{const used=lc[type]||0,max=emp['max_'+type+'_leave']||info.max,pct=max>0?(used/max)*100:0;return h('div',{className:'quota-row'},h('div',{className:'quota-header'},h('span',{},info.icon+' '+info.label),h('span',{style:{fontWeight:700,color:info.color}},used+'/'+max)),h('div',{className:'quota-bar'},h('div',{className:'quota-fill',style:{width:pct+'%',background:info.color}})));})
    ));
  });
  return grid;
}

function renderPending(){
  const sec=h('div',{className:'pending-section'});
  sec.appendChild(h('div',{className:'pending-title'},'📋 วันลารออนุมัติ ('+state.pendingLeaves.length+')'));
  if(!state.pendingLeaves.length)sec.appendChild(h('p',{style:{color:'#94a3b8',fontSize:'14px',marginBottom:'20px'}},'ไม่มีรายการรออนุมัติ ✅'));
  state.pendingLeaves.forEach(lv=>{const info=LEAVE_TYPES[lv.leave_type];sec.appendChild(h('div',{className:'pending-card'},h('div',{style:{display:'flex',alignItems:'center',gap:'10px'}},h('span',{style:{fontSize:'26px'}},lv.avatar),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},lv.nickname||lv.employee_name),h('div',{style:{fontSize:'13px',color:'#64748b'}},info.icon+' '+info.label+' — '+lv.date+(lv.reason?' ('+lv.reason+')':'')))),h('div',{style:{display:'flex',gap:'6px'}},h('button',{className:'btn-approve',onClick:async()=>{try{await api('/api/leaves/'+lv.id+'/approve','PUT');showToast('✅ อนุมัติสำเร็จ');loadData();}catch(e){showToast(e.message,true);}}},'✅ อนุมัติ'),h('button',{className:'btn-reject',onClick:async()=>{try{await api('/api/leaves/'+lv.id+'/reject','PUT');showToast('❌ ปฏิเสธ');loadData();}catch(e){showToast(e.message,true);}}},'❌ ปฏิเสธ'))));});
  sec.appendChild(h('div',{className:'pending-title',style:{marginTop:'24px'}},'🔄 สลับกะรออนุมัติ ('+state.pendingSwaps.length+')'));
  if(!state.pendingSwaps.length)sec.appendChild(h('p',{style:{color:'#94a3b8',fontSize:'14px'}},'ไม่มีรายการรออนุมัติ ✅'));
  state.pendingSwaps.forEach(sw=>{sec.appendChild(h('div',{className:'pending-card'},h('div',{style:{display:'flex',alignItems:'center',gap:'10px'}},h('span',{style:{fontSize:'22px'}},sw.from_avatar),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},(sw.from_nickname||sw.from_name)+' ↔ '+(sw.to_nickname||sw.to_name)),h('div',{style:{fontSize:'13px',color:'#64748b'}},'วันที่ '+sw.date))),h('div',{style:{display:'flex',gap:'6px'}},h('button',{className:'btn-approve',onClick:async()=>{try{await api('/api/swaps/'+sw.id+'/approve','PUT');showToast('✅ อนุมัติสลับกะ');loadData();}catch(e){showToast(e.message,true);}}},'✅ อนุมัติ'),h('button',{className:'btn-reject',onClick:async()=>{try{await api('/api/swaps/'+sw.id+'/reject','PUT');showToast('❌ ปฏิเสธ');loadData();}catch(e){showToast(e.message,true);}}},'❌ ปฏิเสธ'))));});
  return sec;
}

function renderDayModal(){
  const dk=state.selectedDate;if(!dk)return h('div');
  const[yr,mo,dy]=[parseInt(dk.split('-')[0]),parseInt(dk.split('-')[1])-1,parseInt(dk.split('-')[2])];
  const hol=state.holidays[dk];
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'📅 '+dy+' '+MONTHS_TH[mo]+' '+(yr+543)+' ('+DAYS_FULL[getDOW(yr,mo,dy)]+')'+(hol?' — 🔴 '+hol:'')),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  state.employees.forEach(emp=>{
    const info=getDisplayShift(emp,dk,yr,mo,dy),isSel=state.selectedEmployee===emp.id;
    const row=h('div',{className:'emp-row'+(isSel?' selected':''),onClick:()=>{state.selectedEmployee=isSel?null:emp.id;render();}});
    const hdr=h('div',{className:'emp-row-header'},empAvatarEl(emp),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},empDisplay(emp)),h('div',{style:{fontSize:'11px',color:'#94a3b8'}},'หยุด: '+DAYS_FULL[emp.default_off_day])));
    if(info.isLeave)hdr.appendChild(h('span',{className:'emp-row-shift',style:{background:info.bg,color:info.color}},info.icon+' '+info.label+(info.leaveStatus==='pending'?' (รอ)':'')));
    else hdr.appendChild(h('span',{className:'emp-row-shift',style:{background:info.bg,color:info.color}},info.icon+' '+info.label+' '+(info.time||'')));
    row.appendChild(hdr);
    if(isSel){
      row.appendChild(h('div',{className:'section-label'},'เปลี่ยนกะ'));
      const sp=h('div',{className:'pill-group'});
      Object.entries(SHIFT_TYPES).forEach(([t,si])=>{const a=!info.isLeave&&info.shiftType===t;sp.appendChild(h('button',{className:'pill'+(a?' active':''),style:a?{borderColor:si.color,background:si.bg,color:si.color}:{},onClick:async e=>{e.stopPropagation();try{if(info.isLeave&&info.leaveId)await api('/api/leaves/'+info.leaveId,'DELETE');await api('/api/shifts','POST',{employee_id:emp.id,date:dk,shift_type:t});showToast(si.icon+' '+empDisplay(emp)+' → '+si.label);loadData();}catch(er){showToast(er.message,true);}}},si.icon+' '+si.label));});
      row.appendChild(sp);
      row.appendChild(h('div',{className:'section-label'},'ลางาน'));
      const lp=h('div',{className:'pill-group'});
      Object.entries(LEAVE_TYPES).forEach(([t,li])=>{const lv=state.leaves[emp.id+'-'+dk],a=lv&&lv.type===t;lp.appendChild(h('button',{className:'pill'+(a?' active':''),style:a?{borderColor:li.color,background:li.bg,color:li.color}:{},onClick:async e=>{e.stopPropagation();try{if(a){await api('/api/leaves/'+lv.id,'DELETE');showToast('❌ ยกเลิกลา '+empDisplay(emp));}else{await api('/api/leaves','POST',{employee_id:emp.id,date:dk,leave_type:t});showToast(li.icon+' '+empDisplay(emp)+' → '+li.label);}loadData();}catch(er){showToast(er.message,true);}}},li.icon+' '+li.label));});
      row.appendChild(lp);
    }
    md.appendChild(row);
  });
  ov.appendChild(md);return ov;
}

function renderLeaveModal(){
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'📝 ลงวันลา'),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  const eg=h('div',{className:'form-group'});eg.appendChild(h('label',{className:'form-label'},'เลือกพนักงาน'));
  const ep=h('div',{className:'pill-group'});
  state.employees.forEach(emp=>{const a=state.selectedEmployee===emp.id;ep.appendChild(h('button',{className:'pill'+(a?' active':''),style:a?{borderColor:'#3b82f6',background:'#eff6ff',color:'#3b82f6'}:{},onClick:()=>{state.selectedEmployee=emp.id;render();}},emp.avatar+' '+empDisplay(emp)));});
  eg.appendChild(ep);md.appendChild(eg);
  let slt='sick';
  const tg=h('div',{className:'form-group'});tg.appendChild(h('label',{className:'form-label'},'ประเภทการลา'));
  const tp=h('div',{className:'pill-group'});
  Object.entries(LEAVE_TYPES).forEach(([t,i])=>{tp.appendChild(h('button',{className:'pill',id:'lt-'+t,style:t==='sick'?{borderColor:i.color,background:i.bg,color:i.color}:{},onClick:()=>{slt=t;document.querySelectorAll('[id^=lt-]').forEach(el=>{const tt=el.id.replace('lt-',''),ii=LEAVE_TYPES[tt];if(tt===t){el.style.borderColor=ii.color;el.style.background=ii.bg;el.style.color=ii.color;}else{el.style.borderColor='transparent';el.style.background='#f8fafc';el.style.color='#64748b';}});}},i.icon+' '+i.label));});
  tg.appendChild(tp);md.appendChild(tg);
  const dg=h('div',{className:'form-group',style:{display:'flex',gap:'10px'}});
  dg.appendChild(h('div',{style:{flex:1}},h('label',{className:'form-label'},'วันที่เริ่ม'),h('input',{type:'date',className:'form-input',id:'ls',value:state.selectedDate||''})));
  dg.appendChild(h('div',{style:{flex:1}},h('label',{className:'form-label'},'วันที่สิ้นสุด'),h('input',{type:'date',className:'form-input',id:'le',value:state.selectedDate||''})));
  md.appendChild(dg);
  const rg=h('div',{className:'form-group'});rg.appendChild(h('label',{className:'form-label'},'เหตุผล'));rg.appendChild(h('textarea',{className:'form-input',id:'lr',placeholder:'ระบุเหตุผล...'}));md.appendChild(rg);
  md.appendChild(h('button',{className:'submit-btn',style:{background:'#3b82f6'},onClick:async()=>{if(!state.selectedEmployee){showToast('เลือกพนักงาน',true);return;}const s=document.getElementById('ls').value,e=document.getElementById('le').value,r=document.getElementById('lr').value;if(!s){showToast('เลือกวันที่',true);return;}try{if(s===e||!e)await api('/api/leaves','POST',{employee_id:state.selectedEmployee,date:s,leave_type:slt,reason:r||null});else await api('/api/leaves/range','POST',{employee_id:state.selectedEmployee,start_date:s,end_date:e,leave_type:slt,reason:r||null});showToast('✅ บันทึกวันลาสำเร็จ');state.modal=null;loadData();}catch(er){showToast(er.message,true);}}},'บันทึกวันลา'));
  ov.appendChild(md);return ov;
}

function renderSwapModal(){
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'🔄 สลับกะทำงาน'),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'วันที่สลับ'),h('input',{type:'date',className:'form-input',id:'sd',value:state.selectedDate||''})));
  let sf=null,st=null;
  const e1=h('div',{className:'form-group'});e1.appendChild(h('label',{className:'form-label'},'คนที่ 1'));
  const p1=h('div',{className:'pill-group'});state.employees.forEach(emp=>{p1.appendChild(h('button',{className:'pill',id:'sf-'+emp.id,onClick:()=>{sf=emp.id;document.querySelectorAll('[id^=sf-]').forEach(el=>{const a=el.id==='sf-'+emp.id;el.style.borderColor=a?'#f59e0b':'transparent';el.style.background=a?'#fef3c7':'#f8fafc';el.style.color=a?'#f59e0b':'#64748b';});}},emp.avatar+' '+empDisplay(emp)));});
  e1.appendChild(p1);md.appendChild(e1);
  md.appendChild(h('div',{style:{textAlign:'center',fontSize:'22px',margin:'6px 0'}},'⇅'));
  const e2=h('div',{className:'form-group'});e2.appendChild(h('label',{className:'form-label'},'คนที่ 2'));
  const p2=h('div',{className:'pill-group'});state.employees.forEach(emp=>{p2.appendChild(h('button',{className:'pill',id:'st-'+emp.id,onClick:()=>{st=emp.id;document.querySelectorAll('[id^=st-]').forEach(el=>{const a=el.id==='st-'+emp.id;el.style.borderColor=a?'#6366f1':'transparent';el.style.background=a?'#e0e7ff':'#f8fafc';el.style.color=a?'#6366f1':'#64748b';});}},emp.avatar+' '+empDisplay(emp)));});
  e2.appendChild(p2);md.appendChild(e2);
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'เหตุผล'),h('textarea',{className:'form-input',id:'sr',placeholder:'ระบุเหตุผล...'})));
  md.appendChild(h('button',{className:'submit-btn',style:{background:'#16a34a'},onClick:async()=>{const d=document.getElementById('sd').value,r=document.getElementById('sr').value;if(!sf||!st){showToast('เลือกทั้ง 2 คน',true);return;}if(sf===st){showToast('ต้องคนละคน',true);return;}if(!d){showToast('เลือกวันที่',true);return;}try{await api('/api/swaps','POST',{date:d,from_employee_id:sf,to_employee_id:st,reason:r||null});showToast('✅ ส่งคำขอสลับกะสำเร็จ');state.modal=null;loadData();}catch(er){showToast(er.message,true);}}},'ส่งคำขอสลับกะ'));
  ov.appendChild(md);return ov;
}

function renderEmployeeModal(){
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',style:{maxWidth:'560px'},onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'👤 จัดการพนักงาน'),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  state.employees.forEach(emp=>{md.appendChild(h('div',{className:'emp-row',style:{cursor:'default',display:'flex',alignItems:'center',gap:'10px'}},empAvatarEl(emp),h('div',{style:{flex:1}},h('div',{style:{fontWeight:700,fontSize:'14px'}},emp.name+(emp.email?' ('+emp.email+')':'')),h('div',{style:{fontSize:'11px',color:'#94a3b8'}},SHIFT_TYPES[emp.default_shift]?.icon+' '+SHIFT_TYPES[emp.default_shift]?.label+' | หยุด: '+DAYS_FULL[emp.default_off_day])),h('span',{style:{fontSize:'12px',padding:'4px 10px',borderRadius:'6px',fontWeight:700,background:emp.role==='admin'?'#fef3c7':'#f1f5f9',color:emp.role==='admin'?'#f59e0b':'#94a3b8'}},emp.role==='admin'?'Admin':'Staff')));});
  md.appendChild(h('div',{style:{borderTop:'1px solid #e2e8f0',marginTop:'14px',paddingTop:'14px'}},
    h('div',{className:'section-label'},'เพิ่มพนักงานใหม่'),
    h('div',{style:{display:'flex',gap:'8px',marginBottom:'8px'}},h('input',{type:'text',className:'form-input',id:'nn',placeholder:'ชื่อ/ชื่อเล่น',style:{flex:1}}),h('input',{type:'email',className:'form-input',id:'ne',placeholder:'Email (Gmail)',style:{flex:1}})),
    h('div',{style:{display:'flex',gap:'8px',marginBottom:'8px'}},h('select',{className:'form-input',id:'ns',style:{flex:1},innerHTML:'<option value="day">☀️ กลางวัน 09-17</option><option value="evening">🌙 กลางคืน 17-00</option>'}),h('select',{className:'form-input',id:'no',style:{flex:1},innerHTML:'<option value="0">หยุด อาทิตย์</option><option value="1">หยุด จันทร์</option><option value="2">หยุด อังคาร</option><option value="3">หยุด พุธ</option><option value="4">หยุด พฤหัสบดี</option><option value="5">หยุด ศุกร์</option><option value="6">หยุด เสาร์</option>'})),
    h('button',{className:'submit-btn',style:{background:'#3b82f6'},onClick:async()=>{const name=document.getElementById('nn').value.trim(),email=document.getElementById('ne').value.trim(),shift=document.getElementById('ns').value,off=parseInt(document.getElementById('no').value);if(!name){showToast('กรอกชื่อ',true);return;}try{await api('/api/employees','POST',{name,nickname:name,email:email||null,default_shift:shift,default_off_day:off});showToast('✅ เพิ่มพนักงานสำเร็จ');loadData();}catch(er){showToast(er.message,true);}}},'+ เพิ่มพนักงาน'),
  ));
  ov.appendChild(md);return ov;
}

function renderProfileModal(){
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'👤 โปรไฟล์ของฉัน'),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  const me=state.employees.find(e=>e.id===CURRENT_USER.id)||CURRENT_USER;
  md.appendChild(h('div',{style:{textAlign:'center',marginBottom:'20px'}},
    me.profile_image?h('img',{src:me.profile_image,className:'profile-img-large'}):h('div',{className:'profile-emoji-large'},me.avatar),
    h('div',{style:{fontSize:'12px',color:'#94a3b8',marginTop:'6px'}},me.email),
  ));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'ชื่อที่แสดง'),h('input',{type:'text',className:'form-input',id:'pn',value:me.nickname||me.name||''})));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'ไอคอน (emoji)'),h('input',{type:'text',className:'form-input',id:'pa',value:me.avatar||'👤',style:{fontSize:'24px'}})));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'เบอร์โทร'),h('input',{type:'tel',className:'form-input',id:'pp',value:me.phone||'',placeholder:'0xx-xxx-xxxx'})));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'LINE ID'),h('input',{type:'text',className:'form-input',id:'pl',value:me.line_id||'',placeholder:'@lineid'})));
  md.appendChild(h('button',{className:'submit-btn',style:{background:'#3b82f6'},onClick:async()=>{try{await api('/api/me','PUT',{nickname:document.getElementById('pn').value.trim(),avatar:document.getElementById('pa').value.trim()||'👤',phone:document.getElementById('pp').value.trim()||null,line_id:document.getElementById('pl').value.trim()||null});showToast('✅ อัพเดทโปรไฟล์สำเร็จ');CURRENT_USER.nickname=document.getElementById('pn').value.trim();CURRENT_USER.avatar=document.getElementById('pa').value.trim()||'👤';state.modal=null;loadData();}catch(er){showToast(er.message,true);}}},'บันทึกโปรไฟล์'));
  ov.appendChild(md);return ov;
}

function renderSettingsModal(){
  const ov=h('div',{className:'modal-overlay',onClick:()=>{state.modal=null;render();}});
  const md=h('div',{className:'modal',onClick:e=>e.stopPropagation()});
  md.appendChild(h('div',{className:'modal-header'},h('div',{className:'modal-title'},'⚙️ ตั้งค่าระบบ'),h('button',{className:'modal-close',onClick:()=>{state.modal=null;render();}},'✕')));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'ชื่อบริษัท'),h('input',{type:'text',className:'form-input',id:'sc',value:state.settings.company_name||'บริษัท'})));
  md.appendChild(h('div',{className:'form-group'},h('label',{className:'form-label'},'จำนวนวันหยุดบริษัท/ปี'),h('input',{type:'number',className:'form-input',id:'sh',value:state.settings.company_holidays_per_year||'20'})));
  md.appendChild(h('div',{style:{background:'#f8fafc',borderRadius:'10px',padding:'14px',marginBottom:'16px'}},
    h('div',{style:{fontSize:'13px',fontWeight:700,color:'#475569',marginBottom:'8px'}},'📊 สรุปวันหยุดของบริษัท'),
    h('div',{style:{fontSize:'14px',color:'#1e293b'}},'วันหยุดนักขัตฤกษ์: '+Object.keys(state.holidays).length+' วัน'),
    h('div',{style:{fontSize:'14px',color:'#1e293b',marginTop:'4px'}},'วันหยุดบริษัท/ปี: '+(state.settings.company_holidays_per_year||20)+' วัน'),
  ));
  md.appendChild(h('button',{className:'submit-btn',style:{background:'#3b82f6'},onClick:async()=>{try{await api('/api/settings','PUT',{company_name:document.getElementById('sc').value,company_holidays_per_year:document.getElementById('sh').value});showToast('✅ บันทึกตั้งค่าสำเร็จ');loadData();}catch(er){showToast(er.message,true);}}},'บันทึกตั้งค่า'));
  ov.appendChild(md);return ov;
}

loadData();
</script>
</body>
</html>`;
}

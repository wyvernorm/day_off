// =============================================
// 🖼️ Views — Single-Page Application
//
// Structure:
//   getLoginHTML()  — Login page
//   getHTML()       — Main app containing:
//
//   [STYLES]        — CSS (Base, Dark Mode, Components, Responsive)
//   [JAVASCRIPT]
//     Config        — Dark mode, Constants, RBAC, State, API, Toast
//     Data          — load(), Helpers (ce, dk, disp, etc.)
//     Views         — DOM Builder, Date Picker, Modal Helpers, render()
//     Pages         — Header, Calendar, Roster, Stats, Pending, KPI, History, Wallet
//     Achievements  — 18 badges, compute, leaderboard
//     Modals        — Day, Leave, Swap, DayoffSwap, SelfDayoff, KPI,
//                     Onboard, Employee, Profile, Settings, Roles,
//                     Achievements, Rewards
//     Init          — load()
// =============================================

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
    id: currentUser.employee_id, name: currentUser.name, nickname: currentUser.nickname,
    email: currentUser.email, role: currentUser.role, avatar: currentUser.avatar,
    profile_image: currentUser.profile_image, show_in_calendar: currentUser.show_in_calendar,
  });

  return `<!DOCTYPE html><html lang="th-u-hc-h23"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<!-- ============================================= -->
<!-- STYLES                                        -->
<!-- ============================================= -->
<style>
/* === BASE === */
:root {
  --bg: #f0f2f7; --sf: #fff; --bd: #e2e6ef; --tx: #16163a; --ts: #7b83a1;
  --pr: #4361ee; --pb: #eaefff; --dg: #ef476f; --db: #fff0f3;
  --su: #06d6a0; --sb: #e6faf4; --wn: #ffd166; --wb: #fff8e6;
  --rd: 16px; --sh: 0 2px 8px rgba(0,0,0,.04); --sl: 0 12px 40px rgba(0,0,0,.08);
  --accent: #7209b7;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Noto Sans Thai', sans-serif; background: var(--bg); color: var(--tx); font-size: 15px; }
button { font-family: inherit; cursor: pointer; }
::selection { background: var(--pb); color: var(--pr); }

/* === LAYOUT === */
.ctn { max-width: 1400px; margin: 0 auto; padding: 20px 24px; }

/* === HEADER === */
.hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
.hdr h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.hdr p { font-size: 14px; color: var(--ts); margin-top: 2px; }

/* === USER BAR === */
.ub { display: flex; align-items: center; gap: 10px; background: var(--sf); padding: 8px 16px; border-radius: 12px; border: 1px solid var(--bd); }
.ua { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid var(--bd); }
.uae { font-size: 28px; line-height: 36px; }
.un { font-weight: 700; font-size: 14px; }
.ur { font-size: 11px; color: var(--ts); }
.ubtn { border: none; background: #f1f5f9; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--ts); transition: background .15s; }
.ubtn:hover { background: #e2e8f0; }

/* === TABS === */
.tabs { display: flex; gap: 4px; background: var(--sf); padding: 5px; border-radius: 14px; border: 1px solid var(--bd); flex-wrap: wrap; box-shadow: var(--sh); }
.tab { padding: 10px 18px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; background: transparent; color: var(--ts); transition: all .2s; }
.tab:hover { background: var(--pb); color: var(--pr); }
.tab.on { background: var(--pr); color: #fff; box-shadow: 0 4px 14px rgba(67,97,238,.3); }

/* === MONTH NAV === */
.mnv { display: flex; align-items: center; gap: 10px; background: var(--sf); padding: 12px 18px; border-radius: var(--rd); border: 1px solid var(--bd); margin-bottom: 18px; flex-wrap: wrap; box-shadow: var(--sh); }
.mnv h2 { font-size: 22px; font-weight: 800; min-width: 200px; text-align: center; letter-spacing: -0.3px; }
.nb { border: none; background: var(--pb); width: 38px; height: 38px; border-radius: 10px; font-size: 18px; font-weight: 700; color: var(--pr); display: flex; align-items: center; justify-content: center; transition: all .2s; }
.nb:hover { background: var(--pr); color: #fff; transform: translateY(-1px); }
.nb:disabled { opacity: .3; cursor: not-allowed; }
.tb { border: 2px solid var(--pr); background: var(--pb); padding: 7px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; color: var(--pr); transition: all .2s; }
.tb:hover { background: var(--pr); color: #fff; }
.sp { flex: 1; }
.ab { border: none; padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 700; transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.ab:hover { filter: brightness(.95); transform: translateY(-1px); }

/* === LEGEND === */
.lgd { display: flex; gap: 12px; flex-wrap: wrap; padding: 10px 16px; background: var(--sf); border-radius: 10px; border: 1px solid var(--bd); margin-bottom: 16px; font-size: 13px; }
.li { display: flex; align-items: center; gap: 5px; color: var(--ts); }
.lic { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.lsep { width: 1px; background: var(--bd); }

/* === CALENDAR === */
.cg { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.ch { text-align: center; padding: 12px 0; font-weight: 800; font-size: 14px; color: var(--ts); letter-spacing: 0.5px; }
.ch.we { color: var(--dg); }
.cd { background: var(--sf); border: 1px solid var(--bd); border-radius: var(--rd); padding: 10px; min-height: 120px; transition: all .2s cubic-bezier(.22,1,.36,1); position: relative; }
.cd:hover { box-shadow: var(--sl); transform: translateY(-2px); z-index: 1; border-color: var(--pr); }
.cd.today { border: 2px solid var(--pr); background: linear-gradient(135deg, var(--pb), #f0f4ff); }
.cd.hol { background: linear-gradient(135deg, #fffbf0, #fff5e0); border-color: #fbbf24; }
.dn { font-size: 16px; font-weight: 700; color: #334155; margin-bottom: 5px; display: flex; align-items: center; gap: 5px; }
.dn.tn { font-weight: 800; color: var(--pr); }
.dn .badge { font-size: 10px; padding: 2px 7px; border-radius: 8px; font-weight: 800; }
.hn { font-size: 11px; color: #d97706; font-weight: 700; margin-bottom: 4px; background: #fff8e1; padding: 2px 6px; border-radius: 6px; display: inline-block; }
.et { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 8px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: all .15s; }
.et:hover { transform: scale(1.02); }
.et.lv { border: 2px solid; font-size: 13px; padding: 5px 10px; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .7; } }
@keyframes digBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }

/* === ROSTER === */
.rw { overflow-x: auto; border-radius: var(--rd); border: 1px solid var(--bd); background: var(--sf); }
.rt { width: 100%; border-collapse: collapse; font-size: 13px; }
.rt th { padding: 10px 4px; text-align: center; background: #f8fafc; border-bottom: 2px solid var(--bd); font-weight: 700; }
.rt th.sk { position: sticky; left: 0; z-index: 3; min-width: 160px; text-align: left; padding-left: 14px; }
.rt th.tc { background: var(--pb); }
.rt th.hc { background: #fffbeb; color: #d97706; }
.rt th .dl { font-size: 10px; opacity: .7; }
.rt td { text-align: center; padding: 3px; border-bottom: 1px solid #f1f5f9; }
.rt td.sk { position: sticky; left: 0; background: #fff; z-index: 2; text-align: left; padding: 8px 14px; }
.rt td.tc { background: #f0f7ff; }
.ec { display: flex; align-items: center; gap: 8px; }
.eav { font-size: 22px; }
.eimg { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.en { font-weight: 700; font-size: 13px; }
.er { font-size: 11px; color: var(--ts); }
.sc { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 15px; cursor: pointer; transition: transform .15s; }
.sc:hover { transform: scale(1.25); }

/* === STATS === */
.sg { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 14px; }
.stc { background: var(--sf); border-radius: var(--rd); padding: 20px; border: 1px solid var(--bd); }
.sth { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.sta { font-size: 36px; }
.sti { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
.stn { font-size: 17px; font-weight: 700; }
.str { font-size: 12px; color: var(--ts); }
.stl { font-size: 12px; font-weight: 700; color: var(--ts); margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px; }
.sts { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.stt { display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 600; }
.qr { margin-bottom: 8px; }
.qh { display: flex; justify-content: space-between; font-size: 12px; color: var(--ts); margin-bottom: 4px; }
.total-bar { background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 10px; padding: 14px 18px; margin-bottom: 14px; color: #fff; }
.total-bar .tbl { font-size: 12px; opacity: .8; font-weight: 600; }
.total-bar .tbv { font-size: 22px; font-weight: 800; }
.total-bar .tbb { height: 8px; background: rgba(255,255,255,.25); border-radius: 4px; margin-top: 6px; overflow: hidden; }
.total-bar .tbf { height: 100%; background: #fff; border-radius: 4px; transition: width .4s; }

/* === PENDING === */
.ps { margin-top: 20px; }
.pt { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
.pc { background: var(--sf); border-radius: var(--rd); padding: 14px 18px; border: 1px solid var(--bd); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.ba { border: none; background: var(--su); color: #fff; padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; }
.br { border: 1px solid var(--dg); background: #fff; color: var(--dg); padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; }

/* === MODAL === */
.mo { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.4); backdrop-filter: blur(8px); opacity: 0; pointer-events: none; transition: opacity .25s; }
.mo.show { opacity: 1; pointer-events: auto; }
.md { background: #fff; border-radius: 24px; padding: 32px; min-width: 420px; max-width: 800px; width: 92vw; box-shadow: 0 24px 60px rgba(0,0,0,.12); max-height: 88vh; overflow-y: auto; overflow-x: visible; transform: translateY(24px) scale(.97); transition: all .3s cubic-bezier(.22,1,.36,1); position: relative; }
.mo.show .md { transform: translateY(0) scale(1); }
.mh { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.mt { font-size: 20px; font-weight: 800; }
.mc { border: none; background: #f1f5f9; width: 34px; height: 34px; border-radius: 10px; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.mc:hover { background: #e2e8f0; transform: rotate(90deg); }
.row { padding: 14px; border-radius: 14px; margin-bottom: 8px; border: 2px solid var(--bd); cursor: pointer; transition: all .2s; }
.row:hover { border-color: var(--pr); background: var(--pb); transform: translateX(4px); }
.row.sel { border-color: var(--pr); background: var(--pb); box-shadow: 0 0 0 4px rgba(67,97,238,.1); }
.rh { display: flex; align-items: center; gap: 12px; }
.rs { margin-left: auto; padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
.pg { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.pl { display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px; border-radius: 20px; border: 2px solid transparent; font-size: 13px; font-weight: 600; background: #f8fafc; color: var(--ts); transition: all .2s; cursor: pointer; }
.pl:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.06); }
.pl.on { transform: scale(1.05); box-shadow: 0 4px 14px rgba(0,0,0,.1); }
.sla { font-size: 12px; font-weight: 800; color: var(--ts); margin: 12px 0 8px; text-transform: uppercase; letter-spacing: 1px; }
.btn { width: 100%; padding: 14px 0; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; color: #fff; margin-top: 16px; transition: all .2s; cursor: pointer; }
.btn:hover { filter: brightness(.95); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,.15); }
.btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.fg { margin-bottom: 18px; }
.fl { display: block; font-size: 13px; font-weight: 800; color: var(--ts); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.fi { width: 100%; padding: 12px 16px; border: 2px solid var(--bd); border-radius: 12px; font-size: 14px; font-family: inherit; outline: none; transition: all .2s; }
.fi:focus { border-color: var(--pr); box-shadow: 0 0 0 4px rgba(67,97,238,.1); }
textarea.fi { resize: vertical; min-height: 70px; }

/* === TOAST === */
.tst { position: fixed; top: 20px; right: 20px; z-index: 2000; background: #fff; padding: 14px 22px; border-radius: 10px; box-shadow: var(--sl); font-weight: 600; font-size: 14px; border-left: 4px solid var(--su); transform: translateX(120%); transition: transform .3s ease; pointer-events: none; }
.tst.show { transform: translateX(0); }
.tst.err { border-left-color: var(--dg); }

/* === PROFILE === */
.pil { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--bd); }
.pel { font-size: 60px; line-height: 80px; }

/* === SUCCESS INDICATOR === */
.save-ok { display: inline-flex; align-items: center; gap: 4px; color: var(--su); font-size: 13px; font-weight: 700; margin-left: 8px; opacity: 0; transition: opacity .3s; }
.save-ok.show { opacity: 1; }

/* === DATE PICKER === */
.dp-wrap { position: relative; }
.dp-input { width: 100%; padding: 10px 14px; border: 1px solid var(--bd); border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; cursor: pointer; background: #fff; transition: border-color .15s; }
.dp-input:focus { border-color: var(--pr); }
.dp-pop { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); z-index: 1100; background: #fff; border-radius: 12px; box-shadow: var(--sl); border: 1px solid var(--bd); padding: 12px; margin-top: 4px; min-width: 260px; max-width: 300px; }
.dp-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.dp-header span { font-size: 14px; font-weight: 700; }
.dp-nav { border: none; background: #f1f5f9; width: 28px; height: 28px; border-radius: 6px; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.dp-nav:hover { background: #e2e8f0; }
.dp-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; }
.dp-dow { font-size: 11px; font-weight: 700; color: var(--ts); padding: 4px 0; }
.dp-day { padding: 6px 0; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all .1s; font-weight: 500; }
.dp-day:hover { background: var(--pb); color: var(--pr); }
.dp-day.sel { background: var(--pr); color: #fff; font-weight: 700; }
.dp-day.today { border: 1px solid var(--pr); }
.dp-day.empty { cursor: default; }
.dp-day.empty:hover { background: transparent; }

/* Modal should not clip date picker popups */


/* === DARK MODE === */
[data-theme="dark"] {
  --bg: #0c0c24; --sf: #161638; --bd: #2a2d50; --tx: #e8ecf4; --ts: #7b83a1;
  --pr: #6c8dff; --pb: #1a2350; --dg: #ff6b8a; --db: #2d1520;
  --su: #34d399; --sb: #0a2e20; --wn: #fbbf24; --wb: #2d2006;
  --sh: 0 2px 8px rgba(0,0,0,.3); --sl: 0 12px 40px rgba(0,0,0,.4);
  color: var(--tx);
}
[data-theme="dark"] body { background: var(--bg); color: var(--tx); }
[data-theme="dark"] .ctn { color: var(--tx); }
[data-theme="dark"] .hdr h1 { color: var(--tx); }
[data-theme="dark"] .cd { background: var(--sf); border-color: var(--bd); }
[data-theme="dark"] .cd:hover { box-shadow: 0 10px 30px rgba(0,0,0,.4); }
[data-theme="dark"] .cd.today { border-color: var(--pr); background: var(--pb); }
[data-theme="dark"] .rt th { background: #1e293b; border-color: #334155; color: #e2e8f0; }
[data-theme="dark"] .rt td { border-color: #1e293b; }
[data-theme="dark"] .rt td.sk { background: #1e293b; }
[data-theme="dark"] .nb { background: #334155; color: #e2e8f0; }
[data-theme="dark"] .nb:hover { background: #475569; }
[data-theme="dark"] .ubtn { background: #334155; color: #e2e8f0; }
[data-theme="dark"] .ubtn:hover { background: #475569; }
[data-theme="dark"] .tab { color: var(--ts); }
[data-theme="dark"] .tab.on { background: var(--pr); color: #fff; }
[data-theme="dark"] .md { background: #1e293b; color: #e2e8f0; }
[data-theme="dark"] .fi { background: #0f172a; border-color: #334155; color: #e2e8f0; }
[data-theme="dark"] .mc { background: #334155; color: #e2e8f0; }
[data-theme="dark"] .row { border-color: #334155; }
[data-theme="dark"] .row:hover { border-color: var(--pr); }
[data-theme="dark"] .row.sel { background: var(--pb); }
[data-theme="dark"] .tst { background: #1e293b; color: #e2e8f0; }
[data-theme="dark"] .ab { opacity: 0.9; }
[data-theme="dark"] .lgd { background: var(--sf); border-color: var(--bd); color: var(--tx); }
/* Roster table dark mode */
[data-theme="dark"] table { color: var(--tx); }
[data-theme="dark"] .ros-section { background: #161638 !important; border-color: #2a2d50 !important; }
[data-theme="dark"] .ros-weekhdr { background: #1e293b !important; border-color: #2a2d50 !important; color: #94a3b8 !important; }
[data-theme="dark"] .ros-th { background: #1e293b !important; border-color: #2a2d50 !important; }
[data-theme="dark"] .ros-td { border-color: #1e293b !important; }
[data-theme="dark"] .ros-name { background: #161638 !important; color: #e2e8f0 !important; }
[data-theme="dark"] .ros-today { background: #1a2350 !important; }

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .cg { gap: 3px; }
  .cd { padding: 4px; min-height: 75px; }
  .et { font-size: 10px; }
  .hdr h1 { font-size: 20px; }
  .sg { grid-template-columns: 1fr; }
  .md { min-width: 0; width: 95vw; margin: 10px; padding: 20px; }
}
</style>
</head><body>
<div class="ctn" id="app"></div>
<div class="tst" id="toast"></div>

<!-- ============================================= -->
<!-- SCRIPT                                        -->
<!-- ============================================= -->
<script>
// === DARK MODE INIT ===
if (localStorage.getItem('theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

// === CONSTANTS ===
const U = ${UJ};
const DAYS = ['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];
const DAYF = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const MON = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const SHIFT = {
  day:     { l:'กลางวัน',  c:'#f59e0b', b:'#fef3c7', i:'☀️' },
  evening: { l:'กลางคืน',  c:'#6366f1', b:'#e0e7ff', i:'🌙' },
  off:     { l:'วันหยุด',  c:'#10b981', b:'#d1fae5', i:'🏖️' },
};

const LEAVE = {
  sick:      { l:'ลาป่วย',      c:'#dc2626', b:'#fef2f2', i:'🏥' },
  personal:  { l:'ลากิจ',       c:'#ef4444', b:'#fee2e2', i:'📋' },
  vacation:  { l:'ลาพักร้อน',   c:'#f87171', b:'#fff1f2', i:'✈️' },
};

const MIN_YEAR = 2026, MIN_MONTH = 0; // ม.ค. 2569 เป็นต้นไป
const ROLE_LEVEL = { owner: 100, admin: 80, approver: 60, employee: 40, tester: 20 };
const isO = ROLE_LEVEL[U.role] >= 80; // owner + admin
const isOwner = U.role === 'owner';
const canApproveRole = ROLE_LEVEL[U.role] >= 60; // owner + admin + approver
const isTester = U.role === 'tester';
const ROLE_LABELS = { owner: '👑 เจ้าของ', admin: '🛡️ แอดมิน', approver: '👮 ผู้อนุมัติ', employee: '👤 พนักงาน', tester: '🧪 ทดสอบ' };
const KPI_ADMINS_DEFAULT = []; // ตั้งค่าจาก settings key: kpi_admins
let KPI_ADMINS = KPI_ADMINS_DEFAULT;

// === STATE ===
const D = {
  v: 'calendar', y: new Date().getFullYear(), m: new Date().getMonth(),
  calMode: 'calendar', // 'calendar' or 'icon' (roster-style)
  emp: [], sh: {}, lv: {}, hol: {}, set: {}, yl: {},
  pl: [], ps: [], sd: null, se: null, modal: null,
  hist: null, histLoaded: false,
  kpi: null, kpiLoaded: false, kpiTab: 'summary',
  onboarded: false,
};

// === API ===
async function api(p, m = 'GET', b = null) {
  const o = { method: m, headers: { 'Content-Type': 'application/json' } };
  if (b) o.body = JSON.stringify(b);
  const r = await fetch(p, o);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'เกิดข้อผิดพลาด');
  return d;
}

// === TOAST (no re-render) ===
let _tt;
function toast(msg, err = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'tst show' + (err ? ' err' : '');
  clearTimeout(_tt);
  _tt = setTimeout(() => { el.className = 'tst'; }, 2500);
}

// === DATA ===
async function load() {
  try {
    const ms = D.y + '-' + String(D.m + 1).padStart(2, '0');
    const [o, pl, ps, sdp] = await Promise.all([
      api('/api/overview?month=' + ms),
      api('/api/leaves?status=pending'),
      api('/api/swaps?status=pending'),
      canApproveRole ? api('/api/self-dayoff') : Promise.resolve({ data: [] }),
    ]);
    D.emp = o.data.employees;
    D.selfDayoffPending = sdp.data || [];
    D.set = o.data.settings || {};
    // Load achievements from settings
    if (D.set.achievements) { try { D.achievements = JSON.parse(D.set.achievements); } catch(e) { D.achievements = null; } } else { D.achievements = null; }
    // อัพเดท KPI admins จาก settings
    if (D.set.kpi_admins) KPI_ADMINS = D.set.kpi_admins.split(',').map(s => s.trim());
    else KPI_ADMINS = KPI_ADMINS_DEFAULT;
    D.yl = o.data.yearlyLeaves || {}; D.yld = o.data.yearlyLeaveDetails || []; D.selfMoves = o.data.selfMoves || []; D.swapReqs = o.data.swapRequests || []; D.isApprover = o.data.isApprover || false;
    D.sh = {}; o.data.shifts.forEach(s => { D.sh[s.employee_id + '-' + s.date] = s.shift_type; });
    D.lv = {}; o.data.leaves.forEach(l => { D.lv[l.employee_id + '-' + l.date] = { t: l.leave_type, s: l.status, id: l.id }; });
    D.hol = {}; o.data.holidays.forEach(h => { D.hol[h.date] = h.name; });
    D.pl = pl.data; D.ps = ps.data;
    D.hist = null; D.histLoaded = false;
    D.kpi = null; D.kpiLoaded = false;
    D.kpiYear = D.kpiYear || []; D.kpiYearLoaded = false;
    D.walletLoaded = false;
  } catch (e) { toast('โหลดไม่สำเร็จ: ' + e.message, true); }
  render();
}

// === HELPERS ===
// วัน blackout ดึงจาก settings (key: blackout_dates) — ค่าเริ่มต้น 1-4 ม.ค. 2569
const BLACKOUT_DEFAULT = '2026-01-01,2026-01-02,2026-01-03,2026-01-04';
function getBlackout() { return (D.set.blackout_dates || BLACKOUT_DEFAULT).split(',').map(s => s.trim()).filter(Boolean); }
function isBlackout(dateKey) { return getBlackout().includes(dateKey); }
function dk(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); }
function itd(y, m, d) { const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d; }
function gdow(y, m, d) { return new Date(y, m, d).getDay(); }
function gdim(y, m) { return new Date(y, m + 1, 0).getDate(); }
function fdm(y, m) { return new Date(y, m, 1).getDay(); }
function ce() { return D.emp.filter(e => e.show_in_calendar === 1); }
function offD(e) { return (e.default_off_day || '6').split(',').map(Number); }
function isOff(e, y, m, d) { return offD(e).includes(gdow(y, m, d)); }
function stime(e) { return (e.shift_start || '09:00') + '-' + (e.shift_end || '17:00'); }
function dn(e) { return e.nickname || e.name; }
function fmtDate(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-'); return d + '/' + m + '/' + (+y + 543); }
function fmtDateTime(iso) { if (!iso) return ''; try { const s = iso.replace(' ','T'); const dt = new Date(s + (s.includes('+') || s.endsWith('Z') ? '' : 'Z')); if (isNaN(dt.getTime())) return iso; const dd = String(dt.getUTCDate()).padStart(2,'0'), mm = String(dt.getUTCMonth()+1).padStart(2,'0'), yy = dt.getUTCFullYear()+543; const hr = (dt.getUTCHours()+7)%24, hh = String(hr).padStart(2,'0'), mi = String(dt.getUTCMinutes()).padStart(2,'0'); return dd+'/'+mm+'/'+yy+' '+hh+':'+mi+' น.'; } catch { return iso; } }
function canGoPrev() {
  // ถอยได้ถ้าเดือนหลังจากถอยยังอยู่ใน 2026 ขึ้นไป
  let py = D.y, pm = D.m - 1;
  if (pm < 0) { pm = 11; py--; }
  return py >= MIN_YEAR;
}

function disp(e, k, y, m, d) {
  const lv = D.lv[e.id + '-' + k];
  if (lv && lv.s === 'approved') return { isL: true, ...(LEAVE[lv.t] || LEAVE.sick), st: lv.s, lid: lv.id, lt: lv.t };
  if (lv && lv.s === 'pending') return { isL: true, isPending: true, ...(LEAVE[lv.t] || LEAVE.sick), st: lv.s, lid: lv.id, lt: lv.t };
  const s = D.sh[e.id + '-' + k];
  if (s) return { isL: false, ...SHIFT[s], ty: s };
  if (isOff(e, y, m, d)) return { isL: false, ...SHIFT.off, ty: 'off' };
  return { isL: false, ...SHIFT[e.default_shift], ty: e.default_shift };
}

function av(e, lg) {
  if (e.profile_image) return h('img', { src: e.profile_image, className: lg ? 'pil' : 'eimg' });
  return h('span', { className: lg ? 'pel' : 'eav' }, e.avatar);
}

// === DOM BUILDER ===
function h(t, a = {}, ...ch) {
  const el = document.createElement(t);
  for (const [k, v] of Object.entries(a)) {
    if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'className') el.className = v;
    else if (k === 'innerHTML') el.innerHTML = v;
    else if (k === 'src') el.src = v;
    else if (k === 'disabled' || k === 'checked' || k === 'selected') { if (v) el.setAttribute(k, ''); else el.removeAttribute(k); }
    else el.setAttribute(k, v);
  }
  ch.flat(Infinity).forEach(c => {
    if (c == null) return;
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(c) : c);
  });
  return el;
}

// === CUSTOM DATE PICKER (DD/MM/YYYY พ.ศ.) ===
function datePicker(id, initVal) {
  // initVal = ISO string "YYYY-MM-DD" or ""
  let val = initVal || '';
  let viewY = val ? +val.split('-')[0] : new Date().getFullYear();
  let viewM = val ? +val.split('-')[1] - 1 : new Date().getMonth();
  let open = false;

  const wrap = h('div', { className: 'dp-wrap', id: id + '-wrap' });
  const input = h('div', { className: 'dp-input', id: id, 'data-value': val }, val ? fmtDate(val) : 'เลือกวันที่...');
  input.style.color = val ? 'var(--tx)' : '#94a3b8';

  function buildCal() {
    let pop = document.getElementById(id + '-pop');
    if (pop) pop.remove();
    if (!open) return;

    pop = h('div', { className: 'dp-pop', id: id + '-pop' });
    // ใช้ fixed position เพื่อไม่ให้ถูก clip โดย modal overflow
    pop.style.position = 'fixed';
    pop.style.zIndex = '2000';
    const rect = input.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 280)) + 'px';
    // ถ้าอยู่ครึ่งล่างจอ → แสดงขึ้นข้างบน
    if (rect.bottom + 280 > window.innerHeight) {
      pop.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
      pop.style.top = 'auto';
    } else {
      pop.style.top = (rect.bottom + 4) + 'px';
      pop.style.bottom = 'auto';
    }
    pop.addEventListener('click', e => e.stopPropagation());

    const hdr = h('div', { className: 'dp-header' },
      h('button', { className: 'dp-nav', onClick: (e) => { e.stopPropagation(); if (viewM === 0) { viewM = 11; viewY--; } else viewM--; buildCal(); } }, '‹'),
      h('span', {}, MON[viewM] + ' ' + (viewY + 543)),
      h('button', { className: 'dp-nav', onClick: (e) => { e.stopPropagation(); if (viewM === 11) { viewM = 0; viewY++; } else viewM++; buildCal(); } }, '›'),
    );
    pop.appendChild(hdr);

    const grid = h('div', { className: 'dp-grid' });
    ['อา','จ','อ','พ','พฤ','ศ','ส'].forEach(d => grid.appendChild(h('div', { className: 'dp-dow' }, d)));

    const first = new Date(viewY, viewM, 1).getDay();
    const offset = first; // Sunday=0, no offset needed
    for (let i = 0; i < offset; i++) grid.appendChild(h('div', { className: 'dp-day empty' }));

    const dim = new Date(viewY, viewM + 1, 0).getDate();
    const todayISO = new Date().toISOString().split('T')[0];

    for (let d = 1; d <= dim; d++) {
      const iso = viewY + '-' + String(viewM + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const isSel = iso === val;
      const isToday = iso === todayISO;
      const cls = 'dp-day' + (isSel ? ' sel' : '') + (isToday ? ' today' : '');
      grid.appendChild(h('div', { className: cls, onClick: (e) => {
        e.stopPropagation();
        val = iso;
        input.textContent = fmtDate(iso);
        input.style.color = 'var(--tx)';
        input.setAttribute('data-value', iso);
        open = false;
        buildCal();
      } }, String(d)));
    }
    pop.appendChild(grid);
    document.body.appendChild(pop);
  }

  input.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other open date pickers
    document.querySelectorAll('.dp-pop').forEach(p => p.remove());
    document.querySelectorAll('.dp-wrap').forEach(w => { if (w !== wrap) w._dpOpen = false; });
    open = !open;
    wrap._dpOpen = open;
    if (open && val) { viewY = +val.split('-')[0]; viewM = +val.split('-')[1] - 1; }
    buildCal();
  });

  wrap.appendChild(input);
  return wrap;
}

// Close date pickers on outside click (but don't close modal)
document.addEventListener('click', (e) => {
  // ไม่ปิด modal เมื่อคลิกปิด date picker
  if (e.target.closest('.dp-wrap') || e.target.closest('.dp-pop')) return;
  document.querySelectorAll('.dp-pop').forEach(p => p.remove());
});

// Helper to get date picker value
function dpVal(id) {
  const el = document.getElementById(id);
  return el ? el.getAttribute('data-value') || '' : '';
}

// === MODAL HELPERS (smooth open/close) ===
function openModal(name) { D.modal = name; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); }
function closeModal() {
  const m = document.querySelector('.mo');
  if (m) { m.classList.remove('show'); setTimeout(() => { D.modal = null; render(); }, 200); }
  else { D.modal = null; render(); }
}

// === RENDER ===
function render() {
  const a = document.getElementById('app');
  a.innerHTML = '';
  // Close any orphan date picker popups
  document.querySelectorAll('.dp-pop').forEach(p => p.remove());
  // First-login onboarding: ถ้ายังไม่กรอกเบอร์โทร (ไม่รวม owner)
  if (!D.onboarded && D.emp.length > 0) {
    D.onboarded = true;
    const me = D.emp.find(e => e.id === U.id);
    if (me && !me.phone) {
      setTimeout(() => openModal('onboard'), 500);
    }
  }
  a.appendChild(rHdr());
  // 🔔 Notification banner สำหรับ pending swaps ที่ต้องอนุมัติ
  const myPendingSwaps = D.ps.filter(sw => sw.to_employee_id === U.id);
  if (myPendingSwaps.length > 0) {
    const banner = h('div', { style: { background: 'linear-gradient(135deg, #fef3c7, #fde68a)', padding: '12px 18px', borderRadius: '12px', marginBottom: '12px', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', animation: 'pulse 2s infinite', cursor: 'pointer' }, onClick: () => { D.v = 'pending'; render(); } },
      h('span', { style: { fontSize: '28px' } }, '🔔'),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontWeight: 800, fontSize: '15px', color: '#92400e' } }, 'คุณมีคำขอสลับกะรออนุมัติ ' + myPendingSwaps.length + ' รายการ!'),
        h('div', { style: { fontSize: '13px', color: '#a16207', marginTop: '2px' } },
          myPendingSwaps.map(sw => (sw.from_nickname || sw.from_name) + ' ขอสลับ ' + (sw.swap_type === 'dayoff' ? 'วันหยุด' : 'กะ') + ' ' + fmtDate(sw.date)).join(' | '))),
      h('span', { style: { fontSize: '13px', fontWeight: 700, color: '#92400e', background: '#fff', padding: '6px 14px', borderRadius: '8px', whiteSpace: 'nowrap' } }, 'ดูรายละเอียด →'),
    );
    a.appendChild(banner);
  }
  if (D.v !== 'wallet') {
    a.appendChild(rNav());
    a.appendChild(rLgd());
  }
  if (D.v === 'calendar') {
    if (D.calMode === 'icon') a.appendChild(rRos());
    else a.appendChild(rCal());
  }
  else if (D.v === 'stats') a.appendChild(rSta());
  else if (D.v === 'pending') { D.v = 'history'; a.appendChild(rHist()); } // redirect old pending to history
  else if (D.v === 'history') a.appendChild(rHist());
  else if (D.v === 'kpi') a.appendChild(rKpi());
  else if (D.v === 'wallet') a.appendChild(rWallet());
  if (D.modal) { a.appendChild(rModal()); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); }
}

// === HEADER ===
function rHdr() {
  const tabs = ['calendar', 'stats'];
  // นับ pending leaves แบบ group (ต่อเนื่องนับ 1)
  let groupedLeaveCount = 0;
  if (canApproveRole && D.pl.length > 0) {
    const _sorted = [...D.pl].sort((a, b) => (String(a.employee_id) + '|' + a.leave_type).localeCompare(String(b.employee_id) + '|' + b.leave_type) || a.date.localeCompare(b.date));
    let _prev = null;
    _sorted.forEach(l => {
      const sameGroup = _prev && +_prev.employee_id === +l.employee_id && _prev.leave_type === l.leave_type;
      if (sameGroup) { const [y,m,d] = _prev.date.split('-').map(Number); const a = new Date(y, m-1, d+1); const [y2,m2,d2] = l.date.split('-').map(Number); if (a.getFullYear()===y2 && a.getMonth()===m2-1 && a.getDate()===d2) { _prev = l; return; } }
      groupedLeaveCount++;
      _prev = l;
    });
  }
  const myPendingCount = canApproveRole ? groupedLeaveCount + D.ps.length + (D.selfDayoffPending||[]).length : D.ps.filter(sw => sw.to_employee_id === U.id).length;
  const hasPendingForMe = D.ps.some(sw => sw.to_employee_id === U.id);
  if (canApproveRole || hasPendingForMe) {} // pending merged into history
  tabs.push('history');
  tabs.push('kpi');
  tabs.push('wallet');
  return h('div', { className: 'hdr' },
    h('div', {}, h('h1', {}, (D.set.company_name || '📅 ระบบจัดการกะ & วันลา')), h('p', {}, 'จัดตารางกะ สลับกะ ลางาน ดูสถิติ')),
    h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } },
      h('div', { className: 'tabs' }, ...tabs.map(v => {
        const lb = { calendar: '📅 ปฏิทิน', stats: '📊 สถิติ', history: '📜 ประวัติ', kpi: '⚡ KPI', wallet: '💰 กระเป๋า' };
        const tabEl = h('button', { className: 'tab' + (D.v === v ? ' on' : ''), onClick: () => { D.v = v; render(); }, style: { position: 'relative' } }, lb[v]);
        if (v === 'history' && myPendingCount > 0) tabEl.appendChild(h('span', { style: { position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 800, minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxShadow: '0 2px 4px rgba(239,68,68,0.4)', animation: myPendingCount > 0 ? 'pulse 2s infinite' : 'none' } }, String(myPendingCount)));
        return tabEl;
      })),
      h('div', { className: 'ub' },
        U.profile_image ? h('img', { src: U.profile_image, className: 'ua' }) : h('span', { className: 'uae' }, U.avatar),
        h('div', {}, h('div', { className: 'un' }, U.nickname || U.name), h('div', { className: 'ur' }, ROLE_LABELS[U.role] || '👤 พนักงาน')),
        h('button', { className: 'ubtn', onClick: () => openModal('profile') }, 'โปรไฟล์'),
        isO ? h('button', { className: 'ubtn', onClick: () => openModal('settings') }, '⚙️') : '',
        h('button', { className: 'ubtn', onClick: () => { const d = document.documentElement; const isDark = d.getAttribute('data-theme') === 'dark'; d.setAttribute('data-theme', isDark ? '' : 'dark'); localStorage.setItem('theme', isDark ? 'light' : 'dark'); } }, document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙'),
        h('button', { className: 'ubtn', style: { color: '#ef4444' }, onClick: () => { location.href = '/auth/logout'; } }, 'ออก'),
      ),
    ),
  );
}

// === MONTH NAV ===
function rNav() {
  // View mode toggle (เฉพาะหน้า calendar)
  const viewToggle = D.v === 'calendar' ? h('div', { style: { display: 'flex', gap: '2px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' } },
    h('button', { style: { border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, background: D.calMode === 'calendar' ? '#fff' : 'transparent', color: D.calMode === 'calendar' ? '#3b82f6' : '#94a3b8', boxShadow: D.calMode === 'calendar' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', cursor: 'pointer' }, onClick: () => { D.calMode = 'calendar'; render(); } }, '📅 ปฏิทิน'),
    h('button', { style: { border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, background: D.calMode === 'icon' ? '#fff' : 'transparent', color: D.calMode === 'icon' ? '#3b82f6' : '#94a3b8', boxShadow: D.calMode === 'icon' ? '0 1px 3px rgba(0,0,0,.1)' : 'none', cursor: 'pointer' }, onClick: () => { D.calMode = 'icon'; render(); } }, '📋 ตารางกะ'),
  ) : '';

  return h('div', { className: 'mnv' },
    h('button', { className: 'nb', disabled: !canGoPrev(), onClick: () => { if (!canGoPrev()) return; if (D.m === 0) { D.m = 11; D.y--; } else D.m--; load(); } }, '‹'),
    h('h2', {}, MON[D.m] + ' ' + (D.y + 543)),
    h('button', { className: 'nb', onClick: () => { if (D.m === 11) { D.m = 0; D.y++; } else D.m++; load(); } }, '›'),
    h('button', { className: 'tb', onClick: () => { D.m = new Date().getMonth(); D.y = new Date().getFullYear(); load(); } }, 'วันนี้'),
    viewToggle,
    h('div', { className: 'sp' }),
    h('button', { className: 'ab', style: { background: '#fef2f2', color: '#ef4444' }, onClick: () => { D.sd = dk(D.y, D.m, new Date().getDate()); openModal('leave'); } }, '+ ลางาน'),
    h('button', { className: 'ab', style: { background: '#ecfdf5', color: '#10b981' }, onClick: () => { D.sd = dk(D.y, D.m, new Date().getDate()); openModal('swap'); } }, '🔄 สลับกะ'),
    h('button', { className: 'ab', style: { background: '#fef3c7', color: '#d97706' }, onClick: () => { openModal('dayoffSwap'); } }, '📅 สลับวันหยุด'),
    h('button', { className: 'ab', style: { background: '#f5f3ff', color: '#7c3aed' }, onClick: () => { openModal('selfDayoff'); } }, '🔀 ย้ายวันหยุด'),
    isO ? h('button', { className: 'ab', style: { background: '#eff6ff', color: '#3b82f6' }, onClick: () => openModal('employee') }, '👤 จัดการพนักงาน') : '',
  );
}

// === LEGEND ===
function rLgd() {
  // ซ่อน legend ในหน้า KPI และ history
  if (D.v === 'kpi' || D.v === 'history') return h('div');
  return h('div', { className: 'lgd' },
    ...Object.entries(SHIFT).map(([, v]) => h('div', { className: 'li' }, h('span', { className: 'lic', style: { background: v.b } }, v.i), h('span', { style: { fontWeight: 600 } }, v.l))),
    h('div', { className: 'lsep' }),
    ...Object.entries(LEAVE).map(([, v]) => h('div', { className: 'li' }, h('span', {}, v.i), h('span', { style: { fontWeight: 600 } }, v.l))),
  );
}

// === CALENDAR ===
function rCal() {
  const g = h('div', { className: 'cg' });
  DAYS.forEach((d, i) => g.appendChild(h('div', { className: 'ch' + (i === 0 || i === 6 ? ' we' : '') }, d)));
  for (let i = 0; i < fdm(D.y, D.m); i++) g.appendChild(h('div'));
  const dm = gdim(D.y, D.m);
  for (let d = 1; d <= dm; d++) {
    const k = dk(D.y, D.m, d), td = itd(D.y, D.m, d), hl = D.hol[k];
    if (isBlackout(k)) {
      const dy = h('div', { className: 'cd', style: { background: '#f1f5f9', opacity: 0.5 } });
      dy.appendChild(h('div', { className: 'dn' }, String(d)));
      dy.appendChild(h('div', { style: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' } }, '— ไม่มีข้อมูล —'));
      g.appendChild(dy);
      continue;
    }
    const dy = h('div', { className: 'cd' + (td ? ' today' : '') + (hl ? ' hol' : '') });
    const nm = h('div', { className: 'dn' + (td ? ' tn' : '') }, String(d));
    if (td) nm.appendChild(h('span', { className: 'badge', style: { background: '#3b82f6', color: '#fff' } }, 'วันนี้'));
    dy.appendChild(nm);
    if (hl) dy.appendChild(h('div', { className: 'hn' }, '🔴 ' + hl));
    let workCount = 0, totalCount = ce().length;
    ce().forEach(emp => {
      const inf = disp(emp, k, D.y, D.m, d);
      const isOff = inf.ty === 'off';
      const isPendingLeave = inf.isL && inf.isPending;
      // Pending leave = ยังไม่อนุมัติ → นับเป็นทำงาน
      if (!isOff && (!inf.isL || isPendingLeave)) workCount++;
      const cls = 'et' + (inf.isL ? ' lv' : '') + (isOff ? ' off' : '');
      const sty = isPendingLeave ? { background: inf.b, color: inf.c, borderColor: inf.c, opacity: 0.5, border: '2px dashed ' + inf.c }
        : inf.isL ? { background: inf.b, color: inf.c, borderColor: inf.c }
        : isOff ? { background: '#fff1f2', color: '#dc2626', borderColor: '#fca5a5', border: '2px dashed #f87171' }
        : { background: inf.b, color: inf.c };
      const txt = inf.i + ' ' + dn(emp) + (inf.isL ? ' (' + inf.l + (isPendingLeave ? ' ⏳' : '') + ')' : '') + (isOff ? ' (หยุด)' : '');
      dy.appendChild(h('div', { className: cls, style: sty }, txt));
    });
    // Headcount badge
    const hcColor = workCount < 2 ? '#ef4444' : workCount < 3 ? '#f59e0b' : '#10b981';
    nm.appendChild(h('span', { style: { fontSize: '10px', padding: '1px 6px', borderRadius: '6px', background: hcColor + '20', color: hcColor, fontWeight: 700, marginLeft: '4px' } }, '👤' + workCount + '/' + totalCount));
    g.appendChild(dy);
  }
  return g;
}

// === ROSTER (Weekly Card Layout) ===
function rRos() {
  const dm = gdim(D.y, D.m);
  const wrap = h('div', {});

  // สร้าง weeks array — แบ่งวันในเดือนเป็นสัปดาห์
  const weeks = [];
  let week = [];
  // เติมวันว่างก่อนวันที่ 1
  const firstDow = fdm(D.y, D.m);
  for (let i = 0; i < firstDow; i++) week.push(null);
  for (let d = 1; d <= dm; d++) {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }

  const emps = [...ce()].sort((a, b) => {
    const sa = a.default_shift === 'day' ? 0 : 1;
    const sb = b.default_shift === 'day' ? 0 : 1;
    return sa - sb;
  });

  weeks.forEach((wk, wi) => {
    // Week header
    const validDays = wk.filter(d => d !== null);
    const wStart = validDays[0], wEnd = validDays[validDays.length - 1];
    const weekLabel = 'สัปดาห์ที่ ' + (wi + 1) + ' — วันที่ ' + wStart + '-' + wEnd + ' ' + MON[D.m];

    const section = h('div', { className: 'ros-section', style: { marginBottom: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' } });

    // Week title bar
    section.appendChild(h('div', { className: 'ros-weekhdr', style: { padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 700, color: '#475569' } }, weekLabel));

    // Table for this week
    const tb = h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } });

    // Header row: days of week
    const thd = h('thead');
    const hr = h('tr');
    hr.appendChild(h('th', { className: 'ros-th', style: { padding: '8px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, minWidth: '130px', position: 'sticky', left: 0, zIndex: 2 } }, 'พนักงาน'));
    wk.forEach((d, di) => {
      if (d === null) {
        hr.appendChild(h('th', { className: 'ros-th', style: { padding: '8px 6px', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', minWidth: '70px' } }));
        return;
      }
      const k = dk(D.y, D.m, d);
      const td = itd(D.y, D.m, d);
      const hl = D.hol[k];
      const isWe = di === 0 || di === 6;
      hr.appendChild(h('th', { className: 'ros-th' + (td ? ' ros-today' : ''), style: {
        padding: '8px 6px', textAlign: 'center', borderBottom: '2px solid #e5e7eb', minWidth: '70px',
        background: td ? '#eff6ff' : hl ? '#fffbeb' : '#f8fafc',
        color: isWe ? '#ef4444' : td ? '#3b82f6' : '#475569', fontWeight: 700
      } },
        h('div', { style: { fontSize: '16px' } }, String(d)),
        h('div', { style: { fontSize: '10px', opacity: 0.7 } }, DAYS[di]),
        hl ? h('div', { style: { fontSize: '9px', color: '#d97706', marginTop: '2px' } }, '🔴') : '',
      ));
    });
    thd.appendChild(hr);
    tb.appendChild(thd);

    // Body: each employee
    const bd = h('tbody');
    emps.forEach(emp => {
      const r = h('tr');
      r.appendChild(h('td', { className: 'ros-name ros-td', style: { padding: '8px 12px', borderBottom: '1px solid #f1f5f9', position: 'sticky', left: 0, background: '#fff', zIndex: 1 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
          av(emp),
          h('div', { style: { fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' } }, dn(emp)))));

      wk.forEach(d => {
        if (d === null) {
          r.appendChild(h('td', { className: 'ros-td', style: { borderBottom: '1px solid #f1f5f9' } }));
          return;
        }
        const k = dk(D.y, D.m, d);
        const td = itd(D.y, D.m, d);
        if (isBlackout(k)) {
          r.appendChild(h('td', { className: 'ros-td', style: { textAlign: 'center', borderBottom: '1px solid #f1f5f9', opacity: 0.3 } }, '—'));
          return;
        }
        const inf = disp(emp, k, D.y, D.m, d);
        const isOffDay = inf.ty === 'off';
        const isPendingLeave = inf.isL && inf.isPending;
        const cellStyle = {
          textAlign: 'center', padding: '4px', borderBottom: '1px solid #f1f5f9',
          background: td ? '#f0f7ff' : 'transparent'
        };
        const cellClass = 'ros-td' + (td ? ' ros-today' : '');
        const tagStyle = isPendingLeave ? {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
          background: inf.b, color: inf.c, border: '1.5px dashed ' + inf.c,
          whiteSpace: 'nowrap', opacity: 0.5
        } : inf.isL ? {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
          background: inf.b, color: inf.c, border: '1.5px solid ' + inf.c,
          whiteSpace: 'nowrap'
        } : {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
          background: isOffDay ? '#fff1f2' : inf.b,
          color: isOffDay ? '#dc2626' : inf.c,
          border: isOffDay ? '1.5px dashed #f87171' : 'none',
          whiteSpace: 'nowrap'
        };
        const label = inf.isL ? inf.i + ' ' + inf.l + (isPendingLeave ? ' ⏳' : '') : isOffDay ? '🏖️ หยุด' : inf.i + ' ' + inf.l;
        r.appendChild(h('td', { className: cellClass, style: cellStyle }, h('span', { style: tagStyle, title: inf.l || '' }, label)));
      });
      bd.appendChild(r);
    });
    tb.appendChild(bd);
    section.appendChild(tb);
    wrap.appendChild(section);
  });

  return wrap;
}

// === ACHIEVEMENT SYSTEM 🏆 ===
const DEFAULT_ACHIEVEMENTS = [
  // 🎯 หมวดการมาทำงาน
  { id: 'iron_will', icon: '🔥', name: 'ติดจรวด', desc: 'ไม่ลาเลยทั้งเดือน', tier: 1, points: 10, cat: 'attendance' },
  { id: 'diamond', icon: '💎', name: 'ร่างทิพย์', desc: 'ไม่ลาเลย 3 เดือนติด', tier: 3, points: 50, cat: 'attendance' },
  { id: 'half_year_gold', icon: '🗓️', name: 'มนุษย์เหล็กครึ่งปี', desc: 'ไม่ลาเลย 6 เดือนแรก', tier: 3, points: 100, cat: 'attendance' },
  { id: 'streak_30', icon: '🏃', name: 'วิ่งมาราธอน', desc: 'ไม่ลาติดต่อกัน 30 วัน', tier: 1, points: 10, cat: 'attendance' },
  { id: 'streak_60', icon: '🏃‍♂️', name: 'วิ่งข้ามจังหวัด', desc: 'ไม่ลาติดต่อกัน 60 วัน', tier: 2, points: 30, cat: 'attendance' },
  { id: 'streak_90', icon: '🦸', name: 'วิ่งข้ามประเทศ', desc: 'ไม่ลาติดต่อกัน 90 วัน', tier: 3, points: 80, cat: 'attendance' },
  { id: 'early_bird', icon: '🐓', name: 'ไก่โห่ยังไม่ตื่น', desc: 'ไม่ลา + ไม่สลับกะ ทั้งเดือน', tier: 2, points: 15, cat: 'attendance' },
  // ⚡ หมวด KPI
  { id: 'perfect_kpi', icon: '⭐', name: 'มือปราบบัค', desc: 'KPI 0 error ทั้งเดือน', tier: 1, points: 10, cat: 'kpi' },
  { id: 'zero_damage', icon: '🛡️', name: 'ทำพังแต่ไม่แพง', desc: 'มี error แต่ค่าเสียหาย 0 บาท', tier: 1, points: 5, cat: 'kpi' },
  { id: 'low_damage', icon: '💸', name: 'หักแต่ไม่หัก(มาก)', desc: 'ค่าเสียหาย 0 บาท ได้ 1 pt / ≤100 บาท ได้ 3 pt', tier: 1, points: 3, cat: 'kpi' },
  { id: 'kpi_improve', icon: '📈', name: 'ขาขึ้น', desc: 'error เดือนนี้ < เดือนก่อน', tier: 2, points: 10, cat: 'kpi' },
  { id: 'kpi_max2', icon: '🎯', name: 'เกือบเทพ', desc: 'error แค่ 1-2 ครั้ง ก็ยังนับว่าเก่ง', tier: 1, points: 5, cat: 'kpi' },
  // ⚡ KPI ต่อเนื่อง (progressive — ยิ่งนาน ยิ่งรวย)
  { id: 'kpi_streak_3', icon: '💯', name: 'สะอาด 3 เดือน', desc: '0 error ติด 3 เดือน', tier: 2, points: 100, cat: 'kpi' },
  { id: 'kpi_streak_6', icon: '🏆', name: 'สะอาดครึ่งปี', desc: '0 error ติด 6 เดือน', tier: 3, points: 300, cat: 'kpi' },
  { id: 'kpi_streak_12', icon: '👼', name: 'นางฟ้าประจำปี', desc: '0 error ตลอดทั้งปี!', tier: 3, points: 500, cat: 'kpi' },
  // 🦸 หมวดความมั่นคง
  { id: 'no_swap', icon: '🪨', name: 'ก้อนหินไม่ขยับ', desc: 'ไม่สลับกะเลยทั้งเดือน', tier: 1, points: 10, cat: 'stability' },
  { id: 'rock_3m', icon: '🧱', name: 'แน่นปึ้ก 3 เดือน', desc: 'ไม่สลับกะ 3 เดือนติด', tier: 2, points: 50, cat: 'stability' },
  { id: 'rock_6m', icon: '🏔️', name: 'แน่นเท่าภูเขา', desc: 'ไม่สลับกะ 6 เดือนติด', tier: 3, points: 150, cat: 'stability' },
  { id: 'rock_12m', icon: '🌍', name: 'แน่นเท่าโลก', desc: 'ไม่สลับกะตลอดทั้งปี!', tier: 3, points: 300, cat: 'stability' },
  // 🏥 หมวดสุขภาพ
  { id: 'no_sick_month', icon: '🍀', name: 'ภูมิคุ้มกันเทพ', desc: 'ไม่ลาป่วยทั้งเดือน', tier: 1, points: 5, cat: 'health' },
  { id: 'no_sick_year', icon: '💚', name: 'ร่างกายทำด้วยเหล็ก', desc: 'ไม่ลาป่วยเลยทั้งปี (ธ.ค.)', tier: 3, points: 100, cat: 'health' },
  // 📊 หมวดโควต้า (ธ.ค.)
  { id: 'quota_saver', icon: '💰', name: 'หยุดน้อย ใจใหญ่', desc: 'ใช้โควต้า ≤25% (ธ.ค.)', tier: 2, points: 30, cat: 'quota' },
  { id: 'quota_rich', icon: '🏦', name: 'วันลาเอาไปทำอะไร', desc: 'ใช้โควต้า ≤10% (ธ.ค.)', tier: 3, points: 80, cat: 'quota' },
  // 🏅 หมวดทีม
  { id: 'team_no_leave', icon: '🤝', name: 'ทีมเดียวกัน(ไม่หยุด)', desc: 'ทุกคนไม่ลาทั้งเดือน', tier: 2, points: 50, cat: 'team' },
  { id: 'team_perfect', icon: '🏰', name: 'ป้อมปราการ', desc: 'ทุกคนไม่ลา+ไม่สลับ+ไม่ย้ายวันหยุด', tier: 3, points: 50, cat: 'team' },
  { id: 'team_zero_err', icon: '🌟', name: 'ทีมในฝัน', desc: 'ทุกคนในทีม 0 error ทั้งเดือน', tier: 3, points: 50, cat: 'team' },
  // 🏅 ทีมต่อเนื่อง (progressive)
  { id: 'team_streak_2', icon: '🔥', name: 'ทีมร้อนแรง 2 เดือน', desc: 'ป้อมปราการ 2 เดือนติด', tier: 3, points: 200, cat: 'team' },
  { id: 'team_streak_3', icon: '🔥🔥', name: 'ทีมลุกเป็นไฟ', desc: 'ป้อมปราการ 3 เดือนติด', tier: 3, points: 500, cat: 'team' },
  { id: 'team_streak_6', icon: '☄️', name: 'ทีมอุกกาบาต', desc: 'ป้อมปราการ 6 เดือนติด', tier: 3, points: 2000, cat: 'team' },
  // 👑 หมวดพิเศษ
  { id: 'comeback', icon: '🔄', name: 'ฟื้นจากเถ้าถ่าน', desc: 'เดือนก่อนมี error → เดือนนี้ 0', tier: 2, points: 15, cat: 'special' },
  { id: 'birthday', icon: '🎂', name: 'สุขสันต์วันเกิด!', desc: 'เคลมได้ในเดือนเกิดของคุณ', tier: 3, points: 100, cat: 'special' },
  { id: 'mvp', icon: '👑', name: 'เทพประจำเดือน', desc: 'คะแนนรวมสูงสุด', tier: 3, points: 20, cat: 'special' },
];
const ACH_CATS = { attendance: '🎯 มาทำงาน', kpi: '⚡ KPI', stability: '🦸 ความมั่นคง', health: '🏥 สุขภาพ', quota: '📊 โควต้า', team: '🏅 ทีม', special: '👑 พิเศษ' };
function getAchievements() { return D.achievements || DEFAULT_ACHIEVEMENTS; }
const TIER_COLORS = { 1: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', label: '🥉' }, 2: { bg: '#eff6ff', border: '#93c5fd', text: '#2563eb', label: '🥈' }, 3: { bg: '#fefce8', border: '#fde047', text: '#ca8a04', label: '🥇' } };
const TIER_NAMES = { 1: 'ทองแดง', 2: 'เงิน', 3: 'ทอง' };

function computeAchievements(empStats) {
  const results = {};
  const achs = getAchievements().filter(a => a.enabled !== false);
  const achIds = new Set(achs.map(a => a.id));
  const getMonthPrefix = (y, m) => y + '-' + String(m + 1).padStart(2, '0');

  const countLeaves = (empId, prefix) => (D.yld || []).filter(l => l.employee_id === empId && l.date.startsWith(prefix) && l.status === 'approved').length;
  const countSickLeaves = (empId, prefix) => (D.yld || []).filter(l => l.employee_id === empId && l.date.startsWith(prefix) && l.leave_type === 'sick' && l.status === 'approved').length;
  const countKpiErrors = (empId, prefix) => (D.kpiYear || []).filter(e => e.employee_id === empId && e.date && e.date.startsWith(prefix)).length;
  const countSwaps = (empId, prefix) => (D.swapReqs || []).filter(sr => sr.from_employee_id === empId && sr.status === 'approved' && sr.date && sr.date.startsWith(prefix)).length;
  const countSelfMoves = (empId, prefix) => (D.selfMoves || []).filter(sm => sm.employee_id === empId && sm.status === 'approved' && (sm.off_date?.startsWith(prefix) || sm.work_date?.startsWith(prefix))).length;
  const getKpiDmg = (empId, prefix) => (D.kpiYear || []).filter(e => e.employee_id === empId && e.date && e.date.startsWith(prefix)).reduce((s, e) => s + (e.damage_cost || 0), 0);

  const hasWorkedInMonth = (empId, prefix) => {
    const [y, m] = prefix.split('-').map(Number);
    const now = new Date();
    if (new Date(y, m, 0) > now) return false;
    if (new Date(y, m - 1, 1) > now) return false;
    return true;
  };

  const visibleEmps = empStats.filter(({ emp }) => emp.show_in_calendar !== 0 && emp.show_in_calendar !== '0');

  // หาเดือนที่จบแล้ว (ม.ค. ถึง เดือนก่อนหน้าเดือนปัจจุบัน)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-based
  const pastMonths = [];
  for (let m = 0; m < 12; m++) {
    const mp = getMonthPrefix(D.y, m);
    if (D.y < currentYear || (D.y === currentYear && m < currentMonth)) {
      if (hasWorkedInMonth(null, mp)) pastMonths.push(m);
    }
  }

  // Init results
  empStats.forEach(({ emp }) => {
    results[emp.id] = { badges: [], badgeDetails: [], totalPoints: 0, streak: 0, progress: {} };
  });

  // === วนทุกเดือนที่จบแล้ว สะสม badge ===
  pastMonths.forEach(monthIdx => {
    const mp = getMonthPrefix(D.y, monthIdx);
    const monthLabel = String(monthIdx + 1).padStart(2, '0');

    empStats.forEach(({ emp, sc, yl }) => {
      const worked = hasWorkedInMonth(emp.id, mp);
      if (!worked) return;
      const kpiErr = countKpiErrors(emp.id, mp);
      const kpiDmg = getKpiDmg(emp.id, mp);
      const leaves = countLeaves(emp.id, mp);
      const swaps = countSwaps(emp.id, mp);
      const sickLeaves = countSickLeaves(emp.id, mp);

      const addBadge = (id) => {
        if (!achIds.has(id)) return;
        results[emp.id].badges.push(id);
        results[emp.id].badgeDetails.push({ id, month: monthLabel });
        results[emp.id].totalPoints += (achs.find(a => a.id === id)?.points || 0);
      };

      // 🎯 ATTENDANCE
      if (leaves === 0) addBadge('iron_will');
      if (leaves === 0 && swaps === 0) addBadge('early_bird');

      // ⚡ KPI
      if (kpiErr === 0) addBadge('perfect_kpi');
      if (kpiErr > 0 && kpiDmg === 0) addBadge('zero_damage');
      if (kpiErr > 0 && kpiErr <= 2) addBadge('kpi_max2');
      if (kpiDmg <= 100) addBadge('low_damage');

      // KPI improve / comeback (เทียบเดือนก่อน)
      if (monthIdx > 0) {
        const prevMp = getMonthPrefix(D.y, monthIdx - 1);
        const prevErr = countKpiErrors(emp.id, prevMp);
        if (prevErr > 0 && kpiErr < prevErr) addBadge('kpi_improve');
        if (prevErr > 0 && kpiErr === 0) addBadge('comeback');
      }

      // 🦸 STABILITY
      if (swaps === 0) addBadge('no_swap');

      // 🏥 HEALTH
      if (sickLeaves === 0) addBadge('no_sick_month');
    });

    // 🏅 TEAM BADGES (ทุกเดือนที่จบแล้ว)
    if (visibleEmps.length > 1) {
      const allNoLeave = visibleEmps.every(({ emp }) => countLeaves(emp.id, mp) === 0);
      const allPerfect = visibleEmps.every(({ emp }) =>
        countLeaves(emp.id, mp) === 0 && countSwaps(emp.id, mp) === 0 && countSelfMoves(emp.id, mp) === 0);
      const allZeroErr = visibleEmps.every(({ emp }) => countKpiErrors(emp.id, mp) === 0);

      const giveTeamBadge = (badgeId) => {
        if (!achIds.has(badgeId)) return;
        const pts = achs.find(a => a.id === badgeId)?.points || 0;
        visibleEmps.forEach(({ emp }) => {
          results[emp.id].badges.push(badgeId);
          results[emp.id].badgeDetails.push({ id: badgeId, month: monthLabel });
          results[emp.id].totalPoints += pts;
        });
      };

      if (allNoLeave) giveTeamBadge('team_no_leave');
      if (allPerfect) giveTeamBadge('team_perfect');
      if (allZeroErr) giveTeamBadge('team_zero_err');
    }
  });

  // === Badge ที่คำนวณครั้งเดียว (ไม่ซ้ำต่อเดือน) ===
  empStats.forEach(({ emp, sc, yl }) => {
    const addOnce = (id) => {
      if (!achIds.has(id) || results[emp.id].badges.includes(id)) return;
      results[emp.id].badges.push(id);
      results[emp.id].totalPoints += (achs.find(a => a.id === id)?.points || 0);
    };

    // 💎 ร่างทิพย์ (3 เดือนติดไม่ลา) — ให้ครั้งเดียวถ้ามี 3 เดือนติดในเดือนที่จบแล้ว
    if (achIds.has('diamond') && pastMonths.length >= 3) {
      let consec = 0, got = false;
      for (const m of pastMonths) {
        if (countLeaves(emp.id, getMonthPrefix(D.y, m)) === 0) { consec++; if (consec >= 3) { got = true; break; } }
        else consec = 0;
      }
      if (got) addOnce('diamond');
    }

    // 🗓️ มนุษย์เหล็กครึ่งปี
    if (achIds.has('half_year_gold') && pastMonths.length >= 6) {
      let ok = true;
      for (let m = 0; m < 6; m++) { if (countLeaves(emp.id, getMonthPrefix(D.y, m)) > 0) { ok = false; break; } }
      if (ok) addOnce('half_year_gold');
    }

    // 🏃 Streak (real-time — นับวันจริงจนถึงวันนี้)
    let streak = 0, maxStreak = 0;
    const dm = gdim(D.y, D.m);
    const yearLeaves = new Set((D.yld || []).filter(l => l.employee_id === emp.id && (l.status === 'approved' || l.status === 'pending')).map(l => l.date));
    const blackoutDays = new Set(getBlackout());
    const jan1 = new Date(D.y, 0, 1);
    const today = new Date(); today.setHours(0,0,0,0);
    const endDate = today < new Date(D.y, D.m, dm) ? today : new Date(D.y, D.m, dm);
    for (let dt = new Date(jan1); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      const empOffs = (emp.default_off_day || '6').split(',').map(Number);
      if (empOffs.includes(dt.getDay())) continue;
      const iso = dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
      if (blackoutDays.has(iso)) continue;
      if (yearLeaves.has(iso)) { maxStreak = Math.max(maxStreak, streak); streak = 0; } else { streak++; }
    }
    maxStreak = Math.max(maxStreak, streak);
    results[emp.id].streak = streak; // streak ปัจจุบัน (ต่อเนื่องจนถึงวันนี้)
    results[emp.id].bestStreak = maxStreak; // สูงสุดในปี
    if (achIds.has('streak_90') && maxStreak >= 90) addOnce('streak_90');
    else if (achIds.has('streak_60') && maxStreak >= 60) addOnce('streak_60');
    else if (achIds.has('streak_30') && maxStreak >= 30) addOnce('streak_30');

    // KPI progressive streaks (นับเดือนที่จบแล้วย้อนหลัง)
    if (pastMonths.length > 0) {
      let kpiConsec = 0;
      for (let i = pastMonths.length - 1; i >= 0; i--) {
        if (countKpiErrors(emp.id, getMonthPrefix(D.y, pastMonths[i])) > 0) break;
        kpiConsec++;
      }
      if (achIds.has('kpi_streak_12') && kpiConsec >= 12) addOnce('kpi_streak_12');
      else if (achIds.has('kpi_streak_6') && kpiConsec >= 6) addOnce('kpi_streak_6');
      else if (achIds.has('kpi_streak_3') && kpiConsec >= 3) addOnce('kpi_streak_3');

      let swapConsec = 0;
      for (let i = pastMonths.length - 1; i >= 0; i--) {
        if (countSwaps(emp.id, getMonthPrefix(D.y, pastMonths[i])) > 0) break;
        swapConsec++;
      }
      if (achIds.has('rock_12m') && swapConsec >= 12) addOnce('rock_12m');
      else if (achIds.has('rock_6m') && swapConsec >= 6) addOnce('rock_6m');
      else if (achIds.has('rock_3m') && swapConsec >= 3) addOnce('rock_3m');
    }

    // Team progressive streaks
    if (visibleEmps.length > 1 && pastMonths.length >= 2) {
      let teamConsec = 0;
      for (let i = pastMonths.length - 1; i >= 0; i--) {
        const mp = getMonthPrefix(D.y, pastMonths[i]);
        const ok = visibleEmps.every(({ emp: e }) => countLeaves(e.id, mp) === 0 && countSwaps(e.id, mp) === 0 && countSelfMoves(e.id, mp) === 0);
        if (!ok) break;
        teamConsec++;
      }
      const giveTeamOnce = (badgeId) => {
        if (!achIds.has(badgeId)) return;
        const pts = achs.find(a => a.id === badgeId)?.points || 0;
        visibleEmps.forEach(({ emp: e }) => {
          if (!results[e.id].badges.includes(badgeId)) {
            results[e.id].badges.push(badgeId);
            results[e.id].totalPoints += pts;
          }
        });
      };
      if (teamConsec >= 6) giveTeamOnce('team_streak_6');
      else if (teamConsec >= 3) giveTeamOnce('team_streak_3');
      else if (teamConsec >= 2) giveTeamOnce('team_streak_2');
    }

    // 🏥 ไม่ลาป่วยทั้งปี (ธ.ค.)
    if (achIds.has('no_sick_year') && pastMonths.includes(11)) {
      const yearlySick = (D.yld || []).filter(l => l.employee_id === emp.id && l.leave_type === 'sick' && l.status === 'approved').length;
      if (yearlySick === 0) addOnce('no_sick_year');
    }

    // 📊 QUOTA (ธ.ค.)
    if (pastMonths.includes(11)) {
      const quotaUsed = (yl.personal || 0) + (yl.vacation || 0);
      const maxLv = emp.max_leave_per_year || 20;
      const quotaPct = maxLv > 0 ? quotaUsed / maxLv : 0;
      if (achIds.has('quota_rich') && quotaPct <= 0.1) addOnce('quota_rich');
      else if (achIds.has('quota_saver') && quotaPct <= 0.25) addOnce('quota_saver');
    }

    // 🎂 BIRTHDAY (เดือนเกิดที่จบแล้ว)
    if (achIds.has('birthday') && emp.birthday) {
      const bMonth = parseInt(emp.birthday.split('-')[1]) - 1; // 0-based
      if (pastMonths.includes(bMonth)) addOnce('birthday');
    }

    // 📊 PROGRESS — คำนวณ progress สำหรับ badge ที่ยังไม่ได้
    const prog = results[emp.id].progress;
    const earned = new Set(results[emp.id].badges);
    // Streak badges
    prog['streak_30'] = { current: streak, target: 30, unit: 'วัน' };
    prog['streak_60'] = { current: streak, target: 60, unit: 'วัน' };
    prog['streak_90'] = { current: streak, target: 90, unit: 'วัน' };
    // Diamond (3 months no leave)
    let noLeaveMonths = 0;
    for (let i = pastMonths.length - 1; i >= 0; i--) {
      if (countLeaves(emp.id, getMonthPrefix(D.y, pastMonths[i])) === 0) noLeaveMonths++; else break;
    }
    prog['diamond'] = { current: noLeaveMonths, target: 3, unit: 'เดือน' };
    prog['half_year_gold'] = { current: noLeaveMonths, target: 6, unit: 'เดือน' };
    // KPI streaks
    let kpiC = 0;
    for (let i = pastMonths.length - 1; i >= 0; i--) {
      if (countKpiErrors(emp.id, getMonthPrefix(D.y, pastMonths[i])) > 0) break; kpiC++;
    }
    prog['kpi_streak_3'] = { current: kpiC, target: 3, unit: 'เดือน' };
    prog['kpi_streak_6'] = { current: kpiC, target: 6, unit: 'เดือน' };
    prog['kpi_streak_12'] = { current: kpiC, target: 12, unit: 'เดือน' };
    // Rock (no swap) streaks
    let swC = 0;
    for (let i = pastMonths.length - 1; i >= 0; i--) {
      if (countSwaps(emp.id, getMonthPrefix(D.y, pastMonths[i])) > 0) break; swC++;
    }
    prog['rock_3m'] = { current: swC, target: 3, unit: 'เดือน' };
    prog['rock_6m'] = { current: swC, target: 6, unit: 'เดือน' };
    prog['rock_12m'] = { current: swC, target: 12, unit: 'เดือน' };
    // No sick year
    const sickCnt = (D.yld || []).filter(l => l.employee_id === emp.id && l.leave_type === 'sick' && l.status === 'approved').length;
    prog['no_sick_year'] = { current: sickCnt === 0 ? pastMonths.length : 0, target: 12, unit: 'เดือน', inverted: sickCnt > 0 };
    // Team streaks
    if (visibleEmps.length > 1) {
      let tC = 0;
      for (let i = pastMonths.length - 1; i >= 0; i--) {
        const mp2 = getMonthPrefix(D.y, pastMonths[i]);
        if (!visibleEmps.every(({ emp: e }) => countLeaves(e.id, mp2) === 0 && countSwaps(e.id, mp2) === 0 && countSelfMoves(e.id, mp2) === 0)) break;
        tC++;
      }
      prog['team_streak_2'] = { current: tC, target: 2, unit: 'เดือน' };
      prog['team_streak_3'] = { current: tC, target: 3, unit: 'เดือน' };
      prog['team_streak_6'] = { current: tC, target: 6, unit: 'เดือน' };
    }
  });

  // 👑 MVP — คะแนนรวมสูงสุด
  let maxPts = 0, mvpId = null;
  Object.entries(results).forEach(([id, r]) => { if (r.totalPoints > maxPts) { maxPts = r.totalPoints; mvpId = id; } });
  if (mvpId && maxPts > 0) { results[mvpId].badges.push('mvp'); results[mvpId].totalPoints += 20; }

  return results;
}

function renderBadges(badges) {
  if (!badges.length) return h('div', { style: { fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' } }, '— ยังไม่ได้ badge —');
  // นับจำนวนซ้ำ
  const counts = {};
  badges.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const wrap = h('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' } });
  Object.entries(counts).forEach(([id, cnt]) => {
    const a = getAchievements().find(x => x.id === id);
    if (!a) return;
    const tc = TIER_COLORS[a.tier];
    const badge = h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: tc.bg, border: '1.5px solid ' + tc.border, color: tc.text, cursor: 'pointer', transition: 'all .2s' }, title: a.desc + (cnt > 1 ? ' (' + cnt + ' เดือน)' : '') },
      h('span', {}, a.icon),
      cnt > 1 ? h('span', { style: { fontSize: '10px', fontWeight: 800 } }, '×' + cnt) : '');
    badge.onmouseenter = () => { badge.style.transform = 'scale(1.1)'; badge.style.boxShadow = '0 2px 8px ' + tc.border + '80'; };
    badge.onmouseleave = () => { badge.style.transform = 'scale(1)'; badge.style.boxShadow = 'none'; };
    wrap.appendChild(badge);
  });
  return wrap;
}

// === EMPLOYEE ACHIEVEMENT DETAIL POPUP ===
// === ACHIEVEMENT GUIDE PAGE ===
function showAchGuide(achData) {
  const allAchs = getAchievements().filter(a => a.enabled !== false);
  const myId = U.id;
  const myData = achData[myId] || { badges: [], badgeDetails: [], totalPoints: 0, progress: {} };
  const myProgress = myData.progress || {};
  // นับจำนวนครั้งต่อ badge
  const myBadgeCounts = {};
  (myData.badges || []).forEach(id => { myBadgeCounts[id] = (myBadgeCounts[id] || 0) + 1; });
  const myBadges = new Set(Object.keys(myBadgeCounts));
  const earnedCount = myBadges.size;
  const totalCount = allAchs.length;
  const pct = totalCount > 0 ? Math.round(earnedCount / totalCount * 100) : 0;

  // Badge ที่เป็นรายเดือน (ซ้ำได้)
  const MONTHLY_BADGES = new Set(['iron_will','early_bird','perfect_kpi','zero_damage','kpi_max2','low_damage','kpi_improve','comeback','no_swap','no_sick_month','team_no_leave','team_perfect','team_zero_err']);

  const overlay = h('div', { style: { position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(10px)' }, onClick: () => document.body.removeChild(overlay) });
  const card = h('div', { style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', borderRadius: '24px', padding: '0', maxWidth: '860px', width: '95vw', maxHeight: '90vh', overflowY: 'auto', color: '#fff', boxShadow: '0 24px 80px rgba(0,0,0,.5)' }, onClick: e => e.stopPropagation() });

  // Header
  const hdr = h('div', { style: { background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)', borderRadius: '24px 24px 0 0', padding: '28px 32px', position: 'relative', overflow: 'hidden' } });
  hdr.appendChild(h('div', { style: { position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', borderRadius: '50%' } }));
  const hdrContent = h('div', { style: { position: 'relative', zIndex: 1 } });
  hdrContent.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' } },
    h('div', {},
      h('div', { style: { fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' } }, '🏆 Achievement Guide'),
      h('div', { style: { fontSize: '13px', color: '#78350f', fontWeight: 600 } }, '1 แต้ม = 1 บาท — ท้าทายตัวเองทุกเดือน!')),
    h('button', { style: { background: 'rgba(0,0,0,0.15)', border: 'none', color: '#1e293b', width: '36px', height: '36px', borderRadius: '12px', fontSize: '18px', cursor: 'pointer', fontWeight: 700 }, onClick: () => document.body.removeChild(overlay) }, '✕')));

  // My progress bar
  const progWrap = h('div', { style: { marginTop: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '14px', padding: '14px 18px' } });
  const me = D.emp.find(e => e.id === myId) || U;
  progWrap.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' } },
    h('span', { style: { fontSize: '22px' } }, me.avatar || '👤'),
    h('span', { style: { fontWeight: 700, fontSize: '15px', color: '#1e293b' } }, me.nickname || me.name),
    h('span', { style: { fontSize: '12px', color: '#78350f', marginLeft: 'auto', fontWeight: 700 } }, earnedCount + '/' + totalCount + ' badge (' + pct + '%)')));
  // Progress bar
  const barOuter = h('div', { style: { height: '10px', borderRadius: '5px', background: 'rgba(0,0,0,0.15)', overflow: 'hidden' } });
  const barInner = h('div', { style: { height: '100%', borderRadius: '5px', background: pct >= 80 ? '#16a34a' : pct >= 50 ? '#fbbf24' : '#f97316', width: pct + '%', transition: 'width .6s ease' } });
  barOuter.appendChild(barInner);
  progWrap.appendChild(barOuter);
  // Earned points
  const earnedPts = myData.totalPoints || 0;
  progWrap.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#92400e' } },
    h('span', {}, '💰 แต้มเดือนนี้: ' + earnedPts),
    h('span', {}, pct >= 80 ? '🔥 เก่งมาก!' : pct >= 50 ? '💪 ไปได้สวย!' : pct >= 20 ? '🌱 กำลังเติบโต' : '🚀 เริ่มสะสมกันเลย!')));
  hdrContent.appendChild(progWrap);
  hdr.appendChild(hdrContent);
  card.appendChild(hdr);

  const content = h('div', { style: { padding: '24px 32px 32px' } });

  // Render each category
  const cats = [...new Set(allAchs.map(a => a.cat || 'special'))];
  cats.forEach(cat => {
    const catAchs = allAchs.filter(a => (a.cat || 'special') === cat);
    const catEarned = catAchs.filter(a => myBadges.has(a.id)).length;
    const sec = h('div', { style: { marginBottom: '24px' } });

    // Category header with personal progress
    const catHdr = h('div', { style: { fontSize: '15px', fontWeight: 800, marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' } });
    catHdr.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', {}, ACH_CATS[cat] || cat)));
    const catProg = catEarned === catAchs.length
      ? h('span', { style: { fontSize: '11px', background: 'rgba(22,163,74,0.2)', color: '#34d399', padding: '3px 10px', borderRadius: '8px', fontWeight: 700 } }, '✅ ครบแล้ว!')
      : h('span', { style: { fontSize: '11px', color: '#64748b', fontWeight: 600 } }, catEarned + '/' + catAchs.length);
    catHdr.appendChild(catProg);
    sec.appendChild(catHdr);

    // Badge cards grid
    const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' } });
    catAchs.forEach(a => {
      const tc = TIER_COLORS[a.tier];
      const earned = myBadges.has(a.id);
      const myCnt = myBadgeCounts[a.id] || 0;
      const isMonthly = MONTHLY_BADGES.has(a.id);
      const count = new Set(Object.entries(achData).filter(([, d]) => d.badges.includes(a.id)).map(([id]) => id)).size;

      const bCard = h('div', { style: {
        background: earned ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.03)',
        borderRadius: '16px', padding: '16px 14px',
        border: earned ? '1.5px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center', transition: 'all .15s',
        position: 'relative', opacity: earned ? 1 : 0.6
      } });
      bCard.onmouseenter = () => { bCard.style.transform = 'translateY(-2px)'; bCard.style.boxShadow = earned ? '0 4px 20px rgba(34,197,94,0.15)' : '0 4px 20px rgba(255,255,255,0.05)'; };
      bCard.onmouseleave = () => { bCard.style.transform = 'translateY(0)'; bCard.style.boxShadow = 'none'; };

      // Icon
      bCard.appendChild(h('div', { style: { fontSize: '36px', marginBottom: '8px', filter: earned ? 'none' : 'grayscale(0.8)' } }, a.icon));

      // Name + tier
      bCard.appendChild(h('div', { style: { fontWeight: 700, fontSize: '13px', color: earned ? '#fff' : '#94a3b8', marginBottom: '4px' } }, a.name));

      // Description
      bCard.appendChild(h('div', { style: { fontSize: '10px', color: earned ? '#cbd5e1' : '#64748b', marginBottom: '8px', lineHeight: '1.4' } }, a.desc));

      // Tags row
      const tags = h('div', { style: { display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '8px' } });
      tags.appendChild(h('span', { style: { fontSize: '9px', padding: '2px 6px', borderRadius: '6px', background: tc.bg, color: tc.text, fontWeight: 700 } }, tc.label));
      if (isMonthly) tags.appendChild(h('span', { style: { fontSize: '9px', padding: '2px 6px', borderRadius: '6px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontWeight: 600 } }, '🔄 รายเดือน'));
      bCard.appendChild(tags);

      // Points / status
      if (earned && isMonthly) {
        bCard.appendChild(h('div', { style: { fontSize: '12px', fontWeight: 800, color: '#34d399', background: 'rgba(34,197,94,0.15)', padding: '4px 10px', borderRadius: '8px', display: 'inline-block' } }, '✅ ' + myCnt + ' เดือน (+' + (a.points * myCnt) + ' แต้ม)'));
      } else if (earned) {
        bCard.appendChild(h('div', { style: { fontSize: '12px', fontWeight: 800, color: '#34d399', background: 'rgba(34,197,94,0.15)', padding: '4px 10px', borderRadius: '8px', display: 'inline-block' } }, '✅ +' + a.points + ' แต้ม'));
      } else {
        bCard.appendChild(h('div', { style: { fontSize: '12px', fontWeight: 800, color: tc.text, background: tc.bg, padding: '4px 10px', borderRadius: '8px', display: 'inline-block' } }, '+' + a.points + ' แต้ม'));
      }

      // Progress bar (unearned badges with progress data)
      const prog = myProgress[a.id];
      if (!earned && prog && prog.target > 0 && !prog.inverted) {
        const pct = Math.min(Math.round((prog.current / prog.target) * 100), 100);
        const barColor = pct >= 80 ? '#34d399' : pct >= 50 ? '#fbbf24' : pct >= 20 ? '#f97316' : '#64748b';
        const progWrap = h('div', { style: { marginTop: '8px', width: '100%' } });
        progWrap.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '3px', color: pct >= 50 ? barColor : '#94a3b8', fontWeight: 700 } },
          h('span', {}, prog.current + '/' + prog.target + ' ' + prog.unit),
          h('span', {}, pct >= 80 ? '🔥 ใกล้แล้ว!' : pct >= 50 ? '💪 ไปได้สวย' : '')));
        const barOuter = h('div', { style: { height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' } });
        const barInner = h('div', { style: { height: '100%', borderRadius: '3px', background: barColor, width: '0%', transition: 'width 0.8s ease' } });
        barOuter.appendChild(barInner);
        progWrap.appendChild(barOuter);
        bCard.appendChild(progWrap);
        // Animate
        setTimeout(() => { barInner.style.width = pct + '%'; }, 100);
      }

      // How many people got it
      if (count > 0) bCard.appendChild(h('div', { style: { fontSize: '10px', color: '#64748b', marginTop: '6px' } }, count + ' คนได้'));

      grid.appendChild(bCard);
    });
    sec.appendChild(grid);
    content.appendChild(sec);
  });

  // Footer tips
  const tips = h('div', { style: { background: 'rgba(251,191,36,0.06)', borderRadius: '14px', padding: '16px 20px', border: '1px solid rgba(251,191,36,0.15)', marginTop: '8px' } });
  tips.appendChild(h('div', { style: { fontWeight: 700, fontSize: '14px', color: '#fbbf24', marginBottom: '8px' } }, '💡 เคล็ดลับ'));
  const tipList = [
    '🔥 ทำต่อเนื่องทุกเดือน → แต้มพุ่ง! (เช่น KPI 0 error 3 เดือน = 100 แต้ม)',
    '🏰 ทีมร่วมมือกัน → ทุกคนได้แต้มทีม (ป้อมปราการ 6 เดือน = 2,000 แต้ม/คน!)',
    '📈 เดือนก่อนพลาด? ไม่เป็นไร! เดือนนี้ทำดี → ได้ "ฟื้นจากเถ้าถ่าน" +15',
    '👑 คะแนนสูงสุดของเดือน = เทพประจำเดือน +20 แต้ม',
  ];
  tipList.forEach(tip => {
    tips.appendChild(h('div', { style: { fontSize: '12px', color: '#e2e8f0', marginBottom: '4px', paddingLeft: '4px' } }, tip));
  });
  content.appendChild(tips);

  card.appendChild(content);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function showEmpAchDetail(r, rank, achData) {
  const allAchs = getAchievements().filter(a => a.enabled !== false);
  const earned = r.badges || [];
  const missed = allAchs.filter(a => !earned.includes(a.id));

  const overlay = h('div', { style: { position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)' }, onClick: () => document.body.removeChild(overlay) });
  const card = h('div', { style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderRadius: '24px', padding: '28px', maxWidth: '720px', width: '94vw', maxHeight: '85vh', overflowY: 'auto', color: '#fff', boxShadow: '0 24px 60px rgba(0,0,0,.4)' }, onClick: e => e.stopPropagation() });

  // Header
  const hdr = h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' } });
  hdr.appendChild(r.emp.profile_image
    ? h('img', { src: r.emp.profile_image, style: { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #fbbf24' } })
    : h('div', { style: { fontSize: '40px' } }, r.emp.avatar));
  const hdrInfo = h('div', { style: { flex: 1 } });
  hdrInfo.appendChild(h('div', { style: { fontSize: '18px', fontWeight: 800 } }, dn(r.emp)));
  hdrInfo.appendChild(h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' } },
    h('span', { style: { fontSize: '12px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 700 } }, '🏆 อันดับ ' + (rank + 1)),
    h('span', { style: { fontSize: '12px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(52,211,153,0.15)', color: '#34d399', fontWeight: 700 } }, '🔥 ' + r.streak + ' วันต่อเนื่อง'),
    r.bestStreak && r.bestStreak > r.streak ? h('span', { style: { fontSize: '12px', padding: '3px 10px', borderRadius: '8px', background: 'rgba(251,191,36,0.1)', color: '#fbbf24', fontWeight: 700 } }, '🏆 สูงสุด ' + r.bestStreak + ' วัน') : ''));
  hdr.appendChild(hdrInfo);
  // Close btn
  hdr.appendChild(h('button', { style: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }, onClick: () => document.body.removeChild(overlay) }, '✕'));
  card.appendChild(hdr);

  // Points summary
  const ptCard = h('div', { style: { background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } });
  ptCard.appendChild(h('div', {}, h('div', { style: { fontSize: '12px', fontWeight: 600, opacity: 0.7 } }, 'คะแนนรวมเดือนนี้'),
    h('div', { style: { fontSize: '28px', fontWeight: 800 } }, r.totalPoints + ' แต้ม')));
  ptCard.appendChild(h('div', { style: { textAlign: 'right' } }, h('div', { style: { fontSize: '12px', fontWeight: 600, opacity: 0.7 } }, 'ได้รับ'),
    h('div', { style: { fontSize: '20px', fontWeight: 800 } }, earned.length + '/' + allAchs.length + ' badge')));
  card.appendChild(ptCard);

  // Earned badges
  if (earned.length > 0) {
    card.appendChild(h('div', { style: { fontSize: '13px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' } }, '✅ Badge ที่ได้รับ (' + earned.length + ')'));
    const earnedGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' } });
    earned.forEach(bid => {
      const a = allAchs.find(x => x.id === bid);
      if (!a) return;
      const tc = TIER_COLORS[a.tier];
      const bCard = h('div', { style: { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' } });
      bCard.appendChild(h('div', { style: { fontSize: '28px', marginBottom: '4px' } }, a.icon));
      bCard.appendChild(h('div', { style: { fontSize: '11px', fontWeight: 700, marginBottom: '2px' } }, a.name));
      bCard.appendChild(h('div', { style: { fontSize: '9px', color: '#94a3b8', marginBottom: '4px' } }, a.desc));
      bCard.appendChild(h('div', { style: { fontSize: '11px', fontWeight: 800, color: tc.text, background: tc.bg, borderRadius: '6px', padding: '2px 6px', display: 'inline-block' } }, '+' + a.points + ' pt'));
      earnedGrid.appendChild(bCard);
    });
    card.appendChild(earnedGrid);
  }

  // Missed badges — show as locked
  if (missed.length > 0) {
    card.appendChild(h('div', { style: { fontSize: '13px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' } }, '🔒 ยังไม่ได้ (' + missed.length + ')'));
    const missedGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' } });
    missed.forEach(a => {
      const bCard = h('div', { style: { background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.06)', opacity: 0.5 } });
      bCard.appendChild(h('div', { style: { fontSize: '24px', marginBottom: '4px', filter: 'grayscale(1)' } }, a.icon));
      bCard.appendChild(h('div', { style: { fontSize: '11px', fontWeight: 700, marginBottom: '2px' } }, a.name));
      bCard.appendChild(h('div', { style: { fontSize: '9px', color: '#64748b' } }, a.desc));
      missedGrid.appendChild(bCard);
    });
    card.appendChild(missedGrid);
  }

  // Tips
  if (missed.length > 0) {
    const tip = missed[0];
    card.appendChild(h('div', { style: { background: 'rgba(251,191,36,0.08)', borderRadius: '12px', padding: '12px 16px', border: '1px solid rgba(251,191,36,0.15)' } },
      h('div', { style: { fontSize: '11px', fontWeight: 700, color: '#fbbf24', marginBottom: '4px' } }, '💡 เป้าหมายถัดไป'),
      h('div', { style: { fontSize: '12px', color: '#e2e8f0' } }, tip.icon + ' ' + tip.name + ' — ' + tip.desc + ' (+' + tip.points + ' แต้ม)')));
  }

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function rAchievementBoard(empStats, achData) {
  const section = h('div', { style: { marginTop: '20px' } });

  // Header card
  const headerCard = h('div', { style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4c1d95 100%)', borderRadius: '20px 20px 0 0', padding: '28px 24px 20px', color: '#fff', position: 'relative', overflow: 'hidden' } });
  // Decorative elements
  headerCard.appendChild(h('div', { style: { position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)', borderRadius: '50%' } }));
  headerCard.appendChild(h('div', { style: { position: 'absolute', bottom: '-10px', left: '30%', width: '80px', height: '80px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%' } }));
  headerCard.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } },
      h('div', { style: { fontSize: '40px', filter: 'drop-shadow(0 2px 8px rgba(251,191,36,0.4))' } }, '🏆'),
      h('div', {},
        h('div', { style: { fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px' } }, 'Achievement Board'),
        h('div', { style: { fontSize: '12px', opacity: 0.5, marginTop: '2px' } }, 'ปี ' + (D.y + 543) + ' — ท้าทายตัวเองทุกเดือน'))),
    h('div', { style: { textAlign: 'right' } },
      h('div', { style: { fontSize: '28px', fontWeight: 800, color: '#fbbf24' } }, String(getAchievements().filter(a => a.enabled !== false).length)),
      h('div', { style: { fontSize: '10px', opacity: 0.5 } }, 'badges ทั้งหมด'))));
  section.appendChild(headerCard);

  // Main body
  const body = h('div', { style: { background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)', borderRadius: '0 0 20px 20px', padding: '20px 24px 28px', color: '#fff' } });

  // === PODIUM TOP 3 ===
  const ranked = empStats.map(({ emp }) => {
    const ad = achData[emp.id] || { badges: [], totalPoints: 0, streak: 0 };
    return { emp, ...ad };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  if (ranked.length >= 2) {
    // Wrapper with ground line
    const podiumWrap = h('div', { style: { position: 'relative', marginBottom: '24px', paddingTop: '8px' } });
    const podium = h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '10px' } });
    const podiumOrder = ranked.length >= 3 ? [1, 0, 2] : [1, 0]; // 2nd, 1st, 3rd
    const podiumH = ['140px', '100px', '80px'];
    const podiumBg = ['linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%)', 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)', 'linear-gradient(180deg, #cd7f32 0%, #a0522d 100%)'];
    const podiumEmoji = ['👑', '🥈', '🥉'];
    const podiumGlow = ['rgba(251,191,36,0.3)', 'rgba(148,163,184,0.2)', 'rgba(205,127,50,0.2)'];

    podiumOrder.forEach(oi => {
      if (oi >= ranked.length) return;
      const r = ranked[oi];
      const col = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: oi === 0 ? '130px' : '110px' } });
      // Avatar
      col.appendChild(h('div', { style: { position: 'relative', marginBottom: '8px' } },
        r.emp.profile_image
          ? h('img', { src: r.emp.profile_image, style: { width: oi === 0 ? '64px' : '48px', height: oi === 0 ? '64px' : '48px', borderRadius: '50%', objectFit: 'cover', border: '3px solid ' + (oi === 0 ? '#fbbf24' : oi === 1 ? '#94a3b8' : '#cd7f32'), boxShadow: '0 4px 16px ' + podiumGlow[oi] } })
          : h('div', { style: { fontSize: oi === 0 ? '40px' : '32px' } }, r.emp.avatar),
        h('div', { style: { position: 'absolute', top: '-8px', right: '-8px', fontSize: oi === 0 ? '20px' : '16px' } }, podiumEmoji[oi])));
      col.appendChild(h('div', { style: { fontWeight: 700, fontSize: '12px', marginBottom: '2px', textAlign: 'center' } }, dn(r.emp)));
      col.appendChild(h('div', { style: { fontSize: '16px', fontWeight: 800, color: '#fbbf24', marginBottom: '6px' } }, r.totalPoints + ' pt'));
      // Podium bar
      col.appendChild(h('div', { style: { width: '100%', height: podiumH[oi], background: podiumBg[oi], borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2)' } }, String(oi + 1)));
      podium.appendChild(col);
    });
    podiumWrap.appendChild(podium);

    // === FUNNY UNDERGROUND RANK 4-5+ ===
    if (ranked.length >= 4) {
      // Ground line
      podiumWrap.appendChild(h('div', { style: { height: '4px', background: 'linear-gradient(90deg, transparent 5%, #854d0e 15%, #a16207 50%, #854d0e 85%, transparent 95%)', borderRadius: '2px', margin: '0 20px', position: 'relative' } },
        h('div', { style: { position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#a16207', fontWeight: 700, background: '#1e1b4b', padding: '0 8px' } }, '🌍 พื้นดิน')));

      // Underground section
      const underground = h('div', { style: { display: 'flex', justifyContent: 'center', gap: '16px', padding: '16px 0 8px', position: 'relative' } });
      // Dirt background
      underground.style.background = 'repeating-linear-gradient(0deg, rgba(120,80,30,0.08) 0px, rgba(120,80,30,0.04) 4px, transparent 4px, transparent 8px)';

      const funnyData = [
        { emoji: '⛏️', msg: 'กำลังขุดหาแต้ม...', bg: '#78350f', border: '#92400e', color: '#fbbf24' },
        { emoji: '🦴', msg: 'ขุดเจอแต่กระดูก', bg: '#451a03', border: '#78350f', color: '#d97706' },
        { emoji: '🪱', msg: 'อยู่กับไส้เดือน', bg: '#1c1917', border: '#44403c', color: '#a8a29e' },
        { emoji: '🌋', msg: 'ใกล้แกนโลกแล้ว', bg: '#7f1d1d', border: '#991b1b', color: '#fca5a5' },
      ];

      for (let i = 3; i < Math.min(ranked.length, 7); i++) {
        const r = ranked[i];
        const fd = funnyData[Math.min(i - 3, funnyData.length - 1)];
        const depth = (i - 3) * 12 + 20; // deeper each rank
        const col = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px', animation: 'digBounce 2s infinite', animationDelay: (i * 0.3) + 's' } });

        // Speech bubble
        col.appendChild(h('div', { style: { background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '4px 8px', fontSize: '9px', fontWeight: 600, color: fd.color, marginBottom: '6px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', maxWidth: '100px' } },
          fd.msg,
          h('div', { style: { position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(255,255,255,0.08)' } })));

        // Avatar peeking from hole
        const hole = h('div', { style: { position: 'relative', width: '70px', height: '50px', background: 'radial-gradient(ellipse at center, ' + fd.bg + ' 0%, transparent 70%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' } });
        const avatar = r.emp.profile_image
          ? h('img', { src: r.emp.profile_image, style: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid ' + fd.border } })
          : h('div', { style: { fontSize: '28px' } }, r.emp.avatar);
        hole.appendChild(avatar);
        hole.appendChild(h('div', { style: { position: 'absolute', top: '-6px', right: '-2px', fontSize: '16px' } }, fd.emoji));
        col.appendChild(hole);

        // Name + points
        col.appendChild(h('div', { style: { fontWeight: 700, fontSize: '11px', marginTop: '4px', textAlign: 'center', color: fd.color } }, dn(r.emp)));
        col.appendChild(h('div', { style: { fontSize: '12px', fontWeight: 800, color: '#94a3b8' } }, r.totalPoints + ' pt'));
        col.appendChild(h('div', { style: { fontSize: '9px', color: '#57534e', fontWeight: 600 } }, '#' + (i + 1)));

        underground.appendChild(col);
      }

      podiumWrap.appendChild(underground);
    }

    body.appendChild(podiumWrap);
  }

  // === FULL RANKING TABLE ===
  const RANK_THEMES = [
    { emoji: '🥇', color: '#fbbf24' },
    { emoji: '🥈', color: '#94a3b8' },
    { emoji: '🥉', color: '#cd7f32' },
    { emoji: '⛏️', color: '#8b5cf6', label: 'ขุดทอง' },
    { emoji: '🏃', color: '#06b6d4', label: 'กำลังวิ่ง' },
    { emoji: '🧗', color: '#f97316', label: 'ปีนเขา' },
    { emoji: '🚀', color: '#ec4899', label: 'พร้อมปล่อย' },
    { emoji: '🌱', color: '#22c55e', label: 'กำลังเติบโต' },
    { emoji: '🐣', color: '#eab308', label: 'เพิ่งเริ่ม' },
    { emoji: '💤', color: '#64748b', label: 'รอแรงบันดาลใจ' },
  ];

  // Helper: find next badge hints for an employee
  function getNextBadgeHints(r) {
    const allAchs = getAchievements();
    const earnedSet = new Set(r.badges);
    const hints = [];
    // Streak hint — ใช้ streak ปัจจุบัน ไม่ใช่ bestStreak
    if (!earnedSet.has('streak_30') && r.streak >= 15) hints.push({ icon: '🏃', text: 'วิ่งมาราธอน อีก ' + (30 - r.streak) + ' วัน' });
    else if (earnedSet.has('streak_30') && !earnedSet.has('streak_60') && r.streak >= 30) hints.push({ icon: '🏃', text: 'วิ่งข้ามจังหวัด อีก ' + (60 - r.streak) + ' วัน' });
    // KPI streak — ใช้ progress data
    const kpiProg = r.progress?.kpi_streak_3;
    if (kpiProg && !earnedSet.has('kpi_streak_3') && kpiProg.current > 0) hints.push({ icon: '⭐', text: 'สะอาด 3 เดือน — ทำ 0 error ต่อไป! (' + kpiProg.current + '/3)' });
    // Points milestone
    if (r.totalPoints >= 80 && r.totalPoints < 100) hints.push({ icon: '💰', text: 'อีก ' + (100 - r.totalPoints) + ' แต้มแลกรางวัลได้!' });
    return hints.slice(0, 1);
  }

  const table = h('div', { style: { background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' } });
  ranked.forEach((r, idx) => {
    const theme = RANK_THEMES[Math.min(idx, RANK_THEMES.length - 1)];
    const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderBottom: idx < ranked.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all .15s', cursor: 'pointer' } });
    row.onmouseenter = () => { row.style.background = 'rgba(255,255,255,0.06)'; };
    row.onmouseleave = () => { row.style.background = 'transparent'; };
    row.onclick = () => showEmpAchDetail(r, idx, achData);

    // Rank
    row.appendChild(h('div', { style: { width: '32px', fontWeight: 800, fontSize: '18px', color: theme.color, textAlign: 'center', flexShrink: 0 } }, theme.emoji));

    // Avatar
    row.appendChild(r.emp.profile_image
      ? h('img', { src: r.emp.profile_image, style: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid ' + theme.color + '40', flexShrink: 0 } })
      : h('span', { style: { fontSize: '28px', flexShrink: 0 } }, r.emp.avatar));

    // Name + badges + hint
    const nameCol = h('div', { style: { flex: 1, minWidth: 0 } });
    const nameRow = h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } });
    nameRow.appendChild(h('span', { style: { fontWeight: 700, fontSize: '15px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, dn(r.emp)));
    if (idx >= 3 && theme.label) nameRow.appendChild(h('span', { style: { fontSize: '10px', padding: '2px 8px', borderRadius: '8px', background: theme.color + '20', color: theme.color, fontWeight: 700 } }, theme.label));
    nameCol.appendChild(nameRow);

    // Badge icons
    const badgeRow = h('div', { style: { display: 'flex', gap: '3px', flexWrap: 'wrap' } });
    const badgeCounts = {};
    r.badges.forEach(id => { badgeCounts[id] = (badgeCounts[id] || 0) + 1; });
    Object.entries(badgeCounts).forEach(([bid, cnt]) => {
      const a = getAchievements().find(x => x.id === bid);
      if (!a) return;
      const el = h('span', { title: a.name + (cnt > 1 ? ' ×' + cnt : ''), style: { fontSize: '14px', cursor: 'pointer', transition: 'transform .1s' } }, a.icon + (cnt > 1 ? '' : ''));
      el.onmouseenter = () => { el.style.transform = 'scale(1.3)'; };
      el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
      badgeRow.appendChild(el);
      if (cnt > 1) badgeRow.appendChild(h('span', { style: { fontSize: '10px', color: '#fbbf24', fontWeight: 800, marginRight: '2px' } }, '×' + cnt));
    });
    nameCol.appendChild(badgeRow);

    // Next badge hint
    const hints = getNextBadgeHints(r);
    if (hints.length > 0) {
      nameCol.appendChild(h('div', { style: { fontSize: '10px', color: '#818cf8', marginTop: '3px', fontStyle: 'italic' } }, '🎯 ' + hints[0].text));
    }
    row.appendChild(nameCol);

    // Streak — current + best with clear labels
    const streakCol = h('div', { style: { fontSize: '11px', color: '#94a3b8', textAlign: 'right', flexShrink: 0, width: '85px', lineHeight: '1.5' } });
    const sColor = r.streak >= 60 ? '#fbbf24' : r.streak >= 30 ? '#34d399' : r.streak > 0 ? '#cbd5e1' : '#64748b';
    streakCol.appendChild(h('div', { style: { fontWeight: 700, fontSize: '13px', color: sColor } }, '🔥 ' + r.streak + ' วัน'));
    if (r.bestStreak && r.bestStreak > r.streak) {
      streakCol.appendChild(h('div', { style: { fontSize: '9px', color: '#fbbf24', opacity: 0.7 } }, 'สูงสุด ' + r.bestStreak + ' วัน'));
    }
    row.appendChild(streakCol);

    // Points
    const ptColor = r.totalPoints > 100 ? '#fbbf24' : r.totalPoints > 50 ? '#a78bfa' : r.totalPoints > 0 ? '#34d399' : '#475569';
    row.appendChild(h('div', { style: { width: '60px', textAlign: 'right', flexShrink: 0 } },
      h('div', { style: { fontSize: '20px', fontWeight: 800, color: ptColor } }, String(r.totalPoints)),
      h('div', { style: { fontSize: '9px', opacity: 0.5 } }, 'แต้ม')));

    table.appendChild(row);
  });
  body.appendChild(table);

  // === BADGE GUIDE BUTTON ===
  const guideBtn = h('button', { style: { marginTop: '20px', width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(139,92,246,0.1))', color: '#fbbf24', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }, onClick: () => showAchGuide(achData) }, '📖 ดูรายละเอียด Badge ทั้งหมด');
  guideBtn.onmouseenter = () => { guideBtn.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(139,92,246,0.2))'; guideBtn.style.transform = 'translateY(-2px)'; };
  guideBtn.onmouseleave = () => { guideBtn.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(139,92,246,0.1))'; guideBtn.style.transform = 'translateY(0)'; };
  body.appendChild(guideBtn);

  section.appendChild(body);
  return section;
}

// === STATS ===
function rSta() {
  const w = h('div', {}), dm = gdim(D.y, D.m);

  // Load KPI data for achievements if not loaded
  if (!D.kpiYearLoaded) {
    D.kpiYearLoaded = true;
    api('/api/kpi/errors?year=' + D.y).then(r => { D.kpiYear = r.data || []; render(); }).catch(() => { D.kpiYear = []; });
  }

  const allEmps = ce();
  let totalDay = 0, totalEvening = 0, totalOff = 0, totalSick = 0, totalPersonal = 0, totalVacation = 0;
  const empStats = [];
  allEmps.forEach(emp => {
    const sc = { day: 0, evening: 0, off: 0 };
    for (let d = 1; d <= dm; d++) { const k = dk(D.y, D.m, d); if (isBlackout(k)) continue; const inf = disp(emp, k, D.y, D.m, d); if (!inf.isL || inf.isPending) sc[inf.ty || emp.default_shift] = (sc[inf.ty || emp.default_shift] || 0) + 1; }
    const yl = D.yl[emp.id] || {};
    totalDay += sc.day; totalEvening += sc.evening; totalOff += sc.off;
    totalSick += (yl.sick || 0); totalPersonal += (yl.personal || 0); totalVacation += (yl.vacation || 0);
    empStats.push({ emp, sc, yl });
  });

  // Compute achievements
  const achData = computeAchievements(empStats);
  D._achData = achData;

  // === Leave Racing Chart 🏎️ (Animated) ===
  const chartBox = h('div', { style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '16px', padding: '24px', marginBottom: '20px', color: '#fff' } });
  chartBox.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' } },
    h('div', { style: { fontSize: '24px' } }, '🏎️'),
    h('div', {}, h('div', { style: { fontSize: '15px', fontWeight: 700 } }, 'วันลาแต่ละคน (ทั้งปี)'),
      h('div', { style: { fontSize: '11px', opacity: 0.5 } }, 'โควต้า ' + (empStats[0]?.emp.max_leave_per_year || 20) + ' วัน'))));
  const raceData = [...empStats].map(({ emp, yl }) => {
    const sick = yl.sick || 0, personal = yl.personal || 0, vacation = yl.vacation || 0;
    return { emp, sick, personal, vacation, total: sick + personal + vacation, maxLv: emp.max_leave_per_year || 20 };
  }).sort((a, b) => b.total - a.total);
  const raceColors = ['#fbbf24', '#94a3b8', '#cd7f32', '#64748b', '#475569'];
  raceData.forEach((r, idx) => {
    const pct = Math.min((r.total / r.maxLv) * 100, 100);
    const posColor = raceColors[idx] || '#475569';
    const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: idx < raceData.length - 1 ? '14px' : '0', position: 'relative' } });
    row.appendChild(h('div', { style: { width: '28px', height: '28px', borderRadius: '50%', background: idx < 3 ? posColor : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: idx < 3 ? '#0f172a' : '#94a3b8', flexShrink: 0 } }, String(idx + 1)));
    row.appendChild(h('div', { style: { width: '90px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 } },
      r.emp.profile_image ? h('img', { src: r.emp.profile_image, style: { width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '2px solid ' + posColor } }) : h('span', { style: { fontSize: '18px' } }, r.emp.avatar),
      h('span', { style: { fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, dn(r.emp))));
    const track = h('div', { style: { flex: 1, position: 'relative', height: '32px' } });
    track.appendChild(h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' } }));
    track.appendChild(h('div', { style: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '3px', background: 'repeating-linear-gradient(180deg, #fff 0px, #fff 3px, transparent 3px, transparent 6px)', opacity: 0.3 } }));
    // Animated bar — starts at 0%, CSS transitions to target
    const barWrap = h('div', { style: { position: 'absolute', top: '3px', bottom: '3px', left: '3px', display: 'flex', borderRadius: '6px', overflow: 'hidden', width: '0%', transition: 'width 1.2s cubic-bezier(0.25,0.46,0.45,0.94) ' + (idx * 0.15) + 's' } });
    if (r.sick > 0) barWrap.appendChild(h('div', { style: { width: (r.sick/Math.max(r.total,1)*100) + '%', background: 'linear-gradient(90deg, #ef4444, #f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, minWidth: '16px' } }, r.sick > 1 ? String(r.sick) : ''));
    if (r.personal > 0) barWrap.appendChild(h('div', { style: { width: (r.personal/Math.max(r.total,1)*100) + '%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, minWidth: '16px' } }, r.personal > 1 ? String(r.personal) : ''));
    if (r.vacation > 0) barWrap.appendChild(h('div', { style: { width: (r.vacation/Math.max(r.total,1)*100) + '%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, minWidth: '16px' } }, r.vacation > 1 ? String(r.vacation) : ''));
    if (r.total === 0) barWrap.appendChild(h('div', { style: { fontSize: '10px', padding: '0 8px', color: '#34d399', display: 'flex', alignItems: 'center' } }, '✨'));
    track.appendChild(barWrap);
    // Trigger animation after paint
    requestAnimationFrame(() => { requestAnimationFrame(() => { barWrap.style.width = Math.max(pct, r.total > 0 ? 5 : 0) + '%'; }); });
    row.appendChild(track);
    // Animated score counter
    const scoreColor = r.total === 0 ? '#34d399' : r.total >= r.maxLv * 0.8 ? '#ef4444' : r.total >= r.maxLv * 0.5 ? '#fbbf24' : '#94a3b8';
    const scoreEl = h('div', { style: { fontSize: '16px', fontWeight: 800, color: scoreColor } }, '0');
    row.appendChild(h('div', { style: { width: '60px', textAlign: 'right', flexShrink: 0 } },
      scoreEl,
      h('div', { style: { fontSize: '9px', opacity: 0.5 } }, '/ ' + r.maxLv)));
    // Animate number count-up
    if (r.total > 0) {
      const delay = idx * 150;
      setTimeout(() => {
        let cur = 0; const target = r.total;
        const step = () => { cur += Math.ceil(target / 20); if (cur >= target) { scoreEl.textContent = String(target); return; } scoreEl.textContent = String(cur); requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, delay + 200);
    }
    chartBox.appendChild(row);
  });
  chartBox.appendChild(h('div', { style: { display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', opacity: 0.7 } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, h('div', { style: { width: '10px', height: '10px', borderRadius: '3px', background: '#ef4444' } }), 'ป่วย'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, h('div', { style: { width: '10px', height: '10px', borderRadius: '3px', background: '#8b5cf6' } }), 'กิจ'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, h('div', { style: { width: '10px', height: '10px', borderRadius: '3px', background: '#06b6d4' } }), 'พักร้อน'),
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, h('div', { style: { width: '10px', height: '10px', borderRadius: '3px', background: '#34d399' } }), '✨ ยังไม่ลา')));
  w.appendChild(chartBox);

  // === Employee cards ===
  w.appendChild(h('div', { style: { fontSize: '15px', fontWeight: 700, marginBottom: '12px' } }, '👥 รายละเอียดพนักงาน'));
  const empGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' } });
  const sorted = [...empStats].sort((a, b) => (a.emp.id === U.id ? -1 : b.emp.id === U.id ? 1 : 0));
  sorted.forEach(({ emp, sc, yl }) => {
    const sick = yl.sick || 0, personal = yl.personal || 0, vacation = yl.vacation || 0;
    const quotaUsed = personal + vacation, maxLv = emp.max_leave_per_year || 20;
    const pct = maxLv > 0 ? Math.min((quotaUsed / maxLv) * 100, 100) : 0;
    const isMe = emp.id === U.id;
    // Count self-moves and swaps for this employee
    const empMoves = (D.selfMoves || []).filter(m => m.employee_id === emp.id);
    const empSwaps = (D.swapReqs || []).filter(sr => sr.from_employee_id === emp.id || sr.to_employee_id === emp.id);
    const moveCount = Math.floor(empMoves.length / 2); // pairs (off→work, work→off)
    const swapCount = emp.swap_count || 0;
    const dayoffSwapCount = emp.dayoff_swap_count || 0;
    const card = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '20px', border: isMe ? '2px solid #3b82f6' : '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' } });
    if (isMe) card.appendChild(h('div', { style: { position: 'absolute', top: 0, right: 0, background: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '0 0 0 10px' } }, 'คุณ'));
    // Header
    card.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' } },
      emp.profile_image ? h('img', { src: emp.profile_image, style: { width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' } }) : h('div', { style: { fontSize: '36px' } }, emp.avatar),
      h('div', {}, h('div', { style: { fontWeight: 700, fontSize: '16px' } }, dn(emp)),
        h('div', { style: { fontSize: '12px', color: '#94a3b8' } }, (SHIFT[emp.default_shift]?.i||'') + ' ' + stime(emp) + ' | หยุด ' + offD(emp).map(d => DAYF[d]).join(', ')))));
    // Shift pills
    const pills = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' } });
    Object.entries(sc).filter(([, v]) => v > 0).forEach(([t, c]) => { const i = SHIFT[t]; if (i) pills.appendChild(h('div', { style: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: i.b, color: i.c } }, i.i + ' ' + c)); });
    card.appendChild(pills);
    // Quota bar
    const barGrad = pct > 80 ? 'linear-gradient(90deg, #ef4444, #f87171)' : pct > 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #6366f1, #818cf8)';
    card.appendChild(h('div', { style: { marginBottom: '10px' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' } },
        h('span', { style: { color: '#64748b', fontWeight: 600 } }, '📋 โควต้าลา'),
        h('span', { style: { fontWeight: 700 } }, quotaUsed + '/' + maxLv)),
      h('div', { style: { height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' } },
        h('div', { style: { width: pct + '%', height: '100%', background: barGrad, borderRadius: '4px', transition: 'width 0.6s ease' } }))));
    // Leave mini stats — clickable with yearly details
    const empYLD = (D.yld || []).filter(l => l.employee_id === emp.id);
    const mkStat = (ic, v, cl, label, filterType) => {
      const el = h('div', { style: { textAlign: 'center', padding: '6px', background: '#f8fafc', borderRadius: '8px', cursor: v > 0 ? 'pointer' : 'default', transition: 'all .15s' },
        onClick: v > 0 ? () => {
          let items = [];
          if (filterType === 'swap') {
            items = empSwaps.filter(sr => sr.swap_type !== 'dayoff').map(sr => ({ text: (sr.from_employee_id === emp.id ? '→ ' + sr.to_nick : '← ' + sr.from_nick) + ' | ' + fmtDate(sr.date), status: sr.status }));
          } else if (filterType === 'dayoffSwap') {
            items = empSwaps.filter(sr => sr.swap_type === 'dayoff').map(sr => ({ text: (sr.from_employee_id === emp.id ? '→ ' + sr.to_nick : '← ' + sr.from_nick) + ' | ' + fmtDate(sr.date) + (sr.date2 ? ' ↔ ' + fmtDate(sr.date2) : ''), status: sr.status }));
          } else if (filterType === 'selfMove') {
            // Group moves in pairs
            const offs = empMoves.filter(m => m.shift_type === 'off');
            const works = empMoves.filter(m => m.shift_type !== 'off');
            offs.forEach(o => { items.push({ text: '🔀 หยุด ' + fmtDate(o.date) + (o.note ? ' — ' + o.note.replace('🔀 ', '') : ''), status: 'approved' }); });
            works.forEach(w2 => { items.push({ text: '💼 ทำงาน ' + fmtDate(w2.date) + (w2.note ? ' — ' + w2.note.replace('🔀 ', '') : ''), status: 'approved' }); });
          } else {
            items = empYLD.filter(l => l.leave_type === filterType).map(l => ({ date: l.date, status: l.status, reason: l.reason }));
          }
          if (!items.length) return;
          const popup = h('div', { style: { position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)' }, onClick: (e) => { if (e.target === popup) document.body.removeChild(popup); } });
          const box = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '24px', minWidth: '340px', maxWidth: '480px', maxHeight: '70vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }, onClick: e => e.stopPropagation() });
          box.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
            h('div', { style: { fontWeight: 700, fontSize: '16px' } }, ic + ' ' + label + ' — ' + dn(emp) + ' (' + items.length + ')'),
            h('button', { style: { border: 'none', background: '#f1f5f9', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }, onClick: () => document.body.removeChild(popup) }, '✕')));
          items.forEach(item => {
            box.appendChild(h('div', { style: { padding: '10px 14px', marginBottom: '4px', background: '#f8fafc', borderRadius: '10px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } },
              h('div', {},
                h('div', { style: { fontWeight: 600 } }, item.date ? fmtDate(item.date) : item.text),
                item.reason ? h('div', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' } }, '💬 ' + item.reason) : ''),
              item.status ? h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, whiteSpace: 'nowrap', background: item.status === 'approved' ? '#dcfce7' : item.status === 'pending' ? '#fef3c7' : '#fee2e2', color: item.status === 'approved' ? '#16a34a' : item.status === 'pending' ? '#d97706' : '#dc2626' } }, item.status === 'approved' ? '✅ อนุมัติ' : item.status === 'pending' ? '⏳ รอ' : '❌ ปฏิเสธ') : ''));
          });
          popup.appendChild(box);
          document.body.appendChild(popup);
        } : null },
        h('div', { style: { fontSize: '16px', fontWeight: 800, color: v > 0 ? cl : '#d1d5db' } }, String(v)),
        h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, ic));
      if (v > 0) { el.onmouseenter = () => { el.style.background = '#e2e8f0'; el.style.transform = 'scale(1.05)'; }; el.onmouseleave = () => { el.style.background = '#f8fafc'; el.style.transform = 'scale(1)'; }; }
      return el;
    };
    card.appendChild(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' } },
      mkStat('🏥', sick, '#ef4444', 'ลาป่วย', 'sick'),
      mkStat('📋', personal, '#8b5cf6', 'ลากิจ', 'personal'),
      mkStat('✈️', vacation, '#06b6d4', 'ลาพักร้อน', 'vacation')));
    card.appendChild(h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginTop: '6px' } },
      mkStat('🔄', swapCount, '#d97706', 'สลับกะ', 'swap'),
      mkStat('📅', dayoffSwapCount, '#059669', 'สลับวันหยุด', 'dayoffSwap'),
      mkStat('🔀', moveCount, '#7c3aed', 'ย้ายวันหยุด', 'selfMove')));
    // 🏆 Achievement badges
    const empAch = (D._achData || {})[emp.id];
    if (empAch && empAch.badges.length > 0) {
      card.appendChild(renderBadges(empAch.badges));
    }
    empGrid.appendChild(card);
  });
  w.appendChild(empGrid);

  // 🏆 Achievement Leaderboard (bottom of stats)
  w.appendChild(rAchievementBoard(empStats, achData));

  return w;
}

// === PENDING ===
function rPnd() {
  const s = h('div', { className: 'ps' });
  const canApproveLv = canApproveRole;
  const myLeaves = canApproveLv ? D.pl : [];
  const mySwaps = canApproveRole ? D.ps : D.ps.filter(sw => sw.to_employee_id === U.id);

  // Group consecutive leaves by employee + leave_type (only if dates are consecutive)
  const grouped = [];
  const key = l => String(l.employee_id) + '|' + l.leave_type;
  const sorted = [...myLeaves].sort((a, b) => key(a).localeCompare(key(b)) || a.date.localeCompare(b.date));
  const isConsecutive = (d1, d2) => {
    const [y1,m1,dd1] = d1.split('-').map(Number), [y2,m2,dd2] = d2.split('-').map(Number);
    const a = new Date(y1, m1-1, dd1+1);
    return a.getFullYear() === y2 && a.getMonth() === m2-1 && a.getDate() === dd2;
  };
  let cur = null;
  sorted.forEach(l => {
    if (cur && +cur.employee_id === +l.employee_id && cur.leave_type === l.leave_type && isConsecutive(cur.endDate, l.date)) {
      cur.dates.push(l);
      cur.endDate = l.date;
    } else {
      if (cur) grouped.push(cur);
      cur = { employee_id: l.employee_id, leave_type: l.leave_type, dates: [l], startDate: l.date, endDate: l.date, avatar: l.avatar, nickname: l.nickname, employee_name: l.employee_name, reason: l.reason };
    }
  });
  if (cur) grouped.push(cur);

  s.appendChild(h('div', { className: 'pt' }, '📋 วันลารออนุมัติ (' + grouped.length + ' รายการ, ' + myLeaves.length + ' วัน)'));
  if (!grouped.length) s.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px', marginBottom: '20px' } }, 'ไม่มีรายการ ✅'));
  grouped.forEach(g => {
    const i = LEAVE[g.leave_type] || LEAVE.sick;
    const dayCount = g.dates.length;
    const dateLabel = dayCount > 1 ? fmtDate(g.startDate) + ' – ' + fmtDate(g.endDate) + ' (' + dayCount + ' วัน)' : fmtDate(g.startDate);
    s.appendChild(h('div', { className: 'pc' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, h('span', { style: { fontSize: '26px' } }, g.avatar),
        h('div', {},
          h('div', { style: { fontWeight: 700, fontSize: '14px' } }, g.nickname || g.employee_name),
          h('div', { style: { fontSize: '13px', color: '#64748b' } }, i.i + ' ' + i.l + ' — ' + dateLabel),
          g.reason ? h('div', { style: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' } }, '💬 ' + g.reason) : '')),
      h('div', { style: { display: 'flex', gap: '6px' } },
        h('button', { className: 'ba', onClick: async () => {
          try {
            const ids = g.dates.map(l => l.id);
            await api('/api/leaves/batch', 'PUT', { ids, action: 'approve' });
            toast('✅ อนุมัติ ' + dayCount + ' วัน'); load();
          } catch (e) { toast(e.message, true); }
        } }, '✅ อนุมัติ' + (dayCount > 1 ? ' (' + dayCount + ' วัน)' : '')),
        h('button', { className: 'br', onClick: async () => {
          const reason = prompt('กรุณาระบุเหตุผลที่ปฏิเสธ:');
          if (reason === null) return;
          if (!reason.trim()) { toast('กรุณาระบุเหตุผล', true); return; }
          try {
            const ids = g.dates.map(l => l.id);
            await api('/api/leaves/batch', 'PUT', { ids, action: 'reject', reject_reason: reason.trim() });
            toast('❌ ปฏิเสธ ' + dayCount + ' วัน'); load();
          } catch (e) { toast(e.message, true); }
        } }, '❌ ปฏิเสธ')),
    ));
  });
  s.appendChild(h('div', { className: 'pt', style: { marginTop: '24px' } }, '🔄 สลับกะ/วันหยุดรออนุมัติ (' + mySwaps.length + ')'));
  if (!mySwaps.length) s.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px' } }, 'ไม่มีรายการ ✅'));
  mySwaps.forEach(sw => {
    const canApprove = isO || U.id === sw.to_employee_id;
    const isDayoff = sw.swap_type === 'dayoff';
    const typeLabel = isDayoff ? '📅 สลับวันหยุด' : '🔄 สลับกะ';
    const dateInfo = isDayoff && sw.date2
      ? fmtDate(sw.date) + ' ↔ ' + fmtDate(sw.date2)
      : fmtDate(sw.date);
    s.appendChild(h('div', { className: 'pc' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 } }, h('span', { style: { fontSize: '22px' } }, sw.from_avatar),
        h('div', {},
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
            h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isDayoff ? '#fef3c7' : '#d1fae5', color: isDayoff ? '#d97706' : '#10b981' } }, typeLabel),
            h('span', { style: { fontWeight: 700, fontSize: '14px' } }, (sw.from_nickname || sw.from_name) + ' ↔ ' + (sw.to_nickname || sw.to_name))),
          h('div', { style: { fontSize: '13px', color: '#64748b', marginTop: '2px' } }, dateInfo + ' | สลับครั้งที่ ' + (sw.from_swap_count || 0)),
          h('div', { style: { fontSize: '11px', color: '#f59e0b', fontWeight: 600, marginTop: '2px' } }, '👤 รออนุมัติจาก: ' + (sw.to_nickname || sw.to_name)))),
      canApprove ? h('div', { style: { display: 'flex', gap: '6px' } },
        h('button', { className: 'ba', onClick: async () => { try { await api('/api/swaps/' + sw.id + '/approve', 'PUT'); toast('✅ อนุมัติ'); load(); } catch (e) { toast(e.message, true); } } }, '✅ อนุมัติ'),
        h('button', { className: 'br', onClick: async () => { const reason = prompt('กรุณาระบุเหตุผลที่ปฏิเสธ:'); if (reason === null) return; if (!reason.trim()) { toast('กรุณาระบุเหตุผล', true); return; } try { await api('/api/swaps/' + sw.id + '/reject', 'PUT', { reject_reason: reason.trim() }); toast('❌ ปฏิเสธ'); load(); } catch (e) { toast(e.message, true); } } }, '❌ ปฏิเสธ'))
        : h('div', { style: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' } }, 'รอคู่สลับอนุมัติ'),
    ));
  });

  // Self day-off requests pending (admin only)
  if (canApproveRole && D.selfDayoffPending && D.selfDayoffPending.length > 0) {
    s.appendChild(h('div', { className: 'pt', style: { marginTop: '24px' } }, '🔀 ย้ายวันหยุดรออนุมัติ (' + D.selfDayoffPending.length + ')'));
    D.selfDayoffPending.forEach(req => {
      s.appendChild(h('div', { className: 'pc' },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 } },
          h('span', { style: { fontSize: '22px' } }, req.avatar),
          h('div', {},
            h('div', { style: { fontWeight: 700, fontSize: '14px' } }, req.nickname || req.name),
            h('div', { style: { fontSize: '13px', color: '#64748b' } }, '📅 หยุดเดิม: ' + fmtDate(req.off_date) + ' → ทำงาน'),
            h('div', { style: { fontSize: '13px', color: '#7c3aed' } }, '📅 หยุดแทน: ' + fmtDate(req.work_date)),
            req.reason ? h('div', { style: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' } }, '💬 ' + req.reason) : '')),
        h('div', { style: { display: 'flex', gap: '6px' } },
          h('button', { className: 'ba', onClick: async () => { try { await api('/api/self-dayoff/' + req.id + '/approve', 'PUT'); toast('✅ อนุมัติ'); load(); } catch (e) { toast(e.message, true); } } }, '✅ อนุมัติ'),
          h('button', { className: 'br', onClick: async () => { const reason = prompt('เหตุผลที่ปฏิเสธ:'); if (reason === null) return; try { await api('/api/self-dayoff/' + req.id + '/reject', 'PUT', { reject_reason: reason }); toast('❌ ปฏิเสธ'); load(); } catch (e) { toast(e.message, true); } } }, '❌ ปฏิเสธ'))));
    });
  }

  return s;
}
function rHist() {
  const w = h('div', { className: 'ps' });

  // === PENDING SECTION (at top) ===
  const hasPending = (canApproveRole && (D.pl.length > 0 || D.ps.length > 0 || (D.selfDayoffPending||[]).length > 0)) || D.ps.some(sw => sw.to_employee_id === U.id);
  if (hasPending) {
    const pendingBox = rPnd();
    pendingBox.style.marginBottom = '24px';
    pendingBox.style.padding = '20px';
    pendingBox.style.background = 'linear-gradient(135deg, #fffbeb, #fef3c7)';
    pendingBox.style.borderRadius = '16px';
    pendingBox.style.border = '2px solid #fbbf24';
    w.appendChild(pendingBox);
  }

  // === HISTORY SECTION ===
  if (!D.histLoaded) {
    D.histLoaded = true;
    api('/api/history?year=' + D.y).then(r => { D.hist = r.data; D.histFilter = { type: 'all', status: 'all', page: 0 }; render(); });
    w.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px' } }, '⏳ กำลังโหลด...'));
    return w;
  }
  if (!D.hist) return w;
  if (!D.histFilter) D.histFilter = { type: 'all', status: 'all', page: 0 };
  const hf = D.histFilter;
  const PER_PAGE = 20;

  const all = [];
  D.hist.leaves.forEach(l => all.push({ kind: 'leave', status: l.status, date: l.date, approvedAt: l.approved_at, data: l }));
  D.hist.swaps.forEach(s => all.push({ kind: s.swap_type === 'dayoff' ? 'dayoff' : 'swap', status: s.status, date: s.date, approvedAt: s.approved_at, data: s }));
  all.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.approvedAt || '').localeCompare(a.approvedAt || ''));

  let filtered = all;
  if (hf.type !== 'all') filtered = filtered.filter(i => i.kind === hf.type);
  if (hf.status !== 'all') filtered = filtered.filter(i => i.status === hf.status);

  const approved = all.filter(i => i.status === 'approved').length;
  const rejected = all.filter(i => i.status === 'rejected').length;

  // Header
  w.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' } },
    h('div', { className: 'pt', style: { margin: 0 } }, '📜 ประวัติ (' + (D.y+543) + ')'),
    h('div', { style: { display: 'flex', gap: '6px' } },
      h('div', { style: { padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#dcfce7', color: '#16a34a' } }, '✅ ' + approved),
      h('div', { style: { padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#fee2e2', color: '#dc2626' } }, '❌ ' + rejected))));

  // Filter pills
  const fb = h('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' } });
  [['all','ทั้งหมด'],['leave','วันลา'],['swap','สลับกะ'],['dayoff','สลับวันหยุด']].forEach(([v,l]) => {
    fb.appendChild(h('button', { style: { padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, border: 'none', background: hf.type === v ? '#6366f1' : '#f1f5f9', color: hf.type === v ? '#fff' : '#64748b', cursor: 'pointer' }, onClick: () => { hf.type = v; hf.page = 0; render(); } }, l));
  });
  fb.appendChild(h('span', { style: { width: '1px', height: '14px', background: '#e2e8f0' } }));
  [['all','ทั้งหมด'],['approved','✅'],['rejected','❌']].forEach(([v,l]) => {
    fb.appendChild(h('button', { style: { padding: '4px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, border: 'none', background: hf.status === v ? '#6366f1' : '#f1f5f9', color: hf.status === v ? '#fff' : '#64748b', cursor: 'pointer' }, onClick: () => { hf.status = v; hf.page = 0; render(); } }, l));
  });
  w.appendChild(fb);

  const LTH = {sick:'🏥 ลาป่วย',personal:'📋 ลากิจ',vacation:'✈️ ลาพักร้อน'};
  const page = filtered.slice(hf.page * PER_PAGE, (hf.page + 1) * PER_PAGE);

  if (!page.length) { w.appendChild(h('div', { style: { textAlign: 'center', padding: '40px', color: '#94a3b8' } }, '📭 ไม่มีรายการ')); return w; }

  // Table
  const tw = h('div', { style: { overflowX: 'auto', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff' } });
  const tb = h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } });
  const thd = h('thead');
  thd.appendChild(h('tr', {},
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'วันที่'),
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'พนักงาน'),
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'ประเภท'),
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'รายละเอียด'),
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'สถานะ'),
    h('th', { style: { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b' } }, 'ผู้อนุมัติ'),
    isO ? h('th', { style: { padding: '10px 12px', textAlign: 'center', background: '#f8fafc', borderBottom: '2px solid #e5e7eb', fontWeight: 700, fontSize: '12px', color: '#64748b', width: '50px' } }, '🗑️') : '',
  ));
  tb.appendChild(thd);

  const bd = h('tbody');
  page.forEach((item, i) => {
    const isA = item.status === 'approved';
    const rowBg = i % 2 === 0 ? '#fff' : '#fafbfc';
    const cs = { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', background: rowBg, verticalAlign: 'middle' };

    let typeBadge, empName, dateStr, detail, approver;
    if (item.kind === 'leave') {
      const l = item.data;
      const ltColor = l.leave_type === 'sick' ? '#ef4444' : l.leave_type === 'personal' ? '#8b5cf6' : '#06b6d4';
      typeBadge = h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: ltColor + '15', color: ltColor } }, LTH[l.leave_type] || l.leave_type);
      empName = h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', {}, l.emp_avatar || '👤'), h('span', { style: { fontWeight: 600 } }, l.emp_nick || l.emp_name));
      dateStr = fmtDate(l.date);
      detail = l.reason || '—';
      approver = (l.approver_nick || l.approver_name || '—');
    } else {
      const s = item.data;
      const isDO = item.kind === 'dayoff';
      typeBadge = h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isDO ? '#fef3c7' : '#d1fae5', color: isDO ? '#d97706' : '#10b981' } }, isDO ? '📅 สลับวันหยุด' : '🔄 สลับกะ');
      empName = h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' } }, h('span', {}, s.from_avatar || '👤'), h('span', { style: { fontWeight: 600 } }, (s.from_nick || s.from_name)), h('span', { style: { color: '#94a3b8' } }, '↔'), h('span', { style: { fontWeight: 600 } }, (s.to_nick || s.to_name)));
      dateStr = fmtDate(s.date) + (s.date2 ? ' ↔ ' + fmtDate(s.date2) : '');
      detail = s.reason || '—';
      approver = (s.approver_nick || s.approver_name || '—');
    }

    const deleteBtn = isO ? h('td', { style: { ...cs, textAlign: 'center' } },
      h('button', { style: { border: 'none', background: '#fee2e2', color: '#dc2626', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 },
        onClick: async () => {
          if (!confirm('ลบรายการนี้?')) return;
          try {
            const kind = item.kind === 'leave' ? 'leave' : 'swap';
            const id = item.data.id;
            await api('/api/history/' + kind + '/' + id, 'DELETE');
            toast('🗑️ ลบแล้ว');
            D.histLoaded = false; D.hist = null; render();
          } catch (e) { toast(e.message, true); }
        } }, '🗑️')) : '';

    bd.appendChild(h('tr', {},
      h('td', { style: { ...cs, whiteSpace: 'nowrap' } }, dateStr),
      h('td', { style: cs }, empName),
      h('td', { style: cs }, typeBadge),
      h('td', { style: { ...cs, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' } }, detail),
      h('td', { style: cs }, h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isA ? '#dcfce7' : '#fee2e2', color: isA ? '#16a34a' : '#dc2626' } }, isA ? '✅ อนุมัติ' : '❌ ปฏิเสธ')),
      h('td', { style: cs }, approver),
      deleteBtn,
    ));
  });
  tb.appendChild(bd);
  tw.appendChild(tb);
  w.appendChild(tw);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  if (totalPages > 1) {
    const pg = h('div', { style: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' } });
    if (hf.page > 0) pg.appendChild(h('button', { style: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }, onClick: () => { hf.page--; render(); } }, '‹ ก่อนหน้า'));
    pg.appendChild(h('span', { style: { padding: '6px 14px', fontSize: '13px', color: '#64748b' } }, (hf.page+1) + '/' + totalPages));
    if (hf.page < totalPages - 1) pg.appendChild(h('button', { style: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }, onClick: () => { hf.page++; render(); } }, 'ถัดไป ›'));
    w.appendChild(pg);
  }
  return w;
}

// === KPI ERROR TRACKING ===
function rKpi() {
  const w = h('div', { className: 'ps' });
  if (!D.kpiLoaded) {
    D.kpiLoaded = true;
    Promise.all([
      api('/api/kpi/summary?year=' + D.y),
      api('/api/kpi/categories'),
      api('/api/kpi/details'),
      api('/api/kpi/errors?year=' + D.y),
    ]).then(([sum, cats, dets, errs]) => {
      D.kpi = { sum: sum.data, cats: cats.data, dets: dets.data, errs: errs.data };
      render();
    });
    w.appendChild(h('p', { style: { color: '#94a3b8' } }, '⏳ กำลังโหลด...'));
    return w;
  }
  if (!D.kpi) return w;
  const { sum, cats, errs } = D.kpi;
  const canAdmin = isO || KPI_ADMINS.includes(U.email);

  if (!D.kpiTab) D.kpiTab = 'summary';
  const subTabs = [['summary', '📊 สรุป'], ['myErrors', '👤 ของฉัน']];
  if (canAdmin) { subTabs.push(['manage', '⚡ บันทึก']); subTabs.push(['settings', '⚙️ ตั้งค่า']); }
  const tb = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
  subTabs.forEach(([k, l]) => tb.appendChild(h('button', { style: { padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, border: '2px solid', borderColor: D.kpiTab === k ? '#6366f1' : '#e2e8f0', background: D.kpiTab === k ? '#e0e7ff' : '#fff', color: D.kpiTab === k ? '#6366f1' : '#64748b', cursor: 'pointer' }, onClick: () => { D.kpiTab = k; render(); } }, l)));
  w.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' } },
    h('div', { className: 'pt' }, '⚡ KPI ข้อผิดพลาด (' + (D.y+543) + ')'), tb));

  if (D.kpiTab === 'summary') {
    // Hero stats
    const hero = h('div', { style: { background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)', borderRadius: '16px', padding: '28px', color: '#fff', marginBottom: '20px' } });
    hero.appendChild(h('div', { style: { fontSize: '13px', fontWeight: 600, opacity: 0.7, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' } }, '⚡ สรุป KPI ข้อผิดพลาด (' + (D.y+543) + ')'));
    const heroGrid = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' } });
    [[sum.totals.count, '📊', 'ข้อผิดพลาดรวม'], [sum.totals.points, '🔢', 'แต้มรวม'], [(sum.totals.damage || 0).toFixed(0) + ' ฿', '💰', 'ค่าเสียหาย']].forEach(([v, ic, lb]) =>
      heroGrid.appendChild(h('div', { style: { background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '18px', textAlign: 'center', backdropFilter: 'blur(4px)' } },
        h('div', { style: { fontSize: '28px', marginBottom: '4px' } }, ic),
        h('div', { style: { fontSize: '30px', fontWeight: 800 } }, String(v)),
        h('div', { style: { fontSize: '11px', opacity: 0.7 } }, lb))));
    hero.appendChild(heroGrid);
    w.appendChild(hero);

    // Category breakdown — bars left, donut right
    if (sum.byCategory.length) {
      const catBox = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '20px' } });
      catBox.appendChild(h('div', { style: { fontSize: '15px', fontWeight: 700, marginBottom: '16px' } }, '📂 แต้มตามหมวดหมู่'));
      const tp = sum.totals.points || 1;
      const catRow = h('div', { style: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', alignItems: 'center' } });
      // Left: bars
      const barsDiv = h('div', {});
      sum.byCategory.forEach(c => {
        const pct = (c.total_points / tp * 100).toFixed(1);
        barsDiv.appendChild(h('div', { style: { marginBottom: '10px' } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' } },
            h('span', { style: { fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' } },
              h('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: c.color } }), c.name),
            h('span', { style: { fontWeight: 700, color: c.color } }, c.total_points + ' (' + pct + '%)')),
          h('div', { style: { height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' } },
            h('div', { style: { width: pct + '%', height: '100%', background: 'linear-gradient(90deg, ' + c.color + ', ' + c.color + '99)', borderRadius: '5px', transition: 'width 0.6s ease' } }))));
      });
      catRow.appendChild(barsDiv);
      // Right: donut
      let accumulated = 0;
      const segments = sum.byCategory.map(c => {
        const pct = (c.total_points / tp * 100);
        const start = accumulated;
        accumulated += pct;
        return c.color + ' ' + start + '% ' + accumulated + '%';
      });
      const catGrad = 'conic-gradient(' + segments.join(', ') + ')';
      const donutDiv = h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' } });
      donutDiv.appendChild(h('div', { style: { width: '130px', height: '130px', borderRadius: '50%', background: catGrad, position: 'relative', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' } },
        h('div', { style: { position: 'absolute', top: '22px', left: '22px', right: '22px', bottom: '22px', borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
          h('div', { style: { fontSize: '22px', fontWeight: 800, color: '#1e293b' } }, String(sum.totals.points)),
          h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, 'แต้มรวม'))));
      catRow.appendChild(donutDiv);
      catBox.appendChild(catRow);
      w.appendChild(catBox);
    }

    // Employee ranking
    w.appendChild(h('div', { style: { fontSize: '15px', fontWeight: 700, marginBottom: '12px' } }, '🏆 อันดับพนักงาน'));
    const empBox = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px' } });
    const em = {}; sum.byEmployee.forEach(e => { em[e.employee_id] = e; });
    const sortedEmps = [...ce()].sort((a, b) => ((em[b.id]?.total_points||0) - (em[a.id]?.total_points||0)));
    sortedEmps.forEach((emp, idx) => {
      const d = em[emp.id] || { error_count: 0, total_points: 0, total_damage: 0 };
      const ok = d.total_points === 0, me = emp.id === U.id;
      const medal = ok ? '🏆' : idx === 0 ? '💀' : idx === 1 ? '😱' : idx === 2 ? '😬' : '';
      const borderCol = ok ? '#10b981' : d.total_points >= 10 ? '#ef4444' : d.total_points >= 5 ? '#f59e0b' : '#e2e8f0';
      empBox.appendChild(h('div', { style: { background: me ? '#eff6ff' : '#fff', borderRadius: '14px', padding: '16px', border: '2px solid ' + borderCol, position: 'relative' } },
        medal ? h('div', { style: { position: 'absolute', top: '8px', right: '10px', fontSize: '20px' } }, medal) : '',
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' } },
          emp.profile_image ? h('img', { src: emp.profile_image, style: { width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' } }) : h('div', { style: { fontSize: '28px' } }, emp.avatar),
          h('div', {}, h('div', { style: { fontWeight: 700, fontSize: '14px' } }, dn(emp)),
            me ? h('div', { style: { fontSize: '10px', color: '#3b82f6', fontWeight: 700 } }, 'คุณ') : '')),
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
          h('div', { style: { textAlign: 'center', padding: '8px', background: '#f8fafc', borderRadius: '8px' } },
            h('div', { style: { fontSize: '18px', fontWeight: 800, color: d.total_points > 0 ? '#ef4444' : '#10b981' } }, String(d.total_points)),
            h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, 'แต้ม')),
          h('div', { style: { textAlign: 'center', padding: '8px', background: '#f8fafc', borderRadius: '8px' } },
            h('div', { style: { fontSize: '18px', fontWeight: 800, color: '#6366f1' } }, String(d.error_count)),
            h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, 'ครั้ง'))),
        d.total_damage > 0 ? h('div', { style: { marginTop: '8px', textAlign: 'center', fontSize: '12px', color: '#d97706', fontWeight: 700 } }, '💰 ' + d.total_damage.toFixed(2) + ' ฿') : ''));
    });
    w.appendChild(empBox);
  } else if (D.kpiTab === 'myErrors') {
    const my = errs.filter(e => e.employee_id === U.id);
    w.appendChild(h('div', { style: { fontWeight: 700, fontSize: '15px', marginBottom: '10px' } }, '👤 ข้อผิดพลาดของฉัน (' + my.length + ')'));
    if (!my.length) { w.appendChild(h('div', { style: { textAlign: 'center', padding: '40px' } }, h('div', { style: { fontSize: '48px', marginBottom: '8px' } }, '🏆'), h('div', { style: { fontSize: '16px', fontWeight: 700, color: '#10b981' } }, 'ยังไม่มีข้อผิดพลาด!'))); return w; }
    const mp = my.reduce((s, e) => s + e.points, 0), md = my.reduce((s, e) => s + (e.damage_cost || 0), 0);
    w.appendChild(h('div', { style: { display: 'flex', gap: '12px', marginBottom: '16px' } },
      h('div', { style: { flex: 1, background: '#fef2f2', borderRadius: '10px', padding: '14px', textAlign: 'center' } }, h('div', { style: { fontSize: '12px', color: '#ef4444' } }, 'แต้มรวม'), h('div', { style: { fontSize: '24px', fontWeight: 800, color: '#ef4444' } }, String(mp))),
      h('div', { style: { flex: 1, background: '#fffbeb', borderRadius: '10px', padding: '14px', textAlign: 'center' } }, h('div', { style: { fontSize: '12px', color: '#d97706' } }, 'ค่าเสียหาย'), h('div', { style: { fontSize: '24px', fontWeight: 800, color: '#d97706' } }, md.toFixed(2) + ' ฿'))));
    my.forEach(er => {
      w.appendChild(h('div', { style: { padding: '10px 14px', background: '#fff', borderRadius: '8px', marginBottom: '4px', border: '1px solid #e2e8f0', borderLeft: '4px solid ' + (er.cat_color || '#6366f1'), fontSize: '13px' } },
        h('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' } },
          h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: er.cat_color + '20', color: er.cat_color } }, er.cat_name),
          h('b', {}, er.detail_desc || er.note || '—'), h('span', { style: { color: '#94a3b8' } }, '🔢 ' + er.points)),
        h('div', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' } }, '📅 ' + fmtDate(er.date) + (er.damage_cost > 0 ? ' | 💰 ' + er.damage_cost + ' ฿' : ''))));
    });
  } else if (D.kpiTab === 'manage') {
    w.appendChild(h('button', { className: 'btn', style: { background: '#6366f1', marginBottom: '16px' }, onClick: () => openModal('kpiAdd') }, '+ บันทึกข้อผิดพลาดใหม่'));
    w.appendChild(h('div', { style: { fontWeight: 700, fontSize: '14px', marginBottom: '8px' } }, '📋 รายการทั้งหมด (' + errs.length + ')'));
    // Table layout
    const tw = h('div', { style: { overflowX: 'auto', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' } });
    const tb = h('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } });
    const ths = { padding: '10px 12px', textAlign: 'left', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontWeight: 700, fontSize: '12px', color: '#64748b' };
    tb.appendChild(h('thead', {}, h('tr', {},
      h('th', { style: ths }, 'วันที่'),
      h('th', { style: ths }, 'พนักงาน'),
      h('th', { style: ths }, 'หมวด'),
      h('th', { style: ths }, 'รายละเอียด'),
      h('th', { style: { ...ths, textAlign: 'center' } }, 'แต้ม'),
      h('th', { style: { ...ths, textAlign: 'center' } }, 'ค่าเสียหาย'),
      h('th', { style: { ...ths, textAlign: 'center' } }, 'จัดการ'))));
    const bod = h('tbody');
    errs.slice(0, 50).forEach((er, i) => {
      const cs = { padding: '10px 12px', borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc', verticalAlign: 'middle' };
      bod.appendChild(h('tr', {},
        h('td', { style: { ...cs, whiteSpace: 'nowrap', fontSize: '12px' } }, fmtDate(er.date)),
        h('td', { style: cs }, h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', {}, er.emp_avatar || '👤'), h('span', { style: { fontWeight: 600 } }, er.emp_nick || er.emp_name))),
        h('td', { style: cs }, h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: (er.cat_color||'#6366f1') + '15', color: er.cat_color } }, er.cat_name)),
        h('td', { style: { ...cs, maxWidth: '200px' } }, er.detail_desc || er.note || '—'),
        h('td', { style: { ...cs, textAlign: 'center', fontWeight: 700, color: '#ef4444' } }, String(er.points)),
        h('td', { style: { ...cs, textAlign: 'center', color: '#d97706' } }, er.damage_cost > 0 ? er.damage_cost + '฿' : '—'),
        h('td', { style: { ...cs, textAlign: 'center' } },
          h('div', { style: { display: 'flex', gap: '4px', justifyContent: 'center' } },
            h('button', { style: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '12px', color: '#3b82f6', fontWeight: 600 }, onClick: () => {
              // Edit modal
              const popup = h('div', { style: { position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)' }, onClick: (ev) => { if (ev.target === popup) document.body.removeChild(popup); } });
              const box = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '24px', minWidth: '360px', maxWidth: '460px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }, onClick: ev => ev.stopPropagation() });
              box.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
                h('div', { style: { fontWeight: 700, fontSize: '16px' } }, '✏️ แก้ไขข้อผิดพลาด'),
                h('button', { style: { border: 'none', background: '#f1f5f9', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }, onClick: () => document.body.removeChild(popup) }, '✕')));
              box.appendChild(h('div', { style: { padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' } },
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' } }, h('span', {}, er.emp_avatar || '👤'), h('b', {}, er.emp_nick || er.emp_name), h('span', { style: { color: '#94a3b8' } }, '— ' + fmtDate(er.date))),
                h('div', { style: { fontSize: '11px', color: er.cat_color } }, er.cat_name + (er.detail_desc ? ' > ' + er.detail_desc : ''))));
              box.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📝 หมายเหตุ'), h('input', { className: 'fi', id: 'edit-note', value: er.note || '' })));
              box.appendChild(h('div', { style: { display: 'flex', gap: '10px' } },
                h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, '🔢 แต้ม'), h('input', { className: 'fi', id: 'edit-pts', type: 'number', value: String(er.points) })),
                h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, '💰 ค่าเสียหาย'), h('input', { className: 'fi', id: 'edit-dmg', type: 'number', value: String(er.damage_cost || 0), step: '0.01' }))));
              box.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => {
                const note = document.getElementById('edit-note').value;
                const pts = parseInt(document.getElementById('edit-pts').value) || er.points;
                const dmg = parseFloat(document.getElementById('edit-dmg').value);
                try { await api('/api/kpi/errors/' + er.id, 'PUT', { note, points: pts, damage_cost: isNaN(dmg) ? er.damage_cost : dmg }); document.body.removeChild(popup); toast('✅ แก้ไขแล้ว'); D.kpiLoaded = false; D.kpi = null; render(); } catch (e) { toast(e.message, true); }
              } }, '💾 บันทึก'));
              popup.appendChild(box);
              document.body.appendChild(popup);
            } }, '✏️ แก้ไข'),
            h('button', { style: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', padding: '4px 10px', fontSize: '12px', color: '#ef4444', fontWeight: 600 }, onClick: async () => {
              if (!confirm('ลบรายการนี้?')) return;
              try { await api('/api/kpi/errors/' + er.id, 'DELETE'); toast('ลบแล้ว'); D.kpiLoaded = false; D.kpi = null; render(); } catch (e) { toast(e.message, true); }
            } }, '🗑️ ลบ')))));
    });
    tb.appendChild(bod);
    tw.appendChild(tb);
    w.appendChild(tw);
  } else if (D.kpiTab === 'settings') {
    w.appendChild(h('div', { style: { fontWeight: 700, fontSize: '15px', marginBottom: '12px' } }, '⚙️ ตั้งค่าหมวดหมู่ & รายละเอียด'));
    w.appendChild(h('div', { style: { padding: '12px 16px', background: '#eff6ff', borderRadius: '10px', marginBottom: '16px', border: '1px solid #bfdbfe' } },
      h('div', { style: { fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '6px' } }, '🔑 ผู้ดูแล KPI'),
      h('div', { style: { fontSize: '12px', color: '#3b82f6', marginBottom: '8px' } }, KPI_ADMINS.join(', ')),
      h('div', { style: { display: 'flex', gap: '6px' } },
        h('input', { className: 'fi', id: 'kpi-new-admin', placeholder: 'เพิ่มอีเมลผู้ดูแล...', style: { flex: 1, fontSize: '12px' } }),
        h('button', { className: 'btn', style: { background: '#3b82f6', padding: '6px 14px', fontSize: '12px', width: 'auto', marginTop: 0 }, onClick: async () => {
          const email = document.getElementById('kpi-new-admin').value.trim();
          if (!email || !email.includes('@')) { toast('กรุณากรอกอีเมลให้ถูกต้อง', true); return; }
          const newList = [...KPI_ADMINS.filter(e => e), email].join(',');
          try { await api('/api/settings', 'PUT', { kpi_admins: newList }); toast('✅ เพิ่มแล้ว'); D.kpiLoaded = false; D.kpi = null; load(); } catch (e) { toast(e.message, true); }
        } }, '+ เพิ่ม')),
      // แสดงรายชื่อที่มีอยู่พร้อมปุ่มลบ
      KPI_ADMINS.filter(e => e).length > 0 ? h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' } },
        ...KPI_ADMINS.filter(e => e).map(email => h('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#e0e7ff', borderRadius: '8px', fontSize: '12px', color: '#4338ca' } },
          h('span', {}, email),
          h('button', { style: { border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '14px', padding: '0 2px' }, onClick: async () => {
            const newList = KPI_ADMINS.filter(e => e && e !== email).join(',');
            try { await api('/api/settings', 'PUT', { kpi_admins: newList || '' }); toast('✅ ลบแล้ว'); D.kpiLoaded = false; D.kpi = null; load(); } catch (e) { toast(e.message, true); }
          } }, '✕')))) : ''));
    cats.forEach(cat => {
      const cd = (D.kpi?.dets || []).filter(d => d.category_id === cat.id);
      const sec = h('div', { style: { marginBottom: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' } });
      sec.appendChild(h('div', { style: { padding: '10px 14px', background: cat.color + '15', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        h('div', { style: { fontWeight: 700, fontSize: '14px', color: cat.color } }, '📂 ' + cat.name + ' (' + cd.length + ')'),
        h('button', { style: { fontSize: '12px', background: cat.color, color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }, onClick: async () => {
          const desc = prompt('รายละเอียดใหม่:'); if (!desc) return;
          const pts = parseInt(prompt('จำนวนแต้ม:', '1')) || 1;
          try { await api('/api/kpi/details', 'POST', { category_id: cat.id, description: desc, points: pts }); toast('✅ เพิ่มแล้ว'); D.kpiLoaded = false; D.kpi = null; render(); } catch (e) { toast(e.message, true); }
        } }, '+ เพิ่ม')));
      cd.forEach(d => {
        sec.appendChild(h('div', { style: { padding: '8px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' } },
          h('span', {}, d.description),
          h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
            h('span', { style: { fontSize: '12px', padding: '2px 8px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 700 } }, d.points + ' แต้ม'),
            h('button', { style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#3b82f6' }, onClick: async () => {
              const nd = prompt('แก้ไข:', d.description); if (!nd) return;
              const np = parseInt(prompt('แต้ม:', d.points)) || d.points;
              try { await api('/api/kpi/details/' + d.id, 'PUT', { description: nd, points: np }); toast('✅'); D.kpiLoaded = false; D.kpi = null; render(); } catch (e) { toast(e.message, true); }
            } }, '✏️'),
            h('button', { style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#ef4444' }, onClick: async () => {
              if (!confirm('ลบ?')) return;
              try { await api('/api/kpi/details/' + d.id, 'DELETE'); toast('ลบแล้ว'); D.kpiLoaded = false; D.kpi = null; render(); } catch (e) { toast(e.message, true); }
            } }, '🗑️'))));
      });
      w.appendChild(sec);
    });
  }
  return w;
}

// === MODALS ROUTER ===
function rModal() {
  const map = { leave: rLv, swap: rSwp, dayoffSwap: rDayoffSwp, selfDayoff: rSelfDayoff, kpiAdd: rKpiAdd, onboard: rOnboard, employee: rEmp, editEmp: rEditEmp, profile: rPrf, settings: rSet, achievements: rAchMgr, rewardMgr: rRewardMgr, roleMgr: rRoleMgr };
  return (map[D.modal] || (() => h('div')))();
}

// === DAY MODAL ===
function rDay() {
  const k = D.sd; if (!k) return h('div');
  const [yr, mo, dy] = [+k.split('-')[0], +k.split('-')[1] - 1, +k.split('-')[2]];
  const hl = D.hol[k];
  const o = h('div', { className: 'mo', onClick: closeModal });
  const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '📅 ' + fmtDate(k) + ' ' + DAYF[gdow(yr, mo, dy)] + (hl ? ' — 🔴 ' + hl : '')), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  ce().forEach(emp => {
    const inf = disp(emp, k, yr, mo, dy), sel = D.se === emp.id;
    const r = h('div', { className: 'row' + (sel ? ' sel' : ''), onClick: () => { D.se = sel ? null : emp.id; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); } });
    const hd = h('div', { className: 'rh' }, av(emp), h('div', {}, h('div', { style: { fontWeight: 700, fontSize: '14px' } }, dn(emp)), h('div', { style: { fontSize: '11px', color: '#94a3b8' } }, stime(emp))));
    if (inf.isL) hd.appendChild(h('span', { className: 'rs', style: { background: inf.b, color: inf.c } }, inf.i + ' ' + inf.l + (inf.st === 'pending' ? ' (รอ)' : '')));
    else hd.appendChild(h('span', { className: 'rs', style: { background: inf.b, color: inf.c } }, inf.i + ' ' + inf.l));
    r.appendChild(hd);
    if (sel) {
      r.appendChild(h('div', { className: 'sla' }, 'เปลี่ยนกะ'));
      const sp = h('div', { className: 'pg' });
      Object.entries(SHIFT).forEach(([t, si]) => { const a = !inf.isL && inf.ty === t; sp.appendChild(h('button', { className: 'pl' + (a ? ' on' : ''), style: a ? { borderColor: si.c, background: si.b, color: si.c } : {},
        onClick: async e => { e.stopPropagation(); try { if (inf.isL && inf.lid) await api('/api/leaves/' + inf.lid, 'DELETE'); await api('/api/shifts', 'POST', { employee_id: emp.id, date: k, shift_type: t }); toast(si.i + ' ' + dn(emp) + ' → ' + si.l); load(); } catch (er) { toast(er.message, true); } } }, si.i + ' ' + si.l)); });
      r.appendChild(sp);
      r.appendChild(h('div', { className: 'sla' }, 'ลางาน'));
      const lp = h('div', { className: 'pg' });
      Object.entries(LEAVE).forEach(([t, li]) => { const lv = D.lv[emp.id + '-' + k], a = lv && lv.t === t; lp.appendChild(h('button', { className: 'pl' + (a ? ' on' : ''), style: a ? { borderColor: li.c, background: li.b, color: li.c } : {},
        onClick: async e => { e.stopPropagation(); try { if (a) { await api('/api/leaves/' + lv.id, 'DELETE'); toast('❌ ยกเลิกลา'); } else { await api('/api/leaves', 'POST', { employee_id: emp.id, date: k, leave_type: t }); toast(li.i + ' ' + dn(emp) + ' → ' + li.l); } load(); } catch (er) { toast(er.message, true); } } }, li.i + ' ' + li.l)); });
      r.appendChild(lp);
    }
    m.appendChild(r);
  });
  o.appendChild(m); return o;
}

// === LEAVE MODAL ===
function rLv() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '📝 ลงวันลา'), h('button', { className: 'mc', onClick: closeModal }, '✕')));

  // Auto-select ตัวเองถ้าเป็น staff (ไม่ใช่ owner/admin)
  const myEmp = ce().find(e => e.id === U.id);
  if (!isO && myEmp) {
    D.se = myEmp.id;
    m.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '16px' } },
      av(myEmp), h('div', {}, h('div', { style: { fontWeight: 700, fontSize: '14px' } }, dn(myEmp)), h('div', { style: { fontSize: '12px', color: '#94a3b8' } }, myEmp.email || ''))));
  } else {
    // Owner เลือกพนักงานได้
    const eg = h('div', { className: 'fg' }); eg.appendChild(h('label', { className: 'fl' }, 'เลือกพนักงาน')); const ep = h('div', { className: 'pg' });
    ce().forEach(emp => { const a = D.se === emp.id; ep.appendChild(h('button', { className: 'pl' + (a ? ' on' : ''), style: a ? { borderColor: '#3b82f6', background: '#eff6ff', color: '#3b82f6' } : {}, onClick: () => { D.se = emp.id; render(); requestAnimationFrame(() => { const mo = document.querySelector('.mo'); if (mo) mo.classList.add('show'); }); } }, emp.avatar + ' ' + dn(emp))); });
    eg.appendChild(ep); m.appendChild(eg);
  }

  // ตรวจสอบว่าวันก่อนหน้าเป็นวันหยุด → auto เลือกลาพักร้อน
  let defaultType = 'personal';
  if (D.sd) {
    const prev = new Date(D.sd); prev.setDate(prev.getDate() - 1);
    const prevISO = prev.toISOString().split('T')[0];
    const prevDow = prev.getDay();
    const selEmp = D.se ? ce().find(e => e.id === D.se) : null;
    const prevIsHoliday = D.hol[prevISO];
    const prevIsOff = selEmp ? offD(selEmp).includes(prevDow) : false;
    const prevIsLeave = selEmp ? D.lv[selEmp.id + '-' + prevISO] : false;
    if (prevIsHoliday || prevIsOff || prevIsLeave) defaultType = 'vacation';
  }
  let slt = defaultType;

  const LEAVE_DESC = {
    sick: '🏥 ใช้เมื่อป่วยเท่านั้น — ไม่จำกัดจำนวนวัน',
    personal: '📋 ใช้เมื่อหยุด 1 วัน หรือมีธุระส่วนตัว',
    vacation: '✈️ ใช้เมื่อหยุดติดต่อกัน 2 วันขึ้นไป',
  };

  const tg = h('div', { className: 'fg' }); tg.appendChild(h('label', { className: 'fl' }, 'ประเภท'));
  const tp = h('div', { className: 'pg' });
  const descEl = h('div', { id: 'leave-desc', style: { marginTop: '8px', padding: '10px 14px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#15803d', fontWeight: 600, border: '1px solid #bbf7d0' } }, LEAVE_DESC[defaultType]);

  Object.entries(LEAVE).forEach(([t, i]) => {
    tp.appendChild(h('button', { className: 'pl', id: 'lt-' + t, style: t === defaultType ? { borderColor: i.c, background: i.b, color: i.c } : {},
      onClick: () => {
        slt = t;
        document.querySelectorAll('[id^=lt-]').forEach(el => { const tt = el.id.replace('lt-', ''), ii = LEAVE[tt]; el.style.borderColor = tt === t ? ii.c : 'transparent'; el.style.background = tt === t ? ii.b : '#f8fafc'; el.style.color = tt === t ? ii.c : '#64748b'; });
        const desc = document.getElementById('leave-desc');
        if (desc) { desc.textContent = LEAVE_DESC[t]; desc.style.background = t === 'sick' ? '#fef2f2' : t === 'personal' ? '#ede9fe' : '#f0fdf4'; desc.style.color = t === 'sick' ? '#dc2626' : t === 'personal' ? '#6d28d9' : '#15803d'; desc.style.borderColor = t === 'sick' ? '#fecaca' : t === 'personal' ? '#ddd6fe' : '#bbf7d0'; }
      } }, i.i + ' ' + i.l));
  });
  tg.appendChild(tp); tg.appendChild(descEl); m.appendChild(tg);

  m.appendChild(h('div', { className: 'fg', style: { display: 'flex', gap: '10px' } }, h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, 'เริ่ม'), datePicker('ls', D.sd || '')), h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, 'สิ้นสุด'), datePicker('le', D.sd || ''))));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'lr', placeholder: 'ระบุเหตุผล...' })));
  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => {
    if (!D.se) { toast('เลือกพนักงาน', true); return; }
    const s = dpVal('ls'), e = dpVal('le'), r = document.getElementById('lr').value;
    if (!s) { toast('เลือกวันที่', true); return; }
    const selEmp = ce().find(emp => emp.id === D.se);
    const empOffs = selEmp ? offD(selEmp) : [];

    // ตรวจสอบวันเดียว — ห้ามลาในวันหยุดของผู้ใช้
    if (s === e || !e) {
      const dow = new Date(s).getDay();
      if (empOffs.includes(dow)) { toast('📅 วันที่ ' + fmtDate(s) + ' เป็นวันหยุดของคุณอยู่แล้ว ไม่ต้องลา', true); return; }
      try { await api('/api/leaves', 'POST', { employee_id: D.se, date: s, leave_type: slt, reason: r || null }); toast('✅ บันทึกสำเร็จ'); closeModal(); load(); } catch (er) { toast(er.message, true); }
    } else {
      // ลาหลายวัน — กรองวันหยุดออก แล้วส่งเฉพาะวันทำงาน
      const allDates = [];
      const cur = new Date(s);
      const end = new Date(e);
      const skippedDates = [];
      while (cur <= end) {
        const iso = cur.toISOString().split('T')[0];
        const dow = cur.getDay();
        if (empOffs.includes(dow)) {
          skippedDates.push(iso);
        } else {
          allDates.push(iso);
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (!allDates.length) { toast('ทุกวันที่เลือกเป็นวันหยุดของคุณ ไม่ต้องลา', true); return; }
      const msg = skippedDates.length > 0
        ? 'จะลาเฉพาะวันทำงาน ' + allDates.length + ' วัน (ข้ามวันหยุด ' + skippedDates.length + ' วัน) ยืนยัน?'
        : 'ยืนยันลา ' + allDates.length + ' วัน?';
      if (!confirm(msg)) return;
      try {
        await api('/api/leaves/range', 'POST', { employee_id: D.se, start_date: s, end_date: e, leave_type: slt, reason: r || null });
        toast('✅ บันทึก ' + allDates.length + ' วันสำเร็จ'); closeModal(); load();
      } catch (er) { toast(er.message, true); }
    }
  } }, 'บันทึกวันลา'));
  o.appendChild(m); return o;
}

// === SWAP MODAL ===
function rSwp() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '🔄 สลับกะ'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  m.appendChild(h('div', { style: { padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', fontSize: '13px', color: '#92400e', marginBottom: '16px', border: '1px solid #fde68a' } },
    '⚠️ คู่สลับจะเป็นผู้อนุมัติ — ต้องมีคนทำงานทุกช่วงเวลาอย่างน้อย 1 คน'));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'วันที่'), datePicker('sd', D.sd || '')));
  const emps = ce();
  let sf = null, st = null;
  if (isO) {
    m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '👤 ผู้ขอสลับ'),
      h('div', { className: 'pg' }, ...emps.map(e => h('button', { className: 'pl', id: 'sf-' + e.id, style: { flexDirection: 'column', alignItems: 'flex-start', padding: '8px 12px', gap: '2px' },
        onClick: () => { sf = e.id; document.querySelectorAll('[id^=sf-]').forEach(el => { const a = el.id === 'sf-' + e.id; el.style.borderColor = a ? '#3b82f6' : 'transparent'; el.style.background = a ? '#eff6ff' : '#f8fafc'; el.style.color = a ? '#3b82f6' : '#64748b'; });
          document.querySelectorAll('[id^=st-]').forEach(el => { el.style.display = el.id === 'st-' + e.id ? 'none' : ''; }); } },
        h('div', {}, e.avatar + ' ' + dn(e)),
        h('div', { style: { fontSize: '11px', opacity: 0.8 } }, SHIFT[e.default_shift]?.i + ' ' + stime(e)))))));
  } else {
    const myEmp = D.emp.find(e => e.id === U.id);
    sf = myEmp ? myEmp.id : null;
    if (myEmp) {
      m.appendChild(h('div', { className: 'fg' },
        h('label', { className: 'fl' }, 'ผู้ขอสลับ (คุณ)'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' } },
          av(myEmp), h('div', {}, h('span', { style: { fontWeight: 700 } }, dn(myEmp)),
            h('div', { style: { fontSize: '12px', color: '#92400e', marginTop: '2px' } }, SHIFT[myEmp.default_shift]?.i + ' ' + stime(myEmp) + ' | สลับแล้ว ' + (myEmp.swap_count || 0) + ' ครั้ง')))));
    }
  }
  m.appendChild(h('div', { style: { textAlign: 'center', fontSize: '22px', margin: '6px 0' } }, '⇅'));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'สลับกับ (ผู้อนุมัติ)'),
    h('div', { className: 'pg' }, ...emps.map(e => h('button', { className: 'pl', id: 'st-' + e.id, style: { flexDirection: 'column', alignItems: 'flex-start', padding: '8px 12px', gap: '2px' },
      onClick: () => { st = e.id; document.querySelectorAll('[id^=st-]').forEach(el => { const a = el.id === 'st-' + e.id; el.style.borderColor = a ? '#6366f1' : 'transparent'; el.style.background = a ? '#e0e7ff' : '#f8fafc'; el.style.color = a ? '#6366f1' : '#64748b'; }); } },
      h('div', {}, e.avatar + ' ' + dn(e)),
      h('div', { style: { fontSize: '11px', opacity: 0.8 } }, SHIFT[e.default_shift]?.i + ' ' + stime(e)))))));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'sr', placeholder: '...' })));
  m.appendChild(h('button', { className: 'btn', style: { background: '#16a34a' }, onClick: async () => {
    const d = dpVal('sd'), r = document.getElementById('sr').value;
    if (!sf || !st) { toast('เลือกคู่สลับ', true); return; }
    if (sf === st) { toast('ผู้ขอและคู่สลับต้องเป็นคนละคน', true); return; }
    if (!d) { toast('เลือกวันที่', true); return; }
    try { await api('/api/swaps', 'POST', { date: d, from_employee_id: sf, to_employee_id: st, reason: r || null }); toast('✅ ส่งคำขอแล้ว — รอคู่สลับอนุมัติ'); closeModal(); load(); } catch (er) { toast(er.message, true); }
  } }, 'ส่งคำขอสลับกะ'));
  o.appendChild(m); return o;
}
// === DAYOFF SWAP MODAL ===
function rDayoffSwp() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '📅 สลับวันหยุด'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  m.appendChild(h('div', { style: { padding: '10px 14px', background: '#fef3c7', borderRadius: '8px', fontSize: '13px', color: '#92400e', marginBottom: '16px', border: '1px solid #fde68a', lineHeight: '1.6' } },
    '💡 สลับวันหยุดระหว่าง 2 คน เช่น น้ำตาลหยุดเสาร์ ปุ้ยหยุดอาทิตย์ → น้ำตาลมาทำเสาร์แทน+หยุดอาทิตย์ ปุ้ยมาทำอาทิตย์แทน+หยุดเสาร์'));
  const emps = ce();
  let sf = null, st = null;
  if (isO) {
    m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '👤 ผู้ขอสลับ'),
      h('div', { className: 'pg' }, ...emps.map(e => h('button', { className: 'pl', id: 'dsf-' + e.id,
        onClick: () => { sf = e.id; document.querySelectorAll('[id^=dsf-]').forEach(el => { const a = el.id === 'dsf-' + e.id; el.style.borderColor = a ? '#3b82f6' : 'transparent'; el.style.background = a ? '#eff6ff' : '#f8fafc'; el.style.color = a ? '#3b82f6' : '#64748b'; });
          document.querySelectorAll('[id^=dst-]').forEach(el => { el.style.display = el.id === 'dst-' + e.id ? 'none' : ''; }); } },
        e.avatar + ' ' + dn(e) + ' (หยุด ' + offD(e).map(d => DAYF[d]).join(',') + ')')))));
  } else {
    const myEmp = D.emp.find(e => e.id === U.id);
    sf = myEmp ? myEmp.id : null;
    if (myEmp) {
      m.appendChild(h('div', { className: 'fg' },
        h('label', { className: 'fl' }, 'ผู้ขอสลับ (คุณ)'),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' } },
          av(myEmp), h('span', { style: { fontWeight: 700 } }, dn(myEmp)),
          h('span', { style: { fontSize: '12px', color: '#92400e', marginLeft: '6px' } }, 'หยุด: ' + offD(myEmp).map(d => DAYF[d]).join(', ')))));
    }
  }
  m.appendChild(h('div', { style: { textAlign: 'center', fontSize: '22px', margin: '6px 0' } }, '⇅'));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'สลับกับ (ผู้อนุมัติ)'),
    h('div', { className: 'pg' }, ...emps.map(e => h('button', { className: 'pl', id: 'dst-' + e.id,
      onClick: () => { st = e.id; document.querySelectorAll('[id^=dst-]').forEach(el => { const a = el.id === 'dst-' + e.id; el.style.borderColor = a ? '#6366f1' : 'transparent'; el.style.background = a ? '#e0e7ff' : '#f8fafc'; el.style.color = a ? '#6366f1' : '#64748b'; }); } },
      e.avatar + ' ' + dn(e) + ' (หยุด ' + offD(e).map(d => DAYF[d]).join(',') + ')')))));
  m.appendChild(h('div', { className: 'fg', style: { display: 'flex', gap: '10px' } },
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันหยุดของผู้ขอ (จะมาทำงานแทน)'), datePicker('ds1', '')),
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันที่จะหยุดแทน'), datePicker('ds2', ''))));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'dsr', placeholder: 'เหตุผลการสลับ...' })));
  m.appendChild(h('button', { className: 'btn', style: { background: '#d97706' }, onClick: async () => {
    const d1 = dpVal('ds1'), d2 = dpVal('ds2'), r = document.getElementById('dsr').value;
    if (!sf || !st) { toast('เลือกคู่สลับ', true); return; }
    if (sf === st) { toast('ผู้ขอและคู่สลับต้องเป็นคนละคน', true); return; }
    if (!d1 || !d2) { toast('เลือกวันที่ทั้ง 2 วัน', true); return; }
    if (d1 === d2) { toast('วันที่ต้องไม่ซ้ำกัน', true); return; }
    const fromEmpObj = D.emp.find(e => e.id === sf);
    const toEmpObj = D.emp.find(e => e.id === st);
    if (fromEmpObj) {
      const d1Shift = D.sh[sf + '-' + d1];
      const d1Dow = new Date(d1).getDay();
      const fromOffDays = offD(fromEmpObj);
      const isFromOff = d1Shift === 'off' || (!d1Shift && fromOffDays.includes(d1Dow));
      if (!isFromOff) { toast('📅 วันที่ ' + fmtDate(d1) + ' ไม่ใช่วันหยุดของ ' + dn(fromEmpObj), true); return; }
    }
    if (toEmpObj) {
      const d2Shift = D.sh[st + '-' + d2];
      const d2Dow = new Date(d2).getDay();
      const toOffDays = offD(toEmpObj);
      const isToOff = d2Shift === 'off' || (!d2Shift && toOffDays.includes(d2Dow));
      if (!isToOff) { toast('📅 วันที่ ' + fmtDate(d2) + ' ไม่ใช่วันหยุดของ ' + dn(toEmpObj), true); return; }
    }
    try {
      await api('/api/swaps/dayoff', 'POST', { date1: d1, date2: d2, from_employee_id: sf, to_employee_id: st, reason: r || null });
      toast('✅ ส่งคำขอสลับวันหยุดแล้ว — รอคู่สลับอนุมัติ'); closeModal(); load();
    } catch (er) { toast(er.message, true); }
  } }, '📅 ส่งคำขอสลับวันหยุด'));
  o.appendChild(m); return o;
}

// === SELF DAY-OFF SWAP MODAL ===
function rSelfDayoff() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '🔀 ย้ายวันหยุด'), h('button', { className: 'mc', onClick: closeModal }, '✕')));

  m.appendChild(h('div', { style: { padding: '12px 16px', background: '#f5f3ff', borderRadius: '10px', fontSize: '13px', color: '#5b21b6', marginBottom: '16px', border: '1px solid #ddd6fe', lineHeight: '1.7' } },
    '💡 ย้ายวันหยุดของตัวเองไปวันอื่น', h('br'),
    'เช่น ปกติหยุดวันพุธ → ย้ายไปหยุดวันอังคารแทน แล้วมาทำงานวันพุธ'));

  const emps = ce();
  let selEmpId = null;

  if (isO) {
    // Admin: เลือกพนักงานได้
    m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '👤 เลือกพนักงาน'),
      h('div', { className: 'pg' }, ...emps.map(e => h('button', { className: 'pl', id: 'sde-' + e.id,
        onClick: () => { selEmpId = e.id; document.querySelectorAll('[id^=sde-]').forEach(el => { const a = el.id === 'sde-' + e.id; el.style.borderColor = a ? '#7c3aed' : 'transparent'; el.style.background = a ? '#f5f3ff' : '#f8fafc'; el.style.color = a ? '#7c3aed' : '#64748b'; }); } },
        e.avatar + ' ' + dn(e) + ' (หยุด ' + offD(e).map(d => DAYF[d]).join(',') + ')')))));
  } else {
    const myEmp = D.emp.find(e => e.id === U.id);
    selEmpId = myEmp ? myEmp.id : null;
    if (myEmp) {
      m.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f5f3ff', borderRadius: '10px', border: '1px solid #ddd6fe', marginBottom: '14px' } },
        av(myEmp), h('div', {}, h('span', { style: { fontWeight: 700 } }, dn(myEmp)),
          h('div', { style: { fontSize: '12px', color: '#7c3aed', marginTop: '2px' } }, 'หยุดปกติ: ' + offD(myEmp).map(d => DAYF[d]).join(', ')))));
    }
  }

  m.appendChild(h('div', { style: { display: 'flex', gap: '12px', marginBottom: '6px' } },
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันหยุดเดิม (จะมาทำงานแทน)'), datePicker('sdo1', '')),
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันที่จะหยุดแทน'), datePicker('sdo2', ''))));

  m.appendChild(h('div', { style: { textAlign: 'center', padding: '8px', color: '#94a3b8', fontSize: '22px' } }, '📅 → 🔀 → 📅'));

  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'sdr', placeholder: 'เหตุผลที่ต้องย้ายวันหยุด...' })));

  m.appendChild(h('button', { className: 'btn', style: { background: '#7c3aed' }, onClick: async () => {
    const d1 = dpVal('sdo1'), d2 = dpVal('sdo2'), reason = document.getElementById('sdr').value;
    if (!selEmpId) { toast('เลือกพนักงาน', true); return; }
    if (!d1 || !d2) { toast('เลือกวันที่ทั้ง 2 วัน', true); return; }
    if (d1 === d2) { toast('วันที่ต้องไม่ซ้ำกัน', true); return; }

    const empObj = D.emp.find(e => e.id === selEmpId);
    if (!empObj) { toast('ไม่พบพนักงาน', true); return; }

    // ตรวจสอบว่า d1 เป็นวันหยุดจริง
    const d1Shift = D.sh[selEmpId + '-' + d1];
    const d1Dow = new Date(d1).getDay();
    const empOffDays = offD(empObj);
    const isOff = d1Shift === 'off' || (!d1Shift && empOffDays.includes(d1Dow));
    if (!isOff) { toast('📅 ' + fmtDate(d1) + ' ไม่ใช่วันหยุดของ ' + dn(empObj), true); return; }

    // ตรวจสอบว่า d2 เป็นวันทำงาน
    const d2Shift = D.sh[selEmpId + '-' + d2];
    const d2Dow = new Date(d2).getDay();
    const isWork = d2Shift && d2Shift !== 'off' ? true : (!d2Shift && !empOffDays.includes(d2Dow));
    if (!isWork) { toast('📅 ' + fmtDate(d2) + ' เป็นวันหยุดอยู่แล้ว', true); return; }

    const defShift = empObj.default_shift || 'day';
    if (!confirm('ยืนยันย้ายวันหยุด?\\n\\n✅ ' + fmtDate(d1) + ' → มาทำงาน (กะ' + (SHIFT[defShift]?.l||defShift) + ')\\n🏖️ ' + fmtDate(d2) + ' → หยุดแทน' + (reason ? '\\n💬 ' + reason : ''))) return;

    try {
      if (isO) {
        // Admin: บันทึกตรงเลย
        await api('/api/shifts', 'POST', { employee_id: selEmpId, date: d1, shift_type: defShift, note: '🔀 ย้ายวันหยุดไป ' + fmtDate(d2) + (reason ? ' — ' + reason : '') });
        await api('/api/shifts', 'POST', { employee_id: selEmpId, date: d2, shift_type: 'off', note: '🔀 ย้ายวันหยุดจาก ' + fmtDate(d1) + (reason ? ' — ' + reason : '') });
        toast('✅ ย้ายวันหยุดสำเร็จ!');
      } else {
        // Staff: ส่งคำขอรออนุมัติ
        await api('/api/self-dayoff', 'POST', { employee_id: selEmpId, off_date: d1, work_date: d2, reason: reason || null });
        toast('📨 ส่งคำขอย้ายวันหยุดแล้ว — รอแอดมินอนุมัติ');
      }
      closeModal(); load();
    } catch (er) { toast(er.message, true); }
  } }, '🔀 ยืนยันย้ายวันหยุด'));
  o.appendChild(m); return o;
}

// === KPI ADD MODAL ===
function rKpiAdd() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '⚡ บันทึกข้อผิดพลาด'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  // Date
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📅 วันที่'), datePicker('kd', dk(D.y, D.m, new Date().getDate()))));
  // Employee
  let selEmp = null;
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '👤 พนักงาน'),
    h('div', { className: 'pg' }, ...ce().map(e => h('button', { className: 'pl', id: 'ke-' + e.id,
      onClick: () => { selEmp = e.id; document.querySelectorAll('[id^=ke-]').forEach(el => { const a = el.id === 'ke-' + e.id; el.style.borderColor = a ? '#6366f1' : 'transparent'; el.style.background = a ? '#e0e7ff' : '#f8fafc'; el.style.color = a ? '#6366f1' : '#64748b'; }); } },
      e.avatar + ' ' + dn(e))))));
  // Category
  let selCat = null;
  const catEl = h('div', { className: 'pg' });
  if (D.kpi?.cats) D.kpi.cats.forEach(c => catEl.appendChild(h('button', { className: 'pl', id: 'kc-' + c.id,
    style: { borderLeft: '3px solid ' + c.color },
    onClick: () => {
      selCat = c.id;
      document.querySelectorAll('[id^=kc-]').forEach(el => { const a = el.id === 'kc-' + c.id; el.style.borderColor = a ? c.color : 'transparent'; el.style.background = a ? c.color + '15' : '#f8fafc'; });
      // Update detail dropdown
      const detSel = document.getElementById('kdet');
      if (detSel) { detSel.innerHTML = '<option value="">-- เลือกรายละเอียด --</option>';
        (D.kpi?.dets || []).filter(d => d.category_id === c.id).forEach(d => { const op = document.createElement('option'); op.value = d.id; op.textContent = d.description + ' (' + d.points + ' แต้ม)'; detSel.appendChild(op); });
      }
    } }, c.name)));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📂 หมวดหมู่'), catEl));
  // Detail dropdown
  // Detail dropdown — auto-fill points on change
  const detSelect = h('select', { className: 'fi', id: 'kdet' });
  detSelect.appendChild(h('option', { value: '' }, '-- เลือกรายละเอียด --'));
  detSelect.addEventListener('change', function() {
    const detId = this.value;
    if (detId) {
      const det = (D.kpi?.dets || []).find(d => String(d.id) === String(detId));
      if (det) { const ptsInput = document.getElementById('kpts'); if (ptsInput) { ptsInput.value = det.points; } }
    } else {
      const ptsInput = document.getElementById('kpts'); if (ptsInput) ptsInput.value = '1';
    }
  });
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📋 รายละเอียด'), detSelect));
  // Points
  m.appendChild(h('div', { className: 'fg', style: { display: 'flex', gap: '10px' } },
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '🔢 จำนวนแต้ม'), h('input', { className: 'fi', id: 'kpts', type: 'number', value: '1' })),
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '💰 ค่าเสียหาย (฿)'), h('input', { className: 'fi', id: 'kdmg', type: 'number', value: '0', step: '0.01' }))));
  // Note
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📝 หมายเหตุ'), h('input', { className: 'fi', id: 'knote', placeholder: 'หมายเลขออเดอร์ หรือ หมายเหตุ...' })));
  // Submit
  m.appendChild(h('button', { className: 'btn', style: { background: '#6366f1' }, onClick: async () => {
    const dt = dpVal('kd'), pts = parseInt(document.getElementById('kpts').value) || 1;
    const dmg = parseFloat(document.getElementById('kdmg').value) || 0;
    const detId = document.getElementById('kdet').value || null;
    const note = document.getElementById('knote').value;
    if (!selEmp) { toast('เลือกพนักงาน', true); return; }
    if (!selCat) { toast('เลือกหมวดหมู่', true); return; }
    if (!dt) { toast('เลือกวันที่', true); return; }
    // auto-fill points from detail if selected
    let finalPts = pts;
    if (detId) { const det = (D.kpi?.dets || []).find(d => d.id == detId); if (det) finalPts = det.points; }
    try {
      await api('/api/kpi/errors', 'POST', { date: dt, employee_id: selEmp, category_id: selCat, detail_id: detId ? parseInt(detId) : null, points: finalPts, damage_cost: dmg, note: note || null });
      toast('✅ บันทึกข้อผิดพลาดแล้ว'); closeModal(); D.kpiLoaded = false; D.kpi = null; render();
    } catch (er) { toast(er.message, true); }
  } }, '⚡ บันทึกข้อผิดพลาด'));
  o.appendChild(m); return o;
}

// === ONBOARDING MODAL ===
function rOnboard() {
  const o = h('div', { className: 'mo' }); // ไม่มี onClick close — บังคับกรอก
  const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '👋 ยินดีต้อนรับ!')));
  m.appendChild(h('div', { style: { textAlign: 'center', marginBottom: '16px' } },
    h('div', { style: { fontSize: '48px', marginBottom: '8px' } }, '📱'),
    h('div', { style: { fontSize: '15px', color: '#475569', lineHeight: '1.6' } }, 'กรุณากรอกข้อมูลติดต่อของคุณ', h('br'), 'เพื่อให้ทีมสามารถติดต่อคุณได้ในกรณีฉุกเฉิน')));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '📞 เบอร์โทรศัพท์'), h('input', { className: 'fi', id: 'ob-phone', type: 'tel', placeholder: '0812345678' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, '💬 LINE ID'), h('input', { className: 'fi', id: 'ob-line', placeholder: '@yourlineid' })));
  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6', marginTop: '8px' }, onClick: async () => {
    const phone = document.getElementById('ob-phone').value.trim();
    const line = document.getElementById('ob-line').value.trim();
    if (!phone) { toast('กรุณากรอกเบอร์โทร', true); return; }
    try {
      await api('/api/employees/' + U.id, 'PUT', { phone, line_id: line || null });
      toast('✅ บันทึกข้อมูลสำเร็จ!'); closeModal(); load();
    } catch (er) { toast(er.message, true); }
  } }, '✅ บันทึกข้อมูล'));
  o.appendChild(m); return o;
}

// === EMPLOYEE LIST MODAL ===
function rEmp() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', style: { maxWidth: '600px' }, onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '👤 จัดการพนักงาน'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  D.emp.forEach(emp => {
    const hidden = emp.show_in_calendar === 0;
    m.appendChild(h('div', { className: 'row', style: { display: 'flex', alignItems: 'center', gap: '10px', opacity: hidden ? 0.5 : 1 },
      onClick: () => { D.se = emp.id; D.modal = 'editEmp'; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); } },
      av(emp),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontWeight: 700, fontSize: '14px' } }, emp.name + (emp.email ? ' (' + emp.email + ')' : '') + (hidden ? ' 👻' : '')),
        h('div', { style: { fontSize: '12px', color: '#94a3b8' } }, SHIFT[emp.default_shift]?.i + ' ' + stime(emp) + ' | หยุด: ' + offD(emp).map(d => DAYF[d]).join(', ') + (hidden ? ' | ซ่อน' : ''))),
      h('span', { style: { fontSize: '13px', color: '#3b82f6', fontWeight: 600 } }, '✏️'),
    ));
  });
  // Add new employee
  m.appendChild(h('div', { style: { borderTop: '1px solid #e2e8f0', marginTop: '14px', paddingTop: '14px' } },
    h('div', { className: 'sla' }, 'เพิ่มพนักงานใหม่'),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } }, h('input', { type: 'text', className: 'fi', id: 'nn', placeholder: 'ชื่อ', style: { flex: 1 } }), h('input', { type: 'email', className: 'fi', id: 'ne', placeholder: 'Email', style: { flex: 1 } })),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
      h('select', { className: 'fi', id: 'ns', style: { flex: 1 }, innerHTML: '<option value="day">☀️ กลางวัน</option><option value="evening">🌙 กลางคืน</option>' }),
      h('input', { type: 'text', className: 'fi', id: 'nss', value: '09:00', placeholder: 'HH:MM', pattern: '[0-2][0-9]:[0-5][0-9]', maxLength: 5, style: { flex: 1 } }),
      h('input', { type: 'text', className: 'fi', id: 'nse', value: '17:00', placeholder: 'HH:MM', pattern: '[0-2][0-9]:[0-5][0-9]', maxLength: 5, style: { flex: 1 } })),
    h('div', { style: { marginBottom: '8px' } }, h('label', { className: 'fl' }, 'วันหยุดประจำ'),
      h('div', { className: 'pg', id: 'nd' }, ...DAYF.map((d, i) => h('button', { className: 'pl', id: 'nd-' + i, 'data-day': i,
        onClick: e => { e.target.classList.toggle('on'); e.target.style.borderColor = e.target.classList.contains('on') ? '#10b981' : 'transparent'; e.target.style.background = e.target.classList.contains('on') ? '#d1fae5' : '#f8fafc'; e.target.style.color = e.target.classList.contains('on') ? '#10b981' : '#64748b'; } }, d)))),
    h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => {
      const name = document.getElementById('nn').value.trim(), email = document.getElementById('ne').value.trim();
      const shift = document.getElementById('ns').value, ss = document.getElementById('nss').value, se = document.getElementById('nse').value;
      const offArr = []; document.querySelectorAll('#nd .pl.on').forEach(el => offArr.push(el.dataset.day));
      if (!name) { toast('กรอกชื่อ', true); return; }
      try { await api('/api/employees', 'POST', { name, nickname: name, email: email || null, default_shift: shift, shift_start: ss, shift_end: se, default_off_day: offArr.join(',') || '6' }); toast('✅ เพิ่มสำเร็จ'); load(); } catch (er) { toast(er.message, true); }
    } }, '+ เพิ่มพนักงาน'),
  ));
  o.appendChild(m); return o;
}

// === EDIT EMPLOYEE MODAL (smooth, no flicker) ===
function rEditEmp() {
  const emp = D.emp.find(e => e.id === D.se);
  if (!emp) return h('div');
  const o = h('div', { className: 'mo', onClick: () => { D.modal = 'employee'; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); } });
  const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, av(emp), h('div', { className: 'mt' }, '✏️ ' + dn(emp)), h('span', { className: 'save-ok', id: 'save-ok' }, '✅ บันทึกแล้ว')),
    h('button', { className: 'mc', onClick: () => { D.modal = 'employee'; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); } }, '✕'),
  ));
  m.appendChild(h('div', { style: { display: 'flex', gap: '10px' } },
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'ชื่อ'), h('input', { type: 'text', className: 'fi', id: 'en', value: emp.name || '' })),
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'ชื่อเล่น'), h('input', { type: 'text', className: 'fi', id: 'enn', value: emp.nickname || '' })),
  ));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'Email'), h('input', { type: 'email', className: 'fi', id: 'ee', value: emp.email || '' })));
  m.appendChild(h('div', { style: { display: 'flex', gap: '10px' } },
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'กะ'), h('select', { className: 'fi', id: 'es', innerHTML: '<option value="day"' + (emp.default_shift === 'day' ? ' selected' : '') + '>☀️ กลางวัน</option><option value="evening"' + (emp.default_shift === 'evening' ? ' selected' : '') + '>🌙 กลางคืน</option>' })),
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'เริ่มงาน'), h('input', { type: 'text', className: 'fi', id: 'ess', value: emp.shift_start || '09:00', placeholder: 'HH:MM', pattern: '[0-2][0-9]:[0-5][0-9]', maxLength: 5 })),
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'เลิกงาน'), h('input', { type: 'text', className: 'fi', id: 'ese', value: emp.shift_end || '17:00', placeholder: 'HH:MM', pattern: '[0-2][0-9]:[0-5][0-9]', maxLength: 5 })),
  ));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'โควต้าวันลา/ปี'), h('input', { type: 'number', className: 'fi', id: 'emx', value: emp.max_leave_per_year || 20 })));
  const curOff = offD(emp);
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'วันหยุดประจำ'),
    h('div', { className: 'pg', id: 'ed' }, ...DAYF.map((d, i) => {
      const on = curOff.includes(i);
      return h('button', { className: 'pl' + (on ? ' on' : ''), id: 'ed-' + i, 'data-day': i,
        style: on ? { borderColor: '#10b981', background: '#d1fae5', color: '#10b981' } : {},
        onClick: e => { e.target.classList.toggle('on'); e.target.style.borderColor = e.target.classList.contains('on') ? '#10b981' : 'transparent'; e.target.style.background = e.target.classList.contains('on') ? '#d1fae5' : '#f8fafc'; e.target.style.color = e.target.classList.contains('on') ? '#10b981' : '#64748b'; } }, d);
    }))));
  // Show in calendar toggle
  const showCal = emp.show_in_calendar !== 0;
  m.appendChild(h('div', { className: 'fg', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: showCal ? '#f0fdf4' : '#fef2f2', borderRadius: '10px', border: '1px solid ' + (showCal ? '#86efac' : '#fca5a5'), cursor: 'pointer', transition: 'all .2s' }, id: 'sic-wrap', onClick: () => {
    const el = document.getElementById('sic-wrap');
    const inp = document.getElementById('sic');
    inp.value = inp.value === '1' ? '0' : '1';
    const on = inp.value === '1';
    el.style.background = on ? '#f0fdf4' : '#fef2f2';
    el.style.borderColor = on ? '#86efac' : '#fca5a5';
    el.querySelector('.sic-label').textContent = on ? '✅ แสดงในปฏิทิน' : '❌ ซ่อนจากปฏิทิน (บัญชีทดสอบ)';
    el.querySelector('.sic-dot').style.background = on ? '#16a34a' : '#dc2626';
  } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
      h('div', { className: 'sic-dot', style: { width: '10px', height: '10px', borderRadius: '50%', background: showCal ? '#16a34a' : '#dc2626' } }),
      h('span', { className: 'sic-label', style: { fontWeight: 600, fontSize: '13px', color: '#1e293b' } }, showCal ? '✅ แสดงในปฏิทิน' : '❌ ซ่อนจากปฏิทิน (บัญชีทดสอบ)')),
    h('input', { type: 'hidden', id: 'sic', value: showCal ? '1' : '0' })));
  m.appendChild(h('button', { className: 'btn', id: 'save-btn', style: { background: '#3b82f6' }, onClick: async (ev) => {
    const btn = ev.target; btn.disabled = true; btn.textContent = 'กำลังบันทึก...';
    const offArr = []; document.querySelectorAll('#ed .pl.on').forEach(el => offArr.push(el.dataset.day));
    try {
      await api('/api/employees/' + emp.id, 'PUT', {
        name: document.getElementById('en').value.trim(), nickname: document.getElementById('enn').value.trim(),
        email: document.getElementById('ee').value.trim() || null, default_shift: document.getElementById('es').value,
        shift_start: document.getElementById('ess').value, shift_end: document.getElementById('ese').value,
        max_leave_per_year: parseInt(document.getElementById('emx').value) || 20,
        default_off_day: offArr.join(',') || '6',
        show_in_calendar: parseInt(document.getElementById('sic').value),
      });
      btn.textContent = '✅ บันทึกแล้ว!'; btn.style.background = '#10b981';
      const ok = document.getElementById('save-ok'); if (ok) ok.classList.add('show');
      toast('✅ แก้ไขสำเร็จ');
      // Reload data in background without closing modal
      const ms = D.y + '-' + String(D.m + 1).padStart(2, '0');
      const o = await api('/api/overview?month=' + ms);
      D.emp = o.data.employees; D.yl = o.data.yearlyLeaves || {};
      setTimeout(() => { btn.textContent = 'บันทึก'; btn.style.background = '#3b82f6'; btn.disabled = false; const ok2 = document.getElementById('save-ok'); if (ok2) ok2.classList.remove('show'); }, 1500);
    } catch (er) { toast(er.message, true); btn.textContent = 'บันทึก'; btn.style.background = '#3b82f6'; btn.disabled = false; }
  } }, 'บันทึก'));
  m.appendChild(h('button', { className: 'btn', style: { background: '#ef4444', marginTop: '8px' }, onClick: async () => {
    if (!confirm('ลบ ' + dn(emp) + ' ?')) return;
    try { await api('/api/employees/' + emp.id, 'DELETE'); toast('ลบสำเร็จ'); D.modal = 'employee'; load(); } catch (er) { toast(er.message, true); }
  } }, '🗑️ ลบพนักงาน'));
  o.appendChild(m); return o;
}

// === PROFILE MODAL ===
function rPrf() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '👤 โปรไฟล์'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  const me = D.emp.find(e => e.id === U.id) || U;
  m.appendChild(h('div', { style: { textAlign: 'center', marginBottom: '20px' } }, me.profile_image ? h('img', { src: me.profile_image, className: 'pil' }) : h('div', { className: 'pel' }, me.avatar), h('div', { style: { fontSize: '12px', color: '#94a3b8', marginTop: '6px' } }, me.email)));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'ชื่อที่แสดง'), h('input', { type: 'text', className: 'fi', id: 'pn', value: me.nickname || me.name || '' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'ไอคอน'), h('input', { type: 'text', className: 'fi', id: 'pa', value: me.avatar || '👤', style: { fontSize: '24px' } })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เบอร์โทร'), h('input', { type: 'tel', className: 'fi', id: 'pp', value: me.phone || '' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'LINE ID'), h('input', { type: 'text', className: 'fi', id: 'pli', value: me.line_id || '' })));

  // Birthday — write-once
  const hasBirthday = !!me.birthday;
  const bdGroup = h('div', { className: 'fg' });
  bdGroup.appendChild(h('label', { className: 'fl' }, '🎂 วันเกิด' + (hasBirthday ? ' (ล็อคแล้ว)' : ' (ใส่ครั้งเดียว)')));
  if (hasBirthday) {
    const [by, bm, bd] = me.birthday.split('-');
    bdGroup.appendChild(h('div', { style: { padding: '10px 14px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', {}, '🔒'),
      h('span', {}, (+bd) + '/' + (+bm) + '/' + (+by + 543))));
  } else {
    bdGroup.appendChild(h('input', { type: 'date', className: 'fi', id: 'pbd', max: new Date().toISOString().split('T')[0] }));
    bdGroup.appendChild(h('div', { style: { fontSize: '10px', color: '#f59e0b', marginTop: '4px' } }, '⚠️ ใส่แล้วจะแก้ไขไม่ได้อีก — กรุณาตรวจสอบให้ถูกต้อง'));
  }
  m.appendChild(bdGroup);

  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => {
    const payload = { nickname: document.getElementById('pn').value.trim(), avatar: document.getElementById('pa').value.trim() || '👤', phone: document.getElementById('pp').value.trim() || null, line_id: document.getElementById('pli').value.trim() || null };
    // Birthday
    const bdInput = document.getElementById('pbd');
    if (bdInput && bdInput.value) {
      if (!confirm('⚠️ ยืนยันวันเกิด: ' + bdInput.value + ' — ใส่แล้วจะแก้ไขไม่ได้อีก!')) return;
      payload.birthday = bdInput.value;
    }
    try {
      await api('/api/me', 'PUT', payload);
      toast('✅ อัพเดทสำเร็จ'); U.nickname = payload.nickname; U.avatar = payload.avatar; closeModal(); load();
    } catch (er) { toast(er.message, true); }
  } }, 'บันทึก'));
  o.appendChild(m); return o;
}

// === SETTINGS MODAL ===
function rSet() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '⚙️ ตั้งค่า'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'ชื่อบริษัท'), h('input', { type: 'text', className: 'fi', id: 'sc', value: D.set.company_name || '' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'วันหยุดบริษัท/ปี'), h('input', { type: 'number', className: 'fi', id: 'shv', value: D.set.company_holidays_per_year || '20' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'วัน Blackout (ไม่แสดงข้อมูล, คั่นด้วย ,)'), h('input', { type: 'text', className: 'fi', id: 'sbd', value: D.set.blackout_dates || '', placeholder: '2026-01-01,2026-01-02' })));
  // Role management button (owner only)
  if (isOwner) {
    m.appendChild(h('div', { style: { background: '#eff6ff', borderRadius: '10px', padding: '14px', marginBottom: '16px', border: '1px solid #93c5fd' } },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
        h('div', {},
          h('div', { style: { fontSize: '13px', fontWeight: 700, color: '#1e40af' } }, '🔐 จัดการสิทธิ์'),
          h('div', { style: { fontSize: '11px', color: '#3b82f6', marginTop: '2px' } }, 'กำหนด role: เจ้าของ, แอดมิน, ผู้อนุมัติ, พนักงาน, ทดสอบ')),
        h('button', { style: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: () => { closeModal(); setTimeout(() => openModal('roleMgr'), 250); } }, '🔐 จัดการสิทธิ์'))));
  }
  m.appendChild(h('div', { style: { background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px' } },
    h('div', { style: { fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' } }, '📊 สรุป'),
    h('div', { style: { fontSize: '14px', marginBottom: '8px' } }, 'วันหยุดนักขัตฤกษ์เดือนนี้: ' + Object.keys(D.hol).length + ' วัน'),
    h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
      h('button', { style: { background: '#0088cc', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => { try { await api('/api/telegram/monthly-summary?month=' + D.y + '-' + String(D.m+1).padStart(2,'0'), 'POST'); toast('📨 ส่งสรุปเดือน Telegram แล้ว'); } catch (e) { toast(e.message, true); } } }, '📨 ส่งสรุปเดือน Telegram'),
      h('button', { style: { background: '#6366f1', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
        try {
          const r = await api('/api/activity-log?limit=50');
          const popup = h('div', { style: { position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(4px)' }, onClick: (ev) => { if (ev.target === popup) document.body.removeChild(popup); } });
          const box = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '24px', minWidth: '400px', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,.15)' } });
          box.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
            h('div', { style: { fontWeight: 700, fontSize: '16px' } }, '📋 Activity Log'),
            h('button', { style: { border: 'none', background: '#f1f5f9', width: '28px', height: '28px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }, onClick: () => document.body.removeChild(popup) }, '✕')));
          const logs = r.data || [];
          if (!logs.length) box.appendChild(h('p', { style: { color: '#94a3b8' } }, 'ยังไม่มีบันทึก'));
          logs.forEach(l => {
            const d = new Date(l.created_at + 'Z');
            const ts = d.toLocaleDateString('th-TH') + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
            box.appendChild(h('div', { style: { padding: '8px 12px', borderLeft: '3px solid #6366f1', marginBottom: '4px', background: '#f8fafc', borderRadius: '0 8px 8px 0', fontSize: '13px' } },
              h('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                h('span', { style: { fontWeight: 600 } }, (l.avatar||'👤') + ' ' + (l.nickname || l.name)),
                h('span', { style: { color: '#94a3b8', fontSize: '11px' } }, ts)),
              h('div', { style: { color: '#64748b', marginTop: '2px' } }, l.action + (l.detail ? ' — ' + l.detail : ''))));
          });
          popup.appendChild(box);
          document.body.appendChild(popup);
        } catch (e) { toast(e.message, true); }
      } }, '📋 Activity Log'),
      h('button', { style: { background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: () => { closeModal(); setTimeout(() => openModal('achievements'), 250); } }, '🏆 จัดการ Achievement'))));
  // Test data section
  const testSec = h('div', { style: { background: '#fef2f2', borderRadius: '10px', padding: '14px', marginBottom: '16px', border: '1px dashed #fca5a5' } });
  testSec.appendChild(h('div', { style: { fontSize: '13px', fontWeight: 700, color: '#dc2626', marginBottom: '8px' } }, '🧪 ข้อมูลทดสอบ'));
  testSec.appendChild(h('div', { style: { fontSize: '11px', color: '#94a3b8', marginBottom: '10px' } }, 'สร้างพนักงานจำลอง + ข้อมูลลา/KPI สุ่ม (ซ่อนจากปฏิทิน)'));
  testSec.appendChild(h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } },
    h('button', { style: { background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
      if (!confirm('สร้างพนักงานจำลอง 4 คน + ข้อมูลสุ่ม?')) return;
      try {
        toast('⏳ กำลังสร้าง...');
        await api('/api/test-data/generate', 'POST');
        toast('🧪 สร้างข้อมูลทดสอบสำเร็จ!');
        closeModal(); load();
      } catch (er) { toast(er.message, true); }
    } }, '🧪 สร้างข้อมูลทดสอบ'),
    h('button', { style: { background: '#dc2626', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
      if (!confirm('⚠️ ลบข้อมูลทดสอบทั้งหมด? (เฉพาะพนักงานจำลอง)')) return;
      try {
        await api('/api/test-data/cleanup', 'DELETE');
        toast('🗑️ ลบข้อมูลทดสอบแล้ว');
        closeModal(); load();
      } catch (er) { toast(er.message, true); }
    } }, '🗑️ ลบข้อมูลทดสอบ')));
  m.appendChild(testSec);
  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => { try { await api('/api/settings', 'PUT', { company_name: document.getElementById('sc').value, company_holidays_per_year: document.getElementById('shv').value, blackout_dates: document.getElementById('sbd').value.trim() }); toast('✅ บันทึกสำเร็จ'); closeModal(); load(); } catch (er) { toast(er.message, true); } } }, 'บันทึก'));
  o.appendChild(m); return o;
}

// === ROLE MANAGER MODAL 🔐 ===
function rRoleMgr() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', style: { maxWidth: '640px' }, onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '🔐 จัดการสิทธิ์'), h('button', { className: 'mc', onClick: closeModal }, '✕')));

  // Permission table
  const permTable = h('div', { style: { background: '#f8fafc', borderRadius: '12px', padding: '14px', marginBottom: '16px', fontSize: '11px' } });
  permTable.appendChild(h('div', { style: { fontWeight: 700, marginBottom: '8px', color: '#475569' } }, '📋 ตารางสิทธิ์'));
  const perms = [
    ['', '👑 เจ้าของ', '🛡️ แอดมิน', '👮 ผู้อนุมัติ', '👤 พนักงาน', '🧪 ทดสอบ'],
    ['จัดการสิทธิ์', '✅', '❌', '❌', '❌', '❌'],
    ['ตั้งค่าระบบ', '✅', '✅', '❌', '❌', '❌'],
    ['จัดการพนักงาน', '✅', '✅', '❌', '❌', '❌'],
    ['อนุมัติลา/สลับ', '✅', '✅', '✅', '❌', '❌'],
    ['ดูข้อมูลทุกคน', '✅', '✅', '✅', '❌', '❌'],
    ['ลา/สลับกะ', '✅', '✅', '✅', '✅', '✅'],
    ['แสดงในปฏิทิน', '✅', '✅', '✅', '✅', '❌'],
    ['บันทึก Log', '✅', '✅', '✅', '✅', '❌'],
  ];
  const tbl = h('div', { style: { display: 'grid', gridTemplateColumns: 'auto repeat(5, 1fr)', gap: '1px', background: '#e2e8f0', borderRadius: '8px', overflow: 'hidden' } });
  perms.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const isHeader = ri === 0 || ci === 0;
      tbl.appendChild(h('div', { style: { padding: '4px 6px', background: isHeader ? '#e2e8f0' : '#fff', fontWeight: isHeader ? 700 : 400, textAlign: ci > 0 ? 'center' : 'left', fontSize: '10px' } }, cell));
    });
  });
  permTable.appendChild(tbl);
  m.appendChild(permTable);

  // Employee list with role selector
  const list = h('div', { id: 'role-list' });
  list.appendChild(h('div', { style: { textAlign: 'center', padding: '20px', color: '#94a3b8' } }, '⏳ กำลังโหลด...'));
  m.appendChild(list);

  // Load roles
  api('/api/roles').then(r => {
    list.innerHTML = '';
    const roleColors = { owner: '#fbbf24', admin: '#3b82f6', approver: '#8b5cf6', employee: '#10b981', tester: '#94a3b8' };
    (r.data || []).forEach(emp => {
      const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#fff', borderRadius: '10px', marginBottom: '6px', border: '1px solid #e2e8f0' } });
      // Avatar
      row.appendChild(emp.profile_image ? h('img', { src: emp.profile_image, style: { width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' } }) : h('div', { style: { fontSize: '22px' } }, emp.avatar || '👤'));
      // Name + email
      row.appendChild(h('div', { style: { flex: 1, minWidth: 0 } },
        h('div', { style: { fontWeight: 600, fontSize: '13px' } }, emp.nickname || emp.name),
        h('div', { style: { fontSize: '10px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, emp.email || '—')));
      // Role badge
      const roleBadge = h('div', { style: { padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: roleColors[emp.role] + '20', color: roleColors[emp.role], border: '1px solid ' + roleColors[emp.role] + '40', minWidth: '80px', textAlign: 'center' } }, ROLE_LABELS[emp.role] || emp.role);
      row.appendChild(roleBadge);
      // Role selector (only for owner)
      if (isOwner && emp.id !== U.id) {
        const sel = h('select', { style: { fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: 600 }, onChange: async (e) => {
          const newRole = e.target.value;
          if (!confirm('เปลี่ยน ' + (emp.nickname || emp.name) + ' เป็น ' + ROLE_LABELS[newRole] + '?')) { e.target.value = emp.role; return; }
          try {
            await api('/api/roles/' + emp.id, 'PUT', { role: newRole });
            toast('✅ เปลี่ยนสิทธิ์สำเร็จ');
            roleBadge.textContent = ROLE_LABELS[newRole];
            roleBadge.style.background = roleColors[newRole] + '20';
            roleBadge.style.color = roleColors[newRole];
            roleBadge.style.borderColor = roleColors[newRole] + '40';
            emp.role = newRole;
          } catch (er) { toast(er.message, true); e.target.value = emp.role; }
        } });
        ['owner', 'admin', 'approver', 'employee', 'tester'].forEach(r => {
          const opt = h('option', { value: r }, ROLE_LABELS[r]);
          if (emp.role === r) opt.selected = true;
          sel.appendChild(opt);
        });
        row.appendChild(sel);
      } else if (emp.id === U.id) {
        row.appendChild(h('div', { style: { fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' } }, '(คุณ)'));
      }
      list.appendChild(row);
    });
  }).catch(er => { list.innerHTML = ''; list.appendChild(h('div', { style: { color: '#dc2626' } }, 'Error: ' + er.message)); });

  o.appendChild(m); return o;
}

// === ACHIEVEMENT MANAGER MODAL ===
function rAchMgr() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', style: { maxWidth: '640px' }, onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '🏆 จัดการ Achievement'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  m.appendChild(h('div', { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '16px' } }, 'แก้ไขชื่อ ไอคอน คะแนน ระดับ หรือเปิด/ปิดแต่ละ badge'));

  const list = h('div', { id: 'ach-list' });
  const achs = JSON.parse(JSON.stringify(getAchievements())); // deep clone

  function renderList() {
    list.innerHTML = '';
    achs.forEach((a, idx) => {
      const tc = TIER_COLORS[a.tier];
      const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', marginBottom: '6px', background: a.enabled === false ? '#f8fafc' : tc.bg, borderRadius: '10px', border: '1px solid ' + (a.enabled === false ? '#e2e8f0' : tc.border), opacity: a.enabled === false ? 0.5 : 1, transition: 'all .2s' } });
      // Icon
      row.appendChild(h('input', { type: 'text', value: a.icon, style: { width: '36px', fontSize: '20px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px' }, onChange: (e) => { achs[idx].icon = e.target.value; } }));
      // Name + desc
      const info = h('div', { style: { flex: 1, minWidth: 0 } });
      info.appendChild(h('input', { type: 'text', value: a.name, style: { width: '100%', fontWeight: 700, fontSize: '13px', border: 'none', background: 'transparent', padding: '2px 0' }, onChange: (e) => { achs[idx].name = e.target.value; } }));
      info.appendChild(h('input', { type: 'text', value: a.desc, style: { width: '100%', fontSize: '11px', color: '#64748b', border: 'none', background: 'transparent', padding: '2px 0' }, onChange: (e) => { achs[idx].desc = e.target.value; } }));
      row.appendChild(info);
      // Tier
      const tierSel = h('select', { style: { fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: 700 }, onChange: (e) => { achs[idx].tier = +e.target.value; renderList(); } });
      [1,2,3].forEach(t => { const opt = h('option', { value: String(t) }, TIER_NAMES[t] + ' ' + TIER_COLORS[t].label); if (a.tier === t) opt.selected = true; tierSel.appendChild(opt); });
      row.appendChild(tierSel);
      // Points
      row.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '2px' } },
        h('input', { type: 'number', value: String(a.points), style: { width: '44px', fontSize: '12px', textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px', fontWeight: 700 }, onChange: (e) => { achs[idx].points = +e.target.value; } }),
        h('span', { style: { fontSize: '10px', color: '#94a3b8' } }, 'pt')));
      // Toggle
      const toggleBtn = h('button', { style: { width: '32px', height: '32px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer', background: a.enabled === false ? '#fee2e2' : '#dcfce7' }, onClick: () => { achs[idx].enabled = achs[idx].enabled === false ? true : false; renderList(); } }, a.enabled === false ? '❌' : '✅');
      row.appendChild(toggleBtn);
      list.appendChild(row);
    });
  }
  renderList();
  m.appendChild(list);

  // Save button
  m.appendChild(h('button', { className: 'btn', style: { background: '#f59e0b', marginTop: '16px' }, onClick: async () => {
    try {
      await api('/api/settings', 'PUT', { achievements: JSON.stringify(achs) });
      D.achievements = achs;
      toast('🏆 บันทึก Achievement สำเร็จ');
      closeModal();
      render();
    } catch (er) { toast(er.message, true); }
  } }, '💾 บันทึก Achievement'));

  // Reset button
  m.appendChild(h('button', { className: 'btn', style: { background: '#64748b', marginTop: '8px' }, onClick: () => {
    if (!confirm('รีเซ็ตเป็นค่าเริ่มต้น?')) return;
    achs.length = 0;
    DEFAULT_ACHIEVEMENTS.forEach(a => achs.push(JSON.parse(JSON.stringify(a))));
    renderList();
  } }, '🔄 รีเซ็ตค่าเริ่มต้น'));

  o.appendChild(m); return o;
}

// === WALLET PAGE 💰 ===
function rWallet() {
  const w = h('div', {});

  // Load wallet data + kpiYear (จำเป็นสำหรับ compute achievements)
  if (!D.walletLoaded) {
    D.walletLoaded = true;
    const kpiPromise = D.kpiYearLoaded ? Promise.resolve({ data: D.kpiYear }) : api('/api/kpi/errors?year=' + D.y);
    Promise.all([
      api('/api/wallet/balance'),
      api('/api/wallet/transactions'),
      api('/api/achievements/claims'),
      api('/api/rewards'),
      isO ? api('/api/rewards/redemptions') : api('/api/rewards/redemptions?employee_id=' + U.id),
      kpiPromise,
    ]).then(([bal, txn, claims, rewards, redemptions, kpi]) => {
      D.walletBal = bal.data.balance || 0;
      D.walletTxn = txn.data || [];
      D.achClaims = claims.data || [];
      D.rewardsList = rewards.data || [];
      D.redemptions = redemptions.data || [];
      if (!D.kpiYearLoaded) { D.kpiYear = kpi.data || []; D.kpiYearLoaded = true; }
      render();
    }).catch(() => {});
    // Show loading
    w.appendChild(h('div', { style: { textAlign: 'center', padding: '60px', color: '#94a3b8' } }, '⏳ กำลังโหลด...'));
    return w;
  }

  const me = D.emp.find(e => e.id === U.id) || U;
  const allClaimed = new Set((D.achClaims || []).map(c => c.achievement_id + '|' + c.month));
  const rate = parseInt(D.set.point_rate) || 1;

  // === BALANCE CARD ===
  const balCard = h('div', { style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)', borderRadius: '20px', padding: '28px', color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: '20px' } });
  // Decorative circles
  balCard.appendChild(h('div', { style: { position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)', borderRadius: '50%' } }));
  balCard.appendChild(h('div', { style: { position: 'absolute', bottom: '-20px', left: '20%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%' } }));
  // User info
  balCard.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', position: 'relative', zIndex: 1 } },
    me.profile_image ? h('img', { src: me.profile_image, style: { width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' } }) : h('div', { style: { fontSize: '36px' } }, me.avatar),
    h('div', {},
      h('div', { style: { fontSize: '14px', fontWeight: 700 } }, '💰 กระเป๋าของ ' + dn(me)),
      h('div', { style: { fontSize: '11px', opacity: 0.5 } }, '1 แต้ม = ' + rate + ' บาท'))));
  // Balance
  const balNum = h('div', { style: { fontSize: '48px', fontWeight: 900, letterSpacing: '-1px', position: 'relative', zIndex: 1, marginBottom: '4px' } }, '0');
  balCard.appendChild(balNum);
  balCard.appendChild(h('div', { style: { display: 'flex', gap: '16px', fontSize: '12px', opacity: 0.5, position: 'relative', zIndex: 1 } },
    h('span', {}, '💎 แต้มคงเหลือ'),
    h('span', {}, '= ' + ((D.walletBal || 0) * rate).toLocaleString() + ' บาท')));
  // Animate balance
  setTimeout(() => {
    const target = D.walletBal || 0; let cur = 0;
    const step = () => { cur += Math.ceil(target / 20); if (cur >= target) { balNum.textContent = target.toLocaleString(); return; } balNum.textContent = cur.toLocaleString(); requestAnimationFrame(step); };
    if (target > 0) requestAnimationFrame(step); else balNum.textContent = '0';
  }, 200);
  w.appendChild(balCard);

  // === UNCLAIMED BADGES ===
  // Compute achievements for current user
  const allEmps = ce();
  const empStatMe = [];
  allEmps.forEach(emp => {
    const sc = { day: 0, evening: 0, off: 0 };
    const dm = gdim(D.y, D.m);
    for (let d = 1; d <= dm; d++) { const k = dk(D.y, D.m, d); if (isBlackout(k)) continue; const inf = disp(emp, k, D.y, D.m, d); if (!inf.isL || inf.isPending) sc[inf.ty || emp.default_shift] = (sc[inf.ty || emp.default_shift] || 0) + 1; }
    empStatMe.push({ emp, sc, yl: D.yl[emp.id] || {} });
  });
  const achData = computeAchievements(empStatMe);
  const myData = achData[U.id] || { badges: [], badgeDetails: [], totalPoints: 0 };
  const myBadges = myData.badges;
  const myDetails = myData.badgeDetails || [];

  // หา badge ที่ยังไม่เคลม — ใช้ badgeDetails (badge+month) เทียบกับ claims
  // + 30 วันหลังจบเดือน ถ้าไม่เคลมจะหายไป
  const unclaimed = [];
  const now2 = new Date();
  // Badge รายเดือน (มี month ใน badgeDetails)
  myDetails.forEach(d => {
    const claimMonth = D.y + '-' + d.month;
    const key = d.id + '|' + claimMonth;
    if (allClaimed.has(key)) return;
    // เช็ค 30 วันหลังจบเดือน
    const [cy, cm] = claimMonth.split('-').map(Number);
    const monthEnd = new Date(cy, cm, 0); // วันสุดท้ายของเดือน
    const expiry = new Date(monthEnd); expiry.setDate(expiry.getDate() + 30);
    if (now2 > expiry) return; // หมดอายุแล้ว
    const daysLeft = Math.ceil((expiry - now2) / (1000 * 60 * 60 * 24));
    unclaimed.push({ id: d.id, month: claimMonth, daysLeft });
  });
  // Badge ครั้งเดียว (ไม่มีใน badgeDetails — เช่น diamond, streak, birthday, mvp)
  const detailIds = new Set(myDetails.map(d => d.id));
  myBadges.filter(id => !detailIds.has(id)).forEach(id => {
    const claimMonth = D.y + '-00';
    if (!allClaimed.has(id + '|' + claimMonth)) unclaimed.push({ id, month: claimMonth, daysLeft: null });
  });

  if (unclaimed.length > 0) {
    const claimSection = h('div', { style: { background: 'linear-gradient(135deg, #fefce8, #fffbeb)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #fde047' } });
    claimSection.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' } },
      h('span', { style: { fontSize: '20px' } }, '🎉'),
      h('div', {},
        h('div', { style: { fontWeight: 700, fontSize: '15px', color: '#92400e' } }, 'Badge รอเคลม! (' + unclaimed.length + ')'),
        h('div', { style: { fontSize: '11px', color: '#a16207' } }, 'กดเคลมเพื่อรับแต้มเข้ากระเป๋า'))));
    claimSection.appendChild(h('div', { style: { fontSize: '10px', color: '#dc2626', marginBottom: '14px', fontWeight: 600 } }, '⏰ มีเวลาเคลม 30 วันหลังจบเดือน ไม่เคลมจะหายไป!'));

    // Group by month
    const monthGroups = {};
    unclaimed.forEach(u => {
      const mk = u.month;
      if (!monthGroups[mk]) monthGroups[mk] = [];
      monthGroups[mk].push(u);
    });

    Object.keys(monthGroups).sort().forEach(mk => {
      const items = monthGroups[mk];
      const monthName = mk.endsWith('-00') ? '🏆 Badge พิเศษ (ทั้งปี)' : '📅 เดือน ' + mk.split('-')[1] + '/' + mk.split('-')[0];
      const daysLeft = items[0].daysLeft;
      const daysColor = daysLeft !== null && daysLeft <= 7 ? '#dc2626' : daysLeft !== null && daysLeft <= 14 ? '#f59e0b' : '#64748b';

      const groupHdr = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginTop: '12px' } });
      groupHdr.appendChild(h('div', { style: { fontWeight: 700, fontSize: '13px', color: '#78350f' } }, monthName));
      if (daysLeft !== null) groupHdr.appendChild(h('div', { style: { fontSize: '11px', color: daysColor, fontWeight: 600 } }, '⏰ เหลือ ' + daysLeft + ' วัน'));
      claimSection.appendChild(groupHdr);

      const grid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' } });
      items.forEach(({ id: badgeId, month: claimMonth, daysLeft: dl }) => {
        const ach = getAchievements().find(a => a.id === badgeId);
        if (!ach) return;
        const tc = TIER_COLORS[ach.tier];
        const isUrgent = dl !== null && dl <= 7;
        const card = h('div', { style: { background: isUrgent ? '#fef2f2' : '#fff', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '2px solid ' + (isUrgent ? '#fca5a5' : tc.border), cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden' } });
        card.appendChild(h('div', { style: { fontSize: '32px', marginBottom: '6px' } }, ach.icon));
        card.appendChild(h('div', { style: { fontWeight: 700, fontSize: '13px', color: '#1e293b', marginBottom: '2px' } }, ach.name));
        card.appendChild(h('div', { style: { fontSize: '10px', color: '#64748b', marginBottom: '4px' } }, ach.desc));
        card.appendChild(h('div', { style: { fontSize: '16px', fontWeight: 800, color: tc.text, marginBottom: '8px' } }, '+' + ach.points + ' แต้ม'));
        const claimBtn = h('button', { style: { width: '100%', padding: '8px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, ' + tc.border + ', ' + tc.text + ')', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer', transition: 'all .15s' }, onClick: async (e) => {
          e.stopPropagation();
          claimBtn.disabled = true; claimBtn.textContent = '⏳...';
          try {
            await api('/api/achievements/claim', 'POST', { achievement_id: badgeId, month: claimMonth, points: ach.points, badge_name: ach.icon + ' ' + ach.name });
            showConfetti(card);
            claimBtn.textContent = '✅ เคลมแล้ว!';
            claimBtn.style.background = '#10b981';
            D.walletBal = (D.walletBal || 0) + ach.points;
            D.achClaims = [...(D.achClaims || []), { achievement_id: badgeId, month: claimMonth }];
            balNum.textContent = D.walletBal.toLocaleString();
            setTimeout(() => { card.style.opacity = '0.4'; card.style.transform = 'scale(0.95)'; }, 1500);
          } catch (er) { toast(er.message, true); claimBtn.textContent = '🎁 เคลม'; claimBtn.disabled = false; }
        } }, '🎁 เคลม');
        card.appendChild(claimBtn);
        card.onmouseenter = () => { card.style.transform = 'translateY(-3px)'; card.style.boxShadow = '0 6px 20px ' + tc.border + '40'; };
        card.onmouseleave = () => { card.style.transform = 'translateY(0)'; card.style.boxShadow = 'none'; };
        grid.appendChild(card);
      });
      claimSection.appendChild(grid);
    });
    w.appendChild(claimSection);
  }

  // Already claimed — collapsible summary
  const claimedList = (D.achClaims || []).filter(c => c.employee_id === U.id || !c.employee_id);
  if (claimedList.length > 0) {
    const totalClaimedPts = claimedList.reduce((s, c) => s + (c.points || 0), 0);
    const claimedSec = h('div', { style: { background: '#f8fafc', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' } });
    let expanded = false;
    const hdr = h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' } });
    hdr.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', { style: { fontSize: '14px' } }, '✅'),
      h('span', { style: { fontWeight: 700, fontSize: '13px', color: '#64748b' } }, 'เคลมแล้ว ' + claimedList.length + ' badge'),
      h('span', { style: { fontSize: '12px', color: '#16a34a', fontWeight: 700 } }, '+' + totalClaimedPts + ' แต้ม')));
    const arrow = h('span', { style: { fontSize: '12px', color: '#94a3b8', transition: 'transform .2s' } }, '▼');
    hdr.appendChild(arrow);
    const detail = h('div', { style: { display: 'none', marginTop: '12px' } });
    const pills = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
    claimedList.forEach(c => {
      const a = getAchievements().find(x => x.id === c.achievement_id);
      if (!a) return;
      const ml = c.month && !c.month.endsWith('-00') ? ' (' + c.month.split('-')[1] + ')' : '';
      pills.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', background: '#e2e8f0', color: '#475569', fontWeight: 600 } }, h('span', {}, a.icon), h('span', {}, a.name + ml), h('span', { style: { color: '#94a3b8' } }, '+' + (c.points || a.points))));
    });
    detail.appendChild(pills);
    hdr.onclick = () => { expanded = !expanded; detail.style.display = expanded ? 'block' : 'none'; arrow.style.transform = expanded ? 'rotate(180deg)' : ''; };
    claimedSec.appendChild(hdr);
    claimedSec.appendChild(detail);
    w.appendChild(claimedSec);
  }

  // === REWARDS SHOP ===
  const shopSection = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #e2e8f0' } });
  shopSection.appendChild(h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' } },
    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', { style: { fontSize: '20px' } }, '🎁'),
      h('div', { style: { fontWeight: 700, fontSize: '15px' } }, 'แลกรางวัล')),
    isO ? h('button', { style: { background: '#6366f1', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }, onClick: () => openModal('rewardMgr') }, '⚙️ จัดการรางวัล') : ''));

  if (!(D.rewardsList || []).length) {
    shopSection.appendChild(h('div', { style: { textAlign: 'center', padding: '30px', color: '#94a3b8' } }, isO ? 'ยังไม่มีรางวัล — กด "จัดการรางวัล" เพื่อเพิ่ม' : 'ยังไม่มีรางวัล'));
  } else {
    const rGrid = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' } });
    (D.rewardsList || []).forEach(reward => {
      const canAfford = (D.walletBal || 0) >= reward.cost;
      const rCard = h('div', { style: { borderRadius: '14px', padding: '16px', textAlign: 'center', border: canAfford ? '2px solid #86efac' : '1px solid #e2e8f0', background: canAfford ? '#f0fdf4' : '#fafafa', transition: 'all .2s', opacity: canAfford ? 1 : 0.6 } });
      rCard.appendChild(h('div', { style: { fontSize: '36px', marginBottom: '6px' } }, reward.icon));
      rCard.appendChild(h('div', { style: { fontWeight: 700, fontSize: '13px', marginBottom: '4px' } }, reward.name));
      rCard.appendChild(h('div', { style: { fontSize: '14px', fontWeight: 800, color: canAfford ? '#16a34a' : '#dc2626', marginBottom: '8px' } }, reward.cost + ' แต้ม'));
      if (reward.type === 'cash') rCard.appendChild(h('div', { style: { fontSize: '10px', color: '#64748b', marginBottom: '6px' } }, '= ' + (reward.cost * rate) + ' บาท'));
      const todayDay = new Date().getDay(); // 0=อาทิตย์, 6=เสาร์
      const isWeekend = todayDay === 0 || todayDay === 6;
      const canRedeem = canAfford && isWeekend;
      const redeemBtn = h('button', { style: { width: '100%', padding: '7px', borderRadius: '8px', border: 'none', background: canRedeem ? '#16a34a' : '#cbd5e1', color: '#fff', fontWeight: 700, fontSize: '11px', cursor: canRedeem ? 'pointer' : 'not-allowed' }, onClick: canRedeem ? async () => {
        if (!confirm('แลก ' + reward.icon + ' ' + reward.name + ' (' + reward.cost + ' แต้ม)?')) return;
        try {
          await api('/api/rewards/redeem', 'POST', { reward_id: reward.id });
          toast('🎁 แลกรางวัลสำเร็จ!');
          D.walletLoaded = false; render();
        } catch (er) { toast(er.message, true); }
      } : null }, canRedeem ? '🛒 แลกเลย' : !isWeekend ? '📅 แลกได้เฉพาะ ส.-อา.' : '🔒 แต้มไม่พอ');
      rCard.appendChild(redeemBtn);
      rGrid.appendChild(rCard);
    });
    shopSection.appendChild(rGrid);
  }
  w.appendChild(shopSection);

  // === PENDING REDEMPTIONS (admin) ===
  if (isO) {
    const pendingRd = (D.redemptions || []).filter(r => r.status === 'pending');
    if (pendingRd.length > 0) {
      const pendSec = h('div', { style: { background: '#fffbeb', borderRadius: '14px', padding: '16px', marginBottom: '20px', border: '1px solid #fde047' } });
      pendSec.appendChild(h('div', { style: { fontWeight: 700, fontSize: '14px', color: '#92400e', marginBottom: '10px' } }, '⏳ รอจ่ายรางวัล (' + pendingRd.length + ')'));
      pendingRd.forEach(rd => {
        const row = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', borderRadius: '10px', marginBottom: '6px' } });
        row.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          h('span', { style: { fontSize: '18px' } }, rd.avatar || '👤'),
          h('div', {},
            h('div', { style: { fontWeight: 600, fontSize: '12px' } }, rd.nickname || rd.name),
            h('div', { style: { fontSize: '11px', color: '#64748b' } }, rd.reward_name + ' (' + rd.cost + ' แต้ม)'))));
        row.appendChild(h('div', { style: { display: 'flex', gap: '4px' } },
          h('button', { style: { padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
            await api('/api/rewards/redemptions/' + rd.id + '/approve', 'PUT');
            toast('✅ อนุมัติแล้ว'); D.walletLoaded = false; render();
          } }, '✅ จ่าย'),
          h('button', { style: { padding: '4px 12px', borderRadius: '6px', border: '1px solid #fca5a5', background: '#fff', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
            await api('/api/rewards/redemptions/' + rd.id + '/reject', 'PUT');
            toast('❌ ปฏิเสธ (คืนแต้ม)'); D.walletLoaded = false; render();
          } }, '❌ ปฏิเสธ')));
        pendSec.appendChild(row);
      });
      w.appendChild(pendSec);
    }
  }

  // === TRANSACTION HISTORY ===
  const histSec = h('div', { style: { background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' } });
  histSec.appendChild(h('div', { style: { fontWeight: 700, fontSize: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' } }, h('span', {}, '📜'), h('span', {}, 'ประวัติแต้ม')));
  const txns = D.walletTxn || [];
  if (!txns.length) histSec.appendChild(h('div', { style: { textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' } }, 'ยังไม่มีรายการ'));
  txns.slice(0, 20).forEach(tx => {
    const isEarn = tx.amount > 0;
    const dt = new Date(tx.created_at + 'Z');
    const ts = dt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }) + ' ' + dt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
    histSec.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' } },
      h('div', {},
        h('div', { style: { fontSize: '12px', fontWeight: 600 } }, (isEarn ? '🟢' : '🔴') + ' ' + (tx.description || tx.type)),
        h('div', { style: { fontSize: '10px', color: '#94a3b8' } }, ts)),
      h('div', { style: { fontWeight: 800, fontSize: '14px', color: isEarn ? '#16a34a' : '#dc2626' } }, (isEarn ? '+' : '') + tx.amount)));
  });
  w.appendChild(histSec);

  // Admin: Reset all achievements
  if (isO) {
    const resetBtn = h('button', { style: { marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', border: '2px dashed #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
      if (!confirm('⚠️ ล้างข้อมูล Achievement + Wallet ทั้งหมดของทุกคน? — ลบ claims, transactions, balance ทั้งหมด — ย้อนกลับไม่ได้!')) return;
      if (!confirm('🚨 ยืนยันอีกครั้ง — ข้อมูลจะหายทั้งหมด!')) return;
      resetBtn.disabled = true; resetBtn.textContent = '⏳ กำลังล้าง...';
      try {
        const r = await api('/api/achievements/reset', 'POST');
        toast(r.message);
        D.walletLoaded = false; D.walletBal = 0; D.walletTxn = []; D.achClaims = [];
        render();
      } catch (er) { toast(er.message, true); resetBtn.disabled = false; resetBtn.textContent = '🗑️ ล้างข้อมูล Achievement + Wallet ทั้งหมด'; }
    } }, '🗑️ ล้างข้อมูล Achievement + Wallet ทั้งหมด');
    w.appendChild(resetBtn);
  }

  return w;
}

// Confetti animation helper
function showConfetti(el) {
  const rect = el.getBoundingClientRect();
  const colors = ['#fbbf24','#ef4444','#3b82f6','#10b981','#8b5cf6','#f97316'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    Object.assign(p.style, {
      position: 'fixed', width: '8px', height: '8px', borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      background: colors[Math.floor(Math.random() * colors.length)],
      left: (rect.left + rect.width/2) + 'px', top: (rect.top + rect.height/2) + 'px',
      pointerEvents: 'none', zIndex: '9999', transition: 'all 1s cubic-bezier(.2,.8,.2,1)', opacity: '1',
    });
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.left = (rect.left + rect.width/2 + (Math.random()-0.5) * 200) + 'px';
      p.style.top = (rect.top - Math.random() * 150 - 50) + 'px';
      p.style.opacity = '0'; p.style.transform = 'rotate(' + (Math.random()*360) + 'deg) scale(0)';
    });
    setTimeout(() => p.remove(), 1200);
  }
}

// === REWARD MANAGER MODAL ===
function rRewardMgr() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', style: { maxWidth: '540px' }, onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '🎁 จัดการรางวัล'), h('button', { className: 'mc', onClick: closeModal }, '✕')));

  // Add new reward
  const addForm = h('div', { style: { display: 'grid', gridTemplateColumns: '50px 1fr 80px 80px auto', gap: '6px', marginBottom: '16px', alignItems: 'end' } });
  addForm.appendChild(h('div', {}, h('label', { style: { fontSize: '10px', color: '#94a3b8' } }, 'ไอคอน'), h('input', { type: 'text', id: 'rw-icon', className: 'fi', value: '🎁', style: { fontSize: '20px', textAlign: 'center' } })));
  addForm.appendChild(h('div', {}, h('label', { style: { fontSize: '10px', color: '#94a3b8' } }, 'ชื่อรางวัล'), h('input', { type: 'text', id: 'rw-name', className: 'fi', placeholder: 'เช่น กาแฟ 1 แก้ว' })));
  addForm.appendChild(h('div', {}, h('label', { style: { fontSize: '10px', color: '#94a3b8' } }, 'แต้ม'), h('input', { type: 'number', id: 'rw-cost', className: 'fi', value: '50' })));
  addForm.appendChild(h('div', {}, h('label', { style: { fontSize: '10px', color: '#94a3b8' } }, 'ประเภท'),
    (() => { const sel = h('select', { id: 'rw-type', className: 'fi' }); sel.appendChild(h('option', { value: 'item' }, '🎁 ของ')); sel.appendChild(h('option', { value: 'cash' }, '💸 เงิน')); return sel; })()));
  addForm.appendChild(h('button', { style: { padding: '8px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }, onClick: async () => {
    const name = document.getElementById('rw-name').value.trim();
    if (!name) { toast('กรุณาใส่ชื่อ', true); return; }
    try {
      await api('/api/rewards', 'POST', { name, icon: document.getElementById('rw-icon').value.trim() || '🎁', cost: +document.getElementById('rw-cost').value || 50, type: document.getElementById('rw-type').value });
      toast('✅ เพิ่มรางวัลสำเร็จ');
      D.walletLoaded = false; closeModal(); render();
    } catch (er) { toast(er.message, true); }
  } }, '+ เพิ่ม'));
  m.appendChild(addForm);

  // Existing rewards
  (D.rewardsList || []).forEach(rw => {
    const row = h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#f8fafc', borderRadius: '10px', marginBottom: '6px' } });
    row.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
      h('span', { style: { fontSize: '24px' } }, rw.icon),
      h('div', {},
        h('div', { style: { fontWeight: 600, fontSize: '13px' } }, rw.name),
        h('div', { style: { fontSize: '11px', color: '#64748b' } }, rw.cost + ' แต้ม • ' + (rw.type === 'cash' ? '💸 เงินสด' : '🎁 ของรางวัล')))));
    row.appendChild(h('button', { style: { background: '#fee2e2', border: 'none', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }, onClick: async () => {
      if (!confirm('ลบ ' + rw.name + '?')) return;
      await api('/api/rewards/' + rw.id, 'DELETE');
      toast('ลบแล้ว'); D.walletLoaded = false; closeModal(); render();
    } }, '🗑️'));
    m.appendChild(row);
  });

  o.appendChild(m); return o;
}

// === INIT ===
load();
</script>
</body></html>`;
}

// ==========================================
// 📦 Shift Manager - Built with Modules
// Generated: 2026-02-08T08:20:14.189Z
// ==========================================


// src/modules/constants.js
var DAYS = ["\u0E2D\u0E32.", "\u0E08.", "\u0E2D.", "\u0E1E.", "\u0E1E\u0E24.", "\u0E28.", "\u0E2A."];
var MON = [
  "\u0E21\u0E01\u0E23\u0E32\u0E04\u0E21",
  "\u0E01\u0E38\u0E21\u0E20\u0E32\u0E1E\u0E31\u0E19\u0E18\u0E4C",
  "\u0E21\u0E35\u0E19\u0E32\u0E04\u0E21",
  "\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19",
  "\u0E1E\u0E24\u0E29\u0E20\u0E32\u0E04\u0E21",
  "\u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19",
  "\u0E01\u0E23\u0E01\u0E0E\u0E32\u0E04\u0E21",
  "\u0E2A\u0E34\u0E07\u0E2B\u0E32\u0E04\u0E21",
  "\u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19",
  "\u0E15\u0E38\u0E25\u0E32\u0E04\u0E21",
  "\u0E1E\u0E24\u0E28\u0E08\u0E34\u0E01\u0E32\u0E22\u0E19",
  "\u0E18\u0E31\u0E19\u0E27\u0E32\u0E04\u0E21"
];
var SHIFT = {
  day: { l: "\u0E01\u0E25\u0E32\u0E07\u0E27\u0E31\u0E19", c: "#f59e0b", b: "#fef3c7", i: "\u2600\uFE0F" },
  evening: { l: "\u0E01\u0E25\u0E32\u0E07\u0E04\u0E37\u0E19", c: "#6366f1", b: "#e0e7ff", i: "\u{1F319}" },
  off: { l: "\u0E27\u0E31\u0E19\u0E2B\u0E22\u0E38\u0E14", c: "#10b981", b: "#d1fae5", i: "\u{1F3D6}\uFE0F" }
};
var LEAVE = {
  sick: { l: "\u0E25\u0E32\u0E1B\u0E48\u0E27\u0E22", c: "#dc2626", b: "#fef2f2", i: "\u{1F3E5}" },
  personal: { l: "\u0E25\u0E32\u0E01\u0E34\u0E08", c: "#ef4444", b: "#fee2e2", i: "\u{1F4CB}" },
  vacation: { l: "\u0E25\u0E32\u0E1E\u0E31\u0E01\u0E23\u0E49\u0E2D\u0E19", c: "#f87171", b: "#fff1f2", i: "\u2708\uFE0F" }
};
var ROLE_LEVEL = {
  owner: 100,
  admin: 80,
  approver: 60,
  employee: 40,
  tester: 20
};
var ROLE_LABELS = {
  owner: "\u{1F451} \u0E40\u0E08\u0E49\u0E32\u0E02\u0E2D\u0E07",
  admin: "\u{1F6E1}\uFE0F \u0E41\u0E2D\u0E14\u0E21\u0E34\u0E19",
  approver: "\u{1F46E} \u0E1C\u0E39\u0E49\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34",
  employee: "\u{1F464} \u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19",
  tester: "\u{1F9EA} \u0E17\u0E14\u0E2A\u0E2D\u0E1A"
};

// src/main.js
function getLoginHTML(appUrl, errorMsg = "", appName = "") {
  const title = appName || "\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E30 & \u0E27\u0E31\u0E19\u0E25\u0E32";
  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>\u{1F4C5} ${title}</title>
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
  <div class="icon">\u{1F4C5}</div>
  <div class="title">${title}</div>
  <div class="sub">\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 Google Account</div>
  ${errorMsg ? '<div class="error">\u26A0\uFE0F ' + errorMsg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") + "</div>" : ""}
  <a href="/auth/login" class="google-btn">
    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G">
    \u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E14\u0E49\u0E27\u0E22 Google
  </a>
</div></body></html>`;
}
function getHTML(currentUser) {
  const UJ = JSON.stringify({
    id: currentUser.employee_id,
    name: currentUser.name,
    nickname: currentUser.nickname,
    email: currentUser.email,
    role: currentUser.role,
    avatar: currentUser.avatar,
    profile_image: currentUser.profile_image,
    show_in_calendar: currentUser.show_in_calendar
  });
  const CSS = true ? `/* === BASE === */
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
` : "";
  return `<!DOCTYPE html><html lang="th-u-hc-h23"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>\u{1F4C5} \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E30 & \u0E27\u0E31\u0E19\u0E25\u0E32</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>
${CSS}
</style>
</head><body>
<div class="ctn" id="app"></div>
<div class="tst" id="toast"></div>

<script type="module">
// ==========================================
// \u{1F4E6} Constants (from modules/constants.js)
// ==========================================
const DAYS = ${JSON.stringify(DAYS)};
const MON = ${JSON.stringify(MON)};
const SHIFT = ${JSON.stringify(SHIFT)};
const LEAVE = ${JSON.stringify(LEAVE)};
const ROLE_LEVEL = ${JSON.stringify(ROLE_LEVEL)};
const ROLE_LABELS = ${JSON.stringify(ROLE_LABELS)};

// ==========================================
// \u{1F464} User Data
// ==========================================
const U = ${UJ};

// ==========================================
// \u{1F5C2}\uFE0F State Management
// ==========================================
let D = {
  y: ${(/* @__PURE__ */ new Date()).getFullYear()},
  m: ${(/* @__PURE__ */ new Date()).getMonth()},
  v: 'calendar',
  days: {},
  employees: [],
  leaves: [],
  swaps: [],
  holidays: [],
  settings: {},
};

// ==========================================
// \u{1F310} API Functions
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
// \u{1F3A8} UI Helpers
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
// \u{1F5BC}\uFE0F Render Function
// ==========================================
function render() {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = '';
  app.appendChild(h('div', {}, 
    h('h1', {}, '\u{1F4C5} \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E30 & \u0E27\u0E31\u0E19\u0E25\u0E32'),
    h('p', {}, '\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1E\u0E31\u0E12\u0E19\u0E32... (Built with Modules!)')
  ));
}

// ==========================================
// \u{1F680} Initialize
// ==========================================
load();
</script>
</body></html>`;
}
export {
  getHTML,
  getLoginHTML
};

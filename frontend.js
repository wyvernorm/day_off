// =============================================
// Frontend v6 - Clean Architecture
// =============================================

export function getLoginHTML(appUrl, errorMsg = '') {
  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 เข้าสู่ระบบ</title>
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
  <div class="title">ระบบจัดการกะ & วันลา</div>
  <div class="sub">เข้าสู่ระบบด้วย Google Account</div>
  ${errorMsg ? '<div class="error">⚠️ ' + errorMsg + '</div>' : ''}
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

  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<!-- ============================================= -->
<!-- STYLES                                        -->
<!-- ============================================= -->
<style>
/* === BASE === */
:root {
  --bg: #f7f8fc; --sf: #fff; --bd: #e5e7eb; --tx: #1e293b; --ts: #64748b;
  --pr: #3b82f6; --pb: #eff6ff; --dg: #ef4444; --db: #fef2f2;
  --su: #10b981; --sb: #ecfdf5; --wn: #f59e0b; --wb: #fffbeb;
  --rd: 12px; --sh: 0 1px 3px rgba(0,0,0,.06); --sl: 0 10px 30px rgba(0,0,0,.1);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Noto Sans Thai', sans-serif; background: var(--bg); color: var(--tx); font-size: 15px; }
button { font-family: inherit; cursor: pointer; }

/* === LAYOUT === */
.ctn { max-width: 1400px; margin: 0 auto; padding: 16px 20px; }

/* === HEADER === */
.hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.hdr h1 { font-size: 26px; font-weight: 800; }
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
.tabs { display: flex; gap: 3px; background: var(--sf); padding: 4px; border-radius: 10px; border: 1px solid var(--bd); flex-wrap: wrap; }
.tab { padding: 8px 16px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; background: transparent; color: var(--ts); transition: all .15s; }
.tab.on { background: var(--pr); color: #fff; }

/* === MONTH NAV === */
.mnv { display: flex; align-items: center; gap: 10px; background: var(--sf); padding: 10px 16px; border-radius: var(--rd); border: 1px solid var(--bd); margin-bottom: 16px; flex-wrap: wrap; }
.mnv h2 { font-size: 20px; font-weight: 700; min-width: 200px; text-align: center; }
.nb { border: none; background: #f1f5f9; width: 36px; height: 36px; border-radius: 8px; font-size: 18px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; transition: background .15s; }
.nb:hover { background: #e2e8f0; }
.nb:disabled { opacity: .3; cursor: not-allowed; }
.tb { border: 1px solid var(--pr); background: var(--pb); padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; color: var(--pr); }
.sp { flex: 1; }
.ab { border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; transition: filter .15s; }
.ab:hover { filter: brightness(.95); }

/* === LEGEND === */
.lgd { display: flex; gap: 12px; flex-wrap: wrap; padding: 10px 16px; background: var(--sf); border-radius: 10px; border: 1px solid var(--bd); margin-bottom: 16px; font-size: 13px; }
.li { display: flex; align-items: center; gap: 5px; color: var(--ts); }
.lic { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }
.lsep { width: 1px; background: var(--bd); }

/* === CALENDAR === */
.cg { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.ch { text-align: center; padding: 10px 0; font-weight: 700; font-size: 14px; color: #475569; }
.ch.we { color: var(--dg); }
.cd { background: var(--sf); border: 1px solid var(--bd); border-radius: var(--rd); padding: 8px; min-height: 110px; cursor: pointer; transition: all .15s; }
.cd:hover { box-shadow: var(--sl); transform: translateY(-1px); z-index: 1; }
.cd.today { border: 2px solid var(--pr); background: var(--pb); }
.cd.hol { background: #fffbf0; border-color: #fbbf24; }
.dn { font-size: 15px; font-weight: 600; color: #334155; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
.dn.tn { font-weight: 800; color: var(--pr); }
.dn .badge { font-size: 9px; padding: 2px 6px; border-radius: 6px; font-weight: 700; }
.hn { font-size: 10px; color: #d97706; font-weight: 600; margin-bottom: 3px; }
.et { display: flex; align-items: center; gap: 3px; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.et.lv { border: 2px solid; font-size: 13px; padding: 4px 8px; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .75; } }

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
.mo { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.35); backdrop-filter: blur(4px); opacity: 0; transition: opacity .2s; }
.mo.show { opacity: 1; }
.md { background: #fff; border-radius: 16px; padding: 28px; min-width: 400px; max-width: 560px; box-shadow: var(--sl); max-height: 88vh; overflow: auto; transform: translateY(20px); transition: transform .2s; }
.mo.show .md { transform: translateY(0); }
.mh { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.mt { font-size: 18px; font-weight: 700; }
.mc { border: none; background: #f1f5f9; width: 32px; height: 32px; border-radius: 8px; font-size: 15px; display: flex; align-items: center; justify-content: center; }
.row { padding: 12px; border-radius: 10px; margin-bottom: 6px; border: 1px solid var(--bd); cursor: pointer; transition: all .15s; }
.row:hover { border-color: var(--pr); }
.row.sel { border-color: var(--pr); background: var(--pb); }
.rh { display: flex; align-items: center; gap: 10px; }
.rs { margin-left: auto; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; }
.pg { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.pl { display: inline-flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 16px; border: 2px solid transparent; font-size: 13px; font-weight: 600; background: #f8fafc; color: var(--ts); transition: all .15s; }
.pl.on { transform: scale(1.05); }
.sla { font-size: 12px; font-weight: 700; color: var(--ts); margin: 10px 0 6px; text-transform: uppercase; }
.btn { width: 100%; padding: 12px 0; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: #fff; margin-top: 14px; transition: filter .15s; }
.btn:hover { filter: brightness(.95); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.fg { margin-bottom: 16px; }
.fl { display: block; font-size: 13px; font-weight: 700; color: var(--ts); margin-bottom: 6px; }
.fi { width: 100%; padding: 10px 14px; border: 1px solid var(--bd); border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .15s; }
.fi:focus { border-color: var(--pr); }
textarea.fi { resize: vertical; min-height: 60px; }

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
.dp-pop { position: absolute; top: 100%; left: 0; z-index: 1100; background: #fff; border-radius: 12px; box-shadow: var(--sl); border: 1px solid var(--bd); padding: 12px; margin-top: 4px; min-width: 280px; }
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

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .cg { gap: 3px; }
  .cd { padding: 4px; min-height: 75px; }
  .et { font-size: 10px; }
  .hdr h1 { font-size: 20px; }
  .sg { grid-template-columns: 1fr; }
  .md { min-width: 320px; margin: 10px; }
}
</style>
</head><body>
<div class="ctn" id="app"></div>
<div class="tst" id="toast"></div>

<!-- ============================================= -->
<!-- SCRIPT                                        -->
<!-- ============================================= -->
<script>
// === CONSTANTS ===
const U = ${UJ};
const DAYS = ['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const DAYF = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const MON = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

const SHIFT = {
  day:     { l:'กลางวัน',  c:'#f59e0b', b:'#fef3c7', i:'☀️' },
  evening: { l:'กลางคืน',  c:'#6366f1', b:'#e0e7ff', i:'🌙' },
  off:     { l:'วันหยุด',  c:'#10b981', b:'#d1fae5', i:'🏖️' },
};

const LEAVE = {
  sick:      { l:'ลาป่วย',      c:'#ef4444', b:'#fee2e2', i:'🏥' },
  personal:  { l:'ลากิจ',       c:'#8b5cf6', b:'#ede9fe', i:'📋' },
  vacation:  { l:'ลาพักร้อน',   c:'#06b6d4', b:'#cffafe', i:'✈️' },
};

const MIN_YEAR = 2026, MIN_MONTH = 0; // ม.ค. 2569 เป็นต้นไป
const isO = U.role === 'owner' || U.role === 'admin';

// === STATE ===
const D = {
  v: 'calendar', y: new Date().getFullYear(), m: new Date().getMonth(),
  emp: [], sh: {}, lv: {}, hol: {}, set: {}, yl: {},
  pl: [], ps: [], sd: null, se: null, modal: null,
  hist: null, histLoaded: false,
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
    const [o, pl, ps] = await Promise.all([
      api('/api/overview?month=' + ms),
      api('/api/leaves?status=pending'),
      api('/api/swaps?status=pending'),
    ]);
    D.emp = o.data.employees;
    D.set = o.data.settings || {};
    D.yl = o.data.yearlyLeaves || {};
    D.sh = {}; o.data.shifts.forEach(s => { D.sh[s.employee_id + '-' + s.date] = s.shift_type; });
    D.lv = {}; o.data.leaves.forEach(l => { D.lv[l.employee_id + '-' + l.date] = { t: l.leave_type, s: l.status, id: l.id }; });
    D.hol = {}; o.data.holidays.forEach(h => { D.hol[h.date] = h.name; });
    D.pl = pl.data; D.ps = ps.data;
    D.hist = null; D.histLoaded = false; // reset history on month change
  } catch (e) { toast('โหลดไม่สำเร็จ: ' + e.message, true); }
  render();
}

// === HELPERS ===
// วันที่ 1-4 ม.ค. 2569 ไม่แสดง/ไม่นับ
const BLACKOUT = ['2026-01-01','2026-01-02','2026-01-03','2026-01-04'];
function isBlackout(dateKey) { return BLACKOUT.includes(dateKey); }
function dk(y, m, d) { return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'); }
function itd(y, m, d) { const t = new Date(); return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d; }
function gdow(y, m, d) { return new Date(y, m, d).getDay(); }
function gdim(y, m) { return new Date(y, m + 1, 0).getDate(); }
function fdm(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function ce() { return D.emp.filter(e => e.show_in_calendar === 1); }
function offD(e) { return (e.default_off_day || '6').split(',').map(Number); }
function isOff(e, y, m, d) { return offD(e).includes(gdow(y, m, d)); }
function stime(e) { return (e.shift_start || '09:00') + '-' + (e.shift_end || '17:00'); }
function dn(e) { return e.nickname || e.name; }
function fmtDate(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-'); return d + '/' + m + '/' + (+y + 543); }
function fmtDateTime(iso) { if (!iso) return ''; try { const dt = new Date(iso + (iso.includes('T') ? '' : 'T00:00:00') + 'Z'); const dd = String(dt.getUTCDate()).padStart(2,'0'), mm = String(dt.getUTCMonth()+1).padStart(2,'0'), yy = dt.getUTCFullYear()+543; const hh = String((dt.getUTCHours()+7)%24).padStart(2,'0'), mi = String(dt.getUTCMinutes()).padStart(2,'0'); return dd+'/'+mm+'/'+yy+' '+hh+':'+mi+' น.'; } catch { return iso; } }
function canGoPrev() {
  // ถอยได้ถ้าเดือนหลังจากถอยยังอยู่ใน 2026 ขึ้นไป
  let py = D.y, pm = D.m - 1;
  if (pm < 0) { pm = 11; py--; }
  return py >= MIN_YEAR;
}

function disp(e, k, y, m, d) {
  const lv = D.lv[e.id + '-' + k];
  if (lv) return { isL: true, ...(LEAVE[lv.t] || LEAVE.sick), st: lv.s, lid: lv.id, lt: lv.t };
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
    let pop = wrap.querySelector('.dp-pop');
    if (pop) pop.remove();
    if (!open) return;

    pop = h('div', { className: 'dp-pop' });
    pop.addEventListener('click', e => e.stopPropagation());

    const hdr = h('div', { className: 'dp-header' },
      h('button', { className: 'dp-nav', onClick: (e) => { e.stopPropagation(); if (viewM === 0) { viewM = 11; viewY--; } else viewM--; buildCal(); } }, '‹'),
      h('span', {}, MON[viewM] + ' ' + (viewY + 543)),
      h('button', { className: 'dp-nav', onClick: (e) => { e.stopPropagation(); if (viewM === 11) { viewM = 0; viewY++; } else viewM++; buildCal(); } }, '›'),
    );
    pop.appendChild(hdr);

    const grid = h('div', { className: 'dp-grid' });
    ['จ','อ','พ','พฤ','ศ','ส','อา'].forEach(d => grid.appendChild(h('div', { className: 'dp-dow' }, d)));

    const first = new Date(viewY, viewM, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
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
    wrap.appendChild(pop);
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
  if (e.target.closest('.dp-wrap')) return;
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
  a.appendChild(rHdr());
  a.appendChild(rNav());
  a.appendChild(rLgd());
  if (D.v === 'calendar') a.appendChild(rCal());
  else if (D.v === 'roster') a.appendChild(rRos());
  else if (D.v === 'stats') a.appendChild(rSta());
  else if (D.v === 'pending') a.appendChild(rPnd());
  else if (D.v === 'history') a.appendChild(rHist());
  if (D.modal) a.appendChild(rModal());
}

// === HEADER ===
function rHdr() {
  const pc = D.pl.length + D.ps.length;
  const tabs = ['calendar', 'roster', 'stats'];
  if (isO) tabs.push('pending');
  tabs.push('history');
  return h('div', { className: 'hdr' },
    h('div', {}, h('h1', {}, '📅 ระบบจัดการกะ & วันลา'), h('p', {}, 'จัดตารางกะ สลับกะ ลางาน ดูสถิติ')),
    h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' } },
      h('div', { className: 'tabs' }, ...tabs.map(v => {
        const lb = { calendar: '📅 ปฏิทิน', roster: '📋 ตารางกะ', stats: '📊 สถิติ', pending: '🔔 รออนุมัติ', history: '📜 ประวัติ' };
        let t = lb[v]; if (v === 'pending' && pc > 0) t += ' (' + pc + ')';
        return h('button', { className: 'tab' + (D.v === v ? ' on' : ''), onClick: () => { D.v = v; render(); } }, t);
      })),
      h('div', { className: 'ub' },
        U.profile_image ? h('img', { src: U.profile_image, className: 'ua' }) : h('span', { className: 'uae' }, U.avatar),
        h('div', {}, h('div', { className: 'un' }, U.nickname || U.name), h('div', { className: 'ur' }, isO ? '👑 Owner' : 'พนักงาน')),
        h('button', { className: 'ubtn', onClick: () => openModal('profile') }, 'โปรไฟล์'),
        isO ? h('button', { className: 'ubtn', onClick: () => openModal('settings') }, '⚙️') : '',
        h('button', { className: 'ubtn', style: { color: '#ef4444' }, onClick: () => { location.href = '/auth/logout'; } }, 'ออก'),
      ),
    ),
  );
}

// === MONTH NAV ===
function rNav() {
  return h('div', { className: 'mnv' },
    h('button', { className: 'nb', disabled: !canGoPrev(), onClick: () => { if (!canGoPrev()) return; if (D.m === 0) { D.m = 11; D.y--; } else D.m--; load(); } }, '‹'),
    h('h2', {}, MON[D.m] + ' ' + (D.y + 543)),
    h('button', { className: 'nb', onClick: () => { if (D.m === 11) { D.m = 0; D.y++; } else D.m++; load(); } }, '›'),
    h('button', { className: 'tb', onClick: () => { D.m = new Date().getMonth(); D.y = new Date().getFullYear(); load(); } }, 'วันนี้'),
    h('div', { className: 'sp' }),
    h('button', { className: 'ab', style: { background: '#fef2f2', color: '#ef4444' }, onClick: () => { D.sd = dk(D.y, D.m, new Date().getDate()); openModal('leave'); } }, '+ ลางาน'),
    h('button', { className: 'ab', style: { background: '#ecfdf5', color: '#10b981' }, onClick: () => { D.sd = dk(D.y, D.m, new Date().getDate()); openModal('swap'); } }, '🔄 สลับกะ'),
    h('button', { className: 'ab', style: { background: '#fef3c7', color: '#d97706' }, onClick: () => { openModal('dayoffSwap'); } }, '📅 สลับวันหยุด'),
    isO ? h('button', { className: 'ab', style: { background: '#eff6ff', color: '#3b82f6' }, onClick: () => openModal('employee') }, '👤 จัดการพนักงาน') : '',
  );
}

// === LEGEND ===
function rLgd() {
  return h('div', { className: 'lgd' },
    ...Object.entries(SHIFT).map(([, v]) => h('div', { className: 'li' }, h('span', { className: 'lic', style: { background: v.b } }, v.i), h('span', { style: { fontWeight: 600 } }, v.l))),
    h('div', { className: 'lsep' }),
    ...Object.entries(LEAVE).map(([, v]) => h('div', { className: 'li' }, h('span', {}, v.i), h('span', { style: { fontWeight: 600 } }, v.l))),
  );
}

// === CALENDAR ===
function rCal() {
  const g = h('div', { className: 'cg' });
  DAYS.forEach((d, i) => g.appendChild(h('div', { className: 'ch' + (i >= 5 ? ' we' : '') }, d)));
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
    const dy = h('div', { className: 'cd' + (td ? ' today' : '') + (hl ? ' hol' : ''), onClick: () => { D.sd = k; D.se = null; openModal('day'); } });
    const nm = h('div', { className: 'dn' + (td ? ' tn' : '') }, String(d));
    if (td) nm.appendChild(h('span', { className: 'badge', style: { background: '#3b82f6', color: '#fff' } }, 'วันนี้'));
    dy.appendChild(nm);
    if (hl) dy.appendChild(h('div', { className: 'hn' }, '🔴 ' + hl));
    ce().forEach(emp => {
      const inf = disp(emp, k, D.y, D.m, d);
      dy.appendChild(h('div', { className: 'et' + (inf.isL ? ' lv' : ''), style: inf.isL ? { background: inf.b, color: inf.c, borderColor: inf.c } : { background: inf.b, color: inf.c } }, inf.i + ' ' + dn(emp) + (inf.isL ? ' (' + inf.l + ')' : '')));
    });
    g.appendChild(dy);
  }
  return g;
}

// === ROSTER ===
function rRos() {
  const dm = gdim(D.y, D.m);
  const w = h('div', { className: 'rw' }), tb = h('table', { className: 'rt' }), thd = h('thead'), hr = h('tr');
  hr.appendChild(h('th', { className: 'sk' }, 'พนักงาน'));
  for (let d = 1; d <= dm; d++) {
    const k = dk(D.y, D.m, d), td = itd(D.y, D.m, d), hl = D.hol[k];
    let c = td ? 'tc' : hl ? 'hc' : '';
    const dw = gdow(D.y, D.m, d), di = dw === 0 ? 6 : dw - 1;
    hr.appendChild(h('th', { className: c, style: { minWidth: '40px' } }, h('div', {}, String(d)), h('div', { className: 'dl' }, DAYS[di])));
  }
  thd.appendChild(hr); tb.appendChild(thd);
  const bd = h('tbody');
  ce().forEach(emp => {
    const r = h('tr');
    r.appendChild(h('td', { className: 'sk' }, h('div', { className: 'ec' }, av(emp), h('div', {}, h('div', { className: 'en' }, dn(emp)), h('div', { className: 'er' }, stime(emp) + ' | หยุด: ' + offD(emp).map(d => DAYF[d]).join(','))))));
    for (let d = 1; d <= dm; d++) {
      const k = dk(D.y, D.m, d), td = itd(D.y, D.m, d);
      if (isBlackout(k)) { r.appendChild(h('td', { style: { background: '#f1f5f9', opacity: 0.4 } }, h('div', { className: 'sc', style: { background: '#e2e8f0' } }, '—'))); continue; }
      const inf = disp(emp, k, D.y, D.m, d);
      r.appendChild(h('td', { className: td ? 'tc' : '' }, h('div', { className: 'sc', style: inf.isL ? { background: inf.b, border: '2px solid ' + inf.c, boxShadow: '0 0 6px ' + inf.c + '40' } : { background: inf.b }, title: (inf.l || ''), onClick: () => { D.sd = k; D.se = emp.id; openModal('day'); } }, inf.i)));
    }
    bd.appendChild(r);
  });
  tb.appendChild(bd); w.appendChild(tb); return w;
}

// === STATS ===
function rSta() {
  const g = h('div', { className: 'sg' }), dm = gdim(D.y, D.m);
  ce().forEach(emp => {
    const sc = { day: 0, evening: 0, off: 0 };
    for (let d = 1; d <= dm; d++) { const k = dk(D.y, D.m, d); if (isBlackout(k)) continue; const inf = disp(emp, k, D.y, D.m, d); if (!inf.isL) sc[inf.ty] = (sc[inf.ty] || 0) + 1; }
    const yl = D.yl[emp.id] || {};
    const sickUsed = yl.sick || 0;
    const personalUsed = yl.personal || 0;
    const vacationUsed = yl.vacation || 0;
    const quotaUsed = personalUsed + vacationUsed;
    const maxLv = emp.max_leave_per_year || 20;
    const pct = maxLv > 0 ? (quotaUsed / maxLv) * 100 : 0;
    const totalAll = sickUsed + personalUsed + vacationUsed;
    // ข้อมูลติดต่อ
    const contactItems = [];
    if (emp.phone) contactItems.push('📞 ' + emp.phone);
    if (emp.line_id) contactItems.push('💬 ' + emp.line_id);
    if (emp.email) contactItems.push('✉️ ' + emp.email);
    const lastLogin = emp.last_login ? fmtDateTime(emp.last_login) : 'ยังไม่เคยเข้าสู่ระบบ';
    g.appendChild(h('div', { className: 'stc' },
      h('div', { className: 'sth' }, av(emp, true), h('div', {}, h('div', { className: 'stn' }, dn(emp)), h('div', { className: 'str' }, stime(emp) + ' | หยุด: ' + offD(emp).map(d => DAYF[d]).join(', ')))),
      // ข้อมูลติดต่อฉุกเฉิน
      h('div', { style: { padding: '10px 14px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '12px' } },
        h('div', { style: { fontSize: '12px', fontWeight: 700, color: '#0369a1', marginBottom: '4px' } }, '📇 ข้อมูลติดต่อฉุกเฉิน'),
        h('div', { style: { fontSize: '13px', color: '#0c4a6e' } }, contactItems.length ? contactItems.join('  |  ') : '— ยังไม่ได้กรอก —'),
        h('div', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' } }, '🕐 เข้าสู่ระบบล่าสุด: ' + lastLogin)),
      h('div', { className: 'stl' }, 'กะทำงานเดือนนี้'),
      h('div', { className: 'sts' }, ...Object.entries(sc).filter(([, v]) => v > 0).map(([t, c]) => { const i = SHIFT[t]; return i ? h('div', { className: 'stt', style: { background: i.b, color: i.c } }, i.i + ' ' + i.l + ' ' + c + ' วัน') : null; }).filter(Boolean)),
      h('div', { className: 'total-bar' },
        h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, h('span', { className: 'tbl' }, '📋 ลากิจ + ✈️ ลาพักร้อน (ลิมิตรวม)'), h('span', { style: { fontSize: '14px', fontWeight: 700 } }, quotaUsed + '/' + maxLv + ' วัน')),
        h('div', { className: 'tbb' }, h('div', { className: 'tbf', style: { width: Math.min(pct, 100) + '%' } }))),
      h('div', { className: 'stl' }, 'รายละเอียดการลาทั้งปี'),
      h('div', { className: 'qr' }, h('div', { className: 'qh' }, h('span', {}, '📋 ลากิจ'), h('span', { style: { fontWeight: 700, color: '#8b5cf6' } }, personalUsed + ' วัน'))),
      h('div', { className: 'qr' }, h('div', { className: 'qh' }, h('span', {}, '✈️ ลาพักร้อน'), h('span', { style: { fontWeight: 700, color: '#06b6d4' } }, vacationUsed + ' วัน'))),
      h('div', { className: 'qr' }, h('div', { className: 'qh' }, h('span', {}, '🏥 ลาป่วย (ไม่จำกัด)'), h('span', { style: { fontWeight: 700, color: '#ef4444' } }, sickUsed + ' วัน'))),
      h('div', { style: { marginTop: '8px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#475569', display: 'flex', justifyContent: 'space-between' } }, h('span', {}, 'รวมวันลาทั้งหมด'), h('span', {}, totalAll + ' วัน')),
      h('div', { style: { marginTop: '10px', padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
          h('span', { style: { fontSize: '13px', fontWeight: 700, color: '#92400e' } }, '🔄 สลับกะ/วันหยุด'),
          h('span', { style: { fontSize: '16px', fontWeight: 800, color: '#d97706' } }, (emp.swap_count || 0) + ' ครั้ง'))),
    ));
  });
  return g;
}

// === PENDING ===
function rPnd() {
  const s = h('div', { className: 'ps' });
  s.appendChild(h('div', { className: 'pt' }, '📋 วันลารออนุมัติ (' + D.pl.length + ')'));
  if (!D.pl.length) s.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px', marginBottom: '20px' } }, 'ไม่มีรายการ ✅'));
  D.pl.forEach(l => { const i = LEAVE[l.leave_type] || LEAVE.sick;
    s.appendChild(h('div', { className: 'pc' },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, h('span', { style: { fontSize: '26px' } }, l.avatar),
        h('div', {}, h('div', { style: { fontWeight: 700, fontSize: '14px' } }, l.nickname || l.employee_name), h('div', { style: { fontSize: '13px', color: '#64748b' } }, i.i + ' ' + i.l + ' — ' + fmtDate(l.date) + (l.reason ? ' (' + l.reason + ')' : '')))),
      h('div', { style: { display: 'flex', gap: '6px' } },
        h('button', { className: 'ba', onClick: async () => { try { await api('/api/leaves/' + l.id + '/approve', 'PUT'); toast('✅ อนุมัติ'); load(); } catch (e) { toast(e.message, true); } } }, '✅ อนุมัติ'),
        h('button', { className: 'br', onClick: async () => { try { await api('/api/leaves/' + l.id + '/reject', 'PUT'); toast('❌ ปฏิเสธ'); load(); } catch (e) { toast(e.message, true); } } }, '❌ ปฏิเสธ')),
    ));
  });
  s.appendChild(h('div', { className: 'pt', style: { marginTop: '24px' } }, '🔄 สลับกะ/วันหยุดรออนุมัติ (' + D.ps.length + ')'));
  if (!D.ps.length) s.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px' } }, 'ไม่มีรายการ ✅'));
  D.ps.forEach(sw => {
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
        h('button', { className: 'br', onClick: async () => { try { await api('/api/swaps/' + sw.id + '/reject', 'PUT'); toast('❌ ปฏิเสธ'); load(); } catch (e) { toast(e.message, true); } } }, '❌ ปฏิเสธ'))
        : h('div', { style: { fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' } }, 'รอคู่สลับอนุมัติ'),
    ));
  });
  return s;
}

// === APPROVAL HISTORY ===
function rHist() {
  const w = h('div', { className: 'ps' });
  w.appendChild(h('div', { className: 'pt' }, '📜 ประวัติการอนุมัติ (' + D.y + ')'));
  // Load async
  if (!D.histLoaded) {
    D.histLoaded = true;
    api('/api/history?year=' + D.y).then(r => { D.hist = r.data; render(); });
    w.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '14px' } }, '⏳ กำลังโหลด...'));
    return w;
  }
  if (!D.hist) { w.appendChild(h('p', { style: { color: '#94a3b8' } }, '⏳ โหลด...')); return w; }
  const LTH = {sick:'🏥 ลาป่วย',personal:'📋 ลากิจ',vacation:'✈️ ลาพักร้อน'};
  // วันลา
  w.appendChild(h('div', { style: { fontWeight: 700, fontSize: '15px', marginTop: '12px', marginBottom: '8px', color: '#1e293b' } }, '📋 ประวัติวันลา (' + D.hist.leaves.length + ')'));
  if (!D.hist.leaves.length) w.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '13px' } }, 'ยังไม่มีรายการ'));
  D.hist.leaves.forEach(l => {
    const isApproved = l.status === 'approved';
    w.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: isApproved ? '#f0fdf4' : '#fef2f2', borderRadius: '10px', marginBottom: '8px', border: '1px solid ' + (isApproved ? '#bbf7d0' : '#fecaca') } },
      h('span', { style: { fontSize: '24px' } }, l.emp_avatar || '👤'),
      h('div', { style: { flex: 1 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
          h('span', { style: { fontWeight: 700, fontSize: '14px' } }, l.emp_nick || l.emp_name),
          h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isApproved ? '#dcfce7' : '#fee2e2', color: isApproved ? '#16a34a' : '#dc2626' } }, isApproved ? '✅ อนุมัติ' : '❌ ปฏิเสธ')),
        h('div', { style: { fontSize: '13px', color: '#64748b', marginTop: '2px' } },
          (LTH[l.leave_type] || l.leave_type) + ' — ' + fmtDate(l.date) + (l.reason ? ' (' + l.reason + ')' : '')),
        h('div', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' } },
          '✍️ ' + (l.approver_nick || l.approver_name || '—') + ' | ' + fmtDateTime(l.approved_at)))));
  });
  // สลับกะ
  w.appendChild(h('div', { style: { fontWeight: 700, fontSize: '15px', marginTop: '20px', marginBottom: '8px', color: '#1e293b' } }, '🔄 ประวัติสลับกะ/วันหยุด (' + D.hist.swaps.length + ')'));
  if (!D.hist.swaps.length) w.appendChild(h('p', { style: { color: '#94a3b8', fontSize: '13px' } }, 'ยังไม่มีรายการ'));
  D.hist.swaps.forEach(sw => {
    const isApproved = sw.status === 'approved';
    const isDayoff = sw.swap_type === 'dayoff';
    w.appendChild(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: isApproved ? '#f0fdf4' : '#fef2f2', borderRadius: '10px', marginBottom: '8px', border: '1px solid ' + (isApproved ? '#bbf7d0' : '#fecaca') } },
      h('span', { style: { fontSize: '24px' } }, sw.from_avatar || '👤'),
      h('div', { style: { flex: 1 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } },
          h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isDayoff ? '#fef3c7' : '#d1fae5', color: isDayoff ? '#d97706' : '#10b981' } }, isDayoff ? '📅 สลับวันหยุด' : '🔄 สลับกะ'),
          h('span', { style: { fontWeight: 700, fontSize: '14px' } }, (sw.from_nick || sw.from_name) + ' ↔ ' + (sw.to_nick || sw.to_name)),
          h('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, background: isApproved ? '#dcfce7' : '#fee2e2', color: isApproved ? '#16a34a' : '#dc2626' } }, isApproved ? '✅ อนุมัติ' : '❌ ปฏิเสธ')),
        h('div', { style: { fontSize: '13px', color: '#64748b', marginTop: '2px' } },
          fmtDate(sw.date) + (sw.date2 ? ' ↔ ' + fmtDate(sw.date2) : '')),
        h('div', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '2px' } },
          '✍️ ' + (sw.approver_nick || sw.approver_name || '—') + ' | ' + fmtDateTime(sw.approved_at)))));
  });
  return w;
}

// === MODALS ROUTER ===
function rModal() {
  const map = { day: rDay, leave: rLv, swap: rSwp, dayoffSwap: rDayoffSwp, employee: rEmp, editEmp: rEditEmp, profile: rPrf, settings: rSet };
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
    try {
      if (s === e || !e) await api('/api/leaves', 'POST', { employee_id: D.se, date: s, leave_type: slt, reason: r || null });
      else await api('/api/leaves/range', 'POST', { employee_id: D.se, start_date: s, end_date: e, leave_type: slt, reason: r || null });
      toast('✅ บันทึกสำเร็จ'); closeModal(); load();
    } catch (er) { toast(er.message, true); }
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

  // Auto-select ตัวเองเสมอ
  const myEmp = D.emp.find(e => e.id === U.id);
  let sf = myEmp ? myEmp.id : null;
  let st = null;
  const emps = ce();

  if (myEmp) {
    m.appendChild(h('div', { className: 'fg' },
      h('label', { className: 'fl' }, 'ผู้ขอสลับ (คุณ)'),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' } },
        av(myEmp), h('div', {}, h('span', { style: { fontWeight: 700 } }, dn(myEmp)),
          h('span', { style: { fontSize: '12px', color: '#92400e', marginLeft: '8px' } }, '🔄 สลับแล้ว ' + (myEmp.swap_count || 0) + ' ครั้ง')))));
  }

  m.appendChild(h('div', { style: { textAlign: 'center', fontSize: '22px', margin: '6px 0' } }, '⇅'));
  // แสดงเฉพาะคนอื่น (ไม่รวมตัวเอง)
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'สลับกับ (ผู้อนุมัติ)'),
    h('div', { className: 'pg' }, ...emps.filter(e => e.id !== sf).map(e => h('button', { className: 'pl', id: 'st-' + e.id,
      onClick: () => { st = e.id; document.querySelectorAll('[id^=st-]').forEach(el => { const a = el.id === 'st-' + e.id; el.style.borderColor = a ? '#6366f1' : 'transparent'; el.style.background = a ? '#e0e7ff' : '#f8fafc'; el.style.color = a ? '#6366f1' : '#64748b'; }); } },
      e.avatar + ' ' + dn(e) + (e.swap_count ? ' (' + e.swap_count + ')' : ''))))));

  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'sr', placeholder: '...' })));
  m.appendChild(h('button', { className: 'btn', style: { background: '#16a34a' }, onClick: async () => {
    const d = dpVal('sd'), r = document.getElementById('sr').value;
    if (!sf || !st) { toast('เลือกคู่สลับ', true); return; }
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

  // Auto-select ตัวเองเสมอ
  const myEmp = D.emp.find(e => e.id === U.id);
  let sf = myEmp ? myEmp.id : null;
  let st = null;
  const emps = ce();

  if (myEmp) {
    m.appendChild(h('div', { className: 'fg' },
      h('label', { className: 'fl' }, 'ผู้ขอสลับ (คุณ)'),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' } },
        av(myEmp), h('span', { style: { fontWeight: 700 } }, dn(myEmp)),
        h('span', { style: { fontSize: '12px', color: '#92400e', marginLeft: '6px' } }, 'หยุด: ' + offD(myEmp).map(d => DAYF[d]).join(', ')))));
  }

  m.appendChild(h('div', { style: { textAlign: 'center', fontSize: '22px', margin: '6px 0' } }, '⇅'));

  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'สลับกับ (ผู้อนุมัติ)'),
    h('div', { className: 'pg' }, ...emps.filter(e => e.id !== sf).map(e => h('button', { className: 'pl', id: 'dst-' + e.id,
      onClick: () => { st = e.id; document.querySelectorAll('[id^=dst-]').forEach(el => { const a = el.id === 'dst-' + e.id; el.style.borderColor = a ? '#6366f1' : 'transparent'; el.style.background = a ? '#e0e7ff' : '#f8fafc'; el.style.color = a ? '#6366f1' : '#64748b'; }); } },
      e.avatar + ' ' + dn(e) + ' (หยุด ' + offD(e).map(d => DAYF[d]).join(',') + ')')))));

  m.appendChild(h('div', { className: 'fg', style: { display: 'flex', gap: '10px' } },
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันหยุดของคุณ (จะมาทำงานแทน)'), datePicker('ds1', '')),
    h('div', { style: { flex: 1 } }, h('label', { className: 'fl' }, '📅 วันที่จะหยุดแทน'), datePicker('ds2', ''))));

  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'เหตุผล'), h('textarea', { className: 'fi', id: 'dsr', placeholder: 'เหตุผลการสลับ...' })));

  m.appendChild(h('button', { className: 'btn', style: { background: '#d97706' }, onClick: async () => {
    const d1 = dpVal('ds1'), d2 = dpVal('ds2'), r = document.getElementById('dsr').value;
    if (!sf || !st) { toast('เลือกคู่สลับ', true); return; }
    if (!d1 || !d2) { toast('เลือกวันที่ทั้ง 2 วัน', true); return; }
    if (d1 === d2) { toast('วันที่ต้องไม่ซ้ำกัน', true); return; }
    try {
      await api('/api/swaps/dayoff', 'POST', { date1: d1, date2: d2, from_employee_id: sf, to_employee_id: st, reason: r || null });
      toast('✅ ส่งคำขอสลับวันหยุดแล้ว — รอคู่สลับอนุมัติ'); closeModal(); load();
    } catch (er) { toast(er.message, true); }
  } }, '📅 ส่งคำขอสลับวันหยุด'));
  o.appendChild(m); return o;
}

// === EMPLOYEE LIST MODAL ===
function rEmp() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', style: { maxWidth: '600px' }, onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '👤 จัดการพนักงาน'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  ce().forEach(emp => {
    m.appendChild(h('div', { className: 'row', style: { display: 'flex', alignItems: 'center', gap: '10px' },
      onClick: () => { D.se = emp.id; D.modal = 'editEmp'; render(); requestAnimationFrame(() => { const m = document.querySelector('.mo'); if (m) m.classList.add('show'); }); } },
      av(emp),
      h('div', { style: { flex: 1 } },
        h('div', { style: { fontWeight: 700, fontSize: '14px' } }, emp.name + (emp.email ? ' (' + emp.email + ')' : '')),
        h('div', { style: { fontSize: '12px', color: '#94a3b8' } }, SHIFT[emp.default_shift]?.i + ' ' + stime(emp) + ' | หยุด: ' + offD(emp).map(d => DAYF[d]).join(', '))),
      h('span', { style: { fontSize: '13px', color: '#3b82f6', fontWeight: 600 } }, '✏️'),
    ));
  });
  // Add new employee
  m.appendChild(h('div', { style: { borderTop: '1px solid #e2e8f0', marginTop: '14px', paddingTop: '14px' } },
    h('div', { className: 'sla' }, 'เพิ่มพนักงานใหม่'),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } }, h('input', { type: 'text', className: 'fi', id: 'nn', placeholder: 'ชื่อ', style: { flex: 1 } }), h('input', { type: 'email', className: 'fi', id: 'ne', placeholder: 'Email', style: { flex: 1 } })),
    h('div', { style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
      h('select', { className: 'fi', id: 'ns', style: { flex: 1 }, innerHTML: '<option value="day">☀️ กลางวัน</option><option value="evening">🌙 กลางคืน</option>' }),
      h('input', { type: 'time', className: 'fi', id: 'nss', value: '09:00', style: { flex: 1 } }),
      h('input', { type: 'time', className: 'fi', id: 'nse', value: '17:00', style: { flex: 1 } })),
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
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'เริ่มงาน'), h('input', { type: 'time', className: 'fi', id: 'ess', value: emp.shift_start || '09:00' })),
    h('div', { className: 'fg', style: { flex: 1 } }, h('label', { className: 'fl' }, 'เลิกงาน'), h('input', { type: 'time', className: 'fi', id: 'ese', value: emp.shift_end || '17:00' })),
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
  // Save button - stays on same modal, shows success indicator
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
  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => { try { await api('/api/me', 'PUT', { nickname: document.getElementById('pn').value.trim(), avatar: document.getElementById('pa').value.trim() || '👤', phone: document.getElementById('pp').value.trim() || null, line_id: document.getElementById('pli').value.trim() || null }); toast('✅ อัพเดทสำเร็จ'); U.nickname = document.getElementById('pn').value.trim(); U.avatar = document.getElementById('pa').value.trim() || '👤'; closeModal(); load(); } catch (er) { toast(er.message, true); } } }, 'บันทึก'));
  o.appendChild(m); return o;
}

// === SETTINGS MODAL ===
function rSet() {
  const o = h('div', { className: 'mo', onClick: closeModal }); const m = h('div', { className: 'md', onClick: e => e.stopPropagation() });
  m.appendChild(h('div', { className: 'mh' }, h('div', { className: 'mt' }, '⚙️ ตั้งค่า'), h('button', { className: 'mc', onClick: closeModal }, '✕')));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'ชื่อบริษัท'), h('input', { type: 'text', className: 'fi', id: 'sc', value: D.set.company_name || '' })));
  m.appendChild(h('div', { className: 'fg' }, h('label', { className: 'fl' }, 'วันหยุดบริษัท/ปี'), h('input', { type: 'number', className: 'fi', id: 'shv', value: D.set.company_holidays_per_year || '20' })));
  m.appendChild(h('div', { style: { background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px' } },
    h('div', { style: { fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '8px' } }, '📊 สรุป'),
    h('div', { style: { fontSize: '14px' } }, 'วันหยุดนักขัตฤกษ์เดือนนี้: ' + Object.keys(D.hol).length + ' วัน')));
  m.appendChild(h('button', { className: 'btn', style: { background: '#3b82f6' }, onClick: async () => { try { await api('/api/settings', 'PUT', { company_name: document.getElementById('sc').value, company_holidays_per_year: document.getElementById('shv').value }); toast('✅ บันทึกสำเร็จ'); load(); } catch (er) { toast(er.message, true); } } }, 'บันทึก'));
  o.appendChild(m); return o;
}

// === INIT ===
load();
</script>
</body></html>`;
}

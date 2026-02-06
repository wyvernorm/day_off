export function getLoginHTML(appUrl, errorMsg = '') {
  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 เข้าสู่ระบบ</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans Thai',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center}
.c{background:#fff;border-radius:24px;padding:48px 40px;max-width:420px;width:90%;text-align:center;box-shadow:0 25px 60px rgba(0,0,0,0.3)}
.i{font-size:64px;margin-bottom:16px}.t{font-size:28px;font-weight:800;color:#1e293b;margin-bottom:8px}
.s{font-size:15px;color:#64748b;margin-bottom:32px;line-height:1.6}
.b{display:inline-flex;align-items:center;gap:12px;padding:14px 32px;border:2px solid #e2e8f0;border-radius:14px;background:#fff;font-size:16px;font-weight:700;color:#1e293b;cursor:pointer;transition:all 0.2s;font-family:inherit;text-decoration:none}
.b:hover{border-color:#4285f4;background:#f8faff;transform:translateY(-1px);box-shadow:0 4px 12px rgba(66,133,244,0.15)}
.b img{width:24px;height:24px}.e{background:#fef2f2;color:#ef4444;padding:12px 16px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:20px}</style>
</head><body><div class="c"><div class="i">📅</div><div class="t">ระบบจัดการกะ & วันลา</div><div class="s">เข้าสู่ระบบด้วย Google Account<br>เพื่อจัดการตารางกะและวันลาของคุณ</div>
${errorMsg?'<div class="e">⚠️ '+errorMsg+'</div>':''}
<a href="/auth/login" class="b"><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G">เข้าสู่ระบบด้วย Google</a></div></body></html>`;
}

export function getHTML(currentUser) {
  const userJson = JSON.stringify({
    id: currentUser.employee_id, name: currentUser.name, nickname: currentUser.nickname,
    email: currentUser.email, role: currentUser.role, avatar: currentUser.avatar,
    profile_image: currentUser.profile_image, show_in_calendar: currentUser.show_in_calendar,
  });

  return `<!DOCTYPE html><html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>📅 ระบบจัดการกะ & วันลา</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#f7f8fc;--sf:#fff;--bd:#e5e7eb;--tx:#1e293b;--ts:#64748b;--pr:#3b82f6;--pb:#eff6ff;--dg:#ef4444;--db:#fef2f2;--su:#10b981;--sb:#ecfdf5;--wn:#f59e0b;--wb:#fffbeb;--rd:12px;--sh:0 1px 3px rgba(0,0,0,0.06);--sl:0 10px 30px rgba(0,0,0,0.1)}
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans Thai',sans-serif;background:var(--bg);color:var(--tx);min-height:100vh;font-size:15px}
button{font-family:inherit;cursor:pointer}.ctn{max-width:1400px;margin:0 auto;padding:16px 20px}
.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px}
.hdr h1{font-size:26px;font-weight:800}.hdr p{font-size:14px;color:var(--ts);margin-top:2px}
.ub{display:flex;align-items:center;gap:10px;background:var(--sf);padding:8px 16px;border-radius:12px;border:1px solid var(--bd)}
.ua{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--bd)}.uae{font-size:28px;line-height:36px}
.un{font-weight:700;font-size:14px}.ur{font-size:11px;color:var(--ts)}
.ubtn{border:none;background:#f1f5f9;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;color:var(--ts)}.ubtn:hover{background:#e2e8f0}
.tabs{display:flex;gap:3px;background:var(--sf);padding:4px;border-radius:10px;border:1px solid var(--bd);flex-wrap:wrap}
.tab{padding:8px 16px;border:none;border-radius:8px;font-size:14px;font-weight:600;background:transparent;color:var(--ts);transition:all .15s}.tab.on{background:var(--pr);color:#fff}
.mnv{display:flex;align-items:center;gap:10px;background:var(--sf);padding:10px 16px;border-radius:var(--rd);border:1px solid var(--bd);margin-bottom:16px;flex-wrap:wrap}
.mnv h2{font-size:20px;font-weight:700;min-width:200px;text-align:center}
.nb{border:none;background:#f1f5f9;width:36px;height:36px;border-radius:8px;font-size:18px;font-weight:700;color:#475569;display:flex;align-items:center;justify-content:center}
.tb{border:1px solid var(--pr);background:var(--pb);padding:6px 16px;border-radius:8px;font-size:13px;font-weight:700;color:var(--pr)}
.sp{flex:1}.ab{border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:700}
.lgd{display:flex;gap:12px;flex-wrap:wrap;padding:10px 16px;background:var(--sf);border-radius:10px;border:1px solid var(--bd);margin-bottom:16px;font-size:13px}
.li{display:flex;align-items:center;gap:5px;color:var(--ts)}.lic{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px}
.ls{width:1px;background:var(--bd)}
.cg{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
.ch{text-align:center;padding:10px 0;font-weight:700;font-size:14px;color:#475569}.ch.we{color:var(--dg)}
.cd{background:var(--sf);border:1px solid var(--bd);border-radius:var(--rd);padding:8px;min-height:110px;cursor:pointer;transition:all .15s}
.cd:hover{box-shadow:var(--sl);transform:translateY(-1px);z-index:1}.cd.td{border:2px solid var(--pr);background:var(--pb)}.cd.hd{background:#fffbf0;border-color:#fbbf24}
.dn{font-size:15px;font-weight:600;color:#334155;margin-bottom:4px;display:flex;align-items:center;gap:4px}.dn.tn{font-weight:800;color:var(--pr)}
.dn .bg{font-size:9px;padding:2px 6px;border-radius:6px;font-weight:700}
.hn{font-size:10px;color:#d97706;font-weight:600;margin-bottom:3px}
.et{display:flex;align-items:center;gap:3px;font-size:12px;font-weight:600;padding:2px 6px;border-radius:5px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rw{overflow-x:auto;border-radius:var(--rd);border:1px solid var(--bd);background:var(--sf)}
.rt{width:100%;border-collapse:collapse;font-size:13px}
.rt th{padding:10px 4px;text-align:center;background:#f8fafc;border-bottom:2px solid var(--bd);font-weight:700}
.rt th.sk{position:sticky;left:0;z-index:3;min-width:160px;text-align:left;padding-left:14px}
.rt th.tc{background:var(--pb)}.rt th.hc{background:#fffbeb;color:#d97706}
.rt th .dl{font-size:10px;opacity:.7}
.rt td{text-align:center;padding:3px;border-bottom:1px solid #f1f5f9}
.rt td.sk{position:sticky;left:0;background:#fff;z-index:2;text-align:left;padding:8px 14px}
.rt td.tc{background:#f0f7ff}
.ec{display:flex;align-items:center;gap:8px}.ea{font-size:22px}.ei{width:28px;height:28px;border-radius:50%;object-fit:cover}
.en{font-weight:700;font-size:13px}.er{font-size:11px;color:var(--ts)}
.sc{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:15px;cursor:pointer;transition:all .15s}
.sc:hover{transform:scale(1.25)}
.sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.stc{background:var(--sf);border-radius:var(--rd);padding:20px;border:1px solid var(--bd)}
.sth{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.sta{font-size:36px}.sti{width:44px;height:44px;border-radius:50%;object-fit:cover}
.stn{font-size:17px;font-weight:700}.str{font-size:12px;color:var(--ts)}
.stl{font-size:12px;font-weight:700;color:var(--ts);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.sts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.stt{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:6px;font-size:13px;font-weight:600}
.qr{margin-bottom:10px}.qh{display:flex;justify-content:space-between;font-size:12px;color:var(--ts);margin-bottom:4px}
.qb{height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}.qf{height:100%;border-radius:3px;transition:width .4s}
.ps{margin-top:20px}.pt{font-size:18px;font-weight:700;margin-bottom:12px}
.pc{background:var(--sf);border-radius:var(--rd);padding:14px 18px;border:1px solid var(--bd);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.ba{border:none;background:var(--su);color:#fff;padding:7px 16px;border-radius:8px;font-size:13px;font-weight:700}
.br{border:1px solid var(--dg);background:#fff;color:var(--dg);padding:7px 16px;border-radius:8px;font-size:13px;font-weight:700}
.mo{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);animation:fi .15s}
.md{background:#fff;border-radius:16px;padding:28px;min-width:400px;max-width:560px;box-shadow:var(--sl);max-height:88vh;overflow:auto;animation:su .2s}
.mh{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.mt{font-size:18px;font-weight:700}.mc{border:none;background:#f1f5f9;width:32px;height:32px;border-radius:8px;font-size:15px;display:flex;align-items:center;justify-content:center}
.row{padding:12px;border-radius:10px;margin-bottom:6px;border:1px solid var(--bd);cursor:pointer;transition:all .15s}
.row:hover{border-color:var(--pr)}.row.sel{border-color:var(--pr);background:var(--pb)}
.rh{display:flex;align-items:center;gap:10px}.rs{margin-left:auto;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700}
.pg{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.pl{display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:16px;border:2px solid transparent;font-size:13px;font-weight:600;background:#f8fafc;color:var(--ts);transition:all .15s}
.pl.on{transform:scale(1.05)}
.sl{font-size:12px;font-weight:700;color:var(--ts);margin:10px 0 6px;text-transform:uppercase}
.btn{width:100%;padding:12px 0;border:none;border-radius:10px;font-size:14px;font-weight:700;color:#fff;margin-top:14px}
.fg{margin-bottom:16px}.fl{display:block;font-size:13px;font-weight:700;color:var(--ts);margin-bottom:6px}
.fi{width:100%;padding:10px 14px;border:1px solid var(--bd);border-radius:8px;font-size:14px;font-family:inherit;outline:none}
.fi:focus{border-color:var(--pr)}textarea.fi{resize:vertical;min-height:60px}
.tst{position:fixed;top:20px;right:20px;z-index:2000;background:#fff;padding:14px 22px;border-radius:10px;box-shadow:var(--sl);font-weight:600;font-size:14px;border-left:4px solid var(--su);animation:ni .3s}
.tst.err{border-left-color:var(--dg)}
.pil{width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--bd)}.pel{font-size:60px;line-height:80px}
@media(max-width:768px){.cg{gap:3px}.cd{padding:4px;min-height:75px}.et{font-size:10px}.hdr h1{font-size:20px}.sg{grid-template-columns:1fr}.md{min-width:320px;margin:10px}}
@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes ni{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}
</style></head><body>
<div class="ctn" id="app"></div>
<script>
const U=${userJson};
const DAYS=['จ.','อ.','พ.','พฤ.','ศ.','ส.','อา.'];
const DAYF=['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];
const MON=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
const ST={day:{l:'กลางวัน',c:'#f59e0b',b:'#fef3c7',i:'☀️'},evening:{l:'กลางคืน',c:'#6366f1',b:'#e0e7ff',i:'🌙'},off:{l:'วันหยุด',c:'#10b981',b:'#d1fae5',i:'🏖️'}};
const LT={sick:{l:'ลาป่วย',c:'#ef4444',b:'#fee2e2',i:'🏥',m:30},personal:{l:'ลากิจ',c:'#8b5cf6',b:'#ede9fe',i:'📋',m:6},vacation:{l:'พักร้อน',c:'#06b6d4',b:'#cffafe',i:'✈️',m:10},maternity:{l:'ลาคลอด',c:'#ec4899',b:'#fce7f3',i:'👶',m:90}};
const isOwner=U.role==='owner'||U.role==='admin';
const S={v:'calendar',y:new Date().getFullYear(),m:new Date().getMonth(),emp:[],sh:{},lv:{},hol:{},set:{},pl:[],ps:[],sd:null,se:null,modal:null,toast:null};

async function api(p,m='GET',b=null){const o={method:m,headers:{'Content-Type':'application/json'}};if(b)o.body=JSON.stringify(b);const r=await fetch(p,o);const d=await r.json();if(!r.ok)throw new Error(d.error||'error');return d;}
function toast(m,e=false){S.toast={m,e};render();setTimeout(()=>{S.toast=null;render();},2500);}
async function load(){try{const ms=S.y+'-'+String(S.m+1).padStart(2,'0');const[o,pl,ps]=await Promise.all([api('/api/overview?month='+ms),api('/api/leaves?status=pending'),api('/api/swaps?status=pending')]);S.emp=o.data.employees;S.set=o.data.settings||{};S.sh={};o.data.shifts.forEach(s=>{S.sh[s.employee_id+'-'+s.date]=s.shift_type;});S.lv={};o.data.leaves.forEach(l=>{S.lv[l.employee_id+'-'+l.date]={t:l.leave_type,s:l.status,id:l.id};});S.hol={};o.data.holidays.forEach(h=>{S.hol[h.date]=h.name;});S.pl=pl.data;S.ps=ps.data;}catch(e){toast('โหลดไม่สำเร็จ: '+e.message,true);}render();}
function dk(y,m,d){return y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');}
function itd(y,m,d){const t=new Date();return t.getFullYear()===y&&t.getMonth()===m&&t.getDate()===d;}
function dow(y,m,d){return new Date(y,m,d).getDay();}
function dim(y,m){return new Date(y,m+1,0).getDate();}
function fdm(y,m){const d=new Date(y,m,1).getDay();return d===0?6:d-1;}
function calEmp(){return S.emp.filter(e=>e.show_in_calendar===1);}
function offDays(emp){return(emp.default_off_day||'6').split(',').map(Number);}
function isOff(emp,y,m,d){return offDays(emp).includes(dow(y,m,d));}
function shiftTime(emp){return(emp.shift_start||'09:00')+'-'+(emp.shift_end||'17:00');}
function disp(emp,k,y,m,d){const lv=S.lv[emp.id+'-'+k];if(lv)return{isL:true,...LT[lv.t],st:lv.s,lid:lv.id};const s=S.sh[emp.id+'-'+k];if(s)return{isL:false,...ST[s],ty:s};if(isOff(emp,y,m,d))return{isL:false,...ST.off,ty:'off'};return{isL:false,...ST[emp.default_shift],ty:emp.default_shift};}
function dn(e){return e.nickname||e.name;}
function av(e,lg){if(e.profile_image)return h('img',{src:e.profile_image,className:lg?'pil':'ei'});return h('span',{className:lg?'pel':'ea'},e.avatar);}
function h(t,a={},...ch){const el=document.createElement(t);for(const[k,v]of Object.entries(a)){if(k==='style'&&typeof v==='object')Object.assign(el.style,v);else if(k.startsWith('on'))el.addEventListener(k.slice(2).toLowerCase(),v);else if(k==='className')el.className=v;else if(k==='innerHTML')el.innerHTML=v;else if(k==='src')el.src=v;else el.setAttribute(k,v);}ch.flat(Infinity).forEach(c=>{if(c==null)return;el.appendChild(typeof c==='string'||typeof c==='number'?document.createTextNode(c):c);});return el;}

function render(){const a=document.getElementById('app');a.innerHTML='';a.appendChild(rHdr());a.appendChild(rNav());a.appendChild(rLgd());
if(S.v==='calendar')a.appendChild(rCal());else if(S.v==='roster')a.appendChild(rRos());else if(S.v==='stats')a.appendChild(rSta());else if(S.v==='pending')a.appendChild(rPnd());
if(S.modal==='day')a.appendChild(rDay());if(S.modal==='leave')a.appendChild(rLv());if(S.modal==='swap')a.appendChild(rSwp());
if(S.modal==='employee')a.appendChild(rEmp());if(S.modal==='editEmp')a.appendChild(rEditEmp());
if(S.modal==='profile')a.appendChild(rPrf());if(S.modal==='settings')a.appendChild(rSet());
if(S.toast)a.appendChild(h('div',{className:'tst'+(S.toast.e?' err':'')},S.toast.m));}

function rHdr(){const pc=S.pl.length+S.ps.length;const tabs=['calendar','roster','stats'];if(isOwner)tabs.push('pending');
return h('div',{className:'hdr'},h('div',{},h('h1',{},'📅 ระบบจัดการกะ & วันลา'),h('p',{},'จัดตารางกะ สลับกะ ลางาน ดูสถิติ')),
h('div',{style:{display:'flex',gap:'10px',alignItems:'center',flexWrap:'wrap'}},
h('div',{className:'tabs'},...tabs.map(v=>{const lb={calendar:'📅 ปฏิทิน',roster:'📋 ตารางกะ',stats:'📊 สถิติ',pending:'🔔 รออนุมัติ'};let t=lb[v];if(v==='pending'&&pc>0)t+=' ('+pc+')';return h('button',{className:'tab'+(S.v===v?' on':''),onClick:()=>{S.v=v;render();}},t);})),
h('div',{className:'ub'},U.profile_image?h('img',{src:U.profile_image,className:'ua'}):h('span',{className:'uae'},U.avatar),
h('div',{},h('div',{className:'un'},U.nickname||U.name),h('div',{className:'ur'},isOwner?'👑 Owner':'พนักงาน')),
h('button',{className:'ubtn',onClick:()=>{S.modal='profile';render();}},'โปรไฟล์'),
isOwner?h('button',{className:'ubtn',onClick:()=>{S.modal='settings';render();}},'⚙️'):'',
h('button',{className:'ubtn',style:{color:'#ef4444'},onClick:()=>{location.href='/auth/logout';}},'ออก'))));}

function rNav(){return h('div',{className:'mnv'},
h('button',{className:'nb',onClick:()=>{if(S.m===0){S.m=11;S.y--;}else S.m--;load();}},'‹'),
h('h2',{},MON[S.m]+' '+(S.y+543)),
h('button',{className:'nb',onClick:()=>{if(S.m===11){S.m=0;S.y++;}else S.m++;load();}},'›'),
h('button',{className:'tb',onClick:()=>{S.m=new Date().getMonth();S.y=new Date().getFullYear();load();}},'วันนี้'),
h('div',{className:'sp'}),
h('button',{className:'ab',style:{background:'#fef2f2',color:'#ef4444'},onClick:()=>{S.modal='leave';S.sd=dk(S.y,S.m,new Date().getDate());render();}},'+ ลางาน'),
h('button',{className:'ab',style:{background:'#ecfdf5',color:'#10b981'},onClick:()=>{S.modal='swap';S.sd=dk(S.y,S.m,new Date().getDate());render();}},'🔄 สลับกะ'),
isOwner?h('button',{className:'ab',style:{background:'#eff6ff',color:'#3b82f6'},onClick:()=>{S.modal='employee';render();}},'👤 จัดการพนักงาน'):'');}

function rLgd(){const ce=calEmp();const shiftTypes=new Set(ce.map(e=>e.default_shift));
return h('div',{className:'lgd'},
...Object.entries(ST).filter(([k])=>k==='off'||shiftTypes.has(k)).map(([k,v])=>{
const emp=ce.find(e=>e.default_shift===k);const time=emp?shiftTime(emp):(v.time||'');
return h('div',{className:'li'},h('span',{className:'lic',style:{background:v.b}},v.i),h('span',{style:{fontWeight:600}},v.l),time?h('span',{style:{color:'#94a3b8'}},time):null);}),
h('div',{className:'ls'}),
...Object.entries(LT).map(([k,v])=>h('div',{className:'li'},h('span',{},v.i),h('span',{style:{fontWeight:600}},v.l))));}

function rCal(){const g=h('div',{className:'cg'});DAYS.forEach((d,i)=>g.appendChild(h('div',{className:'ch'+(i>=5?' we':'')},d)));
for(let i=0;i<fdm(S.y,S.m);i++)g.appendChild(h('div'));const dm=dim(S.y,S.m);
for(let d=1;d<=dm;d++){const k=dk(S.y,S.m,d),td=itd(S.y,S.m,d),hl=S.hol[k];
const dy=h('div',{className:'cd'+(td?' td':'')+(hl?' hd':''),onClick:()=>{S.sd=k;S.modal='day';S.se=null;render();}});
const nm=h('div',{className:'dn'+(td?' tn':'')},String(d));if(td)nm.appendChild(h('span',{className:'bg',style:{background:'#3b82f6',color:'#fff'}},'วันนี้'));dy.appendChild(nm);
if(hl)dy.appendChild(h('div',{className:'hn'},'🔴 '+hl));
calEmp().forEach(emp=>{const inf=disp(emp,k,S.y,S.m,d);
dy.appendChild(h('div',{className:'et',style:{background:inf.b,color:inf.c}},inf.i+' '+dn(emp)));});
g.appendChild(dy);}return g;}

function rRos(){const dm=dim(S.y,S.m);const w=h('div',{className:'rw'}),tb=h('table',{className:'rt'}),th=h('thead'),hr=h('tr');
hr.appendChild(h('th',{className:'sk'},'พนักงาน'));
for(let d=1;d<=dm;d++){const k=dk(S.y,S.m,d),td=itd(S.y,S.m,d),hl=S.hol[k];let c=td?'tc':hl?'hc':'';const dw=dow(S.y,S.m,d),di=dw===0?6:dw-1;
hr.appendChild(h('th',{className:c,style:{minWidth:'40px'}},h('div',{},String(d)),h('div',{className:'dl'},DAYS[di])));}
th.appendChild(hr);tb.appendChild(th);const bd=h('tbody');
calEmp().forEach(emp=>{const r=h('tr');
r.appendChild(h('td',{className:'sk'},h('div',{className:'ec'},av(emp),h('div',{},h('div',{className:'en'},dn(emp)),h('div',{className:'er'},'หยุด: '+offDays(emp).map(d=>DAYF[d]).join(', ')+' | '+shiftTime(emp))))));
for(let d=1;d<=dm;d++){const k=dk(S.y,S.m,d),td=itd(S.y,S.m,d),inf=disp(emp,k,S.y,S.m,d);
r.appendChild(h('td',{className:td?'tc':''},h('div',{className:'sc',style:{background:inf.b},title:inf.l+' '+(inf.time||''),onClick:()=>{S.sd=k;S.se=emp.id;S.modal='day';render();}},inf.i)));}
bd.appendChild(r);});tb.appendChild(bd);w.appendChild(tb);return w;}

function rSta(){const g=h('div',{className:'sg'}),dm=dim(S.y,S.m);
calEmp().forEach(emp=>{const sc={day:0,evening:0,off:0},lc={sick:0,personal:0,vacation:0,maternity:0};
for(let d=1;d<=dm;d++){const k=dk(S.y,S.m,d),inf=disp(emp,k,S.y,S.m,d);if(inf.isL)lc[S.lv[emp.id+'-'+k]?.t]++;else sc[inf.ty]=(sc[inf.ty]||0)+1;}
g.appendChild(h('div',{className:'stc'},
h('div',{className:'sth'},av(emp,true),h('div',{},h('div',{className:'stn'},dn(emp)),h('div',{className:'str'},'หยุด: '+offDays(emp).map(d=>DAYF[d]).join(', ')+' | '+shiftTime(emp)))),
h('div',{className:'stl'},'กะทำงานเดือนนี้'),
h('div',{className:'sts'},...Object.entries(sc).filter(([_,v])=>v>0).map(([t,c])=>{const i=ST[t];return i?h('div',{className:'stt',style:{background:i.b,color:i.c}},i.i+' '+i.l+' '+c+' วัน'):null;}).filter(Boolean)),
h('div',{className:'stl'},'โควต้าวันลา (ทั้งปี)'),
...Object.entries(LT).map(([t,inf])=>{const u=lc[t]||0,mx=emp['max_'+t+'_leave']||inf.m,p=mx>0?(u/mx)*100:0;
return h('div',{className:'qr'},h('div',{className:'qh'},h('span',{},inf.i+' '+inf.l),h('span',{style:{fontWeight:700,color:inf.c}},u+'/'+mx)),
h('div',{className:'qb'},h('div',{className:'qf',style:{width:p+'%',background:inf.c}})));})
));});return g;}

function rPnd(){const s=h('div',{className:'ps'});
s.appendChild(h('div',{className:'pt'},'📋 วันลารออนุมัติ ('+S.pl.length+')'));
if(!S.pl.length)s.appendChild(h('p',{style:{color:'#94a3b8',fontSize:'14px',marginBottom:'20px'}},'ไม่มีรายการ ✅'));
S.pl.forEach(l=>{const i=LT[l.leave_type];s.appendChild(h('div',{className:'pc'},
h('div',{style:{display:'flex',alignItems:'center',gap:'10px'}},h('span',{style:{fontSize:'26px'}},l.avatar),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},l.nickname||l.employee_name),h('div',{style:{fontSize:'13px',color:'#64748b'}},i.i+' '+i.l+' — '+l.date+(l.reason?' ('+l.reason+')':'')))),
h('div',{style:{display:'flex',gap:'6px'}},h('button',{className:'ba',onClick:async()=>{try{await api('/api/leaves/'+l.id+'/approve','PUT');toast('✅ อนุมัติ');load();}catch(e){toast(e.message,true);}}},'✅ อนุมัติ'),h('button',{className:'br',onClick:async()=>{try{await api('/api/leaves/'+l.id+'/reject','PUT');toast('❌ ปฏิเสธ');load();}catch(e){toast(e.message,true);}}},'❌ ปฏิเสธ'))));});
s.appendChild(h('div',{className:'pt',style:{marginTop:'24px'}},'🔄 สลับกะรออนุมัติ ('+S.ps.length+')'));
if(!S.ps.length)s.appendChild(h('p',{style:{color:'#94a3b8',fontSize:'14px'}},'ไม่มีรายการ ✅'));
S.ps.forEach(sw=>{s.appendChild(h('div',{className:'pc'},h('div',{style:{display:'flex',alignItems:'center',gap:'10px'}},h('span',{style:{fontSize:'22px'}},sw.from_avatar),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},(sw.from_nickname||sw.from_name)+' ↔ '+(sw.to_nickname||sw.to_name)),h('div',{style:{fontSize:'13px',color:'#64748b'}},'วันที่ '+sw.date))),
h('div',{style:{display:'flex',gap:'6px'}},h('button',{className:'ba',onClick:async()=>{try{await api('/api/swaps/'+sw.id+'/approve','PUT');toast('✅ อนุมัติ');load();}catch(e){toast(e.message,true);}}},'✅'),h('button',{className:'br',onClick:async()=>{try{await api('/api/swaps/'+sw.id+'/reject','PUT');toast('❌');load();}catch(e){toast(e.message,true);}}},'❌'))));});
return s;}

function rDay(){const k=S.sd;if(!k)return h('div');const[yr,mo,dy]=[+k.split('-')[0],+k.split('-')[1]-1,+k.split('-')[2]];const hl=S.hol[k];
const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});
const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'📅 '+dy+' '+MON[mo]+' '+(yr+543)+' ('+DAYF[dow(yr,mo,dy)]+')'+(hl?' — 🔴'+hl:'')),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
calEmp().forEach(emp=>{const inf=disp(emp,k,yr,mo,dy),sel=S.se===emp.id;
const r=h('div',{className:'row'+(sel?' sel':''),onClick:()=>{S.se=sel?null:emp.id;render();}});
const hd=h('div',{className:'rh'},av(emp),h('div',{},h('div',{style:{fontWeight:700,fontSize:'14px'}},dn(emp)),h('div',{style:{fontSize:'11px',color:'#94a3b8'}},'หยุด: '+offDays(emp).map(d=>DAYF[d]).join(', ')+' | '+shiftTime(emp))));
if(inf.isL)hd.appendChild(h('span',{className:'rs',style:{background:inf.b,color:inf.c}},inf.i+' '+inf.l+(inf.st==='pending'?' (รอ)':'')));
else hd.appendChild(h('span',{className:'rs',style:{background:inf.b,color:inf.c}},inf.i+' '+inf.l));
r.appendChild(hd);
if(sel){r.appendChild(h('div',{className:'sl'},'เปลี่ยนกะ'));
const sp=h('div',{className:'pg'});Object.entries(ST).forEach(([t,si])=>{const a=!inf.isL&&inf.ty===t;sp.appendChild(h('button',{className:'pl'+(a?' on':''),style:a?{borderColor:si.c,background:si.b,color:si.c}:{},onClick:async e=>{e.stopPropagation();try{if(inf.isL&&inf.lid)await api('/api/leaves/'+inf.lid,'DELETE');await api('/api/shifts','POST',{employee_id:emp.id,date:k,shift_type:t});toast(si.i+' '+dn(emp)+' → '+si.l);load();}catch(er){toast(er.message,true);}}},si.i+' '+si.l));});r.appendChild(sp);
r.appendChild(h('div',{className:'sl'},'ลางาน'));
const lp=h('div',{className:'pg'});Object.entries(LT).forEach(([t,li])=>{const lv=S.lv[emp.id+'-'+k],a=lv&&lv.t===t;lp.appendChild(h('button',{className:'pl'+(a?' on':''),style:a?{borderColor:li.c,background:li.b,color:li.c}:{},onClick:async e=>{e.stopPropagation();try{if(a){await api('/api/leaves/'+lv.id,'DELETE');toast('❌ ยกเลิกลา');}else{await api('/api/leaves','POST',{employee_id:emp.id,date:k,leave_type:t});toast(li.i+' '+dn(emp)+' → '+li.l);}load();}catch(er){toast(er.message,true);}}},li.i+' '+li.l));});r.appendChild(lp);}
m.appendChild(r);});o.appendChild(m);return o;}

function rLv(){const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'📝 ลงวันลา'),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
const eg=h('div',{className:'fg'});eg.appendChild(h('label',{className:'fl'},'เลือกพนักงาน'));const ep=h('div',{className:'pg'});
calEmp().forEach(emp=>{const a=S.se===emp.id;ep.appendChild(h('button',{className:'pl'+(a?' on':''),style:a?{borderColor:'#3b82f6',background:'#eff6ff',color:'#3b82f6'}:{},onClick:()=>{S.se=emp.id;render();}},emp.avatar+' '+dn(emp)));});
eg.appendChild(ep);m.appendChild(eg);let slt='sick';
const tg=h('div',{className:'fg'});tg.appendChild(h('label',{className:'fl'},'ประเภท'));const tp=h('div',{className:'pg'});
Object.entries(LT).forEach(([t,i])=>{tp.appendChild(h('button',{className:'pl',id:'lt-'+t,style:t==='sick'?{borderColor:i.c,background:i.b,color:i.c}:{},onClick:()=>{slt=t;document.querySelectorAll('[id^=lt-]').forEach(el=>{const tt=el.id.replace('lt-',''),ii=LT[tt];el.style.borderColor=tt===t?ii.c:'transparent';el.style.background=tt===t?ii.b:'#f8fafc';el.style.color=tt===t?ii.c:'#64748b';});}},i.i+' '+i.l));});
tg.appendChild(tp);m.appendChild(tg);
m.appendChild(h('div',{className:'fg',style:{display:'flex',gap:'10px'}},h('div',{style:{flex:1}},h('label',{className:'fl'},'เริ่ม'),h('input',{type:'date',className:'fi',id:'ls',value:S.sd||''})),h('div',{style:{flex:1}},h('label',{className:'fl'},'สิ้นสุด'),h('input',{type:'date',className:'fi',id:'le',value:S.sd||''}))));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'เหตุผล'),h('textarea',{className:'fi',id:'lr',placeholder:'ระบุเหตุผล...'})));
m.appendChild(h('button',{className:'btn',style:{background:'#3b82f6'},onClick:async()=>{if(!S.se){toast('เลือกพนักงาน',true);return;}const s=document.getElementById('ls').value,e=document.getElementById('le').value,r=document.getElementById('lr').value;if(!s){toast('เลือกวันที่',true);return;}try{if(s===e||!e)await api('/api/leaves','POST',{employee_id:S.se,date:s,leave_type:slt,reason:r||null});else await api('/api/leaves/range','POST',{employee_id:S.se,start_date:s,end_date:e,leave_type:slt,reason:r||null});toast('✅ บันทึกสำเร็จ');S.modal=null;load();}catch(er){toast(er.message,true);}}},'บันทึกวันลา'));
o.appendChild(m);return o;}

function rSwp(){const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'🔄 สลับกะ'),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'วันที่'),h('input',{type:'date',className:'fi',id:'sd',value:S.sd||''})));
let sf=null,st=null;const ce=calEmp();
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'คนที่ 1'),h('div',{className:'pg'},...ce.map(e=>h('button',{className:'pl',id:'sf-'+e.id,onClick:()=>{sf=e.id;document.querySelectorAll('[id^=sf-]').forEach(el=>{const a=el.id==='sf-'+e.id;el.style.borderColor=a?'#f59e0b':'transparent';el.style.background=a?'#fef3c7':'#f8fafc';el.style.color=a?'#f59e0b':'#64748b';});}},e.avatar+' '+dn(e))))));
m.appendChild(h('div',{style:{textAlign:'center',fontSize:'22px',margin:'6px 0'}},'⇅'));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'คนที่ 2'),h('div',{className:'pg'},...ce.map(e=>h('button',{className:'pl',id:'st-'+e.id,onClick:()=>{st=e.id;document.querySelectorAll('[id^=st-]').forEach(el=>{const a=el.id==='st-'+e.id;el.style.borderColor=a?'#6366f1':'transparent';el.style.background=a?'#e0e7ff':'#f8fafc';el.style.color=a?'#6366f1':'#64748b';});}},e.avatar+' '+dn(e))))));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'เหตุผล'),h('textarea',{className:'fi',id:'sr',placeholder:'ระบุเหตุผล...'})));
m.appendChild(h('button',{className:'btn',style:{background:'#16a34a'},onClick:async()=>{const d=document.getElementById('sd').value,r=document.getElementById('sr').value;if(!sf||!st){toast('เลือกทั้ง 2 คน',true);return;}if(sf===st){toast('ต้องคนละคน',true);return;}if(!d){toast('เลือกวันที่',true);return;}try{await api('/api/swaps','POST',{date:d,from_employee_id:sf,to_employee_id:st,reason:r||null});toast('✅ ส่งคำขอสำเร็จ');S.modal=null;load();}catch(er){toast(er.message,true);}}},'ส่งคำขอสลับกะ'));
o.appendChild(m);return o;}

function rEmp(){const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});const m=h('div',{className:'md',style:{maxWidth:'600px'},onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'👤 จัดการพนักงาน'),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
calEmp().forEach(emp=>{m.appendChild(h('div',{className:'row',style:{display:'flex',alignItems:'center',gap:'10px',cursor:'pointer'},onClick:()=>{S.se=emp.id;S.modal='editEmp';render();}},
av(emp),h('div',{style:{flex:1}},h('div',{style:{fontWeight:700,fontSize:'14px'}},emp.name+(emp.email?' ('+emp.email+')':'')),
h('div',{style:{fontSize:'12px',color:'#94a3b8'}},ST[emp.default_shift]?.i+' '+shiftTime(emp)+' | หยุด: '+offDays(emp).map(d=>DAYF[d]).join(', '))),
h('span',{style:{fontSize:'13px',color:'#3b82f6',fontWeight:600}},'แก้ไข ✏️')));});
m.appendChild(h('div',{style:{borderTop:'1px solid #e2e8f0',marginTop:'14px',paddingTop:'14px'}},
h('div',{className:'sl'},'เพิ่มพนักงานใหม่'),
h('div',{style:{display:'flex',gap:'8px',marginBottom:'8px'}},h('input',{type:'text',className:'fi',id:'nn',placeholder:'ชื่อ',style:{flex:1}}),h('input',{type:'email',className:'fi',id:'ne',placeholder:'Email',style:{flex:1}})),
h('div',{style:{display:'flex',gap:'8px',marginBottom:'8px'}},
h('select',{className:'fi',id:'ns',style:{flex:1},innerHTML:'<option value="day">☀️ กลางวัน</option><option value="evening">🌙 กลางคืน</option>'}),
h('input',{type:'time',className:'fi',id:'nss',value:'09:00',style:{flex:1}}),
h('input',{type:'time',className:'fi',id:'nse',value:'17:00',style:{flex:1}})),
h('div',{style:{marginBottom:'8px'}},h('label',{className:'fl'},'วันหยุดประจำ (เลือกได้หลายวัน)'),
h('div',{className:'pg',id:'nd'},...DAYF.map((d,i)=>h('button',{className:'pl',id:'nd-'+i,'data-day':i,onClick:e=>{e.target.classList.toggle('on');if(e.target.classList.contains('on')){e.target.style.borderColor='#10b981';e.target.style.background='#d1fae5';e.target.style.color='#10b981';}else{e.target.style.borderColor='transparent';e.target.style.background='#f8fafc';e.target.style.color='#64748b';}}},d)))),
h('button',{className:'btn',style:{background:'#3b82f6'},onClick:async()=>{
const name=document.getElementById('nn').value.trim(),email=document.getElementById('ne').value.trim();
const shift=document.getElementById('ns').value,ss=document.getElementById('nss').value,se=document.getElementById('nse').value;
const offArr=[];document.querySelectorAll('#nd .pl.on').forEach(el=>offArr.push(el.dataset.day));
if(!name){toast('กรอกชื่อ',true);return;}
try{await api('/api/employees','POST',{name,nickname:name,email:email||null,default_shift:shift,shift_start:ss,shift_end:se,default_off_day:offArr.join(',')||'6'});toast('✅ เพิ่มสำเร็จ');load();}catch(er){toast(er.message,true);}}},'+ เพิ่มพนักงาน')));
o.appendChild(m);return o;}

function rEditEmp(){const emp=S.emp.find(e=>e.id===S.se);if(!emp)return h('div');
const o=h('div',{className:'mo',onClick:()=>{S.modal='employee';render();}});const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'✏️ แก้ไข: '+dn(emp)),h('button',{className:'mc',onClick:()=>{S.modal='employee';render();}},'✕')));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'ชื่อ'),h('input',{type:'text',className:'fi',id:'en',value:emp.name||''})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'ชื่อเล่น'),h('input',{type:'text',className:'fi',id:'enn',value:emp.nickname||''})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'Email'),h('input',{type:'email',className:'fi',id:'ee',value:emp.email||''})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'กะ'),h('select',{className:'fi',id:'es',innerHTML:'<option value="day"'+(emp.default_shift==='day'?' selected':'')+'>☀️ กลางวัน</option><option value="evening"'+(emp.default_shift==='evening'?' selected':'')+'>🌙 กลางคืน</option>'})));
m.appendChild(h('div',{className:'fg',style:{display:'flex',gap:'8px'}},h('div',{style:{flex:1}},h('label',{className:'fl'},'เริ่มงาน'),h('input',{type:'time',className:'fi',id:'ess',value:emp.shift_start||'09:00'})),h('div',{style:{flex:1}},h('label',{className:'fl'},'เลิกงาน'),h('input',{type:'time',className:'fi',id:'ese',value:emp.shift_end||'17:00'}))));
const curOff=offDays(emp);
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'วันหยุดประจำ'),
h('div',{className:'pg',id:'ed'},...DAYF.map((d,i)=>{const on=curOff.includes(i);return h('button',{className:'pl'+(on?' on':''),id:'ed-'+i,'data-day':i,
style:on?{borderColor:'#10b981',background:'#d1fae5',color:'#10b981'}:{},
onClick:e=>{e.target.classList.toggle('on');if(e.target.classList.contains('on')){e.target.style.borderColor='#10b981';e.target.style.background='#d1fae5';e.target.style.color='#10b981';}else{e.target.style.borderColor='transparent';e.target.style.background='#f8fafc';e.target.style.color='#64748b';}}},d);}))));
m.appendChild(h('button',{className:'btn',style:{background:'#3b82f6'},onClick:async()=>{
const offArr=[];document.querySelectorAll('#ed .pl.on').forEach(el=>offArr.push(el.dataset.day));
try{await api('/api/employees/'+emp.id,'PUT',{
name:document.getElementById('en').value.trim(),nickname:document.getElementById('enn').value.trim(),
email:document.getElementById('ee').value.trim()||null,default_shift:document.getElementById('es').value,
shift_start:document.getElementById('ess').value,shift_end:document.getElementById('ese').value,
default_off_day:offArr.join(',')||'6'});toast('✅ แก้ไขสำเร็จ');S.modal='employee';load();}catch(er){toast(er.message,true);}}},'บันทึก'));
m.appendChild(h('button',{className:'btn',style:{background:'#ef4444',marginTop:'8px'},onClick:async()=>{if(!confirm('ลบพนักงาน '+dn(emp)+' ?'))return;try{await api('/api/employees/'+emp.id,'DELETE');toast('ลบสำเร็จ');S.modal='employee';load();}catch(er){toast(er.message,true);}}},'🗑️ ลบพนักงาน'));
o.appendChild(m);return o;}

function rPrf(){const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'👤 โปรไฟล์'),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
const me=S.emp.find(e=>e.id===U.id)||U;
m.appendChild(h('div',{style:{textAlign:'center',marginBottom:'20px'}},me.profile_image?h('img',{src:me.profile_image,className:'pil'}):h('div',{className:'pel'},me.avatar),h('div',{style:{fontSize:'12px',color:'#94a3b8',marginTop:'6px'}},me.email)));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'ชื่อที่แสดง'),h('input',{type:'text',className:'fi',id:'pn',value:me.nickname||me.name||''})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'ไอคอน'),h('input',{type:'text',className:'fi',id:'pa',value:me.avatar||'👤',style:{fontSize:'24px'}})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'เบอร์โทร'),h('input',{type:'tel',className:'fi',id:'pp',value:me.phone||'',placeholder:'0xx-xxx-xxxx'})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'LINE ID'),h('input',{type:'text',className:'fi',id:'pl',value:me.line_id||''})));
m.appendChild(h('button',{className:'btn',style:{background:'#3b82f6'},onClick:async()=>{try{await api('/api/me','PUT',{nickname:document.getElementById('pn').value.trim(),avatar:document.getElementById('pa').value.trim()||'👤',phone:document.getElementById('pp').value.trim()||null,line_id:document.getElementById('pl').value.trim()||null});toast('✅ อัพเดทสำเร็จ');U.nickname=document.getElementById('pn').value.trim();U.avatar=document.getElementById('pa').value.trim()||'👤';S.modal=null;load();}catch(er){toast(er.message,true);}}},'บันทึก'));
o.appendChild(m);return o;}

function rSet(){const o=h('div',{className:'mo',onClick:()=>{S.modal=null;render();}});const m=h('div',{className:'md',onClick:e=>e.stopPropagation()});
m.appendChild(h('div',{className:'mh'},h('div',{className:'mt'},'⚙️ ตั้งค่า'),h('button',{className:'mc',onClick:()=>{S.modal=null;render();}},'✕')));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'ชื่อบริษัท'),h('input',{type:'text',className:'fi',id:'sc',value:S.set.company_name||''})));
m.appendChild(h('div',{className:'fg'},h('label',{className:'fl'},'วันหยุดบริษัท/ปี'),h('input',{type:'number',className:'fi',id:'sh',value:S.set.company_holidays_per_year||'20'})));
m.appendChild(h('div',{style:{background:'#f8fafc',borderRadius:'10px',padding:'14px',marginBottom:'16px'}},
h('div',{style:{fontSize:'13px',fontWeight:700,color:'#475569',marginBottom:'8px'}},'📊 สรุป'),
h('div',{style:{fontSize:'14px'}},'วันหยุดนักขัตฤกษ์เดือนนี้: '+Object.keys(S.hol).length+' วัน'),
h('div',{style:{fontSize:'14px',marginTop:'4px'}},'วันหยุดบริษัท/ปี: '+(S.set.company_holidays_per_year||20)+' วัน')));
m.appendChild(h('button',{className:'btn',style:{background:'#3b82f6'},onClick:async()=>{try{await api('/api/settings','PUT',{company_name:document.getElementById('sc').value,company_holidays_per_year:document.getElementById('sh').value});toast('✅ บันทึกสำเร็จ');load();}catch(er){toast(er.message,true);}}},'บันทึก'));
o.appendChild(m);return o;}

load();
</script></body></html>`;
}

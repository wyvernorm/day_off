import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/shared/Toast';
import { LEAVE_TYPES } from '@/lib/constants';
import { cn, fmtDateTH, displayName } from '@/lib/utils';
import { Check, X, Clock, ArrowLeftRight, CalendarOff, AlertCircle, ChevronDown, MessageSquare } from 'lucide-react';

export default function PendingPage() {
  const { user, canApprove } = useAuth();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const now = new Date();
      const mo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const [overview, selfDayoff] = await Promise.all([
        api(`/api/overview?month=${mo}`),
        canApprove ? api('/api/self-dayoff').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
      ]);
      setData({
        leaves: (overview.data.leaves || []).filter(l => l.status === 'pending'),
        swaps: (overview.data.swapRequests || []).filter(s => s.status === 'pending'),
        selfDayoffs: (selfDayoff.data || []).filter(s => s.status === 'pending'),
        employees: overview.data.employees || [],
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function getEmpName(id) {
    const emp = data?.employees?.find(e => e.id === id);
    return emp ? displayName(emp) : `#${id}`;
  }
  function getEmpAvatar(id) {
    const emp = data?.employees?.find(e => e.id === id);
    return emp?.profile_image || null;
  }
  function getEmpIcon(id) {
    const emp = data?.employees?.find(e => e.id === id);
    return emp?.avatar || '👤';
  }

  async function approveLeave(id) {
    setProcessing(id);
    try {
      await api(`/api/leaves/${id}/approve`, 'PUT');
      toast('✅ อนุมัติลาสำเร็จ');
      loadData();
    } catch (e) { toast(e.message, 'error'); }
    finally { setProcessing(null); }
  }

  async function rejectLeave(id) {
    setProcessing(id);
    try {
      await api(`/api/leaves/${id}/reject`, 'PUT', { reject_reason: rejectReason });
      toast('❌ ปฏิเสธลาสำเร็จ');
      setRejectId(null);
      setRejectReason('');
      loadData();
    } catch (e) { toast(e.message, 'error'); }
    finally { setProcessing(null); }
  }

  async function handleSwap(id, action) {
    setProcessing(id);
    try {
      await api(`/api/swaps/${id}/${action}`, 'PUT');
      toast(action === 'approve' ? '✅ อนุมัติสลับสำเร็จ' : '❌ ปฏิเสธสลับสำเร็จ');
      loadData();
    } catch (e) { toast(e.message, 'error'); }
    finally { setProcessing(null); }
  }

  async function handleSelfDayoff(id, action) {
    setProcessing(id);
    try {
      await api(`/api/self-dayoff/${id}/${action}`, 'PUT');
      toast(action === 'approve' ? '✅ อนุมัติย้ายวันหยุดสำเร็จ' : '❌ ปฏิเสธย้ายวันหยุดสำเร็จ');
      loadData();
    } catch (e) { toast(e.message, 'error'); }
    finally { setProcessing(null); }
  }

  // Group consecutive leaves by employee
  function groupLeaves(leaves) {
    const groups = [];
    const sorted = [...leaves].sort((a, b) => `${a.employee_id}_${a.date}`.localeCompare(`${b.employee_id}_${b.date}`));
    let current = null;
    sorted.forEach(l => {
      if (current && current.employee_id === l.employee_id && current.leave_type === l.leave_type) {
        const lastDate = new Date(current.dates[current.dates.length - 1]);
        const thisDate = new Date(l.date);
        const diff = (thisDate - lastDate) / 86400000;
        if (diff <= 3) { // allow gaps for weekends
          current.dates.push(l.date);
          current.ids.push(l.id);
          return;
        }
      }
      current = { employee_id: l.employee_id, leave_type: l.leave_type, reason: l.reason, dates: [l.date], ids: [l.id] };
      groups.push(current);
    });
    return groups;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-sm">กำลังโหลด...</span>
      </div>
    );
  }

  const leaveGroups = groupLeaves(data?.leaves || []);
  const swaps = data?.swaps || [];
  const selfDayoffs = data?.selfDayoffs || [];
  const totalPending = leaveGroups.length + swaps.length + selfDayoffs.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">🔔 รออนุมัติ</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {totalPending > 0 ? `${totalPending} รายการรอดำเนินการ` : 'ไม่มีรายการรออนุมัติ'}
          </p>
        </div>
        {totalPending > 0 && (
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
            {totalPending}
          </span>
        )}
      </div>

      {totalPending === 0 ? (
        <div className="card p-16 flex flex-col items-center text-center text-slate-400">
          <div className="text-5xl mb-4">✨</div>
          <div className="text-lg font-semibold text-slate-600 dark:text-slate-300">ไม่มีรายการรออนุมัติ</div>
          <p className="text-sm mt-1">ทุกอย่างเรียบร้อยดี!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* PENDING LEAVES */}
          {leaveGroups.length > 0 && (
            <Section title="📋 ลางาน" count={leaveGroups.length}>
              {leaveGroups.map((group, gi) => {
                const lt = LEAVE_TYPES[group.leave_type] || {};
                const isMulti = group.dates.length > 1;
                return (
                  <div key={gi} className="card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <Avatar id={group.employee_id} getAvatar={getEmpAvatar} getIcon={getEmpIcon} />

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">{getEmpName(group.employee_id)}</span>
                          <span className={cn('badge text-[10px] border', lt.color || 'bg-slate-100')}>
                            {lt.icon} {lt.label}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          {isMulti ? (
                            <span>📅 {fmtDateTH(group.dates[0])} — {fmtDateTH(group.dates[group.dates.length - 1])} <span className="font-semibold">({group.dates.length} วัน)</span></span>
                          ) : (
                            <span>📅 {fmtDateTH(group.dates[0])}</span>
                          )}
                        </div>
                        {group.reason && (
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {group.reason}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {canApprove && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            disabled={processing === group.ids[0]}
                            onClick={() => {
                              // Approve all in group
                              group.ids.forEach(id => approveLeave(id));
                            }}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors disabled:opacity-50"
                            title="อนุมัติ"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            disabled={processing === group.ids[0]}
                            onClick={() => setRejectId(group.ids[0])}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors disabled:opacity-50"
                            title="ปฏิเสธ"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reject reason input */}
                    {rejectId === group.ids[0] && (
                      <div className="mt-3 pl-12 animate-fade-in">
                        <input
                          type="text"
                          placeholder="เหตุผลที่ปฏิเสธ (ไม่บังคับ)"
                          className="input text-sm mb-2"
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { group.ids.forEach(id => rejectLeave(id)); }} className="btn-danger text-xs px-4 py-1.5">ยืนยันปฏิเสธ</button>
                          <button onClick={() => { setRejectId(null); setRejectReason(''); }} className="btn-ghost text-xs px-4 py-1.5">ยกเลิก</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Section>
          )}

          {/* PENDING SWAPS */}
          {swaps.length > 0 && (
            <Section title="🔄 สลับกะ/วันหยุด" count={swaps.length}>
              {swaps.map(sw => (
                <div key={sw.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-lg shrink-0">
                      <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-sm font-semibold flex-wrap">
                        <span>{sw.from_nick || getEmpName(sw.from_employee_id)}</span>
                        <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sw.to_nick || getEmpName(sw.to_employee_id)}</span>
                        <span className={cn('badge text-[10px] ml-1', sw.swap_type === 'dayoff' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                          {sw.swap_type === 'dayoff' ? '📅 สลับวันหยุด' : '🔄 สลับกะ'}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        📅 {fmtDateTH(sw.date)}
                        {sw.date2 && <span> ↔ {fmtDateTH(sw.date2)}</span>}
                      </div>
                      {sw.reason && (
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {sw.reason}
                        </div>
                      )}
                    </div>
                    {canApprove && (
                      <div className="flex gap-2 shrink-0">
                        <button disabled={processing === sw.id} onClick={() => handleSwap(sw.id, 'approve')} className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors disabled:opacity-50"><Check className="w-5 h-5" /></button>
                        <button disabled={processing === sw.id} onClick={() => handleSwap(sw.id, 'reject')} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* PENDING SELF DAY-OFF */}
          {selfDayoffs.length > 0 && (
            <Section title="📅 ย้ายวันหยุด" count={selfDayoffs.length}>
              {selfDayoffs.map(sd => (
                <div key={sd.id} className="card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-lg shrink-0">
                      <CalendarOff className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{getEmpName(sd.employee_id)}</div>
                      <div className="text-sm text-slate-500 mt-1">
                        หยุด {fmtDateTH(sd.off_date)} → ทำงานแทน {fmtDateTH(sd.work_date)}
                      </div>
                      {sd.reason && (
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> {sd.reason}
                        </div>
                      )}
                    </div>
                    {canApprove && (
                      <div className="flex gap-2 shrink-0">
                        <button disabled={processing === sd.id} onClick={() => handleSelfDayoff(sd.id, 'approve')} className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors disabled:opacity-50"><Check className="w-5 h-5" /></button>
                        <button disabled={processing === sd.id} onClick={() => handleSelfDayoff(sd.id, 'reject')} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors disabled:opacity-50"><X className="w-5 h-5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

/* Helper Components */
function Section({ title, count, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 mb-3 group">
        <h2 className="text-base font-bold">{title}</h2>
        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

function Avatar({ id, getAvatar, getIcon }) {
  const img = getAvatar(id);
  return img ? (
    <img src={img} className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0" alt="" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg shrink-0 shadow-sm">
      {getIcon(id)}
    </div>
  );
}

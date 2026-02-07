import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { MONTHS_TH, DAYS_SHORT, SHIFTS, LEAVE_TYPES } from '@/lib/constants';
import { cn, getDaysInMonth, dateKey, displayName } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid, Plus, ArrowLeftRight, CalendarOff, Users } from 'lucide-react';
import DayModal from '@/components/calendar/DayModal';

export default function CalendarPage() {
  const { user, isAdmin, canApprove } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('calendar');

  useEffect(() => { loadData(); }, [year, month]);

  async function loadData() {
    setLoading(true);
    try {
      const mo = `${year}-${String(month + 1).padStart(2, '0')}`;
      const res = await api(`/api/overview?month=${mo}`);
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function prevMonth() { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); }
  function nextMonth() { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); }
  function goToday() { setYear(now.getFullYear()); setMonth(now.getMonth()); }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const employees = (data?.employees || []).filter(e => e.show_in_calendar === 1);
  const shiftMap = {}; (data?.shifts || []).forEach(s => { shiftMap[`${s.employee_id}_${s.date}`] = s; });
  const leaveMap = {}; (data?.leaves || []).forEach(l => { leaveMap[`${l.employee_id}_${l.date}`] = l; });
  const holidayMap = {}; (data?.holidays || []).forEach(h => { holidayMap[h.date] = h; });

  function getEmpStatus(emp, dk) {
    const leave = leaveMap[`${emp.id}_${dk}`];
    if (leave && leave.status !== 'rejected') return { type: 'leave', leave_type: leave.leave_type, status: leave.status };
    const shift = shiftMap[`${emp.id}_${dk}`];
    if (shift) return { type: 'shift', shift_type: shift.shift_type };
    return { type: 'default', shift_type: emp.default_shift || 'day' };
  }

  function getHeadcount(dk) {
    return employees.filter(emp => {
      const s = getEmpStatus(emp, dk);
      if (s.type === 'leave') return false;
      if ((s.type === 'shift' || s.type === 'default') && s.shift_type === 'off') return false;
      return true;
    }).length;
  }

  // Build pill label like legacy: "น้ำตาล (หยุด)" or "ปุ่นปุ้ย (ลากิจ)"
  function getPillInfo(emp, dk) {
    const status = getEmpStatus(emp, dk);
    const name = emp.nickname || emp.name?.split(' ')[0];
    const avatar = emp.avatar || '👤';

    if (status.type === 'leave') {
      const lt = LEAVE_TYPES[status.leave_type] || {};
      const isPending = status.status === 'pending';
      const label = `${name} (${lt.label || status.leave_type})`;
      return {
        label, avatar, isPending,
        bg: isPending ? 'bg-yellow-50 border-2 border-dashed border-yellow-300'
          : status.leave_type === 'sick' ? 'bg-red-50 border border-red-200'
          : status.leave_type === 'personal' ? 'bg-orange-50 border border-orange-200'
          : 'bg-blue-50 border border-blue-200',
        text: isPending ? 'text-yellow-700'
          : status.leave_type === 'sick' ? 'text-red-600'
          : status.leave_type === 'personal' ? 'text-orange-600'
          : 'text-blue-600',
        icon: isPending ? '⏳' : lt.icon,
        isOff: true,
      };
    }

    const st = status.shift_type || 'day';
    const sh = SHIFTS[st] || {};
    if (st === 'off') {
      return {
        label: `${name} (หยุด)`, avatar,
        bg: 'bg-red-50 border border-dashed border-red-300',
        text: 'text-red-500',
        icon: '😴', isOff: true,
      };
    }
    return {
      label: name, avatar,
      bg: st === 'day' ? 'bg-amber-50/80' : 'bg-indigo-50/80',
      text: st === 'day' ? 'text-amber-800' : 'text-indigo-700',
      icon: sh.icon || '☀️', isOff: false,
    };
  }

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 animate-in">
        {/* Month nav */}
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center min-w-[160px]">
            <h1 className="text-2xl font-extrabold tracking-tight">{MONTHS_TH[month]} {year + 543}</h1>
          </div>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={goToday} className="btn-ghost px-4 py-2 text-xs font-bold rounded-xl border-2" style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}>
            วันนี้
          </button>
          <div className="flex rounded-xl p-1 border" style={{ borderColor: 'var(--border)' }}>
            <button onClick={() => setView('calendar')} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1', view === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50')}>
              <Calendar className="w-3.5 h-3.5" /> ปฏิทิน
            </button>
            <button onClick={() => setView('roster')} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1', view === 'roster' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50')}>
              <LayoutGrid className="w-3.5 h-3.5" /> ตารางกะ
            </button>
          </div>
        </div>
      </div>

      {/* ─── Action Buttons (like legacy) ─── */}
      {isAdmin && (
        <div className="flex flex-wrap gap-2 mb-4 animate-in stagger-1">
          <a href="/legacy#tab-calendar" className="btn text-xs px-4 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
            <Plus className="w-3.5 h-3.5" /> ลางาน
          </a>
          <a href="/legacy#tab-calendar" className="btn text-xs px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100">
            <ArrowLeftRight className="w-3.5 h-3.5" /> สลับกะ
          </a>
          <a href="/legacy#tab-calendar" className="btn text-xs px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
            <CalendarOff className="w-3.5 h-3.5" /> สลับวันหยุด
          </a>
          <a href="/legacy#tab-calendar" className="btn text-xs px-4 py-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100">
            <CalendarOff className="w-3.5 h-3.5" /> ย้ายวันหยุด
          </a>
          <a href="/legacy#tab-calendar" className="btn text-xs px-4 py-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100">
            <Users className="w-3.5 h-3.5" /> จัดการพนักงาน
          </a>
        </div>
      )}

      {/* ─── Legend (top like legacy) ─── */}
      <div className="flex flex-wrap gap-3 mb-4 px-1 animate-in stagger-1">
        {Object.entries(SHIFTS).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span className="text-sm">{v.icon}</span> {v.label}
          </div>
        ))}
        {Object.entries(LEAVE_TYPES).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span className="text-sm">{v.icon}</span> {v.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="card p-24 flex flex-col items-center justify-center" style={{ color: 'var(--text-muted)' }}>
          <div className="animate-spin w-8 h-8 border-[3px] rounded-full mb-3" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
          <span className="text-sm font-medium">กำลังโหลด...</span>
        </div>
      ) : view === 'calendar' ? (
        <>
          {/* ─── Calendar Grid ─── */}
          <div className="card overflow-hidden animate-in stagger-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b" style={{ borderColor: 'var(--border)' }}>
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className={cn(
                  'text-center py-3 text-sm font-bold',
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''
                )} style={{ color: i !== 0 && i !== 6 ? 'var(--text-muted)' : undefined }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {/* Empty cells */}
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`e-${i}`} className="min-h-[140px] border-b border-r" style={{ background: 'var(--surface-alt)', borderColor: 'var(--border)' }} />
              ))}

              {/* Date cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1, dk = dateKey(year, month, day);
                const dow = new Date(year, month, day).getDay();
                const isHoliday = !!holidayMap[dk], isToday = dk === todayKey;
                const headcount = getHeadcount(dk), total = employees.length;
                const isSatSun = dow === 0 || dow === 6;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dk)}
                    className={cn(
                      'min-h-[140px] p-2 border-b border-r cursor-pointer transition-colors duration-150',
                      'hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
                      isToday && 'ring-2 ring-inset ring-blue-500',
                      isHoliday && 'bg-red-50/40',
                      isSatSun && !isToday && !isHoliday && 'bg-amber-50/30',
                    )}
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {/* Date number + headcount */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={cn(
                        'text-sm font-bold',
                        isToday ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs' : '',
                        dow === 0 && !isToday ? 'text-red-500' : '',
                        dow === 6 && !isToday ? 'text-blue-500' : '',
                      )}>
                        {day}
                      </span>
                      {total > 0 && (
                        <span className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-lg',
                          headcount === total ? 'text-emerald-700 bg-emerald-100' :
                          headcount < total * 0.6 ? 'text-red-600 bg-red-100' :
                          'text-amber-700 bg-amber-100'
                        )}>
                          👥 {headcount}/{total}
                        </span>
                      )}
                    </div>

                    {/* Holiday label */}
                    {isHoliday && (
                      <div className="text-[10px] text-red-500 font-bold truncate mb-1 bg-red-100 rounded px-1 py-0.5 inline-block">
                        🔴 {holidayMap[dk].name}
                      </div>
                    )}

                    {/* Employee pills — RICH like legacy */}
                    <div className="space-y-[2px]">
                      {employees.map(emp => {
                        const pill = getPillInfo(emp, dk);
                        return (
                          <div key={emp.id} className={cn(
                            'flex items-center gap-1 px-1.5 py-[3px] rounded-lg text-[11px] font-semibold truncate',
                            pill.bg, pill.text,
                          )}>
                            <span className="text-[10px] shrink-0">{pill.avatar}</span>
                            <span className="truncate">{pill.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* ─── Roster View ─── */
        <div className="space-y-4">
          {employees.map((emp, idx) => {
            const days = Array.from({ length: daysInMonth }, (_, i) => {
              const dk = dateKey(year, month, i + 1);
              return { day: i + 1, dk, ...getEmpStatus(emp, dk), isToday: dk === todayKey };
            });
            return (
              <div key={emp.id} className={cn('card p-5 animate-in', `stagger-${Math.min(idx + 1, 4)}`)}>
                <div className="flex items-center gap-3 mb-4">
                  {emp.profile_image ? (
                    <img src={emp.profile_image} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md" alt="" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md" style={{ background: 'var(--brand-light)' }}>
                      {emp.avatar || '👤'}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold">{displayName(emp)}</div>
                    <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
                      {emp.shift_start || '09:00'} - {emp.shift_end || '17:00'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {days.map(d => {
                    let bg, text;
                    if (d.type === 'leave') {
                      const isPending = d.status === 'pending';
                      bg = isPending ? 'bg-yellow-100 border border-dashed border-yellow-300'
                        : d.leave_type === 'sick' ? 'bg-red-100' : d.leave_type === 'personal' ? 'bg-orange-100' : 'bg-blue-100';
                      text = isPending ? 'text-yellow-700' : d.leave_type === 'sick' ? 'text-red-600' : d.leave_type === 'personal' ? 'text-orange-600' : 'text-blue-600';
                    } else {
                      const st = d.shift_type || 'day';
                      bg = st === 'day' ? 'bg-amber-50' : st === 'evening' ? 'bg-indigo-100' : 'bg-slate-100';
                      text = st === 'day' ? 'text-amber-700' : st === 'evening' ? 'text-indigo-700' : 'text-slate-400';
                    }
                    return (
                      <button key={d.day} onClick={() => setSelectedDate(d.dk)} className={cn(
                        'aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all',
                        'hover:ring-2 hover:ring-blue-300 cursor-pointer',
                        d.isToday && 'ring-2 ring-blue-500',
                        bg, text,
                      )}>
                        <span className="text-[9px] opacity-50">{d.day}</span>
                        <span className="text-xs">
                          {d.type === 'leave' ? LEAVE_TYPES[d.leave_type]?.icon : SHIFTS[d.shift_type]?.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Day Modal ─── */}
      {selectedDate && (
        <DayModal date={selectedDate} employees={employees} shiftMap={shiftMap} leaveMap={leaveMap} holidayMap={holidayMap} onClose={() => setSelectedDate(null)} onRefresh={loadData} />
      )}
    </div>
  );
}

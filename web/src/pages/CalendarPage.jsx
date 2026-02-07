import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { MONTHS_TH, DAYS_SHORT, SHIFTS, LEAVE_TYPES } from '@/lib/constants';
import { cn, getDaysInMonth, dateKey, displayName } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Users, Calendar, LayoutGrid } from 'lucide-react';
import DayModal from '@/components/calendar/DayModal';

export default function CalendarPage() {
  const { user, isAdmin } = useAuth();
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

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  // Pill styles
  const PILL_STYLES = {
    day: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400' },
    evening: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-400' },
    off: { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-400', dot: 'bg-slate-300' },
    sick: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-300', dot: 'bg-red-400' },
    personal: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-300', dot: 'bg-orange-400' },
    vacation: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-300', dot: 'bg-blue-400' },
    pending: { bg: 'bg-yellow-50 dark:bg-yellow-900/20 border border-dashed border-yellow-300 dark:border-yellow-600', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-400' },
  };

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-6 animate-in">
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="btn-ghost p-2.5 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="btn-ghost p-2.5 rounded-xl">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="ml-3">
            <h1 className="text-xl font-extrabold tracking-tight leading-tight">{MONTHS_TH[month]}</h1>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>พ.ศ. {year + 543}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-4 py-2 text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
            วันนี้
          </button>
          <div className="flex rounded-xl p-1" style={{ background: 'var(--surface-alt)' }}>
            <button onClick={() => setView('calendar')} className={cn('p-2 rounded-lg transition-all', view === 'calendar' && 'bg-white dark:bg-slate-700 shadow-sm')}>
              <Calendar className="w-4 h-4" />
            </button>
            <button onClick={() => setView('roster')} className={cn('p-2 rounded-lg transition-all', view === 'roster' && 'bg-white dark:bg-slate-700 shadow-sm')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-24 flex flex-col items-center justify-center animate-in" style={{ color: 'var(--text-muted)' }}>
          <div className="animate-spin w-8 h-8 border-[3px] rounded-full mb-3" style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }} />
          <span className="text-sm font-medium">กำลังโหลด...</span>
        </div>
      ) : view === 'calendar' ? (
        <>
          {/* ─── Calendar Grid ─── */}
          <div className="card overflow-hidden animate-in stagger-1">
            {/* Day headers */}
            <div className="grid grid-cols-7" style={{ background: 'var(--surface-alt)' }}>
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className={cn('text-center py-3 text-xs font-bold tracking-widest uppercase',
                  i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : ''
                )} style={{ color: i !== 0 && i !== 6 ? 'var(--text-muted)' : undefined }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {/* Empty cells */}
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`e-${i}`} className="min-h-[120px] border-b border-r" style={{ background: 'var(--surface-alt)', opacity: 0.5, borderColor: 'var(--border)' }} />
              ))}

              {/* Date cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1, dk = dateKey(year, month, day);
                const dow = new Date(year, month, day).getDay();
                const isHoliday = !!holidayMap[dk], isToday = dk === todayKey;
                const headcount = getHeadcount(dk), total = employees.length;
                const hcColor = headcount === total ? 'text-emerald-600 bg-emerald-50' : headcount < total * 0.6 ? 'text-red-500 bg-red-50' : 'text-slate-500 bg-slate-100';

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDate(dk)}
                    className={cn(
                      'min-h-[120px] p-2 border-b border-r cursor-pointer transition-all duration-200',
                      'hover:bg-blue-50/60 dark:hover:bg-blue-900/10 hover:z-10',
                      isToday && 'ring-2 ring-inset',
                      isHoliday && 'bg-red-50/30 dark:bg-red-900/10',
                    )}
                    style={{
                      borderColor: 'var(--border)',
                      ...(isToday ? { ringColor: 'var(--brand)' } : {}),
                      ...(dow === 0 || dow === 6 ? { background: !isToday && !isHoliday ? 'var(--surface-alt)' : undefined } : {}),
                    }}
                  >
                    {/* Date + Headcount */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={cn(
                        'text-sm font-bold',
                        isToday ? 'text-white w-7 h-7 rounded-full flex items-center justify-center text-xs' : '',
                        dow === 0 && !isToday ? 'text-red-400' : '',
                        dow === 6 && !isToday ? 'text-blue-400' : '',
                      )} style={isToday ? { background: 'var(--brand)' } : {}}>
                        {day}
                      </div>
                      {total > 0 && (
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-lg', hcColor)}>
                          {headcount}/{total}
                        </span>
                      )}
                    </div>

                    {/* Holiday */}
                    {isHoliday && (
                      <div className="text-[10px] text-red-500 font-bold truncate mb-1">
                        🔴 {holidayMap[dk].name}
                      </div>
                    )}

                    {/* Employee pills */}
                    <div className="space-y-[3px]">
                      {employees.slice(0, 5).map(emp => {
                        const status = getEmpStatus(emp, dk);
                        let styleKey;
                        if (status.type === 'leave') {
                          styleKey = status.status === 'pending' ? 'pending' : status.leave_type;
                        } else {
                          styleKey = status.shift_type || 'day';
                        }
                        const ps = PILL_STYLES[styleKey] || PILL_STYLES.day;

                        return (
                          <div key={emp.id} className={cn('flex items-center gap-1 px-1.5 py-[3px] rounded-lg text-[11px] font-semibold truncate', ps.bg, ps.text)}>
                            <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', ps.dot)} />
                            <span className="truncate">{emp.nickname || emp.name?.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                      {employees.length > 5 && (
                        <div className="text-[10px] font-medium pl-1" style={{ color: 'var(--text-muted)' }}>+{employees.length - 5}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Legend ─── */}
          <div className="mt-5 flex flex-wrap gap-4 justify-center animate-in stagger-2">
            {Object.entries(SHIFTS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className={cn('w-2.5 h-2.5 rounded-full', PILL_STYLES[k]?.dot)} />
                <span className="font-medium">{v.label}</span>
              </div>
            ))}
            {Object.entries(LEAVE_TYPES).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className={cn('w-2.5 h-2.5 rounded-full', PILL_STYLES[k]?.dot)} />
                <span className="font-medium">{v.label}</span>
              </div>
            ))}
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
                    let styleKey;
                    if (d.type === 'leave') styleKey = d.status === 'pending' ? 'pending' : d.leave_type;
                    else styleKey = d.shift_type || 'day';
                    const ps = PILL_STYLES[styleKey] || PILL_STYLES.day;
                    return (
                      <button
                        key={d.day}
                        onClick={() => setSelectedDate(d.dk)}
                        className={cn(
                          'aspect-square rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all',
                          'hover:ring-2 hover:ring-blue-300 cursor-pointer',
                          d.isToday && 'ring-2',
                          ps.bg, ps.text,
                        )}
                        style={d.isToday ? { ringColor: 'var(--brand)' } : {}}
                      >
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

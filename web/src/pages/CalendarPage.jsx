import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { MONTHS_TH, DAYS_SHORT, SHIFTS, LEAVE_TYPES } from '@/lib/constants';
import { cn, getDaysInMonth, dateKey, displayName } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Users, Calendar } from 'lucide-react';
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

  return (
    <div>
      {/* Month Nav */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="ml-2">
            <h2 className="text-lg font-bold leading-tight">{MONTHS_TH[month]}</h2>
            <p className="text-xs text-slate-400">พ.ศ. {year + 543}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">วันนี้</button>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
            <button onClick={() => setView('calendar')} className={cn('px-3 py-1.5 rounded-md transition-all', view === 'calendar' ? 'bg-white dark:bg-slate-600 shadow-sm' : '')}>
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setView('roster')} className={cn('px-3 py-1.5 rounded-md transition-all', view === 'roster' ? 'bg-white dark:bg-slate-600 shadow-sm' : '')}>
              <Users className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-20 flex flex-col items-center justify-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
          <span className="text-sm">กำลังโหลด...</span>
        </div>
      ) : view === 'calendar' ? (
        <>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className={cn('text-center py-3 text-xs font-bold tracking-wider', i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400')}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`e-${i}`} className="min-h-[110px] bg-slate-50/50 dark:bg-slate-800/20 border-b border-r border-slate-100 dark:border-slate-700/50" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1, dk = dateKey(year, month, day);
                const dow = new Date(year, month, day).getDay();
                const isHoliday = !!holidayMap[dk], isToday = dk === todayKey;
                const headcount = getHeadcount(dk), total = employees.length;
                return (
                  <div key={day} onClick={() => setSelectedDate(dk)} className={cn(
                    'min-h-[110px] p-2 border-b border-r border-slate-100 dark:border-slate-700/50 relative group cursor-pointer transition-all duration-150',
                    'hover:bg-blue-50/70 dark:hover:bg-blue-900/10 hover:z-10',
                    isToday && 'bg-blue-50/40 dark:bg-blue-900/10',
                    isHoliday && 'bg-red-50/40 dark:bg-red-900/10',
                    (dow === 0 || dow === 6) && !isToday && !isHoliday && 'bg-slate-50/50 dark:bg-slate-800/30',
                  )}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={cn('text-sm font-bold', isToday ? 'bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs' : '', dow === 0 && !isToday ? 'text-red-400' : '', dow === 6 && !isToday ? 'text-blue-400' : '')}>{day}</div>
                      {total > 0 && (
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md', headcount === total ? 'bg-emerald-100 text-emerald-600' : headcount < total * 0.6 ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500')}>
                          👥{headcount}/{total}
                        </span>
                      )}
                    </div>
                    {isHoliday && <div className="text-[10px] text-red-500 font-semibold truncate mb-1">🔴 {holidayMap[dk].name}</div>}
                    <div className="space-y-[3px]">
                      {employees.slice(0, 5).map(emp => {
                        const status = getEmpStatus(emp, dk);
                        let pillClass, pillIcon;
                        if (status.type === 'leave') {
                          const isPending = status.status === 'pending';
                          pillClass = isPending ? 'bg-yellow-100 text-yellow-700 border border-dashed border-yellow-300' : status.leave_type === 'sick' ? 'bg-red-100 text-red-600' : status.leave_type === 'personal' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600';
                          pillIcon = LEAVE_TYPES[status.leave_type]?.icon || '📋';
                        } else {
                          const st = status.shift_type || 'day';
                          pillClass = st === 'day' ? 'bg-amber-50 text-amber-700' : st === 'evening' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400';
                          pillIcon = SHIFTS[st]?.icon || '☀️';
                        }
                        return (
                          <div key={emp.id} className={cn('flex items-center gap-1 px-1.5 py-[2px] rounded text-[11px] font-medium truncate', pillClass)}>
                            <span className="text-[10px]">{pillIcon}</span>
                            <span className="truncate">{emp.nickname || emp.name?.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                      {employees.length > 5 && <div className="text-[10px] text-slate-400 pl-1">+{employees.length - 5}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 justify-center">
            {Object.entries(SHIFTS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 text-sm text-slate-500"><span>{v.icon}</span><span>{v.label}</span></div>
            ))}
            {Object.entries(LEAVE_TYPES).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 text-sm text-slate-500"><span>{v.icon}</span><span>{v.label}</span></div>
            ))}
          </div>
        </>
      ) : (
        /* ROSTER VIEW */
        <div className="space-y-3">
          {employees.map(emp => {
            const days = Array.from({ length: daysInMonth }, (_, i) => {
              const dk = dateKey(year, month, i + 1);
              return { day: i + 1, dk, ...getEmpStatus(emp, dk), isToday: dk === todayKey };
            });
            return (
              <div key={emp.id} className="card p-4">
                <div className="flex items-center gap-3 mb-3">
                  {emp.profile_image ? <img src={emp.profile_image} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">{emp.avatar || '👤'}</div>}
                  <div>
                    <div className="text-sm font-bold">{displayName(emp)}</div>
                    <div className="text-[11px] text-slate-400">{emp.shift_start || '09:00'} - {emp.shift_end || '17:00'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map(d => (
                    <button key={d.day} onClick={() => setSelectedDate(d.dk)} className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold transition-all hover:ring-2 hover:ring-blue-300 cursor-pointer',
                      d.isToday && 'ring-2 ring-blue-500',
                      d.type === 'leave' ? (d.status === 'pending' ? 'bg-yellow-100 border border-dashed border-yellow-300' : d.leave_type === 'sick' ? 'bg-red-100 text-red-600' : d.leave_type === 'personal' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600')
                        : (d.shift_type === 'day' ? 'bg-amber-50 text-amber-700' : d.shift_type === 'evening' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'),
                    )}>
                      <span className="text-[9px] opacity-60">{d.day}</span>
                      <span className="text-xs">{d.type === 'leave' ? LEAVE_TYPES[d.leave_type]?.icon : SHIFTS[d.shift_type]?.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <DayModal date={selectedDate} employees={employees} shiftMap={shiftMap} leaveMap={leaveMap} holidayMap={holidayMap} onClose={() => setSelectedDate(null)} onRefresh={loadData} />
      )}
    </div>
  );
}

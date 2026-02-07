import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { MONTHS_TH, DAYS_SHORT, SHIFTS, LEAVE_TYPES } from '@/lib/constants';
import { cn, getDaysInMonth, dateKey, displayName } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const { user, isAdmin } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [year, month]);

  async function loadData() {
    setLoading(true);
    try {
      const mo = `${year}-${String(month + 1).padStart(2, '0')}`;
      const res = await api(`/api/overview?month=${mo}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const employees = (data?.employees || []).filter((e) => e.show_in_calendar === 1);

  // Build lookup maps
  const shiftMap = {};
  (data?.shifts || []).forEach((s) => {
    const k = `${s.employee_id}_${s.date}`;
    shiftMap[k] = s;
  });
  const leaveMap = {};
  (data?.leaves || []).forEach((l) => {
    const k = `${l.employee_id}_${l.date}`;
    leaveMap[k] = l;
  });
  const holidayMap = {};
  (data?.holidays || []).forEach((h) => { holidayMap[h.date] = h; });

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="btn-ghost p-2 rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{MONTHS_TH[month]}</h2>
          <p className="text-sm text-slate-500">พ.ศ. {year + 543}</p>
        </div>
        <button onClick={nextMonth} className="btn-ghost p-2 rounded-xl">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="card p-20 flex items-center justify-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full" />
          <span className="ml-3">กำลังโหลด...</span>
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="card overflow-hidden">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50">
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className={cn(
                  'text-center py-2 text-xs font-semibold',
                  i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-500'
                )}>
                  {d}
                </div>
              ))}
            </div>

            {/* Date Cells */}
            <div className="grid grid-cols-7">
              {/* Empty cells before first day */}
              {Array.from({ length: firstDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="min-h-[80px] border-t border-r border-slate-100 dark:border-slate-700/50" />
              ))}

              {/* Date cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dk = dateKey(year, month, day);
                const dow = new Date(year, month, day).getDay();
                const isHoliday = !!holidayMap[dk];
                const isToday = dk === dateKey(now.getFullYear(), now.getMonth(), now.getDate());

                return (
                  <div
                    key={day}
                    className={cn(
                      'min-h-[80px] p-1.5 border-t border-r border-slate-100 dark:border-slate-700/50 relative',
                      'hover:bg-blue-50/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer',
                      isHoliday && 'bg-red-50/50 dark:bg-red-900/10',
                    )}
                  >
                    {/* Date Number */}
                    <div className={cn(
                      'text-xs font-medium mb-1',
                      isToday && 'bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center',
                      dow === 0 && !isToday && 'text-red-500',
                      dow === 6 && !isToday && 'text-blue-500',
                    )}>
                      {day}
                    </div>

                    {/* Holiday label */}
                    {isHoliday && (
                      <div className="text-[9px] text-red-500 font-medium truncate">
                        {holidayMap[dk].name}
                      </div>
                    )}

                    {/* Employee indicators */}
                    <div className="flex flex-wrap gap-0.5">
                      {employees.slice(0, 6).map((emp) => {
                        const lk = `${emp.id}_${dk}`;
                        const leave = leaveMap[lk];
                        const shift = shiftMap[lk];

                        if (leave && leave.status !== 'rejected') {
                          const lt = LEAVE_TYPES[leave.leave_type];
                          return (
                            <span key={emp.id} className="text-[10px]" title={`${displayName(emp)}: ${lt?.label}`}>
                              {lt?.icon || '📋'}
                            </span>
                          );
                        }
                        if (shift) {
                          return (
                            <span key={emp.id} className="text-[10px]" title={`${displayName(emp)}: ${SHIFTS[shift.shift_type]?.label}`}>
                              {SHIFTS[shift.shift_type]?.icon || '•'}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee Legend */}
          <div className="mt-4 flex flex-wrap gap-2">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                {emp.profile_image ? (
                  <img src={emp.profile_image} className="w-4 h-4 rounded-full" alt="" />
                ) : (
                  <span>{emp.avatar || '👤'}</span>
                )}
                <span className="font-medium">{displayName(emp)}</span>
                <span className={cn('badge text-[9px]', SHIFTS[emp.default_shift]?.color)}>
                  {SHIFTS[emp.default_shift]?.icon}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

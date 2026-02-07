import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { LEAVE_TYPES, SHIFTS, MONTHS_TH } from '@/lib/constants';
import { cn, displayName, getDaysInMonth, dateKey } from '@/lib/utils';
import { BarChart3, Users, TrendingUp, Calendar, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export default function StatsPage() {
  const { user } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('overview'); // overview | employee

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

  const employees = useMemo(() => (data?.employees || []).filter(e => e.show_in_calendar === 1), [data]);
  const leaves = useMemo(() => data?.leaves || [], [data]);
  const shifts = useMemo(() => data?.shifts || [], [data]);
  const yearlyLeaves = data?.yearlyLeaves || {};
  const swapRequests = data?.swapRequests || [];
  const selfMoves = data?.selfMoves || [];

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const leaveCount = { sick: 0, personal: 0, vacation: 0 };
    leaves.forEach(l => { if (l.status !== 'rejected' && leaveCount[l.leave_type] !== undefined) leaveCount[l.leave_type]++; });

    const shiftCount = { day: 0, evening: 0, off: 0 };
    shifts.forEach(s => { if (shiftCount[s.shift_type] !== undefined) shiftCount[s.shift_type]++; });

    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const approvedSwaps = swapRequests.filter(s => s.status === 'approved').length;
    const daysInMo = getDaysInMonth(year, month);
    const totalSlots = employees.length * daysInMo;

    // Working days
    let workingDays = 0;
    for (let d = 1; d <= daysInMo; d++) {
      const dk = dateKey(year, month, d);
      employees.forEach(emp => {
        const hasLeave = leaves.find(l => l.employee_id === emp.id && l.date === dk && l.status !== 'rejected');
        const shift = shifts.find(s => s.employee_id === emp.id && s.date === dk);
        if (!hasLeave && shift?.shift_type !== 'off') workingDays++;
      });
    }

    return { leaveCount, shiftCount, pendingCount, approvedSwaps, totalSlots, workingDays, selfMoveCount: selfMoves.length };
  }, [leaves, shifts, employees, year, month, swapRequests, selfMoves]);

  // Per-employee stats
  const empStats = useMemo(() => {
    return employees.map(emp => {
      const yl = yearlyLeaves[emp.id] || {};
      const totalLeave = (yl.sick || 0) + (yl.personal || 0) + (yl.vacation || 0);
      const monthLeaves = leaves.filter(l => l.employee_id === emp.id && l.status !== 'rejected').length;
      const monthShifts = shifts.filter(s => s.employee_id === emp.id);
      const dayShifts = monthShifts.filter(s => s.shift_type === 'day').length;
      const eveningShifts = monthShifts.filter(s => s.shift_type === 'evening').length;
      const offShifts = monthShifts.filter(s => s.shift_type === 'off').length;
      const empSwaps = swapRequests.filter(s => (s.from_employee_id === emp.id || s.to_employee_id === emp.id) && s.status === 'approved').length;
      return { ...emp, yearlyLeave: yl, totalLeave, monthLeaves, dayShifts, eveningShifts, offShifts, swapCount: empSwaps };
    }).sort((a, b) => a.totalLeave - b.totalLeave);
  }, [employees, yearlyLeaves, leaves, shifts, swapRequests]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
        <span className="text-sm">กำลังโหลด...</span>
      </div>
    );
  }

  const { leaveCount, shiftCount, pendingCount, totalSlots, workingDays, approvedSwaps, selfMoveCount } = monthlyStats;
  const totalLeaves = leaveCount.sick + leaveCount.personal + leaveCount.vacation;
  const attendanceRate = totalSlots > 0 ? Math.round((workingDays / totalSlots) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="ml-2">
            <h1 className="text-xl font-bold">📊 สถิติ</h1>
            <p className="text-sm text-slate-400">{MONTHS_TH[month]} พ.ศ. {year + 543}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <SummaryCard icon="📊" label="อัตราเข้างาน" value={`${attendanceRate}%`} sub={`${workingDays}/${totalSlots} วัน-คน`}
          color={attendanceRate >= 90 ? 'text-emerald-600' : attendanceRate >= 70 ? 'text-amber-600' : 'text-red-600'} />
        <SummaryCard icon="📋" label="ลารวม (เดือนนี้)" value={totalLeaves} sub={pendingCount > 0 ? `${pendingCount} รอ` : 'อนุมัติแล้ว'}
          color={totalLeaves > employees.length ? 'text-red-600' : 'text-blue-600'} />
        <SummaryCard icon="🔄" label="สลับกะ" value={approvedSwaps} sub="อนุมัติแล้ว" color="text-purple-600" />
        <SummaryCard icon="📅" label="ย้ายวันหยุด" value={selfMoveCount} sub="ครั้ง (ปีนี้)" color="text-indigo-600" />
      </div>

      {/* Leave Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Leave by Type */}
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" /> การลาตามประเภท (เดือนนี้)
          </h3>
          <div className="space-y-3">
            {Object.entries(LEAVE_TYPES).map(([key, lt]) => {
              const count = leaveCount[key] || 0;
              const maxBar = Math.max(totalLeaves, 1);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{lt.icon} {lt.label}</span>
                    <span className="text-sm font-bold">{count} วัน</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500',
                        key === 'sick' ? 'bg-red-400' : key === 'personal' ? 'bg-orange-400' : 'bg-blue-400')}
                      style={{ width: `${(count / maxBar) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shift Breakdown */}
        <div className="card p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" /> กะทำงาน (เดือนนี้)
          </h3>
          <div className="space-y-3">
            {Object.entries(SHIFTS).map(([key, sh]) => {
              const count = shiftCount[key] || 0;
              const maxBar = Math.max(shiftCount.day, shiftCount.evening, shiftCount.off, 1);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{sh.icon} {sh.label}</span>
                    <span className="text-sm font-bold">{count} วัน-คน</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500',
                        key === 'day' ? 'bg-amber-400' : key === 'evening' ? 'bg-indigo-400' : 'bg-slate-400')}
                      style={{ width: `${(count / maxBar) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" /> สรุปรายบุคคล (ลาสะสมทั้งปี)
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {empStats.map((emp, idx) => (
          <div key={emp.id} className="card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              {emp.profile_image ? (
                <img src={emp.profile_image} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow" alt="" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg shadow">
                  {emp.avatar || '👤'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{displayName(emp)}</div>
                <div className="text-[11px] text-slate-400">
                  ลารวม <span className={cn('font-bold', emp.totalLeave > 10 ? 'text-red-500' : emp.totalLeave > 5 ? 'text-amber-500' : 'text-emerald-500')}>{emp.totalLeave}</span> วัน
                  {emp.swapCount > 0 && <span> • สลับ {emp.swapCount} ครั้ง</span>}
                </div>
              </div>
              {idx === 0 && empStats.length > 1 && <span className="text-lg" title="ลาน้อยที่สุด">🏆</span>}
            </div>

            {/* Leave breakdown bars */}
            <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              {(emp.yearlyLeave.sick || 0) > 0 && (
                <div className="bg-red-400 rounded-full" style={{ flex: emp.yearlyLeave.sick }} title={`ป่วย ${emp.yearlyLeave.sick}`} />
              )}
              {(emp.yearlyLeave.personal || 0) > 0 && (
                <div className="bg-orange-400 rounded-full" style={{ flex: emp.yearlyLeave.personal }} title={`กิจ ${emp.yearlyLeave.personal}`} />
              )}
              {(emp.yearlyLeave.vacation || 0) > 0 && (
                <div className="bg-blue-400 rounded-full" style={{ flex: emp.yearlyLeave.vacation }} title={`พักร้อน ${emp.yearlyLeave.vacation}`} />
              )}
              {emp.totalLeave === 0 && <div className="bg-emerald-300 flex-1 rounded-full" />}
            </div>

            {/* Legend */}
            <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
              <span>🏥 {emp.yearlyLeave.sick || 0}</span>
              <span>📋 {emp.yearlyLeave.personal || 0}</span>
              <span>✈️ {emp.yearlyLeave.vacation || 0}</span>
            </div>

            {/* Month shift summary */}
            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="badge text-[10px] bg-amber-50 text-amber-600">☀️ {emp.dayShifts}</span>
              <span className="badge text-[10px] bg-indigo-50 text-indigo-600">🌙 {emp.eveningShifts}</span>
              <span className="badge text-[10px] bg-slate-50 text-slate-500">😴 {emp.offShifts}</span>
              <span className="badge text-[10px] bg-red-50 text-red-500">📋 {emp.monthLeaves}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, sub, color }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-semibold text-slate-400">{label}</span>
      </div>
      <div className={cn('text-2xl font-bold', color)}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}

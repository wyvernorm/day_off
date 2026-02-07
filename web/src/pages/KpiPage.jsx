import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn, displayName } from '@/lib/utils';
import { MONTHS_TH } from '@/lib/constants';
import { ChevronLeft, ChevronRight, AlertTriangle, Users, Layers, DollarSign } from 'lucide-react';

export default function KpiPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(true); // true=whole year, false=month

  useEffect(() => { loadData(); }, [year, month, viewAll]);

  async function loadData() {
    setLoading(true);
    try {
      const params = viewAll ? `year=${year}` : `year=${year}&month=${String(month + 1)}`;
      const res = await api(`/api/kpi/summary?${params}`);
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function prevMonth() { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); }
  function nextMonth() { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); }

  const byEmployee = data?.byEmployee || [];
  const byCategory = data?.byCategory || [];
  const totals = data?.totals || { count: 0, points: 0, damage: 0 };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {!viewAll && (
            <>
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          <div className="ml-2">
            <h1 className="text-xl font-bold">⚡ KPI</h1>
            <p className="text-sm text-slate-400">{viewAll ? `ทั้งปี พ.ศ. ${year + 543}` : `${MONTHS_TH[month]} พ.ศ. ${year + 543}`}</p>
          </div>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 text-xs font-semibold">
          <button onClick={() => setViewAll(true)} className={cn('px-3 py-1.5 rounded-md transition-all', viewAll ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500')}>ทั้งปี</button>
          <button onClick={() => setViewAll(false)} className={cn('px-3 py-1.5 rounded-md transition-all', !viewAll ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500')}>รายเดือน</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-amber-600">{totals.count}</div>
          <div className="text-[11px] text-slate-400">ข้อผิดพลาด</div>
        </div>
        <div className="card p-4 text-center">
          <Layers className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-red-600">{totals.points}</div>
          <div className="text-[11px] text-slate-400">คะแนนหัก</div>
        </div>
        <div className="card p-4 text-center">
          <DollarSign className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-purple-600">{(totals.damage || 0).toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">ค่าเสียหาย (฿)</div>
        </div>
      </div>

      {totals.count === 0 ? (
        <div className="card p-16 text-center text-slate-400">
          <div className="text-5xl mb-4">🎉</div>
          <p className="font-semibold text-slate-600 dark:text-slate-300">ไม่มีข้อผิดพลาด!</p>
          <p className="text-sm mt-1">ทำได้ดีมาก</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* By Employee */}
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> ตามพนักงาน
            </h3>
            <div className="space-y-3">
              {byEmployee.map((emp, i) => {
                const maxPts = byEmployee[0]?.total_points || 1;
                return (
                  <div key={emp.employee_id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{emp.avatar || '👤'}</span>
                        <span className="text-sm font-medium">{emp.nickname || emp.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-red-600">{emp.total_points} pts</span>
                        <span className="text-[10px] text-slate-400 ml-1">({emp.error_count} ครั้ง)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500" style={{ width: `${(emp.total_points / maxPts) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Category */}
          <div className="card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" /> ตามหมวด
            </h3>
            <div className="space-y-3">
              {byCategory.map(cat => {
                const maxPts = byCategory[0]?.total_points || 1;
                return (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold" style={{ color: cat.color || '#6366f1' }}>{cat.total_points} pts</span>
                        <span className="text-[10px] text-slate-400 ml-1">({cat.error_count})</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(cat.total_points / maxPts) * 100}%`, background: cat.color || '#6366f1' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

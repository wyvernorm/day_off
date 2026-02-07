import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/shared/Toast';
import { LEAVE_TYPES } from '@/lib/constants';
import { cn, fmtDateTH, displayName } from '@/lib/utils';
import { Check, X, ArrowLeftRight, Trash2, ChevronDown } from 'lucide-react';

export default function HistoryPage() {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | approved | rejected

  useEffect(() => { loadData(); }, [year]);

  async function loadData() {
    setLoading(true);
    try {
      const res = await api(`/api/history?year=${year}`);
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function deleteItem(kind, id) {
    if (!confirm('ลบรายการนี้?')) return;
    try {
      await api(`/api/history/${kind}/${id}`, 'DELETE');
      toast('🗑️ ลบแล้ว');
      loadData();
    } catch (e) { toast(e.message, 'error'); }
  }

  const leaves = (data?.leaves || []).filter(l => filter === 'all' || l.status === filter);
  const swaps = (data?.swaps || []).filter(s => filter === 'all' || s.status === filter);
  const total = leaves.length + swaps.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="animate-spin w-8 h-8 border-[3px] border-blue-500 border-t-transparent rounded-full mb-3" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold">📜 ประวัติ</h1>
          <p className="text-sm text-slate-400">ปี พ.ศ. {year + 543} — {total} รายการ</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={year} onChange={e => setYear(+e.target.value)} className="input text-sm w-auto">
            {[now.getFullYear(), now.getFullYear() - 1].map(y => (
              <option key={y} value={y}>พ.ศ. {y + 543}</option>
            ))}
          </select>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 text-xs font-semibold">
            {[['all', 'ทั้งหมด'], ['approved', '✅'], ['rejected', '❌']].map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} className={cn('px-3 py-1.5 rounded-md transition-all', filter === k ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500')}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {total === 0 ? (
        <div className="card p-16 text-center text-slate-400">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-semibold">ไม่มีประวัติ</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Leaves */}
          {leaves.map(l => {
            const lt = LEAVE_TYPES[l.leave_type] || {};
            const isApproved = l.status === 'approved';
            return (
              <div key={`l-${l.id}`} className="card px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0', isApproved ? 'bg-emerald-100' : 'bg-red-100')}>
                  {isApproved ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold">{l.emp_nick || l.emp_name}</span>
                    <span className={cn('badge text-[10px]', lt.color || 'bg-slate-100')}>{lt.icon} {lt.label}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    📅 {fmtDateTH(l.date)}
                    {l.approver_nick && <span> • โดย {l.approver_nick}</span>}
                    {l.reject_reason && <span className="text-red-400"> • {l.reject_reason}</span>}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => deleteItem('leave', l.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Swaps */}
          {swaps.map(s => {
            const isApproved = s.status === 'approved';
            return (
              <div key={`s-${s.id}`} className="card px-4 py-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', isApproved ? 'bg-emerald-100' : 'bg-red-100')}>
                  {isApproved ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-sm font-semibold flex-wrap">
                    <span>{s.from_nick || s.from_name}</span>
                    <ArrowLeftRight className="w-3 h-3 text-slate-400" />
                    <span>{s.to_nick || s.to_name}</span>
                    <span className="badge text-[10px] bg-purple-100 text-purple-700">{s.swap_type === 'dayoff' ? '📅 สลับหยุด' : '🔄 สลับกะ'}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    📅 {fmtDateTH(s.date)}{s.date2 && ` ↔ ${fmtDateTH(s.date2)}`}
                    {s.approver_nick && <span> • โดย {s.approver_nick}</span>}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => deleteItem('swap', s.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

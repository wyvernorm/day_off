import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/shared/Toast';
import { SHIFTS, LEAVE_TYPES, DAYS_TH } from '@/lib/constants';
import { cn, fmtDateTH, displayName } from '@/lib/utils';
import { X, Sun, Moon, BedDouble, Trash2 } from 'lucide-react';

const SHIFT_BUTTONS = [
  { type: 'day', icon: '☀️', label: 'กลางวัน', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { type: 'evening', icon: '🌙', label: 'กลางคืน', color: 'bg-indigo-50 border-indigo-300 text-indigo-700' },
  { type: 'off', icon: '😴', label: 'วันหยุด', color: 'bg-slate-50 border-slate-300 text-slate-500' },
];

const LEAVE_BUTTONS = [
  { type: 'sick', icon: '🏥', label: 'ลาป่วย', color: 'bg-red-50 border-red-300 text-red-700' },
  { type: 'personal', icon: '📋', label: 'ลากิจ', color: 'bg-orange-50 border-orange-300 text-orange-700' },
  { type: 'vacation', icon: '✈️', label: 'ลาพักร้อน', color: 'bg-blue-50 border-blue-300 text-blue-700' },
];

export default function DayModal({ date, employees, shiftMap, leaveMap, holidayMap, onClose, onRefresh }) {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [expandedEmp, setExpandedEmp] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!date) return null;

  const [yr, mo, dy] = date.split('-').map(Number);
  const dow = new Date(yr, mo - 1, dy).getDay();
  const holiday = holidayMap[date];
  const working = employees.filter(emp => {
    const leave = leaveMap[`${emp.id}_${date}`];
    const shift = shiftMap[`${emp.id}_${date}`];
    const isOff = shift?.shift_type === 'off';
    const isLeave = leave && leave.status !== 'rejected';
    return !isOff && !isLeave;
  });

  async function setShift(empId, shiftType) {
    setSaving(true);
    try {
      // Remove any leave first
      const leaveKey = `${empId}_${date}`;
      if (leaveMap[leaveKey]) {
        await api(`/api/leaves/${leaveMap[leaveKey].id}`, 'DELETE');
      }
      await api('/api/shifts', 'POST', { employee_id: empId, date, shift_type: shiftType });
      toast(`${SHIFTS[shiftType]?.icon} เปลี่ยนกะสำเร็จ`);
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  async function setLeave(empId, leaveType, existingLeave) {
    setSaving(true);
    try {
      if (existingLeave && existingLeave.leave_type === leaveType) {
        await api(`/api/leaves/${existingLeave.id}`, 'DELETE');
        toast('❌ ยกเลิกลา');
      } else {
        await api('/api/leaves', 'POST', { employee_id: empId, date, leave_type: leaveType });
        toast(`${LEAVE_TYPES[leaveType]?.icon} ลงลาสำเร็จ`);
      }
      onRefresh();
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-lg max-h-[85vh] bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-5 py-4 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">📅 {fmtDateTH(date)}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn('text-xs font-medium', dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-slate-500')}>
                  {DAYS_TH[dow]}
                </span>
                {holiday && <span className="text-xs text-red-500 font-medium">🔴 {holiday.name}</span>}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  👥 {working.length}/{employees.length}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Employee List */}
        <div className="overflow-y-auto max-h-[70vh] px-4 py-3 space-y-2">
          {employees.map(emp => {
            const shiftKey = `${emp.id}_${date}`;
            const shift = shiftMap[shiftKey];
            const leave = leaveMap[shiftKey];
            const isExpanded = expandedEmp === emp.id;

            // Determine current status
            let statusBg, statusText, statusIcon;
            if (leave && leave.status !== 'rejected') {
              const lt = LEAVE_TYPES[leave.leave_type] || {};
              statusBg = leave.status === 'pending'
                ? 'bg-yellow-50 border-yellow-200 border-dashed'
                : leave.leave_type === 'sick' ? 'bg-red-50 border-red-200'
                : leave.leave_type === 'personal' ? 'bg-orange-50 border-orange-200'
                : 'bg-blue-50 border-blue-200';
              statusText = lt.label + (leave.status === 'pending' ? ' (รอ)' : '');
              statusIcon = lt.icon;
            } else if (shift) {
              const st = SHIFTS[shift.shift_type] || {};
              statusBg = shift.shift_type === 'day' ? 'bg-amber-50 border-amber-200'
                : shift.shift_type === 'evening' ? 'bg-indigo-50 border-indigo-200'
                : 'bg-slate-50 border-slate-200';
              statusText = st.label;
              statusIcon = st.icon;
            } else {
              const ds = SHIFTS[emp.default_shift] || SHIFTS.day;
              statusBg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
              statusText = ds.label + ' (ค่าเริ่มต้น)';
              statusIcon = ds.icon;
            }

            return (
              <div key={emp.id} className={cn('rounded-2xl border transition-all duration-200', statusBg)}>
                {/* Employee Row */}
                <div
                  className={cn('flex items-center gap-3 px-4 py-3', isAdmin && 'cursor-pointer')}
                  onClick={() => isAdmin && setExpandedEmp(isExpanded ? null : emp.id)}
                >
                  {/* Avatar */}
                  {emp.profile_image ? (
                    <img src={emp.profile_image} className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm" alt="" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-lg shadow-sm">
                      {emp.avatar || '👤'}
                    </div>
                  )}

                  {/* Name + Time */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{displayName(emp)}</div>
                    <div className="text-[11px] text-slate-400">
                      {emp.shift_start || '09:00'} - {emp.shift_end || '17:00'}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/60 dark:bg-slate-700/50 text-xs font-semibold">
                    <span>{statusIcon}</span>
                    <span>{statusText}</span>
                  </div>
                </div>

                {/* Admin: Shift/Leave Controls */}
                {isAdmin && isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 animate-fade-in">
                    {/* Shift Buttons */}
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">เปลี่ยนกะ</div>
                      <div className="flex gap-2">
                        {SHIFT_BUTTONS.map(sb => {
                          const isActive = !leave && shift?.shift_type === sb.type;
                          return (
                            <button
                              key={sb.type}
                              disabled={saving}
                              onClick={() => setShift(emp.id, sb.type)}
                              className={cn(
                                'flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all',
                                isActive ? sb.color + ' ring-2 ring-offset-1' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300',
                                saving && 'opacity-50'
                              )}
                            >
                              {sb.icon} {sb.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Leave Buttons */}
                    <div>
                      <div className="text-[11px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">ลางาน</div>
                      <div className="flex gap-2">
                        {LEAVE_BUTTONS.map(lb => {
                          const isActive = leave && leave.leave_type === lb.type && leave.status !== 'rejected';
                          return (
                            <button
                              key={lb.type}
                              disabled={saving}
                              onClick={() => setLeave(emp.id, lb.type, leave)}
                              className={cn(
                                'flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all',
                                isActive ? lb.color + ' ring-2 ring-offset-1' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300',
                                saving && 'opacity-50'
                              )}
                            >
                              {lb.icon} {lb.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

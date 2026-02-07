// =============================================
// 📋 Constants
// =============================================

export const SHIFTS = {
  day: { label: 'กลางวัน', icon: '☀️', color: 'bg-amber-100 text-amber-700' },
  evening: { label: 'กลางคืน', icon: '🌙', color: 'bg-indigo-100 text-indigo-700' },
  off: { label: 'วันหยุด', icon: '😴', color: 'bg-slate-100 text-slate-500' },
};

export const LEAVE_TYPES = {
  sick: { label: 'ลาป่วย', icon: '🏥', color: 'bg-red-100 text-red-700' },
  personal: { label: 'ลากิจ', icon: '📋', color: 'bg-orange-100 text-orange-700' },
  vacation: { label: 'ลาพักร้อน', icon: '✈️', color: 'bg-blue-100 text-blue-700' },
};

export const DAYS_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
export const DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
export const MONTHS_TH = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

export const ROLE_LEVEL = {
  owner: 100,
  admin: 80,
  approver: 60,
  employee: 40,
  tester: 20,
};

export const ROLE_LABELS = {
  owner: '👑 เจ้าของ',
  admin: '🛡️ แอดมิน',
  approver: '👮 ผู้อนุมัติ',
  employee: '👤 พนักงาน',
  tester: '🧪 ทดสอบ',
};

export const ROLE_COLORS = {
  owner: 'bg-amber-100 text-amber-700 border-amber-300',
  admin: 'bg-blue-100 text-blue-700 border-blue-300',
  approver: 'bg-purple-100 text-purple-700 border-purple-300',
  employee: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  tester: 'bg-slate-100 text-slate-500 border-slate-300',
};

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merge helper
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Thai date formatting
export function fmtDateTH(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${+y + 543}`;
}

export function fmtMonthTH(year, month) {
  const MONTHS = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  return `${MONTHS[month]} ${year + 543}`;
}

// Display name helper
export function displayName(emp) {
  return emp?.nickname || emp?.name || '—';
}

// Days in month
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Date key
export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

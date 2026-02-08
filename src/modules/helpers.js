// ==========================================
// 🎨 helpers.js
// UI Helper Functions - AI แก้ง่าย แค่ 150 บรรทัด!
// ==========================================

let _toastTimer;

/**
 * Show toast notification
 */
export function toast(msg, err = false) {
  const el = document.getElementById('toast');
  if (!el) return;
  
  el.textContent = msg;
  el.className = 'tst show' + (err ? ' err' : '');
  
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.className = 'tst';
  }, 2500);
}

/**
 * Create HTML element (h = helper)
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on')) el.addEventListener(k.substring(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  
  children.flat().forEach(c => {
    if (typeof c === 'string' || typeof c === 'number') {
      el.appendChild(document.createTextNode(c));
    } else if (c instanceof HTMLElement) {
      el.appendChild(c);
    }
  });
  
  return el;
}

/**
 * Date key (YYYY-MM-DD)
 */
export function dk(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}

/**
 * Is today?
 */
export function itd(y, m, d) {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
}

/**
 * Get day of week (0=Sun, 6=Sat)
 */
export function gdow(y, m, d) {
  return new Date(y, m, d).getDay();
}

/**
 * Get days in month
 */
export function gdim(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

/**
 * First day of month
 */
export function fdm(y, m) {
  return new Date(y, m, 1).getDay();
}

/**
 * Display name (nickname or name)
 */
export function dn(e) {
  return e.nickname || e.name;
}

/**
 * Shift time display
 */
export function stime(e) {
  return (e.shift_start || '09:00') + '-' + (e.shift_end || '17:00');
}

/**
 * Get employee's default off days
 */
export function offD(e) {
  return (e.default_off_day || '6').split(',').map(Number);
}

/**
 * Is employee off on this day?
 */
export function isOff(e, y, m, d) {
  return offD(e).includes(gdow(y, m, d));
}

/**
 * Format date Thai style
 */
export function dispThai(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate percentage
 */
export function calcPercentage(value, total) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

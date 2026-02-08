// ==========================================
// 🎨 ui.js - UI Helper Functions
// ขนาด: ~200 บรรทัด
// ==========================================

let _toastTimer = null;

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
 * Create HTML element (h = createElement)
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  
  // Set attributes
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on')) {
      el.addEventListener(key.substring(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  // Append children
  children.flat().forEach(child => {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      el.appendChild(child);
    }
  });
  
  return el;
}

/**
 * Create emoji element
 */
export function ce(emoji) {
  return h('span', { 
    style: { 
      display: 'inline-block', 
      fontSize: 'inherit' 
    } 
  }, emoji);
}

/**
 * Format date key (YYYY-MM-DD)
 */
export function dk(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format date to Thai
 */
export function formatDateThai(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${parseInt(y) + 543}`;
}

/**
 * Get day of week in Thai
 */
export function getDayOfWeekThai(date) {
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return days[date.getDay()];
}

/**
 * Display date (dd/mm/yyyy)
 */
export function disp(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
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
 * Scroll to element
 */
export function scrollTo(selector, offset = 0) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Show/hide loading
 */
export function setLoading(show) {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = show ? 'block' : 'none';
  }
}

/**
 * Confirm dialog
 */
export function confirmDialog(message) {
  return window.confirm(message);
}

/**
 * Prompt dialog
 */
export function promptDialog(message, defaultValue = '') {
  return window.prompt(message, defaultValue);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('คัดลอกแล้ว');
    return true;
  } catch (err) {
    toast('คัดลอกไม่สำเร็จ', true);
    return false;
  }
}

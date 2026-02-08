// ==========================================
// 🌐 api.js
// API Functions - AI แก้ง่าย แค่ 80 บรรทัด!
// ==========================================

/**
 * Generic API call
 */
export async function api(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(path, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'เกิดข้อผิดพลาด');
  }
  
  return data;
}

/**
 * Load overview data for a month
 */
export async function loadOverview(year, month) {
  const monthStr = year + '-' + String(month + 1).padStart(2, '0');
  return api('/api/overview?month=' + monthStr);
}

/**
 * Get pending leaves
 */
export async function getPendingLeaves() {
  return api('/api/leaves?status=pending');
}

/**
 * Get pending swaps
 */
export async function getPendingSwaps() {
  return api('/api/swaps?status=pending');
}

/**
 * Get self dayoff data
 */
export async function getSelfDayoff() {
  return api('/api/self-dayoff');
}

/**
 * Create leave request
 */
export async function createLeave(leaveData) {
  return api('/api/leaves', 'POST', leaveData);
}

/**
 * Create swap request
 */
export async function createSwap(swapData) {
  return api('/api/swaps', 'POST', swapData);
}

/**
 * Approve/Reject leave
 */
export async function approveLeave(id) {
  return api(`/api/leaves/${id}/approve`, 'POST');
}

export async function rejectLeave(id) {
  return api(`/api/leaves/${id}/reject`, 'POST');
}

/**
 * Approve/Reject swap
 */
export async function approveSwap(id) {
  return api(`/api/swaps/${id}/approve`, 'POST');
}

export async function rejectSwap(id) {
  return api(`/api/swaps/${id}/reject`, 'POST');
}

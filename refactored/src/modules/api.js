// ==========================================
// 🌐 api.js - API Functions
// ขนาด: ~150 บรรทัด
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
 * Load overview data
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
 * Approve leave
 */
export async function approveLeave(id) {
  return api(`/api/leaves/${id}/approve`, 'POST');
}

/**
 * Reject leave
 */
export async function rejectLeave(id) {
  return api(`/api/leaves/${id}/reject`, 'POST');
}

/**
 * Approve swap
 */
export async function approveSwap(id) {
  return api(`/api/swaps/${id}/approve`, 'POST');
}

/**
 * Reject swap
 */
export async function rejectSwap(id) {
  return api(`/api/swaps/${id}/reject`, 'POST');
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
 * Update settings
 */
export async function updateSettings(settings) {
  return api('/api/settings', 'POST', settings);
}

/**
 * Get employees list
 */
export async function getEmployees() {
  return api('/api/employees');
}

/**
 * Update employee
 */
export async function updateEmployee(id, data) {
  return api(`/api/employees/${id}`, 'PUT', data);
}

/**
 * Delete employee
 */
export async function deleteEmployee(id) {
  return api(`/api/employees/${id}`, 'DELETE');
}

/**
 * Get KPI data
 */
export async function getKPI(month) {
  return api(`/api/kpi?month=${month}`);
}

/**
 * Update KPI
 */
export async function updateKPI(data) {
  return api('/api/kpi', 'POST', data);
}

/**
 * Get wallet/rewards
 */
export async function getWallet() {
  return api('/api/wallet');
}

/**
 * Claim reward
 */
export async function claimReward(rewardId) {
  return api(`/api/wallet/claim/${rewardId}`, 'POST');
}

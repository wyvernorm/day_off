// ==========================================
// 🗂️ state.js - State Management
// ขนาด: ~50 บรรทัด
// ==========================================

/**
 * Global application state
 */
export const state = {
  // Current view
  view: 'calendar',
  
  // Current year/month
  year: 2026,
  month: 0,
  
  // Data
  days: {},
  employees: [],
  leaves: [],
  swaps: [],
  holidays: [],
  selfDayoff: null,
  kpi: {},
  wallet: { balance: 0, history: [] },
  achievements: [],
  
  // Settings
  settings: {
    blackoutDates: '',
    kpiAdmins: [],
  },
  
  // Current user
  user: null,
};

/**
 * Update state
 */
export function setState(updates) {
  Object.assign(state, updates);
}

/**
 * Get state
 */
export function getState() {
  return state;
}

/**
 * Reset state
 */
export function resetState() {
  state.view = 'calendar';
  state.year = new Date().getFullYear();
  state.month = new Date().getMonth();
  state.days = {};
  state.employees = [];
  state.leaves = [];
  state.swaps = [];
}

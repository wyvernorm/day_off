// ==========================================
// 🗂️ state.js
// State Management - AI แก้ง่าย แค่ 30 บรรทัด!
// ==========================================

/**
 * Global Application State
 */
export function createState(currentUser) {
  return {
    // Current view
    v: 'calendar',
    
    // Date
    y: new Date().getFullYear(),
    m: new Date().getMonth(),
    
    // Calendar mode
    calMode: 'calendar', // 'calendar' or 'icon'
    
    // Data
    emp: [],           // employees
    sh: {},            // shifts
    lv: {},            // leaves by date
    hol: {},           // holidays
    set: {},           // settings
    yl: {},            // year-level data
    
    // Pending items
    pl: [],            // pending leaves
    ps: [],            // pending swaps
    sd: null,          // self dayoff
    se: null,          // settings edit
    
    // UI state
    modal: null,
    
    // History
    hist: null,
    histLoaded: false,
    
    // KPI
    kpi: null,
    kpiLoaded: false,
    kpiTab: 'summary',
    
    // Onboarding
    onboarded: false,
    
    // Current user
    user: currentUser,
  };
}

/**
 * Helper: Check user permissions
 */
export function getUserPermissions(user) {
  const ROLE_LEVEL = { owner: 100, admin: 80, approver: 60, employee: 40, tester: 20 };
  const level = ROLE_LEVEL[user.role] || 0;
  
  return {
    isOwner: user.role === 'owner',
    isAdmin: level >= 80,
    canApprove: level >= 60,
    isTester: user.role === 'tester',
    level,
  };
}

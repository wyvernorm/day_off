import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ROLE_LEVEL } from '@/lib/constants';

// =============================================
// 🔐 Auth Context — user session management
// =============================================

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => window.__USER__ || null);
  const [loading, setLoading] = useState(!window.__USER__);

  useEffect(() => {
    if (!window.__USER__) checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await api('/api/me');
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isOwner: user?.role === 'owner',
    isAdmin: (ROLE_LEVEL[user?.role] || 0) >= 80,
    canApprove: (ROLE_LEVEL[user?.role] || 0) >= 60,
    isTester: user?.role === 'tester',
    refresh: checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

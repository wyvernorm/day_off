import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn, displayName } from '@/lib/utils';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants';
import {
  Calendar, BarChart3, Bell, History, Zap, Wallet,
  Settings, LogOut, Menu, X, Moon, Sun, ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'calendar', label: 'ปฏิทิน', icon: Calendar, emoji: '📅' },
  { id: 'stats', label: 'สถิติ', icon: BarChart3, emoji: '📊' },
  { id: 'pending', label: 'รออนุมัติ', icon: Bell, emoji: '🔔', needApprove: true },
  { id: 'history', label: 'ประวัติ', icon: History, emoji: '📜' },
  { id: 'kpi', label: 'KPI', icon: Zap, emoji: '⚡' },
  { id: 'wallet', label: 'กระเป๋า', icon: Wallet, emoji: '💰' },
];

export default function AppLayout({ activePage, onNavigate, children }) {
  const { user, isAdmin, canApprove, isOwner } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  function toggleDark() {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
    localStorage.setItem('theme', !dark ? 'dark' : 'light');
  }

  const visibleNav = NAV_ITEMS.filter(item => {
    if (item.needApprove && !canApprove) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-alt)' }}>
      {/* ─── Mobile Header ─── */}
      <header className="lg:hidden sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => setSidebarOpen(true)} className="p-2.5 -ml-2 rounded-xl" style={{ color: 'var(--text-muted)' }}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span className="font-bold text-sm">Shift Manager</span>
          </div>
          <button onClick={toggleDark} className="p-2.5 rounded-xl" style={{ color: 'var(--text-muted)' }}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
        </div>
      )}

      {/* ─── Sidebar ─── */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-[260px] flex flex-col',
        'transform transition-transform duration-300 ease-out',
        'lg:translate-x-0 lg:z-30',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )} style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-[72px] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: 'var(--brand-light)' }}>
              📅
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">Shift Manager</div>
              <div className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>จัดการกะ & วันลา</div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 mb-4 p-3 rounded-2xl" style={{ background: 'var(--surface-alt)' }}>
          <div className="flex items-center gap-3">
            {user?.profile_image ? (
              <img src={user.profile_image} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md" style={{ background: 'var(--brand-light)' }}>
                {user?.avatar || '👤'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate">{displayName(user)}</div>
              <span className={cn('badge text-[9px] mt-0.5 border', ROLE_COLORS[user?.role] || '')}>
                {ROLE_LABELS[user?.role] || user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {visibleNav.map(item => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                  active
                    ? 'text-white shadow-lg'
                    : 'hover:translate-x-1'
                )}
                style={active ? {
                  background: 'var(--brand)',
                  boxShadow: '0 4px 14px rgba(67,97,238,0.3)',
                } : {
                  color: 'var(--text-muted)',
                }}
              >
                <Icon className="w-[18px] h-[18px]" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 space-y-1 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
          <button onClick={toggleDark} className="hidden lg:flex w-full items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'โหมดสว่าง' : 'โหมดมืด'}
          </button>
          {isAdmin && (
            <button
              onClick={() => { onNavigate('settings'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <Settings className="w-4 h-4" /> ตั้งค่า
            </button>
          )}
          <a href="/auth/logout" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors" style={{ color: 'var(--danger)' }}>
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </a>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="lg:ml-[260px] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

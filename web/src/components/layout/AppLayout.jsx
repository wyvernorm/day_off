import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn, displayName } from '@/lib/utils';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants';
import {
  Calendar, BarChart3, Bell, History, Zap, Wallet,
  Settings, LogOut, Menu, X, Moon, Sun, User,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
  { id: 'stats', label: 'สถิติ', icon: BarChart3 },
  { id: 'pending', label: 'รออนุมัติ', icon: Bell, needApprove: true },
  { id: 'history', label: 'ประวัติ', icon: History },
  { id: 'kpi', label: 'KPI', icon: Zap },
  { id: 'wallet', label: 'กระเป๋า', icon: Wallet },
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

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (item.needApprove && !canApprove) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold">📅 จัดการกะ</h1>
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 text-slate-500">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700',
        'transform transition-transform duration-300 ease-out',
        'lg:translate-x-0 lg:z-30',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-700">
          <span className="text-lg font-bold">📅 Shift Manager</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {user?.profile_image ? (
              <img src={user.profile_image} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                {user?.avatar || '👤'}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{displayName(user)}</div>
              <span className={cn('badge text-[10px] border', ROLE_COLORS[user?.role] || '')}>
                {ROLE_LABELS[user?.role] || user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                )}
              >
                <Icon className={cn('w-4.5 h-4.5', active && 'text-blue-500')} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-100 dark:border-slate-700 space-y-1">
          <button onClick={toggleDark} className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          {isAdmin && (
            <button
              onClick={() => { onNavigate('settings'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <Settings className="w-4 h-4" /> ตั้งค่า
            </button>
          )}
          <a
            href="/auth/logout"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4" /> ออกจากระบบ
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

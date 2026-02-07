import { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/components/shared/Toast';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import CalendarPage from '@/pages/CalendarPage';
import {
  StatsPage, PendingPage, HistoryPage, KpiPage, WalletPage, SettingsPage,
} from '@/pages/PlaceholderPages';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('calendar');

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">📅</div>
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) return <LoginPage />;

  // Page router
  const pages = {
    calendar: <CalendarPage />,
    stats: <StatsPage />,
    pending: <PendingPage />,
    history: <HistoryPage />,
    kpi: <KpiPage />,
    wallet: <WalletPage />,
    settings: <SettingsPage />,
  };

  return (
    <AppLayout activePage={page} onNavigate={setPage}>
      {pages[page] || <CalendarPage />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

import { useState, useCallback, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up',
              'bg-white dark:bg-slate-800 border',
              t.type === 'error' ? 'border-red-200' : 'border-slate-200 dark:border-slate-700'
            )}
          >
            {ICONS[t.type] || ICONS.info}
            <span className="text-sm font-medium flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

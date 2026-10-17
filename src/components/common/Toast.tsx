'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warn' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          let border = 'border-emerald-500/30';
          let bg = 'bg-slate-900/95';

          if (toast.type === 'warn') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            border = 'border-amber-500/30';
          } else if (toast.type === 'info') {
            icon = <Info className="w-4 h-4 text-blue-400 shrink-0" />;
            border = 'border-blue-500/30';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
            border = 'border-rose-500/30';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border ${border} ${bg} backdrop-blur-md shadow-2xl flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 text-xs`}
            >
              <div className="pt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-slate-100">{toast.title}</h5>
                {toast.message && (
                  <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-500 hover:text-slate-300 p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback safe dummy if outside provider
    return {
      showToast: (title: string, message?: string) => {
        console.log(`[Toast] ${title} - ${message || ''}`);
      },
    };
  }
  return context;
};

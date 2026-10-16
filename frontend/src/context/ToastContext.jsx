import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ToastContext = createContext(null);

let toastCount = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    if (!message) return;
    const id = ++toastCount;
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const value = useMemo(() => ({
    showToast,
    removeToast,
    toasts
  }), [showToast, removeToast, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="global-toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`global-toast-item toast-variant-${toast.type}`}
            role="status"
          >
            <div className="global-toast-icon">
              {toast.type === 'success' && <CheckCircle2 size={18} strokeWidth={2.4} />}
              {toast.type === 'error' && <AlertCircle size={18} strokeWidth={2.4} />}
              {toast.type === 'warning' && <AlertTriangle size={18} strokeWidth={2.4} />}
              {toast.type === 'info' && <Info size={18} strokeWidth={2.4} />}
            </div>
            <div className="global-toast-text">{toast.message}</div>
            <button
              type="button"
              className="global-toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Yopish"
            >
              <X size={15} />
            </button>
            {toast.duration > 0 && (
              <div
                className="global-toast-progress"
                style={{ animationDuration: `${toast.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;

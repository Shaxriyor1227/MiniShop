import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ notification, onClose }) => {
  if (!notification || !notification.msg) return null;

  const { msg, type = 'success' } = notification;

  return (
    <div className={`admin-toast-item toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertTriangle size={18} />}
        {type === 'info' && <AlertCircle size={18} />}
      </div>
      <div className="toast-message">{msg}</div>
      {onClose && (
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;

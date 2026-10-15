import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Modal from './Modal';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Tasdiqlash',
  message = 'Haqiqatan ham bu amalni bajarmoqchimisiz?',
  confirmText = 'Ha, davom etish',
  cancelText = 'Bekor qilish',
  type = 'danger', // 'danger' | 'warning' | 'info'
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      maxWidth="420px"
      title={title}
    >
      <div className="admin-confirm-content">
        <div className={`admin-confirm-icon-wrap type-${type}`}>
          {type === 'danger' && <AlertTriangle size={24} />}
          {type === 'warning' && <AlertCircle size={24} />}
          {type === 'info' && <Info size={24} />}
        </div>
        <p className="admin-confirm-message">{message}</p>
      </div>

      <div className="admin-confirm-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className={`admin-btn admin-btn-${type}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Bajarilmoqda...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

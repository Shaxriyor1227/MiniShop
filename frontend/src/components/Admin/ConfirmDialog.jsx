import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import './ConfirmDialog.css';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'danger', // 'danger' | 'warning' | 'info'
  loading = false
}) => {
  const { t } = useTranslation();

  const finalTitle = title || t('admin.dialog.confirm_title');
  const finalMessage = message || t('admin.dialog.confirm_message');
  const finalConfirmText = confirmText || t('admin.dialog.confirm_btn');
  const finalCancelText = cancelText || t('admin.dialog.cancel_btn');

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      maxWidth="420px"
      title={finalTitle}
    >
      <div className="admin-confirm-content">
        <div className={`admin-confirm-icon-wrap type-${type}`}>
          {type === 'danger' && <AlertTriangle size={24} />}
          {type === 'warning' && <AlertCircle size={24} />}
          {type === 'info' && <Info size={24} />}
        </div>
        <p className="admin-confirm-message">{finalMessage}</p>
      </div>

      <div className="admin-confirm-actions">
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          {finalCancelText}
        </button>
        <button
          type="button"
          className={`admin-btn admin-btn-${type}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? t('admin.dialog.loading') : finalConfirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

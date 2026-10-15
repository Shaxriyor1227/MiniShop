import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Send, Users, User, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Notifications.css';

const Notifications = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();

  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Send message modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetType, setTargetType] = useState('all'); // 'all' | 'single'
  const [targetUserId, setTargetUserId] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Clear dialog
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // Load active users for dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axiosInstance.get('/user/getAll');
        if (res.data.success) {
          setUsers(res.data.innerData || []);
        }
      } catch (err) {
        console.error('[Users Error]:', err);
      }
    };
    loadUsers();
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/notification/getAll', {
        params: { page, limit, all: true }
      });
      if (res.data.success) {
        setNotifications(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Notifications Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.notifications.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast(t('admin.common.error'), 'error');
      return;
    }
    if (targetType === 'single' && !targetUserId) {
      showToast(t('admin.common.select'), 'error');
      return;
    }

    try {
      setSending(true);
      const payload = {
        user_id: targetType === 'all' ? 'all' : targetUserId,
        message: message.trim()
      };

      const res = await axiosInstance.post('/notification/create', payload);
      if (res.data.success) {
        showToast(t('admin.notifications.toast_sent'));
        setIsModalOpen(false);
        setMessage('');
        fetchNotifications();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.notifications.toast_error'), 'error');
    } finally {
      setSending(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await axiosInstance.delete('/notification/clear');
      if (res.data.success) {
        showToast(t('admin.notifications.toast_deleted_all'));
        setIsClearConfirmOpen(false);
        fetchNotifications();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.notifications.toast_error'), 'error');
    }
  };

  const columns = [
    {
      key: 'message',
      label: t('admin.notifications.col_message'),
      render: (val) => (
        <div className="notif-message-cell">
          <div className="notif-icon-circle">
            <Bell size={15} />
          </div>
          <span className="notif-text">{val}</span>
        </div>
      )
    },
    {
      key: 'user_id',
      label: t('admin.notifications.col_user'),
      render: (u) => (
        <span className="notif-user-tag">
          {u?.name || u?.email || t('admin.status.customer')}
        </span>
      )
    },
    {
      key: 'isRead',
      label: t('admin.notifications.col_status'),
      render: (val) => (
        <span className={`read-status-badge ${val ? 'read' : 'unread'}`}>
          {val ? t('admin.status.completed') : t('admin.status.active')}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: t('admin.notifications.col_date'),
      render: (val) => formatDate(val)
    }
  ];

  return (
    <div className="admin-notifications-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.notifications.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.notifications.subtitle')}</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchNotifications}
            title={t('admin.common.refresh')}
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>{t('admin.common.refresh')}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Send size={15} />
            <span>{t('admin.notifications.send_btn')}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        loading={loading}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Send Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !sending && setIsModalOpen(false)}
        title={t('admin.notifications.send_btn')}
        maxWidth="520px"
      >
        <form onSubmit={handleSendNotification} className="admin-form-vertical">
          <div className="form-group">
            <label className="form-label">{t('admin.notifications.label_recipient')}</label>
            <div className="target-type-toggle">
              <button
                type="button"
                className={`target-btn ${targetType === 'all' ? 'active' : ''}`}
                onClick={() => setTargetType('all')}
              >
                <Users size={16} />
                <span>{t('admin.notifications.label_all_users')}</span>
              </button>
              <button
                type="button"
                className={`target-btn ${targetType === 'single' ? 'active' : ''}`}
                onClick={() => setTargetType('single')}
              >
                <User size={16} />
                <span>{t('admin.notifications.col_user')}</span>
              </button>
            </div>
          </div>

          {targetType === 'single' && (
            <div className="form-group">
              <label className="form-label">{t('admin.notifications.label_recipient')} *</label>
              <select
                required
                className="admin-select"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              >
                <option value="">{t('admin.common.select')}</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('admin.notifications.label_message')} *</label>
            <textarea
              required
              rows={4}
              className="admin-input admin-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('admin.notifications.placeholder_message')}
            />
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={sending}
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={sending}
            >
              {sending ? t('admin.common.processing') : t('admin.notifications.send_btn')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Clear Confirm Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearAll}
        title={t('admin.dialog.confirm_title')}
        message={t('admin.notifications.delete_all_confirm')}
        type="danger"
      />

      {toast && (
        <div className="admin-toast-container">
          <Toast notification={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default Notifications;

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Send, Users, User, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import './Notifications.css';

const Notifications = () => {
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
      showToast('Bildirishnomalarni yuklashda xatolik', 'error');
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
      showToast('Xabar matnini kiriting', 'error');
      return;
    }
    if (targetType === 'single' && !targetUserId) {
      showToast('Qabul qiluvchi foydalanuvchini tanlang', 'error');
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
        showToast(res.data.message || 'Xabar muvaffaqiyatli yuborildi!');
        setIsModalOpen(false);
        setMessage('');
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Xabar yuborishda xatolik', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleClearAll = async () => {
    try {
      const res = await axiosInstance.delete('/notification/clear');
      if (res.data.success) {
        showToast('Barcha bildirishnomalar tozalandi');
        setIsClearConfirmOpen(false);
        fetchNotifications();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Tozalashda xatolik', 'error');
    }
  };

  const columns = [
    {
      key: 'message',
      label: 'Xabar mazmuni',
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
      label: 'Qabul qiluvchi',
      render: (u) => (
        <span className="notif-user-tag">
          {u?.name || u?.email || 'Mijoz'}
        </span>
      )
    },
    {
      key: 'isRead',
      label: 'O\'qilganligi',
      render: (val) => (
        <span className={`read-status-badge ${val ? 'read' : 'unread'}`}>
          {val ? 'O\'qilgan' : 'Yangi'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Yuborilgan sana',
      render: (val) => new Date(val).toLocaleString('uz-UZ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ];

  return (
    <div className="admin-notifications-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Bildirishnomalar markazi</h2>
          <p className="admin-hero-subtitle">
            Mijozlarga individual yoki umumiy (broadcast) xabarnomalar yuborish
          </p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchNotifications}
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>Yangilash</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Send size={15} />
            <span>Xabar yuborish</span>
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
        emptyMessage="Hozircha bildirishnomalar mavjud emas"
      />

      {/* Send Notification Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !sending && setIsModalOpen(false)}
        title="Yangi bildirishnoma yuborish"
        subtitle="Mijozga yoki barchaga tizim xabarnomasi"
        maxWidth="520px"
      >
        <form onSubmit={handleSendNotification} className="admin-form-vertical">
          <div className="form-group">
            <label className="form-label">Qabul qiluvchi guruhi</label>
            <div className="target-type-toggle">
              <button
                type="button"
                className={`target-btn ${targetType === 'all' ? 'active' : ''}`}
                onClick={() => setTargetType('all')}
              >
                <Users size={16} />
                <span>Barcha foydalanuvchilarga</span>
              </button>
              <button
                type="button"
                className={`target-btn ${targetType === 'single' ? 'active' : ''}`}
                onClick={() => setTargetType('single')}
              >
                <User size={16} />
                <span>Bitta mijozga</span>
              </button>
            </div>
          </div>

          {targetType === 'single' && (
            <div className="form-group">
              <label className="form-label">Foydalanuvchini tanlang *</label>
              <select
                required
                className="admin-select"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              >
                <option value="">Foydalanuvchini tanlang</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Xabar matni *</label>
            <textarea
              required
              rows={4}
              className="admin-input admin-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Masalan: Hurmatli mijoz, MiniShop do'konida yangi flagman mahsulotlar chegirma bilan taqdim etilmoqda!"
            />
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={sending}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={sending}
            >
              {sending ? 'Yuborilmoqda...' : 'Xabarni yuborish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Clear Confirm Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleClearAll}
        title="Bildirishnomalarni tozalash"
        message="Barcha shaxsiy bildirishnomalaringizni o'chirmoqchimisiz?"
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

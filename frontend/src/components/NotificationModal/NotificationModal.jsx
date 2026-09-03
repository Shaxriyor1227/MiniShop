import React, { useState, useEffect } from 'react';
import { X, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import './NotificationModal.css';

const NotificationModal = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/notification/getAll');
      if (res.data.success) {
        setNotifications(res.data.innerData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notification/markAsRead/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await axiosInstance.delete('/notification/clear');
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notif-modal-overlay" onClick={onClose}>
      <div className="notif-modal-content card" onClick={(e) => e.stopPropagation()}>
        <div className="notif-modal-header">
          <div className="notif-title-area">
            <Bell size={20} className="notif-header-icon" />
            <h3>Notifications</h3>
          </div>
          <div className="notif-header-actions">
            {notifications.length > 0 && (
              <button
                className="clear-all-btn"
                onClick={handleClearAll}
                title="Clear all notifications"
              >
                <Trash2 size={16} /> Clear All
              </button>
            )}
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="notif-modal-body">
          {loading ? (
            <p className="notif-empty">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <div className="notif-empty-state">
              <CheckCircle2 size={40} className="empty-check-icon" />
              <p>You're all caught up! No new notifications.</p>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                  onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                >
                  <div className="notif-dot-col">
                    {!n.isRead && <span className="unread-dot"></span>}
                  </div>
                  <div className="notif-text-col">
                    <p className="notif-msg">{n.message}</p>
                    <span className="notif-time">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

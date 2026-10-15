import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  RefreshCw,
  UserCheck,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Users.css';

const Users = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Confirmation dialogs
  const [blockConfirmUser, setBlockConfirmUser] = useState(null);
  const [roleConfirmUser, setRoleConfirmUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit
      };
      if (search.trim()) params.search = search.trim();
      if (roleFilter) params.role = roleFilter;

      const res = await axiosInstance.get('/user/getAll', { params });
      if (res.data.success) {
        setUsers(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Users Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.users.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle toggle block
  const handleToggleBlock = async () => {
    if (!blockConfirmUser) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.put(`/user/block/${blockConfirmUser._id}`, {
        isBlocked: !blockConfirmUser.isBlocked
      });
      if (res.data.success) {
        showToast(t('admin.users.toast_status_toggled'));
        setBlockConfirmUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.users.toast_error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update role
  const handleUpdateRole = async () => {
    if (!roleConfirmUser) return;
    const nextRole = roleConfirmUser.role === 'admin' ? 'customer' : 'admin';
    try {
      setActionLoading(true);
      const res = await axiosInstance.put(`/user/role/${roleConfirmUser._id}`, {
        role: nextRole
      });
      if (res.data.success) {
        showToast(t('admin.users.toast_updated'));
        setRoleConfirmUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.users.toast_error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deleteConfirmId) return;
    try {
      setActionLoading(true);
      const res = await axiosInstance.delete(`/user/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast(t('admin.users.toast_deleted'));
        setDeleteConfirmId(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.users.toast_error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: t('admin.users.col_name'),
      render: (val, row) => (
        <div className="user-profile-cell">
          <div className="user-avatar-circle">
            {val ? val[0].toUpperCase() : 'U'}
          </div>
          <div className="user-text-info">
            <span className="user-fullname">{val}</span>
            <span className="user-email-sub">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'phone_number',
      label: t('admin.users.col_phone'),
      render: (val) => val || '—'
    },
    {
      key: 'role',
      label: t('admin.users.col_role'),
      render: (val) => <StatusBadge status={val} type="user_role" />
    },
    {
      key: 'isBlocked',
      label: t('admin.users.col_status'),
      render: (val) => <StatusBadge status={val} type="user_status" />
    },
    {
      key: 'createdAt',
      label: t('admin.common.date'),
      render: (val) => formatDate(val)
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      align: 'right',
      render: (_, row) => {
        const isSelf = currentUser && (row._id === currentUser.id || row.email === currentUser.email);

        return (
          <div className="table-actions-cell">
            {/* Toggle Role Button */}
            <button
              type="button"
              className={`action-btn role ${row.role === 'admin' ? 'is-admin' : ''}`}
              onClick={() => setRoleConfirmUser(row)}
              disabled={isSelf}
              title={isSelf ? '' : (row.role === 'admin' ? t('admin.users.action_make_customer') : t('admin.users.action_make_admin'))}
            >
              <Shield size={14} />
              <span>{row.role === 'admin' ? t('admin.users.action_make_customer') : t('admin.users.action_make_admin')}</span>
            </button>

            {/* Block Button */}
            <button
              type="button"
              className={`action-btn block ${row.isBlocked ? 'unblock' : ''}`}
              onClick={() => setBlockConfirmUser(row)}
              disabled={isSelf}
              title={isSelf ? '' : (row.isBlocked ? t('admin.users.action_unblock') : t('admin.users.action_block'))}
            >
              {row.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
              <span>{row.isBlocked ? t('admin.users.action_unblock') : t('admin.users.action_block')}</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              className="action-icon-btn delete"
              onClick={() => setDeleteConfirmId(row._id)}
              disabled={isSelf}
              title={t('admin.common.delete')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="admin-users-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.users.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.users.subtitle')}</p>
        </div>
        <div className="hero-action-group">
          <select
            className="admin-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">{t('admin.common.all')}</option>
            <option value="customer">{t('admin.status.customer')}</option>
            <option value="admin">{t('admin.status.admin')}</option>
          </select>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchUsers}
            title={t('admin.common.refresh')}
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>{t('admin.common.refresh')}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder={t('admin.users.search_placeholder')}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Block Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(blockConfirmUser)}
        onClose={() => setBlockConfirmUser(null)}
        onConfirm={handleToggleBlock}
        title={blockConfirmUser?.isBlocked ? t('admin.users.action_unblock') : t('admin.users.action_block')}
        message={blockConfirmUser?.isBlocked ? `${t('admin.users.action_unblock')}?` : `${t('admin.users.action_block')}?`}
        confirmText={t('admin.dialog.confirm_btn')}
        cancelText={t('admin.dialog.cancel_btn')}
        type={blockConfirmUser?.isBlocked ? 'info' : 'danger'}
        loading={actionLoading}
      />

      {/* Role Change Dialog */}
      <ConfirmDialog
        isOpen={Boolean(roleConfirmUser)}
        onClose={() => setRoleConfirmUser(null)}
        onConfirm={handleUpdateRole}
        title={t('admin.dialog.confirm_title')}
        message={t('admin.dialog.confirm_message')}
        confirmText={t('admin.dialog.confirm_btn')}
        cancelText={t('admin.dialog.cancel_btn')}
        type="warning"
        loading={actionLoading}
      />

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteUser}
        title={t('admin.dialog.confirm_title')}
        message={t('admin.users.delete_confirm')}
        confirmText={t('admin.dialog.confirm_btn')}
        cancelText={t('admin.dialog.cancel_btn')}
        type="danger"
        loading={actionLoading}
      />

      {toast && (
        <div className="admin-toast-container">
          <Toast notification={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default Users;

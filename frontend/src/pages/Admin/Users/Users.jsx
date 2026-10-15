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
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import './Users.css';

const Users = () => {
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
      showToast('Foydalanuvchilarni yuklashda xatolik', 'error');
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
        showToast(
          blockConfirmUser.isBlocked
            ? 'Foydalanuvchi blokdan chiqarildi'
            : 'Foydalanuvchi bloklandi!'
        );
        setBlockConfirmUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Bloklashda xatolik yuz berdi', 'error');
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
        showToast(`Foydalanuvchi roli "${nextRole}" ga o'zgartirildi!`);
        setRoleConfirmUser(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Rolni o\'zgartirishda xatolik', 'error');
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
        showToast('Foydalanuvchi o\'chirildi');
        setDeleteConfirmId(null);
        fetchUsers();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Foydalanuvchi',
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
      label: 'Telefon',
      render: (val) => val || '—'
    },
    {
      key: 'role',
      label: 'Roli',
      render: (val) => <StatusBadge status={val} type="user_role" />
    },
    {
      key: 'isBlocked',
      label: 'Holat',
      render: (val) => <StatusBadge status={val} type="user_status" />
    },
    {
      key: 'createdAt',
      label: 'Ro\'yxatdan o\'tgan',
      render: (val) => new Date(val).toLocaleDateString('uz-UZ')
    },
    {
      key: 'actions',
      label: 'Amallar',
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
              title={isSelf ? 'O\'zingizning rolingizni o\'zgartira olmaysiz' : `Rolni o'zgartirish (${row.role === 'admin' ? 'Mijoz qilish' : 'Admin qilish'})`}
            >
              <Shield size={14} />
              <span>{row.role === 'admin' ? 'Demote' : 'Make Admin'}</span>
            </button>

            {/* Block Button */}
            <button
              type="button"
              className={`action-btn block ${row.isBlocked ? 'unblock' : ''}`}
              onClick={() => setBlockConfirmUser(row)}
              disabled={isSelf}
              title={isSelf ? 'O\'zingizni bloklay olmaysiz' : row.isBlocked ? 'Blokdan chiqarish' : 'Bloklash'}
            >
              {row.isBlocked ? <UserCheck size={14} /> : <UserX size={14} />}
              <span>{row.isBlocked ? 'Ochish' : 'Bloklash'}</span>
            </button>

            {/* Delete Button */}
            <button
              type="button"
              className="action-icon-btn delete"
              onClick={() => setDeleteConfirmId(row._id)}
              disabled={isSelf}
              title={isSelf ? 'O\'zingizni o\'chira olmaysiz' : 'O\'chirish'}
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
          <h2 className="admin-hero-title">Foydalanuvchilar boshqaruvi</h2>
          <p className="admin-hero-subtitle">
            Mijozlar hisoblari, rollar va xavfsizlik (bloklash) sozlamalari
          </p>
        </div>
        <div className="hero-action-group">
          <select
            className="admin-select"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">Barcha rollar</option>
            <option value="customer">Faqat mijozlar</option>
            <option value="admin">Faqat adminlar</option>
          </select>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchUsers}
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>Yangilash</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Ism, email yoki telefon..."
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage="Foydalanuvchilar topilmadi"
      />

      {/* Block Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(blockConfirmUser)}
        onClose={() => setBlockConfirmUser(null)}
        onConfirm={handleToggleBlock}
        title={blockConfirmUser?.isBlocked ? 'Blokdan chiqarish' : 'Foydalanuvchini bloklash'}
        message={
          blockConfirmUser?.isBlocked
            ? `"${blockConfirmUser?.name}" hisobini blokdan chiqarmoqchimisiz? U yana tizimga kirish imkoniyatiga ega bo'ladi.`
            : `"${blockConfirmUser?.name}" hisobini bloklamoqchimisiz? Bloklangan foydalanuvchi tizimga kira olmaydi.`
        }
        confirmText={blockConfirmUser?.isBlocked ? 'Ha, ochilsin' : 'Ha, bloklansin'}
        type={blockConfirmUser?.isBlocked ? 'info' : 'danger'}
        loading={actionLoading}
      />

      {/* Role Change Dialog */}
      <ConfirmDialog
        isOpen={Boolean(roleConfirmUser)}
        onClose={() => setRoleConfirmUser(null)}
        onConfirm={handleUpdateRole}
        title="Foydalanuvchi rolini o'zgartirish"
        message={`"${roleConfirmUser?.name}" foydalanuvchisiga ${
          roleConfirmUser?.role === 'admin' ? '"customer" (oddiy mijoz)' : '"admin" (boshqaruvchi)'
        } rolini berishni tasdiqlaysizmi?`}
        confirmText="Tasdiqlash"
        type="warning"
        loading={actionLoading}
      />

      {/* Delete User Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteUser}
        title="Foydalanuvchini o'chirish"
        message="Haqiqatan ham ushbu foydalanuvchi hisobini butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi."
        confirmText="Ha, o'chirilsin"
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

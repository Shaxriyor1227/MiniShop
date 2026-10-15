import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, RefreshCw, Percent } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Coupons.css';

const Coupons = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    is_active: true,
    expires_at: ''
  });

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (search.trim()) params.search = search.trim();

      const res = await axiosInstance.get('/coupon/getAll', { params });
      if (res.data.success) {
        setCoupons(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Coupons Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.coupons.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setFormData({
      code: '',
      discount: '10',
      is_active: true,
      expires_at: nextMonth.toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code || '',
      discount: c.discount ?? '',
      is_active: c.is_active !== undefined ? c.is_active : true,
      expires_at: c.expires_at ? new Date(c.expires_at).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || formData.discount === '' || !formData.expires_at) {
      showToast(t('admin.common.error'), 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discount: Number(formData.discount),
        is_active: formData.is_active,
        expires_at: new Date(formData.expires_at)
      };

      if (editingCoupon) {
        const res = await axiosInstance.put(`/coupon/update/${editingCoupon._id}`, payload);
        if (res.data.success) {
          showToast(t('admin.coupons.toast_updated'));
          setIsModalOpen(false);
          fetchCoupons();
        }
      } else {
        const res = await axiosInstance.post('/coupon/create', payload);
        if (res.data.success) {
          showToast(t('admin.coupons.toast_created'));
          setIsModalOpen(false);
          fetchCoupons();
        }
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.coupons.toast_error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/coupon/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast(t('admin.coupons.toast_deleted'));
        setDeleteConfirmId(null);
        fetchCoupons();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.coupons.toast_error'), 'error');
    }
  };

  const columns = [
    {
      key: 'code',
      label: t('admin.coupons.col_code'),
      render: (val) => (
        <div className="coupon-code-cell">
          <Tag size={15} className="coupon-icon" />
          <span className="coupon-code-text">{val}</span>
        </div>
      )
    },
    {
      key: 'discount',
      label: t('admin.coupons.col_discount'),
      render: (val) => (
        <span className="discount-badge">
          <Percent size={12} />
          {val}%
        </span>
      )
    },
    {
      key: 'expires_at',
      label: t('admin.coupons.col_expires'),
      render: (val) => {
        const isExpired = new Date(val) < new Date();
        return (
          <span className={`expiry-date ${isExpired ? 'expired' : ''}`}>
            {formatDate(val)}
          </span>
        );
      }
    },
    {
      key: 'is_active',
      label: t('admin.coupons.col_status'),
      render: (val, row) => {
        const isExpired = new Date(row.expires_at) < new Date();
        const active = val && !isExpired;
        return <StatusBadge status={active} type="coupon" />;
      }
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      align: 'right',
      render: (_, row) => (
        <div className="table-actions-cell">
          <button
            type="button"
            className="action-icon-btn edit"
            onClick={() => handleOpenEdit(row)}
            title={t('admin.common.edit')}
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="action-icon-btn delete"
            onClick={() => setDeleteConfirmId(row._id)}
            title={t('admin.common.delete')}
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-coupons-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.coupons.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.coupons.subtitle')}</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchCoupons}
            title={t('admin.common.refresh')}
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>{t('admin.common.refresh')}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} />
            <span>{t('admin.coupons.add_btn')}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={coupons}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder={t('admin.coupons.search_placeholder')}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingCoupon ? t('admin.coupons.edit_title') : t('admin.coupons.new_title')}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="admin-form-vertical">
          <div className="form-group">
            <label className="form-label">{t('admin.coupons.label_code')} *</label>
            <input
              type="text"
              required
              className="admin-input uppercase-input"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="SPRING2026"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.coupons.label_discount')} *</label>
            <input
              type="number"
              min="1"
              max="100"
              required
              className="admin-input"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              placeholder="15"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.coupons.label_expires')} *</label>
            <input
              type="date"
              required
              className="admin-input"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>{t('admin.coupons.label_status')}</span>
            </label>
          </div>

          <div className="modal-form-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? t('admin.common.processing') : editingCoupon ? t('admin.common.save') : t('admin.common.create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title={t('admin.dialog.confirm_title')}
        message={t('admin.coupons.delete_confirm')}
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

export default Coupons;

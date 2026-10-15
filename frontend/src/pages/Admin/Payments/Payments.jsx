import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, DollarSign, RefreshCw, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Payments.css';

const Payments = () => {
  const { t } = useTranslation();
  const { formatPrice, formatDate } = useFormatters();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Status edit modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (methodFilter && methodFilter !== 'all') params.method = methodFilter;

      const res = await axiosInstance.get('/payment/getAll', { params });
      if (res.data.success) {
        setPayments(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Payments Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.payments.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, methodFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleOpenEdit = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status);
  };

  const handleSaveStatus = async () => {
    if (!selectedPayment || !newStatus || newStatus === selectedPayment.status) return;

    try {
      setUpdating(true);
      const res = await axiosInstance.put(`/payment/update/${selectedPayment._id}`, {
        status: newStatus
      });
      if (res.data.success) {
        showToast(t('admin.payments.toast_updated'));
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.payments.toast_error'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      key: '_id',
      label: t('admin.payments.col_id'),
      width: '130px',
      render: (val) => <span className="payment-code-badge">#{val.slice(-6)}</span>
    },
    {
      key: 'order_id',
      label: t('admin.payments.col_order'),
      render: (order) => (
        <div className="payment-order-cell">
          <span className="order-link-text">#{order?._id ? order._id.slice(-6) : '—'}</span>
          <span className="order-customer-sub">{order?.user_id?.name || t('admin.status.customer')}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: t('admin.payments.col_amount'),
      render: (val) => <strong className="payment-amount">{formatPrice(val)}</strong>
    },
    {
      key: 'method',
      label: t('admin.payments.col_method'),
      render: (val) => (
        <span className="payment-method-badge">
          <CreditCard size={13} />
          {val || 'Card'}
        </span>
      )
    },
    {
      key: 'status',
      label: t('admin.payments.col_status'),
      render: (val) => <StatusBadge status={val} type="payment" />
    },
    {
      key: 'createdAt',
      label: t('admin.payments.col_date'),
      render: (val) => formatDate(val)
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          style={{ padding: '5px 10px', fontSize: '12px' }}
          onClick={() => handleOpenEdit(row)}
        >
          {t('admin.payments.change_status')}
        </button>
      )
    }
  ];

  return (
    <div className="admin-payments-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.payments.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.payments.subtitle')}</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchPayments}
          title={t('admin.common.refresh')}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>{t('admin.common.refresh')}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="payments-filter-bar">
        <div className="filter-group">
          <Filter size={15} className="filter-icon" />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">{t('admin.common.all')}</option>
            <option value="completed">{t('admin.status.completed')}</option>
            <option value="pending">{t('admin.status.pending')}</option>
            <option value="failed">{t('admin.status.failed')}</option>
          </select>

          <select
            className="admin-select"
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
          >
            <option value="all">{t('admin.payments.filter_method')}</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Payme">Payme</option>
            <option value="Click">Click</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Status Modal */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title={`${t('admin.payments.title')} #${selectedPayment._id.slice(-6)}`}
          maxWidth="440px"
        >
          <div className="admin-form-vertical">
            <div className="detail-card-row">
              <span className="row-key">{t('admin.payments.col_amount')}:</span>
              <span className="row-val font-bold">{formatPrice(selectedPayment.amount)}</span>
            </div>
            <div className="detail-card-row">
              <span className="row-key">{t('admin.payments.col_method')}:</span>
              <span className="row-val">{selectedPayment.method}</span>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">{t('admin.payments.change_status')}</label>
              <select
                className="admin-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">{t('admin.status.pending')}</option>
                <option value="completed">{t('admin.status.completed')}</option>
                <option value="failed">{t('admin.status.failed')}</option>
              </select>
            </div>

            <div className="modal-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedPayment(null)}
                disabled={updating}
              >
                {t('admin.common.cancel')}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleSaveStatus}
                disabled={updating || newStatus === selectedPayment.status}
              >
                {updating ? t('admin.common.processing') : t('admin.common.save')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && (
        <div className="admin-toast-container">
          <Toast notification={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default Payments;

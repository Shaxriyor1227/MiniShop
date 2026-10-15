import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, DollarSign, RefreshCw, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import './Payments.css';

const Payments = () => {
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
      showToast('To\'lovlarni yuklashda xatolik', 'error');
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
        showToast('To\'lov holati yangilandi!');
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Holatni yangilashda xatolik', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      key: '_id',
      label: 'To\'lov ID',
      width: '130px',
      render: (val) => <span className="payment-code-badge">#{val.slice(-6)}</span>
    },
    {
      key: 'order_id',
      label: 'Buyurtma & Mijoz',
      render: (order) => (
        <div className="payment-order-cell">
          <span className="order-link-text">Buyurtma #{order?._id ? order._id.slice(-6) : '—'}</span>
          <span className="order-customer-sub">{order?.user_id?.name || 'Mijoz'}</span>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Summa',
      render: (val) => <strong className="payment-amount">${val}</strong>
    },
    {
      key: 'method',
      label: 'To\'lov usuli',
      render: (val) => (
        <span className="payment-method-badge">
          <CreditCard size={13} />
          {val || 'Karta'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Holat',
      render: (val) => <StatusBadge status={val} type="payment" />
    },
    {
      key: 'createdAt',
      label: 'Vaqt',
      render: (val) => new Date(val).toLocaleString('uz-UZ', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    {
      key: 'actions',
      label: 'Amal',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          style={{ padding: '5px 10px', fontSize: '12px' }}
          onClick={() => handleOpenEdit(row)}
        >
          Holatni o'zgartirish
        </button>
      )
    }
  ];

  return (
    <div className="admin-payments-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">To'lovlar tranzaksiyalari</h2>
          <p className="admin-hero-subtitle">
            Mijozlar buyurtmalari bo'yicha to'lov amaliyotlari va hisoblar
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchPayments}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>Yangilash</span>
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
            <option value="all">Barcha holatlar</option>
            <option value="completed">Muvaffaqiyatli (completed)</option>
            <option value="pending">Kutilmoqda (pending)</option>
            <option value="failed">Xatolik (failed)</option>
          </select>

          <select
            className="admin-select"
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
          >
            <option value="all">Barcha to'lov usullari</option>
            <option value="Credit Card">Kredit karta</option>
            <option value="Payme">Payme</option>
            <option value="Click">Click</option>
            <option value="Cash">Naqd pul</option>
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
        emptyMessage="To'lov yozuvlari topilmadi"
      />

      {/* Status Modal */}
      {selectedPayment && (
        <Modal
          isOpen={Boolean(selectedPayment)}
          onClose={() => setSelectedPayment(null)}
          title={`To'lov #${selectedPayment._id.slice(-6)}`}
          maxWidth="440px"
        >
          <div className="admin-form-vertical">
            <div className="detail-card-row">
              <span className="row-key">Summa:</span>
              <span className="row-val font-bold">${selectedPayment.amount}</span>
            </div>
            <div className="detail-card-row">
              <span className="row-key">Usul:</span>
              <span className="row-val">{selectedPayment.method}</span>
            </div>

            <div className="form-group" style={{ marginTop: '12px' }}>
              <label className="form-label">Yangi holatni tanlang</label>
              <select
                className="admin-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Kutilmoqda (pending)</option>
                <option value="completed">Muvaffaqiyatli (completed)</option>
                <option value="failed">Bekor qilingan / Xato (failed)</option>
              </select>
            </div>

            <div className="modal-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelectedPayment(null)}
                disabled={updating}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={handleSaveStatus}
                disabled={updating || newStatus === selectedPayment.status}
              >
                {updating ? 'Saqlanmoqda...' : 'Holatni saqlash'}
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

import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Filter,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  Tag,
  CreditCard,
  Package,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Orders.css';

const Orders = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice, formatDate } = useFormatters();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Detail Modal & Status Update
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axiosInstance.get('/order/getAll', { params });
      if (res.data.success) {
        setOrders(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Orders Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.orders.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) return;

    try {
      setUpdatingStatus(true);
      const res = await axiosInstance.put(`/order/update/${selectedOrder._id}`, {
        status: newStatus
      });
      if (res.data.success) {
        showToast(t('admin.orders.toast_status_updated'));
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        fetchOrders();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.orders.toast_error'), 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    {
      key: '_id',
      label: t('admin.orders.col_id'),
      width: '130px',
      render: (val) => <span className="order-code-badge">#{val.slice(-6)}</span>
    },
    {
      key: 'user_id',
      label: t('admin.orders.col_customer'),
      render: (user) => (
        <div className="order-user-cell">
          <span className="user-name">{user?.name || t('admin.status.customer')}</span>
          <span className="user-email">{user?.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: t('admin.orders.col_date'),
      render: (val) => (
        <span className="order-date-text">
          {formatDate(val)}
        </span>
      )
    },
    {
      key: 'items',
      label: t('admin.orders.col_items'),
      render: (items) => (
        <span className="order-items-count">
          {items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
        </span>
      )
    },
    {
      key: 'total',
      label: t('admin.orders.col_total'),
      render: (val) => <strong className="order-total-price">{formatPrice(val)}</strong>
    },
    {
      key: 'status',
      label: t('admin.orders.col_status'),
      render: (val) => <StatusBadge status={val} type="order" />
    },
    {
      key: 'actions',
      label: t('admin.orders.col_actions'),
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          className="order-detail-btn"
          onClick={() => handleOpenDetail(row)}
          title={t('admin.common.view')}
        >
          <Eye size={15} />
          <span>{t('admin.common.view')}</span>
        </button>
      )
    }
  ];

  return (
    <div className="admin-orders-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.orders.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.orders.subtitle')}</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchOrders}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>{t('admin.common.refresh')}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="orders-filter-toolbar">
        <div className="filter-group">
          <Filter size={15} className="toolbar-icon" />
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">{t('admin.orders.filter_all')}</option>
            <option value="pending">{t('admin.status.pending')}</option>
            <option value="paid">{t('admin.status.paid')}</option>
            <option value="shipped">{t('admin.status.shipped')}</option>
            <option value="delivered">{t('admin.status.delivered')}</option>
            <option value="cancelled">{t('admin.status.cancelled')}</option>
          </select>
        </div>

        <div className="date-filter-group">
          <Calendar size={15} className="toolbar-icon" />
          <input
            type="date"
            className="admin-date-input"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            title={t('admin.orders.filter_start')}
          />
          <span className="date-sep">—</span>
          <input
            type="date"
            className="admin-date-input"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            title={t('admin.orders.filter_end')}
          />
          {(statusFilter !== 'all' || startDate || endDate) && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => {
                setStatusFilter('all');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
            >
              {t('admin.common.clear')}
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder={t('admin.orders.search_placeholder')}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`${t('admin.orders.modal_title')} #${selectedOrder._id.slice(-6)}`}
          subtitle={`${t('admin.common.date')}: ${formatDate(selectedOrder.createdAt)}`}
          maxWidth="680px"
        >
          <div className="order-modal-content">
            {/* Status change block */}
            <div className="order-status-change-card">
              <div className="status-change-label">
                <span>{t('admin.orders.col_status')}:</span>
                <StatusBadge status={selectedOrder.status} type="order" />
              </div>

              <div className="status-select-wrap">
                <select
                  className="admin-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">{t('admin.status.pending')}</option>
                  <option value="paid">{t('admin.status.paid')}</option>
                  <option value="shipped">{t('admin.status.shipped')}</option>
                  <option value="delivered">{t('admin.status.delivered')}</option>
                  <option value="cancelled">{t('admin.status.cancelled')}</option>
                </select>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                >
                  {updatingStatus ? t('admin.common.processing') : t('admin.orders.change_status')}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="order-info-two-col">
              <div className="order-detail-card">
                <div className="detail-card-head">
                  <User size={15} />
                  <span>{t('admin.orders.customer_info')}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">{t('admin.users.col_name')}:</span>
                  <span className="row-val">{selectedOrder.user_id?.name || t('admin.status.customer')}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">{t('admin.users.col_email')}:</span>
                  <span className="row-val">{selectedOrder.user_id?.email || '—'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">{t('admin.users.col_phone')}:</span>
                  <span className="row-val">{selectedOrder.user_id?.phone_number || '—'}</span>
                </div>
              </div>

              <div className="order-detail-card">
                <div className="detail-card-head">
                  <MapPin size={15} />
                  <span>{t('admin.orders.delivery_address')}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">City:</span>
                  <span className="row-val">{selectedOrder.address_id?.city || '—'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Street:</span>
                  <span className="row-val">{selectedOrder.address_id?.street || '—'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Postal:</span>
                  <span className="row-val">{selectedOrder.address_id?.postal_code || '—'}</span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="order-items-card">
              <div className="detail-card-head">
                <Package size={15} />
                <span>{t('admin.orders.ordered_items')} ({selectedOrder.items?.length || 0})</span>
              </div>

              <div className="modal-items-list">
                {selectedOrder.items?.map((item, idx) => {
                  const localizedItemName = item.product_id?.translations?.[i18n.language]?.name || item.product_id?.name || 'Item';
                  return (
                    <div key={item._id || idx} className="modal-item-row">
                      <img
                        src={(item.product_id?.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp')}
                        alt={localizedItemName}
                        className="modal-item-thumb"
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.target.src = '/images/product_placeholder.webp'; }}
                      />
                      <div className="modal-item-name">
                        <span>{localizedItemName}</span>
                        <span className="modal-item-price-unit">{formatPrice(item.price)}</span>
                      </div>
                      <div className="modal-item-qty">x {item.quantity}</div>
                      <div className="modal-item-subtotal">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="order-modal-summary">
                {selectedOrder.coupon_id && (
                  <div className="summary-line coupon">
                    <span>{selectedOrder.coupon_id?.code || 'COUPON'}:</span>
                    <span>-{selectedOrder.coupon_id?.discount}%</span>
                  </div>
                )}
                <div className="summary-line total">
                  <span>{t('admin.orders.col_total')}:</span>
                  <span className="total-highlight">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
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

export default Orders;

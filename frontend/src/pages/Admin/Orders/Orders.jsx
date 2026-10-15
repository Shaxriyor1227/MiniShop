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
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import StatusBadge from '../../../components/Admin/StatusBadge';
import Toast from '../../../components/Admin/Toast';
import './Orders.css';

const Orders = () => {
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
      showToast('Buyurtmalarni yuklashda xatolik yuz berdi', 'error');
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
        showToast(`Buyurtma holati "${newStatus}" ga o'zgartirildi!`);
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        fetchOrders();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Holatni yangilashda xatolik', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    {
      key: '_id',
      label: 'Buyurtma ID',
      width: '130px',
      render: (val) => <span className="order-code-badge">#{val.slice(-6)}</span>
    },
    {
      key: 'user_id',
      label: 'Mijoz',
      render: (user) => (
        <div className="order-user-cell">
          <span className="user-name">{user?.name || 'Mijoz'}</span>
          <span className="user-email">{user?.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Sana',
      render: (val) => (
        <span className="order-date-text">
          {new Date(val).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'items',
      label: 'Mahsulotlar',
      render: (items) => (
        <span className="order-items-count">
          {items?.reduce((sum, item) => sum + item.quantity, 0) || 0} ta dona
        </span>
      )
    },
    {
      key: 'total',
      label: 'Umumiy summa',
      render: (val) => <strong className="order-total-price">${val}</strong>
    },
    {
      key: 'status',
      label: 'Holat',
      render: (val) => <StatusBadge status={val} type="order" />
    },
    {
      key: 'actions',
      label: 'Batafsil',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          className="order-detail-btn"
          onClick={() => handleOpenDetail(row)}
          title="Batafsil ko'rish"
        >
          <Eye size={15} />
          <span>Ko'rish</span>
        </button>
      )
    }
  ];

  return (
    <div className="admin-orders-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Buyurtmalar boshqaruvi</h2>
          <p className="admin-hero-subtitle">
            Barcha mijoz buyurtmalari, yetkazib berish holatlari va to'lovlar
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchOrders}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>Yangilash</span>
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
            <option value="all">Barcha holatlar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="paid">To'langan</option>
            <option value="shipped">Yo'lda (Yuborilgan)</option>
            <option value="delivered">Yetkazib berildi</option>
            <option value="cancelled">Bekor qilingan</option>
          </select>
        </div>

        <div className="date-filter-group">
          <Calendar size={15} className="toolbar-icon" />
          <input
            type="date"
            className="admin-date-input"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            title="Boshlanish sanasi"
          />
          <span className="date-sep">—</span>
          <input
            type="date"
            className="admin-date-input"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            title="Tugash sanasi"
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
              Filtrni tozalash
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
        searchPlaceholder="ID yoki mijoz bo'yicha qidirish..."
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage="Buyurtmalar topilmadi"
      />

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Buyurtma #${selectedOrder._id.slice(-6)}`}
          subtitle={`Sana: ${new Date(selectedOrder.createdAt).toLocaleString('uz-UZ')}`}
          maxWidth="680px"
        >
          <div className="order-modal-content">
            {/* Status change block */}
            <div className="order-status-change-card">
              <div className="status-change-label">
                <span>Joriy holat:</span>
                <StatusBadge status={selectedOrder.status} type="order" />
              </div>

              <div className="status-select-wrap">
                <select
                  className="admin-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Kutilmoqda</option>
                  <option value="paid">To'langan</option>
                  <option value="shipped">Yo'lda (Yuborilgan)</option>
                  <option value="delivered">Yetkazib berildi</option>
                  <option value="cancelled">Bekor qilindi (Stock qaytadi)</option>
                </select>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                >
                  {updatingStatus ? 'Yangilanmoqda...' : 'Holatni saqlash'}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="order-info-two-col">
              <div className="order-detail-card">
                <div className="detail-card-head">
                  <User size={15} />
                  <span>Mijoz ma'lumotlari</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Ism:</span>
                  <span className="row-val">{selectedOrder.user_id?.name || 'Mijoz'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Email:</span>
                  <span className="row-val">{selectedOrder.user_id?.email || '—'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Telefon:</span>
                  <span className="row-val">{selectedOrder.user_id?.phone_number || 'Kiritilmagan'}</span>
                </div>
              </div>

              <div className="order-detail-card">
                <div className="detail-card-head">
                  <MapPin size={15} />
                  <span>Yetkazib berish manzili</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Shahar/Viloyat:</span>
                  <span className="row-val">{selectedOrder.address_id?.city || 'Toshkent'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Ko'cha/Uy:</span>
                  <span className="row-val">{selectedOrder.address_id?.street || 'Asosiy manzil'}</span>
                </div>
                <div className="detail-card-row">
                  <span className="row-key">Pochta indeksi:</span>
                  <span className="row-val">{selectedOrder.address_id?.postal_code || '100000'}</span>
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="order-items-card">
              <div className="detail-card-head">
                <Package size={15} />
                <span>Buyurtma tarkibi ({selectedOrder.items?.length || 0} ta mahsulot)</span>
              </div>

              <div className="modal-items-list">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={item._id || idx} className="modal-item-row">
                    <img
                      src={item.product_id?.images?.[0] || '/images/product_placeholder.png'}
                      alt={item.product_id?.name || 'Mahsulot'}
                      className="modal-item-thumb"
                      onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
                    />
                    <div className="modal-item-name">
                      <span>{item.product_id?.name || 'Mahsulot'}</span>
                      <span className="modal-item-price-unit">${item.price} / dona</span>
                    </div>
                    <div className="modal-item-qty">x {item.quantity}</div>
                    <div className="modal-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-modal-summary">
                {selectedOrder.coupon_id && (
                  <div className="summary-line coupon">
                    <span>Qo'llangan kupon ({selectedOrder.coupon_id?.code || 'KUPON'}):</span>
                    <span>-{selectedOrder.coupon_id?.discount}%</span>
                  </div>
                )}
                <div className="summary-line total">
                  <span>Jami to'langan summa:</span>
                  <span className="total-highlight">${selectedOrder.total}</span>
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

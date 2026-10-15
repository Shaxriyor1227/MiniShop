import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { useFormatters } from '../../utils/formatters';
import { getOrderStatus } from '../../utils/i18nHelpers';
import axiosInstance from '../../api/axiosInstance';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from 'lucide-react';
import './Orders.css';

const statusConfig = {
  pending: { color: 'badge-amber', icon: Clock },
  paid: { color: 'badge-blue', icon: CheckCircle2 },
  shipped: { color: 'badge-blue', icon: Truck },
  delivered: { color: 'badge-green', icon: CheckCircle2 },
  cancelled: { color: 'badge-danger', icon: XCircle }
};

const Orders = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { formatPrice, formatDateTime } = useFormatters();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/order/getAll');
      if (res.data.success) {
        setOrders(res.data.innerData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm(t('orders.confirm_cancel'))) return;
    try {
      const res = await axiosInstance.put(`/order/cancel/${orderId}`);
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: 'cancelled' } : o))
        );
        showToast(t('toast.order_cancelled'), 'info');
      }
    } catch (err) {
      showToast(err.response?.data?.message || t('toast.order_cancel_error'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="orders-page page-enter">
        <div className="container orders-loading">
          <div className="loading-spinner"></div>
          <p>...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page page-enter">
      <div className="container">
        <div className="orders-header">
          <h1 className="page-title">{t('orders.title')}</h1>
          <p className="page-subtitle">{t('orders.subtitle')}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders-card card">
            <Package size={64} className="empty-order-icon" />
            <h2>{t('orders.empty_title')}</h2>
            <p>{t('orders.empty_desc')}</p>
            <Link to="/catalog" className="btn-primary">
              {t('cart.go_shopping')} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <div key={order._id} className="order-item-card card">
                  {/* Order header */}
                  <div className="order-card-header">
                    <div>
                      <span className="order-id-label">{t('orders.order_no', { id: order._id.slice(-8) })}</span>
                      <span className="order-date">
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>

                    <div className="order-status-group">
                      <span className={`badge ${statusInfo.color}`}>
                        <StatusIcon size={12} style={{ marginRight: '4px' }} />
                        {getOrderStatus(order.status, t)}
                      </span>
                    </div>
                  </div>

                  {/* Order products */}
                  <div className="order-card-body">
                    <div className="order-products-list">
                      {order.items.map((item, idx) => {
                        const prod = item.product_id || {};
                        return (
                          <div key={idx} className="order-product-row">
                            <img
                              src={(prod.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp')}
                              alt={prod.name}
                              width="50"
                              height="50"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                e.currentTarget.src = '/images/product_placeholder.webp';
                              }}
                            />
                            <div className="order-prod-info">
                              <h5>{prod.name || 'Product'}</h5>
                              <span className="order-prod-meta">
                                {item.quantity} x {formatPrice(item.price)}
                              </span>
                            </div>
                            <span className="order-prod-total">
                              {formatPrice(item.quantity * item.price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Address & Total */}
                    <div className="order-meta-footer">
                      <div className="order-address-box">
                        <strong>{t('orders.shipping_address')}</strong>
                        <p>
                          {order.address_id?.city}, {order.address_id?.street}
                        </p>
                      </div>

                      <div className="order-total-box">
                        <span>{t('orders.total_paid')}</span>
                        <h4>{formatPrice(order.total)}</h4>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <div className="order-card-actions">
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        {t('orders.cancel_order')}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

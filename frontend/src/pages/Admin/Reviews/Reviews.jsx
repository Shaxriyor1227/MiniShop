import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Star, RefreshCw, MessageSquare, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Reviews.css';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { formatDate } = useFormatters();

  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productFilter, setProductFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Confirm delete
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // Load products for dropdown filter
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await axiosInstance.get('/product/getAll');
        if (res.data.success) {
          setProducts(res.data.innerData || []);
        }
      } catch (err) {
        console.error('[Load Products Error]:', err);
      }
    };
    loadProducts();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (productFilter) params.product_id = productFilter;
      if (ratingFilter) params.rating = ratingFilter;

      const res = await axiosInstance.get('/review/getAll', { params });
      if (res.data.success) {
        setReviews(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Reviews Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.reviews.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  }, [page, productFilter, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/review/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast(t('admin.reviews.toast_deleted'));
        setDeleteConfirmId(null);
        fetchReviews();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.reviews.toast_error'), 'error');
    }
  };

  const columns = [
    {
      key: 'product_id',
      label: t('admin.reviews.col_product'),
      render: (product) => {
        const localizedName = product?.translations?.[i18n.language]?.name || product?.name || '—';
        return (
          <div className="review-product-cell">
            <img
              src={(product?.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp')}
              alt={localizedName}
              className="review-product-thumb"
              width="36"
              height="36"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.src = '/images/product_placeholder.webp'; }}
            />
            <span className="review-product-name">{localizedName}</span>
          </div>
        );
      }
    },
    {
      key: 'user_id',
      label: t('admin.reviews.col_user'),
      render: (user) => (
        <div className="review-author-cell">
          <span className="author-name">{user?.name || t('admin.status.customer')}</span>
          <span className="author-email">{user?.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: t('admin.reviews.col_rating'),
      render: (rating) => (
        <div className="stars-pill">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < rating ? 'star-filled' : 'star-empty'}
            />
          ))}
          <span className="rating-num">{rating}/5</span>
        </div>
      )
    },
    {
      key: 'comment',
      label: t('admin.reviews.col_comment'),
      render: (val) => (
        <p className="review-comment-text" title={val}>
          {val ? (val.length > 80 ? val.slice(0, 80) + '...' : val) : '—'}
        </p>
      )
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
      render: (_, row) => (
        <button
          type="button"
          className="action-icon-btn delete"
          onClick={() => setDeleteConfirmId(row._id)}
          title={t('admin.common.delete')}
        >
          <Trash2 size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="admin-reviews-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.reviews.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.reviews.subtitle')}</p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchReviews}
          title={t('admin.common.refresh')}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>{t('admin.common.refresh')}</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="reviews-filter-bar">
        <div className="filter-group">
          <Filter size={15} className="filter-icon" />
          <select
            className="admin-select"
            value={productFilter}
            onChange={(e) => { setProductFilter(e.target.value); setPage(1); }}
          >
            <option value="">{t('admin.reviews.all_products')}</option>
            {products.map((p) => {
              const name = p.translations?.[i18n.language]?.name || p.name;
              return <option key={p._id} value={p._id}>{name}</option>;
            })}
          </select>

          <select
            className="admin-select"
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          >
            <option value="">{t('admin.reviews.all_ratings')}</option>
            <option value="5">5 ⭐⭐⭐⭐⭐</option>
            <option value="4">4 ⭐⭐⭐⭐</option>
            <option value="3">3 ⭐⭐⭐</option>
            <option value="2">2 ⭐⭐</option>
            <option value="1">1 ⭐</option>
          </select>

          {(productFilter || ratingFilter) && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => { setProductFilter(''); setRatingFilter(''); setPage(1); }}
            >
              {t('admin.common.clear')}
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title={t('admin.dialog.confirm_title')}
        message={t('admin.reviews.delete_confirm')}
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

export default Reviews;

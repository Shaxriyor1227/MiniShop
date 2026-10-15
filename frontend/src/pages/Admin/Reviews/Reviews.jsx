import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Star, RefreshCw, MessageSquare, Filter } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import './Reviews.css';

const Reviews = () => {
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
      showToast('Sharhlarni yuklashda xatolik', 'error');
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
        showToast('Sharh muvaffaqiyatli o\'chirildi (moderatsiya qilindi)');
        setDeleteConfirmId(null);
        fetchReviews();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik', 'error');
    }
  };

  const columns = [
    {
      key: 'product_id',
      label: 'Mahsulot',
      render: (product) => (
        <div className="review-product-cell">
          <img
            src={product?.images?.[0] || '/images/product_placeholder.png'}
            alt={product?.name || 'Mahsulot'}
            className="review-product-thumb"
            onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
          />
          <span className="review-product-name">{product?.name || 'O\'chirilgan mahsulot'}</span>
        </div>
      )
    },
    {
      key: 'user_id',
      label: 'Muallif (Mijoz)',
      render: (user) => (
        <div className="review-author-cell">
          <span className="author-name">{user?.name || 'Mijoz'}</span>
          <span className="author-email">{user?.email || '—'}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Baho',
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
      label: 'Izoh (Sharh matni)',
      render: (val) => (
        <p className="review-comment-text" title={val}>
          {val ? (val.length > 80 ? val.slice(0, 80) + '...' : val) : '—'}
        </p>
      )
    },
    {
      key: 'createdAt',
      label: 'Sana',
      render: (val) => new Date(val).toLocaleDateString('uz-UZ')
    },
    {
      key: 'actions',
      label: 'Moderatsiya',
      align: 'right',
      render: (_, row) => (
        <button
          type="button"
          className="action-icon-btn delete"
          onClick={() => setDeleteConfirmId(row._id)}
          title="Sharhni o'chirish"
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
          <h2 className="admin-hero-title">Sharhlar va baholar</h2>
          <p className="admin-hero-subtitle">
            Mijozlar tomonidan qoldirilgan fikr-mulohazalar moderatsiyasi
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={fetchReviews}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>Yangilash</span>
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
            <option value="">Barcha mahsulotlar</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          <select
            className="admin-select"
            value={ratingFilter}
            onChange={(e) => { setRatingFilter(e.target.value); setPage(1); }}
          >
            <option value="">Barcha baholar</option>
            <option value="5">5 yulduz ⭐⭐⭐⭐⭐</option>
            <option value="4">4 yulduz ⭐⭐⭐⭐</option>
            <option value="3">3 yulduz ⭐⭐⭐</option>
            <option value="2">2 yulduz ⭐⭐</option>
            <option value="1">1 yulduz ⭐</option>
          </select>

          {(productFilter || ratingFilter) && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => { setProductFilter(''); setRatingFilter(''); setPage(1); }}
            >
              Tozalash
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
        emptyMessage="Sharhlar topilmadi"
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Sharhni o'chirish"
        message="Haqiqatan ham ushbu sharhni moderatsiyadan o'chirishni xohlaysizmi?"
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

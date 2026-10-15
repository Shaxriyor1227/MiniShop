import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  AlertTriangle,
  RefreshCw,
  Filter
} from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import EmptyState from '../../../components/Admin/EmptyState';
import Toast from '../../../components/Admin/Toast';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    brand_id: '',
    imageUrl: ''
  });

  // Fetch Categories & Brands once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brRes] = await Promise.all([
          axiosInstance.get('/category/getAll'),
          axiosInstance.get('/brand/getAll')
        ]);
        if (catRes.data.success) setCategories(catRes.data.innerData || []);
        if (brRes.data.success) setBrands(brRes.data.innerData || []);
      } catch (err) {
        console.error('[Metadata Error]:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products with pagination, search, filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit
      };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category_id = categoryFilter;
      if (brandFilter) params.brand_id = brandFilter;

      const res = await axiosInstance.get('/product/getAll', { params });
      if (res.data.success) {
        setProducts(res.data.innerData || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Products Fetch Error]:', err);
      showToast('Mahsulotlarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, brandFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '10',
      category_id: categories[0]?._id || '',
      brand_id: brands[0]?._id || '',
      imageUrl: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      price: p.price ?? '',
      stock: p.stock ?? '',
      category_id: p.category_id?._id || p.category_id || (categories[0]?._id || ''),
      brand_id: p.brand_id?._id || p.brand_id || (brands[0]?._id || ''),
      imageUrl: p.images?.[0] || ''
    });
    setIsModalOpen(true);
  };

  // Upload image to /upload/image
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setIsUploadingImage(true);
      const res = await axiosInstance.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: res.data.innerData.url }));
        showToast('Rasm muvaffaqiyatli yuklandi!');
      } else {
        showToast(res.data.message || 'Rasm yuklanmadi', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Rasm yuklashda xatolik', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === '' || !formData.category_id || !formData.brand_id) {
      showToast('Iltimos, barcha majburiy maydonlarni to\'ldiring', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      category_id: formData.category_id,
      brand_id: formData.brand_id,
      images: formData.imageUrl ? [formData.imageUrl] : ['/images/product_placeholder.png']
    };

    try {
      setSubmitting(true);
      if (editingProduct) {
        const res = await axiosInstance.put(`/product/update/${editingProduct._id}`, payload);
        if (res.data.success) {
          showToast('Mahsulot muvaffaqiyatli yangilandi!');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await axiosInstance.post('/product/create', payload);
        if (res.data.success) {
          showToast('Yangi mahsulot qo\'shildi!');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Saqlashda xatolik yuz berdi', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/product/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast('Mahsulot muvaffaqiyatli o\'chirildi');
        setDeleteConfirmId(null);
        fetchProducts();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik yuz berdi', 'error');
    }
  };

  // Table columns definition
  const columns = [
    {
      key: 'images',
      label: 'Rasm',
      width: '70px',
      render: (_, row) => (
        <img
          src={row.images?.[0] || '/images/product_placeholder.png'}
          alt={row.name}
          className="prod-table-thumb"
          onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
        />
      )
    },
    {
      key: 'name',
      label: 'Mahsulot nomi',
      render: (val, row) => (
        <div className="prod-name-cell">
          <span className="prod-title">{val}</span>
          <span className="prod-id">ID: #{row._id.slice(-6)}</span>
        </div>
      )
    },
    {
      key: 'category_id',
      label: 'Kategoriya',
      render: (cat) => <span className="meta-badge">{cat?.name || '—'}</span>
    },
    {
      key: 'brand_id',
      label: 'Brend',
      render: (brand) => <span className="meta-badge brand">{brand?.name || '—'}</span>
    },
    {
      key: 'price',
      label: 'Narx',
      render: (val) => <strong className="prod-price">${val}</strong>
    },
    {
      key: 'stock',
      label: 'Zaxira',
      render: (val) => (
        <span className={`prod-stock-badge ${val === 0 ? 'zero' : val < 5 ? 'low' : 'ok'}`}>
          {val === 0 ? 'Tugagan (0)' : `${val} ta`}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Amallar',
      align: 'right',
      render: (_, row) => (
        <div className="table-actions-cell">
          <button
            type="button"
            className="action-icon-btn edit"
            onClick={() => handleOpenEdit(row)}
            title="Tahrirlash"
          >
            <Edit size={15} />
          </button>
          <button
            type="button"
            className="action-icon-btn delete"
            onClick={() => setDeleteConfirmId(row._id)}
            title="O'chirish"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-products-page">
      {/* Page Title & Actions */}
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Mahsulotlar katalogi</h2>
          <p className="admin-hero-subtitle">
            Barcha mahsulotlarni boshqarish, narx va zaxiralarni tahrirlash
          </p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchProducts}
            title="Yangilash"
          >
            <RefreshCw size={15} className={loading ? 'spinning' : ''} />
            <span>Yangilash</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenCreate}
          >
            <Plus size={16} />
            <span>Yangi mahsulot</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="products-filter-bar">
        <div className="filter-select-group">
          <Filter size={15} className="filter-icon" />
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <select
            className="admin-select"
            value={brandFilter}
            onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
          >
            <option value="">Barcha brendlar</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>

          {(categoryFilter || brandFilter) && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={() => { setCategoryFilter(''); setBrandFilter(''); setPage(1); }}
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Nomi bo'yicha qidirish..."
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
        emptyMessage="Birorta ham mahsulot topilmadi"
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
        subtitle="Mahsulot ma'lumotlarini to'liq kiriting"
        maxWidth="640px"
      >
        <form onSubmit={handleSaveProduct} className="admin-form-grid">
          <div className="form-group full-width">
            <label className="form-label">Mahsulot nomi *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Studio Wireless Pro"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Narxi ($) *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              className="admin-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Masalan: 299"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ombordagi zaxirasi (dona) *</label>
            <input
              type="number"
              min="0"
              required
              className="admin-input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="Masalan: 25"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategoriya *</label>
            <select
              required
              className="admin-select"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Kategoriyani tanlang</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Brend *</label>
            <select
              required
              className="admin-select"
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
            >
              <option value="">Brendni tanlang</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Image Upload Block */}
          <div className="form-group full-width">
            <label className="form-label">Mahsulot rasmi</label>
            <div className="image-upload-wrapper">
              <div className="image-preview-box">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="uploaded-preview"
                    onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <ImageIcon size={32} />
                    <span>Rasm yo'q</span>
                  </div>
                )}
              </div>

              <div className="upload-controls">
                <label className="file-upload-label">
                  <UploadCloud size={16} />
                  <span>{isUploadingImage ? 'Yuklanmoqda...' : 'Rasm faylini yuklash'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    style={{ display: 'none' }}
                  />
                </label>
                <div className="or-divider">yoki to'g'ridan-to'g'ri URL:</div>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://example.com/rasm.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-form-actions full-width">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting || isUploadingImage}
            >
              {submitting ? 'Saqlanmoqda...' : editingProduct ? 'Yangilash' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteProduct}
        title="Mahsulotni o'chirish"
        message="Haqiqatan ham ushbu mahsulotni o'chirib tashlamoqchimisiz? Ushbu amalni qaytarib bo'lmaydi."
        confirmText="Ha, o'chirilsin"
        cancelText="Bekor qilish"
        type="danger"
      />

      {/* Toast notifications */}
      {toast && (
        <div className="admin-toast-container">
          <Toast notification={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default Products;

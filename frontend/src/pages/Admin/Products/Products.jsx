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
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Products.css';

const Products = () => {
  const { t } = useTranslation();
  const { formatPrice } = useFormatters();

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
  const [activeLangTab, setActiveLangTab] = useState('uz'); // 'uz' | 'ru' | 'en'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  // Form State with multi-language translations
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    brand_id: '',
    imageUrl: '',
    translations: {
      uz: { name: '', description: '' },
      ru: { name: '', description: '' },
      en: { name: '', description: '' }
    }
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
      showToast(getApiErrorMessage(err, 'admin.products.toast_error'), 'error');
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
    setActiveLangTab('uz');
    setFormData({
      name: '',
      price: '',
      stock: '10',
      category_id: categories[0]?._id || '',
      brand_id: brands[0]?._id || '',
      imageUrl: '',
      translations: {
        uz: { name: '', description: '' },
        ru: { name: '', description: '' },
        en: { name: '', description: '' }
      }
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setActiveLangTab('uz');
    setFormData({
      name: p.name || '',
      price: p.price ?? '',
      stock: p.stock ?? '',
      category_id: p.category_id?._id || p.category_id || (categories[0]?._id || ''),
      brand_id: p.brand_id?._id || p.brand_id || (brands[0]?._id || ''),
      imageUrl: p.images?.[0] || '',
      translations: {
        uz: {
          name: p.translations?.uz?.name || (p.translations?.uz ? p.translations.uz.name : p.name) || '',
          description: p.translations?.uz?.description || (p.translations?.uz ? p.translations.uz.description : p.description) || ''
        },
        ru: {
          name: p.translations?.ru?.name || p.name || '',
          description: p.translations?.ru?.description || p.description || ''
        },
        en: {
          name: p.translations?.en?.name || p.name || '',
          description: p.translations?.en?.description || p.description || ''
        }
      }
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
        showToast(t('admin.products.toast_upload_success'));
      } else {
        showToast(res.data.message || t('admin.products.toast_upload_error'), 'error');
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.products.toast_upload_error'), 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const primaryName = formData.translations[activeLangTab].name || formData.translations.uz.name || formData.translations.en.name || formData.name;
    if (!primaryName.trim() || formData.price === '' || !formData.category_id || !formData.brand_id) {
      showToast(t('admin.common.error'), 'error');
      return;
    }

    const payload = {
      name: primaryName.trim(),
      description: formData.translations[activeLangTab].description || formData.translations.en.description || '',
      translations: formData.translations,
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
          showToast(t('admin.products.toast_updated'));
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await axiosInstance.post('/product/create', payload);
        if (res.data.success) {
          showToast(t('admin.products.toast_created'));
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.products.toast_error'), 'error');
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
        showToast(t('admin.products.toast_deleted'));
        setDeleteConfirmId(null);
        fetchProducts();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.products.toast_error'), 'error');
    }
  };

  // Table columns definition
  const columns = [
    {
      key: 'images',
      label: t('admin.products.col_image'),
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
      label: t('admin.products.col_name'),
      render: (val, row) => (
        <div className="prod-name-cell">
          <span className="prod-title">{val}</span>
          <span className="prod-id">ID: #{row._id.slice(-6)}</span>
        </div>
      )
    },
    {
      key: 'category_id',
      label: t('admin.products.col_category'),
      render: (cat) => <span className="meta-badge">{cat?.name || '—'}</span>
    },
    {
      key: 'brand_id',
      label: t('admin.products.col_brand'),
      render: (brand) => <span className="meta-badge brand">{brand?.name || '—'}</span>
    },
    {
      key: 'price',
      label: t('admin.products.col_price'),
      render: (val) => <strong className="prod-price">{formatPrice(val)}</strong>
    },
    {
      key: 'stock',
      label: t('admin.products.col_stock'),
      render: (val) => (
        <span className={`prod-stock-badge ${val === 0 ? 'zero' : val < 5 ? 'low' : 'ok'}`}>
          {val === 0 ? `0 ${t('admin.dashboard.units_left')}` : `${val} ${t('admin.dashboard.units_left')}`}
        </span>
      )
    },
    {
      key: 'actions',
      label: t('admin.products.col_actions'),
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
    <div className="admin-products-page">
      {/* Page Title & Actions */}
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.products.title')}</h2>
          <p className="admin-hero-subtitle">
            {t('admin.products.subtitle')}
          </p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchProducts}
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
            <span>{t('admin.products.add_btn')}</span>
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
            <option value="">{t('admin.categories.title')}: {t('admin.common.all')}</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <select
            className="admin-select"
            value={brandFilter}
            onChange={(e) => { setBrandFilter(e.target.value); setPage(1); }}
          >
            <option value="">{t('admin.brands.title')}: {t('admin.common.all')}</option>
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
              {t('admin.common.clear')}
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
        searchPlaceholder={t('admin.products.search_placeholder')}
        pagination={{
          page,
          totalPages,
          total,
          onPageChange: (p) => setPage(p)
        }}
      />

      {/* Create / Edit Modal with Language Tabs */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingProduct ? t('admin.products.edit_title') : t('admin.products.new_title')}
        subtitle={t('admin.products.subtitle')}
        maxWidth="680px"
      >
        <form onSubmit={handleSaveProduct} className="admin-form-grid">
          {/* Multi-language Tabs */}
          <div className="form-group full-width">
            <label className="form-label">{t('admin.products.label_name')} & {t('admin.products.label_description')}</label>
            <div className="admin-lang-tabs">
              <button
                type="button"
                className={`admin-lang-tab-btn ${activeLangTab === 'uz' ? 'active' : ''}`}
                onClick={() => setActiveLangTab('uz')}
              >
                {t('admin.products.tab_uz')}
              </button>
              <button
                type="button"
                className={`admin-lang-tab-btn ${activeLangTab === 'ru' ? 'active' : ''}`}
                onClick={() => setActiveLangTab('ru')}
              >
                {t('admin.products.tab_ru')}
              </button>
              <button
                type="button"
                className={`admin-lang-tab-btn ${activeLangTab === 'en' ? 'active' : ''}`}
                onClick={() => setActiveLangTab('en')}
              >
                {t('admin.products.tab_en')}
              </button>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">{t('admin.products.label_name')} ({activeLangTab.toUpperCase()}) *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={formData.translations[activeLangTab].name}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  name: val,
                  translations: {
                    ...prev.translations,
                    [activeLangTab]: {
                      ...prev.translations[activeLangTab],
                      name: val
                    }
                  }
                }));
              }}
              placeholder={t('admin.products.placeholder_name')}
            />
          </div>

          <div className="form-group full-width">
            <label className="form-label">{t('admin.products.label_description')} ({activeLangTab.toUpperCase()})</label>
            <textarea
              className="admin-textarea"
              value={formData.translations[activeLangTab].description}
              onChange={(e) => {
                const val = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  translations: {
                    ...prev.translations,
                    [activeLangTab]: {
                      ...prev.translations[activeLangTab],
                      description: val
                    }
                  }
                }));
              }}
              placeholder={t('admin.products.placeholder_desc')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_price')} *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              className="admin-input"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="99.99"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_stock')} *</label>
            <input
              type="number"
              min="0"
              required
              className="admin-input"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="10"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_category')} *</label>
            <select
              required
              className="admin-select"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">{t('admin.products.select_category')}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_brand')} *</label>
            <select
              required
              className="admin-select"
              value={formData.brand_id}
              onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
            >
              <option value="">{t('admin.products.select_brand')}</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Image Upload Block */}
          <div className="form-group full-width">
            <label className="form-label">{t('admin.products.label_image_url')}</label>
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
                    <span>{t('admin.common.no')}</span>
                  </div>
                )}
              </div>

              <div className="upload-controls">
                <label className="file-upload-label">
                  <UploadCloud size={16} />
                  <span>{isUploadingImage ? t('admin.common.loading') : t('admin.products.label_upload_file')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    style={{ display: 'none' }}
                  />
                </label>
                <div className="or-divider">{t('admin.products.label_image_url')}:</div>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="https://example.com/image.jpg"
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
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting || isUploadingImage}
            >
              {submitting ? t('admin.common.processing') : editingProduct ? t('admin.common.save') : t('admin.common.create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteProduct}
        title={t('admin.common.delete')}
        message={t('admin.products.delete_confirm')}
        confirmText={t('admin.common.yes')}
        cancelText={t('admin.common.cancel')}
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

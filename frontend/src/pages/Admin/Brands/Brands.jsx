import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Brands.css';

const Brands = () => {
  const { t, i18n } = useTranslation();
  const { formatDate } = useFormatters();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('uz');
  const [translations, setTranslations] = useState({
    uz: { name: '' },
    ru: { name: '' },
    en: { name: '' }
  });
  const [logo, setLogo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/brand/getAll');
      if (res.data.success) {
        setBrands(res.data.innerData || []);
      }
    } catch (err) {
      console.error('[Brands Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.brands.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setTranslations({
      uz: { name: '' },
      ru: { name: '' },
      en: { name: '' }
    });
    setLogo('');
    setActiveLangTab(i18n.language || 'uz');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBrand(b);
    setTranslations({
      uz: { name: b.translations?.uz?.name || b.name || '' },
      ru: { name: b.translations?.ru?.name || b.name || '' },
      en: { name: b.translations?.en?.name || b.name || '' }
    });
    setLogo(b.logo || '');
    setActiveLangTab(i18n.language || 'uz');
    setIsModalOpen(true);
  };

  const handleTranslationChange = (field, val) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLangTab]: {
        ...prev[activeLangTab],
        [field]: val
      }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const primaryName = translations[activeLangTab]?.name || translations.uz?.name || translations.en?.name || '';
    if (!primaryName.trim()) {
      showToast(t('admin.common.error'), 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: primaryName.trim(),
        logo: logo.trim(),
        translations
      };

      if (editingBrand) {
        const res = await axiosInstance.put(`/brand/update/${editingBrand._id}`, payload);
        if (res.data.success) {
          showToast(t('admin.brands.toast_updated'));
          setIsModalOpen(false);
          fetchBrands();
        }
      } else {
        const res = await axiosInstance.post('/brand/create', payload);
        if (res.data.success) {
          showToast(t('admin.brands.toast_created'));
          setIsModalOpen(false);
          fetchBrands();
        }
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.brands.toast_error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/brand/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast(t('admin.brands.toast_deleted'));
        setDeleteConfirmId(null);
        fetchBrands();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.brands.toast_error'), 'error');
    }
  };

  const filteredBrands = brands.filter((b) => {
    const localizedName = b.translations?.[i18n.language]?.name || b.name || '';
    return localizedName.toLowerCase().includes(search.toLowerCase()) || (b.slug && b.slug.toLowerCase().includes(search.toLowerCase()));
  });

  const columns = [
    {
      key: 'name',
      label: t('admin.brands.col_name'),
      render: (val, row) => {
        const localizedName = row.translations?.[i18n.language]?.name || val;
        return (
          <div className="brand-name-cell">
            <div className="brand-icon-badge">
              <Award size={16} />
            </div>
            <div>
              <span className="brand-title">{localizedName}</span>
              <span className="brand-id">ID: #{row._id.slice(-6)}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'slug',
      label: t('admin.brands.col_slug'),
      render: (val) => val || '—'
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
    <div className="admin-brands-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.brands.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.brands.subtitle')}</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchBrands}
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
            <span>{t('admin.brands.add_btn')}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredBrands}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.brands.search_placeholder')}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingBrand ? t('admin.brands.edit_title') : t('admin.brands.new_title')}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="admin-form-vertical">
          <div className="admin-lang-tabs">
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'uz' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('uz')}
            >
              {t('admin.brands.tab_uz')}
            </button>
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'ru' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('ru')}
            >
              {t('admin.brands.tab_ru')}
            </button>
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'en' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('en')}
            >
              {t('admin.brands.tab_en')}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.brands.label_name')} ({activeLangTab.toUpperCase()}) *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={translations[activeLangTab]?.name || ''}
              onChange={(e) => handleTranslationChange('name', e.target.value)}
              placeholder={t('admin.brands.placeholder_name')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_image_url')}</label>
            <input
              type="text"
              className="admin-input"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="/images/brands/apple.png"
            />
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
              {submitting ? t('admin.common.processing') : editingBrand ? t('admin.common.save') : t('admin.common.create')}
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
        message={t('admin.brands.delete_confirm')}
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

export default Brands;

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
import './Categories.css';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const { formatDate } = useFormatters();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeLangTab, setActiveLangTab] = useState('uz');
  const [translations, setTranslations] = useState({
    uz: { name: '' },
    ru: { name: '' },
    en: { name: '' }
  });
  const [image, setImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/category/getAll');
      if (res.data.success) {
        setCategories(res.data.innerData || []);
      }
    } catch (err) {
      console.error('[Categories Fetch Error]:', err);
      showToast(getApiErrorMessage(err, 'admin.categories.toast_error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setTranslations({
      uz: { name: '' },
      ru: { name: '' },
      en: { name: '' }
    });
    setImage('');
    setActiveLangTab(i18n.language || 'uz');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setTranslations({
      uz: { name: c.translations?.uz?.name || c.name || '' },
      ru: { name: c.translations?.ru?.name || c.name || '' },
      en: { name: c.translations?.en?.name || c.name || '' }
    });
    setImage(c.image || '');
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
        image: image.trim(),
        translations
      };

      if (editingCategory) {
        const res = await axiosInstance.put(`/category/update/${editingCategory._id}`, payload);
        if (res.data.success) {
          showToast(t('admin.categories.toast_updated'));
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await axiosInstance.post('/category/create', payload);
        if (res.data.success) {
          showToast(t('admin.categories.toast_created'));
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.categories.toast_error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/category/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast(t('admin.categories.toast_deleted'));
        setDeleteConfirmId(null);
        fetchCategories();
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, 'admin.categories.toast_error'), 'error');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const localizedName = c.translations?.[i18n.language]?.name || c.name || '';
    return localizedName.toLowerCase().includes(search.toLowerCase()) || (c.slug && c.slug.toLowerCase().includes(search.toLowerCase()));
  });

  const columns = [
    {
      key: 'name',
      label: t('admin.categories.col_name'),
      render: (val, row) => {
        const localizedName = row.translations?.[i18n.language]?.name || val;
        return (
          <div className="cat-name-cell">
            <div className="cat-icon-badge">
              <Layers size={16} />
            </div>
            <div>
              <span className="cat-title">{localizedName}</span>
              <span className="cat-id">ID: #{row._id.slice(-6)}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'slug',
      label: t('admin.categories.col_slug'),
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
    <div className="admin-categories-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.categories.title')}</h2>
          <p className="admin-hero-subtitle">{t('admin.categories.subtitle')}</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchCategories}
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
            <span>{t('admin.categories.add_btn')}</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.categories.search_placeholder')}
        emptyMessage={t('admin.empty.desc')}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingCategory ? t('admin.categories.edit_title') : t('admin.categories.new_title')}
        maxWidth="500px"
      >
        <form onSubmit={handleSave} className="admin-form-vertical">
          <div className="admin-lang-tabs">
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'uz' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('uz')}
            >
              {t('admin.categories.tab_uz')}
            </button>
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'ru' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('ru')}
            >
              {t('admin.categories.tab_ru')}
            </button>
            <button
              type="button"
              className={`admin-lang-tab-btn ${activeLangTab === 'en' ? 'active' : ''}`}
              onClick={() => setActiveLangTab('en')}
            >
              {t('admin.categories.tab_en')}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.categories.label_name')} ({activeLangTab.toUpperCase()}) *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={translations[activeLangTab]?.name || ''}
              onChange={(e) => handleTranslationChange('name', e.target.value)}
              placeholder={t('admin.categories.placeholder_name')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('admin.products.label_image_url')}</label>
            <input
              type="text"
              className="admin-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/audio.png"
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
              {submitting ? t('admin.common.processing') : editingCategory ? t('admin.common.save') : t('admin.common.create')}
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
        message={t('admin.categories.delete_confirm')}
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

export default Categories;

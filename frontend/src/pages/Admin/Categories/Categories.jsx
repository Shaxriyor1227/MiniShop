import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Layers, RefreshCw } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [name, setName] = useState('');
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
      showToast('Kategoriyalarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setImage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setName(c.name || '');
    setImage(c.image || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Kategoriya nomini kiriting', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name: name.trim(), image: image.trim() };
      if (editingCategory) {
        const res = await axiosInstance.put(`/category/update/${editingCategory._id}`, payload);
        if (res.data.success) {
          showToast('Kategoriya muvaffaqiyatli yangilandi');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await axiosInstance.post('/category/create', payload);
        if (res.data.success) {
          showToast('Yangi kategoriya yaratildi');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Saqlashda xatolik', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await axiosInstance.delete(`/category/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast('Kategoriya o\'chirildi');
        setDeleteConfirmId(null);
        fetchCategories();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik', 'error');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Kategoriya nomi',
      render: (val, row) => (
        <div className="cat-name-cell">
          <div className="cat-icon-badge">
            <Layers size={16} />
          </div>
          <div>
            <span className="cat-title">{val}</span>
            <span className="cat-id">ID: #{row._id.slice(-6)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'image',
      label: 'Rasm / Ikonka',
      render: (val) => val ? (
        <span className="image-url-tag">{val.length > 30 ? val.slice(0, 30) + '...' : val}</span>
      ) : '—'
    },
    {
      key: 'createdAt',
      label: 'Yaratilgan sana',
      render: (val) => new Date(val).toLocaleDateString('uz-UZ')
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
    <div className="admin-categories-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Kategoriyalar</h2>
          <p className="admin-hero-subtitle">Mahsulot toifalari va guruhlarini boshqarish</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchCategories}
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
            <span>Yangi kategoriya</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCategories}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Kategoriya qidirish..."
        emptyMessage="Birorta ham kategoriya mavjud emas"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya yaratish'}
        maxWidth="460px"
      >
        <form onSubmit={handleSave} className="admin-form-vertical">
          <div className="form-group">
            <label className="form-label">Kategoriya nomi *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Wireless Audio"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rasm yoki Ikonka URL (ixtiyoriy)</label>
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
              Bekor qilish
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saqlanmoqda...' : editingCategory ? 'Yangilash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Kategoriyani o'chirish"
        message="Haqiqatan ham bu kategoriyani o'chirmoqchimisiz? Ushbu toifadagi mahsulotlar ta'sirlanishi mumkin."
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

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award, RefreshCw } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import DataTable from '../../../components/Admin/DataTable';
import Modal from '../../../components/Admin/Modal';
import ConfirmDialog from '../../../components/Admin/ConfirmDialog';
import Toast from '../../../components/Admin/Toast';
import './Brands.css';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [name, setName] = useState('');
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
      showToast('Brendlarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setName('');
    setLogo('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBrand(b);
    setName(b.name || '');
    setLogo(b.logo || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Brend nomini kiriting', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name: name.trim(), logo: logo.trim() };
      if (editingBrand) {
        const res = await axiosInstance.put(`/brand/update/${editingBrand._id}`, payload);
        if (res.data.success) {
          showToast('Brend muvaffaqiyatli yangilandi');
          setIsModalOpen(false);
          fetchBrands();
        }
      } else {
        const res = await axiosInstance.post('/brand/create', payload);
        if (res.data.success) {
          showToast('Yangi brend yaratildi');
          setIsModalOpen(false);
          fetchBrands();
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
      const res = await axiosInstance.delete(`/brand/delete/${deleteConfirmId}`);
      if (res.data.success) {
        showToast('Brend o\'chirildi');
        setDeleteConfirmId(null);
        fetchBrands();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik', 'error');
    }
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name',
      label: 'Brend nomi',
      render: (val, row) => (
        <div className="brand-name-cell">
          <div className="brand-icon-badge">
            <Award size={16} />
          </div>
          <div>
            <span className="brand-title">{val}</span>
            <span className="brand-id">ID: #{row._id.slice(-6)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'logo',
      label: 'Logo URL',
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
    <div className="admin-brands-page">
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Brendlar</h2>
          <p className="admin-hero-subtitle">Do'kondagi rasmiy brendlar va ishlab chiqaruvchilar ro'yxati</p>
        </div>
        <div className="hero-action-group">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={fetchBrands}
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
            <span>Yangi brend</span>
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredBrands}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Brend qidirish..."
        emptyMessage="Birorta ham brend mavjud emas"
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !submitting && setIsModalOpen(false)}
        title={editingBrand ? 'Brendni tahrirlash' : 'Yangi brend yaratish'}
        maxWidth="460px"
      >
        <form onSubmit={handleSave} className="admin-form-vertical">
          <div className="form-group">
            <label className="form-label">Brend nomi *</label>
            <input
              type="text"
              required
              className="admin-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Apple, Sony, Bose"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Logo URL (ixtiyoriy)</label>
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
              Bekor qilish
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Saqlanmoqda...' : editingBrand ? 'Yangilash' : 'Yaratish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Brendni o'chirish"
        message="Haqiqatan ham bu brendni o'chirmoqchimisiz? Ushbu brendga biriktirilgan mahsulotlar ta'sirlanishi mumkin."
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

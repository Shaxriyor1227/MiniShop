import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  Check,
  X,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Filter & Search states
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    brand_id: '',
    imageUrl: ''
  });

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [prodRes, ordRes, catRes, brRes] = await Promise.all([
        axiosInstance.get('/product/getAll'),
        axiosInstance.get('/order/getAll'),
        axiosInstance.get('/category/getAll'),
        axiosInstance.get('/brand/getAll')
      ]);

      if (prodRes.data.success) setProducts(prodRes.data.innerData || []);
      if (ordRes.data.success) setOrders(ordRes.data.innerData || []);
      if (catRes.data.success) setCategories(catRes.data.innerData || []);
      if (brRes.data.success) setBrands(brRes.data.innerData || []);
    } catch (err) {
      console.error('[Admin Fetch Error]:', err);
      showToast('Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle open modal for create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '10',
      category_id: categories[0]?._id || '',
      brand_id: brands[0]?._id || '',
      imageUrl: ''
    });
    setIsProductModalOpen(true);
  };

  // Handle open modal for edit
  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      price: p.price || '',
      stock: p.stock ?? 10,
      category_id: p.category_id?._id || p.category_id || (categories[0]?._id || ''),
      brand_id: p.brand_id?._id || p.brand_id || (brands[0]?._id || ''),
      imageUrl: p.images?.[0] || ''
    });
    setIsProductModalOpen(true);
  };

  // Handle image upload to /upload/image
  const handleImageFileUpload = async (e) => {
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

  // Handle form submit (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id || !formData.brand_id) {
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
      if (editingProduct) {
        const res = await axiosInstance.put(`/product/update/${editingProduct._id}`, payload);
        if (res.data.success) {
          showToast('Mahsulot yangilandi!');
          setIsProductModalOpen(false);
          fetchData();
        }
      } else {
        const res = await axiosInstance.post('/product/create', payload);
        if (res.data.success) {
          showToast('Yangi mahsulot qo\'shildi!');
          setIsProductModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Saqlashda xatolik yuz berdi', 'error');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      const res = await axiosInstance.delete(`/product/delete/${id}`);
      if (res.data.success) {
        showToast('Mahsulot o\'chirildi');
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'O\'chirishda xatolik', 'error');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosInstance.put(`/order/update/${orderId}`, { status: newStatus });
      if (res.data.success) {
        showToast(`Buyurtma holati "${newStatus}" ga o'zgartirildi`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Holatni yangilab bo\'lmadi', 'error');
    }
  };

  // Calculations for overview stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 5).length;

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o._id && o._id.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.user_id?.name && o.user_id.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.user_id?.email && o.user_id.email.toLowerCase().includes(orderSearch.toLowerCase()));

    const matchesStatus =
      orderStatusFilter === 'all' ? true : o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge status-paid"><Check size={12} /> To'langan</span>;
      case 'shipped':
        return <span className="status-badge status-shipped"><Truck size={12} /> Yo'lda</span>;
      case 'delivered':
        return <span className="status-badge status-delivered"><CheckCircle size={12} /> Yetkazildi</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled"><X size={12} /> Bekor qilindi</span>;
      default:
        return <span className="status-badge status-pending"><Clock size={12} /> Kutilmoqda</span>;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Admin paneli yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`admin-toast ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="container admin-container">
        {/* Top Header */}
        <div className="admin-header-bar">
          <div>
            <div className="admin-badge">
              <ShieldCheck size={14} />
              <span>Boshqaruv Tizimi</span>
            </div>
            <h1 className="admin-title">MiniShop Admin Paneli</h1>
            <p className="admin-subtitle">
              Xush kelibsiz, <strong>{user?.name}</strong>! Tovarlar, buyurtmalar va do'kon statistikasini boshqaring.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              className="admin-btn admin-btn-outline"
              onClick={fetchData}
              disabled={refreshing}
              title="Ma'lumotlarni yangilash"
            >
              <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
              <span>Yangilash</span>
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleOpenCreateModal}
            >
              <Plus size={16} />
              <span>Yangi Tovar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={16} />
            <span>Umumiy Ko'rinish</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            <span>Tovarlar ({products.length})</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={16} />
            <span>Buyurtmalar ({orders.length})</span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card card">
                <div className="stat-card-icon revenue-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-card-info">
                  <p className="stat-label">Jami Tushum</p>
                  <h3 className="stat-value">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                  <span className="stat-tag success">+12% bu oyda</span>
                </div>
              </div>

              <div className="admin-stat-card card">
                <div className="stat-card-icon orders-icon">
                  <ShoppingBag size={24} />
                </div>
                <div className="stat-card-info">
                  <p className="stat-label">Jami Buyurtmalar</p>
                  <h3 className="stat-value">{totalOrdersCount} ta</h3>
                  <span className="stat-tag">{orders.filter(o => o.status === 'paid' || o.status === 'pending').length} faol</span>
                </div>
              </div>

              <div className="admin-stat-card card">
                <div className="stat-card-icon products-icon">
                  <Package size={24} />
                </div>
                <div className="stat-card-info">
                  <p className="stat-label">Katalogdagi Tovarlar</p>
                  <h3 className="stat-value">{totalProductsCount} xil</h3>
                  <span className="stat-tag info">{categories.length} ta kategoriya</span>
                </div>
              </div>

              <div className="admin-stat-card card">
                <div className="stat-card-icon alert-icon">
                  <AlertCircle size={24} />
                </div>
                <div className="stat-card-info">
                  <p className="stat-label">Kam Qolgan Tovarlar</p>
                  <h3 className="stat-value">{lowStockCount} ta</h3>
                  <span className="stat-tag warning">Zaxira &lt; 5 dona</span>
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="admin-section-box card">
              <div className="section-box-header">
                <div>
                  <h2 className="section-box-title">Oxirgi Buyurtmalar</h2>
                  <p className="section-box-subtitle">Eng oxirgi kelib tushgan mijoz xaridlari</p>
                </div>
                <button
                  className="admin-link-btn"
                  onClick={() => setActiveTab('orders')}
                >
                  Barcha buyurtmalarni ko'rish <ExternalLink size={14} />
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mijoz</th>
                      <th>Sana</th>
                      <th>Summa</th>
                      <th>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord._id}>
                        <td className="font-mono">#{ord._id.slice(-6).toUpperCase()}</td>
                        <td>
                          <div className="table-user-cell">
                            <strong>{ord.user_id?.name || 'Mijoz'}</strong>
                            <small>{ord.user_id?.email || '-'}</small>
                          </div>
                        </td>
                        <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="font-bold">${Number(ord.total).toFixed(2)}</td>
                        <td>{getStatusBadge(ord.status)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          Hozircha buyurtmalar yo'q
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS MANAGEMENT TAB */}
        {activeTab === 'products' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar">
              <div className="admin-search-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Tovar nomi bo'yicha qidirish..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <button
                className="admin-btn admin-btn-primary"
                onClick={handleOpenCreateModal}
              >
                <Plus size={16} />
                <span>Yangi Tovar Qo'shish</span>
              </button>
            </div>

            <div className="admin-section-box card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Rasm</th>
                      <th>Tovar Nomi</th>
                      <th>Kategoriya</th>
                      <th>Narx</th>
                      <th>Zaxira</th>
                      <th className="text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => {
                      const categoryName = categories.find(
                        (c) => c._id === (p.category_id?._id || p.category_id)
                      )?.name || 'Kategoriya';

                      return (
                        <tr key={p._id}>
                          <td>
                            <img
                              src={p.images?.[0] || '/images/product_placeholder.png'}
                              alt={p.name}
                              className="admin-table-product-img"
                            />
                          </td>
                          <td>
                            <strong className="product-table-title">{p.name}</strong>
                          </td>
                          <td>
                            <span className="category-pill-badge">{categoryName}</span>
                          </td>
                          <td className="font-bold">${Number(p.price).toFixed(2)}</td>
                          <td>
                            <span
                              className={`stock-indicator ${
                                (p.stock || 0) < 5 ? 'low' : 'ok'
                              }`}
                            >
                              {p.stock} dona
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="action-buttons-cell">
                              <button
                                className="icon-action-btn edit-btn"
                                onClick={() => handleOpenEditModal(p)}
                                title="Tahrirlash"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="icon-action-btn delete-btn"
                                onClick={() => setDeleteConfirmId(p._id)}
                                title="O'chirish"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-muted">
                          Hech qanday tovar topilmadi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS MANAGEMENT TAB */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="admin-toolbar orders-toolbar">
              <div className="admin-search-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="ID yoki mijoz bo'yicha qidirish..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>

              <div className="status-filter-buttons">
                {['all', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    className={`status-filter-btn ${orderStatusFilter === st ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(st)}
                  >
                    {st === 'all' ? 'Barchasi' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-section-box card">
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Buyurtma ID</th>
                      <th>Mijoz & Manzil</th>
                      <th>Mahsulotlar</th>
                      <th>Jami</th>
                      <th>Hozirgi Holat</th>
                      <th>Holatni O'zgartirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord._id}>
                        <td className="font-mono">
                          <strong>#{ord._id.slice(-6).toUpperCase()}</strong>
                          <div className="text-muted text-xs">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="table-user-cell">
                            <strong>{ord.user_id?.name || 'Mijoz'}</strong>
                            <small>{ord.user_id?.email || '-'}</small>
                            <span className="text-xs text-muted">
                              {ord.address_id?.city || 'Toshkent'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="order-items-preview">
                            {(ord.items || []).map((it, idx) => (
                              <span key={idx} className="item-pill">
                                {it.product_id?.name || 'Tovar'} × {it.quantity}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="font-bold text-lg text-primary">
                          ${Number(ord.total).toFixed(2)}
                        </td>
                        <td>{getStatusBadge(ord.status)}</td>
                        <td>
                          <select
                            className="admin-status-select"
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          >
                            <option value="pending">Kutilmoqda (Pending)</option>
                            <option value="paid">To'landi (Paid)</option>
                            <option value="shipped">Yo'lda (Shipped)</option>
                            <option value="delivered">Yetkazildi (Delivered)</option>
                            <option value="cancelled">Bekor qilindi (Cancelled)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-muted">
                          Mos keluvchi buyurtmalar topilmadi
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingProduct ? 'Tovarni Tahrirlash' : 'Yangi Tovar Qo\'shish'}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-form">
              <div className="form-group">
                <label>Tovar Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Studio Wireless Pro Headphones"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Narxi ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="299.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Zaxiradagi Soni *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Kategoriya *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brend *</label>
                  <select
                    required
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  >
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="form-group">
                <label>Mahsulot Rasmi</label>
                <div className="image-upload-dropzone">
                  {formData.imageUrl ? (
                    <div className="uploaded-image-preview">
                      <img src={formData.imageUrl} alt="Preview" />
                      <button
                        type="button"
                        className="remove-img-btn"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      >
                        <X size={14} /> O'chirish
                      </button>
                    </div>
                  ) : (
                    <label className="upload-file-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        disabled={isUploadingImage}
                        style={{ display: 'none' }}
                      />
                      <UploadCloud size={32} className="upload-icon" />
                      <span>
                        {isUploadingImage
                          ? 'Rasm yuklanmoqda...'
                          : 'Kompyuterdan rasm tanlang yoki shu yerga tashlang'}
                      </span>
                      <small>PNG, JPG, WEBP formatlari (maks. 5MB)</small>
                    </label>
                  )}
                </div>

                {/* Or enter manual URL */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Yoki rasm URL manzilini kiriting..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Bekor qilish
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmId(null)}>
          <div className="admin-modal admin-confirm-modal card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-box">
              <Trash2 size={28} />
            </div>
            <h3>Mahsulotni o'chirmoqchimisiz?</h3>
            <p>Bu amalni ortga qaytarib bo'lmaydi. Tovar do'kon katalogidan olib tashlanadi.</p>
            <div className="admin-modal-footer mt-4">
              <button
                className="admin-btn admin-btn-outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Bekor qilish
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
              >
                Ha, O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Clock,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import StatCard from '../../../components/Admin/StatCard';
import StatusBadge from '../../../components/Admin/StatusBadge';
import { CardSkeleton, ChartSkeleton } from '../../../components/Admin/Skeleton';
import Toast from '../../../components/Admin/Toast';
import './Dashboard.css';

const STATUS_COLORS = {
  pending: '#ff9500',
  paid: '#34c759',
  shipped: '#0071e3',
  delivered: '#5856d6',
  cancelled: '#ff3b30'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [salesRange, setSalesRange] = useState('7'); // '7' | '30'
  const [toast, setToast] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.innerData);
      }
    } catch (err) {
      console.error('[Admin Stats Fetch Error]:', err);
      setToast({ msg: 'Statistikalarni yuklashda xatolik yuz berdi', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);
  };

  const chartData = stats?.dailySales?.[salesRange === '7' ? 'last7Days' : 'last30Days'] || [];

  const pieData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count]) => ({
        name: status,
        value: count
      }))
    : [];

  return (
    <div className="admin-dashboard-page">
      {/* Top action header */}
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">Umumiy ko'rsatkichlar</h2>
          <p className="admin-hero-subtitle">
            Do'kon faoliyati, daromadlar va so'nggi buyurtmalar dinamikasi
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary refresh-btn"
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>Yangilash</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={DollarSign}
              title="Jami Sof Daromad"
              value={formatCurrency(stats?.summary?.totalRevenue)}
              subtitle="To'langan buyurtmalar asosida"
              color="blue"
            />
            <StatCard
              icon={ShoppingBag}
              title="Jami Buyurtmalar"
              value={stats?.summary?.totalOrders || 0}
              subtitle="Platformadagi barcha xaridlar"
              color="green"
              onClick={() => navigate('/admin/orders')}
            />
            <StatCard
              icon={Users}
              title="Foydalanuvchilar"
              value={stats?.summary?.totalUsers || 0}
              subtitle="Ro'yxatdan o'tgan mijozlar"
              color="purple"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              icon={Package}
              title="Mahsulotlar Soni"
              value={stats?.summary?.totalProducts || 0}
              subtitle={
                stats?.summary?.lowStockCount > 0
                  ? `⚠️ ${stats?.summary?.lowStockCount} ta tovar zaxirasi kam`
                  : 'Barcha tovarlar yetarli'
              }
              color={stats?.summary?.lowStockCount > 0 ? 'red' : 'orange'}
              onClick={() => navigate('/admin/products')}
            />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="admin-charts-grid">
        {/* Sales Dynamic Area Chart */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Sotuvlar dinamikasi</h3>
              <p className="chart-card-sub">Kunlik tushum va buyurtmalar grafigi</p>
            </div>
            <div className="chart-range-selector">
              <button
                type="button"
                className={`range-btn ${salesRange === '7' ? 'active' : ''}`}
                onClick={() => setSalesRange('7')}
              >
                Oxirgi 7 kun
              </button>
              <button
                type="button"
                className={`range-btn ${salesRange === '30' ? 'active' : ''}`}
                onClick={() => setSalesRange('30')}
              >
                30 kun
              </button>
            </div>
          </div>

          <div className="chart-body" style={{ height: 300 }}>
            {loading ? (
              <ChartSkeleton height="300px" />
            ) : chartData.length === 0 ? (
              <div className="empty-chart">Ma'lumotlar mavjud emas</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0071e3" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }}
                    tickFormatter={(str) => str.slice(5)}
                    stroke="var(--border-subtle)"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--ink-tertiary)' }}
                    stroke="var(--border-subtle)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-card)',
                      fontSize: '13px',
                      color: 'var(--ink-primary)'
                    }}
                    formatter={(value) => [formatCurrency(value), 'Daromad']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0071e3"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Orders by Status Donut Chart */}
        <div className="admin-chart-card">
          <div className="chart-card-header">
            <div>
              <h3 className="chart-card-title">Buyurtmalar holati</h3>
              <p className="chart-card-sub">Holatlar bo'yicha taqsimot</p>
            </div>
          </div>

          <div className="chart-body donut-wrapper" style={{ height: 300 }}>
            {loading ? (
              <ChartSkeleton height="300px" />
            ) : pieData.length === 0 ? (
              <div className="empty-chart">Buyurtmalar yo'q</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="donut-legend-grid">
                  {pieData.map((item) => (
                    <div key={item.name} className="donut-legend-item">
                      <span
                        className="legend-dot"
                        style={{ background: STATUS_COLORS[item.name] || '#999' }}
                      />
                      <span className="legend-name">{item.name}:</span>
                      <span className="legend-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Two columns: Top Selling & Low Stock warning */}
      <div className="admin-tables-split-grid">
        {/* Top 5 Products */}
        <div className="admin-section-box">
          <div className="section-box-header">
            <div>
              <h3 className="section-box-title">Eng ko'p sotilgan tovarlar</h3>
              <p className="section-box-sub">Yetakchi 5 ta flagman mahsulot</p>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => navigate('/admin/products')}
            >
              <span>Katalog</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-mini-list">
            {stats?.topSellingProducts?.length > 0 ? (
              stats.topSellingProducts.map((p, idx) => (
                <div key={p._id || idx} className="product-mini-item">
                  <div className="product-mini-rank">{idx + 1}</div>
                  <img
                    src={p.images?.[0] || '/images/product_placeholder.png'}
                    alt={p.name}
                    className="product-mini-img"
                    onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
                  />
                  <div className="product-mini-info">
                    <span className="product-mini-name">{p.name}</span>
                    <span className="product-mini-meta">
                      Narxi: ${p.price} • Zaxira: {p.stock} ta
                    </span>
                  </div>
                  <div className="product-mini-stat">
                    <span className="stat-qty">{p.soldCount} ta</span>
                    <span className="stat-money">{formatCurrency(p.totalSales)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-mini-box">Hali savdo yozuvlari mavjud emas</div>
            )}
          </div>
        </div>

        {/* Low Stock Alert Box */}
        <div className="admin-section-box">
          <div className="section-box-header">
            <div className="header-with-alert">
              <div className="alert-badge-icon">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h3 className="section-box-title">Zaxirasi kam tovarlar (&lt; 5)</h3>
                <p className="section-box-sub">Zudlik bilan to'ldirish tavsiya etiladi</p>
              </div>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => navigate('/admin/products')}
            >
              <span>Barchasi</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-mini-list">
            {stats?.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.map((p) => (
                <div key={p._id} className="product-mini-item low-stock-item">
                  <img
                    src={p.images?.[0] || '/images/product_placeholder.png'}
                    alt={p.name}
                    className="product-mini-img"
                    onError={(e) => { e.target.src = '/images/product_placeholder.png'; }}
                  />
                  <div className="product-mini-info">
                    <span className="product-mini-name">{p.name}</span>
                    <span className="product-mini-meta">
                      {p.category_id?.name || 'Kategoriya'} • {p.brand_id?.name || 'Brend'}
                    </span>
                  </div>
                  <div className="stock-critical-pill">
                    {p.stock === 0 ? 'Tugagan (0)' : `Qoldi: ${p.stock}`}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-mini-box all-in-stock">
                Barcha tovarlar omborda yetarli miqdorda mavjud!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Box */}
      <div className="admin-section-box recent-orders-box">
        <div className="section-box-header">
          <div>
            <h3 className="section-box-title">Oxirgi qabul qilingan buyurtmalar</h3>
            <p className="section-box-sub">Eng so'nggi 5 ta xarid operatsiyalari</p>
          </div>
          <button
            type="button"
            className="section-link-btn"
            onClick={() => navigate('/admin/orders')}
          >
            <span>Barcha buyurtmalar</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-orders-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mijoz</th>
                <th>Sana</th>
                <th>Summa</th>
                <th>Holat</th>
                <th style={{ textAlign: 'right' }}>Amal</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((o) => (
                  <tr key={o._id} className="admin-table-row">
                    <td>
                      <span className="order-id-badge">#{o._id.slice(-6)}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{o.user_id?.name || 'Mehmon'}</span>
                        <span className="customer-email">{o.user_id?.email || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">
                        {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </td>
                    <td>
                      <strong className="order-price">${o.total}</strong>
                    </td>
                    <td>
                      <StatusBadge status={o.status} type="order" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="quick-view-btn"
                        onClick={() => navigate('/admin/orders')}
                        title="Batafsil"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                    Hali buyurtmalar mavjud emas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast container */}
      {toast && (
        <div className="admin-toast-container">
          <Toast notification={toast} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;

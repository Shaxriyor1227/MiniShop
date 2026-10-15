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
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../../api/axiosInstance';
import StatCard from '../../../components/Admin/StatCard';
import StatusBadge from '../../../components/Admin/StatusBadge';
import { CardSkeleton, ChartSkeleton } from '../../../components/Admin/Skeleton';
import Toast from '../../../components/Admin/Toast';
import { useFormatters } from '../../../utils/formatters';
import { getApiErrorMessage } from '../../../utils/apiError';
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
  const { t } = useTranslation();
  const { formatPrice, formatDate } = useFormatters();

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
      setToast({ msg: getApiErrorMessage(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = stats?.dailySales?.[salesRange === '7' ? 'last7Days' : 'last30Days'] || [];

  const pieData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([status, count]) => ({
        name: status,
        displayName: t(`admin.status.${status}`, status),
        value: count
      }))
    : [];

  return (
    <div className="admin-dashboard-page">
      {/* Top action header */}
      <div className="admin-page-hero">
        <div>
          <h2 className="admin-hero-title">{t('admin.dashboard.title')}</h2>
          <p className="admin-hero-subtitle">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-secondary refresh-btn"
          onClick={fetchStats}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'spinning' : ''} />
          <span>{t('admin.common.refresh')}</span>
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
              title={t('admin.dashboard.total_revenue')}
              value={formatPrice(stats?.summary?.totalRevenue || 0)}
              subtitle={t('admin.status.paid')}
              color="blue"
            />
            <StatCard
              icon={ShoppingBag}
              title={t('admin.dashboard.total_orders')}
              value={stats?.summary?.totalOrders || 0}
              subtitle={t('admin.dashboard.orders')}
              color="green"
              onClick={() => navigate('/admin/orders')}
            />
            <StatCard
              icon={Users}
              title={t('admin.dashboard.total_users')}
              value={stats?.summary?.totalUsers || 0}
              subtitle={t('admin.dashboard.customer')}
              color="purple"
              onClick={() => navigate('/admin/users')}
            />
            <StatCard
              icon={Package}
              title={t('admin.dashboard.total_products')}
              value={stats?.summary?.totalProducts || 0}
              subtitle={
                stats?.summary?.lowStockCount > 0
                  ? `⚠️ ${stats?.summary?.lowStockCount} ${t('admin.dashboard.units_left')}`
                  : t('admin.common.all')
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
              <h3 className="chart-card-title">{t('admin.dashboard.sales_trend')}</h3>
              <p className="chart-card-sub">{t('admin.dashboard.subtitle')}</p>
            </div>
            <div className="chart-range-selector">
              <button
                type="button"
                className={`range-btn ${salesRange === '7' ? 'active' : ''}`}
                onClick={() => setSalesRange('7')}
              >
                {t('admin.dashboard.days_7')}
              </button>
              <button
                type="button"
                className={`range-btn ${salesRange === '30' ? 'active' : ''}`}
                onClick={() => setSalesRange('30')}
              >
                {t('admin.dashboard.days_30')}
              </button>
            </div>
          </div>

          <div className="chart-body" style={{ height: 300 }}>
            {loading ? (
              <ChartSkeleton height="300px" />
            ) : chartData.length === 0 ? (
              <div className="empty-chart">{t('admin.dashboard.no_data')}</div>
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
                    formatter={(value) => [formatPrice(value), t('admin.dashboard.revenue')]}
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
              <h3 className="chart-card-title">{t('admin.dashboard.status_distribution')}</h3>
              <p className="chart-card-sub">{t('admin.dashboard.orders')}</p>
            </div>
          </div>

          <div className="chart-body donut-wrapper" style={{ height: 300 }}>
            {loading ? (
              <ChartSkeleton height="300px" />
            ) : pieData.length === 0 ? (
              <div className="empty-chart">{t('admin.dashboard.no_data')}</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="displayName"
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
                      <span className="legend-name">{item.displayName}:</span>
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
              <h3 className="section-box-title">{t('admin.dashboard.top_products')}</h3>
              <p className="section-box-sub">{t('admin.dashboard.sales_trend')}</p>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => navigate('/admin/products')}
            >
              <span>{t('admin.nav.products')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-mini-list">
            {stats?.topSellingProducts?.length > 0 ? (
              stats.topSellingProducts.map((p, idx) => (
                <div key={p._id || idx} className="product-mini-item">
                  <div className="product-mini-rank">{idx + 1}</div>
                  <img
                    src={(p.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp')}
                    alt={p.name}
                    className="product-mini-img"
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.target.src = '/images/product_placeholder.webp'; }}
                  />
                  <div className="product-mini-info">
                    <span className="product-mini-name">{p.name}</span>
                    <span className="product-mini-meta">
                      {formatPrice(p.price)} • {p.stock} {t('admin.dashboard.units_left')}
                    </span>
                  </div>
                  <div className="product-mini-stat">
                    <span className="stat-qty">{p.soldCount} {t('admin.dashboard.sold')}</span>
                    <span className="stat-money">{formatPrice(p.totalSales)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-mini-box">{t('admin.dashboard.no_data')}</div>
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
                <h3 className="section-box-title">{t('admin.dashboard.low_stock')} (&lt; 5)</h3>
                <p className="section-box-sub">{t('admin.dashboard.units_left')}</p>
              </div>
            </div>
            <button
              type="button"
              className="section-link-btn"
              onClick={() => navigate('/admin/products')}
            >
              <span>{t('admin.common.all')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-mini-list">
            {stats?.lowStockProducts?.length > 0 ? (
              stats.lowStockProducts.map((p) => (
                <div key={p._id} className="product-mini-item low-stock-item">
                  <img
                    src={(p.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp')}
                    alt={p.name}
                    className="product-mini-img"
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.target.src = '/images/product_placeholder.webp'; }}
                  />
                  <div className="product-mini-info">
                    <span className="product-mini-name">{p.name}</span>
                    <span className="product-mini-meta">
                      {p.category_id?.name || ''} • {p.brand_id?.name || ''}
                    </span>
                  </div>
                  <div className="stock-critical-pill">
                    {p.stock === 0 ? `0 ${t('admin.dashboard.units_left')}` : `${p.stock} ${t('admin.dashboard.units_left')}`}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-mini-box all-in-stock">
                {t('admin.common.all')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Box */}
      <div className="admin-section-box recent-orders-box">
        <div className="section-box-header">
          <div>
            <h3 className="section-box-title">{t('admin.dashboard.recent_orders')}</h3>
            <p className="section-box-sub">{t('admin.dashboard.orders')}</p>
          </div>
          <button
            type="button"
            className="section-link-btn"
            onClick={() => navigate('/admin/orders')}
          >
            <span>{t('admin.common.all')}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="recent-orders-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('admin.dashboard.customer')}</th>
                <th>{t('admin.common.date')}</th>
                <th>{t('admin.dashboard.amount')}</th>
                <th>{t('admin.common.status')}</th>
                <th style={{ textAlign: 'right' }}>{t('admin.common.actions')}</th>
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
                        <span className="customer-name">{o.user_id?.name || 'Customer'}</span>
                        <span className="customer-email">{o.user_id?.email || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">
                        {formatDate(o.createdAt)}
                      </span>
                    </td>
                    <td>
                      <strong className="order-price">{formatPrice(o.total)}</strong>
                    </td>
                    <td>
                      <StatusBadge status={o.status} type="order" />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="quick-view-btn"
                        onClick={() => navigate('/admin/orders')}
                        title={t('admin.common.details')}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px' }}>
                    {t('admin.dashboard.no_data')}
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

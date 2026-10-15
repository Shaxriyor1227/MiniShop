import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  CreditCard,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Boshqaruv paneli', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Mahsulotlar', icon: Package },
  { to: '/admin/categories', label: 'Kategoriyalar', icon: Layers },
  { to: '/admin/brands', label: 'Brendlar', icon: Award },
  { to: '/admin/orders', label: 'Buyurtmalar', icon: ShoppingBag },
  { to: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
  { to: '/admin/coupons', label: 'Kuponlar', icon: Tag },
  { to: '/admin/reviews', label: 'Sharhlar', icon: MessageSquare },
  { to: '/admin/payments', label: 'To\'lovlar', icon: CreditCard },
  { to: '/admin/notifications', label: 'Bildirishnomalar', icon: Bell }
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTitle = navItems.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  )?.label || 'Admin Panel';

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-root-layout">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-block">
            <div className="admin-logo-badge">
              <ShieldCheck size={20} />
            </div>
            <div className="admin-logo-text">
              <span className="logo-brand">MiniShop</span>
              <span className="logo-sub">Pro Admin</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Yopish"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="nav-group-label">Asosiy Menyular</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={18} className="nav-icon" />
                <span className="nav-text">{item.label}</span>
                <ChevronRight size={14} className="nav-arrow" />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-store-link">
            <ExternalLink size={16} />
            <span>Do'konga qaytish</span>
          </NavLink>

          <div className="admin-user-profile-widget">
            <div className="user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || 'Administrator'}</div>
              <div className="user-role-badge">Super Admin</div>
            </div>
            <button
              type="button"
              className="user-logout-btn"
              onClick={handleLogout}
              title="Chiqish"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-top-header">
          <div className="header-left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menyu"
            >
              <Menu size={20} />
            </button>
            <div className="admin-page-breadcrumbs">
              <span className="crumb-root">Admin</span>
              <span className="crumb-separator">/</span>
              <h1 className="crumb-current">{currentTitle}</h1>
            </div>
          </div>

          <div className="header-right">
            {/* Language Switcher */}
            <div className="admin-lang-capsule">
              {['uz', 'ru', 'en'].map((lng) => (
                <button
                  key={lng}
                  type="button"
                  className={`lang-btn ${i18n.language === lng ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lng)}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              className="admin-theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Yorug\' rejim' : 'Qorong\'i rejim'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Quick user avatar */}
            <div className="admin-header-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="admin-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

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
  { to: '/admin', labelKey: 'admin.nav.dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', labelKey: 'admin.nav.products', icon: Package },
  { to: '/admin/categories', labelKey: 'admin.nav.categories', icon: Layers },
  { to: '/admin/brands', labelKey: 'admin.nav.brands', icon: Award },
  { to: '/admin/orders', labelKey: 'admin.nav.orders', icon: ShoppingBag },
  { to: '/admin/users', labelKey: 'admin.nav.users', icon: Users },
  { to: '/admin/coupons', labelKey: 'admin.nav.coupons', icon: Tag },
  { to: '/admin/reviews', labelKey: 'admin.nav.reviews', icon: MessageSquare },
  { to: '/admin/payments', labelKey: 'admin.nav.payments', icon: CreditCard },
  { to: '/admin/notifications', labelKey: 'admin.nav.notifications', icon: Bell }
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const matchedItem = navItems.find((item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)
  );
  const currentTitle = matchedItem ? t(matchedItem.labelKey) : t('admin.nav.admin');

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
              <span className="logo-sub">{t('admin.nav.super_admin')}</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-sidebar-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label={t('admin.common.close')}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          <div className="nav-group-label">{t('admin.nav.main_menu')}</div>
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
                <span className="nav-text">{t(item.labelKey)}</span>
                <ChevronRight size={14} className="nav-arrow" />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-store-link">
            <ExternalLink size={16} />
            <span>{t('admin.nav.back_to_store')}</span>
          </NavLink>

          <div className="admin-user-profile-widget">
            <div className="user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || t('admin.nav.admin')}</div>
              <div className="user-role-badge">{t('admin.nav.super_admin')}</div>
            </div>
            <button
              type="button"
              className="user-logout-btn"
              onClick={handleLogout}
              title={t('admin.nav.logout')}
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
              aria-label={t('nav.menu')}
            >
              <Menu size={20} />
            </button>
            <div className="admin-page-breadcrumbs">
              <span className="crumb-root">{t('admin.nav.admin')}</span>
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
              title={theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
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

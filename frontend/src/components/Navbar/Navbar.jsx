import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Bell,
  LogOut,
  Package,
  Headphones,
  Watch,
  Laptop,
  Tag,
  ChevronDown,
  Home as HomeIcon,
  Grid,
  Sun,
  Moon,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import NotificationModal from '../NotificationModal/NotificationModal';
import SpotlightSearch from '../SpotlightSearch/SpotlightSearch';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection for compact blur header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setMobileDrawerOpen(false);
    setUserDropdown(false);
  }, [location.pathname, location.search]);

  return (
    <>
      <header className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-wrapper">
          {/* 1. Brand Logo */}
          <Link to="/" className="brand-link" title="MiniShop Home">
            <div className="brand-logo-badge">
              <ShoppingBag size={18} strokeWidth={2.4} className="brand-svg-icon" />
            </div>
            <span className="brand-title">
              Mini<span className="brand-blue-part">Shop</span>
            </span>
          </Link>

          {/* 2. Main Desktop Navigation */}
          <nav className="desktop-main-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link-item ${isActive && !location.search ? 'active' : ''}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `nav-link-item ${isActive && !location.search ? 'active' : ''}`
              }
            >
              Catalog
            </NavLink>

            <NavLink
              to="/catalog?category=Audio"
              className={() =>
                `nav-link-item ${location.pathname === '/catalog' && location.search.includes('Audio') ? 'active' : ''}`
              }
            >
              Audio
            </NavLink>

            <NavLink
              to="/catalog?category=Wearables"
              className={() =>
                `nav-link-item ${location.pathname === '/catalog' && location.search.includes('Wearables') ? 'active' : ''}`
              }
            >
              Wearables
            </NavLink>

            <NavLink
              to="/catalog?category=Workspace"
              className={() =>
                `nav-link-item ${location.pathname === '/catalog' && location.search.includes('Workspace') ? 'active' : ''}`
              }
            >
              Workspace
            </NavLink>

            <NavLink
              to="/catalog?category=Accessories"
              className={() =>
                `nav-link-item promo-link ${location.pathname === '/catalog' && location.search.includes('Accessories') ? 'active' : ''}`
              }
            >
              <span>Deals</span>
              <span className="promo-badge">HOT</span>
            </NavLink>

            {/* Admin link for Admin users */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `nav-link-item admin-nav-pill ${isActive ? 'active' : ''}`
                }
              >
                <Shield size={14} />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* 3. Action Group & User Profile */}
          <div className="nav-actions-group">
            {/* Quick Spotlight Search Pill */}
            <button
              className="spotlight-search-trigger"
              onClick={() => setShowSpotlight(true)}
              title="Search (Ctrl+K)"
            >
              <Search size={15} className="trigger-search-icon" />
              <span className="trigger-text">Search</span>
              <span className="trigger-shortcut">⌘K</span>
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              className="nav-action-icon theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? "Yorug' rejim (Light)" : "Qorong'i rejim (Dark)"}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-action-icon" title="Wishlist">
              <Heart size={18} strokeWidth={2} />
              {wishlistCount > 0 && <span className="nav-count-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-action-icon cart-action-icon" title="Shopping Cart">
              <ShoppingBag size={18} strokeWidth={2} />
              {itemCount > 0 && <span className="nav-count-badge cart-count-badge">{itemCount}</span>}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <button
                className="nav-action-icon"
                onClick={() => setShowNotifications(true)}
                title="Notifications"
              >
                <Bell size={18} strokeWidth={2} />
              </button>
            )}

            {/* User Profile / Auth CTA */}
            {isAuthenticated ? (
              <div className="nav-user-dropdown-wrapper">
                <button
                  className="nav-profile-capsule"
                  onClick={() => setUserDropdown(!userDropdown)}
                >
                  <div className="profile-capsule-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-capsule-name">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={13} className="profile-chevron" />
                </button>

                {userDropdown && (
                  <div
                    className="nav-dropdown-flyout card"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="flyout-user-meta">
                      <p className="flyout-user-name">{user?.name}</p>
                      <p className="flyout-user-email">{user?.email}</p>
                    </div>
                    <div className="flyout-divider"></div>

                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          className="flyout-item admin-flyout-item"
                          onClick={() => setUserDropdown(false)}
                        >
                          <Shield size={15} /> Admin Paneli
                        </Link>
                        <div className="flyout-divider"></div>
                      </>
                    )}

                    <Link
                      to="/profile"
                      className="flyout-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <User size={15} /> Profile & Settings
                    </Link>
                    <Link
                      to="/orders"
                      className="flyout-item"
                      onClick={() => setUserDropdown(false)}
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <div className="flyout-divider"></div>
                    <button
                      className="flyout-item logout-flyout-item"
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                        navigate('/');
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-cta-group">
                <Link to="/login" className="nav-login-link">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary nav-register-btn">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              className="mobile-drawer-toggle-btn"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              aria-label="Menu"
            >
              {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 4. Dedicated Mobile Off-Canvas Slide Drawer */}
      {mobileDrawerOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileDrawerOpen(false)}>
          <aside className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <div className="brand-link">
                <div className="brand-logo-badge">
                  <ShoppingBag size={16} strokeWidth={2.4} />
                </div>
                <span className="brand-title">
                  Mini<span className="brand-blue-part">Shop</span>
                </span>
              </div>
              <button className="drawer-close-btn" onClick={() => setMobileDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="mobile-drawer-search">
              <button
                className="mobile-search-bar"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowSpotlight(true);
                }}
              >
                <Search size={16} />
                <span>Search products...</span>
                <kbd>⌘K</kbd>
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="mobile-drawer-content">
              <div className="drawer-section-title">Navigation & Catalog</div>
              <div className="mobile-nav-categories">
                <Link to="/" className="mobile-category-row" onClick={() => setMobileDrawerOpen(false)}>
                  <div className="cat-icon-frame">
                    <HomeIcon size={16} />
                  </div>
                  <span>Home Landing</span>
                </Link>
                <Link to="/catalog" className="mobile-category-row" onClick={() => setMobileDrawerOpen(false)}>
                  <div className="cat-icon-frame">
                    <Grid size={16} />
                  </div>
                  <span>Full Catalog</span>
                </Link>
                <Link
                  to="/catalog?category=Audio"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame">
                    <Headphones size={16} />
                  </div>
                  <span>Audio & Headphones</span>
                </Link>
                <Link
                  to="/catalog?category=Wearables"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame">
                    <Watch size={16} />
                  </div>
                  <span>Smart Watches</span>
                </Link>
                <Link
                  to="/catalog?category=Workspace"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame">
                    <Laptop size={16} />
                  </div>
                  <span>Workspace & Keyboards</span>
                </Link>
                <Link
                  to="/catalog?category=Accessories"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame promo-icon-frame">
                    <Tag size={16} />
                  </div>
                  <span>Accessories & Deals</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="mobile-category-row mobile-admin-link"
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    <div className="cat-icon-frame admin-icon-frame">
                      <Shield size={16} />
                    </div>
                    <span>Admin Paneli</span>
                  </Link>
                )}
              </div>

              <div className="drawer-divider"></div>

              <div className="drawer-section-title">Account & Settings</div>
              <div className="mobile-nav-categories">
                <div
                  className="mobile-category-row"
                  onClick={toggleTheme}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cat-icon-frame">
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </div>
                  <span>Rejim: {isDark ? "Qorong'i (Dark)" : "Yorug' (Light)"}</span>
                </div>

                <Link
                  to="/wishlist"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame">
                    <Heart size={16} />
                  </div>
                  <span>Wishlist</span>
                  {wishlistCount > 0 && <span className="mobile-counter">{wishlistCount}</span>}
                </Link>
                <Link
                  to="/cart"
                  className="mobile-category-row"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  <div className="cat-icon-frame">
                    <ShoppingBag size={16} />
                  </div>
                  <span>Cart</span>
                  {itemCount > 0 && <span className="mobile-counter">{itemCount}</span>}
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/orders"
                      className="mobile-category-row"
                      onClick={() => setMobileDrawerOpen(false)}
                    >
                      <div className="cat-icon-frame">
                        <Package size={16} />
                      </div>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/profile"
                      className="mobile-category-row"
                      onClick={() => setMobileDrawerOpen(false)}
                    >
                      <div className="cat-icon-frame">
                        <User size={16} />
                      </div>
                      <span>Profile & Settings</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <div className="mobile-user-footer-box">
                  <div className="mobile-user-profile-row">
                    <div className="profile-capsule-avatar">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="mobile-user-texts">
                      <p className="m-username">{user?.name}</p>
                      <p className="m-useremail">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    className="mobile-logout-action-btn"
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="mobile-guest-buttons-grid">
                  <Link
                    to="/login"
                    className="btn-secondary mobile-auth-btn"
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary mobile-auth-btn"
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* 5. Spotlight Search Modal */}
      <SpotlightSearch isOpen={showSpotlight} onClose={() => setShowSpotlight(false)} />

      {/* 6. Notifications Modal */}
      {showNotifications && (
        <NotificationModal onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default Navbar;

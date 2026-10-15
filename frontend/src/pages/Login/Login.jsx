import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Shield
} from 'lucide-react';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const errors = {};

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email manzilini kiriting';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Yaroqli email manzilini kiriting';
    }

    if (!password) {
      errors.password = 'Parolni kiriting';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const res = await login(trimmedEmail, password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.message || 'Email yoki parol noto\'g\'ri kiritildi');
      setFieldErrors({
        password: res.message || 'Email yoki parol noto\'g\'ri'
      });
    }
    setLoading(false);
  };

  // Demo user helper
  const handleQuickLogin = (demoEmail, demoPwd, type) => {
    setEmail(demoEmail);
    setPassword(demoPwd);
    setSelectedDemo(type);
    setErrorMsg('');
    setFieldErrors({});
  };

  return (
    <div className="auth-page-luxury page-enter">
      {/* Ambient background glow orbs */}
      <div className="ambient-glow glow-blue" />
      <div className="ambient-glow glow-purple" />

      <div className="auth-container-luxury">
        <div className="auth-card-luxury">
          {/* Brand Header */}
          <div className="auth-header-luxury">
            <Link to="/" className="auth-logo-capsule">
              <div className="auth-logo-badge">
                <ShoppingBag size={20} strokeWidth={2.5} />
              </div>
              <span className="auth-brand-name">
                Mini<span className="brand-accent">Shop</span>
              </span>
            </Link>

            <h2 className="auth-headline">{t('auth.login_title') || 'Welcome Back'}</h2>
            <p className="auth-tagline">
              {t('auth.login_subtitle') || 'Sign in to access your MiniShop account'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="auth-error-pill">
              <AlertCircle size={16} className="error-icon" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-luxury">
            {/* Email Field */}
            <div className="luxury-field-group">
              <label className="luxury-label">{t('auth.email_label') || 'Email Address'}</label>
              <div className="luxury-input-wrapper">
                <Mail size={18} className="input-affix-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`luxury-input ${fieldErrors.email ? 'error' : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    setSelectedDemo(null);
                  }}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <div className="input-error-msg">
                  <AlertCircle size={13} />
                  <span>{fieldErrors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="luxury-field-group">
              <div className="luxury-label-row">
                <label className="luxury-label">{t('auth.password_label') || 'Password'}</label>
                <span className="secure-badge">
                  <ShieldCheck size={13} /> 256-bit SSL
                </span>
              </div>
              <div className="luxury-input-wrapper">
                <Lock size={18} className="input-affix-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`luxury-input with-toggle ${fieldErrors.password ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                    setSelectedDemo(null);
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="input-error-msg">
                  <AlertCircle size={13} />
                  <span>{fieldErrors.password}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="luxury-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-content">
                  <span className="loading-spinner" />
                  Kirilmoqda...
                </span>
              ) : (
                <span className="btn-content">
                  <span>{t('auth.login_btn') || 'Sign In'}</span>
                  <ArrowRight size={17} className="btn-arrow-icon" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Capsule - Strictly visible in DEV mode only */}
          {import.meta.env.DEV && (
            <div className="demo-capsule-box">
              <div className="demo-header-row">
                <Sparkles size={14} className="sparkle-icon" />
                <span>{t('auth.quick_demo') || 'Tezkor demo hisoblar (Faqat DEV):'}</span>
              </div>

              <div className="demo-cards-row">
                <button
                  type="button"
                  className={`demo-card-btn ${selectedDemo === 'customer' ? 'selected' : ''}`}
                  onClick={() => handleQuickLogin('customer@minishop.com', 'customer123', 'customer')}
                >
                  <div className="demo-avatar-icon user-icon">
                    <User size={15} />
                  </div>
                  <div className="demo-card-texts">
                    <span className="demo-role-name">Customer</span>
                    <span className="demo-email-hint">customer@minishop.com</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`demo-card-btn ${selectedDemo === 'admin' ? 'selected' : ''}`}
                  onClick={() => handleQuickLogin('admin@minishop.com', 'admin123', 'admin')}
                >
                  <div className="demo-avatar-icon admin-icon">
                    <Shield size={15} />
                  </div>
                  <div className="demo-card-texts">
                    <div className="demo-admin-badge-row">
                      <span className="demo-role-name">Super Admin</span>
                      <span className="admin-chip">PRO</span>
                    </div>
                    <span className="demo-email-hint">admin@minishop.com</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Footer Link */}
          <div className="auth-footer-luxury">
            <span>{t('auth.no_account') || "Hisobingiz yo'qmi?"}</span>{' '}
            <Link to="/register" className="register-link">
              {t('auth.register_btn') || "Ro'yxatdan o'tish"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

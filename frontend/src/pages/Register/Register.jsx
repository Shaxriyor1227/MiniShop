import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  ArrowRight,
  ShoppingBag,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import './Register.css';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const errors = {};

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName) {
      errors.name = "Ismingizni to'liq kiriting";
    }

    if (!trimmedEmail) {
      errors.email = 'Email manzilini kiriting';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Yaroqli email manzilini kiriting';
    }

    if (!password) {
      errors.password = 'Parolni kiriting';
    } else if (password.length < 6) {
      errors.password = "Parol kamida 6 ta belgidan iborat bo'lishi shart";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const res = await register({
      name: trimmedName,
      email: trimmedEmail,
      password,
      phone_number: trimmedPhone
    });

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
      if (res.message?.toLowerCase().includes('email')) {
        setFieldErrors({ email: res.message });
      }
    }
    setLoading(false);
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

            <h2 className="auth-headline">{t('auth.register_title') || 'Create Account'}</h2>
            <p className="auth-tagline">
              {t('auth.register_subtitle') || 'Join MiniShop for an exclusive shopping experience'}
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
            {/* Full Name */}
            <div className="luxury-field-group">
              <label className="luxury-label">{t('auth.name_label') || 'Full Name'}</label>
              <div className="luxury-input-wrapper">
                <User size={18} className="input-affix-icon" />
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  className={`luxury-input ${fieldErrors.name ? 'error' : ''}`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  autoComplete="name"
                />
              </div>
              {fieldErrors.name && (
                <div className="input-error-msg">
                  <AlertCircle size={13} />
                  <span>{fieldErrors.name}</span>
                </div>
              )}
            </div>

            {/* Email */}
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

            {/* Phone Number */}
            <div className="luxury-field-group">
              <label className="luxury-label">Telefon raqam (ixtiyoriy)</label>
              <div className="luxury-input-wrapper">
                <Phone size={18} className="input-affix-icon" />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  className="luxury-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="luxury-field-group">
              <div className="luxury-label-row">
                <label className="luxury-label">{t('auth.password_label') || 'Password'}</label>
                <span className="secure-badge">
                  <ShieldCheck size={13} /> Kamida 6 belgi
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
                  }}
                  autoComplete="new-password"
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

            {/* Submit */}
            <button
              type="submit"
              className="luxury-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-content">
                  <span className="loading-spinner" />
                  Ro'yxatdan o'tilmoqda...
                </span>
              ) : (
                <span className="btn-content">
                  <span>{t('auth.register_btn') || 'Create Account'}</span>
                  <ArrowRight size={17} className="btn-arrow-icon" />
                </span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer-luxury">
            <span>{t('auth.have_account') || 'Allaqachon hisobingiz bormi?'}</span>{' '}
            <Link to="/login" className="register-link">
              {t('auth.login_btn') || 'Kirish'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

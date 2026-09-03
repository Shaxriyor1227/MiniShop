import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LogIn, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(email.trim(), password);
    if (res.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMsg(res.message || 'Invalid credentials or sign in failed');
    }
    setLoading(false);
  };

  // Demo user helper
  const handleQuickLogin = (demoEmail, demoPwd) => {
    setEmail(demoEmail);
    setPassword(demoPwd);
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <div className="brand-logo-badge" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                <ShoppingBag size={18} strokeWidth={2.4} />
              </div>
              <span className="brand-title">Mini<span style={{ color: 'var(--accent-blue)' }}>Shop</span></span>
            </Link>
            <h2>{t('auth.login_title')}</h2>
            <p>{t('auth.login_subtitle')}</p>
          </div>

          {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t('auth.email_label')}</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="pwd-label-row">
                <label>{t('auth.password_label')}</label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
              {loading ? '...' : t('auth.login_btn')}
            </button>
          </form>

          {/* Quick Demo Logins for Pair Programming review */}
          <div className="demo-accounts-box">
            <div className="demo-title">
              <Sparkles size={14} /> {t('auth.quick_demo')}
            </div>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleQuickLogin('customer@minishop.com', 'customer123')}
              >
                {t('auth.demo_customer')}
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleQuickLogin('admin@minishop.com', 'admin123')}
              >
                {t('auth.demo_admin')}
              </button>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              {t('auth.no_account')} <Link to="/register">{t('auth.register_btn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, ArrowRight, ShoppingBag } from 'lucide-react';
import './Register.css';

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone_number: phoneNumber.trim()
    });

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
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
            <h2>{t('auth.register_title')}</h2>
            <p>{t('auth.register_subtitle')}</p>
          </div>

          {errorMsg && <div className="auth-error-alert">{errorMsg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>{t('auth.name_label')}</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <label>{t('profile.phone')}</label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                className="input-field"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{t('auth.password_label')}</label>
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
              {loading ? '...' : t('auth.register_btn')}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              {t('auth.have_account')} <Link to="/login">{t('auth.login_btn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

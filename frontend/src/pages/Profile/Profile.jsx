import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getUserRole } from '../../utils/i18nHelpers';
import axiosInstance from '../../api/axiosInstance';
import {
  User,
  MapPin,
  KeyRound,
  CreditCard,
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Laptop,
  Sparkles,
  Award,
  Lock,
  ExternalLink,
  ChevronRight,
  Edit2,
  Check
} from 'lucide-react';
import './Profile.css';

const avatarGradients = [
  'linear-gradient(135deg, #0071E3 0%, #0056B3 100%)',
  'linear-gradient(135deg, #FF2D55 0%, #FF375F 100%)',
  'linear-gradient(135deg, #34C759 0%, #30B0C7 100%)',
  'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
  'linear-gradient(135deg, #FF9500 0%, #FF3B30 100%)'
];

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Profile fields state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [bio, setBio] = useState('Minimalist tech enthusiast & designer.');
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [profileMsg, setProfileMsg] = useState({ text: '', isError: false });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password fields state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState({ text: '', isError: false });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Payment Methods state
  const [paymentCards, setPaymentCards] = useState([
    { id: 'card_1', brand: 'Visa', last4: '4242', exp: '12/28', isDefault: true },
    { id: 'card_2', brand: 'Mastercard', last4: '8888', exp: '09/27', isDefault: false }
  ]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExp, setNewCardExp] = useState('');

  // Notification Preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    orderUpdates: true,
    promotions: true,
    securityAlerts: true,
    weeklyNewsletter: false
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone_number || '');
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get('/address/getAll');
      if (res.data.success) {
        setAddresses(res.data.innerData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setProfileMsg({ text: '', isError: false });
      const res = await axiosInstance.put(`/user/update/${user._id || user.id}`, {
        name,
        email,
        phone_number: phoneNumber
      });
      if (res.data.success) {
        updateProfile(res.data.innerData);
        setProfileMsg({ text: t('profile.msg_updated'), isError: false });
      }
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || t('profile.msg_update_failed'), isError: true });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: t('profile.pwd_mismatch'), isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ text: t('profile.pwd_min_len'), isError: true });
      return;
    }

    try {
      setPwdSaving(true);
      setPwdMsg({ text: '', isError: false });
      const res = await axiosInstance.put(`/user/update/${user._id || user.id}`, {
        password: newPassword
      });
      if (res.data.success) {
        setPwdMsg({ text: t('profile.pwd_updated'), isError: false });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdMsg({ text: err.response?.data?.message || t('profile.msg_update_failed'), isError: true });
    } finally {
      setPwdSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newCity.trim() || !newStreet.trim()) return;

    try {
      const res = await axiosInstance.post('/address/create', {
        city: newCity.trim(),
        street: newStreet.trim(),
        is_default: addresses.length === 0
      });
      if (res.data.success) {
        setAddresses([res.data.innerData, ...addresses]);
        setNewCity('');
        setNewStreet('');
        setShowAddAddress(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await axiosInstance.delete(`/address/delete/${id}`);
      if (res.data.success) {
        setAddresses(addresses.filter((a) => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPaymentCard = (e) => {
    e.preventDefault();
    if (!newCardNumber.trim() || !newCardName.trim()) return;
    const cleanNum = newCardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '1234';
    const newCard = {
      id: `card_${Date.now()}`,
      brand: cleanNum.startsWith('4') ? 'Visa' : 'Mastercard',
      last4,
      exp: newCardExp || '12/29',
      isDefault: paymentCards.length === 0
    };
    setPaymentCards([...paymentCards, newCard]);
    setNewCardNumber('');
    setNewCardName('');
    setNewCardExp('');
    setShowAddCard(false);
  };

  const handleDeleteCard = (id) => {
    setPaymentCards(paymentCards.filter((c) => c.id !== id));
  };

  return (
    <div className="profile-page page-enter">
      <div className="container">
        {/* Top Header Hero */}
        <div className="profile-hero-card card">
          <div
            className="profile-hero-avatar"
            style={{ background: avatarGradients[selectedGradient] }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-hero-meta">
            <div className="hero-name-row">
              <h2>{user?.name || 'Alex Johnson'}</h2>
              <span className="badge badge-blue">
                <ShieldCheck size={13} style={{ marginRight: '4px' }} />
                {getUserRole(user?.role, t)}
              </span>
            </div>
            <p className="hero-email">{user?.email}</p>
            <div className="membership-stats-row">
              <div className="stat-badge">
                <Sparkles size={14} className="stat-icon" />
                <span>{t('profile.tier_label')}</span>
              </div>
              <div className="stat-badge">
                <Award size={14} className="stat-icon" />
                <span>{t('profile.points_label', { pts: 480 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Layout: Sidebar Navigation + Tab Contents */}
        <div className="profile-dashboard-layout">
          {/* Sidebar Menu */}
          <aside className="profile-sidebar-nav card">
            <button
              className={`nav-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <User size={18} />
              <span>{t('profile.tab_general')}</span>
              <ChevronRight size={15} className="tab-arrow" />
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <KeyRound size={18} />
              <span>{t('profile.tab_security')}</span>
              <ChevronRight size={15} className="tab-arrow" />
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} />
              <span>{t('profile.tab_addresses')}</span>
              <span className="tab-counter">{addresses.length}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={18} />
              <span>{t('profile.tab_payments')}</span>
              <span className="tab-counter">{paymentCards.length}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell size={18} />
              <span>{t('profile.tab_notifications')}</span>
              <ChevronRight size={15} className="tab-arrow" />
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="profile-content-pane">
            {/* TAB 1: Personal Info & Avatar */}
            {activeTab === 'overview' && (
              <div className="tab-pane card">
                <div className="pane-header">
                  <h3>{t('profile.personal_info_title')}</h3>
                  <p>{t('profile.personal_info_sub')}</p>
                </div>

                {profileMsg.text && (
                  <p className={`profile-feedback ${profileMsg.isError ? 'error' : 'success'}`}>
                    {profileMsg.text}
                  </p>
                )}

                {/* Avatar Color Picker */}
                <div className="avatar-palette-box">
                  <span className="palette-label">{t('profile.avatar_theme')}</span>
                  <div className="color-swatches-row">
                    {avatarGradients.map((grad, i) => (
                      <button
                        key={i}
                        className={`gradient-swatch-btn ${selectedGradient === i ? 'selected' : ''}`}
                        style={{ background: grad }}
                        onClick={() => setSelectedGradient(i)}
                      >
                        {selectedGradient === i && <Check size={14} color="#FFF" />}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="profile-form-grid">
                  <div className="form-group">
                    <label>{t('profile.full_name')}</label>
                    <input
                      type="text"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('profile.email_address')}</label>
                    <input
                      type="email"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('profile.phone_number')}</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('profile.bio_label')}</label>
                    <input
                      type="text"
                      className="input-field"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn-primary" disabled={profileSaving}>
                      {profileSaving ? t('profile.saving') : t('profile.save_changes')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Security & Sessions */}
            {activeTab === 'security' && (
              <div className="tab-pane card">
                <div className="pane-header">
                  <h3>{t('profile.security_title')}</h3>
                  <p>{t('profile.security_sub')}</p>
                </div>

                {pwdMsg.text && (
                  <p className={`profile-feedback ${pwdMsg.isError ? 'error' : 'success'}`}>
                    {pwdMsg.text}
                  </p>
                )}

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword} className="security-pwd-form">
                  <div className="form-group">
                    <label>{t('profile.new_password')}</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder={t('profile.pwd_placeholder')}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('profile.confirm_password')}</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder={t('profile.pwd_confirm_placeholder')}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-secondary" disabled={pwdSaving}>
                    {pwdSaving ? t('profile.saving') : t('profile.update_password')}
                  </button>
                </form>

                <div className="security-divider"></div>

                {/* 2FA Toggle */}
                <div className="security-toggle-card">
                  <div className="toggle-info">
                    <div className="toggle-title-row">
                      <Lock size={16} className="sec-icon-blue" />
                      <h4>{t('profile.two_factor_title')}</h4>
                    </div>
                    <p>{t('profile.two_factor_sub')}</p>
                  </div>
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    />
                    <span className="slider-round"></span>
                  </label>
                </div>

                {/* Active Sessions List */}
                <div className="active-sessions-section">
                  <h4>{t('profile.active_sessions_title')}</h4>
                  <div className="sessions-list">
                    <div className="session-item-row">
                      <div className="session-device-icon">
                        <Laptop size={18} />
                      </div>
                      <div className="session-details">
                        <div className="session-top">
                          <strong>Chrome on Windows 11</strong>
                          <span className="current-badge">{t('profile.active_now')}</span>
                        </div>
                        <p>San Francisco, United States • IP: 192.168.1.1</p>
                      </div>
                    </div>

                    <div className="session-item-row">
                      <div className="session-device-icon">
                        <Smartphone size={18} />
                      </div>
                      <div className="session-details">
                        <div className="session-top">
                          <strong>Safari on iPhone 15 Pro</strong>
                          <span className="session-time">Active 2 hrs ago</span>
                        </div>
                        <p>San Francisco, United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="tab-pane card">
                <div className="pane-header-with-action">
                  <div>
                    <h3>{t('profile.addresses_title')} ({addresses.length})</h3>
                    <p>{t('checkout.step1_title')}</p>
                  </div>
                  <button
                    className="btn-primary add-addr-top-btn"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                  >
                    <Plus size={16} /> {t('profile.add_address_btn')}
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="add-address-card-form">
                    <div className="form-group">
                      <label>{t('profile.city_label')}</label>
                      <input
                        type="text"
                        placeholder={t('checkout.city_placeholder')}
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('profile.street_label')}</label>
                      <input
                        type="text"
                        placeholder={t('checkout.street_placeholder')}
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="addr-submit-btns">
                      <button type="submit" className="btn-primary">
                        {t('profile.save_address_btn')}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddAddress(false)}
                      >
                        {t('checkout.cancel')}
                      </button>
                    </div>
                  </form>
                )}

                <div className="address-boxes-grid">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="address-item-card">
                      <div className="addr-card-top">
                        <div className="addr-city-title">
                          <MapPin size={16} className="pin-blue" />
                          <strong>{addr.city}</strong>
                        </div>
                        {addr.is_default && <span className="default-pill">{t('profile.default_badge')}</span>}
                        <button
                          className="delete-address-icon-btn"
                          onClick={() => handleDeleteAddress(addr._id)}
                          title={t('profile.delete_btn')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="addr-card-street">{addr.street}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Payment Methods */}
            {activeTab === 'payments' && (
              <div className="tab-pane card">
                <div className="pane-header-with-action">
                  <div>
                    <h3>{t('profile.payments_title')} ({paymentCards.length})</h3>
                    <p>{t('checkout.step2_title')}</p>
                  </div>
                  <button
                    className="btn-primary add-addr-top-btn"
                    onClick={() => setShowAddCard(!showAddCard)}
                  >
                    <Plus size={16} /> {t('profile.add_card_btn')}
                  </button>
                </div>

                {showAddCard && (
                  <form onSubmit={handleAddPaymentCard} className="add-card-form">
                    <div className="form-group">
                      <label>{t('profile.card_name_label')}</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={newCardName}
                        onChange={(e) => setNewCardName(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('profile.card_num_label')}</label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 4242"
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('profile.card_exp_label')}</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={newCardExp}
                        onChange={(e) => setNewCardExp(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="addr-submit-btns">
                      <button type="submit" className="btn-primary">
                        {t('profile.save_address_btn')}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddCard(false)}
                      >
                        {t('checkout.cancel')}
                      </button>
                    </div>
                  </form>
                )}

                <div className="payment-cards-grid">
                  {paymentCards.map((card) => (
                    <div key={card.id} className="visual-payment-card">
                      <div className="card-chip-row">
                        <span className="card-brand-badge">{card.brand}</span>
                        {card.isDefault && <span className="default-pill-light">{t('profile.default_badge')}</span>}
                        <button
                          className="delete-card-btn"
                          onClick={() => handleDeleteCard(card.id)}
                          title={t('profile.delete_btn')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="card-number-preview">
                        •••• •••• •••• {card.last4}
                      </div>
                      <div className="card-footer-preview">
                        <span>Expires {card.exp}</span>
                        <ShieldCheck size={16} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Notification Preferences */}
            {activeTab === 'notifications' && (
              <div className="tab-pane card">
                <div className="pane-header">
                  <h3>{t('profile.notifs_title')}</h3>
                  <p>{t('profile.tab_notifications')}</p>
                </div>

                <div className="notification-toggles-list">
                  <div className="notif-toggle-row">
                    <div className="notif-text">
                      <h4>{t('profile.notif_orders')}</h4>
                      <p>{t('profile.notif_orders_sub')}</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={notifPrefs.orderUpdates}
                        onChange={() =>
                          setNotifPrefs({ ...notifPrefs, orderUpdates: !notifPrefs.orderUpdates })
                        }
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-row">
                    <div className="notif-text">
                      <h4>{t('profile.notif_promo')}</h4>
                      <p>{t('profile.notif_promo_sub')}</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={notifPrefs.promotions}
                        onChange={() =>
                          setNotifPrefs({ ...notifPrefs, promotions: !notifPrefs.promotions })
                        }
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-row">
                    <div className="notif-text">
                      <h4>{t('profile.notif_security')}</h4>
                      <p>{t('profile.notif_security_sub')}</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={notifPrefs.securityAlerts}
                        onChange={() =>
                          setNotifPrefs({
                            ...notifPrefs,
                            securityAlerts: !notifPrefs.securityAlerts
                          })
                        }
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="notif-toggle-row">
                    <div className="notif-text">
                      <h4>{t('profile.notif_news')}</h4>
                      <p>{t('profile.notif_news_sub')}</p>
                    </div>
                    <label className="switch-toggle">
                      <input
                        type="checkbox"
                        checked={notifPrefs.weeklyNewsletter}
                        onChange={() =>
                          setNotifPrefs({
                            ...notifPrefs,
                            weeklyNewsletter: !notifPrefs.weeklyNewsletter
                          })
                        }
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

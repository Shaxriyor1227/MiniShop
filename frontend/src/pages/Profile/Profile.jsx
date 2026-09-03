import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
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
        setProfileMsg({ text: 'Profile updated successfully!', isError: false });
      }
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Failed to update profile', isError: true });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdMsg({ text: 'Passwords do not match', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ text: 'Password must be at least 6 characters long', isError: true });
      return;
    }

    try {
      setPwdSaving(true);
      setPwdMsg({ text: '', isError: false });
      const res = await axiosInstance.put(`/user/update/${user._id || user.id}`, {
        password: newPassword
      });
      if (res.data.success) {
        setPwdMsg({ text: 'Password updated successfully!', isError: false });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdMsg({ text: err.response?.data?.message || 'Failed to update password', isError: true });
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
                {user?.role === 'admin' ? 'Administrator' : 'Gold Member'}
              </span>
            </div>
            <p className="hero-email">{user?.email}</p>
            <div className="membership-stats-row">
              <div className="stat-badge">
                <Sparkles size={14} className="stat-icon" />
                <span>Tier: <strong>Gold Club</strong></span>
              </div>
              <div className="stat-badge">
                <Award size={14} className="stat-icon" />
                <span>Points: <strong>480 pts</strong></span>
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
              <span>Payment Methods</span>
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
                  <h3>Personal Information</h3>
                  <p>Manage your public identity, contact details, and account preferences.</p>
                </div>

                {profileMsg.text && (
                  <p className={`profile-feedback ${profileMsg.isError ? 'error' : 'success'}`}>
                    {profileMsg.text}
                  </p>
                )}

                {/* Avatar Color Picker */}
                <div className="avatar-palette-box">
                  <span className="palette-label">Avatar Theme Color:</span>
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
                    <label>Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Short Bio / Note</label>
                    <input
                      type="text"
                      className="input-field"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="btn-primary" disabled={profileSaving}>
                      {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: Security & Sessions */}
            {activeTab === 'security' && (
              <div className="tab-pane card">
                <div className="pane-header">
                  <h3>Security & Access</h3>
                  <p>Keep your account safe by updating your password and reviewing active sessions.</p>
                </div>

                {pwdMsg.text && (
                  <p className={`profile-feedback ${pwdMsg.isError ? 'error' : 'success'}`}>
                    {pwdMsg.text}
                  </p>
                )}

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword} className="security-pwd-form">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="input-field"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-secondary" disabled={pwdSaving}>
                    {pwdSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                <div className="security-divider"></div>

                {/* 2FA Toggle */}
                <div className="security-toggle-card">
                  <div className="toggle-info">
                    <div className="toggle-title-row">
                      <Lock size={16} className="sec-icon-blue" />
                      <h4>Two-Factor Authentication (2FA)</h4>
                    </div>
                    <p>Protect your account with an extra security step when logging in from new devices.</p>
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
                  <h4>Active Sessions & Devices</h4>
                  <div className="sessions-list">
                    <div className="session-item-row">
                      <div className="session-device-icon">
                        <Laptop size={18} />
                      </div>
                      <div className="session-details">
                        <div className="session-top">
                          <strong>Chrome on Windows 11</strong>
                          <span className="current-badge">This Device (Online)</span>
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
                    <h3>Saved Addresses ({addresses.length})</h3>
                    <p>Manage your primary shipping destinations for 1-click checkout.</p>
                  </div>
                  <button
                    className="btn-primary add-addr-top-btn"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                  >
                    <Plus size={16} /> Add Address
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="add-address-card-form">
                    <div className="form-group">
                      <label>City / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. San Francisco, CA"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="form-group">
                      <label>Street & Apartment</label>
                      <input
                        type="text"
                        placeholder="e.g. 100 California St, Apt 4B"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="addr-submit-btns">
                      <button type="submit" className="btn-primary">
                        Save Address
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddAddress(false)}
                      >
                        Cancel
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
                        {addr.is_default && <span className="default-pill">Default</span>}
                        <button
                          className="delete-address-icon-btn"
                          onClick={() => handleDeleteAddress(addr._id)}
                          title="Delete address"
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
                    <h3>Payment Methods ({paymentCards.length})</h3>
                    <p>Securely stored credit and debit cards for swift checkout.</p>
                  </div>
                  <button
                    className="btn-primary add-addr-top-btn"
                    onClick={() => setShowAddCard(!showAddCard)}
                  >
                    <Plus size={16} /> Add New Card
                  </button>
                </div>

                {showAddCard && (
                  <form onSubmit={handleAddPaymentCard} className="add-card-form">
                    <div className="form-group">
                      <label>Cardholder Name</label>
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
                      <label>Card Number</label>
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
                      <label>Expiry Date</label>
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
                        Save Card
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowAddCard(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="payment-cards-grid">
                  {paymentCards.map((card) => (
                    <div key={card.id} className="visual-payment-card">
                      <div className="card-chip-row">
                        <span className="card-brand-badge">{card.brand}</span>
                        {card.isDefault && <span className="default-pill-light">Primary</span>}
                        <button
                          className="delete-card-btn"
                          onClick={() => handleDeleteCard(card.id)}
                          title="Remove card"
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
                  <h3>Notification Preferences</h3>
                  <p>Choose what updates, announcements, and alerts you'd like to receive.</p>
                </div>

                <div className="notification-toggles-list">
                  <div className="notif-toggle-row">
                    <div className="notif-text">
                      <h4>Order & Delivery Updates</h4>
                      <p>Receive real-time tracking alerts when your parcel ships or delivers.</p>
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
                      <h4>Exclusive Drops & Member Discounts</h4>
                      <p>Be the first to know when new limited products and seasonal sales launch.</p>
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
                      <h4>Security & Login Alerts</h4>
                      <p>Instant alerts when your account is accessed from an unrecognized browser.</p>
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
                      <h4>Weekly MiniShop Journal Digest</h4>
                      <p>Curated tech stories, workspace setups, and minimalist design inspiration.</p>
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

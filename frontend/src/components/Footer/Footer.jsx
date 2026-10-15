import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Twitter,
  Instagram,
  Github,
  Linkedin
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer-root">
      {/* 1. Value Props Bar (Full-Width, Cleanly Integrated) */}
      <div className="footer-benefits-bar">
        <div className="container">
          <div className="benefits-unified-grid">
            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <Truck size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">{t('footer.benefit1_title')}</h4>
                <p className="benefit-sub">{t('footer.benefit1_sub')}</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <ShieldCheck size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">{t('footer.benefit2_title')}</h4>
                <p className="benefit-sub">{t('footer.benefit2_sub')}</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <RotateCcw size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">{t('footer.benefit3_title')}</h4>
                <p className="benefit-sub">{t('footer.benefit3_sub')}</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <Headphones size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">{t('footer.benefit4_title')}</h4>
                <p className="benefit-sub">{t('footer.benefit4_sub')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body */}
      <div className="footer-main-area">
        <div className="container">
          <div className="footer-columns-grid">
            {/* Column 1: Brand & Newsletter */}
            <div className="footer-column brand-column">
              <Link to="/" className="footer-brand-logo">
                <div className="brand-logo-badge">
                  <ShoppingBag size={18} strokeWidth={2.4} />
                </div>
                <span className="brand-title">
                  Mini<span className="brand-blue-part">Shop</span>
                </span>
              </Link>
              <p className="footer-brand-description">
                {t('footer.brand_desc')}
              </p>

              {/* Newsletter form */}
              <div className="newsletter-box">
                <span className="newsletter-title">{t('footer.newsletter_title')}</span>
                <p className="newsletter-subtitle">{t('footer.newsletter_sub')}</p>
                {subscribed ? (
                  <div className="newsletter-success-msg">
                    <CheckCircle2 size={16} /> {t('footer.newsletter_success')}
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="newsletter-input-group">
                    <input
                      type="email"
                      placeholder={t('footer.newsletter_placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="newsletter-field"
                    />
                    <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe">
                      <ArrowRight size={15} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Column 2: Shop Catalog */}
            <div className="footer-column">
              <h4 className="footer-column-title">{t('footer.products_col')}</h4>
              <ul className="footer-links-list">
                <li><Link to="/catalog?category=audio">{t('footer.link_audio')}</Link></li>
                <li><Link to="/catalog?category=wearables">{t('footer.link_wearables')}</Link></li>
                <li><Link to="/catalog?category=workspace">{t('footer.link_workspace_kb')}</Link></li>
                <li><Link to="/catalog?category=workspace">{t('footer.link_workspace_mouse')}</Link></li>
                <li><Link to="/catalog?category=accessories">{t('footer.link_accessories_chargers')}</Link></li>
                <li><Link to="/catalog?category=accessories">{t('footer.link_accessories_leather')}</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="footer-column">
              <h4 className="footer-column-title">{t('footer.customer_col')}</h4>
              <ul className="footer-links-list">
                <li><Link to="/orders">{t('nav.orders')}</Link></li>
                <li><Link to="/wishlist">{t('nav.wishlist')}</Link></li>
                <li><Link to="/cart">{t('nav.cart')}</Link></li>
                <li><Link to="/profile">{t('nav.profile')}</Link></li>
                <li><Link to="/profile">{t('profile.tab_addresses')}</Link></li>
                <li><Link to="/login">{t('nav.login')} / {t('nav.register')}</Link></li>
              </ul>
            </div>

            {/* Column 4: Company & Trust */}
            <div className="footer-column">
              <h4 className="footer-column-title">{t('footer.company_col')}</h4>
              <ul className="footer-links-list">
                <li><a href="#about">{t('footer.link_about')}</a></li>
                <li><a href="#sustainability">{t('footer.link_sustainability')}</a></li>
                <li><a href="#warranty">{t('footer.link_warranty')}</a></li>
                <li><a href="#faq">{t('footer.link_faq')}</a></li>
              </ul>

              <div className="footer-status-pill">
                <span className="status-indicator-dot"></span>
                <span>{t('footer.operational_status')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            {t('footer.rights_reserved')}
          </p>

          <div className="footer-legal-links">
            <a href="#privacy">{t('footer.privacy')}</a>
            <span className="legal-dot">•</span>
            <a href="#terms">{t('footer.terms')}</a>
            <span className="legal-dot">•</span>
            <a href="#cookies">{t('footer.link_cookies')}</a>
            <span className="legal-dot">•</span>
            <a href="#security">{t('footer.security')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

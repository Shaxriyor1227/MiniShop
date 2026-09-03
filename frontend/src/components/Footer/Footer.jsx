import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
                <h4 className="benefit-heading">Free Express Shipping</h4>
                <p className="benefit-sub">Complimentary on all orders over $100</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <ShieldCheck size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">100% Authentic Gear</h4>
                <p className="benefit-sub">Certified original with 1-year warranty</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <RotateCcw size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">14-Day Money Back</h4>
                <p className="benefit-sub">No-questions-asked return policy</p>
              </div>
            </div>

            <div className="benefit-col">
              <div className="benefit-icon-wrapper">
                <Headphones size={22} strokeWidth={2} />
              </div>
              <div className="benefit-text-wrap">
                <h4 className="benefit-heading">24/7 Expert Support</h4>
                <p className="benefit-sub">Real human assistance whenever needed</p>
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
                Simple. Beautiful. Yours. Minimalist high-performance consumer technology designed to seamlessly fit into your daily workflow.
              </p>

              {/* Newsletter form */}
              <div className="newsletter-box">
                <span className="newsletter-title">Subscribe to the MiniShop Journal</span>
                <p className="newsletter-subtitle">Get private access to product drops and 10% off your first purchase.</p>
                {subscribed ? (
                  <div className="newsletter-success-msg">
                    <CheckCircle2 size={16} /> You're on the VIP list! Welcome aboard.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="newsletter-input-group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
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
              <h4 className="footer-column-title">Products</h4>
              <ul className="footer-links-list">
                <li><Link to="/catalog?category=Audio">Audio & Headphones</Link></li>
                <li><Link to="/catalog?category=Wearables">Smart Watches & Bands</Link></li>
                <li><Link to="/catalog?category=Workspace">Mechanical Keyboards</Link></li>
                <li><Link to="/catalog?category=Workspace">Ergonomic Mice & Gear</Link></li>
                <li><Link to="/catalog?category=Accessories">MagSafe & Power Chargers</Link></li>
                <li><Link to="/catalog?category=Accessories">Minimalist Leather Goods</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="footer-column">
              <h4 className="footer-column-title">Customer Care</h4>
              <ul className="footer-links-list">
                <li><Link to="/orders">Order Tracking</Link></li>
                <li><Link to="/wishlist">Saved Wishlist</Link></li>
                <li><Link to="/cart">Shopping Bag</Link></li>
                <li><Link to="/profile">Account Settings</Link></li>
                <li><Link to="/profile">Shipping Addresses</Link></li>
                <li><Link to="/login">Sign In / Register</Link></li>
              </ul>
            </div>

            {/* Column 4: Company & Trust */}
            <div className="footer-column">
              <h4 className="footer-column-title">Company</h4>
              <ul className="footer-links-list">
                <li><a href="#about">About MiniShop</a></li>
                <li><a href="#sustainability">Sustainability</a></li>
                <li><a href="#warranty">Warranty & Repairs</a></li>
                <li><a href="#faq">Help & FAQ</a></li>
              </ul>

              <div className="footer-status-pill">
                <span className="status-indicator-dot"></span>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} MiniShop, Inc. All rights reserved. Designed with Apple-level simplicity.
          </p>

          <div className="footer-legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="legal-dot">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="legal-dot">•</span>
            <a href="#cookies">Cookie Preferences</a>
            <span className="legal-dot">•</span>
            <a href="#security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

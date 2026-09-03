import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../api/axiosInstance';
import ProductCard from '../../components/ProductCard/ProductCard';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  ArrowRight,
  CheckCircle2,
  Headphones,
  Watch,
  Laptop,
  Lightbulb,
  Tag,
  ChevronRight,
  ChevronLeft,
  Award,
  Layers,
  ShoppingBag,
  Heart,
  ArrowUpRight
} from 'lucide-react';
import './Home.css';

const brandLogos = [
  { name: 'Apple', style: 'font-bold tracking-tight' },
  { name: 'Sony', style: 'font-bold tracking-[0.2em] uppercase' },
  { name: 'Keychron', style: 'font-semibold tracking-tight' },
  { name: 'Anker', style: 'font-bold tracking-wider uppercase' },
  { name: 'Logitech', style: 'font-medium tracking-tight lowercase' }
];

const newArrivalsData = [
  {
    tag: 'TITANIUM DLC',
    name: 'Chronos Stealth',
    desc: 'Sapphire crystal lens, 14-day battery',
    price: 420,
    img: '/images/stitch/smart_watch.png',
    link: '/catalog?category=Wearables'
  },
  {
    tag: 'LIMITED RUN',
    name: 'Horizon Noir',
    desc: 'Matte vapor deposition acoustic finish',
    price: 540,
    img: '/images/stitch/audio_headphones.png',
    link: '/catalog?category=Audio'
  },
  {
    tag: 'SOLID WALNUT',
    name: 'Form Studio Tray',
    desc: 'Solid american walnut & anodized aluminum',
    price: 85,
    img: '/images/stitch/walnut_tray.png',
    link: '/catalog?category=Accessories'
  },
  {
    tag: 'CUSTOM LINEAR',
    name: 'Aer Wireless 75',
    desc: 'Low-profile wireless mechanical keyboard',
    price: 179,
    img: '/images/stitch/mechanical_kb.png',
    link: '/catalog?category=Workspace'
  },
  {
    tag: 'FAST MAG CHARGE',
    name: 'Linear Stand 3',
    desc: 'Three-device inductive aluminum tower',
    price: 129,
    img: '/images/stitch/mag_stand.png',
    link: '/catalog?category=Accessories'
  },
  {
    tag: '4K POLLING',
    name: 'Tangent Mouse',
    desc: 'Precision machined thumb scroll & ceramic feet',
    price: 115,
    img: '/images/stitch/tangent_mouse.png',
    link: '/catalog?category=Workspace'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Lead UX Architect, San Francisco',
    avatar: 'SJ',
    avatarImg: '/images/avatars/sarah.jpg',
    rating: 5,
    text: 'The Studio Wireless Pro headphones deliver acoustic clarity on par with studio monitors. Build quality feels like true Apple-tier craftsmanship.',
    product: 'Studio Wireless Pro Headphones'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Staff Software Engineer, Seattle',
    avatar: 'MV',
    avatarImg: '/images/avatars/marcus.jpg',
    rating: 5,
    text: 'The mechanical keyboard and desk setup transformed my daily flow. Instant delivery, packaging was immaculate, and setup took under 30 seconds.',
    product: 'Ultra-Slim Mechanical Keyboard'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Creative Director, London',
    avatar: 'ER',
    avatarImg: '/images/avatars/elena.jpg',
    rating: 5,
    text: 'MiniShop is my go-to for minimalist workspace tech. Clean aesthetic, zero bloat, and authentic hardware with rapid global shipping.',
    product: 'Minimal OLED Smartwatch Series X'
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Hardware Architect, Austin',
    avatar: 'DC',
    avatarImg: '/images/avatars/david.jpg',
    rating: 5,
    text: 'The 0.02mm CNC aluminum finish on the desk lamp is pure perfection. Touch sensor dimmer and circadian color balance work flawlessly.',
    product: 'Smart Desk Ambient Lamp'
  },
  {
    id: 5,
    name: 'Sophia Martinez',
    role: 'Sound Designer, Los Angeles',
    avatar: 'SM',
    avatarImg: '/images/avatars/sophia.jpg',
    rating: 5,
    text: 'Spatial Audio 3D with low-latency AAC gives me seamless audio monitoring on the go. Super comfortable even after 8-hour mixing sessions.',
    product: 'Pro Wireless Earbuds Gen 2'
  },
  {
    id: 6,
    name: 'Liam Novak',
    role: 'Industrial Designer, Berlin',
    avatar: 'LN',
    avatarImg: '/images/avatars/liam.jpg',
    rating: 5,
    text: 'The minimalist full-grain leather wallet and MagSafe charger have replaced all my bulky EDC gear. Exceptionally durable and timeless.',
    product: 'Minimalist Leather Card Wallet'
  }
];

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const arrivalsScrollRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/product/getAll');
        if (res.data.success) {
          setFeaturedProducts(res.data.innerData.slice(0, 4));
        }
      } catch (err) {
        console.error('[Home Featured Error]:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleScrollArrivals = (direction) => {
    if (arrivalsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      arrivalsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="home-editorial-page page-enter">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="editorial-hero-section">
        <div className="container">
          <div className="hero-top-row">
            <div className="hero-top-left">
              <span className="hero-eyebrow-tag">
                MINISHOP / NEW COLLECTION
              </span>
              <h1 className="hero-display-headline">
                Technology,<br />beautifully simple.
              </h1>
              <p className="hero-editorial-subtext">
                {t('home.hero_desc')}
              </p>
              <div className="hero-action-pills">
                <Link to="/catalog" className="btn-primary hero-main-pill">
                  <span>{t('home.hero_cta')}</span>
                  <ArrowRight size={17} />
                </Link>
                <a href="#new-arrivals" className="hero-ghost-link group">
                  <span>{t('home.hero_secondary')}</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Live Mechanical Spec Tolerance Counter */}
            <div className="hero-spec-counter-box card">
              <div className="spec-counter-header">
                <span>CATALOG SPEC</span>
                <span>EST. 2025</span>
              </div>
              <div className="spec-counter-val">
                0.02%
              </div>
              <div className="spec-counter-lbl">
                TOLERANCE THRESHOLD
              </div>
              <div className="spec-counter-bar-track">
                <div className="spec-counter-bar-fill"></div>
              </div>
            </div>
          </div>

          {/* Dominant 16:9 Cinematic Hero Image Container */}
          <div className="hero-cinema-frame">
            <img
              src="/images/stitch/hero_podium.png"
              alt="MiniShop Flagship Workspace Presentation"
              className="hero-cinema-img"
              onError={(e) => {
                e.currentTarget.src = '/images/hero_banner.png';
              }}
            />
            <div className="hero-cinema-badge">
              <Sparkles size={14} />
              <span>Studio Grade 5K Retina Ecosystem</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERO TRUST INFORMATION STRIP */}
      <section className="editorial-trust-strip">
        <div className="container">
          <div className="trust-strip-inner">
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">100% Original</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">Express Delivery</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">4.98 / 5.0 Rating</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">Secure 256-bit SSL</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND PARTNERS STRIP */}
      <section className="editorial-brands-section">
        <div className="container">
          <p className="brands-title-label">
            {t('home.partners_label')}
          </p>
          <div className="brands-logo-row">
            {brandLogos.map((brand, idx) => (
              <span key={idx} className={`brand-item-text ${brand.style}`}>
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC COLLECTIONS GRID */}
      <section className="editorial-collections-section">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">COLLECTIONS</span>
              <h2 className="section-title-large">Find what fits your world.</h2>
            </div>
            <Link to="/catalog" className="section-header-link">
              <span>{t('home.explore_all')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="collections-asymmetric-grid">
            {/* Audio (8 Columns) */}
            <Link to="/catalog?category=Audio" className="collection-tile tile-audio">
              <img
                src="/images/stitch/audio_headphones.png"
                alt="Audio Collection"
                className="tile-bg-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_wireless_headphones.png';
                }}
              />
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">ACOUSTIC SYSTEMS</span>
                <h3 className="tile-title">Audio</h3>
                <p className="tile-action-link">
                  <span>Explore sound</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Smart Watches (4 Columns) */}
            <Link to="/catalog?category=Wearables" className="collection-tile tile-watches">
              <img
                src="/images/stitch/smart_watch.png"
                alt="Smart Watches Collection"
                className="tile-bg-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_smart_watch.png';
                }}
              />
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">WEARABLE CHRONO</span>
                <h3 className="tile-title">Smart Watches</h3>
                <p className="tile-action-link">
                  <span>Precision timepieces</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Workspace (6 Columns) */}
            <Link to="/catalog?category=Workspace" className="collection-tile tile-workspace">
              <img
                src="/images/stitch/workspace_setup.png"
                alt="Workspace Collection"
                className="tile-bg-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_mechanical_keyboard.png';
                }}
              />
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">ERGONOMIC SANCTUARY</span>
                <h3 className="tile-title">Workspace</h3>
                <p className="tile-action-link">
                  <span>Curate your desk</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Accessories (6 Columns) */}
            <Link to="/catalog?category=Accessories" className="collection-tile tile-accessories">
              <img
                src="/images/stitch/accessories_flatlay.png"
                alt="Accessories Collection"
                className="tile-bg-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_desk_lamp.png';
                }}
              />
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">TACTILE ESSENTIALS</span>
                <h3 className="tile-title">Accessories</h3>
                <p className="tile-action-link">
                  <span>Essential companions</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SPECIMEN SHOWCASE */}
      <section className="editorial-specimen-section">
        <div className="container">
          <div className="specimen-card card">
            <div className="specimen-visual-pane">
              <img
                src="/images/stitch/audio_headphones.png"
                alt="Acoustic Horizon One Specimen"
                className="specimen-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_wireless_headphones.png';
                }}
              />
            </div>

            <div className="specimen-info-pane">
              <span className="specimen-badge">FEATURED SPECIMEN</span>
              <h2 className="specimen-headline">Acoustic Horizon One</h2>
              <p className="specimen-desc">
                Custom 40mm beryllium drivers suspended in aerospace-grade aluminum. Pure acoustic transparency meets uncompromising comfort for deep uninterrupted immersion.
              </p>

              {/* Technical 3-Column Specification Matrix */}
              <div className="specimen-tech-matrix">
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">DRIVER</span>
                  <span className="matrix-val">40mm Beryllium</span>
                </div>
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">FREQUENCY</span>
                  <span className="matrix-val">5Hz – 48kHz</span>
                </div>
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">WEIGHT</span>
                  <span className="matrix-val">248 Grams</span>
                </div>
              </div>

              <div className="specimen-action-row">
                <div className="specimen-price-box">
                  <span className="price-lbl">PRICE</span>
                  <span className="price-val">$499</span>
                </div>
                <Link to="/catalog?category=Audio" className="btn-primary specimen-btn">
                  <span>Discover product</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POPULAR RIGHT NOW PRODUCT GRID */}
      <section className="editorial-trending-section">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">TRENDING</span>
              <h2 className="section-title-large">Popular right now</h2>
            </div>
            <Link to="/catalog" className="section-header-link">
              <span>View all products</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="trending-cards-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="product-skeleton card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-line full"></div>
                  <div className="skeleton-line half"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="trending-cards-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. PROMOTIONAL WORKSPACE ARCHITECTURE BANNER */}
      <section className="editorial-promo-banner-section">
        <div className="container">
          <div className="promo-monolith-card">
            <div className="promo-ambient-light"></div>
            <div className="promo-layout-grid">
              <div className="promo-text-side">
                <span className="promo-eyebrow">WORKSPACE ARCHITECTURE</span>
                <h2 className="promo-headline">Build your perfect setup.</h2>
                <p className="promo-body">
                  Curated ergonomics, audiophile acoustics, and tactile mechanical precision engineered to elevate your daily focus and quiet your surroundings.
                </p>
                <div className="promo-btn-group">
                  <Link to="/catalog?category=Workspace" className="btn-primary promo-pill-btn">
                    <span>Build your workspace</span>
                    <ArrowRight size={16} />
                  </Link>
                  <span className="promo-bundles-tag">BUNDLES FROM $699</span>
                </div>
              </div>

              <div className="promo-visual-side">
                <img
                  src="/images/stitch/workspace_setup.png"
                  alt="Minimal Studio Workspace Architecture"
                  className="promo-visual-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero_banner.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEW ARRIVALS HORIZONTAL SCROLL CAROUSEL */}
      <section className="editorial-arrivals-section" id="new-arrivals">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">EDITION 04</span>
              <h2 className="section-title-large">Just arrived.</h2>
            </div>
            <div className="arrivals-nav-btns">
              <button
                className="arrivals-arrow-btn"
                onClick={() => handleScrollArrivals('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="arrivals-arrow-btn"
                onClick={() => handleScrollArrivals('right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="arrivals-carousel-track" ref={arrivalsScrollRef}>
            {newArrivalsData.map((item, idx) => (
              <Link to={item.link} key={idx} className="arrival-item-card card">
                <div className="arrival-img-frame">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="arrival-img"
                    onError={(e) => {
                      e.currentTarget.src = '/images/product_placeholder.png';
                    }}
                  />
                </div>
                <span className="arrival-tag">{item.tag}</span>
                <h4 className="arrival-title">{item.name}</h4>
                <p className="arrival-desc">{item.desc}</p>
                <div className="arrival-footer-row">
                  <span className="arrival-price">${item.price}</span>
                  <ArrowUpRight size={18} className="arrival-link-arrow" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS & TESTIMONIALS (Preserved in full fidelity) */}
      <section className="editorial-reviews-section">
        <div className="container">
          <div className="section-title-header text-center-header">
            <span className="section-eyebrow">{t('home.reviews_badge')}</span>
            <h2 className="section-title-large">{t('home.reviews_title')}</h2>
            <p className="section-subtext-centered">{t('home.reviews_sub')}</p>
          </div>
        </div>

        <div className="reviews-marquee-container">
          <div className="reviews-marquee-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="editorial-review-card card">
                <div className="review-rating-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <p className="review-quote-text">"{t.text}"</p>
                <div className="review-author-meta">
                  <div className="author-avatar-circle">
                    <img
                      src={t.avatarImg}
                      alt={t.name}
                      className="author-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="author-avatar-fallback" style={{ display: 'none' }}>
                      {t.avatar}
                    </div>
                  </div>
                  <div className="author-text-info">
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="review-verified-badge">
                  <CheckCircle2 size={13} className="verified-check" />
                  <span>Verified Purchase: {t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL MINIMALIST CALIBRATION CTA */}
      <section className="editorial-final-cta-section">
        <div className="container">
          <div className="final-cta-inner">
            <span className="final-cta-eyebrow">MINIMALIST CALIBRATION</span>
            <h2 className="final-cta-headline">Your next favorite device is waiting.</h2>
            <Link to="/catalog" className="btn-primary final-cta-pill">
              <span>Explore MiniShop</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

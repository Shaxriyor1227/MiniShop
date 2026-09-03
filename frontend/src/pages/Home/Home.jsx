import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
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
  Award,
  Layers
} from 'lucide-react';
import './Home.css';

const brandLogos = ['Apple', 'Sony', 'Keychron', 'Anker', 'Logitech', 'Minimal'];

const categoryCards = [
  {
    name: 'Audio & Studio',
    desc: 'High-fidelity acoustic headphones and noise-cancelling earbuds.',
    icon: Headphones,
    categoryParam: 'Audio',
    gradient: 'linear-gradient(135deg, #1D1D1F 0%, #2C2C2E 100%)',
    iconColor: '#0071E3'
  },
  {
    name: 'Smart Wearables',
    desc: 'OLED health tracking smartwatches and titanium bands.',
    icon: Watch,
    categoryParam: 'Wearables',
    gradient: 'linear-gradient(135deg, #1C1C1E 0%, #2A2D34 100%)',
    iconColor: '#FF2D55'
  },
  {
    name: 'Workspace & Input',
    desc: 'Custom mechanical keyboards and precision ergonomic mice.',
    icon: Laptop,
    categoryParam: 'Workspace',
    gradient: 'linear-gradient(135deg, #18191B 0%, #23272F 100%)',
    iconColor: '#5856D6'
  },
  {
    name: 'Smart Ambient Lighting',
    desc: 'Intelligent aluminum desk lamps and circadian lighting.',
    icon: Lightbulb,
    categoryParam: 'Smart Home',
    gradient: 'linear-gradient(135deg, #1A1A1D 0%, #2D2721 100%)',
    iconColor: '#FF9500'
  },
  {
    name: 'Power & Accessories',
    desc: 'GaN fast chargers and MagSafe full-grain leather wallets.',
    icon: Tag,
    categoryParam: 'Accessories',
    gradient: 'linear-gradient(135deg, #1E1E24 0%, #2E2532 100%)',
    iconColor: '#34C759'
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
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/product/getAll');
        if (res.data.success) {
          // Take top 4 flagship items for home showcase
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

  return (
    <div className="home-page page-enter">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Brand Partners Cloud */}
      <section className="brand-partners-section">
        <div className="container">
          <span className="partners-label">Authorized Retailer & Hardware Partner</span>
          <div className="partners-cloud">
            {brandLogos.map((b, i) => (
              <span key={i} className="partner-item">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Explore by Category Grid (Visual Category Cards) */}
      <section className="home-categories-section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <span className="home-sub-badge">Ecosystem</span>
              <h2 className="home-section-title">Explore by Category</h2>
              <p className="home-section-subtitle">
                Engineered hardware crafted for mindful work, studio listening, and seamless mobility.
              </p>
            </div>
            <Link to="/catalog" className="explore-all-link">
              Browse Entire Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="home-category-cards-grid">
            {categoryCards.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/catalog?category=${cat.categoryParam}`}
                  className="home-category-card"
                  style={{ background: cat.gradient }}
                >
                  <div className="cat-card-header">
                    <div className="cat-card-icon-box" style={{ color: cat.iconColor }}>
                      <IconComp size={24} strokeWidth={2.2} />
                    </div>
                    <span className="cat-arrow-icon">
                      <ChevronRight size={18} />
                    </span>
                  </div>
                  <div className="cat-card-body">
                    <h3 className="cat-card-title">{cat.name}</h3>
                    <p className="cat-card-desc">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Trending Drops / Curated Featured Innovations */}
      <section className="featured-drops-section">
        <div className="container">
          <div className="home-section-header">
            <div>
              <span className="home-sub-badge">Featured Drops</span>
              <h2 className="home-section-title">Curated Flagships</h2>
              <p className="home-section-subtitle">
                Our most sought-after products of the season, built with precision and timeless design.
              </p>
            </div>
            <Link to="/catalog" className="btn-secondary view-catalog-btn">
              Open Full Catalog ({featuredProducts.length}+) <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="featured-products-grid">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="product-skeleton card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-line full"></div>
                  <div className="skeleton-line half"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="catalog-cta-footer-banner card">
            <div className="cta-banner-text">
              <div className="cta-pill">
                <Sparkles size={14} /> Full Hardware Collection
              </div>
              <h3>Looking for specific studio gear, cables, or accessories?</h3>
              <p>Explore our complete catalog with advanced category filters, price sorting, and maker search.</p>
            </div>
            <Link to="/catalog" className="btn-primary cta-catalog-btn">
              Explore All Products in Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Flagship Spotlight Showcase */}
      <section className="flagship-spotlight-section">
        <div className="container">
          <div className="spotlight-card card">
            <div className="spotlight-info">
              <span className="spotlight-tag">Flagship Spotlight</span>
              <h2 className="spotlight-title">Studio Wireless Pro</h2>
              <p className="spotlight-lead">
                Immersive 3D Spatial Audio with active head tracking, custom 40mm neodymium transducers, and up to 40 hours of lossless playback.
              </p>

              <div className="spotlight-specs-grid">
                <div className="spotlight-spec-box">
                  <span className="spec-val">40 Hours</span>
                  <span className="spec-lbl">Battery Life</span>
                </div>
                <div className="spotlight-spec-box">
                  <span className="spec-val">0.02mm</span>
                  <span className="spec-lbl">CNC Precision</span>
                </div>
                <div className="spotlight-spec-box">
                  <span className="spec-val">Bluetooth 5.3</span>
                  <span className="spec-lbl">Low-Latency AAC</span>
                </div>
              </div>

              <div className="spotlight-buttons">
                <Link to="/catalog?category=Audio" className="btn-primary">
                  Shop Audio Gear <ArrowRight size={16} />
                </Link>
                <Link to="/catalog" className="btn-secondary">
                  Compare in Catalog
                </Link>
              </div>
            </div>

            <div className="spotlight-image-wrapper">
              <img
                src="/images/product_wireless_headphones.png"
                alt="Studio Wireless Pro"
                className="spotlight-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_placeholder.png';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bento Highlights Grid (Engineering Philosophy) */}
      <section className="bento-section">
        <div className="container">
          <div className="bento-header">
            <span className="bento-badge">Engineering Philosophy</span>
            <h2 className="bento-title">Designed with Intention. Built to Last.</h2>
            <p className="bento-sub">We believe technology should feel natural, unobtrusive, and exceptionally refined.</p>
          </div>

          <div className="bento-grid">
            {/* Card 1: Large Feature */}
            <div className="bento-card bento-card-large card">
              <div className="bento-card-content">
                <div className="bento-icon-pill">
                  <Sparkles size={18} />
                  <span>Pure Craftsmanship</span>
                </div>
                <h3>Precision Anodized Aluminum</h3>
                <p>Every corner is CNC-machined from single-billet recycled aluminum for remarkable durability and tactile satisfaction.</p>
              </div>
              <div className="bento-visual-stat">
                <span className="stat-big">0.02mm</span>
                <span className="stat-label">Micro-tolerance precision</span>
              </div>
            </div>

            {/* Card 2: 3D Acoustics */}
            <div className="bento-card card">
              <div className="bento-icon-pill">
                <Zap size={18} />
                <span>Acoustic Mastery</span>
              </div>
              <h3>Spatial Audio 3D</h3>
              <p>Real-time head tracking creates an immersive cinematic soundstage around you.</p>
            </div>

            {/* Card 3: Sustainability */}
            <div className="bento-card card">
              <div className="bento-icon-pill">
                <Globe size={18} />
                <span>Eco-conscious</span>
              </div>
              <h3>100% Carbon Neutral</h3>
              <p>Plastic-free biodegradable packaging with zero net carbon footprint logistics.</p>
            </div>

            {/* Card 4: Warranty */}
            <div className="bento-card bento-card-wide card">
              <div className="bento-wide-content">
                <div className="bento-icon-pill">
                  <ShieldCheck size={18} />
                  <span>MiniCare Promise</span>
                </div>
                <h3>2-Year Direct Global Warranty</h3>
                <p>Hassle-free replacement policy with 24/7 dedicated support specialists worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials Infinite Marquee */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <span className="bento-badge">Verified Reviews</span>
            <h2 className="testimonials-title">Loved by Creators & Builders</h2>
            <p className="testimonials-sub">See why thousands of developers, designers, and audio purists worldwide choose MiniShop.</p>
          </div>
        </div>

        {/* Infinite Scrolling Marquee Track */}
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="testimonial-card card">
                <div className="testimonial-rating">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar-frame">
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
                  <div className="author-meta">
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
                <div className="verified-purchase-badge">
                  <CheckCircle2 size={13} className="verified-check-icon" />
                  <span>Verified Purchase: {t.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

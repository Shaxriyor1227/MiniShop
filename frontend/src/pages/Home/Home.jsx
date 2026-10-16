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
  { name: 'Bose', style: 'font-extrabold tracking-widest uppercase' },
  { name: 'Dell', style: 'font-bold tracking-widest uppercase' },
  { name: 'Samsung', style: 'font-semibold tracking-wider uppercase' },
  { name: 'Keychron', style: 'font-semibold tracking-tight' },
  { name: 'Anker', style: 'font-bold tracking-wider uppercase' },
  { name: 'Logitech', style: 'font-medium tracking-tight lowercase' }
];

const newArrivalsData = [
  {
    tagKey: 'home.arr_tag3',
    defaultTag: 'CHRONO X',
    nameKey: 'home.arr_name3',
    defaultName: 'Minimal OLED Smartwatch',
    descKey: 'home.arr_desc3',
    defaultDesc: 'Grade 5 titanium chassis, sapphire crystal, and 7-day battery.',
    price: 420,
    img: '/images/stitch/smart_watch.webp',
    link: '/catalog?category=wearables'
  },
  {
    tagKey: 'home.arr_tag1',
    defaultTag: 'STUDIO AUDIO',
    nameKey: 'home.arr_name1',
    defaultName: 'Studio Wireless Pro',
    descKey: 'home.arr_desc1',
    defaultDesc: 'Hybrid Active Noise Cancellation with 40-hour endurance.',
    price: 540,
    img: '/images/stitch/audio_headphones.webp',
    link: '/catalog?category=audio'
  },
  {
    tagKey: 'home.arr_tag4',
    defaultTag: 'LIGHTING',
    nameKey: 'home.arr_name4',
    defaultName: 'Smart Desk Ambient Lamp',
    descKey: 'home.arr_desc4',
    defaultDesc: 'Circadian balanced light with precision aluminum touch dimmer.',
    price: 85,
    img: '/images/stitch/walnut_tray.webp',
    link: '/catalog?category=accessories'
  },
  {
    tagKey: 'home.arr_tag2',
    defaultTag: 'TACTILE GEAR',
    nameKey: 'home.arr_name2',
    defaultName: 'Ultra-Slim Mechanical Keyboard',
    descKey: 'home.arr_desc2',
    defaultDesc: 'Low-profile wireless mechanical deck with double-shot PBT.',
    price: 179,
    img: '/images/stitch/mechanical_kb.webp',
    link: '/catalog?category=workspace'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Lead UX Architect, San Francisco',
    avatar: 'SJ',
    avatarImg: '/images/avatars/sarah.webp',
    rating: 5,
    text: 'The Studio Wireless Pro headphones deliver acoustic clarity on par with studio monitors. Build quality feels like true Apple-tier craftsmanship.',
    product: 'Studio Wireless Pro Headphones'
  },
  {
    id: 2,
    name: 'Marcus Vance',
    role: 'Staff Software Engineer, Seattle',
    avatar: 'MV',
    avatarImg: '/images/avatars/marcus.webp',
    rating: 5,
    text: 'The mechanical keyboard and desk setup transformed my daily flow. Instant delivery, packaging was immaculate, and setup took under 30 seconds.',
    product: 'Ultra-Slim Mechanical Keyboard'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Creative Director, London',
    avatar: 'ER',
    avatarImg: '/images/avatars/elena.webp',
    rating: 5,
    text: 'MiniShop is my go-to for minimalist workspace tech. Clean aesthetic, zero bloat, and authentic hardware with rapid global shipping.',
    product: 'Minimal OLED Smartwatch Series X'
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'Hardware Architect, Austin',
    avatar: 'DC',
    avatarImg: '/images/avatars/david.webp',
    rating: 5,
    text: 'The 0.02mm CNC aluminum finish on the desk lamp is pure perfection. Touch sensor dimmer and circadian color balance work flawlessly.',
    product: 'Smart Desk Ambient Lamp'
  },
  {
    id: 5,
    name: 'Sophia Martinez',
    role: 'Sound Designer, Los Angeles',
    avatar: 'SM',
    avatarImg: '/images/avatars/sophia.webp',
    rating: 5,
    text: 'Spatial Audio 3D with low-latency AAC gives me seamless audio monitoring on the go. Super comfortable even after 8-hour mixing sessions.',
    product: 'Pro Wireless Earbuds Gen 2'
  },
  {
    id: 6,
    name: 'Liam Novak',
    role: 'Industrial Designer, Berlin',
    avatar: 'LN',
    avatarImg: '/images/avatars/liam.webp',
    rating: 5,
    text: 'The minimalist full-grain leather wallet and MagSafe charger have replaced all my bulky EDC gear. Exceptionally durable and timeless.',
    product: 'Minimalist Leather Card Wallet'
  }
];

const heroSlides = [
  {
    id: 1,
    image: '/images/hero/hero_slide_1.webp',
    titleKey: 'home.hero_title',
    descKey: 'home.hero_desc',
    badge: 'Flagship Display',
    spotlightBadge: 'FLAGSHIP',
    specBadge: '5K ULTRA-WIDE',
    productNameKey: 'home.hero_display_title',
    productDescKey: 'home.hero_display_sub',
    price: '$899.00',
    link: '/catalog?category=workspace'
  },
  {
    id: 2,
    image: '/images/hero/hero_slide_2.webp',
    titleKey: 'home.arr_name1',
    descKey: 'home.arr_desc1',
    badge: 'Studio Audio',
    spotlightBadge: 'BESTSELLER',
    specBadge: 'SPATIAL AUDIO',
    productNameKey: 'home.arr_name1',
    productDescKey: 'home.arr_desc1',
    price: '$349.99',
    link: '/catalog?category=audio'
  },
  {
    id: 3,
    image: '/images/hero/hero_slide_3.webp',
    titleKey: 'home.arr_name3',
    descKey: 'home.arr_desc3',
    badge: 'Titanium Chrono',
    spotlightBadge: 'NEW RELEASE',
    specBadge: 'SAPPHIRE GLASS',
    productNameKey: 'home.arr_name3',
    productDescKey: 'home.arr_desc3',
    price: '$420.00',
    link: '/catalog?category=wearables'
  },
  {
    id: 4,
    image: '/images/hero/hero_slide_4.webp',
    titleKey: 'home.arr_name2',
    descKey: 'home.arr_desc2',
    badge: 'Tactile Keyboard',
    spotlightBadge: 'CUSTOM RUN',
    specBadge: 'HOT-SWAP PBT',
    productNameKey: 'home.arr_name2',
    productDescKey: 'home.arr_desc2',
    price: '$179.00',
    link: '/catalog?category=workspace'
  }
];

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const arrivalsScrollRef = useRef(null);

  // 4 Rotating Hero Slides State (Continuous auto-advance)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-advance slides every 4.2 seconds continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Refresh & Mount Entrance Splash Animation
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFading(true);
    }, 850);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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

  // Scroll Reveal Animations Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const handleScrollArrivals = (direction) => {
    if (arrivalsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      arrivalsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`home-editorial-page page-enter ${showSplash ? 'is-entering' : ''}`}>
      {/* Refresh / Mount Splash Animation */}
      {showSplash && (
        <div
          className={`home-refresh-splash ${splashFading ? 'splash-fading' : ''}`}
          aria-hidden="true"
        >
          <div className="splash-ambient-glow" />
          <div className="splash-center-content">
            <div className="splash-icon-cluster">
              <div className="splash-pulse-halo" />
              <div className="splash-icon-disc">
                <Sparkles size={28} className="splash-sparkle-symbol" />
              </div>
            </div>
            <div className="splash-brand-text">
              <span className="splash-brand-title">MINISHOP</span>
              <span className="splash-brand-motto">Simple. Beautiful. Yours.</span>
            </div>
            <div className="splash-meter-track">
              <div className="splash-meter-fill" />
            </div>
          </div>
        </div>
      )}

      {/* 1. EDITORIAL HERO SECTION (IMMERSIVE BACKGROUND STAGE WITH 4 SLIDES) */}
      <section className="editorial-hero-section">
        <div className="container">
          <div className="hero-immersive-stage">
            {/* Cinematic 4-Slide Background Layers (Smooth Cross-fade & Ken Burns Pan) */}
            <div className="hero-stage-bg-layers">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`hero-slide-bg-layer ${currentSlideIndex === idx ? 'active' : ''}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                  aria-hidden={currentSlideIndex !== idx}
                />
              ))}
            </div>

            <div className="hero-stage-overlay" />

            {/* Dynamic 4-Slide Crossfade Content Decks */}
            <div className="hero-stage-content">
              {/* Left Column: Text Content Deck */}
              <div className="hero-stage-left">
                <div className="hero-stage-text-deck">
                  {heroSlides.map((slide, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <div
                        key={slide.id}
                        className={`hero-slide-text-item ${isActive ? 'active' : ''}`}
                        aria-hidden={!isActive}
                      >
                        <span className="hero-slide-category-pill">
                          <Sparkles size={13} className="hero-sparkle-icon" />
                          <span>{slide.badge}</span>
                        </span>

                        <h1 className="hero-display-headline">
                          {t(slide.titleKey)}
                        </h1>

                        <p className="hero-editorial-subtext">
                          {t(slide.descKey)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="hero-action-pills">
                  <Link to="/catalog" className="btn-primary hero-main-pill">
                    <span>{t('home.hero_cta')}</span>
                    <ArrowRight size={17} />
                  </Link>
                  <a href="#new-arrivals" className="hero-ghost-glass-link group">
                    <span>{t('home.hero_secondary')}</span>
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                {/* Inline Mini Trust Badges */}
                <div className="hero-stage-trust-row">
                  <div className="hero-mini-trust-item">
                    <CheckCircle2 size={15} className="text-blue" />
                    <span>{t('home.trust_original')}</span>
                  </div>
                  <div className="hero-mini-trust-item">
                    <Zap size={15} className="text-amber" />
                    <span>{t('home.trust_delivery')}</span>
                  </div>
                  <div className="hero-mini-trust-item">
                    <ShieldCheck size={15} className="text-green" />
                    <span>{t('home.trust_security')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Floating Product Spotlight Glass Widget Deck */}
              <div className="hero-stage-right">
                <div className="hero-spotlight-deck">
                  {heroSlides.map((slide, idx) => {
                    const isActive = currentSlideIndex === idx;
                    return (
                      <div
                        key={slide.id}
                        className={`hero-spotlight-glass-card ${isActive ? 'active' : ''}`}
                        aria-hidden={!isActive}
                      >
                        <div className="spotlight-card-header">
                          <span className="spotlight-badge">{slide.spotlightBadge}</span>
                          <span className="spotlight-spec-badge">{slide.specBadge}</span>
                        </div>

                        <div className="spotlight-card-body">
                          <h3 className="spotlight-product-name">{t(slide.productNameKey)}</h3>
                          <p className="spotlight-product-desc">{t(slide.productDescKey)}</p>
                          <div className="spotlight-pricing-row">
                            <span className="spotlight-price">{slide.price}</span>
                            <span className="spotlight-status-pill">In Stock</span>
                          </div>
                        </div>

                        <Link to={slide.link} className="spotlight-action-btn">
                          <span>{t('home.hero_cta')}</span>
                          <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Slide Navigation Dots & Arrows */}
            <div className="hero-stage-nav-bar">
              <div className="hero-stage-dots">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`hero-dot-btn ${currentSlideIndex === idx ? 'active' : ''}`}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Slide ${idx + 1}: ${slide.badge}`}
                  >
                    <span className="dot-label">{slide.badge}</span>
                    <span className="dot-indicator-bar" />
                  </button>
                ))}
              </div>

              <div className="hero-stage-arrows">
                <button
                  type="button"
                  className="hero-arrow-pill"
                  onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="hero-arrow-pill"
                  onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length)}
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERO TRUST INFORMATION STRIP */}
      <section className="editorial-trust-strip animate-on-scroll">
        <div className="container">
          <div className="trust-strip-inner">
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">{t('home.trust_original')}</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">{t('home.trust_delivery')}</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">{t('home.trust_rating')}</span>
            </div>
            <div className="trust-item">
              <span className="trust-dot"></span>
              <span className="trust-text">{t('home.trust_security')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND PARTNERS STRIP */}
      <section className="editorial-brands-section animate-on-scroll">
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
      <section className="editorial-collections-section animate-on-scroll">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">{t('home.collections_eyebrow')}</span>
              <h2 className="section-title-large">{t('home.collections_title')}</h2>
            </div>
            <Link to="/catalog" className="section-header-link">
              <span>{t('home.explore_all')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="collections-asymmetric-grid">
            {/* Audio (8 Columns) */}
            <Link to="/catalog?category=audio" className="collection-tile tile-audio">
              <picture>
                <source srcSet="/images/stitch/audio_headphones.webp" type="image/webp" />
                <img
                  src="/images/stitch/audio_headphones.png"
                  alt="Audio Collection"
                  className="tile-bg-img"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product_wireless_headphones.webp';
                  }}
                />
              </picture>
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">{t('home.col_audio_tag')}</span>
                <h3 className="tile-title">{t('home.col_audio_title')}</h3>
                <p className="tile-action-link">
                  <span>{t('home.col_audio_action')}</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Smart Watches (4 Columns) */}
            <Link to="/catalog?category=wearables" className="collection-tile tile-watches">
              <picture>
                <source srcSet="/images/stitch/smart_watch.webp" type="image/webp" />
                <img
                  src="/images/stitch/smart_watch.png"
                  alt="Smart Watches Collection"
                  className="tile-bg-img"
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product_smart_watch.webp';
                  }}
                />
              </picture>
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">{t('home.col_watches_tag')}</span>
                <h3 className="tile-title">{t('home.col_watches_title')}</h3>
                <p className="tile-action-link">
                  <span>{t('home.col_watches_action')}</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Workspace (6 Columns) */}
            <Link to="/catalog?category=workspace" className="collection-tile tile-workspace">
              <picture>
                <source srcSet="/images/stitch/workspace_setup.webp" type="image/webp" />
                <img
                  src="/images/stitch/workspace_setup.png"
                  alt="Workspace Collection"
                  className="tile-bg-img"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product_mechanical_keyboard.webp';
                  }}
                />
              </picture>
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">{t('home.col_workspace_tag')}</span>
                <h3 className="tile-title">{t('home.col_workspace_title')}</h3>
                <p className="tile-action-link">
                  <span>{t('home.col_workspace_action')}</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>

            {/* Accessories (6 Columns) */}
            <Link to="/catalog?category=accessories" className="collection-tile tile-accessories">
              <picture>
                <source srcSet="/images/stitch/accessories_flatlay.webp" type="image/webp" />
                <img
                  src="/images/stitch/accessories_flatlay.png"
                  alt="Accessories Collection"
                  className="tile-bg-img"
                  width="600"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product_desk_lamp.webp';
                  }}
                />
              </picture>
              <div className="tile-gradient-overlay"></div>
              <div className="tile-content">
                <span className="tile-micro-tag">{t('home.col_accessories_tag')}</span>
                <h3 className="tile-title">{t('home.col_accessories_title')}</h3>
                <p className="tile-action-link">
                  <span>{t('home.col_accessories_action')}</span>
                  <ArrowRight size={15} />
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED SPECIMEN SHOWCASE */}
      <section className="editorial-specimen-section animate-on-scroll">
        <div className="container">
          <div className="specimen-card card">
            <div className="specimen-visual-pane">
              <picture>
                <source srcSet="/images/stitch/audio_headphones.webp" type="image/webp" />
                <img
                  src="/images/stitch/audio_headphones.png"
                  alt="Acoustic Horizon One Specimen"
                  className="specimen-img"
                  width="500"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = '/images/product_wireless_headphones.webp';
                  }}
                />
              </picture>
            </div>

            <div className="specimen-info-pane">
              <span className="specimen-badge">{t('home.specimen_badge')}</span>
              <h2 className="specimen-headline">{t('home.specimen_title')}</h2>
              <p className="specimen-desc">
                {t('home.specimen_desc')}
              </p>

              {/* Technical 3-Column Specification Matrix */}
              <div className="specimen-tech-matrix">
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">{t('home.specimen_driver')}</span>
                  <span className="matrix-val">{t('home.specimen_driver_val')}</span>
                </div>
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">{t('home.specimen_freq')}</span>
                  <span className="matrix-val">{t('home.specimen_freq_val')}</span>
                </div>
                <div className="tech-matrix-col">
                  <span className="matrix-lbl">{t('home.specimen_weight')}</span>
                  <span className="matrix-val">{t('home.specimen_weight_val')}</span>
                </div>
              </div>

              <div className="specimen-action-row">
                <div className="specimen-price-box">
                  <span className="price-lbl">{t('home.specimen_price')}</span>
                  <span className="price-val">$499</span>
                </div>
                <Link to="/catalog?category=audio" className="btn-primary specimen-btn">
                  <span>{t('home.specimen_action')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. POPULAR RIGHT NOW PRODUCT GRID */}
      <section className="editorial-trending-section animate-on-scroll">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">{t('home.trending_eyebrow')}</span>
              <h2 className="section-title-large">{t('home.trending_title')}</h2>
            </div>
            <Link to="/catalog" className="section-header-link">
              <span>{t('home.trending_all')}</span>
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
      <section className="editorial-promo-banner-section animate-on-scroll">
        <div className="container">
          <div className="promo-monolith-card">
            <div className="promo-ambient-light"></div>
            <div className="promo-layout-grid">
              <div className="promo-text-side">
                <span className="promo-eyebrow">{t('home.promo_eyebrow')}</span>
                <h2 className="promo-headline">{t('home.promo_title')}</h2>
                <p className="promo-body">
                  {t('home.promo_desc')}
                </p>
                <div className="promo-btn-group">
                  <Link to="/catalog?category=workspace" className="btn-primary promo-pill-btn">
                    <span>{t('home.promo_cta')}</span>
                    <ArrowRight size={16} />
                  </Link>
                  <span className="promo-bundles-tag">{t('home.promo_bundle_tag')}</span>
                </div>
              </div>

              <div className="promo-visual-side">
                <picture>
                  <source srcSet="/images/stitch/workspace_setup.webp" type="image/webp" />
                  <img
                    src="/images/stitch/workspace_setup.png"
                    alt="Minimal Studio Workspace Architecture"
                    className="promo-visual-img"
                    width="600"
                    height="450"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hero_banner.webp';
                    }}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEW ARRIVALS HORIZONTAL SCROLL CAROUSEL */}
      <section className="editorial-arrivals-section animate-on-scroll" id="new-arrivals">
        <div className="container">
          <div className="section-title-header">
            <div>
              <span className="section-eyebrow">{t('home.arrivals_eyebrow')}</span>
              <h2 className="section-title-large">{t('home.arrivals_title')}</h2>
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
                    alt={t(item.nameKey, item.defaultName)}
                    className="arrival-img"
                    width="280"
                    height="280"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = '/images/product_placeholder.webp';
                    }}
                  />
                </div>
                <span className="arrival-tag">{t(item.tagKey, item.defaultTag)}</span>
                <h4 className="arrival-title">{t(item.nameKey, item.defaultName)}</h4>
                <p className="arrival-desc">{t(item.descKey, item.defaultDesc)}</p>
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
      <section className="editorial-reviews-section animate-on-scroll">
        <div className="container">
          <div className="section-title-header text-center-header">
            <span className="section-eyebrow">{t('home.reviews_badge')}</span>
            <h2 className="section-title-large">{t('home.reviews_title')}</h2>
            <p className="section-subtext-centered">{t('home.reviews_sub')}</p>
          </div>
        </div>

        <div className="reviews-marquee-container">
          <div className="reviews-marquee-track">
            {[...testimonials, ...testimonials].map((tItem, idx) => (
              <div key={`${tItem.id}-${idx}`} className="editorial-review-card card">
                <div className="review-rating-stars">
                  {[...Array(tItem.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#FFB800" color="#FFB800" />
                  ))}
                </div>
                <p className="review-quote-text">"{tItem.text}"</p>
                <div className="review-author-meta">
                  <div className="author-avatar-circle">
                    <img
                      src={tItem.avatarImg}
                      alt={tItem.name}
                      className="author-avatar-img"
                      width="44"
                      height="44"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="author-avatar-fallback" style={{ display: 'none' }}>
                      {tItem.avatar}
                    </div>
                  </div>
                  <div className="author-text-info">
                    <h5>{tItem.name}</h5>
                    <span>{tItem.role}</span>
                  </div>
                </div>
                <div className="review-verified-badge">
                  <CheckCircle2 size={13} className="verified-check" />
                  <span>{t('home.verified_purchase')}: {tItem.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FINAL MINIMALIST CALIBRATION CTA */}
      <section className="editorial-final-cta-section animate-on-scroll">
        <div className="final-cta-ambient-glow" aria-hidden="true" />
        <div className="container">
          <div className="final-cta-inner">
            <span className="final-cta-eyebrow">{t('home.final_cta_eyebrow')}</span>
            <h2 className="final-cta-headline">{t('home.final_cta_title')}</h2>
            <Link to="/catalog" className="btn-primary final-cta-pill">
              <span>{t('home.final_cta_btn')}</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

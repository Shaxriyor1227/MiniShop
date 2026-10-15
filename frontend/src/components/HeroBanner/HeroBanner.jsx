import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Zap, Star } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          {/* Ambient Lighting Glow Effect */}
          <div className="hero-ambient-glow"></div>

          {/* Left Content Column */}
          <div className="hero-content">
            <div className="hero-tag">
              <span className="hero-tag-dot"></span>
              <Sparkles size={13} className="hero-tag-icon" />
              <span>{t('home.hero_badge')}</span>
            </div>

            <h1 className="hero-headline">
              {t('home.hero_title')}
            </h1>

            <p className="hero-subtext">
              {t('home.hero_desc')}
            </p>

            <div className="hero-buttons">
              <Link to="/catalog" className="btn-primary hero-btn hero-btn-main">
                <span>{t('home.hero_cta')}</span>
                <ArrowRight size={16} className="hero-btn-arrow" />
              </Link>
              <Link to="/catalog?category=audio" className="btn-secondary hero-btn hero-btn-ghost">
                <span>{t('home.hero_secondary')}</span>
              </Link>
            </div>

            {/* Trust & Performance Metrics Strip */}
            <div className="hero-metrics-strip">
              <div className="hero-metric-item">
                <Truck size={14} className="metric-icon" />
                <span>{t('home.hero_express_delivery')}</span>
              </div>
              <div className="metric-divider">•</div>
              <div className="hero-metric-item">
                <ShieldCheck size={14} className="metric-icon" />
                <span>{t('home.hero_original')}</span>
              </div>
              <div className="metric-divider">•</div>
              <div className="hero-metric-item">
                <Star size={14} className="metric-icon gold" />
                <span>{t('home.hero_rating')}</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Column with Floating Glass Cards */}
          <div className="hero-image-wrapper">
            <div className="hero-visual-frame">
              <img
                src="/images/hero_banner.png"
                alt="MiniShop Premium Workspace Showcase"
                className="hero-image"
              />

              {/* Floating Glass Highlight 1 */}
              <div className="hero-floating-glass hero-float-top">
                <div className="float-icon-glow">
                  <Sparkles size={14} />
                </div>
                <div className="float-glass-info">
                  <span className="float-glass-title">{t('home.hero_display_title')}</span>
                  <span className="float-glass-desc">{t('home.hero_display_sub')}</span>
                </div>
              </div>

              {/* Floating Glass Highlight 2 */}
              <div className="hero-floating-glass hero-float-bottom">
                <div className="float-icon-glow tech">
                  <Zap size={14} />
                </div>
                <div className="float-glass-info">
                  <span className="float-glass-title">{t('home.hero_ecosystem_title')}</span>
                  <span className="float-glass-desc">{t('home.hero_ecosystem_sub')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

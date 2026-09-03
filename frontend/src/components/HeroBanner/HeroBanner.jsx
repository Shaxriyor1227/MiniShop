import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <section className="hero-banner-section">
      <div className="container">
        <div className="hero-banner-card">
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} />
              <span>New Collection 2026</span>
            </div>
            <h1 className="hero-headline">
              Simple. Beautiful.<br />
              <span className="gradient-text">Crafted for you.</span>
            </h1>
            <p className="hero-subtext">
              Elevate your lifestyle with next-generation minimalist audio, wearable tech, and premium workspace gear.
            </p>
            <div className="hero-buttons">
              <a href="#products-section" className="btn-primary hero-btn">
                Explore Catalog <ArrowRight size={16} />
              </a>
              <Link to="/?category=Audio" className="btn-secondary hero-btn">
                Audio Collection
              </Link>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src="/images/hero_banner.png"
              alt="MiniShop Premium Workspace"
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, ArrowRight, Sparkles, ShoppingBag, Tag, Headphones, Watch, Laptop } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import './SpotlightSearch.css';

const SpotlightSearch = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const quickCategories = [
    { name: t('nav.audio'), query: 'Audio', icon: Headphones },
    { name: t('nav.wearables'), query: 'Wearables', icon: Watch },
    { name: t('nav.workspace'), query: 'Workspace', icon: Laptop },
    { name: t('nav.deals'), query: 'Accessories', icon: Tag }
  ];

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/product/search?q=${encodeURIComponent(query.trim())}`);
        if (res.data.success) {
          setResults(res.data.innerData || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  const handleSelectCategory = (catQuery) => {
    navigate(`/catalog?category=${catQuery}`);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="spotlight-overlay" onClick={onClose}>
      <div className="spotlight-modal card" onClick={(e) => e.stopPropagation()}>
        {/* Search input header */}
        <form className="spotlight-input-row" onSubmit={handleSubmit}>
          <Search size={20} className="spotlight-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('catalog.search_input')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="spotlight-input"
          />
          {query && (
            <button type="button" className="spotlight-clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <span className="spotlight-esc-badge">ESC</span>
        </form>

        {/* Modal Body */}
        <div className="spotlight-body">
          {loading ? (
            <div className="spotlight-loading">
              <div className="loading-spinner"></div>
              <span>...</span>
            </div>
          ) : query.trim() ? (
            results.length > 0 ? (
              <div className="spotlight-results-section">
                <span className="spotlight-section-title">{t('catalog.count_products', { count: results.length })}</span>
                <div className="spotlight-results-list">
                  {results.map((prod) => (
                    <div
                      key={prod._id}
                      className="spotlight-product-item"
                      onClick={() => handleSelectProduct(prod._id)}
                    >
                      <img
                        src={prod.images?.[0] || '/images/product_placeholder.png'}
                        alt={prod.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/product_placeholder.png';
                        }}
                      />
                      <div className="spotlight-prod-info">
                        <span className="spotlight-prod-brand">{prod.brand_id?.name || 'MiniShop'}</span>
                        <h4 className="spotlight-prod-name">{prod.name}</h4>
                      </div>
                      <span className="spotlight-prod-price">${Number(prod.price).toFixed(2)}</span>
                      <ArrowRight size={14} className="spotlight-arrow" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="spotlight-no-results">
                <p>{t('catalog.empty_title')}</p>
                <span>{t('catalog.empty_desc')}</span>
              </div>
            )
          ) : (
            <div className="spotlight-default-view">
              <span className="spotlight-section-title">{t('home.categories_title')}</span>
              <div className="spotlight-categories-grid">
                {quickCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={idx}
                      className="spotlight-cat-btn"
                      onClick={() => handleSelectCategory(cat.query)}
                    >
                      <Icon size={18} className="cat-btn-icon" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="spotlight-tips-footer">
                <Sparkles size={14} />
                <span>Tip: <strong>Ctrl + K</strong> / <strong>⌘K</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpotlightSearch;

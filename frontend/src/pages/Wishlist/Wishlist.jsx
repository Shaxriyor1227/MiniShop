import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const { t } = useTranslation();
  const { products, count, clearWishlist } = useWishlist();

  if (count === 0) {
    return (
      <div className="wishlist-page page-enter">
        <div className="container">
          <div className="empty-wishlist-card card">
            <Heart size={64} className="empty-heart-icon" />
            <h2>{t('wishlist.empty_title')}</h2>
            <p>{t('wishlist.empty_desc')}</p>
            <Link to="/catalog" className="btn-primary">
              {t('wishlist.discover_products')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page page-enter">
      <div className="container">
        <div className="wishlist-header-row">
          <div>
            <h1 className="page-title">{t('wishlist.title')} ({count})</h1>
            <p className="page-subtitle">{t('wishlist.subtitle')}</p>
          </div>
          <button className="clear-wishlist-btn" onClick={clearWishlist}>
            <Trash2 size={16} /> {t('wishlist.clear_all')}
          </button>
        </div>

        <div className="wishlist-grid">
          {products.map((product) => {
            const prodObj = typeof product === 'object' ? product : { _id: product };
            return <ProductCard key={prodObj._id} product={prodObj} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

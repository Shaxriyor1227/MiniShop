import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import './Wishlist.css';

const Wishlist = () => {
  const { products, count, clearWishlist } = useWishlist();

  if (count === 0) {
    return (
      <div className="wishlist-page page-enter">
        <div className="container">
          <div className="empty-wishlist-card card">
            <Heart size={64} className="empty-heart-icon" />
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love by tapping the heart icon on any product card or detail page.</p>
            <Link to="/" className="btn-primary">
              Discover Products <ArrowRight size={16} />
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
            <h1 className="page-title">Saved Wishlist ({count})</h1>
            <p className="page-subtitle">Your favorite curated items saved for later</p>
          </div>
          <button className="clear-wishlist-btn" onClick={clearWishlist}>
            <Trash2 size={16} /> Clear Wishlist
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

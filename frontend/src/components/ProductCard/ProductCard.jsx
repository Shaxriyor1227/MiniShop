import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product._id);
  const imageUrl = product.images?.[0] || '/images/product_placeholder.png';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product);
  };

  return (
    <div className="product-card card">
      {/* Top badges & Wishlist */}
      <div className="card-top-bar">
        {product.stock <= 5 && product.stock > 0 ? (
          <span className="badge badge-amber">Stock: {product.stock}</span>
        ) : product.brand_id?.name ? (
          <span className="badge-brand">{product.brand_id.name}</span>
        ) : <span />}

        <button
          className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleWishlist}
          title={isLiked ? "Wishlist" : "Wishlist"}
        >
          <Heart size={18} fill={isLiked ? '#FF3B30' : 'none'} color={isLiked ? '#FF3B30' : '#1D1D1F'} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product._id}`} className="product-img-wrapper">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-img"
          onError={(e) => {
            e.currentTarget.src = '/images/product_placeholder.png';
          }}
        />
      </Link>

      {/* Details */}
      <div className="product-info">
        <span className="product-category">{product.category_id?.name || 'MiniShop'}</span>
        <Link to={`/product/${product._id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>

        <div className="product-bottom-row">
          <div className="product-pricing">
            <span className="product-price">${Number(product.price).toFixed(2)}</span>
          </div>

          <button
            className={`add-cart-btn ${addedAnimation ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title={product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
          >
            {addedAnimation ? (
              <>
                <Check size={16} /> {t('product.added')}
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useFormatters } from '../../utils/formatters';
import { getCategoryName, getBrandName } from '../../utils/i18nHelpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { formatPrice } = useFormatters();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLiked = isInWishlist(product?._id);
  const imageUrl = product?.images?.[0] || '/images/product_placeholder.png';

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const res = await addToCart(product, 1);
      if (res?.success) {
        setAddedAnimation(true);
        showToast(t('toast.cart_added', { name: product.name }), 'success');
        setTimeout(() => setAddedAnimation(false), 1500);
      } else {
        showToast(res?.message || t('toast.cart_error'), 'error');
      }
    },
    [addToCart, product, showToast, t]
  );

  const handleToggleWishlist = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const res = await toggleWishlist(product);
      if (res?.success) {
        if (res.isAdded) {
          showToast(t('toast.wishlist_added', { name: product.name }), 'info');
        } else {
          showToast(t('toast.wishlist_removed', { name: product.name }), 'info');
        }
      } else {
        showToast(res?.message || t('toast.generic_error'), 'error');
      }
    },
    [toggleWishlist, product, showToast, t]
  );

  if (!product) return null;

  const brandName = getBrandName(product.brand_id, t);
  const categoryName = getCategoryName(product.category_id, t) || 'MiniShop';

  return (
    <div className="product-card card">
      {/* Top badges & Wishlist */}
      <div className="card-top-bar">
        {product.stock <= 5 && product.stock > 0 ? (
          <span className="badge badge-amber">{t('product.stock_left', { count: product.stock })}</span>
        ) : brandName ? (
          <span className="badge-brand">{brandName}</span>
        ) : (
          <span />
        )}

        <button
          className={`wishlist-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleToggleWishlist}
          title={isLiked ? t('product.remove_wishlist') : t('product.add_wishlist')}
          aria-label={isLiked ? t('product.remove_wishlist') : t('product.add_wishlist')}
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
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/product_placeholder.png';
          }}
        />
      </Link>

      {/* Details */}
      <div className="product-info">
        <span className="product-category">{categoryName}</span>
        <Link to={`/product/${product._id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>

        <div className="product-bottom-row">
          <div className="product-pricing">
            <span className="product-price">{formatPrice(product.price)}</span>
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

export default memo(ProductCard);

import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useFormatters } from '../../utils/formatters';
import { getBrandName } from '../../utils/i18nHelpers';
import {
  Trash2,
  ArrowRight,
  Tag,
  ShoppingBag,
  Check,
  Truck,
  Heart,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { formatPrice } = useFormatters();
  const {
    items,
    subtotal,
    discountAmount,
    totalAmount,
    appliedCoupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = useCallback(async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponMsg({ text: '', isError: false });

    const result = await applyCoupon(couponCode.trim());
    if (result.success) {
      const msg = t('toast.coupon_applied', { discount: result.coupon.discount });
      setCouponMsg({ text: msg, isError: false });
      showToast(msg, 'success');
      setCouponCode('');
    } else {
      const err = result.message || t('toast.invalid_coupon');
      setCouponMsg({ text: err, isError: true });
      showToast(err, 'error');
    }
    setApplying(false);
  }, [applyCoupon, couponCode, showToast, t]);

  const handleMoveToWishlist = useCallback((product) => {
    const prodObj = product.product_id || product;
    const id = prodObj._id || prodObj.id;
    if (!isInWishlist(id)) {
      toggleWishlist(prodObj);
    }
    removeFromCart(id);
  }, [isInWishlist, toggleWishlist, removeFromCart]);

  const freeShippingThreshold = 100;
  const progressPercent = useMemo(
    () => Math.min(100, (subtotal / freeShippingThreshold) * 100),
    [subtotal]
  );
  const amountNeeded = useMemo(
    () => Math.max(0, freeShippingThreshold - subtotal),
    [subtotal]
  );
  const shipping = useMemo(
    () => (subtotal >= freeShippingThreshold ? 0 : 15),
    [subtotal]
  );
  const finalTotal = useMemo(
    () => totalAmount + shipping,
    [totalAmount, shipping]
  );

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <div className="empty-cart-card card">
            <picture>
              <source srcSet="/images/empty_cart.webp" type="image/webp" />
              <img
                src="/images/empty_cart.png"
                alt="Empty Cart"
                className="empty-cart-img"
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <h2>{t('cart.empty_title')}</h2>
            <p>{t('cart.empty_desc')}</p>
            <Link to="/catalog" className="btn-primary">
              {t('cart.go_shopping')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-card card">
          <div className="shipping-progress-text">
            <Truck size={20} className="truck-icon" />
            {progressPercent >= 100 ? (
              <span>{t('cart.free_shipping_active')}</span>
            ) : (
              <span>{t('cart.free_shipping_unlock', { amount: formatPrice(amountNeeded) })}</span>
            )}
          </div>
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="cart-header-row">
          <h1 className="page-title">{t('cart.title')} ({t('cart.count_items', { count: items.reduce((s, i) => s + i.quantity, 0) })})</h1>
          <button className="clear-cart-text-btn" onClick={clearCart}>
            <Trash2 size={16} /> {t('cart.clear_cart')}
          </button>
        </div>

        <div className="cart-layout-grid">
          {/* Items List */}
          <div className="cart-items-column">
            {items.map((item) => {
              const prod = item.product_id || {};
              const prodId = prod._id || prod.id;
              const imgUrl = (prod.images?.[0] || '/images/product_placeholder.png').replace(/\.(png|jpe?g)$/i, '.webp');

              return (
                <div key={prodId} className="cart-item-card card">
                  <Link to={`/product/${prodId}`} className="cart-item-img-link">
                    <img
                      src={imgUrl}
                      alt={prod.name}
                      width="80"
                      height="80"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.src = '/images/product_placeholder.webp';
                      }}
                    />
                  </Link>

                  <div className="cart-item-details">
                    <div className="item-meta-top">
                      <span className="item-brand">{prod.brand_id ? getBrandName(prod.brand_id, t) : t('nav.hardware_vault')}</span>
                      <div className="item-actions-top">
                        <button
                          className="item-action-link"
                          onClick={() => handleMoveToWishlist(item)}
                          title={t('product.add_wishlist')}
                        >
                          <Heart size={15} /> {t('nav.wishlist')}
                        </button>
                        <button
                          className="item-remove-btn"
                          onClick={() => removeFromCart(prodId)}
                          title={t('cart.remove_item')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <Link to={`/product/${prodId}`} className="item-name">
                      {prod.name}
                    </Link>

                    <div className="item-bottom-row">
                      <div className="item-qty-control">
                        <button onClick={() => updateQuantity(prodId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(prodId, item.quantity + 1)}>+</button>
                      </div>

                      <div className="item-price-col">
                        <span className="unit-price">{formatPrice(prod.price || 0)}</span>
                        <span className="total-item-price">
                          {formatPrice((prod.price || 0) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary & Coupon */}
          <div className="cart-summary-column">
            {/* Coupon Box */}
            <div className="coupon-box card">
              <h4>
                <Tag size={16} /> {t('cart.promo_code')}
              </h4>
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <span>
                    <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discount}%)
                  </span>
                  <button onClick={removeCoupon}>✕</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder={t('cart.promo_placeholder')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn-secondary" disabled={applying}>
                    {applying ? '...' : t('cart.apply')}
                  </button>
                </form>
              )}
              {couponMsg.text && (
                <p className={`coupon-feedback ${couponMsg.isError ? 'error' : 'success'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Summary Card */}
            <div className="order-summary-card card">
              <h3 className="summary-title">{t('cart.order_summary')}</h3>

              <div className="summary-row">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>{t('cart.discount')} ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>{t('cart.shipping')}</span>
                <span>{shipping === 0 ? <strong className="free-ship">{t('cart.free')}</strong> : formatPrice(shipping)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>

              <button
                className="btn-primary checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                {t('cart.checkout_btn')} <ArrowRight size={16} />
              </button>

              <div className="cart-trust-badges">
                <div className="trust-badge-row">
                  <ShieldCheck size={16} className="trust-icon" />
                  <span>{t('cart.secure_checkout')}</span>
                </div>
                <div className="trust-badge-row">
                  <RotateCcw size={16} className="trust-icon" />
                  <span>{t('product.free_return')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

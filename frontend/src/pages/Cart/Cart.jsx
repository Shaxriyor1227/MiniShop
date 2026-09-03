import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
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

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    setCouponMsg({ text: '', isError: false });

    const result = await applyCoupon(couponCode.trim());
    if (result.success) {
      setCouponMsg({ text: `Coupon applied! -${result.coupon.discount}%`, isError: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: result.message || 'Invalid coupon code', isError: true });
    }
    setApplying(false);
  };

  const handleMoveToWishlist = (product) => {
    const prodObj = product.product_id || product;
    if (!isInWishlist(prodObj._id || prodObj.id)) {
      toggleWishlist(prodObj);
    }
    removeFromCart(prodObj._id || prodObj.id);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <div className="empty-cart-card card">
            <img src="/images/empty_cart.png" alt="Empty Cart" className="empty-cart-img" />
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything yet. Discover our premium collection and find something you'll love.</p>
            <Link to="/" className="btn-primary">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const shipping = subtotal >= freeShippingThreshold ? 0 : 15;
  const finalTotal = totalAmount + shipping;

  return (
    <div className="cart-page page-enter">
      <div className="container">
        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-card card">
          <div className="shipping-progress-text">
            <Truck size={20} className="truck-icon" />
            {progressPercent >= 100 ? (
              <span>🎉 Congratulations! You have unlocked <strong>FREE Express Shipping</strong></span>
            ) : (
              <span>Add <strong>${amountNeeded.toFixed(2)}</strong> more to unlock <strong>FREE Express Shipping</strong></span>
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
          <h1 className="page-title">Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})</h1>
          <button className="clear-cart-text-btn" onClick={clearCart}>
            <Trash2 size={16} /> Clear Bag
          </button>
        </div>

        <div className="cart-layout-grid">
          {/* Items List */}
          <div className="cart-items-column">
            {items.map((item) => {
              const prod = item.product_id || {};
              const prodId = prod._id || prod.id;
              const imgUrl = prod.images?.[0] || '/images/product_placeholder.png';

              return (
                <div key={prodId} className="cart-item-card card">
                  <Link to={`/product/${prodId}`} className="cart-item-img-link">
                    <img
                      src={imgUrl}
                      alt={prod.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/product_placeholder.png';
                      }}
                    />
                  </Link>

                  <div className="cart-item-details">
                    <div className="item-meta-top">
                      <span className="item-brand">{prod.brand_id?.name || 'MiniShop'}</span>
                      <div className="item-actions-top">
                        <button
                          className="item-action-link"
                          onClick={() => handleMoveToWishlist(item)}
                          title="Move to Wishlist"
                        >
                          <Heart size={15} /> Save for later
                        </button>
                        <button
                          className="item-remove-btn"
                          onClick={() => removeFromCart(prodId)}
                          title="Remove item"
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
                        <span className="unit-price">${Number(prod.price || 0).toFixed(2)} each</span>
                        <span className="total-item-price">
                          ${(Number(prod.price || 0) * item.quantity).toFixed(2)}
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
                <Tag size={16} /> Promo Code / Coupon
              </h4>
              {appliedCoupon ? (
                <div className="applied-coupon-pill">
                  <span>
                    <strong>{appliedCoupon.code}</strong> (-{appliedCoupon.discount}%)
                  </span>
                  <button onClick={removeCoupon}>Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit" className="btn-secondary" disabled={applying}>
                    {applying ? '...' : 'Apply'}
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
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong className="free-ship">Free</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Estimated Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn-primary checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="cart-trust-badges">
                <div className="trust-badge-row">
                  <ShieldCheck size={16} className="trust-icon" />
                  <span>256-bit SSL encrypted secure payment</span>
                </div>
                <div className="trust-badge-row">
                  <RotateCcw size={16} className="trust-icon" />
                  <span>14-day hassle-free returns & refunds</span>
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

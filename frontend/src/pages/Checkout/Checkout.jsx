import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, ArrowLeft } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, discountAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // New address form modal state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await axiosInstance.get('/address/getAll');
        if (res.data.success && res.data.innerData.length > 0) {
          setAddresses(res.data.innerData);
          const def = res.data.innerData.find((a) => a.is_default);
          setSelectedAddressId(def ? def._id : res.data.innerData[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!city.trim() || !street.trim()) return;

    try {
      const res = await axiosInstance.post('/address/create', {
        city: city.trim(),
        street: street.trim(),
        is_default: addresses.length === 0
      });
      if (res.data.success) {
        const newAddr = res.data.innerData;
        setAddresses([newAddr, ...addresses]);
        setSelectedAddressId(newAddr._id);
        setShowAddressForm(false);
        setCity('');
        setStreet('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setErrorMsg('Please select or add a delivery address.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');

      const orderPayload = {
        address_id: selectedAddressId,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: item.product_id._id || item.product_id.id || item.product_id,
          quantity: item.quantity,
          price: item.product_id.price
        }))
      };

      const res = await axiosInstance.post('/order/create', orderPayload);
      if (res.data.success) {
        setOrderSuccess(res.data.innerData);
        clearCart();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-page page-enter">
        <div className="container">
          <div className="order-success-card card">
            <CheckCircle2 size={64} className="success-icon" />
            <h2>Order Placed Successfully!</h2>
            <p className="order-num-text">
              Order ID: <strong>#{orderSuccess._id.slice(-8)}</strong>
            </p>
            <p className="order-desc-text">
              We've received your order. You can track your shipment and view full receipt in "My Orders".
            </p>
            <div className="success-buttons">
              <Link to="/orders" className="btn-primary">
                View My Orders
              </Link>
              <Link to="/" className="btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page page-enter">
        <div className="container empty-checkout-wrap">
          <h2>Your Cart is Empty</h2>
          <p>Add items to your cart before proceeding to checkout.</p>
          <Link to="/" className="btn-primary">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal > 100 ? 0 : 15;
  const finalTotal = totalAmount + shipping;

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="page-title">Checkout</h1>

        {errorMsg && <div className="checkout-error-banner">{errorMsg}</div>}

        <div className="checkout-grid">
          {/* Left Column: Delivery & Payment Details */}
          <div className="checkout-form-col">
            {/* 1. Address Section */}
            <div className="checkout-step-card card">
              <div className="step-header">
                <div className="step-num">1</div>
                <h3>Delivery Address</h3>
                <button
                  className="add-address-btn"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  <Plus size={16} /> Add Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddNewAddress} className="new-address-form">
                  <input
                    type="text"
                    placeholder="City / State (e.g. San Francisco, CA)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Street address, Apt, Suite"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="input-field"
                  />
                  <div className="address-form-btns">
                    <button type="submit" className="btn-primary">
                      Save Address
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !showAddressForm ? (
                <p className="no-address-text">
                  No saved addresses found. Please add your delivery address.
                </p>
              ) : (
                <div className="address-options-list">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`address-option-label ${selectedAddressId === addr._id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />
                      <div className="address-details">
                        <div className="addr-top">
                          <MapPin size={16} />
                          <strong>{addr.city}</strong>
                          {addr.is_default && <span className="default-badge">Default</span>}
                        </div>
                        <p className="addr-street">{addr.street}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="checkout-step-card card">
              <div className="step-header">
                <div className="step-num">2</div>
                <h3>Payment Method</h3>
              </div>

              <div className="payment-options-grid">
                {[
                  { id: 'Credit Card', label: 'Credit / Debit Card (Visa, Mastercard, Amex)' },
                  { id: 'Apple Pay / Google Pay', label: 'Apple Pay / Google Pay' },
                  { id: 'Cash On Delivery', label: 'Cash on Delivery (Pay upon arrival)' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                    />
                    <CreditCard size={18} />
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Review */}
          <div className="checkout-summary-col">
            <div className="checkout-summary-card card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="checkout-items-list">
                {items.map((item) => {
                  const prod = item.product_id;
                  return (
                    <div key={prod._id || prod.id} className="checkout-item-row">
                      <img
                        src={prod.images?.[0] || '/images/product_placeholder.png'}
                        alt={prod.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/product_placeholder.png';
                        }}
                      />
                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{prod.name}</p>
                        <span className="checkout-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="checkout-item-price">
                        ${(Number(prod.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="summary-divider"></div>

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
                <span>Total Amount</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <button
                className="btn-accent confirm-order-btn"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? 'Processing Order...' : 'Place Order Now'}
              </button>

              <div className="security-guarantee">
                <ShieldCheck size={16} />
                <span>256-bit SSL encrypted secure transaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

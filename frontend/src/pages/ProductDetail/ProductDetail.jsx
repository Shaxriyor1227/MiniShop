import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFormatters } from '../../utils/formatters';
import { getCategoryName, getBrandName } from '../../utils/i18nHelpers';
import {
  Heart,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ArrowLeft,
  Clock,
  Zap,
  Package,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductDetail.css';

const colorOptions = [
  { name: 'Space Gray', hex: '#2C2C2E' },
  { name: 'Silver Titanium', hex: '#E5E5EA' },
  { name: 'Midnight Blue', hex: '#1B2A4A' },
  { name: 'Starlight Gold', hex: '#E8D8C8' }
];

const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { formatPrice, formatDate } = useFormatters();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [activeSpecTab, setActiveSpecTab] = useState('specs');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes, allProdsRes] = await Promise.all([
          axiosInstance.get(`/product/getById/${id}`),
          axiosInstance.get(`/review/getAll?product_id=${id}`),
          axiosInstance.get('/product/getAll')
        ]);

        if (prodRes.data.success) setProduct(prodRes.data.innerData);
        if (revRes.data.success) setReviews(revRes.data.innerData);
        if (allProdsRes.data.success) {
          // Filter out current product
          const others = allProdsRes.data.innerData.filter((p) => p._id !== id).slice(0, 3);
          setRelatedProducts(others);
        }
      } catch (err) {
        console.error('[ProductDetail Error]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    const res = await addToCart(product, quantity);
    if (res?.success) {
      setAdded(true);
      showToast(t('toast.cart_added', { name: `${quantity}x ${product.name}` }), 'success');
      setTimeout(() => setAdded(false), 2000);
    } else {
      showToast(res?.message || t('toast.cart_error'), 'error');
    }
  }, [product, addToCart, quantity, showToast, t]);

  const handleToggleWishlist = useCallback(async () => {
    if (!product) return;
    const res = await toggleWishlist(product);
    if (res?.success) {
      showToast(
        res.isAdded
          ? t('toast.wishlist_added', { name: product.name })
          : t('toast.wishlist_removed', { name: product.name }),
        'info'
      );
    }
  }, [product, toggleWishlist, showToast, t]);

  const handleReviewSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    try {
      setReviewSubmitting(true);
      setReviewError('');
      const res = await axiosInstance.post('/review/create', {
        product_id: id,
        rating: Number(rating),
        comment
      });
      if (res.data.success) {
        setReviews((prev) => [res.data.innerData, ...prev]);
        setComment('');
        setRating(5);
        showToast(t('toast.review_submitted'), 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || t('toast.review_error');
      setReviewError(msg);
      showToast(msg, 'error');
    } finally {
      setReviewSubmitting(false);
    }
  }, [isAuthenticated, id, rating, comment, showToast, t]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return '5.0';
    return (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  if (loading) {
    return (
      <div className="product-detail-page page-enter">
        <div className="container">
          <div className="breadcrumb-nav shimmer" style={{ width: '220px', height: '18px', borderRadius: '4px', marginBottom: '28px' }} />
          <div className="product-detail-grid">
            <div className="product-gallery card shimmer" style={{ height: '480px', borderRadius: '16px' }} />
            <div className="product-buy-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="shimmer" style={{ width: '110px', height: '24px', borderRadius: '12px' }} />
              <div className="shimmer" style={{ width: '85%', height: '38px', borderRadius: '6px' }} />
              <div className="shimmer" style={{ width: '45%', height: '28px', borderRadius: '6px' }} />
              <div className="shimmer" style={{ width: '100%', height: '90px', borderRadius: '8px', marginTop: '8px' }} />
              <div className="shimmer" style={{ width: '100%', height: '52px', borderRadius: '26px', marginTop: '20px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container not-found-wrapper">
        <h2>{t('product.not_found')}</h2>
        <Link to="/catalog" className="btn-primary">
          <ArrowLeft size={16} /> {t('product.back_to_catalog')}
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const imageUrl = product.images?.[0] || '/images/product_placeholder.png';

  return (
    <div className="product-detail-page page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/">{t('catalog.breadcrumb_home')}</Link>
          <span>/</span>
          <Link to={`/catalog?category=${product.category_id?.slug || product.category_id?._id || ''}`}>
            {product.category_id ? getCategoryName(product.category_id, t) : t('nav.catalog')}
          </Link>
          <span>/</span>
          <span className="current-crumb">{product.name}</span>
        </div>

        {/* Main Product Layout */}
        <div className="product-detail-grid">
          {/* Gallery View */}
          <div className="product-gallery card">
            <div className="main-image-frame">
              <img
                src={imageUrl}
                alt={product.name}
                className="main-detail-img"
                width="540"
                height="540"
                loading="eager"
                decoding="async"
                fetchpriority="high"
                onError={(e) => {
                  e.currentTarget.src = '/images/product_placeholder.webp';
                }}
              />
            </div>
            <div className="gallery-color-indicator">
              <span>{t('product.select_color')} <strong>{selectedColor.name}</strong></span>
            </div>
          </div>

          {/* Info & Buy Panel */}
          <div className="product-buy-panel">
            <div className="detail-brand-badge">
              {product.brand_id ? getBrandName(product.brand_id, t) : t('nav.hardware_vault')}
            </div>
            <h1 className="detail-product-title">{product.name}</h1>

            <div className="detail-rating-row">
              <div className="stars-group">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(Number(averageRating)) ? '#FFB800' : 'none'}
                    color={s <= Math.round(Number(averageRating)) ? '#FFB800' : '#D2D2D7'}
                  />
                ))}
              </div>
              <span className="rating-num">{averageRating}</span>
              <span className="rating-count">({reviews.length} {t('product.reviews_tab', { count: reviews.length })})</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price">{formatPrice(product.price)}</span>
              <span className={`detail-stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? t('product.stock_left', { count: product.stock }) : t('product.out_of_stock')}
              </span>
            </div>

            {/* Live Scarcity & Fast Delivery Indicator */}
            <div className="delivery-urgency-banner">
              <Clock size={16} className="clock-blue" />
              <span>{t('footer.benefit1_title')} — <strong>{t('footer.benefit1_sub')}</strong></span>
            </div>

            <div className="detail-divider"></div>

            {/* Color Swatches */}
            <div className="swatch-section">
              <span className="swatch-title">{t('product.select_color')} <strong>{selectedColor.name}</strong></span>
              <div className="color-swatches-grid">
                {colorOptions.map((c, i) => (
                  <button
                    key={i}
                    className={`color-swatch-circle ${selectedColor.name === c.name ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                  >
                    {selectedColor.name === c.name && <Check size={14} color={c.hex === '#E5E5EA' || c.hex === '#E8D8C8' ? '#1D1D1F' : '#FFF'} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <span className="qty-label">{t('product.quantity')}</span>
              <div className="qty-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="detail-action-buttons">
              <button
                className={`btn-primary detail-add-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? (
                  <>
                    <Check size={18} /> {t('product.added')}
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> {product.stock === 0 ? t('product.out_of_stock') : t('product.add_to_cart')}
                  </>
                )}
              </button>

              <button
                className={`btn-secondary detail-wish-btn ${isLiked ? 'liked' : ''}`}
                onClick={handleToggleWishlist}
                title={isLiked ? t('product.remove_wishlist') : t('product.add_wishlist')}
              >
                <Heart size={20} fill={isLiked ? '#FF3B30' : 'none'} color={isLiked ? '#FF3B30' : '#1D1D1F'} />
              </button>
            </div>

            {/* Quality Assurance perks */}
            <div className="detail-perks-list">
              <div className="perk-row">
                <Truck size={18} className="perk-icon" />
                <span>{t('product.free_shipping')}</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={18} className="perk-icon" />
                <span>{t('product.official_warranty')}</span>
              </div>
              <div className="perk-row">
                <RotateCcw size={18} className="perk-icon" />
                <span>{t('product.free_return')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Tabs */}
        <div className="product-specs-section card">
          <div className="specs-tab-header">
            <button
              className={`spec-tab-btn ${activeSpecTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveSpecTab('specs')}
            >
              <Cpu size={16} /> {t('product.specs_tab')}
            </button>
            <button
              className={`spec-tab-btn ${activeSpecTab === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveSpecTab('inbox')}
            >
              <Package size={16} /> {t('product.box_tab')}
            </button>
          </div>

          <div className="specs-content-area">
            {activeSpecTab === 'specs' ? (
              <div className="specs-table">
                <div className="spec-row">
                  <span className="spec-name">Acoustic Driver / Processor</span>
                  <span className="spec-val">Custom 40mm Neodymium with Low-Distortion Architecture</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Connectivity</span>
                  <span className="spec-val">Bluetooth 5.3 + Multi-Device Fast Pairing (AAC, LDAC, SBC)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Battery Life</span>
                  <span className="spec-val">Up to 40 Hours with ANC Active (Fast Charge: 10m = 5 hrs)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Materials</span>
                  <span className="spec-val">Precision Anodized Aluminum, Memory Foam & Breathable Knit</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Weight</span>
                  <span className="spec-val">245 grams (Ultra-light ergonomic balance)</span>
                </div>
              </div>
            ) : (
              <div className="inbox-list-grid">
                <div className="inbox-item">
                  <Package size={18} className="inbox-icon" />
                  <div>
                    <h5>1x {product.name}</h5>
                    <p>Authentic hardware in original protective sleeve</p>
                  </div>
                </div>
                <div className="inbox-item">
                  <Zap size={18} className="inbox-icon" />
                  <div>
                    <h5>1x Braided USB-C Fast Charging Cable</h5>
                    <p>1.5m Kevlar-reinforced tangle-free cord</p>
                  </div>
                </div>
                <div className="inbox-item">
                  <ShieldCheck size={18} className="inbox-icon" />
                  <div>
                    <h5>1x MiniShop Warranty & User Guide</h5>
                    <p>Official certificate and serial number documentation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="product-reviews-section card">
          <div className="reviews-header">
            <h3>{t('product.reviews_tab', { count: reviews.length })}</h3>
            <span className="reviews-avg-badge">{t('product.rating_val', { val: averageRating })}</span>
          </div>

          {/* Add Review Form */}
          {isAuthenticated ? (
            <form className="add-review-box" onSubmit={handleReviewSubmit}>
              <h4>{t('product.write_review')}</h4>
              {reviewError && <p className="review-err-msg">{reviewError}</p>}
              <div className="rating-select-row">
                <span>{t('product.your_rating')}</span>
                <div className="stars-input">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      className="star-btn"
                    >
                      <Star
                        size={22}
                        fill={starVal <= rating ? '#FFB800' : 'none'}
                        color={starVal <= rating ? '#FFB800' : '#D2D2D7'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="input-field review-textarea"
                placeholder={t('product.review_placeholder')}
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button type="submit" className="btn-primary" disabled={reviewSubmitting}>
                {reviewSubmitting ? '...' : t('product.write_review')}
              </button>
            </form>
          ) : (
            <div className="login-to-review-box">
              <p>{t('product.login_to_review')}</p>
              <Link to="/login" className="btn-secondary">
                {t('nav.login')}
              </Link>
            </div>
          )}

          {/* Review List */}
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews-text">{t('product.no_reviews')}</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="review-card">
                  <div className="review-user-row">
                    <div className="rev-avatar">{rev.user_id?.name?.charAt(0) || 'U'}</div>
                    <div>
                      <h5 className="rev-username">{rev.user_id?.name || t('product.verified_buyer')}</h5>
                      <span className="rev-date">{formatDate(rev.createdAt)}</span>
                    </div>
                    <div className="rev-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= rev.rating ? '#FFB800' : 'none'}
                          color={s <= rev.rating ? '#FFB800' : '#D2D2D7'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="rev-comment">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Frequently Bought Together / Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <div className="related-header">
              <h3>{t('product.similar_products')}</h3>
            </div>
            <div className="related-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

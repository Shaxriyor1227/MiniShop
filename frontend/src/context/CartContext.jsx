import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getItemProductId = (item) => {
  if (!item) return null;
  const p = item.product_id;
  if (!p) return null;
  if (typeof p === 'string') return p;
  return p._id || p.id || null;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Fetch cart from backend when user is logged in
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get('/cart/getAll');
      if (res.data.success && res.data.innerData?.items) {
        setItems(res.data.innerData.items);
      }
    } catch (err) {
      console.error('[CartContext Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync on login / load guest cart
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      const saved = localStorage.getItem('minishop_guest_cart');
      if (saved) {
        try {
          const guestItems = JSON.parse(saved);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            (async () => {
              for (const it of guestItems) {
                const prodId = getItemProductId(it);
                if (prodId) {
                  try {
                    await axiosInstance.post('/cart/create', {
                      product_id: prodId,
                      quantity: it.quantity || 1
                    });
                  } catch (e) {
                    // silently catch sync error
                  }
                }
              }
              localStorage.removeItem('minishop_guest_cart');
              if (isMounted) fetchCart();
            })();
            return;
          }
        } catch {
          localStorage.removeItem('minishop_guest_cart');
        }
      }
      fetchCart();
    } else {
      const saved = localStorage.getItem('minishop_guest_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('minishop_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      if (!product) return { success: false, message: 'Invalid product' };
      const prodId = product._id || product.id;

      if (isAuthenticated) {
        try {
          const res = await axiosInstance.post('/cart/create', {
            product_id: prodId,
            quantity
          });
          if (res.data.success && res.data.innerData?.items) {
            setItems(res.data.innerData.items);
            return { success: true };
          }
          return { success: false, message: res.data.message };
        } catch (err) {
          return { success: false, message: err.response?.data?.message || 'Failed to add item to cart' };
        }
      } else {
        // Guest mode
        setItems((prev) => {
          const targetStr = prodId.toString();
          const exists = prev.find((item) => {
            const id = getItemProductId(item);
            return id && id.toString() === targetStr;
          });

          if (exists) {
            return prev.map((item) => {
              const id = getItemProductId(item);
              return id && id.toString() === targetStr
                ? { ...item, quantity: item.quantity + quantity }
                : item;
            });
          }
          return [...prev, { product_id: product, quantity }];
        });
        return { success: true };
      }
    },
    [isAuthenticated]
  );

  const updateQuantity = useCallback(
    async (productId, quantity) => {
      if (!productId) return;
      const targetStr = productId.toString();

      if (isAuthenticated) {
        try {
          const res = await axiosInstance.put('/cart/update', {
            product_id: productId,
            quantity
          });
          if (res.data.success && res.data.innerData?.items) {
            setItems(res.data.innerData.items);
          }
        } catch (err) {
          console.error('[Cart Update Error]:', err);
        }
      } else {
        if (quantity <= 0) {
          setItems((prev) =>
            prev.filter((item) => {
              const id = getItemProductId(item);
              return id && id.toString() !== targetStr;
            })
          );
        } else {
          setItems((prev) =>
            prev.map((item) => {
              const id = getItemProductId(item);
              return id && id.toString() === targetStr
                ? { ...item, quantity }
                : item;
            })
          );
        }
      }
    },
    [isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (!productId) return;
      const targetStr = productId.toString();

      if (isAuthenticated) {
        try {
          const res = await axiosInstance.delete(`/cart/delete/${productId}`);
          if (res.data.success && res.data.innerData?.items) {
            setItems(res.data.innerData.items);
          }
        } catch (err) {
          console.error('[Cart Remove Error]:', err);
        }
      } else {
        setItems((prev) =>
          prev.filter((item) => {
            const id = getItemProductId(item);
            return id && id.toString() !== targetStr;
          })
        );
      }
    },
    [isAuthenticated]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await axiosInstance.delete('/cart/clear');
      } catch (err) {
        console.error('[Cart Clear Error]:', err);
      }
    }
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('minishop_guest_cart');
  }, [isAuthenticated]);

  const applyCoupon = useCallback(async (code) => {
    try {
      const res = await axiosInstance.post('/coupon/apply', { code });
      if (res.data.success) {
        setAppliedCoupon(res.data.innerData);
        return { success: true, coupon: res.data.innerData };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid or expired coupon'
      };
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // Optimized Calculations with useMemo
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const price = item.product_id?.price || 0;
        return sum + price * (item.quantity || 0);
      }, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0),
    [appliedCoupon, subtotal]
  );

  const totalAmount = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  const value = useMemo(
    () => ({
      items,
      loading,
      itemCount,
      subtotal,
      discountAmount,
      totalAmount,
      appliedCoupon,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      fetchCart
    }),
    [
      items,
      loading,
      itemCount,
      subtotal,
      discountAmount,
      totalAmount,
      appliedCoupon,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      fetchCart
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

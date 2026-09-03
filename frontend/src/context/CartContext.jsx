import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const CartContext = createContext();

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load guest cart from local storage if not logged in
      const saved = localStorage.getItem('minishop_guest_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      }
    }
  }, [isAuthenticated, fetchCart]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('minishop_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const res = await axiosInstance.post('/cart/create', {
          product_id: product._id || product.id,
          quantity
        });
        if (res.data.success && res.data.innerData?.items) {
          setItems(res.data.innerData.items);
          return { success: true };
        }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to add item to cart' };
      }
    } else {
      // Guest mode
      setItems((prev) => {
        const prodId = product._id || product.id;
        const exists = prev.find((item) => (item.product_id?._id || item.product_id) === prodId);
        if (exists) {
          return prev.map((item) =>
            (item.product_id?._id || item.product_id) === prodId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product_id: product, quantity }];
      });
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
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
        console.error(err);
      }
    } else {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        setItems((prev) =>
          prev.map((item) =>
            (item.product_id?._id || item.product_id) === productId
              ? { ...item, quantity }
              : item
          )
        );
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await axiosInstance.delete(`/cart/delete/${productId}`);
        if (res.data.success && res.data.innerData?.items) {
          setItems(res.data.innerData.items);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setItems((prev) =>
        prev.filter((item) => (item.product_id?._id || item.product_id) !== productId)
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await axiosInstance.delete('/cart/clear');
      } catch (err) {
        console.error(err);
      }
    }
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem('minishop_guest_cart');
  };

  const applyCoupon = async (code) => {
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
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product_id?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

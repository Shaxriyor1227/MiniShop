import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get('/wishlist/getAll');
      if (res.data.success && res.data.innerData?.products) {
        setProducts(res.data.innerData.products);
      }
    } catch (err) {
      console.error('[WishlistContext Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('minishop_guest_wishlist');
      if (saved) {
        try {
          setProducts(JSON.parse(saved));
        } catch {
          setProducts([]);
        }
      }
    }
  }, [isAuthenticated, fetchWishlist]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('minishop_guest_wishlist', JSON.stringify(products));
    }
  }, [products, isAuthenticated]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return products.some((p) => (p._id || p.id || p) === productId);
  };

  const toggleWishlist = async (product) => {
    const prodId = product._id || product.id;
    if (isAuthenticated) {
      try {
        const res = await axiosInstance.post('/wishlist/toggle', { product_id: prodId });
        if (res.data.success) {
          if (res.data.innerData?.wishlist?.products) {
            setProducts(res.data.innerData.wishlist.products);
          }
          return { success: true, isAdded: res.data.innerData.isAdded };
        }
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Xatolik' };
      }
    } else {
      // Guest mode
      const exists = isInWishlist(prodId);
      if (exists) {
        setProducts((prev) => prev.filter((p) => (p._id || p.id || p) !== prodId));
        return { success: true, isAdded: false };
      } else {
        setProducts((prev) => [...prev, product]);
        return { success: true, isAdded: true };
      }
    }
  };

  const clearWishlist = async () => {
    if (isAuthenticated) {
      try {
        await axiosInstance.delete('/wishlist/clear');
      } catch (err) {
        console.error(err);
      }
    }
    setProducts([]);
    localStorage.removeItem('minishop_guest_wishlist');
  };

  return (
    <WishlistContext.Provider
      value={{
        products,
        loading,
        count: products.length,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

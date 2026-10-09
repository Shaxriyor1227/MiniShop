import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

const getProductId = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return item;
  return item._id || item.id || null;
};

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

  // Sync on auth change (and merge guest wishlist)
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      const saved = localStorage.getItem('minishop_guest_wishlist');
      if (saved) {
        try {
          const guestItems = JSON.parse(saved);
          if (Array.isArray(guestItems) && guestItems.length > 0) {
            (async () => {
              for (const item of guestItems) {
                const prodId = getProductId(item);
                if (prodId) {
                  try {
                    await axiosInstance.post('/wishlist/toggle', { product_id: prodId });
                  } catch (e) {
                    // silently catch sync error
                  }
                }
              }
              localStorage.removeItem('minishop_guest_wishlist');
              if (isMounted) fetchWishlist();
            })();
            return;
          }
        } catch {
          localStorage.removeItem('minishop_guest_wishlist');
        }
      }
      fetchWishlist();
    } else {
      const saved = localStorage.getItem('minishop_guest_wishlist');
      if (saved) {
        try {
          setProducts(JSON.parse(saved));
        } catch {
          setProducts([]);
        }
      } else {
        setProducts([]);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchWishlist]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('minishop_guest_wishlist', JSON.stringify(products));
    }
  }, [products, isAuthenticated]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      const targetStr = productId.toString();
      return products.some((p) => {
        const id = getProductId(p);
        return id && id.toString() === targetStr;
      });
    },
    [products]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      if (!product) return { success: false };
      const prodId = getProductId(product);
      if (!prodId) return { success: false };

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
          return { success: false, message: err.response?.data?.message || 'Error updating wishlist' };
        }
      } else {
        // Guest mode
        const exists = isInWishlist(prodId);
        if (exists) {
          setProducts((prev) => prev.filter((p) => {
            const id = getProductId(p);
            return id && id.toString() !== prodId.toString();
          }));
          return { success: true, isAdded: false };
        } else {
          setProducts((prev) => [...prev, product]);
          return { success: true, isAdded: true };
        }
      }
    },
    [isAuthenticated, isInWishlist]
  );

  const clearWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await axiosInstance.delete('/wishlist/clear');
      } catch (err) {
        console.error(err);
      }
    }
    setProducts([]);
    localStorage.removeItem('minishop_guest_wishlist');
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      products,
      loading,
      count: products.length,
      isInWishlist,
      toggleWishlist,
      clearWishlist,
      fetchWishlist
    }),
    [products, loading, isInWishlist, toggleWishlist, clearWishlist, fetchWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);

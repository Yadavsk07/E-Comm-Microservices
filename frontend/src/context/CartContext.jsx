import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getApiErrorMessage } from '../utils/errorHandler';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const data = await cartApi.getCart({ signal: controller.signal });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      console.warn('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toastError('Please sign in to add items to your cart.');
      return false;
    }

    setActionLoading(true);
    try {
      await cartApi.addToCart(productId, quantity);
      await fetchCart();
      success('Added to cart!');
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toastError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return false;

    setActionLoading(true);
    try {
      await cartApi.setItemQuantity(productId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toastError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return false;

    setActionLoading(true);
    try {
      await cartApi.removeFromCart(productId);
      await fetchCart();
      success('Item removed from cart');
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toastError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return false;

    setActionLoading(true);
    try {
      await cartApi.clearCart();
      setItems([]);
      success('Cart cleared');
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      toastError(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const lineSubtotal = item.subtotal !== undefined
        ? Number(item.subtotal)
        : Number(item.price || 0) * Number(item.quantity || 1);
      return total + lineSubtotal;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading,
        actionLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

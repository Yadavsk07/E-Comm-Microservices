import { useState, useCallback } from 'react';
import { paymentApi } from '../api/paymentApi';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../utils/errorHandler';

export function useRazorpay() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Dynamically loads Razorpay checkout script if not present
   */
  const loadScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  /**
   * Process payment flow for a given orderId
   * @param {string} orderId - The Order ID created in order-service
   * @param {object} callbacks - { onSuccess, onFailure }
   */
  const processPayment = useCallback(
    async (orderId, { onSuccess, onFailure } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const isLoaded = await loadScript();
        if (!isLoaded || !window.Razorpay) {
          throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
        }

        // 1. Create payment order in Payment Service
        // Returns: { razorpayOrderId, orderId, currency, amount, status }
        const paymentOrder = await paymentApi.createPaymentOrder(orderId);

        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!keyId) {
          throw new Error('Razorpay Key ID is not configured. Please set VITE_RAZORPAY_KEY_ID in your .env environment file.');
        }

        const options = {
          key: keyId,
          amount: paymentOrder.amount, // in paise
          currency: paymentOrder.currency || 'INR',
          name: 'ShopVibe Store',
          description: `Payment for Order #${orderId.substring(0, 8)}`,
          order_id: paymentOrder.razorpayOrderId,
          prefill: {
            name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#2563eb',
          },
          handler: async (response) => {
            try {
              // 2. Send verification payload to Payment Service
              await paymentApi.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (onSuccess) {
                onSuccess({
                  orderId,
                  paymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                });
              }
            } catch (err) {
              const errMsg = getApiErrorMessage(err);
              setError(errMsg);
              if (onFailure) onFailure(errMsg);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              const cancelMsg = 'Payment was cancelled or closed.';
              if (onFailure) onFailure(cancelMsg);
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', (response) => {
          const failMsg = response.error?.description || 'Payment transaction failed.';
          setError(failMsg);
          setLoading(false);
          if (onFailure) onFailure(failMsg);
        });

        razorpayInstance.open();
      } catch (err) {
        const msg = getApiErrorMessage(err);
        setError(msg);
        setLoading(false);
        if (onFailure) onFailure(msg);
      }
    },
    [loadScript, user]
  );

  return {
    processPayment,
    loading,
    error,
  };
}

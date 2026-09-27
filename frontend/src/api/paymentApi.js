import axiosClient from './axiosClient';

export const paymentApi = {
  /**
   * Create Razorpay payment order for an existing order
   * POST /api/payments/create-order
   * Body: { orderId }
   */
  async createPaymentOrder(orderId) {
    const response = await axiosClient.post('/api/payments/create-order', {
      orderId: String(orderId),
    });
    return response.data; // PaymentOrderResponse: { razorpayOrderId, orderId, currency, amount, status }
  },

  /**
   * Verify Razorpay payment signature
   * POST /api/payments/verify
   * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
   */
  async verifyPayment(verificationData) {
    const response = await axiosClient.post('/api/payments/verify', {
      razorpayOrderId: verificationData.razorpayOrderId,
      razorpayPaymentId: verificationData.razorpayPaymentId,
      razorpaySignature: verificationData.razorpaySignature,
    });
    return response.data; // "Payment verified successfully"
  },
};

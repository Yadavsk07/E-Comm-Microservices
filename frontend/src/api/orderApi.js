import axiosClient from './axiosClient';

export const orderApi = {
  /**
   * Create a new order from current cart items
   * POST /api/orders
   */
  async createOrder() {
    const response = await axiosClient.post('/api/orders');
    return response.data; // OrderResponse
  },

  /**
   * Get all orders of the logged in user
   * GET /api/orders
   */
  async getUserOrders() {
    const response = await axiosClient.get('/api/orders');
    return response.data; // List<OrderResponse>
  },

  /**
   * Get order details by orderId
   * GET /api/orders/{orderId}
   */
  async getOrderById(orderId) {
    const response = await axiosClient.get(`/api/orders/${orderId}`);
    return response.data; // OrderResponse
  },
};

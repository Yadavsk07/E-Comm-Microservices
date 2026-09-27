import axiosClient from './axiosClient';

export const cartApi = {
  /**
   * Get authenticated user's cart
   * GET /api/cart
   */
  async getCart(config = {}) {
    const response = await axiosClient.get('/api/cart', config);
    return response.data; // List<CartItemResponse>
  },

  /**
   * Add product to cart
   * POST /api/cart
   * Body: { productId, quantity }
   */
  async addToCart(productId, quantity = 1, config = {}) {
    const response = await axiosClient.post(
      '/api/cart',
      {
        productId: Number(productId),
        quantity: Number(quantity),
      },
      config
    );
    return response.data; // CartItemResponse
  },

  /**
   * Remove single product from cart
   * DELETE /api/cart/{productId}
   */
  async removeFromCart(productId, config = {}) {
    await axiosClient.delete(`/api/cart/${productId}`, config);
  },

  /**
   * Clear all items from cart
   * DELETE /api/cart
   */
  async clearCart(config = {}) {
    await axiosClient.delete('/api/cart', config);
  },

  /**
   * Update item quantity.
   * Since backend POST /api/cart adds quantity cumulatively,
   * setting an exact quantity is done by removing the product and re-adding it with the target quantity.
   */
  async setItemQuantity(productId, targetQuantity, config = {}) {
    if (targetQuantity <= 0) {
      return this.removeFromCart(productId, config);
    }
    await this.removeFromCart(productId, config);
    return await this.addToCart(productId, targetQuantity, config);
  },
};

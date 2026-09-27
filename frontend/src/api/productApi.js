import axiosClient from './axiosClient';

export const productApi = {
  /**
   * Get all active products
   */
  async getAllProducts() {
    const response = await axiosClient.get('/api/products');
    return response.data; // List<ProductResponse>
  },

  /**
   * Get single product by numeric ID
   */
  async getProductById(id) {
    const response = await axiosClient.get(`/api/products/${id}`);
    return response.data; // ProductResponse
  },

  /**
   * Search products by keyword
   */
  async searchProducts(keyword) {
    const response = await axiosClient.get('/api/products/search', {
      params: { keyword },
    });
    return response.data; // List<ProductResponse>
  },

  /**
   * Filter products by category
   */
  async getProductsByCategory(category) {
    const response = await axiosClient.get(`/api/products/category/${encodeURIComponent(category)}`);
    return response.data; // List<ProductResponse>
  },
};

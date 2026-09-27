import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Register a new user
   * Body: { firstName, lastName, email, phone, password, address: { street, city, state, country, zipcode } }
   */
  async register(data) {
    const response = await axiosClient.post('/api/auth/register', data);
    return response.data; // returns AuthResponse: { token, message, user }
  },

  /**
   * Login with email and password
   * Body: { email, password }
   */
  async login(credentials) {
    const response = await axiosClient.post('/api/auth/login', credentials);
    return response.data; // returns AuthResponse: { token, message, user }
  },

  /**
   * Fetch current user profile details by ID
   */
  async getUserById(id) {
    const response = await axiosClient.get(`/api/users/${id}`);
    return response.data; // returns UserResponse
  },
};

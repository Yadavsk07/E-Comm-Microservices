import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/axiosClient';
import { getApiErrorMessage } from '../utils/errorHandler';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const saveAuthData = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    try {
      if (newToken) {
        localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }

      if (newUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, []);

  const logout = useCallback(() => {
    saveAuthData(null, null);
  }, [saveAuthData]);

  // Handle token expiration event triggered from Axios interceptor
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [logout]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      // Response has: { token, message, user }
      saveAuthData(response.token, response.user);
      return { success: true, user: response.user, message: response.message };
    } catch (err) {
      const message = getApiErrorMessage(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      // Response has: { token, message, user }
      saveAuthData(response.token, response.user);
      return { success: true, user: response.user, message: response.message };
    } catch (err) {
      const message = getApiErrorMessage(err);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user?.id || !token) return;
    try {
      const freshUser = await authApi.getUserById(user.id);
      if (freshUser) {
        saveAuthData(token, freshUser);
      }
    } catch (err) {
      console.warn('Could not refresh user profile:', err);
    }
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

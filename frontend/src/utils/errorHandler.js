/**
 * Centralized API error message extractor
 * Formats Spring Boot validation errors, HTTP errors, and network issues into user-friendly strings.
 */
export function getApiErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';

  // If error is already a string
  if (typeof error === 'string') return error;

  // Handle Axios response error
  if (error.response) {
    const data = error.response.data;
    const status = error.response.status;

    // Direct string body (ignore HTML markup from web servers/proxies)
    if (typeof data === 'string' && data.trim() && !data.trim().startsWith('<')) {
      return data.trim();
    }

    // Common Spring Boot error object structure: { message, error, errors, status }
    if (data && typeof data === 'object') {
      // Validation error array or field error list
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const firstError = data.errors[0];
        if (typeof firstError === 'string') return firstError;
        if (firstError.defaultMessage) return firstError.defaultMessage;
        if (firstError.message) return firstError.message;
      }

      if (data.message && typeof data.message === 'string') {
        return data.message;
      }

      if (data.error && typeof data.error === 'string') {
        return data.error;
      }
    }

    // HTTP status code fallbacks
    switch (status) {
      case 400:
        return 'Invalid request. Please verify your details.';
      case 401:
        return 'Invalid credentials or your session has expired. Please sign in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested item or resource was not found.';
      case 409:
        return 'Conflict detected. The item might already exist.';
      case 422:
        return 'Validation error. Please verify the input values.';
      case 500:
        return 'Backend server encountered an error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Backend services are currently unreachable. Please make sure the API Gateway (port 8080) and microservices are running.';
      default:
        return `Request failed with HTTP status ${status}.`;
    }
  }

  // Network or timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Connection timed out. Please check your network and try again.';
  }

  if (error.request || error.message === 'Network Error') {
    return 'Cannot connect to backend server. Make sure API Gateway is running on port 8080.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

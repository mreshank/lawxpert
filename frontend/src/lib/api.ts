import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies
});

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cache handling
    if (config.method?.toLowerCase() === 'get' && config.cache !== false) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = cache.get(cacheKey);
      
      if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        // Return cached response and abort the request
        config.adapter = () => {
          return Promise.resolve({
            data: cachedResponse.data,
            status: 200,
            statusText: 'OK',
            headers: cachedResponse.headers,
            config: config,
            request: null
          });
        };
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors and caching
api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method?.toLowerCase() === 'get' && response.config.cache !== false) {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        headers: response.headers,
        timestamp: Date.now()
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await api.post(endpoints.auth.refresh);
        const { token } = response.data;
        
        // Store new token
        localStorage.setItem('token', token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Method to clear cache
export const clearCache = (url = null) => {
  if (url) {
    // Clear specific cache entries that match the URL
    cache.forEach((_, key) => {
      if (key.startsWith(url)) {
        cache.delete(key);
      }
    });
  } else {
    // Clear all cache
    cache.clear();
  }
};

// API endpoints
export const endpoints = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  user: {
    profile: '/api/user/profile',
    update: '/api/user/update',
  },
  lawyers: {
    data: "/api/lawyers",
    details: "/api/lawyers/details"
  }
  // Add more endpoints as needed
};

export default api; 

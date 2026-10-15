import axios from 'axios';
import { getApiErrorMessage } from '../utils/apiError';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: token va Accept-Language sarlavhasini har so'rovga qo'shish
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('minishop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    const langCode = currentLang.toLowerCase().startsWith('uz')
      ? 'uz'
      : currentLang.toLowerCase().startsWith('ru')
      ? 'ru'
      : 'en';
    config.headers['Accept-Language'] = langCode;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: 401 kelsa tokenlarni tozalash va faqat himoyalangan sahifada bo'lsa login'ga yo'naltirish
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      error.localizedMessage = getApiErrorMessage(error);
    }
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('minishop_token');
      localStorage.removeItem('minishop_user');
      const protectedPaths = ['/profile', '/checkout', '/orders', '/admin'];
      const currentPath = window.location.pathname;
      if (protectedPaths.some((p) => currentPath.startsWith(p))) {
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


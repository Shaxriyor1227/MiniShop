import { useTranslation } from 'react-i18next';

export const LOCALE_MAP = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US'
};

export const getLocale = (lang = 'uz') => {
  const code = (lang || 'uz').toLowerCase().slice(0, 2);
  return LOCALE_MAP[code] || 'uz-UZ';
};

export const formatPrice = (amount, lang = 'uz', currency = 'USD') => {
  const num = Number(amount) || 0;
  const locale = getLocale(lang);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } catch (err) {
    return `$${num.toFixed(2)}`;
  }
};

export const formatDate = (date, lang = 'uz', options = {}) => {
  if (!date) return '';
  const locale = getLocale(lang);
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
  } catch (err) {
    return String(date);
  }
};

export const formatDateTime = (date, lang = 'uz') => {
  if (!date) return '';
  const locale = getLocale(lang);
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (err) {
    return String(date);
  }
};

export const useFormatters = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n?.language || 'uz';

  return {
    formatPrice: (amount, currency = 'USD') => formatPrice(amount, currentLang, currency),
    formatDate: (date, options) => formatDate(date, currentLang, options),
    formatDateTime: (date) => formatDateTime(date, currentLang),
    lang: currentLang
  };
};

export default {
  formatPrice,
  formatDate,
  formatDateTime,
  useFormatters
};

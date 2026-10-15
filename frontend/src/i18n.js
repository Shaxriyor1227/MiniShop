import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uz from './locales/uz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
};

const supportedLngs = ['uz', 'ru', 'en'];

// Custom detector or language normalizer to handle dialects (e.g., 'ru-RU' -> 'ru', 'en-US' -> 'en')
const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('i18nextLng');
  if (saved) {
    const clean = saved.slice(0, 2).toLowerCase();
    if (supportedLngs.includes(clean)) return clean;
  }
  const browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  if (supportedLngs.includes(browserLang)) {
    return browserLang;
  }
  return 'en';
};

const initialLang = getInitialLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    lng: initialLang,
    fallbackLng: 'en',
    load: 'languageOnly',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
    },
  });

// Synchronize <html lang="..."> attribute dynamically
if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language || initialLang;
  i18n.on('languageChanged', (lng) => {
    const cleanLng = (lng || 'en').slice(0, 2).toLowerCase();
    document.documentElement.lang = cleanLng;
    try {
      localStorage.setItem('i18nextLng', cleanLng);
    } catch {
      // Ignore localStorage error if cookies/storage blocked
    }
  });
}

export default i18n;

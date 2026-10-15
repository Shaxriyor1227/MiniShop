const locales = {
  uz: require('../locales/uz.json'),
  ru: require('../locales/ru.json'),
  en: require('../locales/en.json')
};

/**
 * Get translated message for a code
 * @param {string} lang - 'uz' | 'ru' | 'en'
 * @param {string} code - message code
 * @param {string} defaultMsg - fallback message
 * @returns {string}
 */
const getMessage = (lang = 'en', code, defaultMsg = '') => {
  const normalizedLang = ['uz', 'ru', 'en'].includes(lang) ? lang : 'en';
  const dict = locales[normalizedLang] || locales.en;
  if (dict && dict[code]) return dict[code];
  if (locales.en && locales.en[code]) return locales.en[code];
  return defaultMsg || code;
};

/**
 * Standard unified response sender: { success, code, message, innerData }
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} code
 * @param {any} innerData
 * @param {string} [customMessage]
 * @param {object} [extra]
 */
const sendResponse = (res, statusCode, code, innerData = null, customMessage = null, extra = {}) => {
  const success = statusCode >= 200 && statusCode < 400;
  const lang = res.req?.lang || 'en';
  const message = customMessage || getMessage(lang, code);
  
  return res.status(statusCode).json({
    success,
    code,
    message,
    innerData,
    ...extra
  });
};

module.exports = {
  locales,
  getMessage,
  sendResponse
};

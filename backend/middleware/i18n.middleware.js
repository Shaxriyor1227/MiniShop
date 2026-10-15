const express = require('express');
const { getMessage, sendResponse } = require('../utils/response');

// Augment Express prototype so sendResponse is available everywhere, including error handlers
express.response.sendResponse = function(statusCode, code, innerData = null, customMessage = null, extra = {}) {
  return sendResponse(this, statusCode, code, innerData, customMessage, extra);
};

express.request.t = function(code, defaultMsg = '') {
  return getMessage(this.lang || 'en', code, defaultMsg);
};

/**
 * i18n middleware to extract language from Accept-Language header
 * Supported languages: 'uz', 'ru', 'en'. Default: 'en'
 */
const i18nMiddleware = (req, res, next) => {
  const header = req.headers['accept-language'] || req.headers['Accept-Language'] || '';
  
  let lang = 'en';
  if (typeof header === 'string') {
    const raw = header.toLowerCase().split(',')[0].trim();
    if (raw.startsWith('uz')) {
      lang = 'uz';
    } else if (raw.startsWith('ru')) {
      lang = 'ru';
    } else if (raw.startsWith('en')) {
      lang = 'en';
    }
  }

  req.lang = lang;
  next();
};

module.exports = i18nMiddleware;

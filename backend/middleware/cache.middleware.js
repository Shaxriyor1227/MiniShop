const memoryCache = require('../utils/cache');

/**
 * Cache middleware for public getAll endpoints (products, categories, brands).
 * Rules:
 * - 60s TTL
 * - Cache key = `${prefix}:${lang}:${queryString}`
 * - Adds Vary: Accept-Language and X-Cache header
 * - Bypasses authenticated requests and admin queries
 * @param {string} prefix - e.g. 'products', 'categories', 'brands'
 */
const cacheMiddleware = (prefix) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Never cache authenticated or admin requests
    if (req.headers.authorization || req.originalUrl.includes('/admin')) {
      return next();
    }

    const lang = req.lang || 'en';
    const queryString = Object.keys(req.query)
      .sort()
      .map((k) => `${k}=${req.query[k]}`)
      .join('&');

    const cacheKey = `${prefix}:${lang}:${queryString}`;

    // Always inform HTTP clients & proxies that representation varies by Accept-Language
    res.setHeader('Vary', 'Accept-Language');

    const cached = memoryCache.get(cacheKey);
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(cached.status).json(cached.body);
    }

    res.setHeader('X-Cache', 'MISS');

    // Intercept original sendResponse
    const originalSendResponse = res.sendResponse;
    res.sendResponse = function (statusCode, code, data, customMessage, extra = {}) {
      if (statusCode === 200) {
        const body = {
          success: true,
          code,
          message: customMessage || (req.t ? req.t(code) : code),
          innerData: data,
          ...extra
        };
        memoryCache.set(cacheKey, { status: statusCode, body });
      }
      return originalSendResponse.apply(this, arguments);
    };

    next();
  };
};

const invalidateProductsCache = () => memoryCache.invalidatePrefix('products:');
const invalidateCategoriesCache = () => {
  memoryCache.invalidatePrefix('categories:');
  memoryCache.invalidatePrefix('products:');
};
const invalidateBrandsCache = () => {
  memoryCache.invalidatePrefix('brands:');
  memoryCache.invalidatePrefix('products:');
};
const invalidateAllCatalogCaches = () => {
  memoryCache.invalidatePrefix('products:');
  memoryCache.invalidatePrefix('categories:');
  memoryCache.invalidatePrefix('brands:');
};

module.exports = {
  cacheMiddleware,
  invalidateProductsCache,
  invalidateCategoriesCache,
  invalidateBrandsCache,
  invalidateAllCatalogCaches
};

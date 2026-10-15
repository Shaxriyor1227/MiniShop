/**
 * MiniShop i18n Helper Utilities
 * Provides slug-based category & brand translation,
 * as well as localized order status, payment methods, and user roles.
 */

export const getCategoryName = (category, t) => {
  if (!category) return '';
  if (typeof category === 'string') {
    const slug = category.toLowerCase().trim().replace(/\s+/g, '-');
    const key = `categories.${slug}`;
    const translated = t ? t(key, { defaultValue: category }) : category;
    return translated !== key ? translated : category;
  }
  const slug = category.slug || (category.name ? category.name.toLowerCase().trim().replace(/\s+/g, '-') : '');
  if (slug && t) {
    const key = `categories.${slug}`;
    const translated = t(key, { defaultValue: category.name || '' });
    if (translated && translated !== key) return translated;
  }
  return category.name || '';
};

export const getBrandName = (brand, t) => {
  if (!brand) return '';
  if (typeof brand === 'string') {
    const slug = brand.toLowerCase().trim().replace(/\s+/g, '-');
    const key = `brands.${slug}`;
    const translated = t ? t(key, { defaultValue: brand }) : brand;
    return translated !== key ? translated : brand;
  }
  const slug = brand.slug || (brand.name ? brand.name.toLowerCase().trim().replace(/\s+/g, '-') : '');
  if (slug && t) {
    const key = `brands.${slug}`;
    const translated = t(key, { defaultValue: brand.name || '' });
    if (translated && translated !== key) return translated;
  }
  return brand.name || '';
};

export const getOrderStatus = (status, t) => {
  if (!status) return '';
  const key = `order_status.${status.toLowerCase()}`;
  const translated = t ? t(key, { defaultValue: status }) : status;
  return translated !== key ? translated : status;
};

export const getPaymentMethod = (method, t) => {
  if (!method) return '';
  const key = `payment_methods.${method.toLowerCase().replace(/[\s\/-]+/g, '_')}`;
  const translated = t ? t(key, { defaultValue: method }) : method;
  return translated !== key ? translated : method;
};

export const getUserRole = (role, t) => {
  if (!role) return '';
  const key = `roles.${role.toLowerCase()}`;
  const translated = t ? t(key, { defaultValue: role }) : role;
  return translated !== key ? translated : role;
};

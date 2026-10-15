import i18n from '../i18n';

/**
 * Resolve localized API error message.
 * First checks by error code in i18n ('api_errors.CODE'), falls back to backend response message,
 * then to custom fallback translation or generic error string.
 * @param {any} error
 * @param {string} [fallbackKey]
 * @returns {string}
 */
export const getApiErrorMessage = (error, fallbackKey = 'admin.common.error') => {
  const data = error?.response?.data;
  
  if (data?.code) {
    const codeKey = `api_errors.${data.code}`;
    if (i18n.exists(codeKey)) {
      return i18n.t(codeKey);
    }
  }

  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }

  if (fallbackKey && i18n.exists(fallbackKey)) {
    return i18n.t(fallbackKey);
  }

  return error?.message || 'Error occurred';
};

export default getApiErrorMessage;

/**
 * Localized formatter for Joi validation errors
 */
const formatJoiError = (details, lang = 'en') => {
  const fieldLabels = {
    uz: {
      name: 'Ism',
      email: 'Email',
      password: 'Parol',
      phone_number: 'Telefon raqam',
      price: 'Narx',
      stock: 'Miqdor',
      category_id: 'Kategoriya',
      brand_id: 'Brend',
      code: 'Kupon kodi',
      discount: 'Chegirma',
      city: 'Shahar',
      street: 'Ko\'cha manzili',
      rating: 'Baho',
      comment: 'Sharh'
    },
    ru: {
      name: 'Имя',
      email: 'Email',
      password: 'Пароль',
      phone_number: 'Номер телефона',
      price: 'Цена',
      stock: 'Количество',
      category_id: 'Категория',
      brand_id: 'Бренд',
      code: 'Промокод',
      discount: 'Скидка',
      city: 'Город',
      street: 'Улица',
      rating: 'Оценка',
      comment: 'Отзыв'
    },
    en: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      phone_number: 'Phone number',
      price: 'Price',
      stock: 'Stock',
      category_id: 'Category',
      brand_id: 'Brand',
      code: 'Coupon code',
      discount: 'Discount',
      city: 'City',
      street: 'Street address',
      rating: 'Rating',
      comment: 'Comment'
    }
  };

  const templates = {
    uz: {
      required: (f) => `${f} to'ldirilishi shart`,
      empty: (f) => `${f} bo'sh bo'lishi mumkin emas`,
      minString: (f, limit) => `${f} kamida ${limit} ta belgidan iborat bo'lishi kerak`,
      maxString: (f, limit) => `${f} ko'pi bilan ${limit} ta belgidan iborat bo'lishi kerak`,
      email: () => `To'g'ri email manzil kiriting`,
      minNumber: (f, limit) => `${f} kamida ${limit} bo'lishi kerak`,
      number: (f) => `${f} raqam bo'lishi kerak`,
      default: (msg) => msg
    },
    ru: {
      required: (f) => `Поле "${f}" обязательно для заполнения`,
      empty: (f) => `Поле "${f}" не может быть пустым`,
      minString: (f, limit) => `Поле "${f}" должно содержать не менее ${limit} символов`,
      maxString: (f, limit) => `Поле "${f}" должно содержать не более ${limit} символов`,
      email: () => `Введите корректный email адрес`,
      minNumber: (f, limit) => `Значение "${f}" должно быть не менее ${limit}`,
      number: (f) => `Поле "${f}" должно быть числом`,
      default: (msg) => msg
    },
    en: {
      required: (f) => `Field "${f}" is required`,
      empty: (f) => `Field "${f}" cannot be empty`,
      minString: (f, limit) => `Field "${f}" must be at least ${limit} characters long`,
      maxString: (f, limit) => `Field "${f}" cannot exceed ${limit} characters`,
      email: () => `Please enter a valid email address`,
      minNumber: (f, limit) => `Field "${f}" must be at least ${limit}`,
      number: (f) => `Field "${f}" must be a number`,
      default: (msg) => msg
    }
  };

  const normLang = ['uz', 'ru', 'en'].includes(lang) ? lang : 'en';
  const t = templates[normLang];
  const labels = fieldLabels[normLang];

  return details
    .map((d) => {
      const rawField = (d.path && d.path.length > 0) ? d.path.join('.') : (d.context?.key || 'field');
      const field = labels[rawField] || rawField;
      const type = d.type;
      const limit = d.context?.limit;

      if (type === 'any.required') return t.required(field);
      if (type === 'string.empty') return t.empty(field);
      if (type === 'string.min') return t.minString(field, limit);
      if (type === 'string.max') return t.maxString(field, limit);
      if (type === 'string.email') return t.email();
      if (type === 'number.min') return t.minNumber(field, limit);
      if (type === 'number.base') return t.number(field);

      return t.default(d.message);
    })
    .join('; ');
};

/**
 * Reusable Joi schema validation middleware
 * @param {import('joi').ObjectSchema} schema 
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = formatJoiError(error.details, req.lang || 'en');
      return res.sendResponse(400, 'VALIDATION_ERROR', null, errorMessage);
    }
    next();
  };
};

module.exports = validateSchema;

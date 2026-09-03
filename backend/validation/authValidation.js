const Joi = require('joi');

const registerValidation = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Ism kiritilishi shart',
    'string.min': 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email kiritilishi shart',
    'string.email': 'To\'g\'ri email manzil kiriting'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Parol kiritilishi shart',
    'string.min': 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
  }),
  role: Joi.string().valid('customer', 'admin').default('customer'),
  phone_number: Joi.string().allow('', null)
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email kiritilishi shart',
    'string.email': 'To\'g\'ri email manzil kiriting'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Parol kiritilishi shart'
  })
});

module.exports = {
  registerValidation,
  loginValidation
};

const Joi = require('joi');

const userCreateValidation = Joi.object({
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
  phone_number: Joi.string().allow('', null),
  isBlocked: Joi.boolean().default(false)
});

const userUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('customer', 'admin'),
  phone_number: Joi.string().allow('', null),
  isBlocked: Joi.boolean()
});

const userRoleValidation = Joi.object({
  role: Joi.string().valid('customer', 'admin').required().messages({
    'any.required': 'Role maydoni kiritilishi shart',
    'any.only': 'Role faqat "customer" yoki "admin" bo\'lishi mumkin'
  })
});

const userBlockValidation = Joi.object({
  isBlocked: Joi.boolean()
});

module.exports = {
  userCreateValidation,
  userUpdateValidation,
  userRoleValidation,
  userBlockValidation
};

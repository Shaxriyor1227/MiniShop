const Joi = require('joi');

const userCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('customer', 'admin').default('customer'),
  phone_number: Joi.string().allow('', null)
});

const userUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  role: Joi.string().valid('customer', 'admin'),
  phone_number: Joi.string().allow('', null)
});

module.exports = {
  userCreateValidation,
  userUpdateValidation
};

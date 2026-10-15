const Joi = require('joi');

const brandCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().allow('', null),
  logo: Joi.string().allow('', null),
  translations: Joi.object().unknown(true)
});

const brandUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100),
  slug: Joi.string().allow('', null),
  logo: Joi.string().allow('', null),
  translations: Joi.object().unknown(true)
});

module.exports = {
  brandCreateValidation,
  brandUpdateValidation
};

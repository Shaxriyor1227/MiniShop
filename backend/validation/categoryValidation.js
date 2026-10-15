const Joi = require('joi');

const categoryCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().allow('', null),
  translations: Joi.object().unknown(true)
});

const categoryUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100),
  slug: Joi.string().allow('', null),
  translations: Joi.object().unknown(true)
});

module.exports = {
  categoryCreateValidation,
  categoryUpdateValidation
};

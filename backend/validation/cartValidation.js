const Joi = require('joi');

const cartAddValidation = Joi.object({
  product_id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).default(1)
});

const cartUpdateValidation = Joi.object({
  product_id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(0).required()
});

module.exports = {
  cartAddValidation,
  cartUpdateValidation
};

const Joi = require('joi');

const productCreateValidation = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).default(0),
  category_id: Joi.string().hex().length(24).required(),
  brand_id: Joi.string().hex().length(24).required(),
  images: Joi.array().items(Joi.string()).default([])
});

const productUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(200),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  category_id: Joi.string().hex().length(24),
  brand_id: Joi.string().hex().length(24),
  images: Joi.array().items(Joi.string())
});

module.exports = {
  productCreateValidation,
  productUpdateValidation
};

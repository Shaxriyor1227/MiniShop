const Joi = require('joi');

const reviewCreateValidation = Joi.object({
  product_id: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null)
});

const reviewUpdateValidation = Joi.object({
  rating: Joi.number().integer().min(1).max(5),
  comment: Joi.string().allow('', null)
});

module.exports = {
  reviewCreateValidation,
  reviewUpdateValidation
};

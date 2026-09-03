const Joi = require('joi');

const orderCreateValidation = Joi.object({
  address_id: Joi.string().hex().length(24).required(),
  coupon_code: Joi.string().allow('', null),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  payment_method: Joi.string().default('Credit Card')
});

const orderStatusUpdateValidation = Joi.object({
  status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'cancelled').required()
});

module.exports = {
  orderCreateValidation,
  orderStatusUpdateValidation
};

const Joi = require('joi');

const paymentCreateValidation = Joi.object({
  order_id: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(0).required(),
  method: Joi.string().required(),
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').default('pending')
});

const paymentUpdateValidation = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').required()
});

module.exports = {
  paymentCreateValidation,
  paymentUpdateValidation
};

const Joi = require('joi');

const couponCreateValidation = Joi.object({
  code: Joi.string().min(2).max(50).uppercase().required(),
  discount: Joi.number().min(1).required(),
  is_active: Joi.boolean().default(true),
  expires_at: Joi.date().iso().required()
});

const couponUpdateValidation = Joi.object({
  code: Joi.string().min(2).max(50).uppercase(),
  discount: Joi.number().min(1),
  is_active: Joi.boolean(),
  expires_at: Joi.date().iso()
});

const couponApplyValidation = Joi.object({
  code: Joi.string().uppercase().required()
});

module.exports = {
  couponCreateValidation,
  couponUpdateValidation,
  couponApplyValidation
};

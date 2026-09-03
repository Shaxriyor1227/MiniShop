const Joi = require('joi');

const addressCreateValidation = Joi.object({
  city: Joi.string().required(),
  street: Joi.string().required(),
  is_default: Joi.boolean().default(false)
});

const addressUpdateValidation = Joi.object({
  city: Joi.string(),
  street: Joi.string(),
  is_default: Joi.boolean()
});

module.exports = {
  addressCreateValidation,
  addressUpdateValidation
};

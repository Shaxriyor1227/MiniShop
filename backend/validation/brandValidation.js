const Joi = require('joi');

const brandCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

const brandUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

module.exports = {
  brandCreateValidation,
  brandUpdateValidation
};

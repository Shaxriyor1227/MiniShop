const Joi = require('joi');

const categoryCreateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

const categoryUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

module.exports = {
  categoryCreateValidation,
  categoryUpdateValidation
};

const Joi = require('joi');

const wishlistToggleValidation = Joi.object({
  product_id: Joi.string().hex().length(24).required()
});

module.exports = {
  wishlistToggleValidation
};

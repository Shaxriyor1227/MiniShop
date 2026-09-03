const Joi = require('joi');

const notificationCreateValidation = Joi.object({
  user_id: Joi.string().hex().length(24),
  message: Joi.string().required()
});

const notificationUpdateValidation = Joi.object({
  isRead: Joi.boolean().required()
});

module.exports = {
  notificationCreateValidation,
  notificationUpdateValidation
};

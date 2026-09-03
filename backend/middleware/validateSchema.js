/**
 * Reusable Joi schema validation middleware
 * @param {import('joi').ObjectSchema} schema 
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map(d => d.message).join(', ');
      return res.status(400).json({
        success: false,
        message: errorMessage,
        innerData: null
      });
    }
    next();
  };
};

module.exports = validateSchema;

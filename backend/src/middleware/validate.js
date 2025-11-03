// src/middleware/validate.js
const Joi = require('joi');

exports.validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return res.status(400).json({ error: 'Validation failed', details: error.details });
  req.body = value;
  next();
};

// src/validation/foodSchemas.js
const Joi = require('joi');
exports.createFoodSchema = Joi.object({
  title: Joi.string().min(2).max(80).required(),
  description: Joi.string().allow(''),
  location: Joi.object({
    address: Joi.string().min(3).required(),
    geo: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2)
    }).optional()
  }).required(),
  expiresAt: Joi.date().optional()
});
exports.updateFoodSchema = Joi.object({
  title: Joi.string().min(2).max(80),
  description: Joi.string().allow(''),
  location: Joi.object({
    address: Joi.string().min(3),
    geo: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2)
    })
  }),
  status: Joi.string().valid('available','reserved','picked'),
  expiresAt: Joi.date().optional()
});

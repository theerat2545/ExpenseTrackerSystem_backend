const Joi = require('joi');

const categoryValidator = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    type: Joi.string().valid('income', 'expense').required(),
    user_id: Joi.number().required(),
});

module.exports = categoryValidator;

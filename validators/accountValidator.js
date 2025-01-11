const Joi = require('joi');

const accountSchema = Joi.object({
    name: Joi.string().max(100).required(),
    type: Joi.string().valid('savings', 'checking', 'investment').required(),
    balance: Joi.number().min(0).precision(2).default(0),
    user_id: Joi.number().integer().required(),
});

module.exports = accountSchema;
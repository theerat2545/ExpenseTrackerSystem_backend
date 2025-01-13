const Joi = require('joi');

const accountSchema  = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    balance: Joi.number().min(0).required(),
    user_id: Joi.number().required(),
});

module.exports = accountSchema ;

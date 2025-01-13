const Joi = require('joi');

// Schema สำหรับสร้างหรืออัปเดต Transaction
const transactionValidator = Joi.object({
    amount: Joi.number().required(),
    note: Joi.string().allow('').max(500), // Optional note
    slip: Joi.string().uri().allow(null), // Optional slip URL
    user_id: Joi.number().required(),
    account_id: Joi.number().required(),
    category_id: Joi.number().required(),
});

// Schema สำหรับอัปโหลด Slip
const uploadSlipValidator = Joi.object({
    transactionId: Joi.number().required(),
});

module.exports = { transactionValidator, uploadSlipValidator };

module.exports.validate = (schema) => (req, res, next) => {
    if (!schema || typeof schema.validate !== 'function') {
        return next(new Error('Invalid validation schema provided.'));
    }

    const { error } = schema.validate(req.body, { abortEarly: false }); // Validate body data
    if (error) {
        const errors = error.details.map((detail) => detail.message); // รวมข้อความ error
        return res.status(400).json({ error: 'Validation error', details: errors });
    }

    next();
};

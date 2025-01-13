const sanitizeHtml = require('sanitize-html');

exports.sanitizeInput = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = sanitizeHtml(req.body[key], {
                allowedTags: [],
                allowedAttributes: {},
            });
        }
    }
    next();
};

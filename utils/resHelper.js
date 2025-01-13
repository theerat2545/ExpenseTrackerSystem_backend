exports.successResponse = (res, data, message = 'Success') => {
    return res.status(200).json({ success: true, message, data });
};

exports.errorResponse = (res, message, status = 500) => {
    return res.status(status).json({ success: false, message });
};

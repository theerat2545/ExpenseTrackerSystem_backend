exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.isPositiveNumber = (number) => {
    return typeof number === 'number' && number > 0;
};

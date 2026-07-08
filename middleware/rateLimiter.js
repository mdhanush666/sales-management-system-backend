const rateLimit = require('express-rate-limit');

// Limit to 5 login attempts per 5 minutes per IP
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5,
    message: {
        statusCode: 429,
        success: false,
        message: "Too many login attempts. Please try again after 5 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { loginLimiter };
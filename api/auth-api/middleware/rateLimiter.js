import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 attempts per IP per 10 minutes
    standardHeaders: true, // Return standard RateLimit headers
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts from this IP. Please try again after 10 minutes.',
    },
});
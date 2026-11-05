import rateLimit from 'express-rate-limit';

// General rate limiter for Task API operations
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, //  100 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests created from this IP. Please slow down and try again later.',
    },
});
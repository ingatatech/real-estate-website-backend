import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

// Generic rate limiter for all API endpoints
export const apiRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs
	message: {
		success: false,
		message: 'Too many requests from this IP, please try again later.',
	},
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	validate: { xForwardedForHeader: false },
});

// Stricter rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per windowMs
	message: {
		success: false,
		message: 'Too many authentication attempts, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	validate: { xForwardedForHeader: false },
});

// Rate limiter for contact/inquiry forms (prevent spam)
export const contactRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 3, // Limit each IP to 3 requests per hour
	message: {
		success: false,
		message: 'Too many contact form submissions, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Rate limiter for search endpoints
export const searchRateLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 30, // Limit each IP to 30 search requests per minute
	message: {
		success: false,
		message: 'Too many search requests, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Skip rate limiting for specific routes (if needed)
export const skipRateLimit = (req: Request): boolean => {
	// Add logic to skip rate limiting for specific routes if needed
	// For example, health checks or internal monitoring
	return req.path === '/api/v1/health';
};

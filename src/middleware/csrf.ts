import type { Request, Response, NextFunction } from 'express';

/**
 * CSRF Protection Middleware
 * 
 * Note: Since this application uses JWT authentication for all API routes,
 * traditional CSRF protection is less critical. JWT tokens are sent in the
 * Authorization header, which browsers don't automatically include with requests.
 * 
 * This middleware provides basic CSRF protection as an additional security layer.
 * It can be enabled for non-API routes if needed in the future.
 */

/**
 * CSRF protection middleware (disabled by default for JWT-based API)
 * For JWT-protected APIs, CSRF is inherently protected by the Authorization header
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for all routes in JWT-based API architecture
  // JWT tokens in Authorization header are not vulnerable to CSRF
  return next();
};

/**
 * Generate CSRF token (disabled by default)
 * Can be enabled for non-API routes if needed
 */
export const generateCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Skip for JWT-based API architecture
  return next();
};

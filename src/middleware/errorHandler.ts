import type { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // In production, don't expose detailed error messages
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
  });
};

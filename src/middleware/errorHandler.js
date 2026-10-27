import * as Sentry from '@sentry/node';
export const errorHandler = (err, req, res, _next) => {
    // Log error to console
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    // Send error to Sentry if initialized
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(err, {
            extra: {
                path: req.path,
                method: req.method,
                ip: req.ip,
                userAgent: req.get('user-agent'),
            },
        });
    }
    // In production, don't expose detailed error messages
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json({
        success: false,
        message: isDevelopment ? err.message : 'Internal server error',
    });
};

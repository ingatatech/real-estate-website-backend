import * as Sentry from '@sentry/node';
// Initialize Sentry if DSN is provided
export const initSentry = () => {
    const sentryDsn = process.env.SENTRY_DSN;
    if (sentryDsn) {
        Sentry.init({
            dsn: sentryDsn,
            environment: process.env.NODE_ENV || 'development',
            tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
            // Filter out sensitive data
            beforeSend(event, hint) {
                // Filter out sensitive headers
                if (event.request?.headers) {
                    delete event.request.headers['authorization'];
                    delete event.request.headers['cookie'];
                }
                return event;
            },
        });
        console.log('Sentry initialized');
    }
    else {
        console.log('Sentry DSN not provided, error tracking disabled');
    }
};
// Capture an exception manually
export const captureException = (error, context) => {
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(error, {
            extra: context,
        });
    }
};
// Capture a message manually
export const captureMessage = (message, level = 'info') => {
    if (process.env.SENTRY_DSN) {
        Sentry.captureMessage(message, level);
    }
};

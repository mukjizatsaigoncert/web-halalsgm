/**
 * Strapi 5 middleware: forwards unhandled errors to Sentry with request
 * context (path, method, ip, status). Register in config/middlewares.ts.
 *
 * Initialisation of the Sentry client itself happens in src/index.ts
 * (bootstrap), so this middleware only captures when a DSN is configured.
 */
import * as Sentry from '@sentry/node';

export default () => {
  return async (ctx: any, next: () => Promise<any>) => {
    try {
      await next();
      // Capture 5xx responses that Strapi handled but still indicate failure.
      if (ctx.status >= 500 && process.env.SENTRY_DSN) {
        Sentry.captureMessage(`HTTP ${ctx.status} ${ctx.method} ${ctx.path}`, {
          level: 'error',
          tags: { status: String(ctx.status), method: ctx.method },
          extra: { path: ctx.path, ip: ctx.request.ip },
        });
      }
    } catch (err) {
      if (process.env.SENTRY_DSN) {
        Sentry.captureException(err, {
          tags: { method: ctx.method },
          extra: { path: ctx.path, ip: ctx.request.ip },
        });
      }
      throw err;
    }
  };
};

/**
 * Strapi 5 middleware stack.
 *
 * - `strapi::security`: configures Helmet. We tighten the default CSP so that
 *   the admin panel can still load its assets while refusing arbitrary remote
 *   scripts.
 * - `strapi::cors`: origin whitelist driven by the CORS_ORIGINS env var so the
 *   deployment can restrict which frontends may call the API. Never use '*'
 *   in production.
 */
const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

export default [
  'strapi::logger',
  'global::sentry',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          'frame-src': ["'self'", 'https://www.google.com'],
          upgradeInsecureRequests: null,
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: corsOrigins,
      headers: ['Content-Type', 'Authorization', 'X-Recaptcha-Token'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

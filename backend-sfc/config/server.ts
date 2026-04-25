export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Tell Strapi/Koa we are behind a trusted reverse proxy (nginx) so it
  // honours X-Forwarded-For for ctx.request.ip — rate limiting keys on it.
  proxy: env.bool('IS_PROXIED', true),
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS'),
  },
});

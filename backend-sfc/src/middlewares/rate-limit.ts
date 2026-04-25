/**
 * Strapi 5 custom middleware: per-IP rate limiting via koa2-ratelimit.
 *
 * Usage in a route config:
 *   config: {
 *     middlewares: [
 *       { name: 'global::rate-limit', config: { interval: { min: 1 }, max: 5, prefixKey: 'contact-create' } },
 *     ],
 *   }
 *
 * Default MemoryStore is adequate for a single-instance deployment; switch to
 * Stores.Redis if running multiple Strapi instances behind a load balancer.
 */
import { RateLimit, Stores } from 'koa2-ratelimit';

type Interval = { sec?: number; min?: number; hour?: number; day?: number };

interface RateLimitConfig {
  interval: Interval;
  max: number;
  prefixKey?: string;
  message?: string;
}

export default (config: RateLimitConfig, { strapi }: { strapi: any }) => {
  const limiter = RateLimit.middleware({
    interval: config.interval,
    max: config.max,
    prefixKey: config.prefixKey ?? 'api',
    message: config.message ?? 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
    store: new Stores.Memory(),
    getUserId: async (ctx: any) => ctx.request.ip,
  });

  return async (ctx: any, next: () => Promise<any>) => {
    return limiter(ctx, next);
  };
};

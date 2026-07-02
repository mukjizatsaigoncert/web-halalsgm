/**
 * Redis API Response Cache Middleware
 *
 * Caches GET responses from /api/* endpoints in Redis to reduce database load.
 * Cache is automatically invalidated when content is published/updated/deleted
 * via lifecycle hooks registered in src/index.ts.
 *
 * Env vars:
 *   REDIS_URL            – Redis connection URL (e.g. redis://:password@redis:6379/0)
 *   REDIS_CACHE_TTL      – Default TTL in seconds (default: 60)
 *   REDIS_CACHE_DISABLED – Set to "true" to bypass cache entirely
 */

import crypto from 'crypto';
import Redis from 'ioredis';

export const CACHE_PREFIX = 'strapi:api:';

// One-time upload-authorization tokens (see certification-application
// controller + restrict-upload middleware) — reuses this module's Redis
// client rather than opening a second connection.
export const UPLOAD_TOKEN_PREFIX = 'cert-app-upload-token:';
export const UPLOAD_TOKEN_TTL_SECONDS = 300;

let _redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (process.env.REDIS_CACHE_DISABLED === 'true') return null;
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!_redis) {
    _redis = new Redis(url, {
      lazyConnect: true, // We connect explicitly below to avoid double-connect
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      enableOfflineQueue: false,
      retryStrategy: (times: number) => Math.min(times * 200, 5000),
    });
    _redis.on('error', (err: Error) => {
      console.error('[redis-cache] connection error:', err.message);
    });
    // Connect eagerly so the client is ready on first request
    _redis.connect().catch(() => {/* ignore - retryStrategy handles reconnection */});
  }
  return _redis;
}

/**
 * Flush all cached API responses (called after content mutations).
 * Uses SCAN to avoid blocking Redis with KEYS.
 */
export async function flushApiCache(): Promise<void> {
  const client = getRedisClient();
  if (!client) return;
  try {
    const pattern = `${CACHE_PREFIX}*`;
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 200);
      cursor = nextCursor;
      if (keys.length > 0) await client.del(...keys);
    } while (cursor !== '0');
  } catch (err: any) {
    console.error('[redis-cache] flushApiCache error:', err.message);
  }
}

// Paths excluded from caching
const SKIP_PREFIXES = [
  '/admin',
  '/documentation',
  '/api/health',
  '/api/contacts', // POST-only but skipped for safety
  // The cache key is derived from the URL alone (no Authorization header),
  // so any authenticated per-user GET route MUST be excluded here — caching
  // it would serve one applicant's private submissions to the next caller
  // who hits the same URL within the TTL window.
  '/api/certification-applications',
];

const DEFAULT_TTL = (): number =>
  parseInt(process.env.REDIS_CACHE_TTL ?? '60', 10);

export default (_config: unknown, _ctx: unknown) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const client = getRedisClient();
    if (!client) return next();

    // Only cache GET requests
    if (ctx.request.method !== 'GET') return next();

    const path: string = ctx.request.path;
    if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return next();

    // Only cache /api/* routes
    if (!path.startsWith('/api/')) return next();

    const cacheKey =
      CACHE_PREFIX +
      crypto.createHash('sha256').update(ctx.request.url).digest('hex');

    // Try to serve from cache
    try {
      const cached = await client.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        ctx.status = 200;
        ctx.body = parsed.body;
        ctx.set('Content-Type', 'application/json; charset=utf-8');
        ctx.set('X-Cache', 'HIT');
        ctx.set('Cache-Control', `public, max-age=${DEFAULT_TTL()}, s-maxage=${DEFAULT_TTL()}`);
        return;
      }
    } catch (_) {
      // Redis unavailable — fall through to normal handler
    }

    await next();

    // Cache successful JSON responses
    if (ctx.status === 200 && ctx.body) {
      try {
        await client.setex(cacheKey, DEFAULT_TTL(), JSON.stringify({ body: ctx.body }));
        ctx.set('X-Cache', 'MISS');
        ctx.set('Cache-Control', `public, max-age=${DEFAULT_TTL()}, s-maxage=${DEFAULT_TTL()}`);
      } catch (_) {
        // Ignore write errors
      }
    }
  };
};


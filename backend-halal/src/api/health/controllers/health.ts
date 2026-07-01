/**
 * /api/health         — liveness  (no DB, used by Docker healthcheck)
 * /api/health/ready   — readiness (verifies DB is reachable)
 * /api/health/metrics — internal metrics: memory, Redis, DB pool
 *                       Protected: only accessible from localhost / private IP
 *                       or when METRICS_TOKEN env var matches Bearer token.
 */
import { getRedisClient, CACHE_PREFIX } from '../../../middlewares/redis-cache';

declare const strapi: any;

const startedAt = Date.now();

/** Allow metrics only from localhost or with a valid token. */
function isMetricsAllowed(ctx: any): boolean {
  const token = process.env.METRICS_TOKEN;
  if (token) {
    const auth = ctx.request.headers['authorization'] ?? '';
    return auth === `Bearer ${token}`;
  }
  // Fallback: allow from loopback / Docker internal network
  const ip: string = ctx.request.ip ?? '';
  return ip === '127.0.0.1' || ip === '::1' || ip.startsWith('172.') || ip.startsWith('10.');
}

export default {
  // ── Liveness ────────────────────────────────────────────────────────────
  async check(ctx: any) {
    ctx.body = {
      status: 'ok',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  },

  // ── Readiness ───────────────────────────────────────────────────────────
  async ready(ctx: any) {
    const checks: Record<string, { status: 'ok' | 'fail'; message?: string }> = {};
    let overall: 'ok' | 'fail' = 'ok';

    try {
      await strapi.db.connection.raw('SELECT 1');
      checks.database = { status: 'ok' };
    } catch (err) {
      overall = 'fail';
      checks.database = {
        status: 'fail',
        message: err instanceof Error ? err.message : 'unknown',
      };
    }

    // Quick Redis ping
    try {
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
        checks.redis = { status: 'ok' };
      } else {
        checks.redis = { status: 'ok', message: 'disabled' };
      }
    } catch (err) {
      // Redis is optional — don't fail readiness
      checks.redis = {
        status: 'fail',
        message: err instanceof Error ? err.message : 'unknown',
      };
    }

    ctx.status = overall === 'ok' ? 200 : 503;
    ctx.body = { status: overall, checks, uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000), timestamp: new Date().toISOString() };
  },

  // ── Metrics ─────────────────────────────────────────────────────────────
  async metrics(ctx: any) {
    if (!isMetricsAllowed(ctx)) {
      ctx.status = 403;
      ctx.body = { error: 'Forbidden' };
      return;
    }

    const result: Record<string, any> = {
      uptime_seconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
      node_version: process.version,
    };

    // ── Memory ──
    const mem = process.memoryUsage();
    result.memory = {
      rss_mb:        Math.round(mem.rss / 1024 / 1024),
      heap_used_mb:  Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
      external_mb:   Math.round(mem.external / 1024 / 1024),
    };

    // ── Redis ──
    try {
      const redis = getRedisClient();
      if (redis && redis.status === 'ready') {
        const info: string = await redis.info('stats');
        const getVal = (key: string) => {
          const m = info.match(new RegExp(`${key}:(\\d+)`));
          return m ? parseInt(m[1], 10) : 0;
        };
        const hits   = getVal('keyspace_hits');
        const misses = getVal('keyspace_misses');
        const total  = hits + misses;

        // Count cached API keys
        let cachedKeys = 0;
        let cursor = '0';
        do {
          const [next, keys] = await redis.scan(cursor, 'MATCH', `${CACHE_PREFIX}*`, 'COUNT', 100);
          cursor = next;
          cachedKeys += keys.length;
        } while (cursor !== '0');

        result.redis = {
          status: 'connected',
          hit_rate_pct: total > 0 ? Math.round((hits / total) * 100) : null,
          hits,
          misses,
          cached_api_keys: cachedKeys,
          ttl_seconds: parseInt(process.env.REDIS_CACHE_TTL ?? '60', 10),
        };
      } else {
        result.redis = { status: redis ? `connecting (${redis?.status})` : 'disabled' };
      }
    } catch (err) {
      result.redis = { status: 'error', message: err instanceof Error ? err.message : 'unknown' };
    }

    // ── PostgreSQL ──
    try {
      const dbResult: any = await strapi.db.connection.raw(
        `SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname = current_database()`
      );
      // Knex wraps result in { rows: [...] }
      const rows = dbResult?.rows ?? dbResult;
      const count = Array.isArray(rows) ? rows[0]?.count : 0;
      result.database = {
        status: 'connected',
        active_connections: count ?? 0,
      };
    } catch (err) {
      result.database = { status: 'error', message: err instanceof Error ? err.message : 'unknown' };
    }

    ctx.body = result;
  },
};

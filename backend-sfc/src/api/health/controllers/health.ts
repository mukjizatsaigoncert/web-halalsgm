/**
 * /api/health        — cheap liveness check (does not touch DB)
 * /api/health/ready  — readiness check, verifies DB is reachable
 */
declare const strapi: any;

const startedAt = Date.now();

export default {
  async check(ctx: any) {
    ctx.body = {
      status: 'ok',
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  },

  async ready(ctx: any) {
    const checks: Record<string, { status: 'ok' | 'fail'; message?: string }> = {};
    let overall: 'ok' | 'fail' = 'ok';

    try {
      // Strapi exposes the underlying knex connection via db.connection.
      await strapi.db.connection.raw('SELECT 1');
      checks.database = { status: 'ok' };
    } catch (err) {
      overall = 'fail';
      checks.database = {
        status: 'fail',
        message: err instanceof Error ? err.message : 'unknown',
      };
    }

    ctx.status = overall === 'ok' ? 200 : 503;
    ctx.body = {
      status: overall,
      checks,
      uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  },
};

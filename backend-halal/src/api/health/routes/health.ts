/**
 * Health check routes — exposed without auth so load balancers and
 * uptime monitors (e.g. UptimeRobot) can probe the service.
 *
 * /api/health         — liveness  (Docker healthcheck)
 * /api/health/ready   — readiness (DB + Redis)
 * /api/health/metrics — internal metrics (protected by METRICS_TOKEN or localhost)
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/health',
      handler: 'health.check',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/health/ready',
      handler: 'health.ready',
      config: { auth: false, policies: [], middlewares: [] },
    },
    {
      method: 'GET',
      path: '/health/metrics',
      handler: 'health.metrics',
      config: { auth: false, policies: [], middlewares: [] },
    },
  ],
};

/**
 * Health check routes — exposed without auth so load balancers and
 * uptime monitors (e.g. UptimeRobot) can probe the service.
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
  ],
};

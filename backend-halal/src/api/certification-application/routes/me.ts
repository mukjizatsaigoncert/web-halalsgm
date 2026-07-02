/**
 * Custom route: GET /api/certification-applications/me
 *
 * Returns only the logged-in applicant's own submissions. There is no
 * Public permission for this action (see backend-halal/src/index.ts) — only
 * the `authenticated` role is granted it, so Strapi's permissions
 * middleware already rejects anonymous requests before the controller
 * runs. The controller itself still checks `ctx.state.user` defensively.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/certification-applications/me',
      handler: 'certification-application.me',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

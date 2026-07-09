/**
 * Custom route: GET /api/certification-applications/partner-list
 *
 * Read-only Halal-only feed for the Malaysia-partner account. Only the
 * `partner_malaysia` role is granted this action (see
 * backend-halal/src/index.ts PARTNER_MALAYSIA_PERMISSIONS) — Strapi's
 * permissions middleware rejects every other role, including regular
 * `authenticated` applicants, before the controller runs.
 */
export default {
  routes: [
    {
      method: 'GET',
      path: '/certification-applications/partner-list',
      handler: 'certification-application.partnerList',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

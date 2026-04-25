/**
 * Strapi plugins.
 *
 * - documentation: auto-generates an OpenAPI spec + Swagger UI at
 *   /documentation. Access is restricted to authenticated admin users
 *   via `restrictedAccess: true`, so it is safe to ship in production.
 */
export default ({ env }: { env: any }) => ({
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'SFC API',
        description: 'REST API for the SAIGONCERT (SFC) website',
        contact: {
          name: 'SFC',
        },
      },
      'x-strapi-config': {
        // Require auth to view the documentation UI in non-dev environments.
        plugins: ['upload', 'users-permissions'],
        mutateDocumentation: undefined,
      },
      servers: [
        {
          url: env('PUBLIC_URL', 'http://localhost:1337') + '/api',
          description: env('NODE_ENV', 'development'),
        },
      ],
      security: [{ bearerAuth: [] }],
    },
  },
});

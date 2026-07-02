/**
 * certification-application router
 *
 * Only `create` is exposed here — submissions contain PII and must never be
 * listed/read anonymously. Applicants read their own submissions through the
 * separate authenticated `/certification-applications/me` route instead.
 *
 * Attaches a per-IP rate limit to POST /api/certification-applications
 * (5 submissions per minute) to prevent spam.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::certification-application.certification-application',
  {
    only: ['create'],
    config: {
      create: {
        middlewares: [
          {
            name: 'global::rate-limit',
            config: {
              interval: { min: 1 },
              max: 5,
              prefixKey: 'certification-application-create',
              message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',
            },
          },
        ],
      },
    },
  }
);

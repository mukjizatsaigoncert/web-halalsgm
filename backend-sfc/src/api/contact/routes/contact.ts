/**
 * contact router
 *
 * Uses the default core router for CRUD but attaches a per-IP rate limit to
 * POST /api/contacts (5 submissions per minute) to prevent spam.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact.contact', {
  config: {
    create: {
      middlewares: [
        {
          name: 'global::rate-limit',
          config: {
            interval: { min: 1 },
            max: 5,
            prefixKey: 'contact-create',
            message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',
          },
        },
      ],
    },
  },
});

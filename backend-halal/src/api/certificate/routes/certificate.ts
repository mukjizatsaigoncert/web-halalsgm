/**
 * certificate router
 *
 * Public read-only lookup (find/findOne). Rate-limited to slow down
 * brute-force scanning of certificate numbers.
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::certificate.certificate', {
  only: ['find', 'findOne'],
  config: {
    find: {
      middlewares: [
        {
          name: 'global::rate-limit',
          config: {
            interval: { min: 1 },
            max: 30,
            prefixKey: 'certificate-find',
            message: 'Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.',
          },
        },
      ],
    },
    findOne: {
      middlewares: [
        {
          name: 'global::rate-limit',
          config: {
            interval: { min: 1 },
            max: 30,
            prefixKey: 'certificate-findone',
            message: 'Bạn đã tra cứu quá nhiều lần. Vui lòng thử lại sau ít phút.',
          },
        },
      ],
    },
  },
});

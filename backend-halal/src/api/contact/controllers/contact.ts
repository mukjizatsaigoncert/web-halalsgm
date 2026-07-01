/**
 * contact controller
 *
 * Wraps the default factory to verify a reCAPTCHA v3 token on create.
 * Rate limiting is applied via the global::rate-limit middleware in routes.
 */
import { factories } from '@strapi/strapi';
import { verifyRecaptcha } from '../../../utils/recaptcha';

export default factories.createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    const headerToken = ctx.request.headers['x-recaptcha-token'];
    const bodyToken = (ctx.request.body as any)?.recaptchaToken;
    const token = (Array.isArray(headerToken) ? headerToken[0] : headerToken) || bodyToken;

    const result = await verifyRecaptcha(token as string | undefined, 'contact');
    if (!result.success) {
      strapi.log.warn(
        `[contact.create] reCAPTCHA rejected ip=${ctx.request.ip} reason=${result.reason} score=${result.score ?? 'n/a'}`
      );
      return ctx.forbidden(
        'Xác thực reCAPTCHA thất bại. Vui lòng tải lại trang và thử lại.'
      );
    }

    if ((ctx.request.body as any)?.recaptchaToken !== undefined) {
      delete (ctx.request.body as any).recaptchaToken;
    }

    return super.create(ctx);
  },
}));

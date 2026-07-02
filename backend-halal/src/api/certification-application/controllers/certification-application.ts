/**
 * certification-application controller
 *
 * - create: verifies a reCAPTCHA v3 token, delegates to the default create,
 *   then (if a valid JWT was sent) links the new entry to the applicant via
 *   a direct Document Service update. `applicant` is marked `private` in the
 *   schema so Strapi's public-input validation rejects it outright if sent
 *   in the request body ("Invalid key applicant") — the internal Document
 *   Service call bypasses that public-input validation entirely. Plain JSON
 *   only — documents are attached in a separate follow-up call to
 *   POST /api/upload (ref/refId/field), since Strapi's core create()
 *   requires `data` to already be a parsed object and never JSON-parses a
 *   multipart `data` field itself. Rate limiting is applied via the
 *   global::rate-limit middleware in routes.
 * - me: returns only the current applicant's own submissions.
 */
import { factories } from '@strapi/strapi';
import { verifyRecaptcha } from '../../../utils/recaptcha';

export default factories.createCoreController(
  'api::certification-application.certification-application',
  ({ strapi }) => ({
    async create(ctx) {
      const headerToken = ctx.request.headers['x-recaptcha-token'];
      const bodyToken = (ctx.request.body as any)?.recaptchaToken;
      const token = (Array.isArray(headerToken) ? headerToken[0] : headerToken) || bodyToken;

      const result = await verifyRecaptcha(token as string | undefined, 'certification_application');
      if (!result.success) {
        strapi.log.warn(
          `[certification-application.create] reCAPTCHA rejected ip=${ctx.request.ip} reason=${result.reason} score=${result.score ?? 'n/a'}`
        );
        return ctx.forbidden(
          'Xác thực reCAPTCHA thất bại. Vui lòng tải lại trang và thử lại.'
        );
      }

      const body = ctx.request.body as any;
      if (body?.recaptchaToken !== undefined) {
        delete body.recaptchaToken;
      }

      const response: any = await super.create(ctx);

      if (ctx.state.user?.id && response?.data?.documentId) {
        await strapi
          .documents('api::certification-application.certification-application')
          .update({
            documentId: response.data.documentId,
            data: { applicant: ctx.state.user.id } as any,
          });
      }

      return response;
    },

    async me(ctx) {
      if (!ctx.state.user) return ctx.unauthorized('Yêu cầu đăng nhập.');

      const entries = await strapi.documents('api::certification-application.certification-application').findMany({
        filters: { applicant: { id: ctx.state.user.id } },
        sort: { createdAt: 'desc' },
        populate: [],
      });
      const sanitized = await this.sanitizeOutput(entries, ctx);
      return this.transformResponse(sanitized);
    },
  })
);

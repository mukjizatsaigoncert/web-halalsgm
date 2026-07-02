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
 *
 *   Anonymous submissions (no login) still need a way to attach documents
 *   without letting anyone else attach files to their entry by guessing its
 *   id — so a one-time upload token is minted here, stored in Redis for 5
 *   minutes, and returned in the response. src/middlewares/restrict-upload.ts
 *   requires either this token or matching applicant ownership before
 *   allowing POST /api/upload to proceed (IDOR fix).
 * - me: returns only the current applicant's own submissions.
 */
import { factories } from '@strapi/strapi';
import crypto from 'crypto';
import { verifyRecaptcha } from '../../../utils/recaptcha';
import { getRedisClient, UPLOAD_TOKEN_PREFIX, UPLOAD_TOKEN_TTL_SECONDS } from '../../../middlewares/redis-cache';

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

      if (response?.data?.id) {
        const redis = getRedisClient();
        if (redis) {
          const uploadToken = crypto.randomBytes(24).toString('hex');
          await redis.setex(`${UPLOAD_TOKEN_PREFIX}${response.data.id}`, UPLOAD_TOKEN_TTL_SECONDS, uploadToken);
          response.meta = { ...response.meta, uploadToken };
        }
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

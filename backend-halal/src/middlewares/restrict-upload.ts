/**
 * Restricts the public POST /api/upload endpoint to only attach files to
 * certification-application entries — AND checks the caller actually owns
 * that entry (IDOR fix: Strapi's upload plugin accepts any ref/refId/field
 * combination system-wide once a role is granted
 * `plugin::upload.content-api.upload`; without an ownership check, anyone
 * could attach files to *any* certification-application by guessing its
 * numeric id, not just their own).
 *
 * "Owns" means one of:
 *   - the request carries the one-time upload token minted by
 *     certification-application's create() for this exact id (covers
 *     anonymous submissions — no account required to attach documents), or
 *   - the request is authenticated and that user is the entry's applicant.
 *
 * The token is single-use (deleted on success) and expires after 5 minutes,
 * so it only works as a short window right after create().
 */
import { getRedisClient, UPLOAD_TOKEN_PREFIX } from './redis-cache';

const ALLOWED_REF = 'api::certification-application.certification-application';

export default (_config: unknown, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    if (ctx.method === 'POST' && ctx.path === '/api/upload') {
      const { ref, refId, field, uploadToken } = ctx.request.body || {};

      if (ref !== ALLOWED_REF || field !== 'documents' || !refId) {
        return ctx.forbidden('Yêu cầu đính kèm tệp không hợp lệ.');
      }

      let authorized = false;

      if (uploadToken) {
        const redis = getRedisClient();
        if (redis) {
          const key = `${UPLOAD_TOKEN_PREFIX}${refId}`;
          const stored = await redis.get(key);
          if (stored && stored === uploadToken) {
            await redis.del(key); // single-use
            authorized = true;
          }
        }
      }

      if (!authorized && ctx.state.user?.id) {
        const application = await strapi.db
          .query(ALLOWED_REF)
          .findOne({ where: { id: refId }, populate: ['applicant'] });
        if (application?.applicant?.id === ctx.state.user.id) {
          authorized = true;
        }
      }

      if (!authorized) {
        return ctx.forbidden('Bạn không có quyền đính kèm tệp cho hồ sơ này.');
      }
    }
    return next();
  };
};

/**
 * Restricts the public POST /api/upload endpoint to only attach files to
 * certification-application entries.
 *
 * Strapi's upload plugin accepts any ref/refId/field combination system-wide
 * once a role is granted `plugin::upload.content-api.upload` — without this
 * guard, the public "attach documents to my submission" permission could be
 * used to attach arbitrary files to unrelated content (e.g. article covers)
 * by anyone who can guess a numeric id.
 */
const ALLOWED_REF = 'api::certification-application.certification-application';

export default (_config: unknown, { strapi: _strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    if (ctx.method === 'POST' && ctx.path === '/api/upload') {
      const ref = ctx.request.body?.ref;
      if (ref && ref !== ALLOWED_REF) {
        return ctx.forbidden('Chỉ được đính kèm tệp cho hồ sơ chứng nhận.');
      }
    }
    return next();
  };
};

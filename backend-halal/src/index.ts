import type { Core } from '@strapi/strapi';
import * as Sentry from '@sentry/node';
import { flushApiCache } from './middlewares/redis-cache';

function initSentry(strapi: Core.Strapi) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
  strapi.log.info('[bootstrap] Sentry initialised');
}

/**
 * Content-type UIDs whose publish/update/delete events should flush the
 * API response cache. Add new UIDs here as new content types are created.
 */
const CACHED_UIDS = [
  'api::article.article',
  'api::author.author',
  'api::category.category',
  'api::about.about',
  'api::global.global',
  'api::career.career',
];

function registerCacheInvalidation(strapi: Core.Strapi) {
  // 1. DB-level lifecycles: catch bulk operations, unpublish via DB, etc.
  for (const uid of CACHED_UIDS) {
    strapi.db.lifecycles.subscribe({
      models: [uid],
      async afterCreate() { await flushApiCache(); },
      async afterUpdate() { await flushApiCache(); },
      async afterDelete() { await flushApiCache(); },
    });
  }

  strapi.documents.use(async (context: any, next: () => Promise<any>) => {
    const result = await next();

    const invalidatingActions = ['publish', 'unpublish', 'discardDraft', 'create', 'update', 'delete'];
    if (
      invalidatingActions.includes(context.action) &&
      CACHED_UIDS.includes(context.uid)
    ) {
      await flushApiCache();
      strapi.log.debug(
        `[cache] Flushed API cache after document.${context.action} on ${context.uid}`
      );
    }

    return result;
  });

  strapi.log.info('[bootstrap] Redis cache invalidation hooks registered (DB + Document Service)');
}


/**
 * Permissions map applied to the `public` role on every boot.
 *
 * - Contact, Certification Application: ONLY `create` is exposed.
 *   Submissions must never be listed or read anonymously (they contain PII).
 * - Certificate: read-only lookup (find/findOne) — schema has no PII fields.
 * - Upload: `content-api.upload` lets applicants attach documents to their
 *   submission after creating it (two-step: create entry, then attach files
 *   via ref/refId/field) — src/middlewares/restrict-upload.ts scopes this to
 *   certification-application only so it can't be used to attach files
 *   elsewhere in the system.
 * - All other collection types: read-only (find/findOne).
 *
 * Anything outside this list is implicitly denied for the public role.
 */
const PUBLIC_PERMISSIONS: Record<string, string[]> = {
  'api::contact.contact': ['create'],
  'api::certification-application.certification-application': ['create'],
  'api::certificate.certificate': ['find', 'findOne'],
  'plugin::upload.content-api': ['upload'],
  'api::article.article': ['find', 'findOne'],
  'api::career.career': ['find', 'findOne'],
  'api::category.category': ['find', 'findOne'],
  'api::author.author': ['find', 'findOne'],
  'api::about.about': ['find'],
  'api::global.global': ['find'],
};

/**
 * Permissions map applied to the `authenticated` role on every boot.
 *
 * Strapi evaluates permissions per-role — a request carrying a valid JWT is
 * checked against `authenticated`, NOT `public`, even for actions Public
 * already allows. So logged-in applicants need their own explicit grants:
 * `create` (submit while logged in, auto-linked to their account) and the
 * custom `me` action (list only their own submissions).
 */
const AUTHENTICATED_PERMISSIONS: Record<string, string[]> = {
  'api::certification-application.certification-application': ['create', 'me'],
  'plugin::upload.content-api': ['upload'],
};

async function syncRolePermissions(
  strapi: Core.Strapi,
  roleType: 'public' | 'authenticated',
  permissionsMap: Record<string, string[]>
) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: roleType } });

  if (!role) {
    strapi.log.warn(`[bootstrap] Role "${roleType}" not found; skipping permission sync`);
    return;
  }

  const desired = new Set<string>();
  for (const [uid, actions] of Object.entries(permissionsMap)) {
    for (const action of actions) desired.add(`${uid}.${action}`);
  }

  const managedPrefixes = Object.keys(permissionsMap);
  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: role.id } });

  // Disable any permission under our managed UIDs that isn't desired.
  for (const perm of existing) {
    const isManaged = managedPrefixes.some((p) => perm.action.startsWith(`${p}.`));
    if (!isManaged) continue;
    if (!desired.has(perm.action)) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .delete({ where: { id: perm.id } });
      strapi.log.info(`[bootstrap] Revoked ${roleType} permission ${perm.action}`);
    }
  }

  // Enable every desired permission that's missing.
  for (const action of desired) {
    const already = existing.find((p: any) => p.action === action);
    if (already) continue;
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: role.id },
    });
    strapi.log.info(`[bootstrap] Granted ${roleType} permission ${action}`);
  }
}

function assertProductionSecrets(strapi: Core.Strapi) {
  if (process.env.NODE_ENV !== 'production') return;
  const required = [
    'APP_KEYS',
    'API_TOKEN_SALT',
    'ADMIN_JWT_SECRET',
    'TRANSFER_TOKEN_SALT',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'RECAPTCHA_SECRET_KEY',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    strapi.log.error(
      `[bootstrap] Missing required production env vars: ${missing.join(', ')}`
    );
    throw new Error(`Refusing to start: missing env vars ${missing.join(', ')}`);
  }
  const placeholder = required.filter((k) =>
    /tobemodified/i.test(process.env[k] ?? '')
  );
  if (placeholder.length > 0) {
    throw new Error(
      `[bootstrap] Placeholder secrets detected in production: ${placeholder.join(', ')}`
    );
  }
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    assertProductionSecrets(strapi);
    initSentry(strapi);
    await syncRolePermissions(strapi, 'public', PUBLIC_PERMISSIONS);
    await syncRolePermissions(strapi, 'authenticated', AUTHENTICATED_PERMISSIONS);
    registerCacheInvalidation(strapi);
  },
};

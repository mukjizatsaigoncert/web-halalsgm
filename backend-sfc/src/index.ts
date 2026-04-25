import type { Core } from '@strapi/strapi';
import * as Sentry from '@sentry/node';

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
 * Permissions map applied to the `public` role on every boot.
 *
 * - Contact: ONLY `create` is exposed. Submissions must never be listed or
 *   read anonymously (they contain PII).
 * - All other collection types: read-only (find/findOne).
 *
 * Anything outside this list is implicitly denied for the public role.
 */
const PUBLIC_PERMISSIONS: Record<string, string[]> = {
  'api::contact.contact': ['create'],
  'api::article.article': ['find', 'findOne'],
  'api::career.career': ['find', 'findOne'],
  'api::category.category': ['find', 'findOne'],
  'api::author.author': ['find', 'findOne'],
  'api::about.about': ['find'],
  'api::global.global': ['find'],
};

async function syncPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[bootstrap] Public role not found; skipping permission sync');
    return;
  }

  const desired = new Set<string>();
  for (const [uid, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
    for (const action of actions) desired.add(`${uid}.${action}`);
  }

  const managedPrefixes = Object.keys(PUBLIC_PERMISSIONS);
  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: publicRole.id } });

  // Disable any permission under our managed UIDs that isn't desired.
  for (const perm of existing) {
    const isManaged = managedPrefixes.some((p) => perm.action.startsWith(`${p}.`));
    if (!isManaged) continue;
    if (!desired.has(perm.action)) {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .delete({ where: { id: perm.id } });
      strapi.log.info(`[bootstrap] Revoked public permission ${perm.action}`);
    }
  }

  // Enable every desired permission that's missing.
  for (const action of desired) {
    const already = existing.find((p: any) => p.action === action);
    if (already) continue;
    await strapi.db.query('plugin::users-permissions.permission').create({
      data: { action, role: publicRole.id },
    });
    strapi.log.info(`[bootstrap] Granted public permission ${action}`);
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
    await syncPublicPermissions(strapi);
  },
};

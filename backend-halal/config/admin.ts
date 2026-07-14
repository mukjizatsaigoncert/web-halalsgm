export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env('CLIENT_URL'),
      handler: async (uid, { status }) => {
        if (uid !== 'api::hero-slider.hero-slider') return null;

        const clientUrl = env('CLIENT_URL');
        const previewSecret = env('PREVIEW_SECRET');
        if (!clientUrl || !previewSecret) return null;

        const params = new URLSearchParams({ secret: previewSecret, status });
        return `${clientUrl.replace(/\/$/, '')}/api/preview?${params}`;
      },
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});

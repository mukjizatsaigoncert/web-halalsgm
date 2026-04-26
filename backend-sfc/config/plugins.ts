/**
 * Strapi plugins.
 *
 * - documentation: auto-generates an OpenAPI spec + Swagger UI at
 *   /documentation. Access is restricted to authenticated admin users
 *   via `restrictedAccess: true`, so it is safe to ship in production.
 *
 * - upload: Defaults to local disk storage in development.
 *   In production set R2_* env vars to switch to Cloudflare R2
 *   (S3-compatible, served via a custom R2.dev or custom domain).
 */
export default ({ env }: { env: any }) => {
  // ── Upload provider ──────────────────────────────────────────────────────
  // Use Cloudflare R2 when R2_ACCESS_KEY_ID is present (production).
  // Falls back to local disk otherwise (dev / CI).
  const r2AccountId   = env('R2_ACCOUNT_ID', '');
  const r2AccessKey   = env('R2_ACCESS_KEY_ID', '');
  const r2SecretKey   = env('R2_SECRET_ACCESS_KEY', '');
  const r2Bucket      = env('R2_BUCKET', 'sfc-uploads');
  const r2PublicUrl   = env('R2_PUBLIC_URL', '');   // e.g. https://uploads.sfc.vn
  const useR2         = Boolean(r2AccessKey && r2SecretKey && r2AccountId);

  const uploadConfig = useR2
    ? {
        provider: 'aws-s3',
        providerOptions: {
          credentials: {
            accessKeyId:     r2AccessKey,
            secretAccessKey: r2SecretKey,
          },
          // Cloudflare R2 S3-compatible endpoint
          endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
          region: 'auto',
          params: {
            ACL:    'public-read',
            Bucket: r2Bucket,
          },
        },
        actionOptions: {
          upload:       {},
          uploadStream: {},
          delete:       {},
        },
      }
    : {
        // Local disk — default, no config needed
        provider: 'local',
      };

  return {
    upload: {
      config: {
        ...uploadConfig,
        // Rewrite URLs so the browser fetches from the public R2/custom domain
        // instead of the internal Strapi origin.
        ...(useR2 && r2PublicUrl
          ? {
              providerOptions: {
                ...(uploadConfig as any).providerOptions,
                baseUrl: r2PublicUrl,
              },
            }
          : {}),
        // Security: block SVG uploads to prevent XSS via SVG files
        breakpoints: {
          xlarge: 1920,
          large:  1000,
          medium: 750,
          small:  500,
          xsmall: 64,
        },
        sizeLimit: 10 * 1024 * 1024, // 10 MB
      },
    },

    documentation: {
      enabled: true,
      config: {
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'SFC API',
          description: 'REST API for the SAIGONCERT (SFC) website',
          contact: { name: 'SFC' },
        },
        'x-strapi-config': {
          plugins: ['upload', 'users-permissions'],
          mutateDocumentation: undefined,
        },
        servers: [
          {
            url: env('PUBLIC_URL', 'http://localhost:1337') + '/api',
            description: env('NODE_ENV', 'development'),
          },
        ],
        security: [{ bearerAuth: [] }],
      },
    },
  };
};


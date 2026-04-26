const config = require("./src/config/config.json");

// R2 public URL may be a custom domain (e.g. https://uploads.sfc.vn) or
// the default R2.dev subdomain.  Extract hostname for remotePatterns.
function r2Hostname() {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) return null;
  try { return new URL(url).hostname; } catch { return null; }
}

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // CSP scoped for a Next.js + reCAPTCHA v3 + GTM + Strapi media setup.
    // 'unsafe-inline'/'unsafe-eval' on script-src are required by Next.js
    // runtime and GTM; tighten further with nonces if moving off GTM later.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https: http://localhost:1337",
      "frame-src https://www.google.com https://www.googletagmanager.com",
      "form-action 'self'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",
  poweredByHeader: false,
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      // Dev: Next.js image optimizer fetches from localhost:1337 (host-exposed port)
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Docker internal: rewrite proxy resolves to this
      {
        protocol: "http",
        hostname: "backend",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Production: absolute URLs built with NEXT_PUBLIC_STRAPI_URL = https://api.sfc.vn
      {
        protocol: "https",
        hostname: "api.sfc.vn",
        pathname: "/uploads/**",
      },
      // Cloudflare R2 custom domain (e.g. https://uploads.sfc.vn)
      ...(r2Hostname()
        ? [{ protocol: "https", hostname: r2Hostname(), pathname: "/**" }]
        : []),
      // Strapi Cloud CDN (if used)
      {
        protocol: "https",
        hostname: "creative-dance-2bde5b47f7.media.strapiapp.com",
        pathname: "/**",
      },
    ],
  },
  // Rewrite /uploads/* to Strapi backend so next/image optimizer can reach it
  // server-side inside Docker (avoids localhost resolution failure in containers).
  // Dev:  localhost:3001/uploads/x → frontend:3000/uploads/x → backend:1337/uploads/x
  // Prod: sfc.vn/uploads/x        → frontend:3000/uploads/x → backend:1337/uploads/x
  //   BUT in prod, browser image src is absolute https://api.sfc.vn/uploads/x (CDN),
  //   so this rewrite is only used by the next/image optimizer — not the browser.
  async rewrites() {
    const strapiInternal =
      process.env.STRAPI_INTERNAL_URL || "http://backend:1337";
    return [
      {
        source: "/uploads/:path*",
        destination: `${strapiInternal}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

// Wrap with Sentry only when a DSN is configured; keeps local dev lean and
// avoids pulling the Sentry webpack plugin into builds without monitoring.
const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (sentryDsn) {
  const { withSentryConfig } = require("@sentry/nextjs");
  module.exports = withSentryConfig(nextConfig, {
    silent: !process.env.CI,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
  });
} else {
  module.exports = nextConfig;
}

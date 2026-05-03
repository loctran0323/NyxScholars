import type { NextConfig } from "next";

/**
 * Security headers — strict but not yet zero-trust strict.
 * • CSP allows inline styles + GIS/Stripe scripts + Supabase + PostHog.
 * • HSTS is enabled for production hosts.
 * • COOP keeps cross-origin popups isolated; loosened for Stripe Checkout
 *   which redirects through their domain.
 * Worth revisiting once an SRI/CSP nonce strategy is in place.
 */
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(self), geolocation=(), payment=(self), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control",  value: "on" },
  { key: "Cross-Origin-Opener-Policy",   value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.posthog.com https://us.i.posthog.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.posthog.com https://us.i.posthog.com https://www.google-analytics.com https://api.openai.com https://api.anthropic.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.youtube.com https://player.vimeo.com",
  "media-src 'self' https: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.stripe.com",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Content-Type", value: "application/manifest+json" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/sat-act",             destination: "/#how",   permanent: false },
      { source: "/services",            destination: "/",       permanent: false },
      { source: "/college-admissions",  destination: "/",       permanent: false },
    ];
  },
};

export default nextConfig;

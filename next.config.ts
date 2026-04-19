// next.config.ts
import type { NextConfig } from 'next'
const withPWA = require('next-pwa')

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

// next-pwa тохиргоо
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,

  // Dev-д service worker-ийг унтраах — HMR саадгүй ажиллана
  disable: process.env.NODE_ENV === 'development',

  // Кэшлэх дүрмүүд
  runtimeCaching: [
    // ── 1. Google Fonts ──────────────────────────────────────
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── 2. Next.js static assets (_next/static) ───────────────
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static',
        expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
      },
    },

    // ── 3. Next.js image optimization ────────────────────────
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-images',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },

    // ── 4. Supabase API — network first, offline fallback ─────
    {
      urlPattern: ({ url }: { url: URL }) =>
        url.hostname.includes('supabase.co'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-api',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 5 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },

    // ── 5. App pages — network first ─────────────────────────
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'app-pages',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
})

module.exports = pwaConfig(nextConfig)
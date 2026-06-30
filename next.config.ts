import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Blog relaunch 2026: the 3 original posts were replaced by 3 new
    // bilingual posts on new slugs. The contract post was retired with no
    // direct replacement, so it points at the blog listing. 308 (permanent).
    return [
      {
        source: "/blog/skilky-koshtuye-sayt-2026",
        destination: "/blog/vartist-rozrobky-saytu-2026",
        permanent: true,
      },
      {
        source: "/blog/tilda-7200-za-3-roky",
        destination: "/blog/tilda-vs-kastomnyy-sayt-2026",
        permanent: true,
      },
      {
        source: "/blog/dohovir-z-veb-studieyu-7-punktiv",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/en/blog/website-cost-2026-breakdown",
        destination: "/en/blog/custom-website-cost-uk-2026",
        permanent: true,
      },
      {
        source: "/en/blog/tilda-7200-over-3-years",
        destination: "/en/blog/custom-website-vs-wordpress-2026",
        permanent: true,
      },
      {
        source: "/en/blog/web-studio-contract-7-items",
        destination: "/en/blog",
        permanent: true,
      },
    ];
  },
  experimental: {
    // Inline CSS into the HTML <style> at render time, eliminating the
    // render-blocking <link rel=stylesheet> requests that were gating LCP.
    // Only kicks in for statically-rendered pages — the app/(uk)/ and
    // app/(en)/ route groups own their <html lang> so pages stay static.
    inlineCss: true,
  },
  images: {
    // Prefer AVIF (≈20-30% smaller than WebP) then fall back to WebP — shrinks
    // the hero LCP image and all card photography on the optimizer path.
    formats: ["image/avif", "image/webp"],
    // Allow-list of quality levels used across the app (hero 82, card photos
    // 55/60). Required by Next 16; configuring it now silences the warning and
    // keeps the optimizer cache keyed to a known set.
    qualities: [55, 60, 70, 75, 82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

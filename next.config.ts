import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
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

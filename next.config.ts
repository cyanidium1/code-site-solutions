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
    // inlineCss RE-A/B'd 2026-07-06 post-islands (docs/perf-log.md). The earlier
    // 2026-07-05 A/B favored OFF (ON 49 / OFF 54) when the page was JS-heavy
    // (TBT ~900ms) and ON's larger document was costly. The islands work then
    // cut TBT to ~60-150ms and shrank the doc, flipping the balance: with ON,
    // FCP 2.7→2.3s, LCP 4.9→4.2s, and — crucially — the score stops swinging
    // (ON 54/54/55 vs OFF 38/58/53), because inlining removes ALL render-blocking
    // CSS <link>s (0 vs 3) and their request-waterfall variance. Total compressed
    // wire bytes are ~equal (bigger doc, but no separate CSS requests). Keeping ON.
    // Tradeoff: inlined CSS isn't cached cross-page — fine for a mostly-first-visit
    // marketing site (matches Next's own inlineCss guidance for atomic/Tailwind CSS).
    inlineCss: true,
    // Rewrite barrel imports (@heroui/react re-exports everything) to
    // direct module imports so unused components never enter the bundle.
    optimizePackageImports: ["@heroui/react", "lucide-react"],
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

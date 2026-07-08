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
    // inlineCss: OFF. Full history in docs/perf-log.md. The deciding finding
    // (2026-07-06 bootup attribution): inlineCss ON duplicates the ~306 KB CSS
    // into the RSC flight payload, inflating the /en document to 1.13 MB (549 KB
    // of inline __next_f script strings, CSS marker present 470×). Evaluating
    // that inline script is ~1,632 ms — the single biggest contributor to the
    // main-thread work that makes the hero LCP paint a coin-flip on real
    // slow-4G (prod PSI bimodal 5s/9s). OFF shrinks the doc to ~484 KB (~half
    // the inline-script eval) and delivers CSS as 3 cacheable <link>s; round-2
    // OFF measured a stable ~3.3s on prod. The cost isn't CSS parse (1ms) or
    // render-blocking — it's the flight-payload eval, which we hadn't measured
    // in the earlier A/Bs (fast local CPUs hide it).
    inlineCss: false,
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

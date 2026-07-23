import type { SanityImgInput } from "@/lib/shared/sanity-image";
import type { BlogCover, SanityImage } from "@/types/sanity";

/**
 * Blog cover resolution, one priority everywhere (hero, cards, OG, JSON-LD):
 *   1. `cover`      — CMS-hosted Sanity image (primary; editors upload in Studio)
 *   2. `coverImage` — legacy /public path string (kept for backwards compat)
 *   3. generic      — branded fallback under /public/blog, cards only
 *
 * Consumers decide what the generic means for them: cards render it like any
 * cover; the post hero and OG/JSON-LD skip it (`generic: true`) — a stock
 * banner adds nothing above an article, and the opengraph-image route already
 * renders a branded per-post text card.
 */

export const GENERIC_BLOG_COVER = "/blog/cover-generic.webp";

const GENERIC_ALT: Record<"uk" | "en", string> = {
  uk: "Блог Code-Site.Art — статті про кастомні сайти",
  en: "Code-Site.Art blog — articles on custom websites",
};

export type ResolvedBlogCover = {
  /** SanityImg-compatible input: image object (CMS) or /public path. */
  image: SanityImgInput;
  alt: string;
  /** URL for OG/JSON-LD use — Sanity CDN URL or site-relative path. */
  url: string;
  /** True when the post has no cover of its own (generic placeholder). */
  generic: boolean;
};

export function resolveBlogCover(
  post: {
    cover?: SanityImage | null;
    coverImage?: BlogCover | null;
    title?: string;
    titleEn?: string;
  },
  locale: "uk" | "en",
): ResolvedBlogCover {
  const title = (locale === "en" ? post.titleEn : post.title) ?? post.title ?? "";

  const cms = post.cover;
  if (cms?.asset?.url) {
    const alt =
      (locale === "en" ? cms.alt?.en : cms.alt?.uk) ?? cms.alt?.uk ?? title;
    return { image: cms, alt, url: cms.asset.url, generic: false };
  }

  const src = post.coverImage?.src;
  if (src) {
    const alt =
      (locale === "en"
        ? (post.coverImage?.altEn ?? post.coverImage?.alt)
        : post.coverImage?.alt) ?? title;
    return { image: src, alt, url: src, generic: false };
  }

  return {
    image: GENERIC_BLOG_COVER,
    alt: GENERIC_ALT[locale],
    url: GENERIC_BLOG_COVER,
    generic: true,
  };
}

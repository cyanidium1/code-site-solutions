/**
 * Data layer for the case-study pages: fetchers, metadata builder, locale
 * helpers. Split out of index.tsx (2026-07-08) so data-only consumers —
 * `lib/server/fetch-homepage-cases.ts` on the HOMEPAGE — don't pull the
 * whole case-page component tree (and its route-scoped CSS) into their
 * module graph. index.tsx re-exports everything here, so component-side
 * importers are unaffected.
 */

import { buildAlternates } from "@/lib/shared/alternates";
import { LOCALE_CONFIG } from "@/constants/locales";
import type { Metadata } from "next";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { OG_DEFAULT_IMAGE } from "@/constants/site";
import { sanityOgImage } from "@/lib/shared/sanity-cdn";
import {
  CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
} from "@/lib/server/sanity-queries";
import type { CaseStudyDoc, CaseStudyRef, Locale } from "@/types/sanity";
import { loc } from "@/lib/shared/sanity-locale";
import { localizePath } from "@/constants/i18n-routes";
import { availableLocales } from "@/lib/shared/locale-content";

/* ─── locale / path helpers ───────────────────────────────────────────── */

export function pathFor(slug: string, locale: Locale): string {
  return localizePath(`/portfolio/${slug}`, locale);
}

/* ─── data fetchers ───────────────────────────────────────────────────── */

export async function fetchCaseStudy(
  slug: string,
): Promise<CaseStudyDoc | null> {
  return sanityFetch<CaseStudyDoc | null>({
    query: CASE_STUDY_BY_SLUG_QUERY,
    params: { slug },
    revalidate: 3600,
    tags: [`caseStudy:${slug}`],
  });
}

export async function fetchCaseStudies(): Promise<CaseStudyRef[]> {
  return (
    (await sanityFetch<CaseStudyRef[]>({
      query: CASE_STUDIES_QUERY,
      revalidate: 3600,
      tags: ["caseStudy"],
    }).catch(() => [])) ?? []
  );
}

/* ─── metadata builder ────────────────────────────────────────────────── */

export async function buildCaseStudyMetadata(
  slug: string,
  locale: Locale,
): Promise<Metadata> {
  const doc = await fetchCaseStudy(slug);
  if (!doc) return {};

  // Explicit per-locale SEO title first; otherwise construct a locale-true
  // fallback instead of letting `loc()` fall back to the UK string — that
  // fallback made every untranslated EN case page carry the UK title
  // verbatim (duplicate titles across locales, and Ukrainian in EN SERPs).
  const CASE_SUFFIX: Record<Locale, string> = {
    uk: "кейс розробки сайту",
    en: "website case study",
    ru: "кейс разработки сайта",
  };
  const caseSuffix = CASE_SUFFIX[locale];
  const title =
    doc.seo?.title?.[locale] ||
    `${loc(doc.title, locale)} — ${caseSuffix} | Code-Site.Art`;
  const description = loc(doc.seo?.description, locale);
  const path = pathFor(slug, locale);

  const alternates = buildAlternates({
    locale,
    uaPath: `/portfolio/${slug}`,
    available: availableLocales(doc),
  });

  // OG image fallback: dedicated seo.ogImage → hero image → cover image →
  // file-based [slug]/opengraph-image.tsx auto-card (handled by Next when
  // `images` is undefined).
  // Telegram bug Aug 2026: this handed scrapers the raw asset — a 1.17 MB
  // PNG at 1202x1133, which previews as a heavy near-square thumbnail.
  // sanityOgImage forces a 1200x630 JPEG (62 KB on the same asset).
  const ogImage = sanityOgImage(
    doc.seo?.ogImage?.url ??
      doc.hero?.heroImage?.asset?.url ??
      doc.coverImage?.asset?.url,
  );

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      locale: LOCALE_CONFIG[locale].ogLocale,
      // SEO audit Aug 2026: omitting `images` does NOT fall through to the
      // [slug]/opengraph-image.tsx card — declaring `openGraph` at all
      // suppresses that convention, which left 3 cases with no og:image.
      images: [ogImage ?? OG_DEFAULT_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [(ogImage ?? OG_DEFAULT_IMAGE).url],
    },
  };
}

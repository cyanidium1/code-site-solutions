/**
 * Sanity-driven case-study page renderer. Mirrors the layout of the
 * (now disabled) hardcoded NBYG / Efedra pages: header, hero, meta-strip,
 * sections via a section-mapper, related cases, footer CTA.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { ImageText } from "@/components/blocks/image-text";
import {
  EfedraCaseGallery,
  type EfedraGalleryTile,
} from "@/components/portfolio/efedra-case-gallery";
import {
  HpHeader,
  HpFooter,
  PullQuote,
  FinalCta3,
} from "@/components/homepage";
import "@/components/homepage/homepage.css";

import { sanityFetch } from "@/lib/sanity/fetch";
import {
  CASE_STUDIES_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
} from "@/lib/sanity/queries";
import type {
  CaseStudyDoc,
  CaseStudyRef,
  CaseStudySection,
  Locale,
  MediaGallerySection,
  RichTextSimple,
} from "@/lib/sanity/types";
import { loc } from "@/lib/sanity/locale";
import { SanityImg } from "@/lib/sanity/image";
import {
  PortableInline,
  formatLine,
  plainPortable,
} from "@/lib/sanity/portable";
import { ORG_ID, SITE_ORIGIN, pageUrl } from "@/lib/site";

/* ─── locale / path helpers ───────────────────────────────────────────── */

function pathFor(slug: string, locale: Locale): string {
  return locale === "en"
    ? `/en/portfolio/${slug}`
    : `/portfolio/${slug}`;
}

function pickRichText(
  uk: RichTextSimple | undefined,
  en: RichTextSimple | undefined,
  locale: Locale,
): RichTextSimple | undefined {
  if (locale === "en" && en && en.length) return en;
  return uk;
}

export function hasEnglishCaseContent(doc: CaseStudyDoc): boolean {
  return Boolean(doc.title?.en && doc.title.en.trim().length > 0);
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

  const title =
    loc(doc.seo?.title, locale) || loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale);
  const path = pathFor(slug, locale);
  const enAvailable = hasEnglishCaseContent(doc);

  const languages: Record<string, string> = {
    uk: `/portfolio/${slug}`,
  };
  if (enAvailable) {
    languages.en = `/en/portfolio/${slug}`;
    languages["x-default"] = `/portfolio/${slug}`;
  }

  return {
    title,
    description,
    alternates: { canonical: path, languages },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      locale: locale === "en" ? "en_US" : "uk_UA",
    },
  };
}

/* ─── JSON-LD ────────────────────────────────────────────────────────── */

function buildJsonLd(
  doc: CaseStudyDoc,
  locale: Locale,
): Record<string, unknown> {
  const url = pageUrl(pathFor(doc.slug, locale));
  const title = loc(doc.title, locale);
  const description = loc(doc.seo?.description, locale) || undefined;
  const ABOUT_URL = pageUrl("/about");

  const homeName = locale === "en" ? "Home" : "Головна";
  const homeUrl = locale === "en" ? `${SITE_ORIGIN}/en` : SITE_ORIGIN;
  const portfolioName = locale === "en" ? "Portfolio" : "Портфоліо";
  const portfolioUrl = `${SITE_ORIGIN}/portfolio`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: homeName, item: homeUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: portfolioName,
            item: portfolioUrl,
          },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        url,
        headline: title,
        description,
        inLanguage: locale === "en" ? "en" : "uk",
        datePublished: doc.date ?? `${doc.year ?? new Date().getFullYear()}-01-01`,
        author: {
          "@type": "Person",
          "@id": `${ABOUT_URL}#fedir-alpatov`,
          name: "Fedir Alpatov",
          jobTitle: "Founder, Code-Site.Art",
          url: ABOUT_URL,
        },
        publisher: {
          "@type": "Organization",
          "@id": ORG_ID,
          name: "Code-Site.Art",
        },
      },
    ],
  };
}

/* ─── meta-strip ─────────────────────────────────────────────────────── */

function MetaStrip({
  doc,
  locale,
}: {
  doc: CaseStudyDoc;
  locale: Locale;
}) {
  const labels = {
    industry: "Industry",
    region: "Region",
    year: "Year",
    stack: "Stack",
    duration: "Duration",
    budget: "Budget",
  };

  const industry = doc.industry?.title
    ? loc(doc.industry.title, locale)
    : INDUSTRY_LABEL[CASE_SLUG_TO_INDUSTRY[doc.slug] ?? ""] ?? null;
  const region = loc(doc.region, locale);
  const year = doc.year ? String(doc.year) : null;
  const stack = doc.stack?.length ? doc.stack.join(", ") : null;
  const duration = loc(doc.duration, locale);
  const budget = doc.budget;

  const parts: Array<{ label: string; value: string }> = [];
  if (industry) parts.push({ label: labels.industry, value: industry });
  if (region) parts.push({ label: labels.region, value: region });
  if (year) parts.push({ label: labels.year, value: year });
  if (stack) parts.push({ label: labels.stack, value: stack });
  if (duration) parts.push({ label: labels.duration, value: duration });
  if (budget) parts.push({ label: labels.budget, value: budget });

  if (!parts.length) return null;

  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "0 48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 24px",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 12,
          color: "var(--ink-3)",
          letterSpacing: "0.04em",
        }}
      >
        {parts.map((p) => (
          <span key={p.label}>· {p.label}: {p.value}</span>
        ))}
      </div>
    </section>
  );
}

/* ─── asset placeholder for inline screenshots that haven't been
   uploaded yet (e.g. NBYG inline images, until founder supplies them). */

function ScreenshotPending({ label }: { label: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, oklch(0.55 0.20 25 / 0.18) 0%, oklch(0.62 0.18 60 / 0.18) 100%)",
        color: "var(--ink-3)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 12,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textAlign: "center",
        padding: 24,
      }}
    >
      {label}
    </div>
  );
}

/* ─── YouTube embed (used inside OUTCOME imageTextBlock) ──────────────── */

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="relative block h-full min-h-[200px] w-full overflow-hidden rounded-[inherit]">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 z-0 h-full w-full border-0"
      />
    </div>
  );
}

/* ─── mediaGalleryBlock rendering ─────────────────────────────────────── */

function GalleryRenderer({
  section,
  locale,
}: {
  section: MediaGallerySection;
  locale: Locale;
}) {
  const tiles: EfedraGalleryTile[] =
    section.images
      ?.map((img) => {
        const asset = img.asset;
        if (!asset?.url) return null;
        return {
          label: loc(img.caption, locale),
          src: asset.url,
          alt: loc(img.alt, locale),
        } satisfies EfedraGalleryTile;
      })
      .filter((t): t is EfedraGalleryTile => t !== null) ?? [];

  if (!tiles.length) return null;

  return <EfedraCaseGallery tiles={tiles} />;
}

/* ─── section mapper ─────────────────────────────────────────────────── */

function SectionBlock({
  section,
  locale,
  doc,
}: {
  section: CaseStudySection;
  locale: Locale;
  doc: CaseStudyDoc;
}) {
  switch (section._type) {
    case "imageTextBlock": {
      const isCentered = section.variant === "centered";
      const hasImage = Boolean(section.image?.asset?.url);

      // Centered OUTCOME-style block: render YouTube if doc.youtubeId is set
      // and no image is uploaded; otherwise fall back to image or placeholder.
      let imageNode: React.ReactNode;
      if (hasImage) {
        imageNode = (
          <SanityImg
            image={section.image}
            alt={
              loc(section.image?.alt, locale) ||
              loc(section.heading, locale) ||
              loc(doc.title, locale)
            }
            fill
            className="object-cover"
          />
        );
      } else if (isCentered && doc.youtubeId) {
        imageNode = (
          <YouTubeEmbed
            videoId={doc.youtubeId}
            title={`${loc(doc.title, locale)} — video walkthrough`}
          />
        );
      } else {
        imageNode = (
          <ScreenshotPending
            label={
              locale === "en"
                ? "Screenshot — coming soon"
                : "Скріншот — незабаром"
            }
          />
        );
      }

      return (
        <ImageText
          variant={section.variant ?? "side"}
          imageVariant={section.imageVariant ?? "imageRight"}
          bulletIcon={
            (section as { bulletIcon?: "check" | "cross" }).bulletIcon ??
            "check"
          }
          eyebrow={loc(section.eyebrow, locale) || undefined}
          heading={formatLine(loc(section.heading, locale)) ?? ""}
          body={
            <PortableInline
              value={pickRichText(section.body, section.bodyEn, locale)}
            />
          }
          bulletList={section.bulletList?.map((b) => loc(b, locale))}
          image={imageNode}
          cta={
            section.cta?.label
              ? {
                  label: loc(section.cta.label, locale),
                  href: section.cta.href ?? "#",
                }
              : undefined
          }
          sectionClassName={
            isCentered ? "pt-5 max-[800px]:pt-5" : undefined
          }
        />
      );
    }

    case "statsBlock":
      return (
        <StatsBar
          items={
            section.items?.map((m) => ({
              value: m.value ?? "",
              label: loc(m.label, locale),
            })) ?? []
          }
        />
      );

    case "quoteBlock":
      return (
        <PullQuote
          quote={plainPortable([
            {
              _type: "block",
              children: [
                {
                  _type: "span",
                  text: loc(section.quote, locale),
                  marks: [],
                },
              ],
            },
          ])}
          name={section.authorName ?? ""}
          role={loc(section.authorRole, locale)}
          showAvatar={false}
        />
      );

    case "mediaGalleryBlock":
      return <GalleryRenderer section={section} locale={locale} />;

    /* TODO: render beforeAfterBlock / testimonialBlock / ctaBlock /
       richTextBlock once a case actually uses them. */
    default:
      return null;
  }
}

/* ─── related-cases card (Sanity-driven) ─────────────────────────────── */

const INDUSTRY_PRESENTATION: Record<
  string,
  { color: string; gradient: string; tech: string }
> = {
  healthcare: {
    color: "#0EA5E9",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    tech: "Next.js",
  },
  construction: {
    color: "#EF4444",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.62 0.18 60) 100%)",
    tech: "Next.js",
  },
  // Fallback below covers anything not listed.
};
const DEFAULT_INDUSTRY_PRESENTATION = {
  color: "#8B5CF6",
  gradient:
    "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  tech: "Next.js",
  label: "Other",
};

/* Mirror of the per-slug fallback used in /portfolio listing. Drop both
   when every caseStudy has an `industry` reference set in the CMS. */
const CASE_SLUG_TO_INDUSTRY: Record<string, string> = {
  "efedra-clinic": "healthcare",
  "nbyg-kobenhavn": "construction",
};
const INDUSTRY_LABEL: Record<string, string> = {
  healthcare: "Healthcare",
  construction: "Construction",
};

function presentationFor(caseSlug: string, industrySlug?: string) {
  const key = industrySlug ?? CASE_SLUG_TO_INDUSTRY[caseSlug];
  if (!key) return DEFAULT_INDUSTRY_PRESENTATION;
  const base = INDUSTRY_PRESENTATION[key];
  if (!base) return DEFAULT_INDUSTRY_PRESENTATION;
  return { ...base, label: INDUSTRY_LABEL[key] ?? "Other" };
}

function buildMetaLine(c: CaseStudyRef, locale: Locale, label: string): string {
  const region = loc(c.region, locale);
  const year = c.year ? String(c.year) : null;
  return [label, region, year].filter(Boolean).join(" · ");
}

function RelatedCard({
  c,
  locale,
}: {
  c: CaseStudyRef;
  locale: Locale;
}) {
  const pres = presentationFor(c.slug, c.industrySlug);
  const href = pathFor(c.slug, locale);
  const name = loc(c.title, locale) || c.client || c.slug;
  const meta = buildMetaLine(c, locale, pres.label);
  const metrics = loc(c.metricsLine, locale);
  const industryLabel = pres.label;

  return (
    <Link href={href} className="hp-case-link">
      <div className="hp-case-cover">
        <div
          className="hp-case-cover-bg"
          style={{ background: pres.gradient }}
        />
        <div className="hp-case-cover-dots" />
        <div
          className="hp-case-shot"
          style={
            c.coverImage?.asset?.url
              ? { display: "flex", flexDirection: "column" }
              : undefined
          }
        >
          <div className="hp-case-shot-bar">
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
            <span className="hp-case-shot-dot" />
          </div>
          {c.coverImage?.asset?.url ? (
            <div
              className="hp-case-shot-body"
              style={{
                flex: 1,
                minHeight: 0,
                padding: 0,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.coverImage.asset.url}
                alt={loc(c.coverImage.alt, locale) || name}
                className="absolute inset-0 block h-full w-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="hp-case-shot-body">
              <div className="hp-case-shot-line s1" />
              <div className="hp-case-shot-line s2" />
              <div className="hp-case-shot-line s3" />
            </div>
          )}
        </div>
      </div>
      <div className="hp-case-body">
        <div className="hp-case-chips">
          <span
            className="hp-case-chip"
            style={{
              color: pres.color,
              borderColor: `${pres.color}55`,
            }}
          >
            {industryLabel}
          </span>
          <span className="hp-case-chip">{pres.tech}</span>
        </div>
        <div className="hp-case-name-row">
          <h3 className="hp-case-name">{name}</h3>
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        </div>
        <div className="hp-case-meta">{meta}</div>
        {metrics ? <div className="hp-case-metrics">{metrics}</div> : null}
      </div>
    </Link>
  );
}

/* ─── main page component ────────────────────────────────────────────── */

export async function CasePageView({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const doc = await fetchCaseStudy(slug);
  if (!doc) notFound();
  if (locale === "en" && !hasEnglishCaseContent(doc)) notFound();

  const allCases = await fetchCaseStudies();
  const related = allCases
    .filter((c) => c.slug !== doc.slug)
    .filter((c) => locale !== "en" || Boolean(c.title?.en))
    .slice(0, 3);

  const title = loc(doc.title, locale);
  const eyebrow = loc(doc.hero?.eyebrow, locale);
  const heading = formatLine(loc(doc.hero?.heading, locale));
  const sub = loc(doc.hero?.subheading, locale);

  const homeLabel = locale === "en" ? "Home" : "Головна";
  const portfolioLabel = locale === "en" ? "Portfolio" : "Портфоліо";

  const relatedHeading =
    locale === "en" ? (
      <>
        Other <em>case studies</em>
      </>
    ) : (
      <>
        Інші <em>кейси</em>
      </>
    );
  const relatedLink = locale === "en" ? "All cases" : "Всі кейси";
  const finalHeading =
    locale === "en" ? (
      <>
        Ready to <em>discuss</em> a project?
      </>
    ) : (
      <>
        Готові <em>обговорити</em> проєкт?
      </>
    );
  const finalSub =
    locale === "en"
      ? "Free 30-min consultation. No commitment."
      : "Безкоштовна 30-хв консультація. Без зобов'язань.";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(doc, locale)),
        }}
      />
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: homeLabel, href: locale === "en" ? "/en" : "/" },
          { label: portfolioLabel, href: "/portfolio" },
          { label: title },
        ]}
        eyebrow={eyebrow || "/ CASE STUDY"}
        headline={heading ?? title}
        sub={sub}
      />
      <MetaStrip doc={doc} locale={locale} />

      {doc.sections?.map((s) => (
        <SectionBlock key={s._key} section={s} locale={locale} doc={doc} />
      ))}

      {related.length > 0 ? (
        <section className="hp-section">
          <div className="hp-inner">
            <div className="hp-section-head">
              <div className="hp-eyebrow">
                <span className="hp-eyebrow-dot" />
                <span>/ 06 RELATED</span>
              </div>
              <h2 className="hp-h2">{relatedHeading}</h2>
            </div>
            <div className="hp-cases-grid">
              {related.map((r) => (
                <RelatedCard key={r._id} c={r} locale={locale} />
              ))}
            </div>
            <Link href="/portfolio" className="hp-link">
              {relatedLink}
              <ArrowUpRight size={14} strokeWidth={1.8} />
            </Link>
          </div>
        </section>
      ) : null}

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={finalHeading}
        sub={finalSub}
      />

      <HpFooter />
    </>
  );
}

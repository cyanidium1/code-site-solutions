/**
 * Sanity-driven case-study page renderer. Mirrors the layout of the (now
 * disabled) hardcoded NBYG / Efedra pages: header, hero, meta-strip,
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
  RichTextSimple,
} from "@/lib/sanity/types";
import { loc } from "@/lib/sanity/locale";
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
  const portfolioUrl =
    locale === "en"
      ? `${SITE_ORIGIN}/portfolio`
      : `${SITE_ORIGIN}/portfolio`;

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
  const labels =
    locale === "en"
      ? {
          industry: "Industry",
          region: "Region",
          year: "Year",
          stack: "Stack",
          duration: "Duration",
          budget: "Budget",
        }
      : {
          industry: "Industry",
          region: "Region",
          year: "Year",
          stack: "Stack",
          duration: "Duration",
          budget: "Budget",
        };

  const industry = doc.industry?.title
    ? loc(doc.industry.title, locale)
    : null;
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

/* ─── asset placeholder (reused from hardcoded layout) ────────────────── */

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

/* ─── section mapper ─────────────────────────────────────────────────── */

function SectionBlock({
  section,
  locale,
}: {
  section: CaseStudySection;
  locale: Locale;
}) {
  switch (section._type) {
    case "imageTextBlock": {
      const placeholderLabel =
        locale === "en"
          ? "Screenshot — coming soon"
          : "Скріншот — незабаром";
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
          image={<ScreenshotPending label={placeholderLabel} />}
          cta={
            section.cta?.label
              ? {
                  label: loc(section.cta.label, locale),
                  href: section.cta.href ?? "#",
                }
              : undefined
          }
          sectionClassName={
            section.variant === "centered"
              ? "pt-5 max-[800px]:pt-5"
              : undefined
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

    /* TODO: render mediaGalleryBlock / beforeAfterBlock / testimonialBlock /
       ctaBlock / richTextBlock once a case actually uses them. NBYG doesn't,
       so they're skipped here to keep the mapper minimal. */
    default:
      return null;
  }
}

/* ─── related cases (fallback to hardcoded list while only NBYG is in CMS) */

type Related = {
  name: string;
  meta: string;
  metrics: string;
  industry: string;
  industryColor: string;
  tech: string;
  gradient: string;
  href?: string;
  coverImage?: string;
  coverImageAlt?: string;
};

/* TODO: once Tatarka/Webbond migrate into Sanity, drop this hardcoded list
   and populate from CASE_STUDIES_QUERY (excluding the current slug). */
const RELATED_FALLBACK_UK: Related[] = [
  {
    name: "Efedra Clinic",
    meta: "Healthcare · Odesa · 2024",
    metrics: "×3.2 inquiries · LCP 0.8s · Top-3 Google",
    industry: "Healthcare",
    industryColor: "#0EA5E9",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.55 0.16 200) 100%)",
    href: "/portfolio/efedra-clinic",
    coverImage: "/EfedraCaseCreenshots/efedra-main-after.png",
    coverImageAlt: "Efedra Clinic — новий сайт після редизайну",
  },
  {
    name: "Tatarka",
    meta: "Real Estate Investment · Kyiv · 2025",
    metrics: "$4M raised · Investor portal · Multi-lang",
    industry: "Real Estate",
    industryColor: "#EF4444",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.62 0.16 65) 0%, oklch(0.55 0.18 40) 100%)",
  },
  {
    name: "Webbond",
    meta: "Digital Agency · Kyiv · 2024",
    metrics: "Кастомний дизайн · Складний portfolio · Багатомовність",
    industry: "Digital Agency",
    industryColor: "#8B5CF6",
    tech: "Next.js",
    gradient:
      "linear-gradient(135deg, oklch(0.50 0.20 295) 0%, oklch(0.40 0.18 280) 100%)",
  },
];

const RELATED_FALLBACK_EN: Related[] = [
  {
    ...RELATED_FALLBACK_UK[0],
    coverImageAlt: "Efedra Clinic — new site after redesign",
  },
  RELATED_FALLBACK_UK[1],
  {
    ...RELATED_FALLBACK_UK[2],
    metrics: "Custom design · Complex portfolio · Multi-language",
  },
];

function RelatedCard({ row }: { row: Related }) {
  const disabled = !row.href;

  const cover = (
    <div className="hp-case-cover">
      <div className="hp-case-cover-bg" style={{ background: row.gradient }} />
      <div className="hp-case-cover-dots" />
      <div
        className="hp-case-shot"
        style={
          row.coverImage
            ? { display: "flex", flexDirection: "column" }
            : undefined
        }
      >
        <div className="hp-case-shot-bar">
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
          <span className="hp-case-shot-dot" />
        </div>
        {row.coverImage ? (
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
              src={row.coverImage}
              alt={row.coverImageAlt ?? row.name}
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
      {disabled ? (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 10px",
            border: "1px solid oklch(1 0 0 / 0.18)",
            borderRadius: 999,
            background: "oklch(0 0 0 / 0.40)",
            backdropFilter: "blur(6px)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(1 0 0 / 0.85)",
          }}
        >
          Coming soon
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className="hp-case-body">
      <div className="hp-case-chips">
        <span
          className="hp-case-chip"
          style={{
            color: row.industryColor,
            borderColor: `${row.industryColor}55`,
          }}
        >
          {row.industry}
        </span>
        <span className="hp-case-chip">{row.tech}</span>
      </div>
      <div className="hp-case-name-row">
        <h3 className="hp-case-name">{row.name}</h3>
        {!disabled ? (
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        ) : null}
      </div>
      <div className="hp-case-meta">{row.meta}</div>
      <div className="hp-case-metrics">{row.metrics}</div>
    </div>
  );

  if (disabled) {
    return (
      <div
        className="hp-case-link"
        style={{
          cursor: "default",
          pointerEvents: "none",
          opacity: 0.78,
        }}
      >
        {cover}
        {body}
      </div>
    );
  }

  return (
    <Link href={row.href!} className="hp-case-link">
      {cover}
      {body}
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

  const title = loc(doc.title, locale);
  const eyebrow = loc(doc.hero?.eyebrow, locale);
  const heading = formatLine(loc(doc.hero?.heading, locale));
  const sub = loc(doc.hero?.subheading, locale);

  const homeLabel = locale === "en" ? "Home" : "Головна";
  const portfolioLabel = locale === "en" ? "Portfolio" : "Портфоліо";

  const related =
    locale === "en" ? RELATED_FALLBACK_EN : RELATED_FALLBACK_UK;
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
        <SectionBlock key={s._key} section={s} locale={locale} />
      ))}

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
              <RelatedCard key={r.name} row={r} />
            ))}
          </div>
          <Link
            href={locale === "en" ? "/portfolio" : "/portfolio"}
            className="hp-link"
          >
            {relatedLink}
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={finalHeading}
        sub={finalSub}
      />

      <HpFooter />
    </>
  );
}

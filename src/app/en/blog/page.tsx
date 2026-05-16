import type { Metadata } from "next";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard } from "@/components/blocks/related-card";

import { sanityFetch } from "@/lib/sanity/fetch";
import { BLOG_POSTS_LIST_QUERY_EN } from "@/lib/sanity/queries";
import type { BlogPostListItem } from "@/lib/sanity/types";

const UK_PATH = "/blog";
const EN_PATH = "/en/blog";

export const metadata: Metadata = {
  title: "Blog — real-project breakdowns with real numbers | Code-Site.Art",
  description:
    "Once a month — one article on a real project: budget, mistakes, what we'd do differently. No fluff, no news.",
  alternates: {
    canonical: EN_PATH,
    languages: { uk: UK_PATH, en: EN_PATH, "x-default": UK_PATH },
  },
  openGraph: {
    title: "Blog — real-project breakdowns with real numbers | Code-Site.Art",
    description:
      "Once a month — one article on a real project: budget, mistakes, what we'd do differently.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uk_UA"],
    url: EN_PATH,
  },
};

const EN_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatEnDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${EN_MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default async function BlogPageEn() {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY_EN,
    revalidate: 300,
    tags: ["blogPost"],
  }).catch(() => [] as BlogPostListItem[]);

  return (
    <>
      <HpHeader />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Home", href: "/en" }, { label: "Blog" }]}
          eyebrow="/ BLOG"
          headline={
            <>
              Blog — <em>real-project breakdowns</em> with real numbers
            </>
          }
          sub="Once a month — one article on a real project: budget, mistakes, what we'd do differently. No fluff, no news."
        />

        <section className="hp-section">
          <div className="hp-inner">
            {posts.length > 0 ? (
              <div className="hp-cases-grid">
                {posts.map((p) => {
                  const date = formatEnDate(p.publishedAt);
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} min read`
                    : undefined;
                  const metrics = [reading].filter(
                    (m): m is string => Boolean(m),
                  );
                  const cover = p.coverImage?.src
                    ? {
                        src: p.coverImage.src,
                        alt: p.coverImage.alt ?? p.title ?? "",
                      }
                    : undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={p.category}
                      metrics={metrics}
                      title={p.title ?? p.slug}
                      eyebrow={date}
                      sub={p.lede}
                      coverImage={cover}
                      href={`/en/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
            ) : (
              <p
                className="hp-sub"
                style={{ textAlign: "center", padding: "60px 0" }}
              >
                Coming soon. EN translations are in the works.
              </p>
            )}
          </div>
        </section>
      </main>
      <HpFooter />
    </>
  );
}

export const revalidate = 300;

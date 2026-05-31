import type { Metadata } from "next";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard, casesGridClass } from "@/components/blocks/related-card";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { BLOG_POSTS_LIST_QUERY } from "@/lib/server/sanity-queries";
import type { BlogPostListItem } from "@/types/sanity";
import { hpInnerClass, hpSectionClass, hpSubClass } from "@/components/homepage/shared";
import { readFilterValues } from "@/lib/shared/filters/read-filter-values";
import { dedupeCategoryRefs } from "@/lib/shared/filters/dedupe-options";
import { FilterPills } from "@/components/filters/filter-pills";

export const metadata: Metadata = {
  title: "Blog — real project breakdowns with numbers | Code-Site.Art",
  description:
    "Once a month — one article on a real project: budget, mistakes, what we'd do differently. No fluff, no news.",
  alternates: {
    canonical: "/en/blog",
    languages: {
      uk: "/blog",
      en: "/en/blog",
      "x-default": "/blog",
    },
  },
  openGraph: {
    title: "Blog — real project breakdowns with numbers | Code-Site.Art",
    description:
      "Once a month — one article on a real project: budget, mistakes, what we'd do differently.",
    type: "website",
    locale: "en_US",
    url: "/en/blog",
  },
};

function formatEnDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EnBlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { category } = readFilterValues(params, ["category"] as const);

  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
    tags: ["blogPost"],
  }).catch(() => [] as BlogPostListItem[]);

  // EN listing: only posts that have an EN translation (titleEn + slugEn).
  const enPosts = posts.filter((p) => p.titleEn && p.slugEn);

  // Pills are built from the EN subset; the color comes from the category doc.
  const pillItems = dedupeCategoryRefs(enPosts, (p) => p.category ?? null, "en");

  const filteredEnPosts = category
    ? enPosts.filter((p) => p.category?.slug === category)
    : enPosts;

  return (
    <>
      <HpHeader />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/en" },
            { label: "Blog" },
          ]}
          eyebrow="/ BLOG"
          headline={
            <>
              Blog — <em>breakdowns</em> of real projects with numbers
            </>
          }
          sub="Once a month — one article on a real project: budget, mistakes, what we'd do differently. No fluff, no news."
        />

        <section className={hpSectionClass}>
          <div className={hpInnerClass}>
            {pillItems.length > 0 ? (
              <div className="mb-10">
                <FilterPills
                  paramKey="category"
                  items={pillItems}
                  allLabel="All"
                  ariaLabel="Filter by industry"
                />
              </div>
            ) : null}

            {filteredEnPosts.length > 0 ? (
              <div className={casesGridClass}>
                {filteredEnPosts.map((p) => {
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
                        alt: p.coverImage.alt ?? p.titleEn ?? "",
                      }
                    : undefined;
                  const categoryLabel = p.category?.name?.en ?? undefined;
                  return (
                    <RelatedCard
                      key={p._id}
                      category={categoryLabel}
                      metrics={metrics}
                      title={p.titleEn ?? p.slugEn ?? ""}
                      eyebrow={date}
                      sub={p.ledeEn}
                      coverImage={cover}
                      href={`/en/blog/${p.slugEn}`}
                    />
                  );
                })}
              </div>
            ) : (
              <p className={`${hpSubClass} py-[60px] text-center`}>
                {category
                  ? "No articles in this industry yet."
                  : "Coming soon. First post is on its way."}
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

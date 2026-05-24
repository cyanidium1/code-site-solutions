import type { Metadata } from "next";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { RelatedCard } from "@/components/blocks/related-card";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { BLOG_POSTS_LIST_QUERY } from "@/lib/server/sanity-queries";
import type { BlogPostListItem } from "@/types/sanity";
export const metadata: Metadata = {
  title: "Блог — розбори реальних проєктів з цифрами | Code-Site.Art",
  description:
    "Раз на місяць — одна стаття про реальний проєкт: бюджет, помилки, що б зробили інакше. Без води і без новин.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Блог — розбори реальних проєктів з цифрами | Code-Site.Art",
    description:
      "Раз на місяць — одна стаття про реальний проєкт: бюджет, помилки, що б зробили інакше. Без води і без новин.",
    type: "website",
    locale: "uk_UA",
    url: "/blog",
  },
};

const UA_MONTHS_SHORT = [
  "січ", "лют", "бер", "кві", "тра", "чер",
  "лип", "сер", "вер", "жов", "лис", "гру",
];

function formatUkDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `${d.getDate()} ${UA_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export default async function BlogPage() {
  const posts = await sanityFetch<BlogPostListItem[]>({
    query: BLOG_POSTS_LIST_QUERY,
    revalidate: 300,
    tags: ["blogPost"],
  }).catch(() => [] as BlogPostListItem[]);

  return (
    <>
      <HpHeader />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Головна", href: "/" },
            { label: "Блог" },
          ]}
          eyebrow="/ БЛОГ"
          headline={
            <>
              Блог — <em>розбори</em> реальних проєктів з цифрами
            </>
          }
          sub="Раз на місяць — одна стаття про реальний проєкт: бюджет, помилки, що б зробили інакше. Без води і без новин."
        />

        <section className="hp-section">
          <div className="hp-inner">
            {posts.length > 0 ? (
              <div className="hp-cases-grid">
                {posts.map((p) => {
                  const date = formatUkDate(p.publishedAt);
                  const reading = p.readingTimeMinutes
                    ? `${p.readingTimeMinutes} хв читання`
                    : undefined;
                  const eyebrow = date ?? undefined;
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
                      eyebrow={eyebrow}
                      sub={p.lede}
                      coverImage={cover}
                      href={`/blog/${p.slug}`}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="hp-sub py-[60px] text-center">
                Поки що порожньо. Перший допис уже готується.
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

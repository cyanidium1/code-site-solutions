import type * as React from "react";

import { SectionHead } from "@/components/shared/section-head";

type StackItem = { name: string; cat: string };

const DEFAULT_STACK: StackItem[] = [
  { name: "Next.js", cat: "Framework" },
  { name: "Astro", cat: "Static sites" },
  { name: "React", cat: "UI library" },
  { name: "TypeScript", cat: "Language" },
  { name: "Tailwind", cat: "Styling" },
  { name: "HeroUI", cat: "Components" },
  { name: "Sanity", cat: "CMS" },
  { name: "Strapi", cat: "Headless CMS" },
  { name: "Vercel", cat: "Hosting" },
  { name: "Cloudflare", cat: "CDN + DNS" },
];

export function Stack({
  eyebrow = "СТЕК",
  heading = (
    <>
      Технології, які <em>ми вибрали</em>
    </>
  ),
  sub = "Не пробуємо все підряд. Працюємо з 10 інструментами, які знаємо до глибини.",
  items = DEFAULT_STACK,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: StackItem[];
} = {}) {
  return (
    <section className="hp-section" id="stack">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-stack">
          <div className="hp-stack-grid">
            {items.map((it) => (
              <div className="hp-stack-tile" key={it.name}>
                <div className="hp-stack-name">{it.name}</div>
                <div className="hp-stack-cat">{it.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import type * as React from "react";

import { SectionHead } from "@/components/shared/section-head";
import { hpInnerClass, hpSectionClass } from "@/components/homepage/shared";

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
    <section className={hpSectionClass} id="stack">
      <div className={hpInnerClass}>
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="relative overflow-hidden rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)] [background-image:radial-gradient(circle,oklch(1_0_0_/_0.03)_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {items.map((it) => (
              <div
                className="flex flex-col items-center justify-center border-r border-b border-line bg-[oklch(0_0_0_/_0.20)] px-4 py-10 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n)]:border-r xl:[&:nth-child(5n)]:border-r-0 xl:[&:nth-last-child(-n+5)]:border-b-0"
                key={it.name}
              >
                <div className="font-sans text-lg font-semibold text-ink">{it.name}</div>
                <div className="mt-1 font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3">
                  {it.cat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

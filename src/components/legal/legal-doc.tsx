import Link from "next/link";

import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { CookieSettingsLink } from "@/lib/cookie-consent";
import type { LegalDocCopy } from "@/content/en/privacy-policy";

/**
 * Renderer for prose legal documents (privacy policy today, more later).
 *
 * Deliberately close to <CookiePolicy>: same hero, same narrow measure, same
 * table styling. The two documents are read one after the other — a visitor
 * who follows "Cookies" from the footer and then "Privacy" should not feel
 * they landed on a different site.
 *
 * Blocks are a small closed union rather than portable text: this content is
 * authored in `src/content/`, not in the CMS, because a legal document must
 * not be editable without a code review.
 */

const tableClass =
  "w-full mt-4 border-collapse text-[13.5px] leading-[1.5] [&_th]:text-left [&_th]:font-mono [&_th]:text-[10.5px] [&_th]:tracking-[0.14em] [&_th]:uppercase [&_th]:text-ink-3 [&_th]:pb-2 [&_td]:py-2.5 [&_td]:pr-4 [&_td]:border-t [&_td]:border-line [&_td]:text-ink-dim [&_td:first-child]:text-ink";

const proseClass = "text-[14.5px] leading-[1.65] text-ink-dim";

export function LegalDoc({ copy }: { copy: LegalDocCopy }) {
  return (
    <>
      <HpHeader />
      <PageHero eyebrow={copy.eyebrow} headline={copy.title} sub={copy.sub} />
      <section className="px-6 sm:px-8 lg:px-12 pb-16">
        <div className="mx-auto max-w-container-narrow">
          <p className={proseClass}>{copy.intro}</p>

          {copy.sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2 className="font-sans text-[18px] font-bold text-ink">{section.heading}</h2>
              {section.blocks.map((block, i) => {
                if (block.kind === "p") {
                  return (
                    <p key={i} className={`${proseClass} mt-4`}>
                      {block.text}
                    </p>
                  );
                }
                if (block.kind === "ul") {
                  return (
                    <ul key={i} className={`${proseClass} mt-4 space-y-2`}>
                      {block.items.map((item) => (
                        <li key={item} className="pl-4 -indent-4 before:content-['—_']">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <div key={i} className="overflow-x-auto">
                    <table className={tableClass}>
                      <thead>
                        <tr>
                          {block.head.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, ci) => (
                              <td key={ci}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          ))}

          <p className={`${proseClass} mt-10`}>
            {copy.cookiesNote}{" "}
            <Link href={copy.cookiesHref} className="text-ink underline underline-offset-[3px]">
              {copy.cookiesLinkLabel}
            </Link>
            {". "}
            <CookieSettingsLink />
          </p>

          <p className="mt-6 font-mono text-[11px] text-ink-3">{copy.updated}</p>
        </div>
      </section>
      <HpFooter />
    </>
  );
}

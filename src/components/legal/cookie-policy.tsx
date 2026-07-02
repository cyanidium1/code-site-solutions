import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { CookieSettingsLink } from "@/lib/cookie-consent";
import type { CookiePolicyCopy } from "@/content/en/cookie-policy";

const tableClass =
  "w-full mt-4 border-collapse text-[13.5px] leading-[1.5] [&_th]:text-left [&_th]:font-mono [&_th]:text-[10.5px] [&_th]:tracking-[0.14em] [&_th]:uppercase [&_th]:text-ink-3 [&_th]:pb-2 [&_td]:py-2.5 [&_td]:pr-4 [&_td]:border-t [&_td]:border-line [&_td]:text-ink-dim [&_td:first-child]:text-ink [&_td:first-child]:font-mono [&_td:first-child]:text-[12.5px]";

export function CookiePolicy({ copy }: { copy: CookiePolicyCopy }) {
  return (
    <>
      <HpHeader />
      <PageHero eyebrow={copy.eyebrow} headline={copy.title} sub={copy.sub} />
      <section className="px-6 sm:px-8 lg:px-12 pb-16">
        <div className="mx-auto max-w-container-narrow">
          <p className="text-[14.5px] leading-[1.65] text-ink-dim">{copy.intro}</p>
          {copy.sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2 className="font-sans text-[18px] font-bold text-ink">{section.heading}</h2>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th>{copy.tableHead.name}</th>
                      <th>{copy.tableHead.provider}</th>
                      <th>{copy.tableHead.purpose}</th>
                      <th>{copy.tableHead.ttl}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.provider}</td>
                        <td>{row.purpose}</td>
                        <td>{row.ttl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <p className="mt-10 text-[14.5px] leading-[1.65] text-ink-dim">
            {copy.manage} <CookieSettingsLink />
          </p>
          <p className="mt-6 font-mono text-[11px] text-ink-3">{copy.updated}</p>
        </div>
      </section>
      <HpFooter />
    </>
  );
}

import Link from "next/link";

import { cn } from "@/components/ui";
import { hpH2Class, hpInnerClass, hpLinkClass, hpSectionClass, hpSectionHeadClass, hpSubClass } from "@/components/homepage/shared";

/**
 * "З чого почати" — in-content links from the homepage to the money pages.
 * Every external link the site earns points at the homepage; this block
 * passes that equity down with descriptive anchors (footer/nav links don't
 * count for this purpose).
 */
export function Directions({
  headingLead,
  headingEm,
  sub,
  links,
}: {
  headingLead: string;
  headingEm: string;
  sub: string;
  links: { href: string; label: string }[];
}) {
  return (
    <section className={hpSectionClass} id="directions">
      <div className={hpInnerClass}>
        <div className={hpSectionHeadClass}>
          <h2 className={hpH2Class}>
            {headingLead}
            <em>{headingEm}</em>
          </h2>
          <p className={hpSubClass}>{sub}</p>
        </div>
        {/* `hpLinkClass` carries a 36px top margin for standalone "see all"
            links; in a list it stacked to 550px on a phone (design audit
            2026-09-06, H10). The gap does the spacing, and the links are
            pills at every width. */}
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0 lg:gap-2.5">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  hpLinkClass,
                  "mt-0 rounded-full border border-line px-3.5 py-2 text-[11px] [&]:border-b hover:border-accent-40 lg:px-4 lg:py-2.5 lg:text-[12px]",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

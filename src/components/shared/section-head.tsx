import type * as React from "react";

import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpH2Class,
  hpSectionHeadClass,
  hpSubClass,
} from "@/components/homepage/shared";

/**
 * Shared section-header primitive. Renders an optional eyebrow tag,
 * an h2 heading, and an optional sub-paragraph. Used across the
 * homepage, comparison pages (vs-*), and other marketing pages.
 *
 * Utility-class strings are imported from `@/components/homepage/shared`
 * (the migration target of the legacy `.hp-section-head`, `.hp-eyebrow`,
 * `.hp-h2`, `.hp-sub` rules — see Session 7).
 */
export function SectionHead({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className={hpSectionHeadClass}>
      {eyebrow ? (
        <div className={hpEyebrowClass}>
          <span className={hpEyebrowDotClass} />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className={hpH2Class}>{heading}</h2>
      {sub ? <p className={hpSubClass}>{sub}</p> : null}
    </div>
  );
}

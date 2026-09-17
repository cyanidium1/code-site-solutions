import type * as React from "react";

import {
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
  heading,
  sub,
}: {
  /** Ignored since 2026-09-18: the eyebrow pill above section headings was
      removed site-wide as decoration without information. Kept optional so
      content objects that still carry the string keep compiling. */
  eyebrow?: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className={hpSectionHeadClass}>
      <h2 className={hpH2Class}>{heading}</h2>
      {sub ? <p className={hpSubClass}>{sub}</p> : null}
    </div>
  );
}

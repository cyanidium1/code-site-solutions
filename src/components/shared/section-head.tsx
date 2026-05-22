import type * as React from "react";

/**
 * Shared section-header primitive. Renders an optional eyebrow tag,
 * an h2 heading, and an optional sub-paragraph. Used across the
 * homepage, comparison pages (vs-*), and other marketing pages.
 *
 * The CSS classes (`hp-section-head`, `hp-eyebrow`, `hp-h2`, `hp-sub`)
 * are defined in `src/components/homepage/homepage.css`.
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
    <div className="hp-section-head">
      {eyebrow ? (
        <div className="hp-eyebrow">
          <span className="hp-eyebrow-dot" />
          <span>{eyebrow}</span>
        </div>
      ) : null}
      <h2 className="hp-h2">{heading}</h2>
      {sub ? <p className="hp-sub">{sub}</p> : null}
    </div>
  );
}

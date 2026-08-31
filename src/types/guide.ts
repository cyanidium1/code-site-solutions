/**
 * Content shape for service guides under `/guides/*` — step-by-step
 * instructions we send to a client by direct link (granting access to a
 * Google Sheet, handing over a domain, and so on).
 *
 * These pages are deliberately `noindex`: they are addressed to one client
 * at a time and have no business competing in search. They are NOT blocked
 * in robots.txt — blocking the crawl would stop Google from ever reading the
 * noindex, which is the usual way this gets done wrong.
 *
 * Data-only (no JSX) so the per-locale files stay `.ts`.
 */
export type GuideBlock =
  /** Plain paragraph. */
  | { kind: "p"; text: string }
  /** Bulleted list. */
  | { kind: "ul"; items: string[] }
  /** A path through a UI: rendered as `IAM & Admin → Service Accounts`. */
  | { kind: "path"; items: string[] }
  /** A control the reader has to press, rendered to look like the button. */
  | { kind: "action"; label: string; note?: string }
  /** A field and the value to put in it. */
  | { kind: "value"; label: string; value: string }
  /** External link the reader should open. */
  | { kind: "link"; href: string; label: string }
  /** Aside — a caveat or a reassurance, set apart from the flow. */
  | { kind: "note"; text: string }
  /**
   * Screenshot. `highlight` draws a ring over the control to press, in
   * percentages of the image box, so the annotation is not baked into the
   * PNG: it stays sharp on any screen and is corrected by editing numbers
   * rather than re-exporting the image.
   */
  | {
      kind: "image";
      src: string;
      alt: string;
      caption?: string;
      highlight?: { x: number; y: number; w: number; h: number };
    };

export type GuideStep = {
  title: string;
  blocks: GuideBlock[];
};

export type GuideContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heading: string;
  lead: string;
  /** Rough time to complete, shown next to the heading. */
  timeNote?: string;
  steps: GuideStep[];
  /** Free-form sections after the steps (security, what happens next). */
  sections?: { heading: string; blocks: GuideBlock[] }[];
  /** Closing line — who to send the result to. */
  footNote?: string;
};

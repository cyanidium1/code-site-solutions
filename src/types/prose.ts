/**
 * Content shape for long-form prose sections on marketing pages.
 *
 * Added for `/pricing`, where the measurable gap against the pages that
 * outrank us is depth: ours ran ~1 100 words against a competitor's 4 800.
 * The existing blocks all pair copy with an image or a grid, so there was
 * nowhere to put several hundred words of plain explanation.
 *
 * Data-only (no JSX) so the per-locale content files stay `.ts` and all
 * three locales share one component.
 */
export type ProseSection = {
  eyebrow: string;
  /** `[plain, em]` — rendered as `{plain} <em>{em}</em>`, same as the landing pages. */
  heading: [string, string];
  /** Optional lead-in under the heading. */
  sub?: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  /** Quiet closing line, rendered italic. */
  foot?: string;
  /** Cross-links out of the section. Hrefs are written per locale. */
  links?: { label: string; href: string }[];
};

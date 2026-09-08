/**
 * Hero showcase — the slide contract.
 *
 * Ported from the previous code-site.art build (`homePage/hero`), where the
 * hero was a colour-changing carousel: each slide argued one point, showed one
 * project, and proved it with three figures set in the marker face. That
 * structure is the thing worth keeping — a single static hero has to pick one
 * argument and drop the rest.
 *
 * Kept from the source: the per-slide wash, the three bordered figure cards,
 * the counting numerals, the 01/02/03 markers, the wordmark band underneath.
 * Not kept: the source's per-slide CTA gradients. The accent is one colour on
 * this site and the primary action keeps it, so the slide colour drives the
 * backdrop, the ghost wordmark and the dots, never the button.
 */
export type HeroFigure = {
  /** "90+", "×3.2", "$800", "4–10" — counts up when it parses as a number. */
  value: string;
  /** Short uppercase caption under the figure. */
  label: string;
};

export type HeroSlideContent = {
  /** Stable key; also the anchor used by the dots for accessibility. */
  id: string;
  /** Portfolio slug supplying the slide's photograph and its case link. */
  slug: string;
  /** Slide headline. The first slide's is the page h1. */
  title: React.ReactNode;
  description: string;
  /** Uppercase line beside the 01/02/03 markers. */
  subtitle: string;
  figures: [HeroFigure, HeroFigure, HeroFigure];
  /** Label for the link onto the pictured case, e.g. "КЕЙС: EFEDRA CLINIC". */
  caseLabel: string;
};

/**
 * Per-slide colour, sampled from the project photograph so the backdrop and
 * the picture belong to each other — the source did the same by hand.
 * `wash` is an oklch string used at low alpha behind everything.
 */
export type HeroSlideTheme = {
  wash: string;
  /** Ghost wordmark + dot colour for the active slide. */
  mark: string;
};

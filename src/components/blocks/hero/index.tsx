import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import { SanityImg } from "@/lib/shared/sanity-image";
import type { SanityImage } from "@/types/sanity";
import { formatPrice } from "@/lib/shared/format-price";
import { btnClass, H1, PLAY_ICON_CLASS } from "@/components/ui";

/* ───────────────────────────────────────────────────────────────────────
   HERO — utility classes per former hero.css block.
   Categorization key from S5.1 audit (refactor Session 5):
     U = expressed inline as Tailwind utility/arbitrary-value
     T = handled by the <H1 variant="hp"> primitive (Heading.tsx)
     E = lives in ./hero-effects.css (data-URI noise + 2 @keyframes)
   ─────────────────────────────────────────────────────────────────── */

// U — fixed background with dual accent radials + linear base. The gradient
// layers use raw OKLCH because they are oklch(from var(--color-accent) ...)
// relative-color functions that no @theme token captures.
const HERO_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)]";

// U — hero shell: pt/pb grow with viewport (mobile zero/9 → sm 8/14 →
// 2xl 6/[60px]). Horizontal padding is the canonical mobile-first
// gutter stack (24/32/48px at base/sm/lg).
const HERO_SHELL_CLASS =
  "relative z-[5] pt-0 pb-9 px-6 sm:px-8 sm:pt-8 sm:pb-14 lg:px-12 2xl:pt-6 2xl:pb-[60px]";

// U — Mobile: single column, two rows, no gap, no min-height. Grows
// to a two-column 1000px text + 1fr device layout at sm+. Gap climbs
// 0 → 22 → 28 → 48 (px) across mobile / sm / >1080 / 2xl. Compare
// variant (vs-* pages, no mockup) collapses to 50/50 at lg+.
const HERO_GRID_CLASS =
  "grid grid-cols-1 grid-rows-[auto_auto] gap-0 items-center max-w-container mx-auto min-h-0 " +
  "sm:grid-cols-[minmax(0,1000px)_minmax(0,1fr)] sm:grid-rows-none sm:gap-[22px] sm:min-h-[clamp(560px,80vh,720px)] " +
  "data-[variant=compare]:lg:grid-cols-[minmax(0,50%)_minmax(0,50%)] " +
  "min-[1081px]:gap-7 2xl:gap-12";

// U — text column wrapper.
const HERO_LEFT_CLASS = "relative z-[4]";

// U — eyebrow pill above headline. Inline-flex with accent dot + label;
// translucent white bg + 8px backdrop-blur. Grows from a 9px/tight
// pill at mobile to an 11px pill with looser tracking at sm+.
const EYEBROW_CLASS =
  "inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 border border-line-strong rounded-full text-[9px] font-medium tracking-[0.1em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] backdrop-blur-[8px] mb-[18px] " +
  "sm:gap-2.5 sm:pl-3 sm:pr-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.12em] sm:mb-8";

// U — accent dot inside the eyebrow with subtle glow. 5px at mobile,
// 6px at sm+.
const EYEBROW_DOT_CLASS =
  "w-[5px] h-[5px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] sm:w-1.5 sm:h-1.5";

// U — separator + emphasized text inside the eyebrow.
const EYEBROW_SEP_CLASS = "text-ink-3 -mx-0.5";
const EYEBROW_EM_CLASS = "text-accent font-semibold";

// T — H1 sizing handled by <H1 variant="hp"> primitive. This class
// covers ONLY the bits that aren't shared with other H1 variants:
// uppercase, m-0 mb-[18px]/mb-7, ink color, and the italic-em
// brand-gradient (line-height mobile override lives in Heading.tsx).
const HERO_H1_CLASS =
  "text-ink m-0 mb-[18px] sm:mb-7 " +
  // Italic <em> uses the brand vertical gradient (accent-soft → accent).
  // Tailwind cannot express this via a token because it relies on
  // -webkit-text-fill-color: transparent applied to the descendant.
  "[&_em]:italic [&_em]:font-medium [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:[-webkit-text-fill-color:transparent]";

// U — each H1 line is block-level with capped max-width so the headline
// wraps at the same point as the legacy design.
const H1_LINE_CLASS = "block md:max-w-[50vw]";

// U — accent row at the bottom of the H1 (big numeric KPI + label).
// Gap and mt grow with viewport: mobile is tight, 2xl gets gap-4.
const H1_ACCENT_CLASS =
  "flex items-end gap-3 mt-0.5 sm:mt-1 2xl:gap-4";

// U — big KPI number: 1.3em base, 1.4em from sm+. 800w, tabular-nums,
// brand-gradient text-clipped.
const H1_NUM_CLASS =
  "text-[1.3em] font-extrabold [font-feature-settings:'tnum'] leading-[0.85] " +
  "bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] " +
  "sm:text-[1.4em]";

// U — KPI label small text. Mobile 0.32em/0.5em pad; sm/lg/xl bumps
// to 0.34em/0.4em pad; 2xl returns to 0.32em.
const H1_NUM_LABEL_CLASS =
  "text-[0.32em] font-medium tracking-normal text-ink-dim leading-[1.15] pb-[0.5em] lowercase max-w-[8em] " +
  "sm:text-[0.34em] sm:pb-[0.4em] 2xl:text-[0.32em]";

// U — lede paragraph under H1. Mobile is full-width with tight leading;
// sm+ relaxes leading and increases margin; the 460px cap kicks in
// from >1080; 2xl bumps the margin to mb-8.
const LEDE_CLASS =
  "text-sm leading-[1.55] text-ink-dim max-w-full m-0 mb-[22px] text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "sm:leading-[1.6] sm:mb-6 " +
  "min-[1081px]:max-w-[460px] " +
  "2xl:mb-8";

// U — features grid. Mobile is a single-column bordered card with
// backdrop bg. From sm+ the card chrome strips off and the grid
// becomes 2-col; gaps and width cap grow at >1080 / 2xl.
const FEATURES_CLASS =
  "grid grid-cols-1 gap-2.5 mb-[22px] max-w-full px-4 py-3.5 border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)] " +
  "sm:grid-cols-2 sm:gap-x-3.5 sm:gap-y-2 sm:mb-[26px] sm:px-0 sm:py-0 sm:border-0 sm:rounded-none sm:bg-transparent " +
  "min-[1081px]:max-w-[460px] min-[1081px]:gap-x-[18px] min-[1081px]:gap-y-2.5 " +
  "2xl:max-w-[480px] 2xl:gap-x-6 2xl:gap-y-3 2xl:mb-9";

// U — individual feature row.
const FEAT_CLASS =
  "flex items-center gap-2.5 sm:gap-3";

// U — circular check icon. 22px at mobile, 26px at sm+.
const FEAT_CHECK_CLASS =
  "w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-accent " +
  "bg-accent-12 border border-accent-20 " +
  "[&_svg]:w-3 [&_svg]:h-3 sm:w-[26px] sm:h-[26px] [&_svg]:sm:w-[14px] [&_svg]:sm:h-[14px]";

const FEAT_LABEL_CLASS =
  "text-xs font-semibold text-ink leading-[1.2] 2xl:text-[13px]";
const FEAT_SUB_CLASS =
  "text-[10px] text-ink-3 mt-0.5 tracking-[0.02em] 2xl:text-[11px]";

// U — CTA row. Stacks as stretched-column buttons at mobile, becomes
// a wrapped flex-row at sm+; mb climbs sm → 2xl.
const CTA_ROW_CLASS =
  "flex flex-col flex-wrap gap-2.5 items-stretch mb-6 " +
  "sm:flex-row sm:gap-3 sm:items-center sm:mb-7 " +
  "2xl:mb-3.5";

const CTA_FOOTNOTE_CLASS =
  "text-[12.5px] tracking-[0.01em] text-ink-3 m-0 mb-[30px] leading-[1.5]";

// U — stats card. Flex row of 3 stat cells separated by 1px vertical
// dividers. Translucent bg with backdrop-blur. Gap/padding/radius
// grow with viewport.
const STATS_CLASS =
  "flex items-center gap-3 px-4 py-3.5 border border-line rounded-[14px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] " +
  "sm:gap-3.5 " +
  "min-[1081px]:gap-[18px] min-[1081px]:px-5 min-[1081px]:py-4 " +
  "2xl:gap-6 2xl:px-7 2xl:py-5 2xl:rounded-[18px]";

const STAT_CLASS = "flex-1 flex flex-col gap-1.5";
// Values are CMS strings and can be full phrases ("Service calculators"),
// not just numerals — 16px at base keeps three cells from wrapping/overflowing
// on ~390px viewports.
const STAT_NUM_CLASS =
  "font-sans font-bold text-[16px] tracking-[-0.03em] leading-none text-ink " +
  "sm:text-[22px] min-[1081px]:text-2xl 2xl:text-[28px]";
const STAT_LBL_CLASS =
  "text-[9px] text-ink-3 uppercase tracking-[0.08em] leading-[1.3] sm:text-[10px]";
const STAT_DIV_CLASS =
  "w-px h-[30px] bg-line sm:h-10";

// ─── Device stage (hero right column) ─────────────────────────────────

// U — perspective container holds the mockup, glow and grid overlay.
// A faint fade-to-bg ::after blends the device into the page bg on
// mobile; disabled at sm+ where the device sits inside the grid.
const DEVICE_STAGE_CLASS =
  "relative w-full h-full min-w-0 [perspective:2000px] overflow-hidden lg:overflow-visible " +
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[60px] after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] after:z-[3] after:pointer-events-none " +
  "sm:after:content-none";

// U — soft accent glow halo behind the device. Inset is negative so the
// glow extends outside the column; blurred 40px.
const DEVICE_GLOW_CLASS =
  "absolute -inset-[10%] pointer-events-none blur-[40px] " +
  "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]";

// U — dotted-grid overlay behind the device, faded out toward edges by
// an elliptical mask. Both background dot-pattern and mask must stay
// raw because they use sub-pixel circle gradients + transparent stops
// the Tailwind preset doesn't model.
const DEVICE_GRID_CLASS =
  "absolute inset-0 pointer-events-none " +
  "bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] " +
  "bg-[size:24px_24px] " +
  "[mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)] " +
  "[-webkit-mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)]";

// U — floating pill annotation on the device. Uses --animate-float
// (keyframe in hero-effects.css). Hidden on mobile, smaller pill at
// sm/lg/xl, full-size pill at 2xl. Per-pill positioning + animation
// staggering applied via inline styles below.
const DEVICE_TAG_CLASS =
  "hidden absolute z-[5] px-[11px] py-1.5 backdrop-blur-[12px] border border-line-strong rounded-full text-[10px] font-medium text-ink items-center gap-2 tracking-[0.02em] " +
  "bg-[oklch(0.22_0.008_60_/_0.85)] shadow-[0_4px_16px_oklch(0_0_0_/_0.4)] animate-float " +
  "sm:inline-flex " +
  "2xl:text-[11px] 2xl:px-3.5 2xl:py-2";

// U — per-instance position + animation-delay for each of the 3 tags.
// At <=1080 the two outer tags shift slightly inward; the middle tag
// is hidden until 2xl.
const DEVICE_TAG_POSITIONS: { style: React.CSSProperties; className: string }[] = [
  {
    style: { top: "12%", left: "2%", animationDelay: "0s" },
    className: "!top-[8%] !left-[2%] min-[1081px]:!left-[4%] 2xl:!top-[12%] 2xl:!left-[2%]",
  },
  {
    style: { top: "22%", left: "60%", animationDelay: "-2s" },
    className: "sm:!hidden 2xl:!inline-flex",
  },
  {
    style: { bottom: "28%", left: "40%", animationDelay: "-4s" },
    className: "!bottom-[22%] !left-[36%] min-[1081px]:!left-[38%] 2xl:!bottom-[28%] 2xl:!left-[40%]",
  },
];

// U — 6px accent dot inside a device-tag.
const DT_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]";

// U — small mono text suffix inside a device-tag; .dt-good variant
// tints the same span accent.
const DT_MINI_CLASS = "font-mono text-[10px] text-ink-3";
const DT_GOOD_CLASS = "text-accent";

// U — mockup wrapper: absolute, centered, transparent overflow for
// the glow halo, no pointer events so floating tags above stay clickable.
const MOCKUP_CLASS =
  "absolute w-[134%] top-[-65px] left-[-54px] lg:inset-0 flex items-center justify-center z-[2] pointer-events-none overflow-visible";

// U — mockup <img>: full-bleed on mobile, then a viewport-relative
// clamp at sm+ with a 10%-left translate so the device overlaps the
// text column; drop-shadow stack mirrors the design's 50/20px shadows.
const MOCKUP_IMG_CLASS =
  "w-full max-w-full max-h-full h-auto -translate-x-[10%] " +
  "[filter:drop-shadow(0_44px_54px_oklch(0_0_0_/_0.6))] " +
  "sm:w-[clamp(420px,50vw,1000px)] sm:max-w-none sm:max-h-none";

// U — homepage mockup variant: on mobile the image is relative and
// centered with a +10% nudge; at sm+ it becomes absolutely positioned
// + offset so the laptop hero image lands in the back-centre of the
// cluster. Uses !important on translate-x so it wins over the base
// MOCKUP_IMG_CLASS -translate-x-[10%].
const MOCKUP_IMG_HOMEPAGE_CLASS =
  "relative w-full max-w-none max-h-none !translate-x-[10%] top-[unset] left-[unset] " +
  "sm:absolute sm:w-[clamp(420px,100vw,1200px)] sm:-top-[136px] sm:-left-[272px] sm:!-translate-x-[10%]";

// U — industry/CMS mockup wrapper. Unlike the homepage composed device
// cluster — which is meant to bleed via MOCKUP_CLASS's w-[134%]/negative
// top/left offsets — a Sanity industry screenshot is a standalone image
// that must sit fully visible inside the device stage at mobile/tablet.
// The homepage wrapper only resets to inset-0 at lg, so below lg the
// industry image inherited the cluster offsets and was blown up + cropped.
// Use inset-0 at every breakpoint; lg:w-[134%] re-creates the homepage
// wrapper's exact lg geometry (its w-[134%] wins over lg:inset-0's right:0,
// so the wrapper is 134%-wide left-anchored at lg) so the verified desktop
// placement is preserved byte-for-byte.
const MOCKUP_WRAP_CONTAINED =
  "absolute inset-0 lg:w-[134%] flex items-center justify-center z-[2] pointer-events-none overflow-visible";

// U — industry/CMS mockup <img>. Below lg: contained to the stage (fits
// within the band, centered by the wrapper, no homepage -translate nudge).
// At lg+: restores the exact desktop placement from MOCKUP_IMG_CLASS
// (clamp width + max-w/h-none + 10%-left nudge) so the desktop backdrop-
// device look the desktop fix restored stays byte-for-byte the same.
const MOCKUP_IMG_CONTAINED =
  "max-w-full max-h-full w-auto h-auto " +
  "[filter:drop-shadow(0_44px_54px_oklch(0_0_0_/_0.6))] " +
  "lg:w-[clamp(420px,50vw,1000px)] lg:max-w-none lg:max-h-none lg:-translate-x-[10%]";

// U — placeholder used when no mockup src is provided. 3-layer radial
// + linear-gradient background mimics a device screen; drop-shadow
// matches the real .mockup img so layout stays balanced.
const MOCKUP_PLACEHOLDER_CLASS =
  "w-[110%] [aspect-ratio:16/10] translate-x-[2%] rounded-[14px] border border-[oklch(1_0_0_/_0.06)] relative overflow-hidden " +
  "bg-[radial-gradient(ellipse_at_28%_24%,oklch(from_var(--color-accent)_l_c_h_/_0.22)_0%,transparent_55%),radial-gradient(ellipse_at_78%_78%,oklch(0.5_0.18_280_/_0.18)_0%,transparent_55%),linear-gradient(160deg,oklch(0.18_0.012_240)_0%,oklch(0.12_0.006_250)_100%)] " +
  "[filter:drop-shadow(0_44px_54px_oklch(0_0_0_/_0.6))]";

const MOCKUP_PLACEHOLDER_BAR_CLASS =
  "absolute top-3.5 left-[18px] flex gap-1.5 [&_span]:w-[9px] [&_span]:h-[9px] [&_span]:rounded-full [&_span]:bg-[oklch(1_0_0_/_0.12)]";

// ─── Ticker (marquee row below the hero) ──────────────────────────────

// U — ticker container: relative, sits above the bg layers, hairline
// border top/bottom, padded, masked at each edge so the marquee fades
// in/out instead of cutting off hard. The mask uses a linear-gradient
// — Tailwind cannot model the 8%/92% transparent stops with a token.
const TICKER_CLASS =
  "relative z-[5] mt-6 border-t border-b border-line py-3 overflow-hidden " +
  "[mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] " +
  "[-webkit-mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] " +
  "sm:mt-10 sm:py-5";

// U — animated track. Legacy ticker keyframe (translateX 0 → -50%) is
// functionally identical to --animate-marquee, but legacy used a 40s
// duration vs the 30s default. Use the arbitrary animate shorthand
// to override only the duration while reusing the keyframe.
const TICKER_TRACK_CLASS =
  "flex gap-0 whitespace-nowrap animate-[marquee_40s_linear_infinite]";

// U — each ticker row: large display text, every even child shows in
// accent for the "•" separator color shift. The :nth-child(even)
// rule maps cleanly to [&>span:nth-child(even)].
const TICKER_ROW_CLASS =
  "flex items-center gap-[18px] font-display font-semibold text-sm tracking-[-0.02em] text-ink-dim pr-[18px] " +
  "[&_span:nth-child(even)]:text-accent " +
  "sm:gap-6 sm:text-lg sm:pr-8 " +
  "2xl:text-2xl 2xl:gap-8";

// U — device-stage wrapper. On mobile: order before text, fixed 320px
// height, bleeds full width past the gutter via negative margin trick,
// z-[-1] so it sits behind the bg-grain. From sm+ it stretches to fill
// the grid row min-height (height:100% beats aspect-ratio which Firefox
// respected but Chrome stretched, causing cross-browser image-size
// mismatch). md+ bumps min-height to 420px.
const HERO_RIGHT_CLASS =
  "relative min-w-0 -order-1 [aspect-ratio:auto] z-[-1] h-[320px] min-h-[320px] overflow-visible [contain:layout] -mx-6 -mb-10 w-[calc(100%+48px)] " +
  "sm:order-none sm:z-10 sm:h-full sm:mx-0 sm:mb-0 sm:w-full " +
  "md:min-h-[420px]";

export type Feature = { label: string; sub: string };

export function DeviceMockup({
  src,
  image,
  alt = "",
  width = 1700,
  height = 1674,
  variant = "homepage",
}: {
  /** Static /public mockup (homepage) — composed device cluster, AppImage. */
  src?: string;
  /** Sanity-hosted mockup (industry pages) — a different image type, so it
   *  uses the base in-flow sizing WITHOUT the homepage absolute-offset variant,
   *  and renders via SanityImg per docs/images.md. */
  image?: SanityImage | null;
  alt?: string;
  /** Intrinsic size of the static `src` mockup. Defaults to the homepage
   *  composition (1700×1674); other callers (e.g. vs-* pages use a 2000×1000
   *  device strip) MUST pass their image's real dimensions or next/image forces
   *  the wrong aspect ratio. */
  width?: number;
  height?: number;
  /** Placement of the static `src` mockup.
   *  - "homepage": the composed 1:1 cluster with its absolute offset/scale,
   *     tuned for /hero/hero-mockup.webp. Used ONLY by the homepage.
   *  - "strip": a self-contained, in-flow placement (no homepage offset),
   *     for the wide 2:1 device strip on the vs-* pages. Mirrors how Sanity
   *     industry mockups are placed. */
  variant?: "homepage" | "strip";
}) {
  const isHomepage = variant === "homepage";
  // A Sanity-hosted industry screenshot uses the contained placement at every
  // breakpoint below lg (so it isn't blown up + cropped by the homepage cluster
  // offsets); the static homepage/strip mockups keep MOCKUP_CLASS.
  const isContained = Boolean(image?.asset);
  return (
    <div className={isContained ? MOCKUP_WRAP_CONTAINED : MOCKUP_CLASS}>
      {image?.asset ? (
        <SanityImg
          image={image}
          alt={alt}
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className={MOCKUP_IMG_CONTAINED}
        />
      ) : src ? (
        <AppImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          fetchPriority="high"
          quality={75}
          // homepage: renders ~100vw (clamp 420px→1200px). On phones (≤640px)
          // we under-declare to 64vw so the optimizer serves a smaller source
          // for this decorative mockup — the rendered box is unchanged, only
          // fewer image pixels (mild softness, acceptable on mobile; desktop
          // stays full-res). strip: in-flow at ~50vw on desktop.
          sizes={
            isHomepage
              ? "(max-width: 640px) 64vw, (max-width: 1200px) 100vw, 1200px"
              : "(max-width: 640px) 100vw, 50vw"
          }
          className={
            isHomepage
              ? `${MOCKUP_IMG_CLASS} ${MOCKUP_IMG_HOMEPAGE_CLASS}`
              : MOCKUP_IMG_CLASS
          }
        />
      ) : (
        <div className={MOCKUP_PLACEHOLDER_CLASS} aria-hidden="true">
          <div className={MOCKUP_PLACEHOLDER_BAR_CLASS}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  );
}

export function FeatureChip({ label, sub }: Feature) {
  return (
    <div className={FEAT_CLASS}>
      <div className={FEAT_CHECK_CLASS}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <div className={FEAT_LABEL_CLASS}>{label}</div>
        <div className={FEAT_SUB_CLASS}>{sub}</div>
      </div>
    </div>
  );
}

const ARROW_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export type HeroStats = { num: string; lbl: React.ReactNode };

export type HeroEditorialProps = {
  eyebrow?: { label: string; em?: string };
  h1Lines?: React.ReactNode[];
  h1Num?: string;
  h1NumLabel?: React.ReactNode;
  lede?: React.ReactNode;
  features?: Feature[];
  ctaPrimaryLabel?: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref: string;
  ctaSecondaryShowPlay?: boolean;
  /**
   * Visual style for the secondary CTA. Defaults to "ghost" (transparent,
   * bordered) to preserve the appearance on `/sites-for/*` and `/vs-*`
   * pages. Set to "primary" to render it identically to the primary CTA
   * (white bg, shimmer on hover) — used on the home page where both CTAs
   * are primary-style. Only meaningful when `ctaSecondaryShowPlay={false}`;
   * the play-icon decoration assumes a ghost background.
   */
  ctaSecondaryVariant?: "ghost" | "primary";
  ctaFootnote?: React.ReactNode;
  showStats?: boolean;
  stats?: HeroStats[];
  showTicker?: boolean;
  tickerItems?: string[];
  deviceTags?: { kind: "default" | "good"; primary: string; mini?: string }[];
  deviceMockupSrc?: string;
  /** Intrinsic dimensions of `deviceMockupSrc` (defaults to the homepage
   *  1700×1674 composition). Pass the real size for other static mockups. */
  deviceMockupWidth?: number;
  deviceMockupHeight?: number;
  /** Placement variant for `deviceMockupSrc`. "homepage" (default) uses the
   *  composed-cluster offset; "strip" uses the in-flow placement for the wide
   *  2:1 device strip (vs-* pages). */
  deviceMockupVariant?: "homepage" | "strip";
  /** Sanity-hosted mockup (industry pages); takes precedence over deviceMockupSrc. */
  deviceMockupImage?: SanityImage | null;
  deviceMockupAlt?: string;
  /**
   * "compare" constrains the H1/lede column to ≤50% on lg+ so the
   * empty right column (no mockup on vs-* pages) doesn't let the
   * text drift wide and visually unbalance the layout.
   */
  variant?: "default" | "compare";
};

export function HeroEditorial({
  eyebrow = { label: "САЙТИ ДЛЯ МЕДИЧНОЇ ГАЛУЗІ", em: formatPrice(3500, { locale: "uk", withPrefix: true }) },
  h1Lines = [
    <>Клініка, до якої</>,
    <>
      <em>записуються</em>
    </>,
  ],
  h1Num,
  h1NumLabel,
  lede = (
    <>
      Кастомні сайти для стоматологій, багатопрофільних клінік і діагностичних
      центрів. Запуск за <em>4–6 тижнів</em>, гарантія 1 рік.
    </>
  ),
  features = [
    { label: "Онлайн-запис", sub: "за 2 кліки" },
    { label: "Локальне SEO", sub: "під район" },
    { label: "Інтеграція CRM", sub: "Bitrix · AmoCRM" },
    { label: "Юр. коректно", sub: "за вимогами МОЗ" },
  ],
  ctaPrimaryLabel = "Обговорити мій проєкт",
  ctaPrimaryHref,
  ctaSecondaryLabel = "Подивитися кейси клінік",
  ctaSecondaryHref,
  ctaSecondaryShowPlay = true,
  ctaSecondaryVariant = "ghost",
  ctaFootnote,
  showStats = true,
  stats = [
    { num: "47", lbl: <>клінік<br/>запущено</> },
    { num: "4.9/5", lbl: <>середня<br/>оцінка</> },
    { num: "×3.2", lbl: <>більше<br/>записів</> },
  ],
  showTicker = true,
  tickerItems = [
    "Стоматології",
    "Багатопрофільні клініки",
    "Діагностичні центри",
    "Косметологія",
    "Реабілітація",
    "Лабораторії",
  ],
  deviceTags = [
    { kind: "default", primary: "Онлайн-запис" },
    { kind: "default", primary: "Адаптив", mini: "100/100" },
    { kind: "good", primary: "Lighthouse", mini: "98" },
  ],
  deviceMockupSrc,
  deviceMockupWidth,
  deviceMockupHeight,
  deviceMockupVariant,
  deviceMockupImage,
  deviceMockupAlt = "Code-Site.Art — custom website mockup",
  variant = "default",
}: HeroEditorialProps) {
  return (
    <>
      <div className={HERO_BG_CLASS} />
      <div className="hero-grain" />

      <div className={HERO_SHELL_CLASS}>
        <div className={HERO_GRID_CLASS} data-variant={variant}>
          <div className={HERO_LEFT_CLASS}>
            <div className={EYEBROW_CLASS}>
              <span className={EYEBROW_DOT_CLASS} />
              <span>{eyebrow.label}</span>
              {eyebrow.em ? (
                <>
                  <span className={EYEBROW_SEP_CLASS}>/</span>
                  <span className={EYEBROW_EM_CLASS}>{eyebrow.em}</span>
                </>
              ) : null}
            </div>

            <H1 variant="hp" className={HERO_H1_CLASS} data-speakable="hero-title">
              {h1Lines.map((line, i) => (
                <span key={i} className={H1_LINE_CLASS}>
                  {line}
                </span>
              ))}
              {h1Num ? (
                <span className={`${H1_LINE_CLASS} ${H1_ACCENT_CLASS}`}>
                  <span className={H1_NUM_CLASS}>{h1Num}</span>
                  {h1NumLabel ? (
                    <span className={H1_NUM_LABEL_CLASS}>{h1NumLabel}</span>
                  ) : null}
                </span>
              ) : null}
            </H1>

            <p className={LEDE_CLASS} data-speakable="hero-description">{lede}</p>

            <div className={FEATURES_CLASS}>
              {features.map((f) => (
                <FeatureChip key={f.label} label={f.label} sub={f.sub} />
              ))}
            </div>

            <div className={CTA_ROW_CLASS}>
              <Link href={ctaPrimaryHref} className={btnClass("primary")}>
                <span>{ctaPrimaryLabel}</span>
                {ARROW_ICON}
              </Link>
              <Link href={ctaSecondaryHref} className={btnClass(ctaSecondaryVariant)}>
                {ctaSecondaryShowPlay ? (
                  <span className={PLAY_ICON_CLASS}>▶</span>
                ) : null}
                <span>{ctaSecondaryLabel}</span>
                {!ctaSecondaryShowPlay ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </Link>
            </div>
            {ctaFootnote ? <p className={CTA_FOOTNOTE_CLASS}>{ctaFootnote}</p> : null}

            {showStats && (
              <div className={STATS_CLASS}>
                {stats.map((s, i) => (
                  <span key={i} className="contents">
                    {i > 0 && <div className={STAT_DIV_CLASS} />}
                    <div className={STAT_CLASS}>
                      <div className={STAT_NUM_CLASS}>{s.num}</div>
                      <div className={STAT_LBL_CLASS}>{s.lbl}</div>
                    </div>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className={HERO_RIGHT_CLASS}>
            <div className={DEVICE_STAGE_CLASS}>
              <div className={DEVICE_GLOW_CLASS} />
              <div className={DEVICE_GRID_CLASS} />
              <DeviceMockup
                src={deviceMockupSrc}
                image={deviceMockupImage}
                alt={deviceMockupAlt}
                width={deviceMockupWidth}
                height={deviceMockupHeight}
                variant={deviceMockupVariant}
              />
              {deviceTags.map((t, i) => {
                const pos = DEVICE_TAG_POSITIONS[i] ?? DEVICE_TAG_POSITIONS[0];
                return (
                  <div
                    key={i}
                    className={`${DEVICE_TAG_CLASS} ${pos.className}`}
                    // eslint-disable-next-line react/forbid-dom-props -- per-pill top/left/animation-delay are dynamic position offsets that cannot be expressed as static utilities
                    style={pos.style}
                  >
                    {i === 0 && <span className={DT_DOT_CLASS} />}
                    <span>{t.primary}</span>
                    {t.mini && (
                      <span
                        className={`${DT_MINI_CLASS}${t.kind === "good" ? ` ${DT_GOOD_CLASS}` : ""}`}
                      >
                        {t.mini}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showTicker && (
          <div className={TICKER_CLASS}>
            <div className={TICKER_TRACK_CLASS}>
              <div className={TICKER_ROW_CLASS} key="a">
                {tickerItems.map((it, j) => (
                  <span key={j} className="contents">
                    <span>{it}</span>
                    <span>•</span>
                  </span>
                ))}
              </div>
              <div className={TICKER_ROW_CLASS} key="b" aria-hidden="true">
                {tickerItems.map((it, j) => (
                  <span key={j} className="contents">
                    <span>{it}</span>
                    <span>•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

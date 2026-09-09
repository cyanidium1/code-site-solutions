import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import { btnClass, H1 } from "@/components/ui";

/* ───────────────────────────────────────────────────────────────────────
   HOME HERO — standalone hero for the 3 home pages (uk/en/ru), split out
   of the shared `blocks/hero` HeroEditorial (Phase 0 of the 2026 home
   redesign; audit: docs/home-hero-figma-audit.md, plan:
   docs/superpowers/plans/2026-08-01-home-hero-rebuild.md).

   2026-09-09 — the fold was carrying nine things: a studio badge, four
   headline lines, a four-line lede, a 2x2 checklist, two identical filled
   buttons, a footnote, a four-cell stats bar and three technical pills over
   the mockup. Everything below is the same visual language with the noise
   taken out: offer → one-line explanation → three proofs → one CTA → one
   quiet fallback → the mockup. Nothing was added to replace what went.
   ─────────────────────────────────────────────────────────────────── */

// Fixed page backdrop: dual accent radials + linear base, plus the grain
// overlay (.hero-grain in blocks/hero/hero-effects.css — still imported
// globally). Kept on home during the redesign transition (user decision).
const HERO_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)]";

// `pt-6` below sm replaces the clearance the studio badge used to provide:
// with the badge gone the H1 is the first element of the column and its cap
// line landed exactly on the floating header's bottom edge (measured at 375:
// header bottom 68, H1 top 68).
const HERO_SHELL_CLASS =
  "relative z-[5] pt-6 pb-9 px-6 sm:px-8 sm:pt-10 sm:pb-14 lg:px-12 2xl:pt-6 2xl:pb-[60px]";

// lg–xl: a 3fr/2fr split. The Figma `minmax(0,1000px)` text track only
// leaves the mockup a real column from ~1200px up; below that it starved the
// device stage to ~50px and the laptop rendered off-screen (audit C1).
// The split starts at lg (800), not sm: at 640–800 the 2fr track is ~260px,
// which cropped the laptop and left ~450px of empty column under it —
// on the deployed build the stage collapsed to 0 and the hero mockup was
// invisible on every iPad (design audit 2026-09-07). Below 800 the mobile
// stack (text first, mockup as a full-bleed band) carries the hero instead.
const HERO_GRID_CLASS =
  "grid grid-cols-1 grid-rows-[auto_auto] gap-0 items-center max-w-container mx-auto min-h-0 " +
  "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-none lg:gap-[22px] lg:min-h-[clamp(560px,80vh,720px)] " +
  "min-[1081px]:gap-7 min-[1250px]:grid-cols-[minmax(0,1000px)_minmax(0,1fr)] 2xl:gap-12";

// Mobile (< lg) is a flex column so the children can be re-ordered with
// `order-*`: H1 → lede → CTA → footnote → features, then the device mockup
// (grid row 2). Audit 2026-09-06, C3: with the mockup first the H1 started
// at 395px and the first CTA at 837px on a 844px viewport — nothing
// actionable above the fold.
const HERO_LEFT_CLASS = "relative z-[4] flex flex-col lg:block";

const HERO_H1_CLASS =
  "text-ink m-0 mb-[18px] sm:mb-7 " +
  "[&_em]:italic [&_em]:font-medium [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:[-webkit-text-fill-color:transparent]";

// The 50vw cap keeps the headline clear of the mockup column, so it starts
// with that column at lg — below it the hero is a single stack and the cap
// only wasted half the width (design audit 2026-09-07).
const H1_LINE_CLASS = "block lg:max-w-[50vw]";

const LEDE_CLASS =
  "text-sm leading-[1.55] text-ink-dim max-w-full m-0 mb-[22px] text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "sm:leading-[1.6] sm:mb-6 " +
  "lg:max-w-[440px] min-[1081px]:max-w-[460px] " +
  "2xl:mb-8";

// Three proofs in one row, not four in a 2x2 block. The fourth ("everything
// end-to-end") only restated the lede, and the square grid read as a second
// paragraph rather than as evidence. Mobile keeps the bordered card: it is
// what groups three short facts on a narrow screen.
// The margin lives at lg only — below it `order-4` makes this the last block
// of the column, where a bottom margin is just trailing air.
const FEATURES_CLASS =
  "order-4 lg:order-none grid grid-cols-1 gap-2 mb-0 max-w-full px-3.5 py-3 border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)] " +
  "sm:grid-cols-3 sm:gap-x-3.5 sm:gap-y-0 sm:max-w-[560px] sm:px-0 sm:py-0 sm:border-0 sm:rounded-none sm:bg-transparent " +
  "lg:mb-7 " +
  "min-[1081px]:max-w-[480px] min-[1081px]:gap-x-4 " +
  "2xl:max-w-[520px] 2xl:gap-x-5 2xl:mb-9";

// Top-aligned from sm up: in three columns the sub line wraps, and centring
// then floated the tick against a two-line block.
const FEAT_CLASS = "flex items-center gap-2.5 sm:items-start sm:gap-2.5";

const FEAT_CHECK_CLASS =
  "w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 text-accent " +
  "bg-accent-12 border border-accent-20 " +
  "[&_svg]:w-2.5 [&_svg]:h-2.5 sm:w-5 sm:h-5 sm:mt-px [&_svg]:sm:w-3 [&_svg]:sm:h-3";

const FEAT_LABEL_CLASS =
  "text-xs font-semibold text-ink leading-[1.2] 2xl:text-[13px]";
const FEAT_SUB_CLASS =
  "text-[10px] leading-[1.35] text-ink-3 mt-0.5 tracking-[0.02em] 2xl:text-[11px]";

const CTA_ROW_CLASS =
  "order-2 lg:order-none flex flex-col flex-wrap gap-3 items-stretch mb-4 " +
  "sm:flex-row sm:gap-5 sm:items-center " +
  "2xl:mb-5";

// Text link, not a second pill. Two filled buttons of equal weight gave the
// fold two "next steps" and therefore none — the audit is the fallback for a
// visitor who is not ready to price a project yet. `min-h-11` keeps the 44px
// touch target the pill gets from btnClass.
const CTA_SECONDARY_CLASS =
  "inline-flex min-h-11 items-center gap-2 self-start " +
  "font-sans text-[13px] font-medium text-ink-dim no-underline " +
  "transition-colors duration-200 hover:text-ink " +
  "[&_svg]:transition-transform [&_svg]:duration-[0.25s] [&_svg]:ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "hover:[&_svg]:translate-x-1";

// Sits directly under the CTA pair and explains only the audit offer, so it
// keeps a short measure. Last block of the column at lg — no bottom margin
// there; below lg `order-3` puts the features after it.
const CTA_FOOTNOTE_CLASS =
  "order-3 lg:order-none max-w-[440px] text-[12px] tracking-[0.01em] text-ink-3 m-0 mb-6 leading-[1.5] " +
  "sm:mb-7 lg:mb-0";

const DEVICE_STAGE_CLASS =
  "relative w-full h-full min-w-0 [perspective:2000px] overflow-hidden lg:overflow-visible " +
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[60px] after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] after:z-[3] after:pointer-events-none " +
  "lg:after:content-none";

const DEVICE_GLOW_CLASS =
  "absolute -inset-[10%] pointer-events-none blur-[40px] " +
  "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]";

const DEVICE_GRID_CLASS =
  "absolute inset-0 pointer-events-none " +
  "bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] " +
  "bg-[size:24px_24px] " +
  "[mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)] " +
  "[-webkit-mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)]";

const MOCKUP_CLASS =
  "absolute w-[134%] top-[-40px] left-[-54px] lg:inset-0 flex items-center justify-center z-[2] pointer-events-none overflow-visible";

const MOCKUP_IMG_CLASS =
  "w-full max-w-full max-h-full h-auto -translate-x-[10%] " +
  "[filter:drop-shadow(0_44px_54px_oklch(0_0_0_/_0.6))] " +
  "sm:w-[clamp(420px,50vw,1000px)] sm:max-w-none sm:max-h-none";

// The 1440-design placement (100vw wide, −272px left, −10% translate) is
// tuned for a 1000px text track and only composes once the viewport can
// hold it: at 1100–1200 it blew the mockup up until the laptop and both
// pills were cut off by the right edge (audit 2026-09-06 C1, re-measured
// 2026-09-07 — iPad landscape is 1133 and iPad Pro 11" is 1194). The mid
// ladder keeps the mockup inside its column up to 1250; the Figma numbers
// return with the 1000px text track. Below lg the mockup is the full-bleed
// band, so it stays in flow — `!w-*` also beats MOCKUP_IMG_CLASS's
// `sm:w-[clamp(420px,…)]` floor there.
const MOCKUP_IMG_HOMEPAGE_CLASS =
  "relative w-full !max-w-none max-h-none !translate-x-[10%] top-[unset] left-[unset] " +
  "sm:!w-[86%] sm:!translate-x-[8%] " +
  "lg:absolute lg:!w-[50vw] lg:-top-[40px] lg:-left-[12%] lg:!-translate-x-[6%] " +
  "min-[1250px]:!w-[clamp(420px,100vw,1200px)] min-[1250px]:-top-[136px] min-[1250px]:-left-[272px] min-[1250px]:!-translate-x-[10%]";

const HERO_RIGHT_CLASS =
  "relative min-w-0 [aspect-ratio:auto] z-[-1] h-[260px] min-h-[260px] overflow-visible [contain:layout] -mx-6 mt-2 -mb-6 w-[calc(100%+48px)] " +
  "sm:-mx-8 sm:w-[calc(100%+64px)] " +
  "md:min-h-[420px] " +
  "lg:z-10 lg:h-full lg:mx-0 lg:mt-0 lg:mb-0 lg:w-full";

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

const SECONDARY_ARROW_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function FeatureChip({ label, sub }: { label: string; sub: string }) {
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

export type HomeHeroProps = {
  h1Lines: React.ReactNode[];
  lede: React.ReactNode;
  features: { label: string; sub: string }[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  ctaFootnote: React.ReactNode;
  deviceMockupSrc: string;
  deviceMockupAlt: string;
};

export function HomeHero({
  h1Lines,
  lede,
  features,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ctaFootnote,
  deviceMockupSrc,
  deviceMockupAlt,
}: HomeHeroProps) {
  return (
    <>
      <div className={HERO_BG_CLASS} />
      <div className="hero-grain" />

      <div className={HERO_SHELL_CLASS}>
        <div className={HERO_GRID_CLASS}>
          <div className={HERO_LEFT_CLASS}>
            <H1 variant="hp" className={HERO_H1_CLASS} data-speakable="hero-title">
              {h1Lines.map((line, i) => (
                <span key={i} className={H1_LINE_CLASS}>
                  {line}
                </span>
              ))}
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
              <Link href={ctaSecondaryHref} className={CTA_SECONDARY_CLASS}>
                <span>{ctaSecondaryLabel}</span>
                {SECONDARY_ARROW_ICON}
              </Link>
            </div>
            <p className={CTA_FOOTNOTE_CLASS}>{ctaFootnote}</p>
          </div>

          <div className={HERO_RIGHT_CLASS}>
            <div className={DEVICE_STAGE_CLASS}>
              <div className={DEVICE_GLOW_CLASS} />
              <div className={DEVICE_GRID_CLASS} />
              <div className={MOCKUP_CLASS}>
                <AppImage
                  src={deviceMockupSrc}
                  alt={deviceMockupAlt}
                  width={1700}
                  height={1674}
                  priority
                  fetchPriority="high"
                  quality={75}
                  sizes="(max-width: 640px) 64vw, (max-width: 1200px) 100vw, 1200px"
                  className={`${MOCKUP_IMG_CLASS} ${MOCKUP_IMG_HOMEPAGE_CLASS}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/shared/format-price";
import { btnClass, H1, PLAY_ICON_CLASS } from "@/components/ui";
import "./hero-effects.css";

/* ───────────────────────────────────────────────────────────────────────
   HERO — utility classes per former hero.css block.
   Categorization key from S5.1 audit (refactor Session 5):
     U = expressed inline as Tailwind utility/arbitrary-value
     T = handled by the <H1 variant="hp"> primitive (Heading.tsx)
     E = lives in ./hero-effects.css (data-URI noise + 2 @keyframes)
   ─────────────────────────────────────────────────────────────────── */

// U — fixed background with dual accent radials + linear base; ::before
// paints an 80px grid clipped by a radial mask. Both gradient layers and
// the mask use raw OKLCH because they are oklch(from var(--color-accent) ...)
// relative-color functions that no @theme token captures.
const HERO_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)] " +
  "before:content-[''] before:absolute before:inset-0 " +
  "before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.025)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.025)_1px,transparent_1px)] " +
  "before:bg-[size:80px_80px] " +
  "before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)] " +
  "before:[-webkit-mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]";

// U — hero shell: top padding shrinks at ≤1440 and zeroes at ≤640;
// bottom padding shrinks at both breakpoints. Horizontal padding is the
// canonical mobile-first gutter stack (24/32/48px at base/sm/lg).
const HERO_SHELL_CLASS =
  "relative z-[5] pt-6 px-6 sm:px-8 lg:px-12 pb-[60px] " +
  "max-[1440px]:pt-8 max-[1440px]:pb-14 " +
  "max-sm:pt-0 max-sm:pb-9";

// U — two-column grid: 1000px text col + 1fr device col, 48px gap,
// center-aligned, capped at --container-max. min-height is a clamp
// (intrinsic on 13" laptops, capped at 720px on big screens) so the
// hero stays balanced without overflowing short viewports. Compare
// variant (vs-* pages, no mockup) collapses to 50/50 at ≥1024. Gap
// shrinks at ≤1440 / ≤1080; collapses to single column at ≤640.
const HERO_GRID_CLASS =
  "grid grid-cols-[minmax(0,1000px)_minmax(0,1fr)] gap-12 items-center max-w-container mx-auto min-h-[clamp(560px,80vh,720px)] " +
  "data-[variant=compare]:lg:grid-cols-[minmax(0,50%)_minmax(0,50%)] " +
  "max-[1440px]:gap-7 " +
  "max-[1080px]:gap-[22px] " +
  "max-sm:grid-cols-[minmax(0,1fr)] max-sm:grid-rows-[auto_auto] max-sm:gap-0 max-sm:min-h-0";

// U — text column wrapper.
const HERO_LEFT_CLASS = "relative z-[4]";

// U — eyebrow pill above headline. Inline-flex with accent dot + label;
// translucent white bg + 8px backdrop-blur. At ≤640: shrinks padding,
// font-size and dot. Padding 6px 12px 6px 10px → mirrored.
const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 pl-3 pr-3.5 py-2 border border-line-strong rounded-full text-[11px] font-medium tracking-[0.12em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] backdrop-blur-[8px] mb-8 " +
  "max-sm:text-[9px] max-sm:pl-2.5 max-sm:pr-3 max-sm:py-1.5 max-sm:gap-2 max-sm:mb-[18px] max-sm:tracking-[0.1em]";

// U — 6px accent dot inside the eyebrow with subtle glow.
const EYEBROW_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] max-sm:w-[5px] max-sm:h-[5px]";

// U — separator + emphasized text inside the eyebrow.
const EYEBROW_SEP_CLASS = "text-[var(--color-ink-3)] -mx-0.5";
const EYEBROW_EM_CLASS = "text-accent font-semibold";

// T — H1 sizing handled by <H1 variant="hp"> primitive. This class
// covers ONLY the bits that aren't shared with other H1 variants:
// uppercase, m-0 mb-7, ink color, and the italic-em brand-gradient
// + the line-height mobile override (handled inside Heading.tsx hp row).
// margin-bottom shrinks at ≤640 to 18px.
const HERO_H1_CLASS =
  "text-ink m-0 mb-7 max-sm:mb-[18px] " +
  // Italic <em> uses the brand vertical gradient (accent-soft → accent).
  // Tailwind cannot express this via a token because it relies on
  // -webkit-text-fill-color: transparent applied to the descendant.
  "[&_em]:italic [&_em]:font-medium [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:[-webkit-text-fill-color:transparent]";

// U — each H1 line is block-level with capped max-width so the headline
// wraps at the same point as the legacy design.
const H1_LINE_CLASS = "block max-w-[50vw]";

// U — accent row at the bottom of the H1 (big numeric KPI + label).
// Gap shrinks at ≤1440. Mobile keeps row direction but tightens gap.
const H1_ACCENT_CLASS =
  "flex items-end gap-4 mt-1 " +
  "max-[1440px]:gap-3 " +
  "max-sm:gap-3 max-sm:mt-0.5";

// U — the big KPI number: 1.4em (relative to surrounding H1), 800w,
// tabular-nums, brand-gradient text-clipped. Mobile drops to 1.3em.
const H1_NUM_CLASS =
  "text-[1.4em] font-extrabold [font-feature-settings:'tnum'] leading-[0.85] " +
  "bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] " +
  "max-sm:text-[1.3em]";

// U — KPI label small text, sits next to the number.
const H1_NUM_LABEL_CLASS =
  "text-[0.32em] font-medium tracking-normal text-ink-dim leading-[1.15] pb-[0.4em] lowercase max-w-[8em] " +
  "max-[1440px]:text-[0.34em] " +
  "max-sm:text-[0.32em] max-sm:pb-[0.5em]";

// U — lede paragraph under H1. Width caps differ across breakpoints;
// at ≤1080 it spans the full text column.
const LEDE_CLASS =
  "text-sm leading-[1.6] text-ink-dim max-w-[460px] m-0 mb-8 text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "max-[1440px]:max-w-[460px] max-[1440px]:mb-6 " +
  "max-[1080px]:max-w-full " +
  "max-sm:leading-[1.55] max-sm:mb-[22px] max-sm:max-w-full";

// U — 2-col features grid. Mobile collapses to single column inside
// a bordered card with backdrop bg (this is the only place where
// the .features rule itself gains a border/padding/bg on ≤640, so
// the utility list is correspondingly long there).
const FEATURES_CLASS =
  "grid grid-cols-2 gap-x-6 gap-y-3 mb-9 max-w-[480px] " +
  "max-[1440px]:max-w-[460px] max-[1440px]:gap-x-[18px] max-[1440px]:gap-y-2.5 max-[1440px]:mb-[26px] " +
  "max-[1080px]:max-w-full max-[1080px]:gap-x-3.5 max-[1080px]:gap-y-2 " +
  "max-sm:grid-cols-1 max-sm:gap-2.5 max-sm:mb-[22px] max-sm:px-4 max-sm:py-3.5 max-sm:border max-sm:border-line max-sm:rounded-2xl max-sm:bg-[oklch(1_0_0_/_0.02)]";

// U — individual feature row.
const FEAT_CLASS =
  "flex items-center gap-3 max-sm:gap-2.5";

// U — circular check icon.
const FEAT_CHECK_CLASS =
  "w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-accent " +
  "bg-accent-12 border border-[oklch(from_var(--color-accent)_l_c_h_/_0.2)] " +
  "max-sm:w-[22px] max-sm:h-[22px] [&_svg]:max-sm:w-3 [&_svg]:max-sm:h-3";

const FEAT_LABEL_CLASS =
  "text-[13px] font-semibold text-ink leading-[1.2] " +
  "max-[1440px]:text-xs max-sm:text-xs";
const FEAT_SUB_CLASS =
  "text-[11px] text-[var(--color-ink-3)] mt-0.5 tracking-[0.02em] " +
  "max-[1440px]:text-[10px] max-sm:text-[10px]";

// U — CTA row. Wraps below at ≤640 to stretched-column buttons.
const CTA_ROW_CLASS =
  "flex gap-3 flex-wrap items-center mb-3.5 " +
  "max-[1440px]:mb-7 " +
  "max-sm:flex-col max-sm:gap-2.5 max-sm:items-stretch max-sm:mb-6";

const CTA_FOOTNOTE_CLASS =
  "text-[12.5px] tracking-[0.01em] text-[var(--color-ink-3)] m-0 mb-[30px] leading-[1.5]";

// U — stats card. Flex row of 3 stat cells separated by 1px vertical
// dividers. Translucent bg with backdrop-blur. Padding/gap tighten at
// each breakpoint per legacy.
const STATS_CLASS =
  "flex items-center gap-6 px-7 py-5 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] " +
  "max-[1440px]:px-5 max-[1440px]:py-4 max-[1440px]:gap-[18px] " +
  "max-[1080px]:gap-3.5 max-[1080px]:px-4 max-[1080px]:py-3.5 " +
  "max-sm:px-4 max-sm:py-3.5 max-sm:gap-3 max-sm:rounded-[14px] max-sm:max-w-full";

const STAT_CLASS = "flex-1 flex flex-col gap-1.5";
const STAT_NUM_CLASS =
  "font-sans font-bold text-[28px] tracking-[-0.03em] leading-none text-ink " +
  "max-[1440px]:text-2xl max-[1080px]:text-[22px] max-sm:text-[22px]";
const STAT_LBL_CLASS =
  "text-[10px] text-[var(--color-ink-3)] uppercase tracking-[0.08em] leading-[1.3] " +
  "max-sm:text-[9px]";
const STAT_DIV_CLASS =
  "w-px h-10 bg-line max-sm:h-[30px]";

// ─── Device stage (hero right column) ─────────────────────────────────

// U — perspective container holds the mockup, glow and grid overlay.
// On mobile a faint fade-to-bg ::after blends the device image into the
// background below the hero.
const DEVICE_STAGE_CLASS =
  "relative w-full h-full min-w-0 [perspective:2000px] overflow-visible " +
  "max-sm:after:content-[''] max-sm:after:absolute max-sm:after:bottom-0 max-sm:after:left-0 max-sm:after:right-0 max-sm:after:h-[60px] max-sm:after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] max-sm:after:z-[3] max-sm:after:pointer-events-none";

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
// (keyframe in hero-effects.css). Per-pill positioning + animation
// staggering applied via inline styles below since the offsets are
// per-instance and not part of any shared utility.
const DEVICE_TAG_CLASS =
  "absolute z-[5] px-3.5 py-2 backdrop-blur-[12px] border border-line-strong rounded-full text-[11px] font-medium text-ink inline-flex items-center gap-2 tracking-[0.02em] " +
  "bg-[oklch(0.22_0.008_60_/_0.85)] shadow-[0_4px_16px_oklch(0_0_0_/_0.4)] animate-float " +
  "max-[1440px]:text-[10px] max-[1440px]:px-[11px] max-[1440px]:py-1.5 " +
  "max-sm:hidden";

// U — per-instance position + animation-delay for each of the 3 tags.
// On ≤1440 tag 2 is hidden and the other two shift slightly inward.
const DEVICE_TAG_POSITIONS: { style: React.CSSProperties; className: string }[] = [
  {
    style: { top: "12%", left: "2%", animationDelay: "0s" },
    className: "max-[1440px]:!top-[8%] max-[1440px]:!left-[4%] max-[1080px]:!left-[2%]",
  },
  {
    style: { top: "22%", left: "60%", animationDelay: "-2s" },
    className: "max-[1440px]:hidden",
  },
  {
    style: { bottom: "28%", left: "40%", animationDelay: "-4s" },
    className: "max-[1440px]:!bottom-[22%] max-[1440px]:!left-[38%] max-[1080px]:!left-[36%]",
  },
];

// U — 6px accent dot inside a device-tag.
const DT_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]";

// U — small mono text suffix inside a device-tag; .dt-good variant
// tints the same span accent.
const DT_MINI_CLASS = "font-mono text-[10px] text-[var(--color-ink-3)]";
const DT_GOOD_CLASS = "text-accent";

// U — mockup wrapper: absolute, centered, transparent overflow for
// the glow halo, no pointer events so floating tags above stay clickable.
const MOCKUP_CLASS =
  "absolute inset-0 flex items-center justify-center z-[2] pointer-events-none overflow-visible";

// U — mockup <img>: viewport-relative size clamp + translateX bleed so
// the device overlaps the text column; drop-shadow stack mirrors the
// design's 50px/20px shadows. Mobile becomes 100% width centered.
const MOCKUP_IMG_CLASS =
  "w-[clamp(420px,50vw,1000px)] h-auto max-w-none max-h-none -translate-x-[10%] " +
  "[filter:drop-shadow(0_50px_60px_oklch(0_0_0_/_0.55))_drop-shadow(0_20px_30px_oklch(0_0_0_/_0.35))] " +
  "max-sm:w-full max-sm:max-w-full max-sm:max-h-full";

// U — homepage mockup variant: absolutely positioned + offset so the
// laptop hero image lands in the back-centre of the cluster. Width
// uses a larger clamp (this image is the full design composition).
const MOCKUP_IMG_HOMEPAGE_CLASS =
  "w-[clamp(420px,100vw,1200px)] absolute -top-[136px] -left-[272px] " +
  "max-sm:w-full max-sm:relative max-sm:top-[unset] max-sm:left-[unset] max-sm:max-w-none max-sm:max-h-none max-sm:translate-x-[10%]";

// U — placeholder used when no mockup src is provided. 3-layer radial
// + linear-gradient background mimics a device screen; drop-shadow
// matches the real .mockup img so layout stays balanced.
const MOCKUP_PLACEHOLDER_CLASS =
  "w-[110%] [aspect-ratio:16/10] translate-x-[2%] rounded-[14px] border border-[oklch(1_0_0_/_0.06)] relative overflow-hidden " +
  "bg-[radial-gradient(ellipse_at_28%_24%,oklch(from_var(--color-accent)_l_c_h_/_0.22)_0%,transparent_55%),radial-gradient(ellipse_at_78%_78%,oklch(0.5_0.18_280_/_0.18)_0%,transparent_55%),linear-gradient(160deg,oklch(0.18_0.012_240)_0%,oklch(0.12_0.006_250)_100%)] " +
  "[filter:drop-shadow(0_50px_60px_oklch(0_0_0_/_0.55))_drop-shadow(0_20px_30px_oklch(0_0_0_/_0.35))]";

const MOCKUP_PLACEHOLDER_BAR_CLASS =
  "absolute top-3.5 left-[18px] flex gap-1.5 [&_span]:w-[9px] [&_span]:h-[9px] [&_span]:rounded-full [&_span]:bg-[oklch(1_0_0_/_0.12)]";

// ─── Ticker (marquee row below the hero) ──────────────────────────────

// U — ticker container: relative, sits above the bg layers, hairline
// border top/bottom, padded, masked at each edge so the marquee fades
// in/out instead of cutting off hard. The mask uses a linear-gradient
// — Tailwind cannot model the 8%/92% transparent stops with a token.
const TICKER_CLASS =
  "relative z-[5] mt-10 border-t border-b border-line py-5 overflow-hidden " +
  "[mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] " +
  "[-webkit-mask:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] " +
  "max-sm:mt-6 max-sm:py-3";

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
  "flex items-center gap-8 font-display font-semibold text-2xl tracking-[-0.02em] text-ink-dim pr-8 " +
  "[&_span:nth-child(even)]:text-accent " +
  "max-[1440px]:text-lg max-[1440px]:gap-6 " +
  "max-sm:text-sm max-sm:gap-[18px] max-sm:pr-[18px]";

// U — device-stage wrapper. Stretches to fill the grid row min-height
// (height:100% beats the prior aspect-ratio which Firefox respected
// but Chrome stretched, causing cross-browser image-size mismatch).
// On mobile: order before text, fixed 320px height, bleeds full width
// past the gutter via negative margin trick.
const HERO_RIGHT_CLASS =
  "relative min-w-0 w-full h-full min-h-[420px] overflow-visible [contain:layout] z-10 " +
  "max-sm:-order-1 max-sm:[aspect-ratio:auto] max-sm:z-[-1] max-sm:h-[320px] " +
  "max-sm:-mx-6 max-sm:-mb-10 max-sm:w-[calc(100%+48px)]";

export type Feature = { label: string; sub: string };

export function DeviceMockup({
  src,
  alt = "",
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <div className={MOCKUP_CLASS}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={1700}
          height={1674}
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 100vw"
          className={`${MOCKUP_IMG_CLASS} ${MOCKUP_IMG_HOMEPAGE_CLASS}`}
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
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  ctaSecondaryShowPlay?: boolean;
  ctaFootnote?: React.ReactNode;
  showStats?: boolean;
  stats?: HeroStats[];
  showTicker?: boolean;
  tickerItems?: string[];
  deviceTags?: { kind: "default" | "good"; primary: string; mini?: string }[];
  deviceMockupSrc?: string;
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

            <H1 variant="hp" className={HERO_H1_CLASS}>
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

            <p className={LEDE_CLASS}>{lede}</p>

            <div className={FEATURES_CLASS}>
              {features.map((f) => (
                <FeatureChip key={f.label} label={f.label} sub={f.sub} />
              ))}
            </div>

            <div className={CTA_ROW_CLASS}>
              {ctaPrimaryHref ? (
                <Link href={ctaPrimaryHref} className={btnClass("primary")}>
                  <span>{ctaPrimaryLabel}</span>
                  {ARROW_ICON}
                </Link>
              ) : (
                <button className={btnClass("primary")}>
                  <span>{ctaPrimaryLabel}</span>
                  {ARROW_ICON}
                </button>
              )}
              {ctaSecondaryHref ? (
                <Link href={ctaSecondaryHref} className={btnClass("ghost")}>
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
              ) : (
                <button className={btnClass("ghost")}>
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
                </button>
              )}
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
              <DeviceMockup src={deviceMockupSrc} />
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
              {[...Array(2)].map((_, i) => (
                <div className={TICKER_ROW_CLASS} key={i}>
                  {tickerItems.map((it, j) => (
                    <span key={j} className="contents">
                      <span>{it}</span>
                      <span>•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

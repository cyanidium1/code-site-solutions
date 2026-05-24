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
// the mask use raw OKLCH because they are oklch(from var(--accent) ...)
// relative-color functions that no @theme token captures.
const HERO_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--bg)_0%,var(--bg-2)_100%)] " +
  "before:content-[''] before:absolute before:inset-0 " +
  "before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.025)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.025)_1px,transparent_1px)] " +
  "before:bg-[size:80px_80px] " +
  "before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)] " +
  "before:[-webkit-mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]";

// U — hero shell: top padding shrinks at ≤1440 and zeroes at ≤640;
// bottom padding shrinks at both breakpoints. Horizontal padding is the
// shared --gutter-x token from globals.css.
const HERO_SHELL_CLASS =
  "relative z-[5] pt-6 px-(--gutter-x) pb-[60px] " +
  "max-[1440px]:pt-8 max-[1440px]:pb-14 " +
  "max-[640px]:pt-0 max-[640px]:pb-9";

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
  "max-[640px]:grid-cols-[minmax(0,1fr)] max-[640px]:grid-rows-[auto_auto] max-[640px]:gap-0 max-[640px]:min-h-0";

// U — text column wrapper.
const HERO_LEFT_CLASS = "relative z-[4]";

// U — eyebrow pill above headline. Inline-flex with accent dot + label;
// translucent white bg + 8px backdrop-blur. At ≤640: shrinks padding,
// font-size and dot. Padding 6px 12px 6px 10px → mirrored.
const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 pl-3 pr-3.5 py-2 border border-line-strong rounded-full text-[11px] font-medium tracking-[0.12em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] backdrop-blur-[8px] mb-8 " +
  "max-[640px]:text-[9px] max-[640px]:pl-2.5 max-[640px]:pr-3 max-[640px]:py-1.5 max-[640px]:gap-2 max-[640px]:mb-[18px] max-[640px]:tracking-[0.1em]";

// U — 6px accent dot inside the eyebrow with subtle glow.
const EYEBROW_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] max-[640px]:w-[5px] max-[640px]:h-[5px]";

// U — separator + emphasized text inside the eyebrow.
const EYEBROW_SEP_CLASS = "text-[var(--ink-3)] -mx-0.5";
const EYEBROW_EM_CLASS = "text-accent font-semibold";

// T — H1 sizing handled by <H1 variant="hp"> primitive. This class
// covers ONLY the bits that aren't shared with other H1 variants:
// uppercase, m-0 mb-7, ink color, and the italic-em brand-gradient
// + the line-height mobile override (handled inside Heading.tsx hp row).
// margin-bottom shrinks at ≤640 to 18px.
const HERO_H1_CLASS =
  "text-ink m-0 mb-7 max-[640px]:mb-[18px] " +
  // Italic <em> uses the brand vertical gradient (accent-soft → accent).
  // Tailwind cannot express this via a token because it relies on
  // -webkit-text-fill-color: transparent applied to the descendant.
  "[&_em]:italic [&_em]:font-medium [&_em]:bg-[linear-gradient(180deg,var(--accent-soft)_0%,var(--accent)_100%)] [&_em]:bg-clip-text [&_em]:[-webkit-text-fill-color:transparent]";

// U — each H1 line is block-level with capped max-width so the headline
// wraps at the same point as the legacy design.
const H1_LINE_CLASS = "block max-w-[50vw]";

// U — accent row at the bottom of the H1 (big numeric KPI + label).
// Gap shrinks at ≤1440. Mobile keeps row direction but tightens gap.
const H1_ACCENT_CLASS =
  "flex items-end gap-4 mt-1 " +
  "max-[1440px]:gap-3 " +
  "max-[640px]:gap-3 max-[640px]:mt-0.5";

// U — the big KPI number: 1.4em (relative to surrounding H1), 800w,
// tabular-nums, brand-gradient text-clipped. Mobile drops to 1.3em.
const H1_NUM_CLASS =
  "text-[1.4em] font-extrabold [font-feature-settings:'tnum'] leading-[0.85] " +
  "bg-[linear-gradient(180deg,var(--accent-soft)_0%,var(--accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] " +
  "max-[640px]:text-[1.3em]";

// U — KPI label small text, sits next to the number.
const H1_NUM_LABEL_CLASS =
  "text-[0.32em] font-medium tracking-normal text-ink-dim leading-[1.15] pb-[0.4em] lowercase max-w-[8em] " +
  "max-[1440px]:text-[0.34em] " +
  "max-[640px]:text-[0.32em] max-[640px]:pb-[0.5em]";

// U — lede paragraph under H1. Width caps differ across breakpoints;
// at ≤1080 it spans the full text column.
const LEDE_CLASS =
  "text-sm leading-[1.6] text-ink-dim max-w-[460px] m-0 mb-8 text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "max-[1440px]:max-w-[460px] max-[1440px]:mb-6 " +
  "max-[1080px]:max-w-full " +
  "max-[640px]:leading-[1.55] max-[640px]:mb-[22px] max-[640px]:max-w-full";

// U — 2-col features grid. Mobile collapses to single column inside
// a bordered card with backdrop bg (this is the only place where
// the .features rule itself gains a border/padding/bg on ≤640, so
// the utility list is correspondingly long there).
const FEATURES_CLASS =
  "grid grid-cols-2 gap-x-6 gap-y-3 mb-9 max-w-[480px] " +
  "max-[1440px]:max-w-[460px] max-[1440px]:gap-x-[18px] max-[1440px]:gap-y-2.5 max-[1440px]:mb-[26px] " +
  "max-[1080px]:max-w-full max-[1080px]:gap-x-3.5 max-[1080px]:gap-y-2 " +
  "max-[640px]:grid-cols-1 max-[640px]:gap-2.5 max-[640px]:mb-[22px] max-[640px]:px-4 max-[640px]:py-3.5 max-[640px]:border max-[640px]:border-line max-[640px]:rounded-2xl max-[640px]:bg-[oklch(1_0_0_/_0.02)]";

// U — individual feature row.
const FEAT_CLASS =
  "flex items-center gap-3 max-[640px]:gap-2.5";

// U — circular check icon.
const FEAT_CHECK_CLASS =
  "w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-accent " +
  "bg-[oklch(from_var(--accent)_l_c_h_/_0.12)] border border-[oklch(from_var(--accent)_l_c_h_/_0.2)] " +
  "max-[640px]:w-[22px] max-[640px]:h-[22px] [&_svg]:max-[640px]:w-3 [&_svg]:max-[640px]:h-3";

const FEAT_LABEL_CLASS =
  "text-[13px] font-semibold text-ink leading-[1.2] " +
  "max-[1440px]:text-xs max-[640px]:text-xs";
const FEAT_SUB_CLASS =
  "text-[11px] text-[var(--ink-3)] mt-0.5 tracking-[0.02em] " +
  "max-[1440px]:text-[10px] max-[640px]:text-[10px]";

// U — CTA row. Wraps below at ≤640 to stretched-column buttons.
const CTA_ROW_CLASS =
  "flex gap-3 flex-wrap items-center mb-3.5 " +
  "max-[1440px]:mb-7 " +
  "max-[640px]:flex-col max-[640px]:gap-2.5 max-[640px]:items-stretch max-[640px]:mb-6";

const CTA_FOOTNOTE_CLASS =
  "text-[12.5px] tracking-[0.01em] text-[var(--ink-3)] m-0 mb-[30px] leading-[1.5]";

// U — stats card. Flex row of 3 stat cells separated by 1px vertical
// dividers. Translucent bg with backdrop-blur. Padding/gap tighten at
// each breakpoint per legacy.
const STATS_CLASS =
  "flex items-center gap-6 px-7 py-5 border border-line rounded-[18px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] " +
  "max-[1440px]:px-5 max-[1440px]:py-4 max-[1440px]:gap-[18px] " +
  "max-[1080px]:gap-3.5 max-[1080px]:px-4 max-[1080px]:py-3.5 " +
  "max-[640px]:px-4 max-[640px]:py-3.5 max-[640px]:gap-3 max-[640px]:rounded-[14px] max-[640px]:max-w-full";

const STAT_CLASS = "flex-1 flex flex-col gap-1.5";
const STAT_NUM_CLASS =
  "font-sans font-bold text-[28px] tracking-[-0.03em] leading-none text-ink " +
  "max-[1440px]:text-2xl max-[1080px]:text-[22px] max-[640px]:text-[22px]";
const STAT_LBL_CLASS =
  "text-[10px] text-[var(--ink-3)] uppercase tracking-[0.08em] leading-[1.3] " +
  "max-[640px]:text-[9px]";
const STAT_DIV_CLASS =
  "w-px h-10 bg-line max-[640px]:h-[30px]";

// U — device-stage wrapper. Stretches to fill the grid row min-height
// (height:100% beats the prior aspect-ratio which Firefox respected
// but Chrome stretched, causing cross-browser image-size mismatch).
// On mobile: order before text, fixed 320px height, bleeds full width
// past the gutter via negative margin trick.
const HERO_RIGHT_CLASS =
  "relative min-w-0 w-full h-full min-h-[420px] overflow-visible [contain:layout] z-10 " +
  "max-[640px]:-order-1 max-[640px]:[aspect-ratio:auto] max-[640px]:z-[-1] max-[640px]:h-[320px] " +
  "max-[640px]:mx-[calc(var(--gutter-x)*-1)] max-[640px]:-mb-10 max-[640px]:w-[calc(100%+(var(--gutter-x)*2))]";

export type Feature = { label: string; sub: string };

export function DeviceMockup({
  src,
  alt = "",
}: {
  src?: string;
  alt?: string;
}) {
  return (
    <div className="mockup">
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={1700}
          height={1674}
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 100vw"
          className="mockup-img mockup-img-homepage"
        />
      ) : (
        <div className="mockup-placeholder" aria-hidden="true">
          <div className="mockup-placeholder-bar">
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
            <div className="device-stage">
              <div className="device-glow" />
              <div className="device-grid" />
              <DeviceMockup src={deviceMockupSrc} />
              {deviceTags.map((t, i) => (
                <div key={i} className={`device-tag device-tag-${i + 1}`}>
                  {i === 0 && <span className="dt-dot" />}
                  <span>{t.primary}</span>
                  {t.mini && (
                    <span
                      className={`dt-mini${t.kind === "good" ? " dt-good" : ""}`}
                    >
                      {t.mini}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showTicker && (
          <div className="ticker">
            <div className="ticker-track">
              {[...Array(2)].map((_, i) => (
                <div className="ticker-row" key={i}>
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

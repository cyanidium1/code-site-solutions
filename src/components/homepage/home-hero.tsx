import Link from "next/link";
import { AppImage } from "@/lib/shared/app-image";
import { btnClass, H1 } from "@/components/ui";

/* ───────────────────────────────────────────────────────────────────────
   HOME HERO — standalone hero for the 3 home pages (uk/en/ru), split out
   of the shared `blocks/hero` HeroEditorial (Phase 0 of the 2026 home
   redesign; audit: docs/home-hero-figma-audit.md, plan:
   docs/superpowers/plans/2026-08-01-home-hero-rebuild.md).

   Phase 0 is a ZERO-VISUAL-CHANGE visual copy: every class string below is
   verbatim from blocks/hero/index.tsx, with the home pages' fixed prop
   values hardcoded (secondary CTA = primary style, homepage mockup
   placement 1700×1674, no ticker/eyebrow-em/h1Num/compare/Sanity paths).
   The Figma rebuild replaces this file's internals in the next PR.
   ─────────────────────────────────────────────────────────────────── */

// Fixed page backdrop: dual accent radials + linear base, plus the grain
// overlay (.hero-grain in blocks/hero/hero-effects.css — still imported
// globally). Kept on home during the redesign transition (user decision).
const HERO_BG_CLASS =
  "fixed inset-0 z-0 pointer-events-none " +
  "bg-[radial-gradient(ellipse_60%_50%_at_80%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_50%_70%_at_10%_90%,oklch(from_var(--color-accent-2)_l_c_h_/_0.06),transparent_70%),linear-gradient(180deg,var(--color-bg)_0%,var(--color-bg)_100%)]";

const HERO_SHELL_CLASS =
  "relative z-[5] pt-0 pb-9 px-6 sm:px-8 sm:pt-8 sm:pb-14 lg:px-12 2xl:pt-6 2xl:pb-[60px]";

const HERO_GRID_CLASS =
  "grid grid-cols-1 grid-rows-[auto_auto] gap-0 items-center max-w-container mx-auto min-h-0 " +
  "sm:grid-cols-[minmax(0,1000px)_minmax(0,1fr)] sm:grid-rows-none sm:gap-[22px] sm:min-h-[clamp(560px,80vh,720px)] " +
  "min-[1081px]:gap-7 2xl:gap-12";

const HERO_LEFT_CLASS = "relative z-[4]";

const EYEBROW_CLASS =
  "inline-flex items-center gap-2 pl-2.5 pr-3 py-1.5 border border-line-strong rounded-full text-[9px] font-medium tracking-[0.1em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] backdrop-blur-[8px] mb-[18px] " +
  "sm:gap-2.5 sm:pl-3 sm:pr-3.5 sm:py-2 sm:text-[11px] sm:tracking-[0.12em] sm:mb-8";

const EYEBROW_DOT_CLASS =
  "w-[5px] h-[5px] rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] sm:w-1.5 sm:h-1.5";

const HERO_H1_CLASS =
  "text-ink m-0 mb-[18px] sm:mb-7 " +
  "[&_em]:italic [&_em]:font-medium [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:[-webkit-text-fill-color:transparent]";

const H1_LINE_CLASS = "block md:max-w-[50vw]";

const LEDE_CLASS =
  "text-sm leading-[1.55] text-ink-dim max-w-full m-0 mb-[22px] text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "sm:leading-[1.6] sm:mb-6 " +
  "min-[1081px]:max-w-[460px] " +
  "2xl:mb-8";

const FEATURES_CLASS =
  "grid grid-cols-1 gap-2.5 mb-[22px] max-w-full px-4 py-3.5 border border-line rounded-2xl bg-[oklch(1_0_0_/_0.02)] " +
  "sm:grid-cols-2 sm:gap-x-3.5 sm:gap-y-2 sm:mb-[26px] sm:px-0 sm:py-0 sm:border-0 sm:rounded-none sm:bg-transparent " +
  "min-[1081px]:max-w-[460px] min-[1081px]:gap-x-[18px] min-[1081px]:gap-y-2.5 " +
  "2xl:max-w-[480px] 2xl:gap-x-6 2xl:gap-y-3 2xl:mb-9";

const FEAT_CLASS = "flex items-center gap-2.5 sm:gap-3";

const FEAT_CHECK_CLASS =
  "w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-accent " +
  "bg-accent-12 border border-accent-20 " +
  "[&_svg]:w-3 [&_svg]:h-3 sm:w-[26px] sm:h-[26px] [&_svg]:sm:w-[14px] [&_svg]:sm:h-[14px]";

const FEAT_LABEL_CLASS =
  "text-xs font-semibold text-ink leading-[1.2] 2xl:text-[13px]";
const FEAT_SUB_CLASS =
  "text-[10px] text-ink-3 mt-0.5 tracking-[0.02em] 2xl:text-[11px]";

const CTA_ROW_CLASS =
  "flex flex-col flex-wrap gap-2.5 items-stretch mb-6 " +
  "sm:flex-row sm:gap-3 sm:items-center sm:mb-7 " +
  "2xl:mb-3.5";

const CTA_FOOTNOTE_CLASS =
  "text-[12.5px] tracking-[0.01em] text-ink-3 m-0 mb-[30px] leading-[1.5]";

const STATS_CLASS =
  "flex items-center gap-3 px-4 py-3.5 border border-line rounded-[14px] w-full max-w-full bg-[oklch(1_0_0_/_0.02)] backdrop-blur-[8px] " +
  "sm:gap-3.5 " +
  "min-[1081px]:gap-[18px] min-[1081px]:px-5 min-[1081px]:py-4 " +
  "2xl:gap-6 2xl:px-7 2xl:py-5 2xl:rounded-[18px]";

const STAT_CLASS = "flex-1 flex flex-col gap-1.5";
const STAT_NUM_CLASS =
  "font-sans font-bold text-[16px] tracking-[-0.03em] leading-none text-ink " +
  "sm:text-[22px] min-[1081px]:text-2xl 2xl:text-[28px]";
const STAT_LBL_CLASS =
  "text-[9px] text-ink-3 uppercase tracking-[0.08em] leading-[1.3] sm:text-[10px]";
const STAT_DIV_CLASS = "w-px h-[30px] bg-line sm:h-10";

const DEVICE_STAGE_CLASS =
  "relative w-full h-full min-w-0 [perspective:2000px] overflow-hidden lg:overflow-visible " +
  "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[60px] after:bg-[linear-gradient(180deg,transparent,var(--color-bg)_90%)] after:z-[3] after:pointer-events-none " +
  "sm:after:content-none";

const DEVICE_GLOW_CLASS =
  "absolute -inset-[10%] pointer-events-none blur-[40px] " +
  "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(from_var(--color-accent)_l_c_h_/_0.18),transparent_70%)]";

const DEVICE_GRID_CLASS =
  "absolute inset-0 pointer-events-none " +
  "bg-[radial-gradient(circle_at_1px_1px,oklch(1_0_0_/_0.06)_1px,transparent_0)] " +
  "bg-[size:24px_24px] " +
  "[mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)] " +
  "[-webkit-mask:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)]";

const DEVICE_TAG_CLASS =
  "hidden absolute z-[5] px-[11px] py-1.5 backdrop-blur-[12px] border border-line-strong rounded-full text-[10px] font-medium text-ink items-center gap-2 tracking-[0.02em] " +
  "bg-[oklch(0.22_0.008_60_/_0.85)] shadow-[0_4px_16px_oklch(0_0_0_/_0.4)] animate-float " +
  "sm:inline-flex " +
  "2xl:text-[11px] 2xl:px-3.5 2xl:py-2";

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

const DT_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]";
const DT_MINI_CLASS = "font-mono text-[10px] text-ink-3";
const DT_GOOD_CLASS = "text-accent";

const MOCKUP_CLASS =
  "absolute w-[134%] top-[-65px] left-[-54px] lg:inset-0 flex items-center justify-center z-[2] pointer-events-none overflow-visible";

const MOCKUP_IMG_CLASS =
  "w-full max-w-full max-h-full h-auto -translate-x-[10%] " +
  "[filter:drop-shadow(0_44px_54px_oklch(0_0_0_/_0.6))] " +
  "sm:w-[clamp(420px,50vw,1000px)] sm:max-w-none sm:max-h-none";

const MOCKUP_IMG_HOMEPAGE_CLASS =
  "relative w-full max-w-none max-h-none !translate-x-[10%] top-[unset] left-[unset] " +
  "sm:absolute sm:w-[clamp(420px,100vw,1200px)] sm:-top-[136px] sm:-left-[272px] sm:!-translate-x-[10%]";

const HERO_RIGHT_CLASS =
  "relative min-w-0 -order-1 [aspect-ratio:auto] z-[-1] h-[320px] min-h-[320px] overflow-visible [contain:layout] -mx-6 -mb-10 w-[calc(100%+48px)] " +
  "sm:order-none sm:z-10 sm:h-full sm:mx-0 sm:mb-0 sm:w-full " +
  "md:min-h-[420px]";

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
  eyebrow: { label: string };
  h1Lines: React.ReactNode[];
  lede: React.ReactNode;
  features: { label: string; sub: string }[];
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  ctaFootnote: React.ReactNode;
  stats: { num: string; lbl: React.ReactNode }[];
  deviceTags: { kind: "default" | "good"; primary: string; mini?: string }[];
  deviceMockupSrc: string;
  deviceMockupAlt: string;
};

export function HomeHero({
  eyebrow,
  h1Lines,
  lede,
  features,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
  ctaFootnote,
  stats,
  deviceTags,
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
            <div className={EYEBROW_CLASS}>
              <span className={EYEBROW_DOT_CLASS} />
              <span>{eyebrow.label}</span>
            </div>

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
              <Link href={ctaSecondaryHref} className={btnClass("primary")}>
                <span>{ctaSecondaryLabel}</span>
                {SECONDARY_ARROW_ICON}
              </Link>
            </div>
            <p className={CTA_FOOTNOTE_CLASS}>{ctaFootnote}</p>

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
      </div>
    </>
  );
}

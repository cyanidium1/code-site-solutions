import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/shared/format-price";
import { btnClass, PLAY_ICON_CLASS } from "@/components/ui";
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
    <div className="feat">
      <div className="feat-check">
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
        <div className="feat-label">{label}</div>
        <div className="feat-sub">{sub}</div>
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
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              <span>{eyebrow.label}</span>
              {eyebrow.em ? (
                <>
                  <span className="eyebrow-sep">/</span>
                  <span className="eyebrow-em">{eyebrow.em}</span>
                </>
              ) : null}
            </div>

            <h1 className="h1">
              {h1Lines.map((line, i) => (
                <span key={i} className="h1-line">
                  {line}
                </span>
              ))}
              {h1Num ? (
                <span className="h1-line h1-accent">
                  <span className="h1-num">{h1Num}</span>
                  {h1NumLabel ? (
                    <span className="h1-num-label">{h1NumLabel}</span>
                  ) : null}
                </span>
              ) : null}
            </h1>

            <p className="lede">{lede}</p>

            <div className="features">
              {features.map((f) => (
                <FeatureChip key={f.label} label={f.label} sub={f.sub} />
              ))}
            </div>

            <div className="cta-row">
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
            {ctaFootnote ? <p className="cta-footnote">{ctaFootnote}</p> : null}

            {showStats && (
              <div className="stats">
                {stats.map((s, i) => (
                  <span key={i} className="contents">
                    {i > 0 && <div className="stat-div" />}
                    <div className="stat">
                      <div className="stat-num">{s.num}</div>
                      <div className="stat-lbl">{s.lbl}</div>
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

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/shared/format-price";
import { btnClass, PLAY_ICON_CLASS } from "@/components/ui";
import "./hero-effects.css";

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
      <div className="hero-bg" />
      <div className="hero-grain" />

      <div className="hero">
        <div className="hero-grid" data-variant={variant}>
          <div className="hero-left">
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

          <div className="hero-right">
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

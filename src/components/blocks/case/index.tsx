import Link from "next/link";

import { H2 } from "@/components/ui";
import { ARROW_ICON, CheckIcon, CrossIcon } from "./icons";
import { CaseShot } from "./case-shot";

// Italic <em> inside the heading uses the brand vertical accent gradient
// (accent-soft → accent), text-clipped. Same effect as the legacy `.case-h2 em`
// rule. Tailwind cannot express this via a token because the gradient is
// applied to text via -webkit-text-fill-color: transparent — preserved as
// arbitrary-value utilities scoped by the [&_em] descendant selector.
const HEADING_EM_CLASS =
  "[&_em]:not-italic [&_em]:font-light [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent";

const SECTION_CLASS =
  "relative overflow-hidden bg-bg py-[72px] lg:py-[120px] px-[18px] md:px-8 xl:px-12";

// Two stacked radial gradients — accent (top-right) + accent-2 (bottom-left).
// Preserved as raw OKLCH because no @theme token captures this dual-gradient
// pattern; identical to legacy `.case-bg`.
const SECTION_BG_CLASS =
  "absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_40%_50%_at_90%_30%,oklch(from_var(--color-accent)_l_c_h_/_0.10),transparent_70%),radial-gradient(ellipse_35%_40%_at_5%_70%,oklch(from_var(--color-accent-2)_l_c_h_/_0.08),transparent_70%)]";

const INNER_CLASS = "relative z-[2] max-w-container mx-auto";

const HEADER_CLASS =
  "grid grid-cols-1 gap-6 items-start mb-8 pb-[22px] border-b border-line " +
  "md:mb-12 md:pb-8 " +
  "xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-[60px] xl:items-end xl:mb-16";

const EYEBROW_CLASS =
  "inline-flex items-center gap-2.5 pl-3 pr-3.5 py-[7px] border border-line-strong rounded-full text-[11px] font-medium tracking-[0.12em] text-ink-dim bg-[oklch(1_0_0_/_0.025)] mb-[22px]";

const EYEBROW_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]";

const LEDE_CLASS =
  "text-[14px] leading-[1.7] text-ink-dim m-0 max-w-[56ch] pb-1.5 text-pretty [&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "xl:text-[15px]";

const META_CLASS =
  "flex flex-wrap gap-x-6 gap-y-[18px] mt-6 pt-[18px] border-t border-dashed border-line " +
  "md:gap-x-9 md:gap-y-6";

const META_ITEM_CLASS =
  "font-mono text-[11px] tracking-[0.04em] text-ink-3 " +
  "[&>strong]:block [&>strong]:font-display [&>strong]:font-semibold [&>strong]:text-[14px] [&>strong]:text-ink [&>strong]:tracking-[-0.01em] [&>strong]:mb-1 [&>strong]:normal-case";

// Compare grid + VS pill ::before. ::before becomes a real centred chip with
// before:content-['VS'] etc; hidden on <=700px (legacy hid it because the
// stacked-card position was confusing).
const GRID_CLASS =
  "grid grid-cols-1 gap-[18px] relative " +
  "md:grid-cols-2 md:gap-7 " +
  "md:before:content-['VS'] md:before:absolute md:before:top-1/2 md:before:left-1/2 md:before:-translate-x-1/2 md:before:-translate-y-1/2 md:before:z-[5] " +
  "md:before:font-display md:before:font-bold md:before:tracking-[0.1em] md:before:text-ink-3 md:before:bg-bg " +
  "md:before:border md:before:border-line-strong md:before:rounded-full md:before:pointer-events-none " +
  "md:before:text-[14px] md:before:px-3 md:before:py-2.5 " +
  "xl:before:text-[18px] xl:before:px-3.5 xl:before:py-3";

const CARD_BASE_CLASS =
  "relative border border-line rounded-[24px] bg-[oklch(1_0_0_/_0.015)] p-[18px] flex flex-col overflow-hidden " +
  "md:p-[22px] xl:p-7";

// "After" card variant. Accent-tinted border, soft gradient bg + outer glow,
// plus a ::before that paints a gradient border via mask-composite (preserved
// verbatim — Tailwind has no utility for this masked border trick).
const CARD_AFTER_CLASS =
  "!border-accent-35 " +
  "bg-[linear-gradient(180deg,oklch(from_var(--color-accent)_l_c_h_/_0.06),oklch(from_var(--color-accent)_l_c_h_/_0.02))] " +
  "shadow-[0_0_0_1px_oklch(from_var(--color-accent)_l_c_h_/_0.15),0_30px_60px_oklch(from_var(--color-accent)_l_c_h_/_0.18)] " +
  "before:content-[''] before:absolute before:inset-[-1px] before:rounded-[inherit] " +
  "before:bg-[linear-gradient(135deg,oklch(from_var(--color-accent)_l_c_h_/_0.4),transparent_50%)] " +
  "before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] " +
  "before:[-webkit-mask-composite:xor] before:[mask-composite:exclude] before:p-px before:pointer-events-none";

const CARD_HEAD_CLASS = "flex items-center justify-between mb-5 gap-3";

const BADGE_BASE_CLASS =
  "inline-flex items-center gap-2 px-3.5 py-[7px] rounded-full font-display text-[11px] font-bold tracking-[0.12em] uppercase";

const BADGE_BEFORE_CLASS =
  "bg-[oklch(1_0_0_/_0.06)] text-ink-dim border border-line-strong";

const BADGE_AFTER_CLASS =
  "bg-brand-gradient text-[oklch(1_0_0_/_0.98)] border border-accent-50 shadow-[0_4px_14px_oklch(from_var(--color-accent)_l_c_h_/_0.4)]";

const BADGE_DOT_CLASS =
  "w-1.5 h-1.5 rounded-full bg-current opacity-85";

const CARD_NUM_CLASS =
  "font-mono text-[10px] text-ink-3 tracking-[0.08em]";

const TAGLINE_CLASS =
  "font-display font-semibold text-[14px] text-ink m-0 mb-4 tracking-[-0.01em]";

// Checklist <ul>: 12px-gap column. <li> rows have 14px body / 13px @700px,
// pretty-wrap, and emphasised <em> spans use ink + medium weight.
const LIST_CLASS =
  "flex flex-col gap-3 m-0 p-0 list-none " +
  "[&>li]:flex [&>li]:items-start [&>li]:gap-3 [&>li]:text-[13px] [&>li]:leading-[1.5] [&>li]:text-ink-dim [&>li]:text-pretty " +
  "[&_em]:not-italic [&_em]:text-ink [&_em]:font-medium " +
  "md:[&>li]:text-[14px]";

const LIST_ICN_BASE_CLASS =
  "w-5 h-5 rounded-full shrink-0 inline-flex items-center justify-center mt-px border " +
  "md:w-[22px] md:h-[22px]";

const LIST_ICN_BAD_CLASS =
  "bg-[oklch(0.65_0.18_25_/_0.12)] text-[oklch(0.78_0.16_25)] border-[oklch(0.65_0.18_25_/_0.25)]";

const LIST_ICN_GOOD_CLASS =
  "bg-accent-15 text-accent-soft border-accent-30";

const CARD_FOOT_CLASS =
  "mt-[22px] pt-[18px] border-t border-dashed border-line text-[12px] leading-[1.6] text-ink-3 italic [&>strong]:text-ink-dim [&>strong]:not-italic [&>strong]:font-medium";

// Results strip: 4-col grid on desktop, 2-col @1100px and @700px, with the
// 1px-gap-as-border trick (gap background colour shows through). Legacy used
// repeat(4,1fr) → grid-cols-4; mobile reduces to 2 cols.
const RESULTS_CLASS =
  "grid grid-cols-2 gap-px mt-8 border border-line rounded-[18px] overflow-hidden bg-line " +
  "md:mt-14 xl:grid-cols-4";

const RESULT_CLASS =
  "bg-bg p-4 flex flex-col gap-1.5 relative " +
  "md:px-5 md:py-[18px] " +
  "xl:px-7 xl:py-6";

const RESULT_NUM_CLASS =
  "font-display font-bold text-[24px] tracking-[-0.03em] leading-none bg-brand-gradient bg-clip-text text-transparent " +
  "md:text-[28px] xl:text-[clamp(28px,3vw,44px)]";

const RESULT_LBL_CLASS =
  "text-[11px] text-ink-dim leading-[1.4] mt-1 md:text-[12px]";

const RESULT_TAG_CLASS =
  "font-mono text-[9px] text-ink-3 tracking-[0.08em] uppercase";

// CTA strip: pill on desktop, stacked rounded card on mobile.
const CTA_CLASS =
  "flex flex-col items-stretch gap-4 flex-wrap mt-6 p-[18px] border border-line rounded-[18px] bg-[oklch(1_0_0_/_0.02)] " +
  "md:flex-row md:items-center md:justify-between md:gap-6 md:mt-8 md:px-7 md:py-[22px] md:rounded-full";

const CTA_TEXT_CLASS =
  "text-[13px] text-ink-dim flex items-center justify-center text-center gap-3 [&>strong]:text-ink [&>strong]:font-semibold " +
  "md:text-[14px] md:justify-normal md:text-start";

// Diagonal arrow built from two borders rotated 45deg (legacy .case-cta-arrow).
const CTA_ARROW_CLASS =
  "w-2 h-2 border-r-[1.5px] border-b-[1.5px] border-accent-soft -rotate-45 inline-block";

const CTA_BTN_CLASS =
  "bg-ink text-bg border-0 justify-center min-h-11 px-[18px] py-3.5 rounded-full font-display text-[13px] font-semibold inline-flex items-center gap-2.5 cursor-pointer transition-[transform,box-shadow] duration-200 " +
  "shadow-[0_4px_16px_oklch(from_var(--color-accent)_l_c_h_/_0.2),inset_0_0_0_1px_oklch(1_0_0_/_0.1)] " +
  "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(from_var(--color-accent)_l_c_h_/_0.3),inset_0_0_0_1px_oklch(1_0_0_/_0.1)] " +
  "md:justify-normal md:px-[22px] md:py-3";

const DEFAULT_BEFORE_LIST: React.ReactNode[] = [
  "заплутана структура сайту, користувачі не розуміли куди натискати",
  "застарілий дизайн, який не викликав довіри",
  "низька швидкість завантаження",
  "некоректна мультимовність (російська/українська)",
  "незручна адмінка — будь-які зміни через розробника за гроші",
  "сайт періодично падав",
  "не було нормальної системи запису/бронювання",
];

const DEFAULT_AFTER_LIST: React.ReactNode[] = [
  "зрозуміла структура сайту під користувача",
  "сучасний дизайн, що підвищує довіру",
  <>
    швидке завантаження &lt;1.5 c
  </>,
  "коректна мультимовність (RU/UA)",
  "зручна адмінка без розробника",
  "стабільна робота без падінь",
  "онлайн-запис та форми заявок",
];

const DEFAULT_RESULTS = [
  { n: "×3.2", lbl: "більше заявок з сайту", tag: "CONVERSION" },
  { n: "<1.5c", lbl: "час завантаження сторінки", tag: "PERFORMANCE" },
  { n: "98", lbl: "Lighthouse · Performance", tag: "CORE WEB VITALS" },
  { n: "×4", lbl: "органічного трафіку Google", tag: "SEO · 6 МІС." },
];

export function Case({
  eyebrow = "РЕАЛЬНИЙ КЕЙС",
  eyebrowEm = "КЛІНІКА «ЕФЕДРА», ОДЕСА",
  heading = (
    <>
      До / Після на прикладі
      <br />
      <em>реального</em> клієнта
    </>
  ),
  lede = (
    <>
      До нас звернулася клініка «Ефедра» з Одеси — із застарілим сайтом,
      який не приносив заявок. Завдання було не просте: переробити структуру,
      дизайн і логіку під два напрямки бізнесу клініки — стоматологію
      і студію краси.
    </>
  ),
  meta = [
    { strong: "4 тижні", text: "від брифу до релізу" },
    { strong: "2 напрямки", text: "стоматологія + естетика" },
    { strong: "UA + RU", text: "локалізація під SEO" },
  ],
  beforeNum = "EFEDRA · v1 · 2022",
  beforeShotSrc,
  beforeShotUrl = "efedraclinic.com.ua",
  beforeShotAlt = "Старий сайт клініки Ефедра",
  beforeTagline = "Сайт, що не продає",
  beforeList = DEFAULT_BEFORE_LIST,
  beforeFoot = (
    <>
      <strong>Примітка:</strong> російську мову залишено як основну для SEO,
      оскільки в Одесі значна частина пошукових запитів все ще російською мовою.
    </>
  ),
  afterNum = "EFEDRA · v2 · 2025",
  afterShotSrc,
  afterShotUrl = "efedra.com.ua",
  afterShotAlt = "Новий сайт клініки Ефедра",
  afterTagline = "Сайт, що приводить пацієнтів",
  afterList = DEFAULT_AFTER_LIST,
  afterFoot = (
    <>
      <strong>Бонус:</strong> два розділи (стоматологія і естетика) під одним
      брендом — без втрати фокусу і з окремими лід-формами під кожен напрямок.
    </>
  ),
  results = DEFAULT_RESULTS,
  ctaText = (
    <>
      Хочете <strong>такий самий результат</strong>? Подивіться, як ми це
      робимо.
    </>
  ),
  ctaLabel = "Подивитися кейси клінік",
  ctaHref,
  locale = "uk",
}: Partial<{
  eyebrow: string;
  eyebrowEm: string;
  heading: React.ReactNode;
  lede: React.ReactNode;
  meta: { strong: string; text: string }[];
  beforeNum: string;
  beforeShotSrc?: string;
  beforeShotUrl: string;
  beforeShotAlt: string;
  beforeTagline: string;
  beforeList: React.ReactNode[];
  beforeFoot: React.ReactNode;
  afterNum: string;
  afterShotSrc?: string;
  afterShotUrl: string;
  afterShotAlt: string;
  afterTagline: string;
  afterList: React.ReactNode[];
  afterFoot: React.ReactNode;
  results: { n: string; lbl: string; tag: string }[];
  ctaText: React.ReactNode;
  ctaLabel: string;
  /** Destination for the CTA button. When set, renders a link; omit and the CTA is inert. */
  ctaHref: string;
  locale: "uk" | "en";
}> = {}) {
  const beforeLabel = locale === "en" ? "BEFORE" : "БУЛО";
  const afterLabel = locale === "en" ? "AFTER" : "СТАЛО";
  return (
    <section className={SECTION_CLASS}>
      <div className={SECTION_BG_CLASS} />

      <div className={INNER_CLASS}>
        <header className={HEADER_CLASS}>
          <div>
            <div className={EYEBROW_CLASS}>
              <span className={EYEBROW_DOT_CLASS} />
              <span>{eyebrow}</span>
              <span className="text-ink-3">·</span>
              <span className="text-accent-soft font-semibold">{eyebrowEm}</span>
            </div>
            <H2 variant="case" className={HEADING_EM_CLASS}>
              {heading}
            </H2>
          </div>
          <div>
            <p className={LEDE_CLASS}>{lede}</p>
            <div className={META_CLASS}>
              {meta.map((m, i) => (
                <div className={META_ITEM_CLASS} key={i}>
                  <strong>{m.strong}</strong>
                  {m.text}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className={GRID_CLASS}>
          <article className={CARD_BASE_CLASS}>
            <div className={CARD_HEAD_CLASS}>
              <span className={`${BADGE_BASE_CLASS} ${BADGE_BEFORE_CLASS}`}>
                <span className={BADGE_DOT_CLASS} />
                <span>{beforeLabel}</span>
              </span>
              <span className={CARD_NUM_CLASS}>{beforeNum}</span>
            </div>
            <CaseShot src={beforeShotSrc} url={beforeShotUrl} alt={beforeShotAlt} />
            <h3 className={TAGLINE_CLASS}>{beforeTagline}</h3>
            <ul className={LIST_CLASS}>
              {beforeList.map((item, i) => (
                <li key={i}>
                  <span className={`${LIST_ICN_BASE_CLASS} ${LIST_ICN_BAD_CLASS}`}>
                    <CrossIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className={CARD_FOOT_CLASS}>{beforeFoot}</p>
          </article>

          <article className={`${CARD_BASE_CLASS} ${CARD_AFTER_CLASS}`}>
            <div className={CARD_HEAD_CLASS}>
              <span className={`${BADGE_BASE_CLASS} ${BADGE_AFTER_CLASS}`}>
                <span className={BADGE_DOT_CLASS} />
                <span>{afterLabel}</span>
              </span>
              <span className={CARD_NUM_CLASS}>{afterNum}</span>
            </div>
            <CaseShot src={afterShotSrc} url={afterShotUrl} alt={afterShotAlt} />
            <h3 className={TAGLINE_CLASS}>{afterTagline}</h3>
            <ul className={LIST_CLASS}>
              {afterList.map((item, i) => (
                <li key={i}>
                  <span className={`${LIST_ICN_BASE_CLASS} ${LIST_ICN_GOOD_CLASS}`}>
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className={CARD_FOOT_CLASS}>{afterFoot}</p>
          </article>
        </div>

        <div className={RESULTS_CLASS}>
          {results.map((r) => (
            <div className={RESULT_CLASS} key={r.lbl}>
              <div className={RESULT_TAG_CLASS}>{r.tag}</div>
              <div className={RESULT_NUM_CLASS}>{r.n}</div>
              <div className={RESULT_LBL_CLASS}>{r.lbl}</div>
            </div>
          ))}
        </div>

        <div className={CTA_CLASS}>
          <div className={CTA_TEXT_CLASS}>
            <span className={CTA_ARROW_CLASS} />
            <span>{ctaText}</span>
          </div>
          {ctaHref ? (
            <Link href={ctaHref} className={`${CTA_BTN_CLASS} no-underline`}>
              <span>{ctaLabel}</span>
              {ARROW_ICON}
            </Link>
          ) : (
            <button type="button" className={CTA_BTN_CLASS}>
              <span>{ctaLabel}</span>
              {ARROW_ICON}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export { CrossIcon, CheckIcon } from "./icons";
export { CaseShot } from "./case-shot";

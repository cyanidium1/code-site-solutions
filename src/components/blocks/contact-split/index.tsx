import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  CHANNELS_BY_LOCALE,
  CONTACT_META_BY_LOCALE,
  type ContactsLocale,
} from "@/content/contacts";
import { H2 } from "@/components/ui";
import { HeroAuditBanner } from "./HeroAuditBanner";

// Brand-gradient italic em (horizontal 3-stop blue→purple→magenta). Distinct
// from the vertical accent-soft→accent gradient used elsewhere; preserved as
// raw OKLCH stops because no @theme token captures this gradient yet.
const HEADING_EM_CLASS =
  "[&_em]:italic [&_em]:bg-[linear-gradient(90deg,oklch(0.7_0.16_250),oklch(0.6_0.18_295),oklch(0.55_0.18_320))] [&_em]:bg-clip-text [&_em]:text-transparent";

const EYEBROW_CLASS =
  "inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)] mb-[14px]";

const SUB_CLASS =
  "text-[14px] leading-[1.6] text-[var(--ink-2)] m-0 mb-7 max-w-[42ch]";

// Channel row: grid with icon | main | time. Hover bumps border + bg + nudges
// right. Featured variant uses accent-tinted border/bg and a gradient icon.
const ROW_BASE_CLASS =
  "grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-[14px] py-3 px-[14px] border rounded-xl no-underline text-inherit " +
  "transition-[border-color,background-color,transform] duration-200 " +
  "hover:translate-x-[2px] " +
  "max-[500px]:grid-cols-[32px_minmax(0,1fr)] max-[500px]:grid-rows-[auto_auto] max-[500px]:row-gap-1";

const ROW_DEFAULT_CLASS =
  "border-line bg-[oklch(1_0_0_/_0.02)] hover:border-line-strong hover:bg-[oklch(1_0_0_/_0.04)]";

// Featured row: accent-tinted, deeper bg on hover, gradient icon (via group).
const ROW_FEATURED_CLASS =
  "border-[oklch(from_var(--color-accent)_l_c_h_/_0.45)] bg-[oklch(from_var(--color-accent)_l_c_h_/_0.06)] hover:bg-[oklch(from_var(--color-accent)_l_c_h_/_0.1)]";

const ICON_BASE_CLASS =
  "w-9 h-9 inline-flex items-center justify-center border border-line rounded-[10px] bg-[oklch(1_0_0_/_0.03)] text-ink";

const ICON_FEATURED_CLASS =
  "!bg-[linear-gradient(135deg,var(--accent-soft),var(--accent))] !text-[oklch(1_0_0_/_0.98)] !border-transparent";

const TIME_BASE_CLASS =
  "font-mono text-[11px] tracking-[0.02em] text-[var(--ink-3)] text-right whitespace-nowrap max-[500px]:col-start-2 max-[500px]:text-left";

const TIME_FEATURED_CLASS = "!text-accent-soft";

const CHROME = {
  uk: {
    channelsEyebrow: "/ CHANNELS",
    channelsHeading: (
      <>
        Виберіть зручний <em>канал</em>
      </>
    ),
    channelsSub:
      "Telegram — найшвидше. Решта — fallback. Жодного бота — пише сам Fedir.",
    briefEyebrow: "/ BRIEF",
    briefHeading: (
      <>
        Або надішліть <em>бриф</em>
      </>
    ),
    briefSub: "4 поля. Деталі — за бажанням. Все що тут — конфіденційно.",
  },
  en: {
    channelsEyebrow: "/ CHANNELS",
    channelsHeading: (
      <>
        Pick your <em>channel</em>
      </>
    ),
    channelsSub:
      "Telegram is fastest. The rest are fallback. No bots — Fedir replies personally.",
    briefEyebrow: "/ BRIEF",
    briefHeading: (
      <>
        Or send a <em>brief</em>
      </>
    ),
    briefSub: "4 fields. Details — if you want. Everything here is confidential.",
  },
} as const;

export function ContactSplit({
  source = "contacts",
  variant = "compact",
  locale = "uk",
}: {
  source?: string;
  variant?: LeadFormVariant;
  locale?: ContactsLocale;
} = {}) {
  const channels = CHANNELS_BY_LOCALE[locale];
  const meta = CONTACT_META_BY_LOCALE[locale];
  const chrome = CHROME[locale];
  return (
    <section className="relative py-14 lg:py-20 px-[18px] md:px-8 xl:px-12 bg-[linear-gradient(180deg,var(--bg)_0%,oklch(0.13_0.02_300)_100%)]">
      {/* HeroAuditBanner is a client component that reads locale via
          next-intl useLocale — no need to thread the prop. */}
      <HeroAuditBanner />
      <div className="max-w-container mx-auto grid grid-cols-[minmax(0,4fr)_minmax(0,6fr)] gap-14 items-start max-[900px]:grid-cols-1 max-[900px]:gap-9">
        <aside>
          <div className={EYEBROW_CLASS}>{chrome.channelsEyebrow}</div>
          <H2
            variant="contact-split"
            className={`m-0 mb-[14px] text-ink ${HEADING_EM_CLASS}`}
          >
            {chrome.channelsHeading}
          </H2>
          <p className={SUB_CLASS}>{chrome.channelsSub}</p>
          <ul className="list-none p-0 mt-0 mb-[26px] flex flex-col gap-1.5">
            {channels.map((c) => {
              const Icon = c.icon;
              const isFeatured = c.featured;
              return (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer" : undefined}
                    className={`${ROW_BASE_CLASS} ${
                      isFeatured ? ROW_FEATURED_CLASS : ROW_DEFAULT_CLASS
                    }`}
                  >
                    <span
                      className={`${ICON_BASE_CLASS}${
                        isFeatured ? ` ${ICON_FEATURED_CLASS}` : ""
                      }`}
                      aria-hidden="true"
                    >
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-sans text-[14px] font-semibold text-ink">
                        {c.label}
                      </span>
                      <span className="font-mono text-[12px] text-[var(--ink-3)] tracking-[0.02em] overflow-hidden text-ellipsis whitespace-nowrap">
                        {c.handle}
                      </span>
                    </span>
                    <span
                      className={`${TIME_BASE_CLASS}${
                        isFeatured ? ` ${TIME_FEATURED_CLASS}` : ""
                      }`}
                    >
                      {c.responseTime}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2 font-mono text-[11.5px] tracking-[0.02em] text-[var(--ink-3)]">
            <span>📍 {meta.city}</span>
            <span className="opacity-50">·</span>
            <span>🕒 {meta.hours}</span>
            <span className="opacity-50">·</span>
            <span>🌐 {meta.languages}</span>
          </div>
        </aside>

        <div>
          <div className="mb-6">
            <div className={EYEBROW_CLASS}>{chrome.briefEyebrow}</div>
            <H2
              variant="contact-split"
              className={`m-0 mb-[14px] text-ink ${HEADING_EM_CLASS}`}
            >
              {chrome.briefHeading}
            </H2>
            <p className={SUB_CLASS}>{chrome.briefSub}</p>
          </div>
          <div className="p-5 border border-line-strong rounded-2xl bg-[oklch(0.13_0.005_300_/_0.7)] backdrop-blur-[8px] md:p-7 md:rounded-[22px]">
            <LeadForm source={source} variant={variant} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  CHANNELS_BY_LOCALE,
  CONTACT_META_BY_LOCALE,
  type ContactsLocale,
} from "@/content/contacts";
import { H2 } from "@/components/ui";
import { HeroAuditBanner } from "./HeroAuditBanner";
import { MobileFold } from "@/components/shared/mobile-fold";

// Phones show these three as one row of buttons; the rest of the channels
// stay in the footer (plan 2026-09-16, П7 — the block was 2.3 screens).
const PRIMARY_KINDS = new Set(["telegram", "whatsapp", "phone"]);


// Brand-gradient italic em (horizontal 3-stop blue→purple→magenta). Distinct
// from the vertical accent-soft→accent gradient used elsewhere; preserved as
// raw OKLCH stops because no @theme token captures this gradient yet.
const HEADING_EM_CLASS =
  "[&_em]:italic [&_em]:bg-[linear-gradient(90deg,oklch(0.7_0.16_250),oklch(0.6_0.18_295),oklch(0.55_0.18_320))] [&_em]:bg-clip-text [&_em]:text-transparent";

const SUB_CLASS =
  "text-[14px] leading-[1.6] text-ink-dim m-0 mb-7 max-w-[42ch]";

// Channel row: grid with icon | main | time. Hover bumps border + bg + nudges
// right. Featured variant uses accent-tinted border/bg and a gradient icon.
const ROW_BASE_CLASS =
  "grid grid-cols-[32px_minmax(0,1fr)] grid-rows-[auto_auto] row-gap-1 items-center gap-[14px] py-3 px-[14px] border rounded-xl no-underline text-inherit " +
  "transition-[border-color,background-color,transform] duration-200 " +
  "hover:translate-x-[2px] " +
  "min-[501px]:grid-cols-[36px_minmax(0,1fr)_auto] min-[501px]:grid-rows-none min-[501px]:row-gap-0";

// Phones, compact mode: the three primary channels as one row of buttons.
const ROW_PHONE_BUTTON_CLASS =
  "max-md:flex max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-1.5 max-md:px-2 max-md:py-3 max-md:hover:translate-x-0";

const ROW_DEFAULT_CLASS =
  "border-line bg-[oklch(1_0_0_/_0.02)] hover:border-line-strong hover:bg-[oklch(1_0_0_/_0.04)]";

// Featured row: accent-tinted, deeper bg on hover, gradient icon (via group).
const ROW_FEATURED_CLASS =
  "border-[oklch(from_var(--color-accent)_l_c_h_/_0.45)] bg-accent-6 hover:bg-accent-10";

const ICON_BASE_CLASS =
  "w-9 h-9 inline-flex items-center justify-center border border-line rounded-[10px] bg-[oklch(1_0_0_/_0.03)] text-ink";

const ICON_FEATURED_CLASS =
  "!bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] !text-[oklch(1_0_0_/_0.98)] !border-transparent";

const TIME_BASE_CLASS =
  "font-mono text-[11px] tracking-[0.02em] text-ink-3 col-start-2 text-left whitespace-nowrap min-[501px]:col-auto min-[501px]:text-right";

const TIME_FEATURED_CLASS = "!text-accent-soft";

const CHROME = {
  uk: {
    channelsEyebrow: "/ КАНАЛИ",
    channelsHeading: (
      <>
        Виберіть зручний <em>канал</em>
      </>
    ),
    channelsSub:
      "Найшвидше — в Telegram. Відповідає Федір, не бот.",
    briefEyebrow: "/ БРИФ",
    briefHeading: (
      <>
        Або надішліть <em>бриф</em>
      </>
    ),
    briefSub: "4 поля. Деталі — за бажанням. Все що тут — конфіденційно.",
    briefToggle: "Або надішліть бриф — 4 поля",
  },
  en: {
    channelsEyebrow: "/ CHANNELS",
    channelsHeading: (
      <>
        Pick your <em>channel</em>
      </>
    ),
    channelsSub:
      "WhatsApp is fastest. Fedir replies himself, not a bot.",
    briefEyebrow: "/ BRIEF",
    briefHeading: (
      <>
        Or send a <em>brief</em>
      </>
    ),
    briefSub: "4 fields. Details — if you want. Everything here is confidential.",
    briefToggle: "Or send a brief — 4 fields",
  },
  ru: {
    channelsEyebrow: "/ КАНАЛЫ",
    channelsHeading: (
      <>
        Выберите удобный <em>канал</em>
      </>
    ),
    channelsSub:
      "Быстрее всего — в Telegram. Отвечает Федор, не бот.",
    briefEyebrow: "/ БРИФ",
    briefHeading: (
      <>
        Или отправьте <em>бриф</em>
      </>
    ),
    briefSub: "4 поля. Детали — по желанию. Всё, что здесь, — конфиденциально.",
    briefToggle: "Или отправьте бриф — 4 поля",
  },
} as const;

export function ContactSplit({
  source = "contacts",
  variant = "compact",
  locale = "uk",
  foldBrief = true,
}: {
  source?: string;
  variant?: LeadFormVariant;
  locale?: ContactsLocale;
  /** Fold the brief form behind a button on phones. Off on /contacts,
      where the form is the point of the page. */
  foldBrief?: boolean;
} = {}) {
  const channels = CHANNELS_BY_LOCALE[locale];
  const meta = CONTACT_META_BY_LOCALE[locale];
  const chrome = CHROME[locale];
  return (
    <section className="relative py-11 sm:py-14 lg:py-20 px-[18px] md:px-8 xl:px-12 bg-[linear-gradient(180deg,var(--color-bg)_0%,oklch(0.13_0.02_300)_100%)]">
      {/* HeroAuditBanner is a client component that reads locale via
          next-intl useLocale — no need to thread the prop. */}
      <HeroAuditBanner />
      <div className="max-w-container mx-auto grid grid-cols-1 gap-5 md:gap-9 items-start min-[901px]:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] min-[901px]:gap-14">
        <aside>
          <H2
            variant="contact-split"
            className={`m-0 mb-[14px] text-ink ${HEADING_EM_CLASS}`}
          >
            {chrome.channelsHeading}
          </H2>
          <p className={SUB_CLASS}>{chrome.channelsSub}</p>
          <ul className={`list-none p-0 mt-0 mb-[26px] flex flex-col gap-1.5 ${foldBrief ? "max-md:mb-2 max-md:grid max-md:grid-cols-3 max-md:gap-2" : ""}`}>
            {channels.map((c) => {
              const Icon = c.icon;
              const isFeatured = c.featured;
              return (
                <li key={c.kind} className={!foldBrief || PRIMARY_KINDS.has(c.kind) ? undefined : "max-md:hidden"}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer" : undefined}
                    className={`${ROW_BASE_CLASS} ${foldBrief ? ROW_PHONE_BUTTON_CLASS : ""} ${
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
                      <span className={`font-sans text-[14px] font-semibold text-ink ${foldBrief ? "max-md:text-[13px]" : ""}`}>
                        {c.label}
                      </span>
                      <span className={`font-mono text-[12px] text-ink-3 tracking-[0.02em] overflow-hidden text-ellipsis whitespace-nowrap ${foldBrief ? "max-md:hidden" : ""}`}>
                        {c.handle}
                      </span>
                    </span>
                    <span
                      className={`${foldBrief ? "max-md:hidden" : ""} ${TIME_BASE_CLASS}${
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
          <div className={`flex flex-wrap gap-2 font-mono text-[11.5px] tracking-[0.02em] text-ink-3 ${foldBrief ? "max-md:hidden" : ""}`}>
            <span>📍 {meta.city}</span>
            <span className="opacity-50">·</span>
            <span>🕒 {meta.hours}</span>
            <span className="opacity-50">·</span>
            <span>🌐 {meta.languages}</span>
          </div>
        </aside>

        <MobileFold
          disabled={!foldBrief}
          label={chrome.briefToggle}
          labelClassName="w-full justify-center rounded-full border border-line-strong px-5 font-sans text-[14px] normal-case tracking-normal text-ink"
        >
          <div className={`mb-6 ${foldBrief ? "max-lg:mt-5" : ""}`}>
            <H2
              variant="contact-split"
              className={`m-0 mb-[14px] text-ink ${foldBrief ? "max-lg:hidden" : ""} ${HEADING_EM_CLASS}`}
            >
              {chrome.briefHeading}
            </H2>
            <p className={SUB_CLASS}>{chrome.briefSub}</p>
          </div>
          <div className="p-5 border border-line-strong rounded-2xl bg-[oklch(0.13_0.005_300_/_0.7)] backdrop-blur-[8px] md:p-7 md:rounded-[22px]">
            <LeadForm source={source} variant={variant} locale={locale} />
          </div>
        </MobileFold>
      </div>
    </section>
  );
}

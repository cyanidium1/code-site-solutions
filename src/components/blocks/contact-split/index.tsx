import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  CHANNELS_BY_LOCALE,
  CONTACT_META_BY_LOCALE,
  type ContactsLocale,
} from "@/content/contacts";
import { H2 } from "@/components/ui";
import { HeroAuditBanner } from "./HeroAuditBanner";
import { MobileFold } from "@/components/shared/mobile-fold";

// Brand-gradient italic em (horizontal 3-stop blue→purple→magenta). Distinct
// from the vertical accent-soft→accent gradient used elsewhere; preserved as
// raw OKLCH stops because no @theme token captures this gradient yet.
const HEADING_EM_CLASS =
  "[&_em]:italic [&_em]:bg-[linear-gradient(90deg,oklch(0.7_0.16_250),oklch(0.6_0.18_295),oklch(0.55_0.18_320))] [&_em]:bg-clip-text [&_em]:text-transparent";

const SUB_CLASS =
  "text-[14px] leading-[1.6] text-ink-dim m-0 mb-7 max-w-[42ch]";

// Channels are one row of icon buttons; the phone number gets its own line
// because it is the one channel people copy or dial rather than tap into an
// app (owner, 2026-09-18 — the list of seven rows read as a wall).
const ICON_BTN_CLASS =
  "inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-[oklch(1_0_0_/_0.03)] text-ink no-underline " +
  "transition-[border-color,background-color,transform] duration-200 hover:-translate-y-px hover:border-line-strong hover:bg-[oklch(1_0_0_/_0.06)]";

const ICON_BTN_FEATURED_CLASS =
  "!border-transparent !bg-[linear-gradient(135deg,var(--color-accent-soft),var(--color-accent))] !text-[oklch(1_0_0_/_0.98)]";

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
  const phone = channels.find((c) => c.kind === "phone");
  const icons = channels.filter((c) => c.kind !== "phone");
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
          {phone ? (
            <a
              href={phone.href}
              className="mb-5 flex flex-col gap-1 no-underline"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                {phone.label}
              </span>
              <span className="font-actay text-[clamp(22px,2.4vw,28px)] font-bold tracking-[-0.01em] text-ink transition-colors duration-200 hover:text-accent-soft">
                {phone.handle}
              </span>
            </a>
          ) : null}
          <ul className="list-none p-0 m-0 mb-[26px] flex flex-wrap gap-2 max-md:mb-2">
            {icons.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer" : undefined}
                    aria-label={`${c.label} — ${c.handle}`}
                    title={`${c.label} · ${c.handle}`}
                    className={`${ICON_BTN_CLASS}${c.featured ? ` ${ICON_BTN_FEATURED_CLASS}` : ""}`}
                  >
                    <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
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

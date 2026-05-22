import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import {
  CHANNELS_BY_LOCALE,
  CONTACT_META_BY_LOCALE,
  type ContactsLocale,
} from "@/content/contacts";
import { HeroAuditBanner } from "./HeroAuditBanner";
import "./contact-split.css";

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
    <section className="contact-split">
      {/* HeroAuditBanner is a client component that reads locale via
          next-intl useLocale — no need to thread the prop. */}
      <HeroAuditBanner />
      <div className="contact-split-inner">
        <aside className="contact-split-channels">
          <div className="contact-split-eyebrow">{chrome.channelsEyebrow}</div>
          <h2 className="contact-split-heading">{chrome.channelsHeading}</h2>
          <p className="contact-split-sub">{chrome.channelsSub}</p>
          <ul className="contact-split-list">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.kind}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noreferrer" : undefined}
                    className={`contact-split-row${c.featured ? " featured" : ""}`}
                  >
                    <span className="contact-split-icon" aria-hidden="true">
                      <Icon size={16} strokeWidth={1.7} />
                    </span>
                    <span className="contact-split-row-main">
                      <span className="contact-split-row-label">{c.label}</span>
                      <span className="contact-split-row-handle">{c.handle}</span>
                    </span>
                    <span className="contact-split-row-time">
                      {c.responseTime}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="contact-split-meta">
            <span>📍 {meta.city}</span>
            <span className="contact-split-meta-sep">·</span>
            <span>🕒 {meta.hours}</span>
            <span className="contact-split-meta-sep">·</span>
            <span>🌐 {meta.languages}</span>
          </div>
        </aside>

        <div className="contact-split-form">
          <div className="contact-split-form-head">
            <div className="contact-split-eyebrow">{chrome.briefEyebrow}</div>
            <h2 className="contact-split-heading">{chrome.briefHeading}</h2>
            <p className="contact-split-sub">{chrome.briefSub}</p>
          </div>
          <div className="contact-split-form-card">
            <LeadForm source={source} variant={variant} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}

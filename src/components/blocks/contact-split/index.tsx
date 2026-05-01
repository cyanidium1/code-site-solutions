import { LeadForm, type LeadFormVariant } from "@/components/blocks/lead-form";
import { CHANNELS, CONTACT_META } from "@/lib/contacts";
import "./contact-split.css";

export function ContactSplit({
  source = "contacts",
  variant = "compact",
}: {
  source?: string;
  variant?: LeadFormVariant;
} = {}) {
  return (
    <section className="contact-split">
      <div className="contact-split-inner">
        <aside className="contact-split-channels">
          <div className="contact-split-eyebrow">/ CHANNELS</div>
          <h2 className="contact-split-heading">
            Виберіть зручний <em>канал</em>
          </h2>
          <p className="contact-split-sub">
            Telegram — найшвидше. Решта — fallback. Жодного бота — пише сам Fedir.
          </p>
          <ul className="contact-split-list">
            {CHANNELS.map((c) => {
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
            <span>📍 {CONTACT_META.city}</span>
            <span className="contact-split-meta-sep">·</span>
            <span>🕒 {CONTACT_META.hours}</span>
            <span className="contact-split-meta-sep">·</span>
            <span>🌐 {CONTACT_META.languages}</span>
          </div>
        </aside>

        <div className="contact-split-form">
          <div className="contact-split-form-head">
            <div className="contact-split-eyebrow">/ BRIEF</div>
            <h2 className="contact-split-heading">
              Або надішліть <em>бриф</em>
            </h2>
            <p className="contact-split-sub">
              4 поля. Деталі — за бажанням. Все що тут — конфіденційно.
            </p>
          </div>
          <div className="contact-split-form-card">
            <LeadForm source={source} variant={variant} />
          </div>
        </div>
      </div>
    </section>
  );
}

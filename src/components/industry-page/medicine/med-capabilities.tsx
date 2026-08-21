import type { ReactNode } from "react";

import type { Locale } from "@/constants/locales";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { MedAdminArt } from "./med-admin-art";
import { MED_COPY } from "./copy";

import "./medicine.css";

/**
 * What we build for clinics + which systems it plugs into.
 *
 * Replaces two of the page's weakest blocks:
 *   - six identical capability cards, each an icon square over a stock photo
 *     dimmed to ~8% — six cards of equal weight say nothing has priority;
 *   - eight empty pills containing nothing but an integration's name, which
 *     is a logo wall with the logos removed.
 *
 * Instead: a ruled specification list against one real piece of artwork (the
 * admin panel those capabilities are actually administered from), and an
 * integration bus that shows direction of travel — what feeds the site, and
 * where a booking goes afterwards. Harness supplies the principle that a
 * marketing graphic should explain the mechanism; Superlative supplies the
 * ruled, mono-labelled register.
 */

export type Capability = {
  icon: ReactNode;
  title: string;
  items: ReactNode[];
};

export function MedCapabilities({
  locale,
  heading,
  sub,
  capabilities,
  testimonialQuote,
  testimonialAuthorName,
  testimonialAuthorRole,
  testimonialEyebrow,
  integrationsHeading,
  integrationsSub,
  integrations,
}: {
  locale: Locale;
  heading?: ReactNode;
  sub?: ReactNode;
  capabilities?: Capability[];
  testimonialQuote?: ReactNode;
  testimonialAuthorName?: string;
  testimonialAuthorRole?: string;
  testimonialEyebrow?: string;
  integrationsHeading?: ReactNode;
  integrationsSub?: ReactNode;
  integrations?: string[];
}) {
  const bus = MED_COPY[locale].bus;

  // Direction matters: the first half feeds the site, the rest receives from
  // it. Splitting the CMS list in two is what turns a name wall into a bus.
  const half = integrations?.length ? Math.ceil(integrations.length / 2) : 0;
  const inbound = integrations?.slice(0, half) ?? [];
  const outbound = integrations?.slice(half) ?? [];

  return (
    <section className="med relative overflow-hidden bg-bg px-6 py-14 sm:px-8 lg:px-12 lg:py-[100px]">
      <div className="med-streaks" />

      <div className="relative mx-auto max-w-container">
        {/* ── Client quote — an editorial pull-quote, not a floating card ── */}
        {testimonialQuote ? (
          <ScrollReveal className="med-reveal mb-14 border-l border-accent-40 pl-6 lg:mb-20 lg:pl-8">
            {testimonialEyebrow ? (
              <span className="med-label mb-4">{testimonialEyebrow}</span>
            ) : null}
            <blockquote className="m-0 max-w-[46ch] font-actay text-[clamp(19px,2.3vw,30px)] font-bold uppercase leading-[1.2] text-ink [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
              {testimonialQuote}
            </blockquote>
            {testimonialAuthorName ? (
              <div className="mt-5 flex items-baseline gap-2.5">
                <span className="font-sans text-[13px] font-semibold text-ink">
                  {testimonialAuthorName}
                </span>
                {testimonialAuthorRole ? (
                  <span className="font-mono text-[11px] text-ink-3">
                    {testimonialAuthorRole}
                  </span>
                ) : null}
              </div>
            ) : null}
          </ScrollReveal>
        ) : null}

        {/* ── Capabilities ───────────────────────────────────────────────── */}
        <ScrollReveal className="med-reveal">
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end">
            {heading ? (
              <h2 className="m-0 max-w-[18ch] font-actay text-[clamp(24px,3.2vw,42px)] font-bold uppercase leading-[1.08] text-ink [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
                {heading}
              </h2>
            ) : null}
            {sub ? (
              <p className="m-0 max-w-[52ch] font-sans text-[14.5px] leading-[1.65] text-ink-dim lg:pb-1.5 [&_strong]:font-semibold [&_strong]:text-ink">
                {sub}
              </p>
            ) : null}
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,470px)] lg:gap-14">
          {/* Ruled specification list */}
          <div className="border-t border-line">
            {capabilities?.map((cap) => (
              <ScrollReveal
                key={cap.title}
                className="med-reveal grid grid-cols-1 gap-x-8 gap-y-3 border-b border-line py-6 sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)]"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-px shrink-0 text-accent-soft [&_svg]:h-[18px] [&_svg]:w-[18px]">
                    {cap.icon}
                  </span>
                  <h3 className="m-0 font-actay text-[14.5px] font-bold uppercase leading-[1.2] text-ink">
                    {cap.title}
                  </h3>
                </div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {cap.items.map((it, j) => (
                    <li
                      key={j}
                      className="font-sans text-[13px] leading-[1.55] text-ink-dim [&_strong]:font-semibold [&_strong]:text-ink"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>

          {/* The artwork the list is administered from */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[18px] border border-line bg-[var(--med-panel)] p-3 shadow-[0_0_70px_oklch(from_var(--color-accent)_l_c_h_/_0.1)]">
              <MedAdminArt />
            </div>
            <p className="mt-3 m-0 font-mono text-[10.5px] leading-[1.5] text-ink-3">
              {bus.hubTitle} · {bus.hubSub}
            </p>
          </div>
        </div>

        {/* ── Integration bus ────────────────────────────────────────────── */}
        {integrations?.length ? (
          <div className="mt-16 lg:mt-24">
            <ScrollReveal className="med-reveal">
              <span className="med-label mb-4">{bus.label}</span>
              <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-end">
                {integrationsHeading ? (
                  <h2 className="m-0 max-w-[18ch] font-actay text-[clamp(22px,2.8vw,36px)] font-bold uppercase leading-[1.1] text-ink [&_em]:bg-[linear-gradient(180deg,var(--color-accent-soft)_0%,var(--color-accent)_100%)] [&_em]:bg-clip-text [&_em]:text-transparent">
                    {integrationsHeading}
                  </h2>
                ) : null}
                {integrationsSub ? (
                  <p className="m-0 max-w-[52ch] font-sans text-[14px] leading-[1.65] text-ink-dim lg:pb-1.5 [&_strong]:font-semibold [&_strong]:text-ink">
                    {integrationsSub}
                  </p>
                ) : null}
              </div>
            </ScrollReveal>

            <div className="mt-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
              <BusColumn
                label={bus.inbound}
                items={inbound}
                side="in"
              />

              {/* Hub */}
              <div className="relative mx-auto w-full max-w-[260px] rounded-[16px] border border-accent-40 bg-[oklch(from_var(--color-accent)_l_c_h_/_0.08)] px-5 py-5 text-center shadow-[0_0_50px_oklch(from_var(--color-accent)_l_c_h_/_0.22)]">
                <span className="block font-actay text-[15px] font-bold uppercase leading-[1.15] text-ink">
                  {bus.hubTitle}
                </span>
                <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent-soft">
                  {bus.hubSub}
                </span>
              </div>

              <BusColumn
                label={bus.outbound}
                items={outbound}
                side="out"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * One side of the bus. Each row is a name on a rail that marches toward (or
 * away from) the hub, so the direction of data is legible without a legend.
 */
function BusColumn({
  label,
  items,
  side,
}: {
  label: string;
  items: string[];
  side: "in" | "out";
}) {
  if (!items.length) return null;
  // Inbound reads name → rail → hub; outbound reads hub → rail → name, so the
  // rail always sits between the system and the site it talks to.
  const alignRight = side === "out";

  return (
    <div>
      <span
        className={`mb-3 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 ${
          alignRight ? "lg:text-right" : ""
        }`}
      >
        {label}
      </span>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {items.map((name) => (
          <li
            key={name}
            className={`flex items-center gap-3 ${
              alignRight ? "lg:flex-row-reverse" : ""
            }`}
          >
            <span className="shrink-0 rounded-[6px] border border-line px-3 py-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-dim">
              {name}
            </span>
            <span
              className="med-rail h-px min-w-[16px] flex-1 bg-repeat-x"
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

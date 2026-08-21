import Link from "next/link";
import {
  CalendarCheck,
  Inbox,
  MessageSquareText,
  MonitorSmartphone,
  Search,
  X,
} from "lucide-react";

import type { Locale } from "@/constants/locales";
import { localizePath } from "@/constants/i18n-routes";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { MED_COPY, type FlowNode } from "./copy";

import "./medicine.css";

/**
 * The patient route, drawn as an instrument read-out rather than a card row.
 *
 * Reference lock: Harness.io contributes the role of the graphic — an
 * atmospheric diagram that explains a process, not a decorated feature list.
 * Superlative contributes its register: a hairline rail, corner metadata,
 * mono labels. Two registers hang off one rail — what we deliver above it,
 * where a template clinic leaks below it — so the reader gets the argument
 * from the shape of the picture before reading a word of it.
 *
 * There is deliberately no card here. Cards are reserved on this page for
 * things you can interact with.
 */

const NODE_ICON: Record<FlowNode["icon"], typeof Search> = {
  search: Search,
  site: MonitorSmartphone,
  booking: CalendarCheck,
  crm: Inbox,
  sms: MessageSquareText,
};

export function MedPatientFlow({ locale }: { locale: Locale }) {
  const c = MED_COPY[locale].flow;
  const nodes = c.nodes;

  return (
    <section className="med relative overflow-hidden bg-bg px-6 py-14 sm:px-8 lg:px-12 lg:py-[100px]">
      <div className="med-streaks" data-flip="true" />

      <div className="relative mx-auto max-w-container">
        <ScrollReveal className="med-reveal">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="med-label">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {c.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              {c.stepMeta}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
            <h2 className="m-0 font-actay text-[clamp(24px,3vw,40px)] font-bold uppercase leading-[1.1] text-ink">
              {c.heading.split("\n").map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="m-0 max-w-[52ch] font-sans text-[14.5px] leading-[1.65] text-ink-dim lg:pb-1.5">
              {c.lede}
            </p>
          </div>
        </ScrollReveal>

        {/* ── Desktop: horizontal rail, two registers ────────────────── */}
        <div className="mt-12 hidden lg:block">
          <div
            className="grid items-stretch"
            // eslint-disable-next-line react/forbid-dom-props -- column count follows the CMS-independent node list length
            style={{ gridTemplateColumns: `repeat(${nodes.length}, minmax(0, 1fr))` }}
          >
            {/* Register 1 — what the patient meets on a site we build */}
            {nodes.map((n) => {
              const Icon = NODE_ICON[n.icon];
              return (
                <div key={`t-${n.label}`} className="flex flex-col justify-end px-3 pb-5">
                  <Icon
                    size={20}
                    strokeWidth={1.3}
                    className="mb-3 text-accent-soft"
                    aria-hidden="true"
                  />
                  <div className="font-actay text-[15px] font-bold uppercase leading-[1.15] text-ink">
                    {n.label}
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] leading-[1.45] text-[var(--med-signal)]">
                    {n.meta}
                  </div>
                </div>
              );
            })}

            {/* The rail itself, with a pip under every node */}
            <div
              className="med-rail relative col-span-full h-px bg-repeat-x"
              aria-hidden="true"
            >
              {nodes.map((n, i) => (
                <span
                  key={`p-${n.label}`}
                  className="med-pip absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--med-vital)]"
                  // eslint-disable-next-line react/forbid-dom-props -- per-pip position and stagger index are computed from the node list
                  style={{
                    left: `${((i + 0.5) / nodes.length) * 100}%`,
                    ["--med-pip-i" as string]: i,
                  }}
                />
              ))}
            </div>

            {/* Register 2 — where the same hop leaks on a template */}
            {nodes.map((n) => (
              <div key={`b-${n.label}`} className="px-3 pt-5">
                {n.leak ? (
                  <div className="flex items-start gap-2">
                    <X
                      size={12}
                      strokeWidth={2.2}
                      className="mt-[3px] shrink-0 text-ink-muted"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-[12.5px] leading-[1.45] text-ink-muted">
                      {n.leak}
                    </span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center gap-7">
            <Legend tone="vital" text={c.ourLegend} />
            <Legend tone="muted" text={c.leakLegend} />
          </div>
        </div>

        {/* ── Mobile / tablet: same diagram rotated onto a vertical rail ── */}
        <ol className="mt-10 m-0 list-none p-0 lg:hidden">
          {nodes.map((n, i) => {
            const Icon = NODE_ICON[n.icon];
            const last = i === nodes.length - 1;
            return (
              <li key={n.label} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-3">
                <div className="relative flex justify-center">
                  <span
                    className="med-pip mt-[7px] h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--med-vital)]"
                    // eslint-disable-next-line react/forbid-dom-props -- stagger index is derived from the node list
                    style={{ ["--med-pip-i" as string]: i }}
                    aria-hidden="true"
                  />
                  {!last ? (
                    <span
                      className="med-rail-y absolute left-1/2 top-[18px] bottom-[-6px] w-px -translate-x-1/2 bg-repeat-y"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>

                <div className={last ? "pb-0" : "pb-7"}>
                  <div className="flex items-center gap-2">
                    <Icon
                      size={15}
                      strokeWidth={1.4}
                      className="text-accent-soft"
                      aria-hidden="true"
                    />
                    <span className="font-actay text-[14px] font-bold uppercase leading-none text-ink">
                      {n.label}
                    </span>
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] leading-[1.45] text-[var(--med-signal)]">
                    {n.meta}
                  </div>
                  {n.leak ? (
                    <div className="mt-2 flex items-start gap-2">
                      <X
                        size={11}
                        strokeWidth={2.2}
                        className="mt-[3px] shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                      <span className="font-sans text-[12px] leading-[1.45] text-ink-muted">
                        {n.leak}
                      </span>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-9 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 max-w-[62ch] font-sans text-[13.5px] leading-[1.6] text-ink-dim">
            {c.foot}
          </p>
          <Link
            href={`${localizePath("/", locale)}#site-audit`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-dim no-underline transition-[color,border-color] duration-200 hover:border-accent-40 hover:text-accent-soft"
          >
            {c.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Legend({ tone, text }: { tone: "vital" | "muted"; text: string }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
      <span
        className={
          tone === "vital"
            ? "h-[7px] w-[7px] rounded-full bg-[var(--med-vital)]"
            : "h-[7px] w-[7px] rounded-full border border-ink-muted"
        }
        aria-hidden="true"
      />
      {text}
    </span>
  );
}

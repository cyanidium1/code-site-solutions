"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";

import { Btn, Input } from "@/components/ui";
import { submitLead } from "@/components/blocks/lead-form/submit";
import type { LandingPageContent } from "@/types/landing";

type MiniCalcContent = NonNullable<LandingPageContent["miniCalc"]>;

/* "Lit glass" panel: gradient hairline ring (glass-ring), soft blur fill and
   a top edge highlight — the underglow pool is painted by the hero wrapper. */
const CARD_CLASS =
  "relative p-6 md:p-7 rounded-[22px] glass-ring bg-[oklch(0.14_0.008_300_/_0.75)] backdrop-blur-[10px] " +
  "shadow-[0_30px_90px_oklch(0_0_0_/_0.5)] " +
  "after:content-[''] after:absolute after:inset-x-8 after:top-0 after:h-px after:rounded-full " +
  "after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0_/_0.3),transparent)] after:pointer-events-none";

const ROW_CLASS =
  "flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-b-0";

const OPTION_BTN_CLASS =
  "group flex w-full items-center justify-between gap-3 py-2.5 text-left cursor-pointer bg-transparent border-0 border-b border-line " +
  "font-sans text-[13.5px] text-ink-dim transition-colors duration-150 hover:text-ink";

const CHECK_BASE =
  "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors duration-150";

const STEP_BTN =
  "inline-flex h-7 w-7 items-center justify-center rounded-full border border-line-strong bg-[oklch(1_0_0_/_0.03)] text-ink-dim cursor-pointer " +
  "transition-colors duration-150 hover:text-ink hover:border-accent-40 disabled:opacity-35 disabled:cursor-default";

const SUBMIT_CLASS =
  "min-h-11 w-full bg-[linear-gradient(90deg,oklch(0.55_0.18_250),oklch(0.55_0.18_295),oklch(0.45_0.2_320))] " +
  "text-[oklch(1_0_0_/_0.95)] font-sans font-semibold text-[13px] tracking-[0.04em] " +
  "shadow-[0_12px_30px_oklch(from_var(--color-accent)_l_c_h_/_0.32)] " +
  "transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-px";

function fmt(currency: string, n: number): string {
  // NBSP thousands separator so prices never wrap mid-number.
  return `${currency}${n.toLocaleString("en-US").replace(/,/g, " ")}`;
}

/**
 * Hero mini-calculator for the landing-page category page: clickable options
 * update the total live; the inline lead form ships the exact selection with
 * the enquiry (description + budget), so the reply can quote precisely.
 */
export function MiniCalc({
  content,
  locale,
}: {
  content: MiniCalcContent;
  locale: string;
}) {
  const [extraBlocks, setExtraBlocks] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const total = useMemo(() => {
    const opts = content.options
      .filter((o) => picked.has(o.id))
      .reduce((s, o) => s + o.price, 0);
    return content.basePrice + extraBlocks * content.blocks.unitPrice + opts;
  }, [content, extraBlocks, picked]);

  const toggle = (id: string) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const buildSummary = () => {
    const lines = [
      content.form.summaryTitle,
      `- ${content.baseLabel}: ${fmt(content.currency, content.basePrice)}`,
    ];
    if (extraBlocks > 0)
      lines.push(
        `- ${content.blocks.label}: +${extraBlocks} (${fmt(content.currency, extraBlocks * content.blocks.unitPrice)})`,
      );
    for (const o of content.options)
      if (picked.has(o.id))
        lines.push(`- ${o.label}: +${fmt(content.currency, o.price)}`);
    lines.push(`= ${content.totalLabel}: ${fmt(content.currency, total)}`);
    return lines.join("\n");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || status === "sending") return;
    setStatus("sending");
    try {
      await submitLead(
        {
          name: name.trim(),
          contact: contact.trim(),
          business: "",
          tier: content.tier,
          description: buildSummary(),
          budget: String(total),
          timeline: "",
          hp,
        },
        `${content.tier}-mini-calc-${locale}`,
      );
      setStatus("ok");
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className={CARD_CLASS}>
      <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3 mb-4">
        {content.title}
      </div>

      {/* Base row */}
      <div className={ROW_CLASS}>
        <div className="min-w-0">
          <div className="font-sans text-[13.5px] font-semibold text-ink">
            {content.baseLabel}
          </div>
          <div className="font-sans text-[12px] text-ink-3">{content.baseNote}</div>
        </div>
        <div className="font-mono text-[13px] text-ink shrink-0">
          {fmt(content.currency, content.basePrice)}
        </div>
      </div>

      {/* Blocks stepper */}
      <div className={ROW_CLASS}>
        <div className="min-w-0">
          <div className="font-sans text-[13.5px] text-ink-dim">
            {content.blocks.label}
          </div>
          <div className="font-sans text-[12px] text-ink-3">{content.blocks.note}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="−"
            className={STEP_BTN}
            disabled={extraBlocks === 0}
            onClick={() => setExtraBlocks((n) => Math.max(0, n - 1))}
          >
            <Minus size={14} />
          </button>
          <span className="font-mono text-[13px] text-ink w-5 text-center">
            {extraBlocks}
          </span>
          <button
            type="button"
            aria-label="+"
            className={STEP_BTN}
            disabled={extraBlocks >= content.blocks.max}
            onClick={() => setExtraBlocks((n) => Math.min(content.blocks.max, n + 1))}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Option toggles */}
      {content.options.map((o) => {
        const on = picked.has(o.id);
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            className={OPTION_BTN_CLASS}
            onClick={() => toggle(o.id)}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span
                className={
                  CHECK_BASE +
                  (on
                    ? " border-accent bg-accent text-[oklch(1_0_0)]"
                    : " border-line-strong bg-transparent text-transparent group-hover:border-accent-40")
                }
              >
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={on ? "text-ink" : undefined}>{o.label}</span>
            </span>
            <span className="font-mono text-[12.5px] text-ink-3 shrink-0">
              +{fmt(content.currency, o.price)}
            </span>
          </button>
        );
      })}

      {/* Total */}
      <div className="flex items-end justify-between gap-3 pt-4">
        <div>
          <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3">
            {content.totalLabel}
          </div>
          <div className="font-actay font-bold text-[clamp(26px,2.4vw,34px)] leading-none mt-1 whitespace-nowrap bg-[linear-gradient(90deg,oklch(0.72_0.16_250),oklch(0.72_0.16_295),oklch(0.66_0.18_320))] bg-clip-text text-transparent">
            {fmt(content.currency, total)}
          </div>
        </div>
        <div className="font-sans text-[11.5px] leading-[1.45] text-ink-3 max-w-[180px] text-right">
          {content.totalNote}
        </div>
      </div>

      {/* Inline lead form */}
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2.5">
        <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3">
          {content.form.heading}
        </div>
        {status === "ok" ? (
          <p className="m-0 py-3 font-sans text-[13.5px] leading-[1.55] text-accent-soft">
            {content.form.success}
          </p>
        ) : (
          <>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={content.form.namePlaceholder}
              autoComplete="name"
              required
            />
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={content.form.contactPlaceholder}
              autoComplete="email"
              required
            />
            {/* Honeypot — hidden from real users, dropped server-side when filled */}
            <input
              type="text"
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <Btn type="submit" className={SUBMIT_CLASS} disabled={status === "sending"}>
              {content.form.submitLabel}
            </Btn>
            {status === "err" ? (
              <p className="m-0 font-sans text-[12.5px] text-[oklch(0.7_0.19_25)]">
                {content.form.error}
              </p>
            ) : null}
          </>
        )}
      </form>
    </div>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

/**
 * Single-select combobox — the in-house replacement for HeroUI's Select
 * (removed 2026-07, see docs/superpowers/specs/
 * 2026-07-08-drop-heroui-and-split-css-design.md).
 *
 * Implements the WAI-ARIA APG "select-only combobox" pattern: DOM focus stays
 * on the trigger button; the visually-active option is conveyed through
 * `aria-activedescendant`. That keeps keyboard handling in one place and makes
 * the component inert to `<dialog>` focus containment.
 *
 * Keyboard: Down/Up/Enter/Space open (Down lands on the selected or first
 * option); while open Down/Up move, Home/End jump, Enter/Space select+close,
 * Esc closes (stopPropagation so a containing dialog stays open), Tab closes
 * and moves on, printable characters do a 500 ms-buffer typeahead.
 *
 * The listbox is absolutely positioned under the trigger (no portal). Inside
 * a scrollable modal body it extends the scroll area rather than floating
 * above it — accepted trade-off, verified in preview.
 */

export type SelectOption = { key: string; label: string };

export type SelectClassNames = {
  label?: string;
  trigger?: string;
  /** The text inside the trigger (selected value or placeholder). */
  value?: string;
  listbox?: string;
  option?: string;
  description?: string;
  error?: string;
};

export type SelectProps = {
  label?: ReactNode;
  placeholder?: string;
  options: SelectOption[];
  /** Selected option key; "" for no selection. */
  value: string;
  onChange: (value: string) => void;
  /** When true, re-selecting the current option cannot clear it (parity with HeroUI). */
  disallowEmptySelection?: boolean;
  isRequired?: boolean;
  description?: ReactNode;
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  classNames?: SelectClassNames;
  name?: string;
};

const LABEL_BASE = "text-ink-dim font-medium text-[13px] tracking-[0.005em]";

const TRIGGER_BASE =
  "flex w-full items-center justify-between gap-2 rounded-xl min-h-10 px-3 py-2 " +
  "border border-line-strong bg-[oklch(0.16_0.005_300/0.7)] cursor-pointer " +
  "transition-[border-color,background-color] duration-200 " +
  "hover:border-ink-3 hover:bg-[oklch(0.16_0.005_300/0.9)] " +
  "focus-visible:outline-none focus-visible:border-accent-soft focus-visible:bg-[oklch(0.18_0.01_300/0.95)] " +
  "aria-expanded:border-accent-soft aria-expanded:bg-[oklch(0.18_0.01_300/0.95)] " +
  "data-[invalid=true]:border-[oklch(0.65_0.18_25)]";

const VALUE_BASE =
  "truncate text-left text-ink font-sans text-[14px] tracking-[0.005em]";

const PLACEHOLDER_CLASS = "text-ink-3";

const LISTBOX_BASE =
  "absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-auto rounded-xl p-1.5 " +
  "bg-[oklch(0.13_0.005_300/0.98)] border border-line-strong " +
  "shadow-[0_18px_48px_oklch(0_0_0/0.5),0_0_0_1px_oklch(1_0_0/0.04)_inset] backdrop-blur-[16px] " +
  "transition-[opacity] duration-150 starting:opacity-0 motion-reduce:transition-none";

const OPTION_BASE =
  "flex items-center rounded-lg px-2.5 py-2 cursor-pointer " +
  "text-ink-dim font-sans text-[14px] transition-[background-color,color] duration-150 " +
  "data-[active=true]:bg-[rgba(255,255,255,0.06)] data-[active=true]:text-ink " +
  "aria-selected:bg-accent-20 aria-selected:text-ink " +
  "aria-selected:data-[active=true]:bg-[oklch(from_var(--color-accent)_l_c_h/0.28)]";

const DESCRIPTION_BASE = "text-ink-3 text-[12px] leading-[1.4]";

const ERROR_BASE = "text-[oklch(0.78_0.14_25)] text-[12px] leading-[1.4]";

export function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  disallowEmptySelection,
  isRequired,
  description,
  errorMessage,
  isInvalid,
  classNames,
  name,
}: SelectProps) {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-desc`;
  const errorId = `${id}-err`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const typeahead = useRef<{ buffer: string; at: number }>({ buffer: "", at: 0 });

  const selected = options.find((o) => o.key === value) ?? null;
  const showError = Boolean(isInvalid && errorMessage);

  const optionId = (key: string) => `${id}-opt-${key}`;

  const open = useCallback(
    (initialKey?: string) => {
      // `value` is "" when nothing is selected — fall through to the first
      // option so the listbox always opens with a highlighted row.
      setActiveKey(initialKey || value || options[0]?.key || null);
      setIsOpen(true);
    },
    [value, options],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveKey(null);
  }, []);

  const commit = useCallback(
    (key: string) => {
      if (key === value && !disallowEmptySelection) {
        onChange("");
      } else {
        onChange(key);
      }
      close();
    },
    [value, disallowEmptySelection, onChange, close],
  );

  // Outside pointerdown closes. Bound only while open.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen, close]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!isOpen || !activeKey) return;
    document
      .getElementById(optionId(activeKey))
      ?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- optionId is stable per id
  }, [isOpen, activeKey]);

  const moveActive = (delta: number) => {
    if (options.length === 0) return;
    const idx = options.findIndex((o) => o.key === activeKey);
    const next = idx === -1
      ? (delta > 0 ? 0 : options.length - 1)
      : Math.min(options.length - 1, Math.max(0, idx + delta));
    setActiveKey(options[next].key);
  };

  const onTypeahead = (char: string) => {
    const now = Date.now();
    const t = typeahead.current;
    t.buffer = now - t.at > 500 ? char : t.buffer + char;
    t.at = now;
    const needle = t.buffer.toLowerCase();
    const match = options.find((o) => o.label.toLowerCase().startsWith(needle));
    if (!match) return;
    if (isOpen) setActiveKey(match.key);
    else commit(match.key);
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ":
          e.preventDefault();
          open();
          return;
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== " ") {
            onTypeahead(e.key);
          }
          return;
      }
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        moveActive(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        moveActive(-1);
        return;
      case "Home":
        e.preventDefault();
        if (options[0]) setActiveKey(options[0].key);
        return;
      case "End":
        e.preventDefault();
        if (options.length) setActiveKey(options[options.length - 1].key);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (activeKey) commit(activeKey);
        else close();
        return;
      case "Escape":
        // Only swallow Esc while open — a containing <dialog> must not close
        // with the listbox; a second Esc then reaches the dialog normally.
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      case "Tab":
        close();
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          onTypeahead(e.key);
        }
    }
  };

  return (
    <div ref={rootRef} className="relative flex flex-col gap-1.5">
      {label ? (
        <span id={labelId} className={cn(LABEL_BASE, classNames?.label)}>
          {label}
          {isRequired ? (
            <span aria-hidden="true" className="text-accent-soft">
              {" *"}
            </span>
          ) : null}
        </span>
      ) : null}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && activeKey ? optionId(activeKey) : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={
          [description ? descriptionId : null, showError ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        data-invalid={isInvalid || undefined}
        className={cn(TRIGGER_BASE, classNames?.trigger)}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={cn(VALUE_BASE, !selected && PLACEHOLDER_CLASS, classNames?.value)}
        >
          {selected ? selected.label : placeholder ?? " "}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-ink-3 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {/* Hidden input keeps the value in native form payloads (parity with HeroUI). */}
      {name ? <input type="hidden" name={name} value={value} /> : null}
      {isOpen ? (
        <div
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className={cn(LISTBOX_BASE, classNames?.listbox)}
        >
          {options.map((o) => (
            <div
              key={o.key}
              id={optionId(o.key)}
              role="option"
              aria-selected={o.key === value}
              data-active={o.key === activeKey || undefined}
              className={cn(OPTION_BASE, classNames?.option)}
              onPointerEnter={() => setActiveKey(o.key)}
              // pointerdown (not click): commit before the outside-pointerdown
              // handler unbinds, and before focus can leave the trigger.
              onPointerDown={(e) => {
                e.preventDefault();
                commit(o.key);
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      ) : null}
      {description ? (
        <p id={descriptionId} className={cn(DESCRIPTION_BASE, classNames?.description)}>
          {description}
        </p>
      ) : null}
      <p
        id={errorId}
        aria-live="polite"
        className={cn(ERROR_BASE, classNames?.error, !showError && "hidden")}
      >
        {showError ? errorMessage : null}
      </p>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";

import { cn } from "@/components/ui";
import { PROPOSAL_LABELS } from "@/components/proposal/labels";
import { ProposalFold } from "@/components/proposal/fold";
import { PortableText } from "@/lib/shared/sanity-portable";
import type {
  ProposalAddon,
  ProposalLanguage,
  ProposalOption,
} from "@/types/proposal";

type PickedAddon = { key: string; name: string; price?: string | null };

type SelectionState = {
  key: string | null;
  name: string | null;
  select: (key: string, name: string) => void;
  /** Галочки «Додатково» — незалежні від вибору варіанта. */
  addons: PickedAddon[];
  toggleAddon: (addon: PickedAddon) => void;
};

const SelectionContext = createContext<SelectionState>({
  key: null,
  name: null,
  select: () => {},
  addons: [],
  toggleAddon: () => {},
});

/**
 * Вибір варіанта живе на рівні сторінки, а не всередині блока варіантів:
 * фінальний CTA стоїть окремою секцією нижче і має знати, що саме обрали,
 * щоб підставити це в тему листа. Стан свідомо не зберігається в URL чи
 * localStorage — це підказка для одного читання, а не налаштування.
 */
export function ProposalSelection({
  initialKey,
  initialName,
  children,
}: {
  initialKey?: string | null;
  initialName?: string | null;
  children: ReactNode;
}) {
  const [state, setState] = useState<{ key: string | null; name: string | null }>({
    key: initialKey ?? null,
    name: initialName ?? null,
  });
  const [addons, setAddons] = useState<PickedAddon[]>([]);
  const select = useCallback((key: string, name: string) => {
    setState({ key, name });
  }, []);
  // Порядок збережено як у документі: галочка знімається й ставиться назад
  // на своє місце, а не в кінець рядка в листі.
  const toggleAddon = useCallback((addon: PickedAddon) => {
    setAddons((prev) =>
      prev.some((a) => a.key === addon.key)
        ? prev.filter((a) => a.key !== addon.key)
        : [...prev, addon],
    );
  }, []);
  const value = useMemo(
    () => ({ key: state.key, name: state.name, select, addons, toggleAddon }),
    [state.key, state.name, select, addons, toggleAddon],
  );
  return (
    <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>
  );
}

export function useProposalSelection() {
  return useContext(SelectionContext);
}

/** «Заголовок | Опис» → дві частини. Без роздільника — весь рядок як опис. */
function splitBullet(raw: string): { title?: string; text: string } {
  const at = raw.indexOf("|");
  if (at === -1) return { text: raw.trim() };
  return { title: raw.slice(0, at).trim(), text: raw.slice(at + 1).trim() };
}

export function ProposalOptionCards({
  options,
  language,
  name,
}: {
  options: ProposalOption[];
  language: ProposalLanguage;
  /** Імʼя radio-групи — унікальне на секцію, щоб дві групи не злипалися. */
  name: string;
}) {
  const t = PROPOSAL_LABELS[language];
  const { key: selected, select } = useProposalSelection();

  return (
    <div
      role="radiogroup"
      className="grid gap-4 md:grid-cols-2"
      aria-label={t.yourChoice}
    >
      {options.map((option) => {
        const optionKey = (option.key ?? option._key).trim();
        const optionName = option.name ?? optionKey;
        const isSelected = selected === optionKey;
        return (
          <label
            key={option._key}
            className={cn(
              "group relative flex cursor-pointer flex-col gap-4 rounded-2xl border p-5 transition sm:p-6",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
              isSelected
                ? "border-accent-soft bg-accent-8 shadow-[0_0_0_1px_var(--color-accent-40),0_18px_50px_-24px_var(--color-accent-55)]"
                : "border-line bg-[oklch(1_0_0/0.015)] hover:border-line-strong",
            )}
          >
            <input
              type="radio"
              name={name}
              value={optionKey}
              checked={isSelected}
              onChange={() => select(optionKey, optionName)}
              className="sr-only"
            />

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {option.badge ? (
                  <span className="mb-2 inline-block rounded-full border border-accent-30 bg-accent-10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                    {option.badge}
                  </span>
                ) : null}
                <h3 className="font-actay text-[20px] uppercase leading-[1.15] tracking-[-0.01em] text-ink">
                  {optionName}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1 grid size-6 shrink-0 place-items-center rounded-full border transition",
                  isSelected
                    ? "border-accent-soft bg-accent-soft text-bg"
                    : "border-line-strong text-transparent",
                )}
              >
                <Check size={14} strokeWidth={3} />
              </span>
            </div>

            {option.price ? (
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-actay text-[30px] leading-none text-ink">
                  {option.price}
                </span>
                {option.priceNote ? (
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    {option.priceNote}
                  </span>
                ) : null}
              </p>
            ) : null}

            {option.summary ? (
              <p className="text-[14px] leading-[1.6] text-ink-dim">{option.summary}</p>
            ) : null}

            {option.bullets?.length ? (
              <ul className="flex flex-col gap-2.5 border-t border-line pt-4">
                {option.bullets.map((raw, i) => {
                  const { title, text } = splitBullet(raw);
                  return (
                    <li
                      key={i}
                      className="grid grid-cols-[14px_1fr] gap-2.5 text-[14px] leading-[1.6] text-ink-dim"
                    >
                      <Check
                        size={14}
                        className="mt-[5px] text-accent-soft"
                        aria-hidden="true"
                      />
                      <span>
                        {title ? (
                          <strong className="font-semibold text-ink">{title}</strong>
                        ) : null}
                        {title && text ? " — " : null}
                        {text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {option.details?.body?.length ? (
              <ProposalFold
                label={option.details.label || t.details}
                className="border-t border-line pt-4"
              >
                <div className="proposal-prose text-[13.5px]">
                  <PortableText value={option.details.body} />
                </div>
              </ProposalFold>
            ) : null}

            <span
              className={cn(
                "mt-auto inline-flex min-h-9 items-center justify-center rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.1em] transition",
                isSelected
                  ? "bg-accent-soft text-bg"
                  : "border border-line-strong text-ink-dim group-hover:text-ink",
              )}
            >
              {isSelected ? t.chosen : t.choose}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export function ProposalAddonCards({
  addons,
  language,
}: {
  addons: ProposalAddon[];
  language: ProposalLanguage;
}) {
  const t = PROPOSAL_LABELS[language];
  const { addons: picked, toggleAddon } = useProposalSelection();

  return (
    <div className="flex flex-col gap-3">
      {addons.map((addon) => {
        const addonKey = (addon.key ?? addon._key).trim();
        const addonName = addon.name ?? addonKey;
        const isOn = picked.some((a) => a.key === addonKey);
        return (
          <label
            key={addon._key}
            className={cn(
              "flex cursor-pointer gap-4 rounded-2xl border p-5 transition",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
              isOn
                ? "border-accent-soft bg-accent-8"
                : "border-line bg-[oklch(1_0_0/0.015)] hover:border-line-strong",
            )}
          >
            <input
              type="checkbox"
              checked={isOn}
              onChange={() =>
                toggleAddon({ key: addonKey, name: addonName, price: addon.price })
              }
              className="sr-only"
            />
            {/* Квадрат, а не кружечок: форма підказує, що вибрати можна
                кілька, ще до того як людина прочитає заголовок секції. */}
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition",
                isOn
                  ? "border-accent-soft bg-accent-soft text-bg"
                  : "border-line-strong text-transparent",
              )}
            >
              <Check size={13} strokeWidth={3} />
            </span>

            <span className="flex min-w-0 flex-col gap-2">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-actay text-[17px] uppercase leading-[1.2] text-ink">
                  {addonName}
                </span>
                {addon.price ? (
                  <span className="font-actay text-[17px] leading-[1.2] text-accent-soft">
                    {addon.price}
                  </span>
                ) : null}
              </span>
              {addon.summary ? (
                <span className="text-[14px] leading-[1.6] text-ink-dim">
                  {addon.summary}
                </span>
              ) : null}
              {addon.details?.body?.length ? (
                <ProposalFold label={addon.details.label || t.more}>
                  <div className="proposal-prose text-[13.5px]">
                    <PortableText value={addon.details.body} />
                  </div>
                </ProposalFold>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * Підставляє обраний варіант у посилання: `mailto:` отримує тему й тіло,
 * Telegram — параметр `text`. Решта схем лишається як є.
 */
function withSelection(
  href: string,
  { subject, body }: { subject: string; body: string },
): string {
  const trimmed = href.trim();
  if (!trimmed) return trimmed;

  // Вручну, а не через URLSearchParams: той кодує пробіл як «+», і поштові
  // клієнти показують «Ви+обрали» просто в темі листа. RFC 6068 для mailto
  // вимагає відсоткове кодування, Telegram його теж розуміє.
  const q = (k: string, v: string) => `${k}=${encodeURIComponent(v)}`;

  if (trimmed.toLowerCase().startsWith("mailto:")) {
    const [base, existing] = trimmed.split("?");
    const carried = existing
      ? existing
          .split("&")
          .filter((p) => p && !/^(subject|body)=/i.test(p))
          .join("&")
      : "";
    const query = [carried, q("subject", subject), q("body", body)]
      .filter(Boolean)
      .join("&");
    return `${base}?${query}`;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname === "t.me" || url.hostname === "telegram.me") {
      url.search = "";
      return `${url.toString()}?${q("text", body)}`;
    }
  } catch {
    // Відносний шлях або tel: — нічого не додаємо.
  }
  return trimmed;
}

export function ProposalCtaActions({
  language,
  docTitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  language: ProposalLanguage;
  docTitle: string;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
}) {
  const t = PROPOSAL_LABELS[language];
  const { name: selectedName, addons } = useProposalSelection();
  const optionName = selectedName ?? "";
  const addonLine = addons.length
    ? `${t.alsoChose}: ${addons
        .map((a) => [a.name, a.price].filter(Boolean).join(" "))
        .join(", ")}`
    : "";

  // Поки нічого не обрано, посилання лишається чистим: порожні
  // `?subject=&body=` у поштовому клієнті виглядають як зіпсоване посилання.
  const decorate = (href: string) => {
    if (!optionName && !addonLine) return href;
    const lines = [optionName ? t.replyWith(optionName) : "", addonLine].filter(
      Boolean,
    );
    return withSelection(href, {
      subject: optionName ? t.mailSubject(docTitle, optionName) : docTitle,
      body: `${lines.join("\n")}\n\n`,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {selectedName || addons.length ? (
        <p
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent-soft"
          aria-live="polite"
        >
          {[
            selectedName ? `${t.yourChoice}: ${selectedName}` : null,
            addons.length
              ? `${t.alsoChose}: ${addons.map((a) => a.name).join(", ")}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {primaryLabel && primaryHref ? (
          <a
            href={decorate(primaryHref)}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[14px] font-semibold text-bg no-underline shadow-[0_4px_16px_var(--color-accent-20),inset_0_0_0_1px_oklch(1_0_0/0.1)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--color-accent-30),inset_0_0_0_1px_oklch(1_0_0/0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            {primaryLabel}
          </a>
        ) : null}
        {secondaryLabel && secondaryHref ? (
          <a
            href={decorate(secondaryHref)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-line-strong px-6 py-3.5 text-[14px] font-medium text-ink no-underline transition hover:border-ink-dim hover:bg-[oklch(1_0_0/0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
          >
            {secondaryLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

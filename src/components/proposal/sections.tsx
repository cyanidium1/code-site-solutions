import type { CSSProperties } from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/components/ui";
import { ProposalFold } from "@/components/proposal/fold";
import { PROPOSAL_LABELS } from "@/components/proposal/labels";
import {
  ProposalAddonCards,
  ProposalCtaActions,
  ProposalOptionCards,
} from "@/components/proposal/selection";
import { PortableText } from "@/lib/shared/sanity-portable";
import { SanityImg } from "@/lib/shared/sanity-image";
import { IMG_SIZES } from "@/lib/shared/image-sizes";
import type {
  ProposalCtaSection,
  ProposalDetails,
  ProposalImage,
  ProposalLanguage,
  ProposalListSection,
  ProposalRichSection,
  ProposalSection,
  ProposalTableSection,
} from "@/types/proposal";

/* ── Спільні частини секції ──────────────────────────────────────────── */

function SectionHead({
  eyebrow,
  heading,
  lede,
  id,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  lede?: string | null;
  id?: string;
}) {
  if (!eyebrow && !heading && !lede) return null;
  return (
    <header className="flex flex-col gap-3">
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-soft">
          {eyebrow}
        </p>
      ) : null}
      {heading ? (
        <h2
          id={id}
          className="font-actay text-[clamp(22px,4.6vw,32px)] uppercase leading-[1.1] tracking-[-0.02em] text-ink scroll-mt-24"
        >
          {heading}
        </h2>
      ) : null}
      {lede ? (
        <p className="max-w-[68ch] text-[15px] leading-[1.65] text-ink-dim">{lede}</p>
      ) : null}
    </header>
  );
}

function Fold({
  details,
  language,
}: {
  details?: ProposalDetails | null;
  language: ProposalLanguage;
}) {
  if (!details?.body?.length) return null;
  return (
    <ProposalFold label={details.label || PROPOSAL_LABELS[language].details}>
      <div className="proposal-prose text-[14px]">
        <PortableText value={details.body} />
      </div>
    </ProposalFold>
  );
}

/* ── Зображення ──────────────────────────────────────────────────────── */

/**
 * Ряд зображень, де ширина кожного пропорційна його співвідношенню сторін.
 *
 * Це потрібно для найчастішої пари в КП — скриншот на компʼютері поруч зі
 * скриншотом на телефоні. У рівних колонках вертикальний телефон витягується
 * на пів екрана і перетягує увагу на себе; за пропорціями він займає стільки,
 * скільки й має, і пара читається як одна ілюстрація.
 *
 * Нижче `sm` ряд розпадається на стовпчик: два скриншоти в 375 px не лізуть.
 */
function ImageRow({ images }: { images: ProposalImage[] }) {
  const ratios = images.map((img) => {
    const d = img.asset?.metadata?.dimensions;
    return d?.width && d?.height ? d.width / d.height : 1;
  });
  const total = ratios.reduce((sum, r) => sum + r, 0);
  const single = images.length === 1;

  // Ширина кожного кадру — його частка ряду, а не «половина екрана»: без
  // цього вузький скриншот телефона просив у CDN 711 px при оригіналі 374
  // і приїжджав розтягнутим.
  const CONTENT_WIDTH = 896; // max-w-[960px] мінус бічні поля
  const sizeFor = (i: number) =>
    `(max-width: 640px) 92vw, ${Math.round((ratios[i] / total) * CONTENT_WIDTH)}px`;

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      {images.map((img, i) => (
        <figure
          key={img._key}
          className={cn(
            "flex min-w-0 flex-col gap-2.5",
            !single && "sm:flex-[var(--ratio)_1_0%]",
          )}
          // eslint-disable-next-line react/forbid-dom-props -- частка ряду рахується з пропорцій зображення, яке лежить у CMS; класом це не виразити
          style={single ? undefined : ({ "--ratio": ratios[i] } as CSSProperties)}
        >
          <span className="block overflow-hidden rounded-xl border border-line bg-[oklch(1_0_0/0.02)]">
            <SanityImg
              image={img}
              alt={img.alt || img.caption || ""}
              sizes={single ? IMG_SIZES.prose : sizeFor(i)}
              className="block h-auto w-full"
            />
          </span>
          {img.caption ? (
            <figcaption className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
              {img.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

/* ── Текстова секція ─────────────────────────────────────────────────── */

function RichSection({
  section,
  language,
  headingId,
}: {
  section: ProposalRichSection;
  language: ProposalLanguage;
  headingId: string;
}) {
  const images = (section.images ?? []).filter((img) => img.asset);
  return (
    <>
      <SectionHead
        eyebrow={section.eyebrow}
        heading={section.heading}
        id={headingId}
      />
      {section.body?.length ? (
        <div className="proposal-prose">
          <PortableText value={section.body} />
        </div>
      ) : null}
      {images.length ? <ImageRow images={images} /> : null}
      <Fold details={section.details} language={language} />
    </>
  );
}

/* ── Таблиця ─────────────────────────────────────────────────────────── */

/**
 * Одна таблиця на три подачі:
 *   findings — рядки автонумеруються, перша колонка стає заголовком картки;
 *   compare  — остання колонка («наша») підсвічена акцентом;
 *   plain    — без прикрас, `emphasis` робить рядок підсумковим.
 *
 * Нижче `md` таблиця розпадається на картки: перша комірка — заголовок,
 * решта підписані через `data-label`, а не другою копією розмітки.
 */
function TableSection({
  section,
  language,
  headingId,
}: {
  section: ProposalTableSection;
  language: ProposalLanguage;
  headingId: string;
}) {
  // Не `filter(Boolean)`: у таблиці порівняння перша колонка навмисно без
  // назви (у ній лежать підписи рядків), і відкидання порожнього рядка
  // зсувало всю сітку — остання колонка просто зникала.
  const columns = (section.columns ?? []).map((c) => c ?? "");
  const rows = section.rows ?? [];
  if (!columns.length || !rows.length) return null;

  const variant = section.variant ?? "plain";
  const numbered = variant === "findings";
  const accentCol = variant === "compare" ? columns.length - 1 : -1;

  return (
    <>
      <SectionHead
        eyebrow={section.eyebrow}
        heading={section.heading}
        lede={section.lede}
        id={headingId}
      />
      <div className="md:overflow-x-auto md:rounded-2xl md:border md:border-line">
        <table className="w-full border-collapse text-left max-md:block md:min-w-[620px]">
          <thead className="max-md:sr-only">
            <tr className="bg-accent-6">
              {numbered ? (
                <th className="w-10 border-b border-line px-4 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-3">
                  #
                </th>
              ) : null}
              {columns.map((col, ci) => (
                <th
                  key={ci}
                  className={cn(
                    "border-b border-line px-5 py-3.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]",
                    ci === accentCol ? "bg-accent-10 text-accent-soft" : "text-ink-3",
                  )}
                >
                  {col || " "}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="max-md:flex max-md:flex-col max-md:gap-2.5">
            {rows.map((row, ri) => {
              // Коротший рядок добиваємо порожніми комірками: крива таблиця
              // в CMS не повинна ламати сітку в клієнта на очах.
              const cells = Array.from(
                { length: columns.length },
                (_, ci) => row.cells?.[ci] ?? "",
              );
              return (
                <tr
                  key={row._key}
                  className={cn(
                    "border-b border-line last:border-b-0",
                    "max-md:block max-md:rounded-xl max-md:border max-md:border-line max-md:bg-[oklch(1_0_0/0.015)] max-md:px-4 max-md:py-3 max-md:last:border-b",
                    row.emphasis && "bg-accent-6 max-md:border-accent-25",
                  )}
                >
                  {numbered ? (
                    <td className="px-4 py-4 align-top font-mono text-[12px] text-ink-3 max-md:hidden">
                      {ri + 1}
                    </td>
                  ) : null}
                  {cells.map((cell, ci) => (
                    <td
                      key={ci}
                      data-label={ci === 0 ? undefined : columns[ci]}
                      className={cn(
                        "px-5 py-4 align-top text-[14px] leading-[1.6] text-ink-dim",
                        ci === 0 && "font-medium text-ink",
                        ci === accentCol && "bg-accent-6 text-ink",
                        row.emphasis && "font-semibold text-ink",
                        "max-md:block max-md:px-0 max-md:py-0",
                        ci === 0
                          ? "max-md:mb-2 max-md:text-[15px]"
                          : "max-md:mt-1.5 max-md:before:mb-0.5 max-md:before:block max-md:before:font-mono max-md:before:text-[10px] max-md:before:uppercase max-md:before:tracking-[0.12em] max-md:before:text-ink-3 max-md:before:content-[attr(data-label)]",
                      )}
                    >
                      {ci === 0 && numbered ? (
                        <span className="mr-2 font-mono text-[12px] text-ink-3 md:hidden">
                          {ri + 1}.
                        </span>
                      ) : null}
                      {cell || (ci === 0 ? "" : "—")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {section.caption ? (
        <p className="text-[13px] leading-[1.6] text-ink-3">{section.caption}</p>
      ) : null}
      <Fold details={section.details} language={language} />
    </>
  );
}

/* ── Перелік ─────────────────────────────────────────────────────────── */

function ListSection({
  section,
  language,
  headingId,
}: {
  section: ProposalListSection;
  language: ProposalLanguage;
  headingId: string;
}) {
  const items = section.items ?? [];
  if (!items.length) return null;
  const tone = section.tone ?? "included";

  // Пункт із катом розкривається на місці. У дві колонки це штовхало б
  // сусідній пункт униз при кожному відкритті, тому щойно в списку є хоч
  // один кат — список стає одноколонковим.
  const hasFolds = items.some((item) => item.details?.body?.length);

  return (
    <>
      <SectionHead
        eyebrow={section.eyebrow}
        heading={section.heading}
        lede={section.lede}
        id={headingId}
      />
      <ul
        className={cn(
          "grid gap-x-8",
          hasFolds
            ? "gap-y-6"
            : cn("gap-y-4", tone === "excluded" ? "sm:grid-cols-2" : "md:grid-cols-2"),
        )}
      >
        {items.map((item, i) => (
          <li
            key={item._key}
            className="grid grid-cols-[18px_1fr] gap-3 text-[14.5px] leading-[1.65] text-ink-dim"
          >
            <span aria-hidden="true" className="mt-[5px]">
              {tone === "included" ? (
                <Check size={16} className="text-accent-soft" />
              ) : tone === "excluded" ? (
                <Minus size={16} className="text-ink-3" />
              ) : (
                <span className="block font-mono text-[12px] text-ink-3">{i + 1}</span>
              )}
            </span>
            <div className="min-w-0">
              <p>
                {item.title ? (
                  <strong className="font-semibold text-ink">{item.title}</strong>
                ) : null}
                {item.title && item.text ? " — " : null}
                {item.text}
              </p>
              {item.details?.body?.length ? (
                <ProposalFold
                  label={item.details.label || PROPOSAL_LABELS[language].more}
                  className="mt-2"
                >
                  <div className="proposal-prose text-[13.5px]">
                    <PortableText value={item.details.body} />
                  </div>
                </ProposalFold>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      <Fold details={section.details} language={language} />
    </>
  );
}

/* ── Наступний крок ──────────────────────────────────────────────────── */

function CtaSection({
  section,
  language,
  docTitle,
  headingId,
}: {
  section: ProposalCtaSection;
  language: ProposalLanguage;
  docTitle: string;
  headingId: string;
}) {
  return (
    <div className="rounded-3xl border border-accent-25 bg-accent-6 p-6 shadow-[0_0_60px_-30px_var(--color-accent-55)] sm:p-9">
      <div className="flex flex-col gap-5">
        <SectionHead
          eyebrow={section.eyebrow}
          heading={section.heading}
          id={headingId}
        />
        {section.body?.length ? (
          <div className="proposal-prose">
            <PortableText value={section.body} />
          </div>
        ) : null}
        <ProposalCtaActions
          language={language}
          docTitle={docTitle}
          primaryLabel={section.primaryLabel}
          primaryHref={section.primaryHref}
          secondaryLabel={section.secondaryLabel}
          secondaryHref={section.secondaryHref}
        />
        {section.note ? (
          <p className="text-[13px] leading-[1.6] text-ink-3">{section.note}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ── Диспетчер ───────────────────────────────────────────────────────── */

export function ProposalSectionView({
  section,
  language,
  docTitle,
}: {
  section: ProposalSection;
  language: ProposalLanguage;
  docTitle: string;
}) {
  const headingId = `s-${section._key}`;

  if (section._type === "proposalCtaBlock") {
    return (
      <section>
        <CtaSection
          section={section}
          language={language}
          docTitle={docTitle}
          headingId={headingId}
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      {section._type === "proposalRichBlock" ? (
        <RichSection section={section} language={language} headingId={headingId} />
      ) : section._type === "proposalTableBlock" ? (
        <TableSection section={section} language={language} headingId={headingId} />
      ) : section._type === "proposalListBlock" ? (
        <ListSection section={section} language={language} headingId={headingId} />
      ) : section._type === "proposalAddonsBlock" ? (
        <>
          <SectionHead
            eyebrow={section.eyebrow}
            heading={section.heading}
            lede={section.lede}
            id={headingId}
          />
          <ProposalAddonCards addons={section.addons ?? []} language={language} />
          {section.note ? (
            <p className="text-[13px] leading-[1.6] text-ink-3">{section.note}</p>
          ) : null}
        </>
      ) : section._type === "proposalOptionsBlock" ? (
        <>
          <SectionHead
            eyebrow={section.eyebrow}
            heading={section.heading}
            lede={section.lede}
            id={headingId}
          />
          <ProposalOptionCards
            options={section.options ?? []}
            language={language}
            name={`opt-${section._key}`}
          />
          {section.note ? (
            <p className="text-[13px] leading-[1.6] text-ink-3">{section.note}</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

/** Заголовок секції для змісту; без заголовка секція в зміст не потрапляє. */
export function sectionTocEntry(section: ProposalSection) {
  const heading = "heading" in section ? section.heading : null;
  return heading ? { id: `s-${section._key}`, label: heading } : null;
}

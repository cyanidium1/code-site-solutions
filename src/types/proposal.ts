/**
 * Типи комерційної пропозиції (/offer/<slug>).
 *
 * Дзеркало `code-site-solutions-admin/queries/proposal.ts`. Мультимовних
 * полів тут немає свідомо: КП пишеться одному клієнту однією мовою, вона
 * лежить у `language` (виняток — `alt` зображення, яке приходить із
 * спільного об'єкта `imageWithLocalizedAlt`).
 */

import type { PortableBlock, SanityImage } from "@/types/sanity";

/** Мова КП. Збігається з локалями сайту, але зберігається на документі. */
export type ProposalLanguage = "uk" | "ru" | "en";

/** Згорнутий блок «читати більше» всередині секції. */
export type ProposalDetails = {
  label?: string | null;
  body?: PortableBlock[] | null;
};

export type ProposalHighlight = {
  _key: string;
  value?: string | null;
  label?: string | null;
};

/**
 * Зображення КП: сплощене `SanityImage` плюс видимий підпис.
 *
 * `alt` у базовому типі мультимовний, тут — звичайний рядок (КП одномовне),
 * тому його треба саме перекрити через `Omit`: перетин `LocalizedString`
 * і `string` дав би `never` і мовчки зламав би тип.
 */
export type ProposalImage = Omit<SanityImage, "alt"> & {
  _key: string;
  caption?: string | null;
  alt?: string | null;
};

export type ProposalRichSection = {
  _type: "proposalRichBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: PortableBlock[] | null;
  images?: ProposalImage[] | null;
  details?: ProposalDetails | null;
};

export type ProposalTableRow = {
  _key: string;
  cells?: string[] | null;
  emphasis?: boolean | null;
};

export type ProposalTableSection = {
  _type: "proposalTableBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  lede?: string | null;
  variant?: "findings" | "compare" | "plain" | null;
  columns?: string[] | null;
  rows?: ProposalTableRow[] | null;
  caption?: string | null;
  details?: ProposalDetails | null;
};

export type ProposalOption = {
  _key: string;
  /** Стабільний ключ, який летить у CTA-посилання. */
  key?: string | null;
  name?: string | null;
  price?: string | null;
  priceNote?: string | null;
  summary?: string | null;
  bullets?: string[] | null;
  badge?: string | null;
  recommended?: boolean | null;
  details?: ProposalDetails | null;
};

export type ProposalOptionsSection = {
  _type: "proposalOptionsBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  lede?: string | null;
  options?: ProposalOption[] | null;
  note?: string | null;
};

export type ProposalAddon = {
  _key: string;
  /** Стабільний ключ — їде в CTA-посилання разом із обраним варіантом. */
  key?: string | null;
  name?: string | null;
  price?: string | null;
  summary?: string | null;
  details?: ProposalDetails | null;
};

export type ProposalAddonsSection = {
  _type: "proposalAddonsBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  lede?: string | null;
  addons?: ProposalAddon[] | null;
  note?: string | null;
};

export type ProposalListItem = {
  _key: string;
  title?: string | null;
  text?: string | null;
  /** Кат саме для цього пункту — технічні подробиці однієї тези. */
  details?: ProposalDetails | null;
};

export type ProposalListSection = {
  _type: "proposalListBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  lede?: string | null;
  tone?: "included" | "excluded" | "neutral" | null;
  items?: ProposalListItem[] | null;
  details?: ProposalDetails | null;
};

export type ProposalCtaSection = {
  _type: "proposalCtaBlock";
  _key: string;
  eyebrow?: string | null;
  heading?: string | null;
  body?: PortableBlock[] | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  note?: string | null;
};

export type ProposalSection =
  | ProposalRichSection
  | ProposalTableSection
  | ProposalOptionsSection
  | ProposalAddonsSection
  | ProposalListSection
  | ProposalCtaSection;

export type ProposalDoc = {
  _id: string;
  slug: string;
  title?: string | null;
  language?: ProposalLanguage | null;
  client?: {
    name?: string | null;
    contact?: string | null;
    site?: string | null;
  } | null;
  meta?: {
    preparedBy?: string | null;
    preparedByRole?: string | null;
    email?: string | null;
    telegram?: string | null;
    issuedOn?: string | null;
    validUntil?: string | null;
    currencyNote?: string | null;
  } | null;
  hero?: {
    eyebrow?: string | null;
    heading?: string | null;
    lede?: string | null;
    highlights?: ProposalHighlight[] | null;
  } | null;
  sections?: ProposalSection[] | null;
  footerNote?: string | null;
};

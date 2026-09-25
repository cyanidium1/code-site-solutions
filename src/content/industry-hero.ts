import type { Locale } from "@/constants/locales";
import type { IndustryId } from "@/constants/pricing";

/**
 * One-line hero lede per industry.
 *
 * The Sanity `hero.lede` runs 150–290 characters and repeats the price and
 * the term — which the H1 spec row now states directly above it, so the hero
 * said the same thing twice and the second time in four lines of grey text.
 * These are the same promise at a third of the length: what the site does for
 * this niche, nothing the heading already covers.
 *
 * The CMS field is untouched and still feeds the rest of the page; only the
 * hero reads this. An industry missing here falls back to the CMS lede.
 */
export const INDUSTRY_HERO_LEDE: Partial<
  Record<IndustryId, Record<Locale, string>>
> = {
  "real-estate": {
    uk: "Каталог об'єктів із фільтрами, картою, валютами і заявками — в одній системі.",
    ru: "Каталог объектов с фильтрами, картой, валютами и заявками — в одной системе.",
    en: "A property catalogue with filters, a map, currencies and enquiries in one system.",
  },
  legal: {
    uk: "Структура і тексти — навколо клієнта, а не навколо юриста.",
    ru: "Структура и тексты — вокруг клиента, а не вокруг юриста.",
    en: "Structure and copy built around the client, not the solicitor.",
  },
  finance: {
    uk: "Складні послуги простими словами: довіра на першому екрані, заявка в кінці.",
    ru: "Сложные услуги простыми словами: доверие на первом экране, заявка в конце.",
    en: "Complex services in plain words: trust on the first screen, an enquiry at the end.",
  },
  renovation: {
    uk: "Калькулятор кошторису, галерея «до/після» і локальне SEO — в одному сайті.",
    ru: "Калькулятор сметы, галерея «до/после» и локальное SEO — в одном сайте.",
    en: "A quote calculator, a before / after gallery and local SEO in one site.",
  },
  auto: {
    uk: "Калькулятор доставки з усіма зборами і PDF-інвойс: клієнт бачить цифру до дзвінка.",
    ru: "Калькулятор доставки со всеми сборами и PDF-инвойс: клиент видит цифру до звонка.",
    en: "A delivery calculator with every fee and a PDF invoice — the number before the call.",
  },
};

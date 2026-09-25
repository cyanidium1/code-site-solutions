import type { Locale } from "@/constants/locales";

/**
 * Copy for `/thank-you` — the page every submitted form lands on.
 *
 * The page exists for two reasons, in this order: the visitor needs to know
 * the enquiry arrived and what happens next, and Google Ads needs one
 * destination URL to count as a conversion (`THANK_YOU_PATH`). Nothing here
 * promises anything the packages don't already: the 24-hour quote and the
 * fixed price in the contract are the same commitments the offer pages make.
 */
export type ThankYouCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headingLead: string;
  headingEm: string;
  lede: string;
  stepsHeading: string;
  steps: { when: string; title: string; body: string }[];
  fasterHeading: string;
  fasterSub: string;
  nextHeading: string;
  next: { label: string; sub: string; href: string }[];
  homeLabel: string;
};

export const THANK_YOU_COPY: Record<Locale, ThankYouCopy> = {
  uk: {
    metaTitle: "Дякуємо — заявку прийнято | Code-Site.Art",
    metaDescription:
      "Заявка у нас. Прорахунок — пакет, ціна і строк — надішлемо протягом 24 годин у робочий час.",
    eyebrow: "/ ЗАЯВКУ ПРИЙНЯТО",
    headingLead: "Дякуємо. Заявка ",
    headingEm: "вже у нас",
    lede:
      "Нічого підтверджувати не треба. Протягом 24 годин у робочий час надішлемо прорахунок: пакет, ціну і строк.",
    stepsHeading: "Що далі",
    steps: [
      {
        when: "Зараз",
        title: "Заявка прийшла",
        body: "Вона вже в нашому робочому чаті. Дублювати її не потрібно.",
      },
      {
        when: "До 24 годин",
        title: "Прорахунок",
        body: "Відповідаємо з пакетом, фіксованою ціною і строком. Якщо по вашій задачі потрібні уточнення — спершу поставимо питання.",
      },
      {
        when: "Далі",
        title: "Договір або нічого",
        body: "Підходить — підписуємо договір і стартуємо. Не підходить — прорахунок залишається вам, він безкоштовний і ні до чого не зобов'язує.",
      },
    ],
    fasterHeading: "Потрібно швидше?",
    fasterSub: "Напишіть напряму — у робочий час відповідаємо за 30 хвилин.",
    nextHeading: "Поки чекаєте",
    next: [
      { label: "Кейси", sub: "Що ми вже запустили", href: "/portfolio" },
      { label: "Часті питання", sub: "Ціни, строки, договір, гарантія", href: "/faq" },
      { label: "Калькулятор", sub: "Прикинути вартість самостійно", href: "/calculator" },
      { label: "Блог", sub: "Розбори по сайтах і SEO", href: "/blog" },
    ],
    homeLabel: "На головну",
  },
  ru: {
    metaTitle: "Спасибо — заявка принята | Code-Site.Art",
    metaDescription:
      "Заявка у нас. Расчёт — пакет, цена и срок — пришлём в течение 24 часов в рабочее время.",
    eyebrow: "/ ЗАЯВКА ПРИНЯТА",
    headingLead: "Спасибо. Заявка ",
    headingEm: "уже у нас",
    lede:
      "Ничего подтверждать не нужно. В течение 24 часов в рабочее время пришлём расчёт: пакет, цену и срок.",
    stepsHeading: "Что дальше",
    steps: [
      {
        when: "Сейчас",
        title: "Заявка пришла",
        body: "Она уже в нашем рабочем чате. Дублировать её не нужно.",
      },
      {
        when: "До 24 часов",
        title: "Расчёт",
        body: "Отвечаем с пакетом, фиксированной ценой и сроком. Если по задаче нужны уточнения — сначала зададим вопросы.",
      },
      {
        when: "Дальше",
        title: "Договор или ничего",
        body: "Подходит — подписываем договор и стартуем. Не подходит — расчёт остаётся вам, он бесплатный и ни к чему не обязывает.",
      },
    ],
    fasterHeading: "Нужно быстрее?",
    fasterSub: "Напишите напрямую — в рабочее время отвечаем за 30 минут.",
    nextHeading: "Пока ждёте",
    next: [
      { label: "Кейсы", sub: "Что мы уже запустили", href: "/portfolio" },
      { label: "Частые вопросы", sub: "Цены, сроки, договор, гарантия", href: "/faq" },
      { label: "Калькулятор", sub: "Прикинуть стоимость самостоятельно", href: "/calculator" },
      { label: "Блог", sub: "Разборы по сайтам и SEO", href: "/blog" },
    ],
    homeLabel: "На главную",
  },
  en: {
    metaTitle: "Thank you — we have your enquiry | Code-Site.Art",
    metaDescription:
      "Your enquiry is in. We send the quote — package, price and timeline — within 24 hours during working hours.",
    eyebrow: "/ ENQUIRY RECEIVED",
    headingLead: "Thank you. Your enquiry ",
    headingEm: "is with us",
    lede:
      "Nothing to confirm. Within 24 working hours we send the quote: the package, the price and the timeline.",
    stepsHeading: "What happens next",
    steps: [
      {
        when: "Now",
        title: "It arrived",
        body: "Your enquiry is already in our working chat. No need to send it twice.",
      },
      {
        when: "Within 24 hours",
        title: "The quote",
        body: "We reply with a package, a fixed price and a timeline. If the brief needs clarifying, we ask first.",
      },
      {
        when: "After that",
        title: "A contract, or nothing",
        body: "If it fits, we sign and start. If it doesn't, the quote is yours to keep — it's free and commits you to nothing.",
      },
    ],
    fasterHeading: "Need it sooner?",
    fasterSub: "Message us directly — we answer within 30 minutes during working hours.",
    nextHeading: "While you wait",
    next: [
      { label: "Case studies", sub: "What we have shipped", href: "/portfolio" },
      { label: "FAQ", sub: "Prices, timelines, contract, warranty", href: "/faq" },
      { label: "Calculator", sub: "Work out a budget yourself", href: "/calculator" },
      { label: "Blog", sub: "Deep dives on websites and SEO", href: "/blog" },
    ],
    homeLabel: "Back to home",
  },
};

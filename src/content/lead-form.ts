/**
 * Localized strings for the standalone lead-form block.
 * Mirrored shape across `uk` and `en` — keep them in lockstep when
 * adding new keys.
 */

import type { LeadFormLocale } from "@/constants/form-options";

export const LEAD_FORM_STRINGS_BY_LOCALE = {
  uk: {
    nameLabel: "Як до вас звертатися",
    namePlaceholder: "Ваше імʼя (необовʼязково)",
    namePlaceholderShort: "Ваше імʼя (необовʼязково)",
    contactLabel: "Телефон, Telegram або email",
    contactPlaceholder: "+380..., @username або hello@example.com",
    contactPlaceholderShort: "+380..., @username або hello@…",
    contactDescription: "Як з вами зручніше зв'язатися",
    contactValidation: "Вкажіть телефон, Telegram або email",
    businessLabel: "Тип бізнесу",
    businessPlaceholder: "Оберіть галузь (необовʼязково)",
    descriptionLabel: "Опис задачі",
    descriptionPlaceholder:
      "Розкажіть коротко: який сайт потрібен, що зараз не працює, дедлайн (необовʼязково)",
    tierLabel: "Орієнтовний пакет",
    tierPlaceholder: "Оберіть пакет",
    budgetLabel: "Бюджет",
    budgetPlaceholder: "Не обовʼязково",
    timelineLabel: "Коли треба запустити",
    timelinePlaceholder: "Не обовʼязково",
    showDetails: "Додати деталі",
    hideDetails: "Приховати деталі",
    detailsMeta: "пакет, бюджет, термін",
    submit: "Надіслати — відповімо за 1-2 години",
    successTitle: "Дякуємо! Заявка отримана.",
    successBody:
      "Зв'яжемось з вами протягом 1-2 робочих годин через Telegram або email який ви залишили.",
    successOrTg: "Або одразу пишіть в Telegram →",
    errorBody: "Щось пішло не так. Спробуйте ще раз або пишіть в Telegram",
    privacy:
      "Не передаємо ваші дані третім особам. Зберігаємо тільки для відповіді на вашу заявку.",
  },
  en: {
    nameLabel: "How should we address you?",
    namePlaceholder: "Your name (optional)",
    namePlaceholderShort: "Your name (optional)",
    contactLabel: "Phone, Telegram, or email",
    contactPlaceholder: "+44..., @username, or hello@example.com",
    contactPlaceholderShort: "+44..., @username, or hello@…",
    contactDescription: "How's it easiest to reach you",
    contactValidation: "Please enter a phone, Telegram, or email",
    businessLabel: "Business type",
    businessPlaceholder: "Pick an industry (optional)",
    descriptionLabel: "Project description",
    descriptionPlaceholder:
      "A short summary: what site you need, what's not working now, deadline (optional)",
    tierLabel: "Approximate tier",
    tierPlaceholder: "Pick a tier",
    budgetLabel: "Budget",
    budgetPlaceholder: "Optional",
    timelineLabel: "Launch timeline",
    timelinePlaceholder: "Optional",
    showDetails: "Add details",
    hideDetails: "Hide details",
    detailsMeta: "tier, budget, timeline",
    submit: "Send, we reply within 1-2 hours",
    successTitle: "Thanks! Your message was received.",
    successBody:
      "We'll get back within 1-2 business hours via the Telegram or email you provided.",
    successOrTg: "Or message Telegram directly →",
    errorBody:
      "Something went wrong. Try again or message Telegram",
    privacy:
      "We don't share your data with third parties. We only store it to reply to your inquiry.",
  },
} as const satisfies Record<LeadFormLocale, Record<string, string>>;

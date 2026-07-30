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
    submitDemo: "Отримати тестовий доступ",
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
    contactLabel: "Phone, WhatsApp, or email",
    contactPlaceholder: "+44..., or hello@example.com",
    contactPlaceholderShort: "+44... or hello@…",
    contactDescription: "How's it easiest to reach you",
    contactValidation: "Please enter a phone, WhatsApp, or email",
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
    submitDemo: "Get demo access",
    successTitle: "Thanks! Your message was received.",
    successBody:
      "We'll get back within 1-2 business hours via the WhatsApp or email you provided.",
    successOrTg: "Or message us on WhatsApp →",
    errorBody:
      "Something went wrong. Try again or message WhatsApp",
    privacy:
      "We don't share your data with third parties. We only store it to reply to your inquiry.",
  },
  ru: {
    nameLabel: "Как к вам обращаться",
    namePlaceholder: "Ваше имя (необязательно)",
    namePlaceholderShort: "Ваше имя (необязательно)",
    contactLabel: "Телефон, Telegram или email",
    contactPlaceholder: "+380..., @username или hello@example.com",
    contactPlaceholderShort: "+380..., @username или hello@…",
    contactDescription: "Как с вами удобнее связаться",
    contactValidation: "Укажите телефон, Telegram или email",
    businessLabel: "Тип бизнеса",
    businessPlaceholder: "Выберите отрасль (необязательно)",
    descriptionLabel: "Описание задачи",
    descriptionPlaceholder:
      "Расскажите коротко: какой сайт нужен, что сейчас не работает, дедлайн (необязательно)",
    tierLabel: "Ориентировочный пакет",
    tierPlaceholder: "Выберите пакет",
    budgetLabel: "Бюджет",
    budgetPlaceholder: "Необязательно",
    timelineLabel: "Когда нужно запустить",
    timelinePlaceholder: "Необязательно",
    showDetails: "Добавить детали",
    hideDetails: "Скрыть детали",
    detailsMeta: "пакет, бюджет, срок",
    submit: "Отправить — ответим за 1-2 часа",
    submitDemo: "Получить тестовый доступ",
    successTitle: "Спасибо! Заявка получена.",
    successBody:
      "Свяжемся с вами в течение 1-2 рабочих часов через Telegram или email, который вы оставили.",
    successOrTg: "Или сразу пишите в Telegram →",
    errorBody: "Что-то пошло не так. Попробуйте ещё раз или пишите в Telegram",
    privacy:
      "Не передаём ваши данные третьим лицам. Храним только для ответа на вашу заявку.",
  },
} as const satisfies Record<LeadFormLocale, Record<string, string>>;

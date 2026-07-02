import type { CookiePolicyCopy } from "../en/cookie-policy";

export const cookiePolicyUk: CookiePolicyCopy = {
  eyebrow: "/ LEGAL",
  title: "Політика cookies",
  sub: "Які cookies використовує code-site.art, навіщо та як змінити свій вибір.",
  intro:
    "Cookies — це невеликі текстові файли, які зберігаються у вашому браузері. Аналітичні та маркетингові cookies ми встановлюємо лише після вашої згоди через банер (Google Consent Mode v2). Вибір зберігається 12 місяців, і його можна змінити будь-коли.",
  manage:
    "Щоб змінити або відкликати згоду, натисніть «Налаштування cookies» у футері сайту — вікно налаштувань відкриється одразу.",
  updated: "Оновлено: 2 липня 2026",
  tableHead: { name: "Cookie", provider: "Провайдер", purpose: "Призначення", ttl: "Строк" },
  sections: [
    {
      heading: "Необхідні — працюють завжди",
      rows: [
        {
          name: "cs-consent",
          provider: "code-site.art (first-party)",
          purpose: "Зберігає ваш вибір щодо cookies.",
          ttl: "12 місяців",
        },
      ],
    },
    {
      heading: "Аналітичні — лише за вашою згодою",
      rows: [
        {
          name: "_ga",
          provider: "Google Analytics 4",
          purpose: "Розрізняє відвідувачів для анонімної статистики.",
          ttl: "2 роки",
        },
        {
          name: "_ga_*",
          provider: "Google Analytics 4",
          purpose: "Підтримує стан сесії для статистики.",
          ttl: "2 роки",
        },
      ],
    },
    {
      heading: "Маркетингові — лише за вашою згодою",
      rows: [
        {
          name: "_gcl_au",
          provider: "Google Ads",
          purpose: "Вимірює конверсії рекламних кампаній.",
          ttl: "3 місяці",
        },
        {
          name: "_fbp",
          provider: "Meta Pixel",
          purpose: "Вимірює ефективність реклами та уможливлює ремаркетинг.",
          ttl: "3 місяці",
        },
      ],
    },
  ],
};

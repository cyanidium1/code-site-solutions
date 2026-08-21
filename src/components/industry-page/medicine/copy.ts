import type { Locale } from "@/constants/locales";

/**
 * Copy for the medicine-only sections that have no CMS counterpart
 * (the patient-route diagram and the integration bus). Everything the
 * industryPage document already carries — hero, reasons, case, services,
 * comparison, FAQ, audit — keeps coming from Sanity.
 */

export type FlowNode = {
  /** Icon key resolved by <MedFlowIcon>. */
  icon: "search" | "site" | "booking" | "crm" | "sms";
  label: string;
  meta: string;
  /** Where patients drop out of this hop on a typical template site. */
  leak?: string;
};

export type MedCopy = {
  flow: {
    label: string;
    stepMeta: string;
    heading: string;
    lede: string;
    nodes: FlowNode[];
    leakLegend: string;
    ourLegend: string;
    foot: string;
    ctaLabel: string;
  };
  bus: {
    label: string;
    hubTitle: string;
    hubSub: string;
    inbound: string;
    outbound: string;
  };
  demo: {
    railTitle: string;
    railIdle: string;
    events: {
      service: string;
      doctor: string;
      slot: string;
      confirm: string;
      sms: string;
      crm: string;
    };
  };
};

export const MED_COPY: Record<Locale, MedCopy> = {
  uk: {
    flow: {
      label: "МАРШРУТ ПАЦІЄНТА",
      stepMeta: "КРОК 01 → 05",
      heading: "Пʼять кроків від пошуку\nдо запису в календарі",
      lede: "Кожен крок — місце, де клініка або отримує пацієнта, або втрачає його. Ось де саме тече у типової клініки на шаблоні і що ми ставимо замість.",
      nodes: [
        {
          icon: "search",
          label: "Пошук",
          meta: "«стоматолог + район»",
          leak: "клініки немає на першій сторінці",
        },
        {
          icon: "site",
          label: "Сайт клініки",
          meta: "0,9 с до першого екрана",
          leak: "шаблон вантажиться 4–6 с",
        },
        {
          icon: "booking",
          label: "Віджет запису",
          meta: "3 кроки, без дзвінка",
          leak: "тільки телефон у робочий час",
        },
        {
          icon: "crm",
          label: "CRM і Telegram",
          meta: "адміністратор бачить одразу",
          leak: "заявка лежить у пошті",
        },
        {
          icon: "sms",
          label: "SMS пацієнту",
          meta: "підтвердження + нагадування",
        },
      ],
      leakLegend: "де тече на шаблоні",
      ourLegend: "як працює в нас",
      foot: "Сумарно шаблонна клініка втрачає пацієнта на трьох із чотирьох переходів. Ми проєктуємо сайт від останнього кроку до першого.",
      ctaLabel: "Перевірити мій маршрут",
    },
    bus: {
      label: "ІНТЕГРАЦІЇ",
      hubTitle: "Сайт клініки",
      hubSub: "єдина точка входу",
      inbound: "звідки беруться дані",
      outbound: "куди йде запис",
    },
    demo: {
      railTitle: "Що відбувається на боці клініки",
      railIdle: "Порядок подій — реальний. Так само віджет відпрацьовує на бойових сайтах клінік.",
      events: {
        service: "Послугу передано в календар — тривалість і ціна підтягнулись автоматично",
        doctor: "Перевірено графік лікаря: зайняті слоти закриті",
        slot: "Слот заброньовано на 10 хвилин, поки пацієнт заповнює форму",
        confirm: "Запис створено в CRM клініки",
        sms: "SMS-підтвердження надіслано пацієнту",
        crm: "Адміністратор отримав сповіщення в Telegram",
      },
    },
  },
  ru: {
    flow: {
      label: "МАРШРУТ ПАЦИЕНТА",
      stepMeta: "ШАГ 01 → 05",
      heading: "Пять шагов от поиска\nдо записи в календаре",
      lede: "Каждый шаг — место, где клиника либо получает пациента, либо теряет его. Вот где именно течёт у типовой клиники на шаблоне и что мы ставим вместо.",
      nodes: [
        {
          icon: "search",
          label: "Поиск",
          meta: "«стоматолог + район»",
          leak: "клиники нет на первой странице",
        },
        {
          icon: "site",
          label: "Сайт клиники",
          meta: "0,9 с до первого экрана",
          leak: "шаблон грузится 4–6 с",
        },
        {
          icon: "booking",
          label: "Виджет записи",
          meta: "3 шага, без звонка",
          leak: "только телефон в рабочее время",
        },
        {
          icon: "crm",
          label: "CRM и Telegram",
          meta: "администратор видит сразу",
          leak: "заявка лежит в почте",
        },
        {
          icon: "sms",
          label: "SMS пациенту",
          meta: "подтверждение + напоминание",
        },
      ],
      leakLegend: "где течёт на шаблоне",
      ourLegend: "как работает у нас",
      foot: "В сумме шаблонная клиника теряет пациента на трёх переходах из четырёх. Мы проектируем сайт от последнего шага к первому.",
      ctaLabel: "Проверить мой маршрут",
    },
    bus: {
      label: "ИНТЕГРАЦИИ",
      hubTitle: "Сайт клиники",
      hubSub: "единая точка входа",
      inbound: "откуда берутся данные",
      outbound: "куда уходит запись",
    },
    demo: {
      railTitle: "Что происходит на стороне клиники",
      railIdle: "Порядок событий — реальный. Точно так же виджет отрабатывает на боевых сайтах клиник.",
      events: {
        service: "Услуга передана в календарь — длительность и цена подтянулись автоматически",
        doctor: "Проверен график врача: занятые слоты закрыты",
        slot: "Слот забронирован на 10 минут, пока пациент заполняет форму",
        confirm: "Запись создана в CRM клиники",
        sms: "SMS-подтверждение отправлено пациенту",
        crm: "Администратор получил уведомление в Telegram",
      },
    },
  },
  en: {
    flow: {
      label: "PATIENT ROUTE",
      stepMeta: "STEP 01 → 05",
      heading: "Five steps from a search\nto a slot in the calendar",
      lede: "Every step is a place where a clinic either wins the patient or loses them. Here is exactly where a template clinic leaks, and what we put there instead.",
      nodes: [
        {
          icon: "search",
          label: "Search",
          meta: "“dentist + neighbourhood”",
          leak: "clinic is not on page one",
        },
        {
          icon: "site",
          label: "Clinic site",
          meta: "0.9 s to first paint",
          leak: "template loads in 4–6 s",
        },
        {
          icon: "booking",
          label: "Booking widget",
          meta: "3 steps, no phone call",
          leak: "phone only, office hours only",
        },
        {
          icon: "crm",
          label: "CRM and Telegram",
          meta: "reception sees it instantly",
          leak: "request sits in an inbox",
        },
        {
          icon: "sms",
          label: "SMS to patient",
          meta: "confirmation + reminder",
        },
      ],
      leakLegend: "where a template leaks",
      ourLegend: "how ours works",
      foot: "Added up, a template clinic loses the patient on three hops out of four. We design the site backwards — from the last step to the first.",
      ctaLabel: "Check my route",
    },
    bus: {
      label: "INTEGRATIONS",
      hubTitle: "Clinic website",
      hubSub: "one point of entry",
      inbound: "where data comes from",
      outbound: "where the booking goes",
    },
    demo: {
      railTitle: "What happens on the clinic's side",
      railIdle: "The order is the real one. This is how the widget behaves on live clinic sites.",
      events: {
        service: "Service passed to the calendar — duration and price pulled in automatically",
        doctor: "Practitioner's schedule checked: booked slots closed off",
        slot: "Slot held for 10 minutes while the patient fills the form",
        confirm: "Appointment created in the clinic's CRM",
        sms: "SMS confirmation sent to the patient",
        crm: "Reception notified in Telegram",
      },
    },
  },
};

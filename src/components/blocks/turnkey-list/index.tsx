import {
  FileText,
  Palette,
  Smartphone,
  Code,
  LayoutDashboard,
  Lock,
  Cloud,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

import "./turnkey-list.css";

export type TurnkeyItem = {
  icon: LucideIcon;
  title: string;
  line: string;
};

const DEFAULT_ITEMS: TurnkeyItem[] = [
  {
    icon: FileText,
    title: "Копірайтинг",
    line: "стартові кейси, SEO-статті, тексти головної",
  },
  {
    icon: Palette,
    title: "Дизайн",
    line: "2 раунди правок включено",
  },
  {
    icon: Smartphone,
    title: "Верстка",
    line: "адаптив mobile / tablet / desktop",
  },
  {
    icon: Code,
    title: "Програмування",
    line: "Next.js, всі інтеграції",
  },
  {
    icon: LayoutDashboard,
    title: "Адмінка",
    line: "Sanity, ви додаєте контент з телефону",
  },
  {
    icon: Lock,
    title: "Домен і SSL",
    line: "налаштовуємо самі",
  },
  {
    icon: Cloud,
    title: "Хостинг",
    line: "Vercel або Cloudflare на ваш акаунт",
  },
  {
    icon: Rocket,
    title: "Запуск",
    line: "Search Console, Analytics, 301-редиректи",
  },
  {
    icon: LifeBuoy,
    title: "1 рік підтримки",
    line: "баги, оновлення, консультації",
  },
];

const DEFAULT_NOT_DOING: string[] = [
  "Фотозйомка об'єктів",
  "Платна реклама (Google Ads / Facebook)",
  "Підтримка стороннього коду / WordPress-сайтів",
];

const DEFAULT_FOOTER = (
  <div className="turnkey-list-not">
    <div className="turnkey-list-not-head">Чого ми не робимо</div>
    <ul className="turnkey-list-not-list">
      {DEFAULT_NOT_DOING.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <p className="turnkey-list-not-foot">
      Якщо потрібне — порадимо перевірених партнерів. Не накручуємо ціну за
      чужу роботу.
    </p>
  </div>
);

export function TurnkeyList({
  eyebrow = "ПІД КЛЮЧ",
  heading = (
    <>
      Все, <em>що ми робимо за вас</em>
    </>
  ),
  sub = "Ви платите фіксовану суму і отримуєте готовий сайт. Не пишете ТЗ. Не шукаєте референси. Не ловите фотографа. Ось що входить у проєкт без додаткової плати:",
  items = DEFAULT_ITEMS,
  footer = DEFAULT_FOOTER,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: TurnkeyItem[];
  footer?: React.ReactNode;
} = {}) {
  return (
    <section className="turnkey-list" id="turnkey">
      <div className="turnkey-list-bg" />
      <div className="turnkey-list-inner">
        <div className="turnkey-list-head">
          <span className="turnkey-list-eyebrow">{eyebrow}</span>
          <h2 className="turnkey-list-h2">{heading}</h2>
          {sub ? <p className="turnkey-list-sub">{sub}</p> : null}
        </div>
        <div className="turnkey-list-grid">
          {items.map((it, i) => {
            const Icon = it.icon;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div className="turnkey-list-cell" key={`${it.title}-${i}`}>
                <span className="turnkey-list-num">{num}</span>
                <div className="turnkey-list-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.7} />
                </div>
                <div className="turnkey-list-text">
                  <h3 className="turnkey-list-title">{it.title}</h3>
                  <p className="turnkey-list-line">{it.line}</p>
                </div>
              </div>
            );
          })}
        </div>
        {footer ? <div className="turnkey-list-foot">{footer}</div> : null}
      </div>
    </section>
  );
}

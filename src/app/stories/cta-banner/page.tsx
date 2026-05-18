import { CtaBanner } from "@/components/blocks/cta-banner";

export const metadata = { title: "Story · cta-banner" };

const dashed = (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed var(--line)",
      margin: 0,
    }}
  />
);

export default function CtaBannerStory() {
  return (
    <>
      {/* 1. з eyebrow + 2 кнопки (calculator promo для /pricing) */}
      <CtaBanner
        eyebrow="/ CALCULATOR"
        heading={
          <>
            Не впевнені, який <em>тир</em> підходить?
          </>
        }
        sub="Калькулятор за 60 секунд порахує вилку вартості під ваш проект і пришле детальний прайс на email."
        ctaPrimary={{
          label: "Спробувати калькулятор",
          href: "/calculator",
        }}
        ctaSecondary={{ label: "Або обговорити з нами", href: "/contacts" }}
      />
      {dashed}

      {/* 2. без eyebrow, тільки heading + sub + 1 кнопка */}
      <CtaBanner
        heading={
          <>
            Готові <em>обговорити</em> ваш проєкт?
          </>
        }
        sub="Безкоштовна 30-хв консультація. Розуміємо за 15 хв, чи підходимо одне одному."
        ctaPrimary={{ label: "Записатись на дзвінок", href: "/contacts" }}
      />
      {dashed}

      {/* 3. minimal — тільки heading + 1 кнопка */}
      <CtaBanner
        heading={
          <>
            Хочете <em>такий самий</em> результат?
          </>
        }
        ctaPrimary={{ label: "Подивитись усі кейси", href: "/portfolio" }}
        ctaSecondary={{ label: "Telegram @fedirdev", href: "https://t.me/fedirdev" }}
      />
    </>
  );
}

import { PageHero } from "@/components/blocks/page-hero";

export const metadata = { title: "Story · page-hero" };

export default function PageHeroStory() {
  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Про нас" },
        ]}
        eyebrow="ПРО НАС"
        headline={
          <>
            Невелика команда сильних сеньйорів. Без <em>корпоративної</em> шкарлупи.
          </>
        }
        sub="Code-Site.Art — бутик-студія з Києва. Робимо custom-coded сайти для бізнесу з 2023 року. Команда в Україні, проєкти в Україні, ЄС, США, Данії."
      />

      <hr className="m-0 border-0 border-t border-dashed border-line" />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Прайс" },
        ]}
        eyebrow="ЦІНИ"
        headline={
          <>
            Прозорий прайс — від <em>$1 000</em> до <em>$14 000+</em>
          </>
        }
        sub="Без «під запит». Без прихованих платежів. 3 пакети під різні потреби — від лендингу до enterprise-сайту."
      />

      <hr className="m-0 border-0 border-t border-dashed border-line" />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Портфоліо" },
        ]}
        eyebrow="ПОРТФОЛІО"
        headline={
          <>
            30+ проєктів. <em>Реальні</em> метрики, реальні клієнти.
          </>
        }
        sub="Healthcare, Real Estate, SaaS, e-commerce. Кейси з Україні, ЄС, США, Данії — з конкретними цифрами зростання."
      />

      <hr className="m-0 border-0 border-t border-dashed border-line" />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: "Контакти" },
        ]}
        eyebrow="КОНТАКТИ"
        headline={<>Як <em>зв&#39;язатися</em> з нами</>}
        sub="Telegram — найшвидший канал, відповідь за 30 хв. Email і дзвінок — 2-4 робочі години. Особиста зустріч — Київ, або Zoom-консультація з будь-якої точки."
      />
    </>
  );
}

import { type CSSProperties } from "react";
import { ImageText } from "@/components/blocks/image-text";

export const metadata = { title: "Story · image-text" };

const dashed = <hr className="m-0 border-0 border-t border-dashed border-line" />;

// Local "fill parent" gradient placeholder for image-text image slots.
// (The shared `GradPlaceholder` primitive uses a fixed 16:9 aspect ratio,
// which doesn't fit here — the parent already sizes the slot.)
function GradPlaceholder({
  from = "oklch(0.55 0.18 295)",
  to = "oklch(0.45 0.20 230)",
  label,
}: {
  from?: string;
  to?: string;
  label?: string;
}) {
  return (
    <div
      // eslint-disable-next-line react/forbid-dom-props -- dynamic CSS custom properties
      style={{ "--gp-from": from, "--gp-to": to } as CSSProperties}
      className="relative flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--gp-from)_0%,var(--gp-to)_100%)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:20px_20px] opacity-60"
      />
      {label ? (
        <span className="relative font-mono text-[11px] uppercase tracking-[0.14em] text-white/85">
          {label}
        </span>
      ) : null}
    </div>
  );
}

// Avatar placeholder for founder card (used in side-with-list variant).
function AvatarPlaceholder({ initials = "FA" }: { initials?: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_30%,oklch(0.55_0.18_295)_0%,oklch(0.25_0.10_290)_70%)]">
      <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[linear-gradient(180deg,oklch(0.7_0.14_295),oklch(0.55_0.18_295))] font-sans text-[64px] font-bold tracking-[-0.02em] text-bg">
        {initials}
      </div>
    </div>
  );
}

export default function ImageTextStory() {
  return (
    <>
      {/* 1. side · imageLeft */}
      <ImageText
        variant="side"
        imageVariant="imageLeft"
        eyebrow="ПРО НАС"
        heading={<>Хто ми <em>насправді</em></>}
        body={[
          "Ми — невелика студія, не корпорація. Між вами і людьми, які пишуть код, немає аккаунт-менеджерів і прошарків. Ви розмовляєте напряму з тими, хто буде робити ваш проект.",
          "Працюємо переважно з українським і європейським ринком: клініки, юр. фірми, бухгалтерські компанії, e-commerce, SaaS-стартапи.",
        ]}
        image={<GradPlaceholder label="команда" from="oklch(0.55 0.18 295)" to="oklch(0.40 0.18 250)" />}
      />
      {dashed}

      {/* 2. side · imageRight */}
      <ImageText
        variant="side"
        imageVariant="imageRight"
        eyebrow="КОМАНДА"
        heading={<>Маленька команда. <em>Велика</em> мережа.</>}
        body="Постійне ядро — Fedir плюс 2 контрактори: senior-дизайнер і backend-розробник. Підключаємо їх під проект. Для проектів від $10 000+ розширюємо команду до 5-7 людей з перевіреної мережі."
        image={<GradPlaceholder label="мережа" from="oklch(0.50 0.18 200)" to="oklch(0.45 0.20 295)" />}
      />
      {dashed}

      {/* 3. side-with-list with CTA */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="ЗАСНОВНИК"
        heading={<>Fedir <em>Alpatov</em></>}
        body={[
          "Засновник Code-Site.Art. До студії — 8+ років у розробці на різних позиціях: фріланс, продуктові команди, агенції.",
          "Code-Site.Art відкрив у 2023 коли побачив, скільки часу і грошей клієнти зливають у WordPress, плагіни, фрилансерів-одинаків. Зробив студію, яка робить навпаки: custom-код, прозорий прайс, фіксовані терміни.",
        ]}
        bulletList={[
          "8+ років у веб-розробці",
          "30+ проектів як founder",
          "Спеціалізація: Next.js, Astro, headless CMS",
          "Спікер на українських dev-конференціях",
          "Open-source contributor",
        ]}
        cta={{ label: "Написати в Telegram", href: "https://t.me/fedirdev" }}
        image={<AvatarPlaceholder initials="FA" />}
      />
      {dashed}

      {/* 4. side-with-list without CTA */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="ПРОЦЕС"
        heading={<>Як ми <em>працюємо</em></>}
        body="Кожен проект проходить ті самі 5 кроків. Терміни і скоупи фіксуємо в договорі. Прогрес показуємо щотижня."
        bulletList={[
          "Brief — 1 day · free",
          "Design — 1-2 weeks",
          "Development — 2-6 weeks · weekly demos",
          "Testing — 1 week · 60-point QA checklist",
          "Launch + Support — 1 рік підтримки в комплекті",
        ]}
        image={<GradPlaceholder label="process" from="oklch(0.50 0.16 145)" to="oklch(0.45 0.20 295)" />}
      />
      {dashed}

      {/* 4b. side-with-list · bulletIcon="dot" (inherits text colour) */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="BULLET · DOT"
        heading={<>Маркер <em>крапка</em></>}
        body="Стиль маркера «dot» — проста крапка, що успадковує колір тексту (currentColor)."
        bulletList={[
          "Перший пункт списку",
          "Другий пункт списку",
          "Третій пункт списку",
        ]}
        bulletIcon="dot"
        image={<GradPlaceholder label="dot" from="oklch(0.50 0.16 145)" to="oklch(0.45 0.20 295)" />}
      />
      {dashed}

      {/* 4c. side-with-list · bulletIcon="cross" */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageRight"
        eyebrow="BULLET · CROSS"
        heading={<>Маркер <em>хрестик</em></>}
        body="Стиль маркера «cross» — для списків того, чого ми НЕ робимо."
        bulletList={[
          "Без WordPress і плагінів",
          "Без прихованих доплат",
          "Без нескінченних правок",
        ]}
        bulletIcon="cross"
        image={<GradPlaceholder label="cross" from="oklch(0.50 0.18 25)" to="oklch(0.40 0.18 350)" />}
      />
      {dashed}

      {/* 5. centered */}
      <ImageText
        variant="centered"
        eyebrow="СТУДІЯ"
        heading={<>Київ. <em>Без офісу-вітрини.</em></>}
        body="Робимо проекти, не корпоративний ритуал. Команда збирається у проектний ритм, без щоденних зайвих стендапів і open-space-відволікання. Зустрічі — за реальною необхідністю, через Zoom або в кав'ярні."
        image={<GradPlaceholder label="kyiv · 2023" from="oklch(0.55 0.18 295)" to="oklch(0.30 0.10 270)" />}
      />
    </>
  );
}

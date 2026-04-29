import { ImageText } from "@/components/blocks/image-text";

export const metadata = { title: "Story · image-text" };

const dashed = (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed var(--line)",
      margin: 0,
    }}
  />
);

// abstract gradient placeholder for image slot
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
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.6,
        }}
      />
      {label ? (
        <span
          style={{
            position: "relative",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

// avatar placeholder for founder card
function AvatarPlaceholder({ initials = "FA" }: { initials?: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 30% 30%, oklch(0.55 0.18 295) 0%, oklch(0.25 0.10 290) 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "linear-gradient(180deg, oklch(0.7 0.14 295), oklch(0.55 0.18 295))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Manrope, sans-serif",
          fontWeight: 700,
          fontSize: 64,
          color: "var(--bg)",
          letterSpacing: "-0.02em",
        }}
      >
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
        eyebrow="/ 02 ABOUT"
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
        eyebrow="/ 04 TEAM"
        heading={<>Маленька команда. <em>Велика</em> мережа.</>}
        body="Постійне ядро — Fedir плюс 2 контрактори: senior-дизайнер і backend-розробник. Підключаємо їх під проект. Для проектів від $10 000+ розширюємо команду до 5-7 людей з перевіреної мережі."
        image={<GradPlaceholder label="мережа" from="oklch(0.50 0.18 200)" to="oklch(0.45 0.20 295)" />}
      />
      {dashed}

      {/* 3. side-with-list with CTA */}
      <ImageText
        variant="side-with-list"
        imageVariant="imageLeft"
        eyebrow="/ 03 FOUNDER"
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
        eyebrow="/ 06 PROCESS"
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

      {/* 5. centered */}
      <ImageText
        variant="centered"
        eyebrow="/ 09 STUDIO"
        heading={<>Київ. <em>Без офісу-вітрини.</em></>}
        body="Робимо проекти, не корпоративний ритуал. Команда збирається у проектний ритм, без щоденних зайвих стендапів і open-space-відволікання. Зустрічі — за реальною необхідністю, через Zoom або в кав'ярні."
        image={<GradPlaceholder label="kyiv · 2023" from="oklch(0.55 0.18 295)" to="oklch(0.30 0.10 270)" />}
      />
    </>
  );
}

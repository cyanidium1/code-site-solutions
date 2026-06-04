"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export type TeamLocale = "uk" | "en";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  tags: string[];
};

/**
 * Team copy stored by locale. EN mirrors UA with names transliterated where
 * standard (Fedir Alpatov, Diana Merkatun, Olga Mykhalkova, Kristina
 * Bondarenko). Full bios are translated to match the UA arc.
 *
 * Photos in `public/team/`. Missing file → card falls back to initials.
 * Tags stay in English on both locales (technical names).
 */
const TEAM_BY_LOCALE: Record<TeamLocale, TeamMember[]> = {
  uk: [
    {
      id: "fedir",
      name: "Федір Алпатов",
      role: "Tech Lead · Засновник",
      image: "/team/fedir.jpg",
      shortDescription:
        "«Кожен сайт — це інструмент продажів. Усе технічне має служити цьому, а не навпаки.»",
      fullDescription: [
        "Федір — техлід і засновник студії. Працює з кодовими сайтами понад 6 років і спеціалізується на проєктах, де стандартні рішення не працюють.",
        "Його сильна сторона — вміння брати складні або розмиті вимоги і перетворювати їх у чітку технічну реалізацію.",
        "Він однаково добре розуміє бізнес, маркетинг і розробку, тому проєкти не просто виглядають добре, а вирішують конкретні задачі: заявки, продажі, масштабування і зручне керування контентом.",
        "Окремий скіл — пояснювати складні технічні речі простою мовою.",
      ],
      tags: ["Next.js", "Sanity", "Architecture", "Tech Lead"],
    },
    {
      id: "diana",
      name: "Діана Меркатун",
      role: "Lead Designer",
      image: "/team/diana.jpg",
      shortDescription:
        "«Дизайн має продавати, а не отримувати лайки на Behance. Тому я думаю про конверсію раніше, ніж про сітку і кольори.»",
      fullDescription: [
        "Діана відповідає за візуальну частину продуктів і користувацький досвід.",
        "Її підхід — не просто зробити красиво, а побудувати дизайн, який допомагає користувачу прийняти рішення: залишити заявку, купити або перейти до наступного кроку.",
        "Вона працює на перетині естетики, структури і бізнес-логіки.",
        "Результат — сайти, які виглядають як продуманий продукт, а не набір випадкових блоків.",
      ],
      tags: ["UI/UX", "Visual Design", "Conversion", "Product Design"],
    },
    {
      id: "olga",
      name: "Ольга Михалкова",
      role: "Senior Frontend",
      image: "/team/olga.jpg",
      shortDescription:
        "«Сайт, що вантажиться 5 секунд, втрачає половину клієнтів. Тому я доводжу швидкість до 90+ балів Lighthouse, поки інші ще пишуть TZ.»",
      fullDescription: [
        "Ольга — senior frontend developer, яка уважно ставиться до деталей і якості реалізації.",
        "Вона не залишає дрібниць у стилі «потім доробимо», бо саме з дрібниць складається відчуття дорогого і стабільного продукту.",
        "Її зона відповідальності — чистий інтерфейс, коректна адаптивність, стабільна логіка і акуратна взаємодія користувача з сайтом.",
        "До кожного проєкту ставиться так, ніби це її власний продукт.",
      ],
      tags: ["Frontend", "React", "UI Logic", "Quality"],
    },
    {
      id: "kristina",
      name: "Кристина Бондаренко",
      role: "SEO & Marketing Strategy",
      image: "/team/kristina.jpg",
      shortDescription:
        "«Сайт без трафіку — як магазин у глухому провулку. Я роблю так, щоб клієнти знаходили вас у Google за 3 місяці після релізу.»",
      fullDescription: [
        "Кристина — SEO-спеціаліст і маркетолог з фокусом на B2B та складні ніші.",
        "Її робота — не просто «просунути сайт», а побудувати систему, яка приводить релевантних клієнтів.",
        "Вона створює SEO і контент-стратегії з урахуванням бізнес-цілей, конкурентного середовища і поведінки цільової аудиторії.",
        "Основний фокус — європейські ринки, де важлива не тільки видимість у пошуку, а й правильне позиціонування продукту.",
      ],
      tags: ["SEO", "B2B", "Content Strategy", "Europe"],
    },
  ],
  en: [
    {
      id: "fedir",
      name: "Fedir Alpatov",
      role: "Tech Lead · Founder",
      image: "/team/fedir.jpg",
      shortDescription:
        "\"Every site is a sales tool. Everything technical should serve that, not the other way around.\"",
      fullDescription: [
        "Fedir is the tech lead and founder of the studio. He's been working with custom-coded sites for 6+ years and specializes in projects where standard solutions don't work.",
        "His strength is taking complex or fuzzy requirements and turning them into a clear technical implementation.",
        "He understands business, marketing, and engineering equally well, so projects don't just look good — they solve concrete tasks: leads, sales, scaling, and easy content management.",
        "A separate skill: explaining complex technical things in plain language.",
      ],
      tags: ["Next.js", "Sanity", "Architecture", "Tech Lead"],
    },
    {
      id: "diana",
      name: "Diana Merkatun",
      role: "Lead Designer",
      image: "/team/diana.jpg",
      shortDescription:
        "\"Design should sell, not get likes on Behance. So I think about conversion before grid and colors.\"",
      fullDescription: [
        "Diana owns the visual side of our products and the user experience.",
        "Her approach isn't just to make it pretty — it's to build design that helps the user make a decision: submit a form, buy, or move to the next step.",
        "She works at the intersection of aesthetics, structure, and business logic.",
        "The result: sites that look like a considered product, not a stack of random blocks.",
      ],
      tags: ["UI/UX", "Visual Design", "Conversion", "Product Design"],
    },
    {
      id: "olga",
      name: "Olga Mykhalkova",
      role: "Senior Frontend",
      image: "/team/olga.jpg",
      shortDescription:
        "\"A site that loads in 5 seconds loses half its visitors. So I push speed to 90+ on Lighthouse while others are still writing specs.\"",
      fullDescription: [
        "Olga is a senior frontend developer who's careful with details and implementation quality.",
        "She doesn't leave small things \"for later,\" because details are what create the feel of an expensive, stable product.",
        "Her zone: clean UI, correct responsiveness, stable logic, and careful user interaction.",
        "She treats every project as if it were her own product.",
      ],
      tags: ["Frontend", "React", "UI Logic", "Quality"],
    },
    {
      id: "kristina",
      name: "Kristina Bondarenko",
      role: "SEO & Marketing Strategy",
      image: "/team/kristina.jpg",
      shortDescription:
        "\"A site without traffic is a shop in a back alley. I make sure clients find you on Google within 3 months of launch.\"",
      fullDescription: [
        "Kristina is an SEO specialist and marketer focused on B2B and complex niches.",
        "Her work isn't just \"promote the site\" — it's to build a system that brings in relevant clients.",
        "She creates SEO and content strategies grounded in business goals, competitive landscape, and audience behaviour.",
        "Primary focus: European markets, where positioning matters as much as raw visibility.",
      ],
      tags: ["SEO", "B2B", "Content Strategy", "Europe"],
    },
  ],
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberPhoto({
  member,
  variant,
}: {
  member: TeamMember;
  variant: "card" | "modal";
}) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !member.image || hasError;

  if (variant === "card") {
    return (
      <div className="aspect-square overflow-hidden relative bg-[linear-gradient(135deg,oklch(0.30_0.10_290)_0%,oklch(0.20_0.06_270)_100%)] flex items-center justify-center">
        {showFallback ? (
          <span className="inline-flex items-center justify-center w-[110px] h-[110px] rounded-full bg-brand-gradient font-display font-bold text-[36px] text-bg tracking-[-0.02em] shadow-[0_0_60px_oklch(from_var(--color-accent)_l_c_h_/_0.35)]">
            {getInitials(member.name)}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-top block"
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-full overflow-hidden relative bg-[linear-gradient(135deg,oklch(0.30_0.10_290)_0%,oklch(0.20_0.06_270)_100%)] flex items-center justify-center shrink-0 border border-line">
      {showFallback ? (
        <span className="font-display font-bold text-[18px] text-bg">
          {getInitials(member.name)}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={member.image}
          alt={member.name}
          decoding="async"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover object-top block"
        />
      )}
    </div>
  );
}

function MemberCard({
  member,
  onOpen,
  moreLabel,
}: {
  member: TeamMember;
  onOpen: () => void;
  moreLabel: string;
}) {
  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-[oklch(1_0_0_/_0.02)] overflow-hidden transition-[border-color,transform] duration-[250ms] ease-out-soft hover:border-accent-40 hover:-translate-y-0.5">
      <MemberPhoto member={member} variant="card" />
      <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[18px] tracking-[-0.01em] text-ink">
          {member.name}
        </h3>
        <div className="mt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-accent-soft">
          {member.role}
        </div>
        <p className="mt-3 font-sans text-[13px] leading-[1.55] text-ink-dim flex-1">
          {member.shortDescription}
        </p>
        <Button
          onPress={onOpen}
          variant="bordered"
          radius="full"
          size="sm"
          className="mt-5 self-start min-h-11 font-mono tracking-[0.06em] text-[11px] border-line hover:border-accent-50 text-ink-dim hover:text-ink"
        >
          {moreLabel}
        </Button>
      </div>
    </article>
  );
}

function TeamModal({
  member,
  isOpen,
  onOpenChange,
  closeLabel,
}: {
  member: TeamMember | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  closeLabel: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "bg-bg-raised border border-line",
        header: "border-b border-line",
        footer: "border-t border-line",
        closeButton: "text-ink-3 hover:text-ink",
      }}
    >
      <ModalContent>
        {(onClose) =>
          member ? (
            <>
              <ModalHeader className="flex gap-4 items-center pr-10">
                <MemberPhoto member={member} variant="modal" />
                <div className="flex flex-col">
                  <span className="font-display font-semibold text-[20px] tracking-[-0.01em] text-ink leading-tight">
                    {member.name}
                  </span>
                  <span className="mt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-accent-soft">
                    {member.role}
                  </span>
                </div>
              </ModalHeader>
              <ModalBody className="py-5">
                <div className="flex flex-col gap-3 font-sans text-[14px] leading-[1.6] text-ink-dim">
                  {member.fullDescription.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {member.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] font-mono text-[10.5px] tracking-[0.06em] uppercase text-ink-dim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={onClose}
                  variant="flat"
                  radius="full"
                  className="min-h-11 font-mono tracking-[0.06em] text-[11px] bg-[oklch(1_0_0_/_0.04)] hover:bg-[oklch(1_0_0_/_0.08)] text-ink"
                >
                  {closeLabel}
                </Button>
              </ModalFooter>
            </>
          ) : null
        }
      </ModalContent>
    </Modal>
  );
}

const TEAM_LABELS: Record<TeamLocale, { more: string; close: string }> = {
  uk: { more: "Детальніше", close: "Закрити" },
  en: { more: "Read more", close: "Close" },
};

export function TeamSection({
  eyebrow,
  heading,
  sub,
  locale = "uk",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  locale?: TeamLocale;
} = {}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [active, setActive] = useState<TeamMember | null>(null);
  const members = TEAM_BY_LOCALE[locale];
  const labels = TEAM_LABELS[locale];

  const handleOpen = (member: TeamMember) => {
    setActive(member);
    onOpen();
  };

  return (
    <section className="relative py-14 lg:py-[100px] px-6 bg-bg lg:px-12">
      <div className="max-w-container mx-auto">
        {(eyebrow || heading || sub) && (
          <header className="flex flex-col mb-10 lg:mb-16">
            {eyebrow ? (
              <span className="inline-flex items-center self-start gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
                {eyebrow}
              </span>
            ) : null}
            {heading ? (
              <h2 className="mt-6 font-display font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[760px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                {heading}
              </h2>
            ) : null}
            {sub ? (
              <p className="mt-4 font-sans text-[16px] leading-[1.55] text-ink-dim max-w-[640px]">
                {sub}
              </p>
            ) : null}
          </header>
        )}

        <div className="grid grid-cols-2 gap-5 max-[600px]:grid-cols-1 xl:grid-cols-4">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              member={m}
              onOpen={() => handleOpen(m)}
              moreLabel={labels.more}
            />
          ))}
        </div>
      </div>

      <TeamModal
        member={active}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        closeLabel={labels.close}
      />
    </section>
  );
}

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
 * Фото покласти в `public/team/` під відповідним іменем (webp).
 * Якщо файлу немає — карточка graceful fallback показує ініціали.
 */
const TEAM_MEMBERS: TeamMember[] = [
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
];

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
          <span className="inline-flex items-center justify-center w-[110px] h-[110px] rounded-full bg-brand-gradient font-display font-bold text-[36px] text-bg tracking-[-0.02em] shadow-[0_0_60px_oklch(from_var(--accent)_l_c_h_/_0.35)]">
            {getInitials(member.name)}
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image}
            alt={member.name}
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
}: {
  member: TeamMember;
  onOpen: () => void;
}) {
  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-[oklch(1_0_0_/_0.02)] overflow-hidden transition-[border-color,transform] duration-[250ms] ease-out-soft hover:border-[oklch(from_var(--accent)_l_c_h_/_0.4)] hover:-translate-y-0.5">
      <MemberPhoto member={member} variant="card" />
      <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-[18px] tracking-[-0.01em] text-ink">
          {member.name}
        </h3>
        <div className="mt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-accent-soft">
          {member.role}
        </div>
        <p className="mt-3 font-sans text-[13px] leading-[1.55] text-[var(--ink-2)] flex-1">
          {member.shortDescription}
        </p>
        <Button
          onPress={onOpen}
          variant="bordered"
          radius="full"
          size="sm"
          className="mt-5 self-start font-mono tracking-[0.06em] text-[11px] border-line hover:border-[oklch(from_var(--accent)_l_c_h_/_0.5)] text-[var(--ink-2)] hover:text-ink"
        >
          Детальніше
        </Button>
      </div>
    </article>
  );
}

function TeamModal({
  member,
  isOpen,
  onOpenChange,
}: {
  member: TeamMember | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
      scrollBehavior="inside"
      classNames={{
        base: "bg-[var(--bg-raised)] border border-line",
        header: "border-b border-line",
        footer: "border-t border-line",
        closeButton: "text-[var(--ink-3)] hover:text-ink",
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
                <div className="flex flex-col gap-3 font-sans text-[14px] leading-[1.6] text-[var(--ink-2)]">
                  {member.fullDescription.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {member.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] font-mono text-[10.5px] tracking-[0.06em] uppercase text-[var(--ink-2)]"
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
                  className="font-mono tracking-[0.06em] text-[11px] bg-[oklch(1_0_0_/_0.04)] hover:bg-[oklch(1_0_0_/_0.08)] text-ink"
                >
                  Закрити
                </Button>
              </ModalFooter>
            </>
          ) : null
        }
      </ModalContent>
    </Modal>
  );
}

export function TeamSection({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
} = {}) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [active, setActive] = useState<TeamMember | null>(null);

  const handleOpen = (member: TeamMember) => {
    setActive(member);
    onOpen();
  };

  return (
    <section className="relative py-[100px] px-12 bg-bg max-[800px]:py-[60px] max-[800px]:px-6">
      <div className="max-w-container mx-auto">
        {(eyebrow || heading || sub) && (
          <header className="flex flex-col mb-16 max-[800px]:mb-10">
            {eyebrow ? (
              <span className="inline-flex items-center self-start gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)]">
                {eyebrow}
              </span>
            ) : null}
            {heading ? (
              <h2 className="mt-6 font-display font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[760px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                {heading}
              </h2>
            ) : null}
            {sub ? (
              <p className="mt-4 font-sans text-[16px] leading-[1.55] text-[var(--ink-2)] max-w-[640px]">
                {sub}
              </p>
            ) : null}
          </header>
        )}

        <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
          {TEAM_MEMBERS.map((m) => (
            <MemberCard key={m.id} member={m} onOpen={() => handleOpen(m)} />
          ))}
        </div>
      </div>

      <TeamModal
        member={active}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </section>
  );
}

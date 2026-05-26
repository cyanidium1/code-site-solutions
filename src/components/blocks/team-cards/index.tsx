import { cn } from "@/components/ui";

export type TeamSocialKind = "li" | "tg" | "gh" | "ig" | "tt" | "x";
export type TeamSocial = { kind: TeamSocialKind; href: string };

export type TeamMember = {
  name: string;
  role: string;
  initials?: string;
  photo?: string;
  experience?: string;
  location?: string;
  spec?: string;
  tag?: string;
  quote?: string;
  socials?: TeamSocial[];
};

export type TeamGroup = {
  label?: string;
  members: TeamMember[];
};

const SOCIAL_PATHS: Record<TeamSocialKind, React.ReactNode> = {
  li: (
    <path
      d="M4 4h4v4H4zM4 10h4v10H4zM10 10h4v2c.6-1.2 2-2 4-2 3 0 4 2 4 5v5h-4v-4c0-1.5-.5-2.5-2-2.5s-2 1-2 2.5V20h-4z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  tg: (
    <path
      d="M21 4L3 11l5 2 2 6 3-3 5 4 3-16z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  gh: (
    <path
      d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.92-.62.07-.61.07-.61 1.01.07 1.55 1.04 1.55 1.04.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.36-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.5 9.5 0 0112 6.8c.85 0 1.71.11 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  ig: (
    <>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" />
    </>
  ),
  tt: (
    <path
      d="M14 4v10.5a2.5 2.5 0 11-2.5-2.5M14 4c.5 2 2 3.5 4.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  x: (
    <path
      d="M5 5l14 14M19 5L5 19"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  ),
};

const SOCIAL_LABELS: Record<TeamSocialKind, string> = {
  li: "LinkedIn",
  tg: "Telegram",
  gh: "GitHub",
  ig: "Instagram",
  tt: "TikTok",
  x: "X",
};

function SocialIcon({ kind }: { kind: TeamSocialKind }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      {SOCIAL_PATHS[kind]}
    </svg>
  );
}

function TeamCard({ m }: { m: TeamMember }) {
  return (
    <article className="relative flex flex-col basis-[65vw] grow-0 shrink-0 max-w-[280px] snap-start border border-line rounded-[22px] bg-[oklch(1_0_0_/_0.02)] overflow-hidden transition-[border-color,transform] duration-[250ms] ease-out-soft hover:border-line-strong hover:-translate-y-0.5 lg:basis-auto lg:grow lg:shrink lg:max-w-none lg:snap-none">
      <div className="aspect-square overflow-hidden relative bg-[linear-gradient(135deg,oklch(0.30_0.10_290)_0%,oklch(0.20_0.06_270)_100%)] flex items-center justify-center [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:block">
        {m.photo ? (
          <img src={m.photo} alt={m.name} />
        ) : (
          <span className="inline-flex items-center justify-center w-[90px] h-[90px] rounded-full bg-brand-gradient font-display font-bold text-[30px] text-bg tracking-[-0.02em] shadow-[0_0_60px_oklch(from_var(--color-accent)_l_c_h_/_0.35)] lg:w-[110px] lg:h-[110px] lg:text-[38px]">
            {m.initials ??
              m.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
          </span>
        )}
        {m.tag ? (
          <span className="absolute bottom-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-[5px] rounded-full border border-[oklch(1_0_0_/_0.14)] bg-[oklch(0_0_0_/_0.4)] backdrop-blur-[8px] font-mono text-[10px] tracking-[0.12em] uppercase text-ink before:content-[''] before:w-[5px] before:h-[5px] before:rounded-full before:bg-[oklch(0.7_0.16_145)] before:shadow-[0_0_6px_oklch(0.7_0.16_145_/_0.6)]">
            {m.tag}
          </span>
        ) : null}
      </div>
      <div className="pt-[18px] px-[18px] pb-5 flex flex-col flex-1 lg:pt-[22px] lg:px-6 lg:pb-6">
        <h3 className="font-display font-semibold text-[17px] tracking-[-0.01em] text-ink lg:text-[19px]">
          {m.name}
        </h3>
        <div className="mt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-accent-soft">
          {m.role}
        </div>
        {(m.experience || m.location) && (
          <div className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-[11px] text-ink-3">
            {m.experience ? <span>{m.experience}</span> : null}
            {m.experience && m.location ? (
              <span className="text-line-strong">·</span>
            ) : null}
            {m.location ? <span>{m.location}</span> : null}
          </div>
        )}
        {m.spec ? (
          <p className="mt-3.5 font-sans text-[12.5px] leading-[1.55] text-ink-dim lg:text-[13px]">
            {m.spec}
          </p>
        ) : null}
        {m.quote ? (
          <blockquote className="mt-4.5 pt-4 border-t border-line grid grid-cols-[auto_1fr] gap-x-2.5 items-start">
            <span className="font-display text-[36px] leading-[0.7] text-accent-soft mt-1 select-none">
              “
            </span>
            <span className="font-sans italic text-[12.5px] leading-[1.55] text-ink-dim lg:text-[13.5px]">
              {m.quote}
            </span>
          </blockquote>
        ) : m.socials && m.socials.length > 0 ? (
          <div className="flex gap-3 mt-4.5 pt-4 border-t border-line [&_a]:text-ink-3 [&_a]:inline-flex [&_a]:items-center [&_a]:justify-center [&_a]:w-7 [&_a]:h-7 [&_a]:rounded-lg [&_a]:transition-[color,background] [&_a]:duration-200 [&_a:hover]:text-ink [&_a:hover]:bg-[oklch(1_0_0_/_0.04)]">
            {m.socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={SOCIAL_LABELS[s.kind]}
              >
                <SocialIcon kind={s.kind} />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function TeamCards({
  eyebrow,
  heading,
  sub,
  members,
  groups,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  members?: TeamMember[];
  groups?: TeamGroup[];
}) {
  const groupList: TeamGroup[] = groups ?? (members ? [{ members }] : []);

  return (
    <section className="relative py-14 lg:py-[100px] px-0 bg-bg lg:px-12">
      <div className="max-w-container mx-auto px-6 lg:px-0">
        {(eyebrow || heading || sub) && (
          <header className="flex flex-col mb-16">
            {eyebrow ? (
              <span className="inline-flex items-center self-start gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)]">
                {eyebrow}
              </span>
            ) : null}
            {heading ? (
              <h2 className="mt-6 font-display font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink max-w-[760px] [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent">
                {heading}
              </h2>
            ) : null}
            {sub ? (
              <p className="mt-4.5 font-sans text-[16px] leading-[1.55] text-ink-dim max-w-[640px]">
                {sub}
              </p>
            ) : null}
          </header>
        )}

        {groupList.map((g, gi) => (
          <div className={cn(gi > 0 && "mt-14")} key={gi}>
            {g.label ? (
              <div className="mb-6 font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-line">
                <span>{g.label}</span>
              </div>
            ) : null}
            <div className="flex overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-pl-6 gap-3.5 pt-1 px-6 pb-3 -mx-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:snap-none lg:scroll-pl-0 lg:pt-0 lg:px-0 lg:pb-0 lg:mx-0 xl:grid-cols-3">
              {g.members.map((m, i) => (
                <TeamCard key={i} m={m} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

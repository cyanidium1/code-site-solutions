import "./team-cards.css";

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
    <article className="team-card">
      <div className="team-card-photo">
        {m.photo ? (
          <img src={m.photo} alt={m.name} />
        ) : (
          <span className="team-card-photo-initials">
            {m.initials ??
              m.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
          </span>
        )}
        {m.tag ? <span className="team-card-photo-tag">{m.tag}</span> : null}
      </div>
      <div className="team-card-body">
        <h3 className="team-card-name">{m.name}</h3>
        <div className="team-card-role">{m.role}</div>
        {(m.experience || m.location) && (
          <div className="team-card-meta">
            {m.experience ? <span>{m.experience}</span> : null}
            {m.experience && m.location ? (
              <span className="team-card-meta-sep">·</span>
            ) : null}
            {m.location ? <span>{m.location}</span> : null}
          </div>
        )}
        {m.spec ? <p className="team-card-spec">{m.spec}</p> : null}
        {m.quote ? (
          <blockquote className="team-card-quote">
            <span className="team-card-quote-mark">“</span>
            <span className="team-card-quote-text">{m.quote}</span>
          </blockquote>
        ) : m.socials && m.socials.length > 0 ? (
          <div className="team-card-socials">
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
    <section className="team-cards">
      <div className="team-cards-container">
        {(eyebrow || heading || sub) && (
          <header className="team-cards-head">
            {eyebrow ? (
              <span className="team-cards-eyebrow">{eyebrow}</span>
            ) : null}
            {heading ? <h2 className="team-cards-h2">{heading}</h2> : null}
            {sub ? <p className="team-cards-sub">{sub}</p> : null}
          </header>
        )}

        {groupList.map((g, gi) => (
          <div className="team-cards-group" key={gi}>
            {g.label ? (
              <div className="team-cards-group-h">
                <span>{g.label}</span>
              </div>
            ) : null}
            <div className="team-cards-list">
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

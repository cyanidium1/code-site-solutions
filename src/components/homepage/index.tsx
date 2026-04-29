import Link from "next/link";
import {
  Stethoscope,
  Scale,
  Calculator,
  ShoppingCart,
  Rocket,
  Building,
  Sparkles,
  GraduationCap,
  Gauge,
  Github,
  DollarSign,
  Shield,
  ArrowRightLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MessageCircle,
  Mail,
  Linkedin,
  Send,
  Instagram,
  Music2,
  type LucideIcon,
} from "lucide-react";
import "./homepage.css";

export { HpHeader } from "./hp-header";

/* ═══ Section header (eyebrow + h2 + sub) ═════════════════════════════════ */

function SectionHead({
  eyebrow,
  heading,
  sub,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="hp-section-head">
      <div className="hp-eyebrow">
        <span className="hp-eyebrow-dot" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="hp-h2">{heading}</h2>
      {sub ? <p className="hp-sub">{sub}</p> : null}
    </div>
  );
}

/* ═══ Marquee ══════════════════════════════════════════════════════════════ */

const DEFAULT_MARQUEE = [
  "Efedra Clinic",
  "NBYG Bornholm",
  "Tatarka",
  "Webbond",
  "so2-lab",
  "aleko-course",
  "solide-renovation",
  "ScanMe",
];

export function Marquee({
  label = "TRUSTED BY 47+ BUSINESSES IN UA · EU · US",
  items = DEFAULT_MARQUEE,
}: {
  label?: string;
  items?: string[];
}) {
  const repeated = [...items, ...items];
  return (
    <section className="hp-marquee">
      <div className="hp-marquee-label">/ {label}</div>
      <div className="hp-marquee-fade">
        <div className="hp-marquee-track">
          {repeated.map((it, i) => (
            <span key={i} style={{ display: "contents" }}>
              <span className="hp-marquee-item">{it}</span>
              <span className="hp-marquee-sep">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ Industries (8 cards) ════════════════════════════════════════════════ */

export type Industry = {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
  tags: string[];
  price: string;
  href: string;
};

const DEFAULT_INDUSTRIES: Industry[] = [
  {
    icon: Stethoscope,
    color: "#0EA5E9",
    title: "Healthcare / Medicine",
    description: "Сайти для клінік, стоматологій, діагностичних центрів",
    tags: ["Helsi", "Medesk", "Online booking"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/medicine",
  },
  {
    icon: Scale,
    color: "#8B5CF6",
    title: "Legal & Attorneys",
    description: "Сайти для юр. фірм, адвокатських бюро, приватних юристів",
    tags: ["Clio", "Diia.Sign", "Online consult"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/legal",
  },
  {
    icon: Calculator,
    color: "#10B981",
    title: "Accounting & Bookkeeping",
    description: "Сайти для бух-аутсорсингу, аудиторів, податкових консультантів",
    tags: ["MEDoc", "iFin", "1С/BAS"],
    price: "Від $3 500 · 4-10 тижнів",
    href: "/sites-for/accounting",
  },
  {
    icon: ShoppingCart,
    color: "#F59E0B",
    title: "E-commerce",
    description: "Інтернет-магазини, маркетплейси, B2B-каталоги",
    tags: ["Stripe", "LiqPay", "Нова Пошта"],
    price: "Від $5 000 · 6-10 тижнів",
    href: "/sites-for/ecommerce",
  },
  {
    icon: Rocket,
    color: "#0070F3",
    title: "SaaS & Startups",
    description: "Лендінги для SaaS-продуктів і стартапів",
    tags: ["Stripe", "Posthog", "HubSpot"],
    price: "Від $4 000 · 3-6 тижнів",
    href: "/sites-for/saas",
  },
  {
    icon: Building,
    color: "#EF4444",
    title: "Real Estate / Construction",
    description: "Сайти для забудовників, агенцій нерухомості, ремонтних компаній",
    tags: ["CRM", "Listings", "Calculator"],
    price: "Від $3 000 · 4-8 тижнів",
    href: "/sites-for/real-estate",
  },
  {
    icon: Sparkles,
    color: "#EC4899",
    title: "Cosmetology",
    description: "Сайти для beauty-студій і клінік естетичної медицини",
    tags: ["YClients", "Booksy", "Booking"],
    price: "Від $3 000 · 4-8 тижнів",
    href: "/sites-for/cosmetology",
  },
  {
    icon: GraduationCap,
    color: "#14B8A6",
    title: "Education / Online courses",
    description: "Сайти для онлайн-курсів, шкіл, репетиторів",
    tags: ["Stripe", "Teachable", "Zoom"],
    price: "Від $3 000 · 3-6 тижнів",
    href: "/sites-for/education",
  },
];

export function Industries({
  eyebrow = "/ 02 SOLUTIONS",
  heading = (
    <>
      Спеціалізовані рішення під <em>вашу галузь</em>
    </>
  ),
  sub = "Не просто сайт — комплексне рішення з інтеграціями і compliance.",
  items = DEFAULT_INDUSTRIES,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: Industry[];
} = {}) {
  return (
    <section className="hp-section" id="solutions">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-industries-grid">
          {items.map((ind) => {
            const Icon = ind.icon;
            return (
              <Link
                key={ind.href}
                href={ind.href}
                className="hp-industry-card"
                style={{ ["--accent-color" as string]: ind.color }}
              >
                <div className="hp-industry-icon">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="hp-industry-title">{ind.title}</h3>
                <p className="hp-industry-desc">{ind.description}</p>
                <div className="hp-industry-tags">
                  {ind.tags.map((t) => (
                    <span key={t} className="hp-industry-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="hp-industry-foot">
                  <span className="hp-industry-price">{ind.price}</span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.8}
                    className="hp-industry-arrow"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ Bento (Why us) ══════════════════════════════════════════════════════ */

function LighthouseVisual() {
  return (
    <div className="hp-lh">
      <div className="hp-lh-arc">
        <svg viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="url(#hp-lh-grad)"
            strokeWidth="2.5"
            strokeDasharray="98 100"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hp-lh-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.7 0.16 145)" />
              <stop offset="100%" stopColor="oklch(0.55 0.18 295)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="hp-lh-num">
          <strong>98</strong>
          <small>score</small>
        </div>
      </div>
      <div className="hp-lh-bars">
        <div className="hp-lh-bar-row">
          <span>WordPress</span>
          <span style={{ color: "oklch(0.7 0.18 25)" }}>LCP 4.2s</span>
        </div>
        <div className="hp-lh-bar">
          <div className="hp-lh-bar-fill bad" />
        </div>
        <div className="hp-lh-bar-row">
          <span>Code-Site.Art</span>
          <span style={{ color: "oklch(0.78 0.16 145)" }}>LCP 0.6s</span>
        </div>
        <div className="hp-lh-bar">
          <div className="hp-lh-bar-fill good" />
        </div>
      </div>
    </div>
  );
}

function MigrationVisual() {
  return (
    <div className="hp-mig">
      <div className="hp-mig-pill bad">
        WordPress <strong>LCP 4.2s</strong>
      </div>
      <span className="hp-mig-arrow">→</span>
      <div className="hp-mig-pill good">
        Next.js <strong>LCP 0.8s</strong>
      </div>
      <span className="hp-mig-stat">47 migrations · 0 SEO drops</span>
    </div>
  );
}

export type BentoCell = {
  title: string;
  icon: LucideIcon;
  stat?: string;
  body: React.ReactNode;
  span: "1x1" | "2x2" | "3x1";
  visual?: "lh" | "mig";
};

const DEFAULT_BENTO: BentoCell[] = [
  {
    title: "Завантаження < 1 секунди",
    icon: Gauge,
    stat: "98 LIGHTHOUSE",
    body: "Custom code, нуль плагінів. Перевірено на реальних 3G/4G в Україні.",
    span: "2x2",
    visual: "lh",
  },
  {
    title: "Код у вашому GitHub",
    icon: Github,
    stat: "100%",
    body: "Не у нас. З першого коміту.",
    span: "1x1",
  },
  {
    title: "Запуск за 4 тижні",
    icon: Rocket,
    stat: "4 wk",
    body: "Industry-сайт під ключ.",
    span: "1x1",
  },
  {
    title: "Прозорий прайс",
    icon: DollarSign,
    stat: "$3.5k+",
    body: "Не «під запит». Цифра в брифі.",
    span: "1x1",
  },
  {
    title: "Гарантія + неустойка",
    icon: Shield,
    stat: "1y",
    body: "1 рік. За зрив — повертаємо 30%.",
    span: "1x1",
  },
  {
    title: "Перенесення без втрати SEO",
    icon: ArrowRightLeft,
    body: "301-redirects, перенос контенту, schema.org. Зазвичай 2 тижні без падіння.",
    span: "3x1",
    visual: "mig",
  },
];

export function Bento({
  eyebrow = "/ 03 WHY US",
  heading = (
    <>
      Сайт як <em>інструмент</em> бізнесу, не вітрина
    </>
  ),
  cells = DEFAULT_BENTO,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  cells?: BentoCell[];
} = {}) {
  return (
    <section className="hp-section" id="why-us">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="hp-bento-grid">
          {cells.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`hp-bento-cell hp-bento-cell--${c.span}`}>
                <div className="hp-bento-head">
                  <div className="hp-bento-icon">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  {c.stat ? <span className="hp-bento-stat">{c.stat}</span> : null}
                </div>
                <h3 className="hp-bento-title">{c.title}</h3>
                <div className="hp-bento-body">{typeof c.body === "string" ? <p>{c.body}</p> : c.body}</div>
                {c.visual === "lh" ? <LighthouseVisual /> : null}
                {c.visual === "mig" ? <MigrationVisual /> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ Process timeline ════════════════════════════════════════════════════ */

type ProcessStep = {
  n: string;
  name: string;
  duration: string;
  body: string;
};

const DEFAULT_PROCESS: ProcessStep[] = [
  { n: "01", name: "Brief", duration: "1 day · free", body: "Цілі, аудиторія, scope" },
  { n: "02", name: "Design", duration: "1-2 weeks", body: "Wireframes → hi-fi" },
  { n: "03", name: "Development", duration: "2-6 weeks", body: "Custom code, weekly demos" },
  { n: "04", name: "Testing", duration: "1 week", body: "60-point QA checklist" },
  { n: "05", name: "Launch + Support", duration: "+ 1 year", body: "Підтримка включена" },
];

export function Process({
  eyebrow = "/ 04 PROCESS · 4-10 WEEKS END-TO-END",
  heading = (
    <>
      Запуск за 5 кроків. <em>Без сюрпризів.</em>
    </>
  ),
  steps = DEFAULT_PROCESS,
  ctaLabel = "Дивитись детальний процес",
  ctaHref = "/process",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  steps?: ProcessStep[];
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  return (
    <section className="hp-section" id="process">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <ol className="hp-process-list">
          {steps.map((s) => (
            <li className="hp-process-step" key={s.n}>
              <div className="hp-process-num">{s.n}</div>
              <div className="hp-process-name">{s.name}</div>
              <div className="hp-process-duration">{s.duration}</div>
              <div className="hp-process-body">{s.body}</div>
            </li>
          ))}
        </ol>
        <Link href={ctaHref} className="hp-link">
          {ctaLabel}
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}

/* ═══ Cases preview (3 cards) ═════════════════════════════════════════════ */

type CaseItem = {
  name: string;
  industry: string;
  region: string;
  year: string;
  chips: string[];
  metrics: string;
  gradient: string;
  href: string;
};

const DEFAULT_CASES: CaseItem[] = [
  {
    name: "Efedra Clinic",
    industry: "Healthcare",
    region: "Odesa",
    year: "2024",
    chips: ["Healthcare", "Next.js"],
    metrics: "×3.2 inquiries · LCP 0.8s · Top-3 Google",
    gradient: "linear-gradient(135deg, oklch(0.55 0.18 230) 0%, oklch(0.45 0.18 250) 100%)",
    href: "/portfolio/efedra-clinic",
  },
  {
    name: "NBYG Bornholm",
    industry: "Construction",
    region: "Denmark",
    year: "2024",
    chips: ["Real Estate", "Next.js"],
    metrics: "×6 traffic · 24 inquiries/mo · Top-1 local",
    gradient: "linear-gradient(135deg, oklch(0.55 0.20 25) 0%, oklch(0.55 0.18 50) 100%)",
    href: "/portfolio/nbyg-bornholm",
  },
  {
    name: "Tatarka",
    industry: "Real Estate Investment",
    region: "Kyiv",
    year: "2025",
    chips: ["Real Estate", "Next.js"],
    metrics: "$4M raised · Investor portal · Multi-lang",
    gradient: "linear-gradient(135deg, oklch(0.6 0.16 70) 0%, oklch(0.45 0.20 295) 100%)",
    href: "/portfolio/tatarka",
  },
];

export function Cases({
  eyebrow = "/ 05 CASES",
  heading = (
    <>
      Реальні кейси з <em>реальними</em> метриками
    </>
  ),
  items = DEFAULT_CASES,
  ctaLabel = "Всі кейси",
  ctaHref = "/portfolio",
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  items?: CaseItem[];
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  return (
    <section className="hp-section" id="cases">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} />
        <div className="hp-cases-grid">
          {items.map((c) => (
            <Link key={c.href} href={c.href} className="hp-case-link">
              <div className="hp-case-cover">
                <div
                  className="hp-case-cover-bg"
                  style={{ background: c.gradient }}
                />
                <div className="hp-case-cover-dots" />
                <div className="hp-case-shot">
                  <div className="hp-case-shot-bar">
                    <span className="hp-case-shot-dot" />
                    <span className="hp-case-shot-dot" />
                    <span className="hp-case-shot-dot" />
                  </div>
                  <div className="hp-case-shot-body">
                    <div className="hp-case-shot-line s1" />
                    <div className="hp-case-shot-line s2" />
                    <div className="hp-case-shot-line s3" />
                  </div>
                </div>
              </div>
              <div className="hp-case-body">
                <div className="hp-case-chips">
                  {c.chips.map((ch) => (
                    <span key={ch} className="hp-case-chip">
                      {ch}
                    </span>
                  ))}
                </div>
                <div className="hp-case-name-row">
                  <h3 className="hp-case-name">{c.name}</h3>
                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.6}
                    className="hp-case-arrow"
                  />
                </div>
                <div className="hp-case-meta">
                  {c.industry} · {c.region} · {c.year}
                </div>
                <div className="hp-case-metrics">{c.metrics}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href={ctaHref} className="hp-link">
          {ctaLabel}
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}

/* ═══ Tech stack (10 tiles) ═══════════════════════════════════════════════ */

type StackItem = { name: string; cat: string };

const DEFAULT_STACK: StackItem[] = [
  { name: "Next.js", cat: "Framework" },
  { name: "Astro", cat: "Static sites" },
  { name: "React", cat: "UI library" },
  { name: "TypeScript", cat: "Language" },
  { name: "Tailwind", cat: "Styling" },
  { name: "HeroUI", cat: "Components" },
  { name: "Sanity", cat: "CMS" },
  { name: "Strapi", cat: "Headless CMS" },
  { name: "Vercel", cat: "Hosting" },
  { name: "Cloudflare", cat: "CDN + DNS" },
];

export function Stack({
  eyebrow = "/ 07 STACK",
  heading = (
    <>
      Технології, які <em>ми вибрали</em>
    </>
  ),
  sub = "Не пробуємо все підряд. Працюємо з 10 інструментами, які знаємо до глибини.",
  items = DEFAULT_STACK,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  items?: StackItem[];
} = {}) {
  return (
    <section className="hp-section" id="stack">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-stack">
          <div className="hp-stack-grid">
            {items.map((it) => (
              <div className="hp-stack-tile" key={it.name}>
                <div className="hp-stack-name">{it.name}</div>
                <div className="hp-stack-cat">{it.cat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Pull-quote testimonial ═════════════════════════════════════════════ */

export function PullQuote({
  quote = (
    <>
      Перед запуском нового сайту у нас було 3 заявки на місяць. Зараз —{" "}
      <em>24</em>.
    </>
  ),
  initials = "SH",
  name = "Søren Hansen",
  role = "Owner, NBYG Bornholm Aps",
  liHref = "#",
}: Partial<{
  quote: React.ReactNode;
  initials: string;
  name: string;
  role: string;
  liHref: string;
}> = {}) {
  return (
    <section className="hp-section">
      <div className="hp-pull">
        <div className="hp-pull-bg" />
        <div className="hp-pull-inner">
          <p className="hp-pull-quote">«{quote}»</p>
          <div className="hp-pull-author">
            <div className="hp-pull-avatar">{initials}</div>
            <div>
              <div className="hp-pull-name">{name}</div>
              <div className="hp-pull-role">{role}</div>
            </div>
            <a href={liHref} className="hp-pull-li" target="_blank" rel="noreferrer">
              <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Final CTA (3 cards) ════════════════════════════════════════════════ */

type CtaCard = {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  featured?: boolean;
};

const DEFAULT_CTA: CtaCard[] = [
  {
    icon: Calendar,
    title: "Book a call",
    body: "30-хв Zoom. Покажемо реальні кейси, обговоримо ваш проєкт.",
    cta: "Open Calendly →",
    href: "https://calendly.com/fedirdev",
  },
  {
    icon: MessageCircle,
    title: "Telegram",
    body: "Найшвидший канал. Зазвичай відповідаємо за 30 хв.",
    cta: "Write @fedirdev →",
    href: "https://t.me/fedirdev?text=%D0%94%D0%BE%D0%B1%D1%80%D0%BE%D0%B3%D0%BE+%D0%B4%D0%BD%D1%8F",
    featured: true,
  },
  {
    icon: Mail,
    title: "Send a brief",
    body: "Детальна форма. Опишіть проєкт — повернемось за 4 робочі години.",
    cta: "Open form →",
    href: "/contacts",
  },
];

export function FinalCta3({
  eyebrow = "/ 11 GET IN TOUCH",
  heading = (
    <>
      Готові <em>обговорити</em> проєкт?
    </>
  ),
  sub = "Безкоштовна 30-хв консультація. Без зобов'язань. Розуміємо за 15 хв, чи підходимо одне одному.",
  cards = DEFAULT_CTA,
}: {
  eyebrow?: string;
  heading?: React.ReactNode;
  sub?: React.ReactNode;
  cards?: CtaCard[];
} = {}) {
  return (
    <section className="hp-section" id="contact">
      <div className="hp-inner">
        <SectionHead eyebrow={eyebrow} heading={heading} sub={sub} />
        <div className="hp-finalcta-grid">
          {cards.map((c, i) => {
            const Icon = c.icon;
            const external = c.href.startsWith("http");
            return (
              <a
                key={i}
                href={c.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={`hp-finalcta-card${c.featured ? " featured" : ""}`}
              >
                <div className="hp-finalcta-icon">
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                <div className="hp-finalcta-title">{c.title}</div>
                <p className="hp-finalcta-body">{c.body}</p>
                <div className="hp-finalcta-cta">{c.cta}</div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ Newsletter ═══════════════════════════════════════════════════════════ */

export { Newsletter } from "./newsletter";

/* ═══ Homepage Footer (5-col) ════════════════════════════════════════════ */

const SOLUTIONS_LINKS = [
  { label: "Healthcare", href: "/sites-for/medicine" },
  { label: "Legal", href: "/sites-for/legal" },
  { label: "Accounting", href: "/sites-for/accounting" },
  { label: "E-commerce", href: "/sites-for/ecommerce" },
  { label: "SaaS", href: "/sites-for/saas" },
  { label: "Real Estate", href: "/sites-for/real-estate" },
  { label: "Cosmetology", href: "/sites-for/cosmetology" },
  { label: "Education", href: "/sites-for/education" },
];
const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Calculator", href: "/calculator" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contacts", href: "/contacts" },
];
const COMPARE_LINKS = [
  { label: "vs WordPress", href: "/vs/wordpress" },
  { label: "vs Constructors", href: "/vs/constructors" },
  { label: "vs Freelancers", href: "/vs/freelancers" },
];
const LEGAL_LINKS = [
  { label: "Privacy", href: "/policy" },
  { label: "Terms", href: "/offer" },
  { label: "Public contract", href: "/public-contract" },
  { label: "Legal data", href: "/legal" },
];

type SocialDef = { icon: LucideIcon; href: string; label: string };
const DEFAULT_SOCIALS: SocialDef[] = [
  { icon: Linkedin, href: "https://linkedin.com/in/fedirdev", label: "LinkedIn" },
  { icon: Send, href: "https://t.me/fedirdev", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com/fedirdev", label: "Instagram" },
  { icon: Music2, href: "https://tiktok.com/@fedirdev", label: "TikTok" },
  { icon: Github, href: "https://github.com/fedirdev", label: "GitHub" },
];

export function HpFooter({
  socials = DEFAULT_SOCIALS,
}: { socials?: SocialDef[] } = {}) {
  return (
    <footer className="hp-footer">
      <div className="hp-footer-inner">
        <div>
          <div className="hp-footer-brand">
            <em>Code-Site</em>.art
          </div>
          <p className="hp-footer-desc">
            European boutique studio з Києва. Custom-coded сайти для бізнесу
            з 2023 року.
          </p>
          <div className="hp-footer-contacts">
            <a href="tel:+380970068707">+380-97-006-87-07</a>
            <a href="mailto:hi@code-site.art">hi@code-site.art</a>
            <a href="https://t.me/fedirdev" target="_blank" rel="noreferrer">
              @fedirdev
            </a>
          </div>
        </div>
        <div>
          <div className="hp-footer-col-h">/ SOLUTIONS</div>
          <ul className="hp-footer-col-list">
            {SOLUTIONS_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="hp-footer-col-h">/ COMPANY</div>
          <ul className="hp-footer-col-list">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="hp-footer-col-section">
            <div className="hp-footer-col-h">/ COMPARE</div>
            <ul className="hp-footer-col-list">
              {COMPARE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="hp-footer-col-section">
            <div className="hp-footer-col-h">/ LEGAL</div>
            <ul className="hp-footer-col-list">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="hp-footer-bottom">
        <span className="hp-footer-copy">
          © 2026 Code-Site.art · Made in Kyiv 🇺🇦
        </span>
        <div className="hp-footer-social">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                <Icon size={18} strokeWidth={1.6} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

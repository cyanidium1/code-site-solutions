import type * as React from "react";
import { AppImage } from "@/lib/shared/app-image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, type LucideIcon } from "lucide-react";

import type { RichText } from "@/lib/shared/rich-text";
import { cn, btnClass } from "@/components/ui";
import { SectionHead } from "@/components/shared/section-head";
import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpInnerClass,
  hpSectionClass,
} from "@/components/homepage/shared";

/* ─── Shared content shape (UK + EN stay in sync) ─────────────────────────── */

export type ProfileLink = {
  label: string;
  handle: string;
  href: string;
  icon: LucideIcon;
};

export type IconItem = { icon: LucideIcon; title: string; body: React.ReactNode };

export type GuaranteeItem = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: React.ReactNode;
};

export type ProjectItem = {
  name: string;
  meta: string;
  blurb: React.ReactNode;
  tags: string[];
  href?: string;
  /** Raw oklch accent used for the card's corner glow + tag tint. */
  accent: string;
};

export type AboutCta = { label: string; href: string };

export type AboutContent = {
  meta: { title: string; description: string };
  hero: {
    breadcrumbs: { home: string; about: string };
    homeHref: string;
    eyebrow: string;
    headlineA: React.ReactNode;
    headlineB: React.ReactNode;
    sub: React.ReactNode;
    ctaPrimary: AboutCta;
    ctaSecondary: AboutCta;
    portrait: {
      src: string;
      alt: string;
      name: string;
      role: string;
      location: string;
      badges: string[];
    };
  };
  founder: {
    eyebrow: string;
    heading: React.ReactNode;
    lead: React.ReactNode;
    paragraphs: React.ReactNode[];
    facts: { label: string; value: string }[];
    profilesLabel: string;
    profiles: ProfileLink[];
  };
  trackRecord: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: React.ReactNode;
    github: {
      title: string;
      body: React.ReactNode;
      cta: string;
      href: string;
      repoHint: string;
    };
    stackLabel: string;
    stack: string[];
    regionsLabel: string;
    regions: string[];
  };
  philosophy: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: React.ReactNode;
    pillars: IconItem[];
    warning: { title: string; body: React.ReactNode };
  };
  projects: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: React.ReactNode;
    items: ProjectItem[];
  };
  whatYouBuy: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: React.ReactNode;
    items: IconItem[];
    cms: {
      title: string;
      body: React.ReactNode;
      bullets: string[];
      src: string;
      alt: string;
    };
  };
  guarantees: {
    eyebrow: string;
    heading: React.ReactNode;
    sub: React.ReactNode;
    items: GuaranteeItem[];
    footnote: React.ReactNode;
  };
  faq: { q: string; a: RichText }[];
};

/* ─── Small shared bits ───────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn(hpEyebrowClass, "self-start")}>
      <span className={hpEyebrowDotClass} />
      <span>{children}</span>
    </span>
  );
}

const cardBase =
  "relative overflow-hidden rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)] p-7";
const accentIconBox =
  "inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-accent-30 bg-accent-10 text-accent-soft";

/* ─── 1. Hero ─────────────────────────────────────────────────────────────── */

export function AboutHero({ c }: { c: AboutContent["hero"] }) {
  return (
    <section className="page-hero relative overflow-hidden bg-bg px-6 pt-[72px] pb-12 lg:px-12 lg:pt-[120px] lg:pb-16">
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.06),transparent_70%),radial-gradient(ellipse_40%_50%_at_10%_100%,oklch(from_var(--color-accent-2)_l_c_h_/_0.04),transparent_70%)] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(to_right,oklch(1_0_0_/_0.022)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0_/_0.022)_1px,transparent_1px)] before:bg-[length:64px_64px] before:[mask:radial-gradient(ellipse_80%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative z-[1] mx-auto max-w-container">
        <div className="grid grid-cols-1 items-center gap-9 min-[961px]:grid-cols-[minmax(0,1fr)_minmax(0,440px)] min-[961px]:gap-10 min-[1081px]:gap-14">
          <div className="flex flex-col">
            <nav
              className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 lg:mb-9"
              aria-label="Breadcrumbs"
            >
              <Link
                href={c.homeHref}
                className="text-ink-dim no-underline transition-colors duration-200 hover:text-ink"
              >
                {c.breadcrumbs.home}
              </Link>
              <span className="opacity-60">/</span>
              <span>{c.breadcrumbs.about}</span>
            </nav>

            <Eyebrow>{c.eyebrow}</Eyebrow>

            <h1 className="mt-6 font-actay text-[clamp(34px,5.4vw,62px)] font-bold uppercase leading-[1.02] tracking-[-0.025em] text-ink [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">
              {c.headlineA}
              <br />
              {c.headlineB}
            </h1>

            <p className="mt-6 max-w-[560px] font-sans text-[15px] leading-[1.6] text-ink-dim lg:text-[17px]">
              {c.sub}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link href={c.ctaPrimary.href} className={btnClass("primary")}>
                <span>{c.ctaPrimary.label}</span>
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
              <Link href={c.ctaSecondary.href} className={btnClass("ghost")}>
                {c.ctaSecondary.label}
              </Link>
            </div>
          </div>

          {/* Founder portrait — framed, with an identity caption + badge chips */}
          <div className="relative order-first max-w-[420px] min-[961px]:[order:0] min-[961px]:max-w-none">
            <div className="relative overflow-hidden rounded-[24px] border border-line bg-[oklch(1_0_0_/_0.02)]">
              <div className="relative aspect-[4/5] w-full">
                <AppImage
                  src={c.portrait.src}
                  alt={c.portrait.alt}
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 960px) 92vw, 440px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,oklch(0.1_0_0_/_0.55)_78%,oklch(0.09_0_0_/_0.92)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-actay text-[20px] font-bold uppercase leading-none tracking-[-0.01em] text-ink">
                    {c.portrait.name}
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-accent-soft">
                    {c.portrait.role}
                  </div>
                  <div className="mt-1 font-mono text-[11px] tracking-[0.04em] text-ink-3">
                    {c.portrait.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.portrait.badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-dim"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. Who is behind (founder) ──────────────────────────────────────────── */

export function Founder({ c }: { c: AboutContent["founder"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <div className="grid grid-cols-1 items-start gap-9 min-[961px]:grid-cols-[minmax(0,360px)_minmax(0,1fr)] min-[961px]:gap-10 min-[1081px]:gap-14">
          {/* Fact panel */}
          <div className={cn(cardBase, "p-0")}>
            <div className="border-b border-line px-6 py-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
              / {c.profilesLabel}
            </div>
            <dl className="flex flex-col">
              {c.facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 border-b border-line px-6 py-3.5 last:border-b-0"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-3">
                    {f.label}
                  </dt>
                  <dd className="text-right font-sans text-[13.5px] font-medium text-ink">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-2 p-5">
              {c.profiles.map((p) => {
                const Icon = p.icon;
                return (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-[12px] border border-line bg-[oklch(1_0_0_/_0.02)] px-3.5 py-3 no-underline transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-accent-40"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-line bg-[oklch(1_0_0_/_0.04)] text-ink">
                      <Icon size={15} strokeWidth={1.7} />
                    </span>
                    <span className="flex flex-col">
                      <span className="font-sans text-[13px] font-semibold text-ink">
                        {p.label}
                      </span>
                      <span className="font-mono text-[11px] text-ink-3">
                        {p.handle}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.8}
                      className="ml-auto text-ink-3 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div className="flex flex-col">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-[680px] font-actay text-[clamp(26px,3.4vw,42px)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-ink [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">
              {c.heading}
            </h2>
            <p className="mt-6 max-w-[640px] font-sans text-[17px] leading-[1.55] text-ink">
              {c.lead}
            </p>
            <div className="mt-5 flex max-w-[640px] flex-col gap-4">
              {c.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-sans text-[15px] leading-[1.65] text-ink-dim"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Public track record ──────────────────────────────────────────────── */

export function TrackRecord({ c }: { c: AboutContent["trackRecord"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} sub={c.sub} />
        <div className="grid grid-cols-1 gap-4 min-[961px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* GitHub callout */}
          <a
            href={c.github.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              cardBase,
              "group flex flex-col justify-between no-underline transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-40",
            )}
          >
            <div>
              <div className="flex items-center gap-3">
                <span className={accentIconBox}>
                  {/* GitHub mark */}
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.79 2.74 1.27 3.41.97.1-.76.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
                  </svg>
                </span>
                <span className="rounded-full border border-accent-40 bg-accent-10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-accent-soft">
                  {c.github.repoHint}
                </span>
              </div>
              <h3 className="mt-6 font-actay text-[24px] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-ink">
                {c.github.title}
              </h3>
              <p className="mt-3 max-w-[44ch] font-sans text-[14.5px] leading-[1.6] text-ink-dim">
                {c.github.body}
              </p>
            </div>
            <span className="mt-7 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-dim transition-colors duration-200 group-hover:text-ink">
              {c.github.cta}
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </span>
          </a>

          {/* Stack + regions */}
          <div className="grid grid-rows-2 gap-4">
            <div className={cardBase}>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                / {c.stackLabel}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.stack.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-[10px] border border-line bg-[oklch(1_0_0_/_0.03)] px-3 py-1.5 font-mono text-[12px] tracking-[0.02em] text-ink"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className={cardBase}>
              <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                / {c.regionsLabel}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.regions.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-full border border-accent-30 bg-accent-8 px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.06em] text-accent-soft"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Why we work this way (ownership philosophy) ──────────────────────── */

export function Philosophy({ c }: { c: AboutContent["philosophy"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} sub={c.sub} />
        <div className="grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 lg:grid-cols-4">
          {c.pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className={cn(cardBase, "flex flex-col")}>
                <span className={accentIconBox}>
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-sans text-[18px] font-semibold leading-[1.25] text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 font-sans text-[13.5px] leading-[1.6] text-ink-dim">
                  {p.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* Warning panel */}
        <div className="mt-4 flex flex-col items-start gap-3 rounded-[22px] border border-[oklch(0.65_0.18_25_/_0.3)] bg-[oklch(0.65_0.18_25_/_0.06)] p-7 min-[701px]:flex-row min-[701px]:gap-4">
          <span
            aria-hidden="true"
            className="mt-0.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[oklch(0.7_0.18_25)] shadow-[0_0_10px_oklch(0.7_0.18_25_/_0.6)]"
          />
          <div>
            <h3 className="font-sans text-[17px] font-semibold text-ink">
              {c.warning.title}
            </h3>
            <p className="mt-2 max-w-[80ch] font-sans text-[14.5px] leading-[1.65] text-ink-dim">
              {c.warning.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Real projects ────────────────────────────────────────────────────── */

export function RealProjects({ c }: { c: AboutContent["projects"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} sub={c.sub} />
        <div className="grid grid-cols-1 gap-4 min-[601px]:grid-cols-2 min-[961px]:grid-cols-3">
          {c.items.map((p) => {
            const inner = (
              <>
                <div
                  aria-hidden="true"
                  // eslint-disable-next-line react/forbid-dom-props -- per-card accent glow
                  style={{ "--card-accent": p.accent } as React.CSSProperties}
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(360px_200px_at_0%_0%,oklch(from_var(--card-accent)_l_c_h_/_0.12),transparent_70%)] opacity-70 transition-opacity duration-300 group-hover/proj:opacity-100"
                />
                <div className="relative z-[1] flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-actay text-[20px] font-bold uppercase leading-[1.1] tracking-[-0.01em] text-ink">
                      {p.name}
                    </h3>
                    {p.href ? (
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.8}
                        className="shrink-0 text-ink-3 transition-[transform,color] duration-200 group-hover/proj:translate-x-0.5 group-hover/proj:text-ink"
                      />
                    ) : null}
                  </div>
                  <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    {p.meta}
                  </div>
                  <p className="mt-4 flex-1 font-sans text-[13.5px] leading-[1.6] text-ink-dim">
                    {p.blurb}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-line bg-[oklch(1_0_0_/_0.03)] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-dim"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );
            const cls = cn(
              cardBase,
              "group/proj flex flex-col transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-40",
            );
            return p.href ? (
              <Link key={p.name} href={p.href} className={cn(cls, "no-underline")}>
                {inner}
              </Link>
            ) : (
              <div key={p.name} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. What clients actually buy ────────────────────────────────────────── */

export function WhatYouBuy({ c }: { c: AboutContent["whatYouBuy"] }) {
  return (
    <section className={hpSectionClass}>
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} sub={c.sub} />
        <div className="grid grid-cols-1 gap-4 min-[601px]:grid-cols-2 min-[961px]:grid-cols-3">
          {c.items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className={cn(cardBase, "flex flex-col")}>
                <span className={accentIconBox}>
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-sans text-[17px] font-semibold leading-[1.25] text-ink">
                  {it.title}
                </h3>
                <p className="mt-2 font-sans text-[13.5px] leading-[1.6] text-ink-dim">
                  {it.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* CMS / ownership proof with the real Sanity Studio screenshot */}
        <div className="mt-4 grid grid-cols-1 items-center gap-7 rounded-[24px] border border-line bg-[oklch(1_0_0_/_0.02)] p-7 lg:p-9 min-[961px]:grid-cols-2 min-[961px]:gap-10">
          <div className="flex flex-col">
            <h3 className="font-actay text-[clamp(22px,2.6vw,30px)] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-ink">
              {c.cms.title}
            </h3>
            <p className="mt-4 max-w-[48ch] font-sans text-[15px] leading-[1.65] text-ink-dim">
              {c.cms.body}
            </p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {c.cms.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 font-sans text-[14px] leading-[1.5] text-ink-dim"
                >
                  <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-18 text-accent-soft">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 12l5 5L20 6"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-[16px] border border-line bg-[oklch(1_0_0_/_0.02)]">
            <AppImage
              src={c.cms.src}
              alt={c.cms.alt}
              width={1600}
              height={1000}
              sizes="(max-width: 960px) 92vw, 600px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 7. Guarantees (major trust section) ─────────────────────────────────── */

export function Guarantees({ c }: { c: AboutContent["guarantees"] }) {
  return (
    <section className={cn(hpSectionClass, "border-y border-line")} id="guarantees">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,oklch(from_var(--color-accent)_l_c_h_/_0.07),transparent_70%)]"
      />
      <div className={hpInnerClass}>
        <SectionHead eyebrow={c.eyebrow} heading={c.heading} sub={c.sub} />
        <div className="grid grid-cols-1 gap-4 min-[701px]:grid-cols-2 lg:grid-cols-4">
          {c.items.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="relative flex flex-col overflow-hidden rounded-[22px] border border-accent-25 bg-[oklch(from_var(--color-accent)_l_c_h_/_0.04)] p-7"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,transparent,oklch(from_var(--color-accent)_l_c_h_/_0.5),transparent)]"
                />
                <div className="flex items-center justify-between">
                  <span className={accentIconBox}>
                    <Icon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="font-actay text-[26px] font-bold leading-none tracking-[-0.02em] text-ink [font-feature-settings:'tnum'_1]">
                    {g.tag}
                  </span>
                </div>
                <h3 className="mt-6 font-sans text-[18px] font-semibold leading-[1.25] text-ink">
                  {g.title}
                </h3>
                <p className="mt-2 font-sans text-[13.5px] leading-[1.6] text-ink-dim">
                  {g.body}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 max-w-[80ch] font-sans text-[13.5px] leading-[1.6] text-ink-3">
          {c.footnote}
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sanityFetch } from "@/lib/server/sanity-fetch";
import { PROPOSAL_BY_SLUG_QUERY } from "@/lib/server/sanity-queries";
import type { ProposalDoc, ProposalOptionsSection } from "@/types/proposal";
import {
  PROPOSAL_HTML_LANG,
  PROPOSAL_LABELS,
  proposalLanguage,
} from "@/components/proposal/labels";
import {
  ProposalSectionView,
  sectionTocEntry,
} from "@/components/proposal/sections";
import { ProposalSelection } from "@/components/proposal/selection";
import { SITE_CONTACT } from "@/constants/site";

/**
 * Комерційна пропозиція — технічна сторінка поза маркетинговим сайтом.
 *
 * Чому окремий root layout, а не ще один маршрут у групі (uk):
 * мовні групи тягнуть next-intl, реєстр контенту, GTM, банер мови і
 * хедер з усією навігацією. КП нічого з цього не потрібно — її читає
 * одна людина за прямим посиланням, мову бере з документа, а зайва
 * навігація тут лише відводить погляд від ціни.
 *
 * Індексації немає на двох рівнях: `robots: noindex, nofollow` у metadata
 * і заголовок `X-Robots-Tag` з next.config.ts. У robots.txt шлях свідомо
 * НЕ закритий: Disallow забороняє читати сторінку, а не індексувати її —
 * робот тоді не побачить сам noindex і може лишити URL у видачі без
 * опису. Дозволити обхід і віддати noindex — єдиний надійний варіант.
 */

/** `revalidate: 60` — правки в CMS мають доїжджати до клієнта за хвилину. */
export async function fetchProposal(slug: string): Promise<ProposalDoc | null> {
  try {
    return await sanityFetch<ProposalDoc | null>({
      query: PROPOSAL_BY_SLUG_QUERY,
      params: { slug },
      revalidate: 60,
      tags: [`proposal:${slug}`],
    });
  } catch {
    // Sanity не налаштована / лежить: 404 краще, ніж 500 на посиланні,
    // яке клієнт щойно отримав у листі.
    return null;
  }
}

export async function buildProposalMetadata(slug: string): Promise<Metadata> {
  const doc = await fetchProposal(slug);
  const robots = { index: false, follow: false, nocache: true } as const;
  if (!doc) return { title: "404", robots };

  const language = proposalLanguage(doc.language);
  const client = doc.client?.name;
  const title = client
    ? `${PROPOSAL_LABELS[language].proposalFor} ${client}`
    : (doc.title ?? "Proposal");

  return {
    title,
    description: doc.hero?.lede ?? undefined,
    robots,
    // Без openGraph: посилання на КП летить у пошту й месенджер, і
    // розгортати там картку з ціною для випадкового читача чату не треба.
    alternates: undefined,
  };
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
        {label}
      </dt>
      <dd className="text-[14px] leading-[1.5] text-ink">{value}</dd>
    </div>
  );
}

export async function ProposalView({ slug }: { slug: string }) {
  const doc = await fetchProposal(slug);
  if (!doc) notFound();

  const language = proposalLanguage(doc.language);
  const t = PROPOSAL_LABELS[language];
  const sections = doc.sections ?? [];
  const docTitle = doc.title ?? doc.client?.name ?? "Proposal";

  // Варіант із `recommended` стає початковим вибором, щоб CTA не був
  // порожнім у клієнта, який пролистав до кінця і нічого не натиснув.
  const optionsSection = sections.find(
    (s): s is ProposalOptionsSection => s._type === "proposalOptionsBlock",
  );
  const preselected = optionsSection?.options?.find((o) => o.recommended);

  const toc = sections.map(sectionTocEntry).filter((e) => e !== null);

  const meta = doc.meta;
  const metaRows = [
    meta?.preparedBy
      ? {
          label: t.preparedBy,
          value: [meta.preparedBy, meta.preparedByRole].filter(Boolean).join(" · "),
        }
      : null,
    meta?.issuedOn ? { label: t.issuedOn, value: meta.issuedOn } : null,
    meta?.validUntil ? { label: t.validUntil, value: meta.validUntil } : null,
  ].filter((r) => r !== null);

  const email = meta?.email ?? SITE_CONTACT.email;
  const telegram = meta?.telegram ?? SITE_CONTACT.telegramHandle;

  return (
    <div lang={PROPOSAL_HTML_LANG[language]} className="min-h-screen">
      {/* Шапка: тільки вордмарк і адресат. Жодної навігації — з КП нікуди
          йти, окрім як вниз до наступного кроку. */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <span className="font-actay text-[13px] uppercase tracking-[0.06em] text-ink">
            Code-Site.Art
          </span>
          {doc.client?.name ? (
            <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-3">
              {t.proposalFor} {doc.client.name}
            </span>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
        <div className="flex flex-col gap-6">
          {doc.hero?.eyebrow ? (
            <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-accent-soft">
              {doc.hero.eyebrow}
            </p>
          ) : null}
          {doc.hero?.heading ? (
            <h1 className="font-actay text-[clamp(30px,7vw,52px)] uppercase leading-[1.02] tracking-[-0.03em] text-ink">
              {doc.hero.heading}
            </h1>
          ) : null}
          {doc.hero?.lede ? (
            <p className="max-w-[62ch] text-[16px] leading-[1.7] text-ink-dim sm:text-[17px]">
              {doc.hero.lede}
            </p>
          ) : null}

          {doc.hero?.highlights?.length ? (
            <ul className="grid grid-cols-2 gap-4 border-y border-line py-6 sm:grid-cols-4">
              {doc.hero.highlights.map((h) => (
                <li key={h._key} className="flex flex-col gap-1.5">
                  <span className="font-actay text-[clamp(22px,5vw,30px)] leading-none text-ink">
                    {h.value}
                  </span>
                  <span className="text-[12px] leading-[1.4] text-ink-3">{h.label}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {metaRows.length ? (
            <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              {metaRows.map((row) => (
                <MetaRow key={row.label} label={row.label} value={row.value} />
              ))}
            </dl>
          ) : null}

          {meta?.currencyNote ? (
            <p className="text-[13px] leading-[1.6] text-ink-3">{meta.currencyNote}</p>
          ) : null}

          {toc.length > 2 ? (
            <nav
              aria-label={t.contents}
              className="proposal-no-print flex flex-wrap gap-2 border-t border-line pt-6"
            >
              {toc.map((entry, i) => (
                <a
                  key={entry.id}
                  href={`#${entry.id}`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3.5 text-[12px] text-ink-dim no-underline transition hover:border-line-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="font-mono text-[12px] text-ink-3">{i + 1}</span>
                  {entry.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>

        <ProposalSelection
          initialKey={preselected?.key ?? null}
          initialName={preselected?.name ?? null}
        >
          <div className="mt-14 flex flex-col gap-14 sm:mt-20 sm:gap-20">
            {sections.map((section) => (
              <ProposalSectionView
                key={section._key}
                section={section}
                language={language}
                docTitle={docTitle}
              />
            ))}
          </div>
        </ProposalSelection>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[960px] flex-col gap-4 px-5 py-10 sm:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            <a href={`mailto:${email}`} className="text-ink no-underline hover:text-accent-soft">
              {email}
            </a>
            <a
              href={`https://t.me/${telegram.replace(/^@/, "")}`}
              className="text-ink no-underline hover:text-accent-soft"
            >
              {telegram}
            </a>
          </div>
          {doc.footerNote ? (
            <p className="max-w-[70ch] text-[12.5px] leading-[1.6] text-ink-3">
              {doc.footerNote}
            </p>
          ) : null}
          <p className="proposal-no-print text-[12px] leading-[1.6] text-ink-3">
            {t.confidential}
          </p>
        </div>
      </footer>
    </div>
  );
}

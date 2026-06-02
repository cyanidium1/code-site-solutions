import type { PageData, RawData } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Content summary builder.
//
// This module does NOT write a case. It turns the raw crawl into a readable,
// factual digest (`content-summary.md`) so a human — or Claude Code — can read
// the site at a glance and then write the real, selling case by hand into
// `case-final.md` / `case-final.json`. No external API, no invented metrics,
// no AI integration: just a faithful summary of what was actually crawled.
// ─────────────────────────────────────────────────────────────────────────

const TEXT_SAMPLE_LIMIT = 2_500;
const LINK_LIST_LIMIT = 25;
const IMAGE_LIST_LIMIT = 25;

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

function bulletList(items: string[]): string {
  return items.length ? items.map((i) => `- ${i}`).join("\n") : "—";
}

function quoteBlock(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "—";
  const sample =
    trimmed.length > TEXT_SAMPLE_LIMIT
      ? `${trimmed.slice(0, TEXT_SAMPLE_LIMIT).trimEnd()}…`
      : trimmed;
  return sample
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

function pageSection(page: PageData): string {
  const internal = page.internalLinks
    .slice(0, LINK_LIST_LIMIT)
    .map((l) => `- ${l.text || "(без текста)"} — ${l.href}`);
  const external = page.externalLinks
    .slice(0, LINK_LIST_LIMIT)
    .map((l) => `- ${l.text || "(без текста)"} — ${l.href}`);
  const withAlt = page.images.filter((i) => i.alt.trim()).length;
  const images = page.images
    .slice(0, IMAGE_LIST_LIMIT)
    .map((i) => `- ${i.alt.trim() || "(без alt)"} — ${i.src}`);

  return [
    `## Страница: ${page.url}`,
    "",
    `**Title:** ${page.title || "—"}`,
    "",
    `**Meta description:** ${page.metaDescription || "—"}`,
    "",
    "### H1",
    bulletList(page.h1),
    "",
    "### H2",
    bulletList(page.h2),
    "",
    "### H3",
    bulletList(page.h3),
    "",
    "### Основные тексты (фрагмент)",
    quoteBlock(page.visibleTextPreview),
    "",
    `### Внутренние ссылки (${page.internalLinks.length})`,
    bulletList(internal),
    "",
    `### Внешние ссылки (${page.externalLinks.length})`,
    bulletList(external),
    "",
    `### Изображения (${page.images.length}, с alt: ${withAlt})`,
    bulletList(images),
    "",
    "### Скриншоты страницы",
    bulletList(page.screenshots),
  ].join("\n");
}

/**
 * Build a factual markdown digest of the crawl. Strictly descriptive — the
 * selling case is written separately by a human.
 */
export function buildContentSummary(raw: RawData): string {
  const { site, pages } = raw;

  const allHeadings = uniq(
    pages.flatMap((p) => [...p.h1, ...p.h2, ...p.h3]),
  );
  const allScreenshots = pages.flatMap((p) => p.screenshots);

  const header = [
    `# Сводка по сайту: ${site.name}`,
    "",
    `- **URL:** ${site.url}`,
    `- **Slug:** ${site.slug}`,
    `- **Просканировано:** ${raw.crawledAt}`,
    `- **Страниц обойдено:** ${pages.length}`,
    site.stackHint?.length
      ? `- **Подсказка по стеку:** ${site.stackHint.join(", ")}`
      : "- **Подсказка по стеку:** —",
    site.businessHint
      ? `- **Подсказка по бизнесу:** ${site.businessHint}`
      : "- **Подсказка по бизнесу:** —",
    "",
    "## Просканированные страницы",
    pages.length
      ? pages.map((p) => `- ${p.url}`).join("\n")
      : "—",
    "",
    "## Возможные услуги / фичи / позиционирование",
    "_Выжимка из всех заголовков (H1–H3) — отправная точка, не финальный текст._",
    "",
    bulletList(allHeadings.slice(0, 30)),
    "",
    "## Все скриншоты",
    bulletList(allScreenshots),
    "",
    "---",
    "",
  ].join("\n");

  const body = pages.map(pageSection).join("\n\n---\n\n");

  const footer = [
    "",
    "---",
    "",
    "> Это **фактическая сводка** собранных данных, а не готовый кейс.",
    "> Продающий кейс пишется вручную в `case-final.md` / `case-final.json`",
    "> после просмотра скриншотов. Цифры и результаты не выдумываются.",
    "",
  ].join("\n");

  return `${header}${body}${footer}`;
}

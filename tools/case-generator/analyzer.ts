import type { CaseDraft, RawData } from "./types";

// ─────────────────────────────────────────────────────────────────────────
// Local, template-based case draft generator.
//
// Stage 1 (now): deterministic draft built purely from the crawled data — no
// external API, no invented metrics. The output is a *starting point* a human
// edits, not a finished case.
//
// Stage 2 (later): replace the body of `generateCaseDraft` with a Claude API
// call using the prompt from `prompts.ts`. The `CaseGenerator` signature stays
// identical, so `index.ts` needs no changes.
// ─────────────────────────────────────────────────────────────────────────

function cap(text: string, max: number): string {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

export async function generateCaseDraft(raw: RawData): Promise<CaseDraft> {
  const { site } = raw;
  const home = raw.pages[0];

  const business = site.businessHint?.trim();
  const headings = uniq([...(home?.h2 ?? []), ...(home?.h3 ?? [])]);
  const features = headings.slice(0, 8);
  const stack = site.stackHint ?? [];
  const metaDescription = home?.metaDescription?.trim() ?? "";

  const title = site.name;
  const slug = site.slug;

  const shortDescription = cap(
    metaDescription ||
      `Кастомный сайт для «${site.name}»${business ? ` — ${business}` : ""}.`,
    200,
  );

  const clientContext = [
    `«${site.name}» — ${business ?? "бизнес, которому нужен сильный сайт как точка входа для клиентов"}.`,
    `Сайт доступен по адресу ${site.url}.`,
  ].join(" ");

  const problem =
    "Нужно было собрать понятное онлайн-присутствие: объяснить, чем компания " +
    "полезна, показать услуги и довести посетителя до заявки. Важна была " +
    "современная подача, скорость загрузки и аккуратная работа на мобильных.";

  const solution =
    features.length > 0
      ? `Спроектировали и собрали кастомный сайт. Ключевые блоки: ${features
          .slice(0, 5)
          .join(", ")}. Проработали структуру, тексты, адаптив под десктоп и ` +
        "телефон и заложили SEO-основу (title, description, семантика заголовков)."
      : "Спроектировали и собрали кастомный сайт под задачи бизнеса: структура, " +
        "тексты, адаптив под десктоп и мобильные, SEO-основа.";

  const businessValue =
    `Сайт даёт «${site.name}» внятное позиционирование, аккуратное первое ` +
    "впечатление и готовый канал для заявок. Это основа, которую легко " +
    "развивать дальше — добавлять разделы, кейсы и интеграции.";

  const seoTitle = cap(metaDescription ? `${site.name}` : site.name, 60);
  const seoDescription = cap(metaDescription || shortDescription, 160);

  const screenshots = raw.pages.flatMap((p) => p.screenshots);

  return {
    title,
    slug,
    shortDescription,
    clientContext,
    problem,
    solution,
    features,
    stack,
    businessValue,
    seoTitle,
    seoDescription,
    screenshots,
  };
}

function bulletList(items: string[]): string {
  return items.length ? items.map((i) => `- ${i}`).join("\n") : "—";
}

function screenshotGallery(screenshots: string[]): string {
  if (!screenshots.length) return "—";
  return screenshots.map((s) => `![${s}](./${s})`).join("\n\n");
}

export function caseDraftToMarkdown(draft: CaseDraft): string {
  return `# ${draft.title}

> Черновик кейса, сгенерирован автоматически из данных сайта. Проверьте и
> отредактируйте перед публикацией.

## Кратко
${draft.shortDescription}

## Контекст
${draft.clientContext}

## Задача
${draft.problem}

## Что сделали
${draft.solution}

## Ключевые функции
${bulletList(draft.features)}

## Стек
${bulletList(draft.stack)}

## Ценность для клиента
${draft.businessValue}

## SEO
- **Title:** ${draft.seoTitle}
- **Description:** ${draft.seoDescription}
- **Slug:** ${draft.slug}

## Скриншоты
${screenshotGallery(draft.screenshots)}
`;
}

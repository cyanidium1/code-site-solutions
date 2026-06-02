import type { RawData } from "./types";

// Prompt builder for the *future* Claude-API-backed generator. It is not wired
// up yet — `analyzer.ts` uses a local template for stage 1. When you're ready
// to swap in the API, feed `buildCasePrompt(raw)` to Claude and parse the
// JSON + markdown it returns into a `CaseDraft`.

const SYSTEM_RULES = `Ты — сильный маркетолог и копирайтер веб-студии. Пишешь кейсы
для портфолио студии, которая делает кастомные сайты под бизнес.

Жёсткие правила:
- Пиши на русском языке.
- НЕ выдумывай цифры и НЕ пиши фейковые результаты ("+240% конверсии",
  "рост заявок в 3 раза" и т.п.), если этих данных нет во входных материалах.
- Если измеримых результатов нет — говори о ценности и качестве решения, а не о
  выдуманных метриках.
- Пиши как живой человек, который понимает бизнес, а не как корпоративный труп и
  не как дешёвый инфобизнес. Без воды, штампов и восклицательных знаков пачками.
- Тон: уверенный и продающий, но честный и спокойный.
- Структурируй кейс под сайт веб-студии: контекст → задача → что сделали →
  ключевые функции → стек → ценность для клиента.
- Опирайся только на предоставленные данные (заголовки, тексты, ссылки,
  изображения, подсказки по стеку и бизнесу).`;

const OUTPUT_CONTRACT = `Верни РОВНО два блока, без лишнего текста вокруг.

1. Блок JSON в \`\`\`json ... \`\`\` строго такой структуры:
{
  "title": "",
  "slug": "",
  "shortDescription": "",
  "clientContext": "",
  "problem": "",
  "solution": "",
  "features": [],
  "stack": [],
  "businessValue": "",
  "seoTitle": "",
  "seoDescription": "",
  "screenshots": []
}

2. Блок Markdown в \`\`\`markdown ... \`\`\` со структурой:
# Название кейса
## Кратко
## Контекст
## Задача
## Что сделали
## Ключевые функции
## Стек
## Ценность для клиента
## Скриншоты

Требования к полям:
- seoTitle — до 60 символов, seoDescription — до 160 символов.
- shortDescription — одно ёмкое предложение для карточки кейса.
- features — короткие пункты, без маркетинговой воды.
- screenshots — оставь те же имена файлов, что пришли во входных данных.`;

/** Compact, token-friendly view of the crawl for the model. */
function summarizeData(raw: RawData) {
  return {
    site: {
      name: raw.site.name,
      url: raw.site.url,
      slug: raw.site.slug,
      stackHint: raw.site.stackHint ?? [],
      businessHint: raw.site.businessHint ?? "",
    },
    pages: raw.pages.map((p) => ({
      url: p.url,
      title: p.title,
      metaDescription: p.metaDescription,
      h1: p.h1,
      h2: p.h2,
      h3: p.h3,
      visibleTextPreview: p.visibleTextPreview,
      imagesWithAlt: p.images
        .filter((img) => img.alt)
        .map((img) => img.alt)
        .slice(0, 30),
      screenshots: p.screenshots,
    })),
  };
}

export function buildCasePrompt(raw: RawData): string {
  const data = summarizeData(raw);
  return `${SYSTEM_RULES}

${OUTPUT_CONTRACT}

Входные данные сайта (JSON):
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;
}

# Case Generator (dev-only утилита)

Внутренний инструмент для подготовки кейсов по сайтам. Открывает сайт через
Playwright, делает desktop + mobile скриншоты, собирает данные страниц и
складывает их в читаемую сводку (`content-summary.md`). **Сам кейс пишется
вручную** — человеком или Claude Code — после просмотра скриншотов и сводки.

> ⚠️ Это **dev-only** утилита. Она не импортируется сайтом, не попадает в
> production-бандл и ничего не публикует в CMS. Запускается только вручную.

> Никакого Claude API / Anthropic SDK / внешней AI-интеграции тут нет.
> Playwright нужен только для сбора данных и скриншотов. Анализ и текст кейса
> делает человек (или Claude Code в чате) на основе собранных артефактов.

## Что делает

Для каждого сайта из `config/sites.json`:

1. Открывает страницы в Chromium (desktop 1440×1200 и mobile — iPhone 13).
2. Ждёт `networkidle`, по возможности закрывает cookie/попап-баннеры.
3. Делает full-page скриншоты desktop и mobile в подпапку `screenshots/`.
4. Собирает данные: `title`, `meta description`, `h1/h2/h3`, превью видимого
   текста (до ~8000 символов), внутренние/внешние ссылки, изображения с `alt`.
5. Сохраняет `raw-data.json` (сырые данные).
6. Сохраняет `content-summary.md` — фактическую сводку: сайт, URL, страницы,
   title/meta, h1/h2/h3, фрагменты текста, возможные услуги/фичи, ссылки,
   изображения, список скриншотов. **Цифры не выдумываются, кейс не пишется.**

Утилита **ничего не публикует**.

## Установка

Зависимости (`tsx`, `playwright`) уже прописаны в `devDependencies` корневого
проекта. Из корня репозитория:

```bash
npm install
# один раз — скачать браузер для Playwright:
npx playwright install chromium
```

## Запуск

Из корня репозитория:

```bash
npm run case:crawl
```

Опционально — проверить типы утилиты:

```bash
npx tsc -p tools/case-generator/tsconfig.json
```

## Где результаты

Артефакты складываются локально в `tools/case-generator/output/{slug}/`:

```
output/
  {site-slug}/
    screenshots/
      desktop-home.png
      mobile-home.png
    raw-data.json          # сырые собранные данные
    content-summary.md     # фактическая сводка (генерируется утилитой)
    case-final.md          # ← готовый кейс, пишется вручную
    case-final.json        # ← готовый кейс в JSON, пишется вручную
```

Содержимое `output/` игнорируется git (`output/.gitignore`) — артефакты не
коммитятся.

## Рабочий процесс (как готовить кейс)

1. `npm run case:crawl` — собрать данные и скриншоты.
2. Открыть `screenshots/desktop-*.png` и `screenshots/mobile-*.png`, прочитать
   `content-summary.md` и при необходимости `raw-data.json`.
3. На основе увиденного написать **продающий кейс** в `case-final.md` и его
   JSON-версию в `case-final.json`. Тон — уверенный, без фейковых метрик: если
   конкретных результатов нет, формулируем ценность решения («сайт помогает»,
   «структура позволяет»), а не выдуманные проценты.
4. Перенести готовый кейс в CMS (см. ниже).

### Структура `case-final.json`

```json
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
  "improvements": [],
  "seoTitle": "",
  "seoDescription": "",
  "screenshots": []
}
```

(Тип — `CaseFinal` в `types.ts`.)

## Куда добавлять готовый кейс

Кейсы (`caseStudy`) хранятся **не в этом репозитории**, а в отдельном Sanity
admin-проекте `code-site-solutions-admin` (схема
`schemaTypes/documents/caseStudy.ts`). Фронтенд тянет их через GROQ
(`CASE_STUDIES_QUERY`, `CASE_STUDY_BY_SLUG_QUERY` в
`src/lib/server/sanity-queries.ts`). Локального JSON/MDX-хранилища кейсов нет.

Поэтому утилита **не может** добавить кейс автоматически. Перенос — вручную в
Sanity Studio admin-проекта. Соответствие полей `case-final.json` → `caseStudy`:

| case-final.json   | caseStudy (Sanity)                              |
| ----------------- | ----------------------------------------------- |
| `title`           | `title.uk` (обязательно), при необходимости `en`|
| `slug`            | `slug.current`                                  |
| `shortDescription`| `hero.subheading` / `metricsLine`               |
| `clientContext`   | секция `richTextBlock` / `hero.heading`         |
| `problem`         | секция `richTextBlock`                          |
| `solution`        | секция `richTextBlock` / `imageTextBlock`       |
| `features`        | `richTextBlock` (список) / `statsBlock`         |
| `stack`           | `stack[]`                                        |
| `businessValue`   | секция `richTextBlock` / `quoteBlock`           |
| `improvements`    | внутренняя заметка (в схему не публикуется)      |
| `seoTitle`        | `seo.title.uk`                                  |
| `seoDescription`  | `seo.description.uk`                             |
| `screenshots`     | загрузить как `coverImage` / `mediaGalleryBlock`|

Для публикации поставить `status: "published"` и заполнить обязательный
`title.uk`.

## Как добавить новый сайт для сканирования

Добавьте объект в `config/sites.json`:

```json
{
  "name": "Имя клиента",
  "url": "https://example.com",
  "slug": "example",
  "stackHint": ["Next.js", "Tailwind"],
  "businessHint": "Коротко о бизнесе клиента",
  "paths": ["/", "/about", "/services", "/portfolio", "/contact"]
}
```

- `slug` — имя папки в `output/`.
- `paths` — какие страницы обойти (по умолчанию только `/`).
- `stackHint` / `businessHint` — подсказки для написания кейса.

# Case Generator (dev-only утилита)

Внутренний инструмент для автоматической подготовки **черновиков кейсов** по
сайтам. Открывает сайт через Playwright, делает скриншоты и собирает данные,
затем генерирует черновик кейса (markdown + json).

> ⚠️ Это **dev-only** утилита. Она не импортируется сайтом, не попадает в
> production-бандл и ничего не публикует в CMS. Запускается только вручную.

## Что делает

Для каждого сайта из `config/sites.json`:

1. Открывает страницы в Chromium (desktop 1440×1200 и mobile — iPhone 13).
2. Ждёт `networkidle`, по возможности закрывает cookie/попап-баннеры.
3. Делает full-page скриншоты desktop и mobile.
4. Собирает данные: `title`, `meta description`, `h1/h2/h3`, превью видимого
   текста (до ~8000 символов), внутренние/внешние ссылки, изображения с `alt`.
5. Сохраняет `raw-data.json`.
6. Генерирует черновик кейса: контекст, задача, решение, ключевые функции,
   стек, ценность, короткое описание, SEO title/description, slug.
7. Сохраняет `case-draft.json` и `case-draft.md`. **Ничего не публикует.**

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
    desktop-home.png
    mobile-home.png
    raw-data.json
    case-draft.md
    case-draft.json
```

Содержимое `output/` игнорируется git (`output/.gitignore`) — артефакты не
коммитятся.

## Как добавить новый сайт

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
- `stackHint` / `businessHint` — подсказки для генератора кейса.

## Генерация кейса: текущий этап и развитие

- **Сейчас:** `analyzer.ts` генерирует черновик по локальному шаблону на основе
  собранных данных. Без внешних API. Цифры и результаты не выдумываются —
  это заготовка, которую правит человек.
- **Дальше:** в `prompts.ts` уже готов промпт для Claude API (русский, с
  правилами: не выдумывать метрики, писать по-человечески, вернуть JSON +
  markdown). Чтобы подключить модель, замените тело `generateCaseDraft()` на
  вызов API — сигнатура (`CaseGenerator`) останется прежней, `index.ts` менять
  не нужно.

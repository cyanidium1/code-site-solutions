# Общий контекст аудита — code-site.art

Читай этот файл первым. Он содержит уже собранные факты, чтобы ты не тратил время на повторный сбор.

## Цель

Веб-студия Code-Site.Art. Маркетинговый сайт-визитка + портфолио + блог. Модель B2B-услуг
(разработка сайтов под ключ), не e-commerce. География по заявлению на главной: UA, EU, US, DK, ZA, UK, FR.

**Канонический хост:** `https://www.code-site.art` (с `www`). Проверь, что не-www и http корректно редиректят.

## Что уже установлено

- `robots.txt` → HTTP 200. `Allow: /`, `Disallow: /stories/`, `Host: https://www.code-site.art`,
  `Sitemap: https://www.code-site.art/sitemap.xml`
- Sitemap index валиден, три дочерние карты: `sitemap-ua.xml`, `sitemap-en.xml`, `sitemap-ru.xml`
- Всего **208 уникальных URL**: ua 73, en 71, ru 64
- Главная: HTTP 200, **не SPA**, рендерится server-side. `lang="uk"`. Next.js (App Router).
- trafilatura извлекла с главной всего **503 символа** текста — подозрительно мало, проверь, реальная это
  тонкость контента или особенность вёрстки
- `xhtml:link` (hreflang) в картах присутствует: 271/271/256 вхождений
- `<lastmod>` есть не у всех URL: ua 55/73, en 56/71, ru 54/64

## Уже видимые асимметрии локалей (проверь и оцени)

| Раздел | ua | en | ru |
|---|---|---|---|
| portfolio | 26 | 26 | 26 |
| blog | 23 | 24 | 22 |
| sites-for | 10 | 8 | 8 |
| vs-wordpress / vs-freelancers / vs-constructors | есть | есть | **нет** |
| support | есть | нет | нет |

## Интеграции: чего НЕТ

- Google API (GSC / GA4 / CrUX / PSI) — креденшелов нет, tier -1. Полевых данных не будет, только лабораторные.
- Moz, Bing Webmaster — ключей нет. Бэклинки только tier 0: Common Crawl + верификация краулером.
- DataForSEO MCP — не подключён. Живых SERP-позиций и объёмов запросов не будет.
- Drift-базлайн для домена отсутствует.

Не выдумывай данные, которых нет. Если метрика недоступна — так и пиши, это честный результат.

## Рабочие файлы (готовы к использованию)

Каталог аудита: `C:\Users\User\Documents\GitHub\code-site-solutions\code-site.art-audit\`

- `all-urls.txt` — все 208 URL, по одному в строке
- `sitemap-index.xml`, `sitemap-ua.xml`, `sitemap-en.xml`, `sitemap-ru.xml` — скачанные карты
- `home-render.json` — отрендеренная главная (raw HTML, rendered HTML, extracted_text)

## Как запускать инструменты

Раннер (venv готов, Chromium установлен):

```
"$HOME/.claude/skills/seo/bin/claude-seo" run <script>.py [args]
```

Полезные скрипты: `render_page.py`, `fetch_page.py`, `parse_html.py`, `schema_generate.py`,
`pagespeed_check.py`, `capture_screenshot.py`, `analyze_visual.py`, `content_quality.py`,
`nlp_analyze.py`, `commoncrawl_graph.py`, `verify_backlinks.py`, `url_safety.py`, `preload_check.py`,
`lcp_subparts.py`, `agent_ux_check.py`, `parasite_risk.py`, `domain_history.py`, `seo_updates.py`.

`weasyprint` в venv не работает (нет GTK на Windows) — PDF не генерируй, только Markdown.

## Исходники сайта

Репозиторий лежит рядом: `C:\Users\User\Documents\GitHub\code-site-solutions` — Next.js 15 App Router,
next-intl, Sanity CMS. Можешь читать исходники, чтобы найти первопричину бага.

**Важно:** источник истины для аудита — **живой сайт**, а не локальная ветка. Прод и локальный `master`
расходятся. Если нашёл расхождение — это находка, а не повод править аудит под код.

**Ничего не меняй в исходниках репозитория.** Пиши только внутрь `code-site.art-audit\`.

## Формат результата

1. Запиши подробные находки в `code-site.art-audit\findings\<твоя-категория>.md`
2. Верни финальным текстом сжатую сводку: оценка категории 0-100, что работает хорошо,
   и список находок в формате `severity | заголовок | доказательство | конкретное исправление`.

Severity: `Critical` (блокирует индексацию / штраф) > `High` (заметно бьёт по ранжированию) >
`Medium` (упущенная возможность) > `Low` (бэклог).

Каждая находка должна опираться на наблюдение, которое можно перепроверить: URL, строка кода,
заголовок ответа, число. Формулировки вида «желательно улучшить контент» бесполезны — не пиши их.

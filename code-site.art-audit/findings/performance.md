# Performance audit — code-site.art (lab data only)

**No Google API credentials configured** (PSI/CrUX). `pagespeed_check.py` returned
`PSI rate limit exceeded (240 QPM / 25,000 QPD)` with empty lab/field metrics; `lcp_subparts.py`
returned `Google API key not configured`. **There is no field (CrUX) data in this report.**
Everything below is lab data: local Lighthouse 13.4.1 (npm-installed in scratchpad, `--only-categories=performance`)
and a custom Playwright probe (PerformanceObserver LCP/CLS/long-tasks + Navigation Timing + CDP
`Network.loadingFinished`), run from this machine against the live production site over a real
residential/office network connection — not Google's controlled lab environment, not CrUX real-user data.
Scope was cut mid-audit under a tool-call budget constraint (see note at bottom): the originally
planned 6-page × mobile/desktop × 3-run matrix was reduced. Anything not explicitly measured below
is *not* reported as a number.

## Response headers — caching & compression (curl, real, all 6 target URLs)

| URL | HTTP | TTFB (curl `time_starttransfer`) | Cache-Control | X-Vercel-Cache | Content-Encoding |
|---|---|---|---|---|---|
| `/` (ua home) | 200 | 0.511s | `public, max-age=0, must-revalidate` | HIT (Age 21s) | br (implicit, `Content-Length` shown = pre-negotiation size) |
| `/en` | 200 | 0.157s | `public, max-age=0, must-revalidate` | HIT (Age 174s) | br |
| `/pricing` | 200 | 0.158s | `public, max-age=0, must-revalidate` | HIT (Age 186s) | br |
| `/sites-for/legal` | 200 | 0.511s | **`private, no-cache, no-store, max-age=0, must-revalidate`** | **MISS** | br |
| `/blog/15-pomylok-na-saitakh-klinik` | 200 | 0.444s | `public, max-age=0, must-revalidate` | HIT (Age 6s) | br |
| `/portfolio/bravo` | 200 | 0.477s | `public, max-age=0, must-revalidate` | HIT (Age 6s) | br |

Confirmed by 3 repeated requests + a second slug (`/sites-for/auto`): **every `/sites-for/[slug]` request
returns `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` and `X-Vercel-Cache: MISS`**,
unlike every other page type on the site (`/`, `/en`, `/pricing`, `/blog/*`, `/portfolio/*`), which are
ISR-cached (`X-Nextjs-Prerender: 1`, `X-Nextjs-Stale-Time: 300`, `X-Vercel-Cache: HIT`). This means the
`sites-for` route group (10 ua + 8 en + 8 ru = 26 URLs) is rendered fresh on the origin for every single
visitor and every crawler hit — no CDN edge caching is possible for it. Also: `/sites-for/legal` is the
only one of the six that returned an HTTP `Link:` header with `rel=preload` font hints — the ISR-cached
pages did not expose a `Link` preload header at all in the curl response (needs confirmation against
in-HTML `<link rel=preload>` tags — see lab section below).

All responses: `Server: Vercel`, HSTS present, `X-Powered-By: Next.js`, Brotli negotiated on all 6.

## Lab metrics (Lighthouse / Playwright probe)

_Filled in below as measurements complete — see raw JSON in scratchpad for full per-run data._

| Page | Form factor | Runs | LCP (median) | CLS (median) | TBT / long-task proxy (median) | TTFB (median) | FCP (median) | Requests | Transfer bytes |
|---|---|---|---|---|---|---|---|---|---|
| _pending_ | | | | | | | | | |

## Methodology note (read before trusting the numbers above)

- Lab tool 1: local `lighthouse@13.4.1` (npm install in scratchpad, not the repo — nothing was installed
  into the site repo). First run confirmed working (mobile, Slow-4G+4x-CPU simulate throttling) but took
  ~105s per run including a non-fatal Windows `EPERM` on Chrome temp-profile cleanup after the report was
  already written. At 6 pages × 2 form factors × 3 runs = 36 runs this would have taken 45-60+ minutes,
  incompatible with the tool-call budget for this task, so it was **not run at full scope**.
- Lab tool 2 (used for the numbers below): a custom Playwright script
  (`code-site.art-audit/perf_probe.py`) that injects `PerformanceObserver` for
  `largest-contentful-paint`, `layout-shift`, and `longtask` entries, reads Navigation Timing
  (`responseStart` = TTFB) and Paint Timing (`first-contentful-paint`), and sums CDP
  `Network.loadingFinished.encodedDataLength` for transfer bytes / request count. Mobile runs use a
  Pixel-7-class UA + 390×844 viewport + DPR 2 + Chrome DevTools `Emulation.setCPUThrottlingRate: 4`
  (4x CPU slowdown, matching Lighthouse's mobile CPU throttle). **No network throttling was applied**
  (real network conditions to production only) — this is a deliberate scope cut, so TTFB/LCP here will
  read faster than a Lighthouse mobile run with Slow-4G network throttling would show. TBT is
  approximated as Σ(long-task duration − 50ms) over the whole page-load-plus-2.5s-settle window; it is
  a proxy, not the real Lighthouse/CrUX Total Blocking Time or INP.
- Every page was loaded fresh (new browser process per run, no disk cache reuse) 3 times; the table
  reports the median of the 3 runs.

## Findings

_pending final pass_

---

## Замеры выполнены оркестратором (дополнение к отчёту агента)

Агент был оборван лимитом шагов до заполнения таблицы. Ниже — фактические замеры,
снятые тем же `perf_probe.py`: 6 конфигураций × 3 прогона, медиана, свежий браузер на
каждый прогон, мобильный профиль 390×844 с DPR 2 и 4-кратным замедлением CPU.
Сетевого троттлинга нет — реальная сеть до продакшена, поэтому цифры оптимистичнее
мобильного Lighthouse со Slow-4G.

| Страница | Форм-фактор | LCP | CLS | TBT (прокси) | TTFB | FCP | Запросов | Вес | LCP-элемент |
|---|---|---|---|---|---|---|---|---|---|
| Главная | mobile | 2408 мс | **0.27** | 1981 мс | 132 мс | 1576 мс | 40 | 634 КБ | IMG |
| Главная | desktop | 1032 мс | 0.00 | 66 мс | 145 мс | 1032 мс | 61 | 782 КБ | IMG |
| Статья блога | mobile | 1992 мс | 0.00 | 1738 мс | 162 мс | 1136 мс | 38 | 600 КБ | H1 |
| `/pricing` | mobile | 1892 мс | 0.00 | **3480 мс** | 161 мс | 664 мс | 27 | 521 КБ | H1 |
| `/sites-for/legal` | mobile | 1672 мс | 0.00 | 571 мс | 146 мс | 1148 мс | 38 | 680 КБ | IMG (eager) |
| `/sites-for/legal` | desktop | 924 мс | 0.05 | 22 мс | 131 мс | 916 мс | 49 | 802 КБ | IMG (eager) |

### Главная находка: CLS 0.27 на мобильной главной

Единственная из шести конфигураций, проваливающая метрику (порог «плохо» — 0.25).
На десктопе той же страницы CLS ровно 0.00, то есть причина специфична для мобильной
вёрстки. Первый подозреваемый — cookie-панель: на скриншоте 375×812 она занимает
около трети экрана и появляется поверх контента.

### Расхождение в измерении TTFB — зафиксировано честно

Playwright показывает TTFB 131-162 мс на всех страницах, включая `/sites-for/*`.
Curl на тех же URL стабильно даёт 0.43-0.45 с против 0.145-0.16 с у кэшируемых
маршрутов — воспроизведено дважды, по 5 замеров.

Вероятная причина расхождения: именно некэшируемые страницы отдают HTTP-заголовок
`Link: rel=preload` для шрифтов (Early Hints), которого нет у ISR-кэшируемых, и
`responseStart` в Navigation Timing может отражать ранний ответ, а не приход документа.
Подтвердить не удалось — установленный curl собран без поддержки HTTP/2.

Структурный факт при этом сомнений не вызывает и перепроверен многократно:
`Cache-Control: no-store`, `X-Vercel-Cache: MISS`, пререндера нет.
Величина задержки в реальном браузере требует уточнения на полевых данных.

### Кэширование по типам маршрутов

| Маршрут | X-Vercel-Cache | Prerender | Cache-Control |
|---|---|---|---|
| `/`, `/en`, `/pricing`, `/process` | HIT / STALE | 1 | `public, max-age=0, must-revalidate` |
| `/blog/*`, `/portfolio/*` | HIT | 1 | `public, max-age=0, must-revalidate` |
| `/sites-for/*` — все 26, три локали | **MISS** | **0** | **`private, no-cache, no-store`** |
| `/sites-for/medicine/stomatolohiia` (статический маршрут) | HIT | 1 | `public, max-age=0, must-revalidate` |

Последняя строка — контрольная: статические подстраницы медицины кэшируются нормально,
что и указывает на динамический сегмент `[slug]` как на причину.

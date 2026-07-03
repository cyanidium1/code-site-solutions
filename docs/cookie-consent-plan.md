# Cookie consent / GDPR compliance — implementation outline

Status: **decided — trialling free CookieYes** (job #23, 01.07.2026); custom banner (§4 Option A) kept as fallback if the look isn't acceptable.

## 0. Integration state (code done, awaiting site ID)

- `src/components/analytics/cookie-yes.tsx` — `<CookieYes />` loader, `beforeInteractive`, renders null until `COOKIEYES_ID` is set.
- `COOKIEYES_ID` constant added to `src/constants/site.ts` (currently `""`).
- Wired into both root layouts **before** `<GoogleTagManager />` so Consent Mode defaults gate GTM's tags. Typecheck passes.
- `COOKIEYES_ID` set (02.07.2026); banner verified rendering on both locales via Playwright at `http://local.code-site.art:3000` (hosts-file alias — the served script is domain-locked to `code-site.art` and silently no-ops on `localhost`/`*.vercel.app`).
- Verified: Accept All hides banner + pushes `consent update: granted` to dataLayer; choice stored in a 365-day `cookieyes-consent` cookie set with `secure`, so it can't persist on plain-HTTP local testing — re-verify persistence on production HTTPS.
- ~~Found gap: no `consent default: denied` before user choice.~~ **Resolved 02.07.2026:** with the custom-script install method CookieYes never sets the GCM *default* itself (dashboard "Check GCM status" said "Default consent not set"). Fix: `cookie-yes.tsx` is now a single inline bootstrap that pushes `consent default = denied` (their documented snippet: all storage denied, `security_storage` granted, `wait_for_update: 2000`, `ads_data_redaction` + `url_passthrough` true) and then injects the CDN script — one inline script because React 19 hoists async `<script>` tags to `<head>`, which could race the defaults.
- **Verified via Playwright (02.07.2026):** `consent:default` denied is dataLayer entry #0 before any choice; no `_ga`/`_gid`/`_gcl`/`_fbp` cookies pre-consent; CookieYes (Support GCM on, strict mode) pushes `update: denied` on load and `update: granted` after Accept All. Defaults are **global**, not EU-scoped — consistent with the banner showing globally on free tier.
- Banner language: English on both locales — per-language banners are premium; accepted for now.
- **Superseded 02.07.2026:** CookieYes replaced by the in-house module `src/lib/cookie-consent/` (see [cookie-consent-custom-plan.md](cookie-consent-custom-plan.md)). The CookieYes account can be closed; the `local.code-site.art` hosts alias is no longer needed (no domain lock).
- Earlier close-out (same day, for history): live on https://www.code-site.art/, dashboard "Check GCM status" reports **No error detected**, banner Active. Palette customization turned out to be unavailable on the free plan (contrary to earlier research) — default blue buttons accepted for now. If the look becomes a problem, either the Basic plan (~$10/mo, custom CSS) or the custom banner (§4 Option A) are the upgrade paths.

## 7. Free-tier dashboard config (target to match our look)

- **Layout:** Banner, position **Bottom**. Theme **Dark**.
- **Colours:** background `#1f1a26` (our `--color-bg-raised`); text `#f5f4f7` (our `--color-ink`); **Accept All** button `#7c4dde` (our brand violet / HeroUI primary) with white text; **Reject All** as outline/ghost so it reads equally prominent (GDPR).
- **Buttons:** enable **Accept All + Reject All + Customise** (reject must be present and as easy as accept).
- **Consent Mode:** enable **Support GCM** in CookieYes settings (do NOT also add the CookieYes GTM template — conflicts with our code-loaded script).
- **Categories:** Necessary (locked) + Analytics + Advertisement (Pixel).
- Free-tier limits accepted for the trial: "Powered by CookieYes" branding stays; 5,000 pageviews/mo cap; no custom CSS (so no Manrope/Actay font, radius, gradient, or glow — colour parity only).

## 1. Current state (what the code does today)

- `GoogleTagManager` (`src/components/analytics/google-tag-manager.tsx`) is injected at the **top of `<body>` in both root layouts** — `(uk)/layout.tsx:114` and `(en)/layout.tsx:108` — with `next/script` `strategy="afterInteractive"`. It loads **unconditionally, before any consent**.
- GTM is the umbrella container: per its own comment it hosts **GA4, Meta Pixel, heatmaps, etc.** So analytics + advertising cookies fire on first paint for everyone, including EU visitors.
- **No consent mechanism, no cookie/privacy policy page** (no privacy/policy link found in footer content), **no Consent Mode signals**. This is the GDPR gap.
- Stack that any solution must fit: Next.js 15 App Router, HeroUI + Tailwind v4, `next-themes` (dark, class-based), `next-intl` (uk `/`, en `/en/*`). Existing reusable modal pattern: `LeadModalProvider` (`src/components/blocks/lead-modal`).
- Design tokens available for a native banner: `--color-bg` `#121212`, `--color-bg-raised` `#1f1a26`, `--color-ink` / `--color-ink-dim`, `--color-accent` (oklch violet), `bg-brand-gradient`, `shadow-accent-glow` (`src/app/globals.css`), plus HeroUI `primary: #7c4dde`.

## 2. The one thing that is non-negotiable regardless of approach

**Google Consent Mode v2.** Because everything ships through GTM, the correct GDPR pattern is:

1. Before the GTM snippet runs, push a **default `consent` state = `denied`** for `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization` (EU region), with `wait_for_update`.
2. GTM/GA4/Pixel then respect that and fire in cookieless "ping" mode until the user chooses.
3. On **Accept**, push `consent update` = `granted` for the accepted categories.

This is what actually makes us compliant. The banner (whoever renders it) is just the UI that flips these signals. Whatever we pick, this default-denied gate must land **before** the current GTM script — likely a small inline `beforeInteractive` script.

## 3. CookieYes assessment (can we use it?)

Yes, technically — it's a Google-certified CMP, integrates with GTM + Consent Mode v2, auto-blocks third-party cookies before consent, auto-scans the site for cookies, keeps a consent log, and **persists choice itself** (its own `cookieyes-consent` cookie). So it satisfies "persist choice" out of the box.

**But it collides with the two things you actually asked for:**

| Requirement | CookieYes reality |
|---|---|
| Match our HeroUI/Tailwind styles | **Custom CSS is gated behind the paid Basic plan (~$10/mo/domain)**. Even then you're skinning *their* widget's DOM — you can approximate colours/radius but won't get true parity with our components/animations. Free tier = their default banner only. |
| Remove their branding | Only on the **Ultimate plan (~$55/mo)**. |
| Traffic headroom | Free tier caps at **5,000 pageviews/mo** — a live marketing site will likely blow past this, forcing a paid plan anyway. |
| Persist user choice | ✅ Handled natively. |
| Consent Mode v2 + GTM | ✅ Handled natively (recommended via their GTM template). |

**Verdict:** CookieYes is the fast, managed, lower-effort path and is genuinely compliant — but the exact things you flagged (custom UI to our styles, our own persistence) are its weak spots and cost money, while being features we can build natively for free and with perfect design parity.

## 4. Two paths — recommendation

### Option A — Custom banner + Consent Mode v2 (recommended)

Build the banner from our own HeroUI/Tailwind components and wire it straight to Consent Mode. Best design match, no recurring cost, full control; we own compliance correctness.

- **`ConsentProvider`** (client) mirroring `LeadModalProvider`: reads stored consent, exposes `openPreferences()`, renders the banner + preferences modal.
- **Banner UI**: bottom sheet using `bg-bg-raised`, `border-line`, accent CTA — "Accept all", "Reject all", "Preferences". Reject must be as easy as Accept (GDPR). Localised via `next-intl` (uk/en messages).
- **Preferences modal**: HeroUI `Modal` + switches for categories — Necessary (locked on), Analytics, Marketing.
- **Persistence**: store `{ version, categories, timestamp }` in a first-party cookie (`cs_consent`, ~12-month expiry) so the server can read it too; localStorage as mirror. `version` bump forces re-consent when categories change. No banner re-shows once a valid record exists.
- **Consent Mode wiring**: `beforeInteractive` inline script sets default `denied`; provider pushes `gtag('consent','update',…)` on choice. GTM container configured to trigger tags off consent (GTM-side config, not code).
- **Cookie policy page**: new `/cookies` (uk) + `/en/cookies` route listing categories/cookies, linked from footer + banner. Required for compliance.
- Effort: ~1–2 focused sessions. Files: new `src/components/consent/*`, edits to both layouts (add default-consent gate + provider), footer link, messages, new policy route.

### Option B — CookieYes (managed)

Drop in the CookieYes script (via GTM), enable "Support GCM", configure categories in their dashboard, approximate our styles with paid custom CSS. Fastest to live; ~$10/mo/domain ongoing; imperfect design parity; branding removal +$45/mo.

**Recommendation: Option A.** It directly delivers the two goals you named (our styles, our persistence), costs nothing recurring, and the only "hard" part — Consent Mode v2 — is required in Option B too.

## 5. Open decisions (need input before build)

1. **Option A (custom) or B (CookieYes)?**
2. Consent Mode geo-scope: **EU/EEA-only default-denied** (recommended, keeps analytics for the UA/rest-of-world markets) or **global default-denied**?
3. Categories to offer: confirm **Necessary + Analytics + Marketing** (Pixel) is the full set.
4. Who supplies the **cookie policy copy** (legal text, uk + en)?

## 6. Compliance checklist (applies to whichever path)

- [ ] No non-essential cookie/tag fires before opt-in (verify GA4 + Pixel actually gated).
- [ ] Reject as prominent/easy as Accept.
- [ ] Granular per-category control.
- [ ] Choice persisted; no re-nag; easy way to change later (footer "Cookie settings").
- [ ] Consent record (timestamp + version) retained.
- [ ] Linked, localised cookie/privacy policy.
- [ ] Works in both `(uk)` and `(en)` route groups.

## Sources
- CookieYes pricing/limits: <https://www.enzuzo.com/blog/cookieyes-pricing>, <https://www.termsfeed.com/blog/cookieyes-review/>, <https://www.cookieyes.com/documentation/customize-cookie-banner/>
- CookieYes + Consent Mode v2 / GTM: <https://www.cookieyes.com/documentation/implementing-google-consent-mode-using-cookieyes/>, <https://www.cookieyes.com/blog/google-consent-mode-v2/>

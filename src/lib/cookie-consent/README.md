# cookie-consent

Self-contained GDPR cookie-consent module: GCM v2 bootstrap, banner,
preferences dialog, first-party persistence, per-category gating.

## Wiring (this project)

1. `<ConsentBootstrap />` — top of `<body>` in every root layout, **before**
   `<GoogleTagManager />`. Pushes GCM `default=denied` + re-applies stored
   choice synchronously.
2. `<ConsentProvider locale={locale}>` — wraps the app inside
   `app/providers.tsx`. Renders banner + preferences.
3. `<CookieSettingsLink />` — footer, reopens preferences (withdrawal).
4. `<ConsentGate category="...">` — wrap any future non-GTM script/embed.

GTM tags themselves are gated by Consent Mode — GA4/Pixel fire in cookieless
ping mode (or not at all) until the matching category is granted.

## Reusing in another project

Copy this folder. Rules that make that work:
- Relative imports only inside the module; deps: React + `next/link`.
- Edit **`config.ts`** only: cookie name, version, TTL, category→GCM mapping,
  policy paths, GTM event name.
- Remap Tailwind tokens in `styles/classes.ts` to the target project.
- Add/replace dictionaries under `locales/<locale>/`.

## Forcing re-consent

Bump `CONSENT_VERSION` in `config.ts` — stored consent with an older version
parses as null, so banner + default-denied apply again.

## Tests

Unit: `core/*.test.ts` (run via `npm test`). E2E: `npm run consent:verify`
against a dev server (see `tools/consent-verify.mjs`).

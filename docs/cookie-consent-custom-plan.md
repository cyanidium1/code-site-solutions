# Custom Cookie Consent Module — Implementation Plan

> **Status: EXECUTED 02.07.2026** on branch `feat/custom-cookie-consent`. All 14 tasks done; unit tests green (13), e2e verifier green (13 checks). One deviation: `PageHero` prop is `headline`, not `title` (fixed in Task 12). GTM consent-overview check (Task 14 step 3) remains a manual dashboard step.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the free-tier CookieYes banner with a fully custom, reusable, GDPR-compliant cookie-consent module at `src/lib/cookie-consent/`, keeping the verified Google Consent Mode v2 gating of GTM (GA4 / Meta Pixel).

**Architecture:** A self-contained module (components + hooks + core logic + locales + styles) with **relative imports only** inside it, so the whole folder can be copied into another project; the single project-specific file is `config.ts`. An inline bootstrap script (generated from config, unit-tested as a string) pushes GCM `default=denied` **and** re-applies any stored choice synchronously before GTM boots. A React provider renders the banner/preferences UI (custom primitives, no HeroUI) and persists choices in a first-party versioned cookie.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind v4 (+ one CSS module for keyframes), `node:test` for units, Playwright script for e2e. No new dependencies.

**Predecessor doc:** [cookie-consent-plan.md](cookie-consent-plan.md) (CookieYes rollout, §4 Option A is the spec this plan implements). Estimated effort: 12–18 h.

---

## Module layout (target)

```
src/lib/cookie-consent/
├── README.md                    # what it is, how to reuse in another project
├── index.ts                     # public API (the only file the app imports from)
├── config.ts                    # ← the ONLY project-specific file
├── types.ts
├── core/
│   ├── consent-storage.ts       # cookie parse/serialize/read/write
│   ├── consent-storage.test.ts
│   ├── consent-mode.ts          # choices → GCM signals; dataLayer pushes
│   ├── consent-mode.test.ts
│   ├── bootstrap-script.ts      # generates the inline pre-GTM script
│   └── bootstrap-script.test.ts
├── hooks/
│   ├── use-consent.ts           # context hook (re-exported by index.ts)
│   └── use-focus-trap.ts
├── components/
│   ├── consent-bootstrap.tsx    # server comp: inline <script> (replaces cookie-yes.tsx)
│   ├── consent-provider.tsx     # client context + state machine, mounts banner/prefs
│   ├── consent-banner.tsx
│   ├── consent-preferences.tsx
│   ├── cookie-settings-link.tsx # footer trigger to reopen preferences
│   ├── consent-gate.tsx         # render children only when a category is granted
│   └── primitives/
│       ├── consent-button.tsx
│       ├── consent-switch.tsx
│       └── consent-dialog.tsx
├── locales/
│   ├── index.ts                 # ConsentCopy type + getConsentCopy(locale)
│   ├── uk/consent.ts
│   └── en/consent.ts
└── styles/
    ├── classes.ts               # Tailwind class-string constants (repo pattern)
    └── consent.module.css       # slide-up / fade keyframes
```

**Module rules (enforced by review, stated in module README):**
1. Inside `src/lib/cookie-consent/` use **relative imports only** — no `@/…`, no HeroUI, no next-intl. React + Next built-ins (`next/link`) only.
2. Everything project-specific (cookie name, version, category→GCM mapping, policy URLs, update-event name) lives in `config.ts`.
3. The app imports **only** from `@/lib/cookie-consent` (the `index.ts` barrel).

Related but **outside** the module (policy page is a separate concern):
- `src/content/{uk,en}/cookie-policy.ts` — policy copy + cookie tables
- `src/components/legal/cookie-policy.tsx` — policy page body
- `src/app/(uk)/cookies/page.tsx`, `src/app/(en)/en/cookies/page.tsx`
- `tools/consent-verify.mjs` — Playwright e2e verifier (replaces the throwaway scripts used for CookieYes)

---

### Task 1: Module scaffold — `types.ts` + `config.ts`

**Files:**
- Create: `src/lib/cookie-consent/types.ts`
- Create: `src/lib/cookie-consent/config.ts`

- [ ] **Step 1: Create `types.ts`**

```ts
/** Consent categories shown in the preferences UI. */
export type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

/** Categories the visitor can toggle — "necessary" is always granted and not stored. */
export type TogglableCategory = Exclude<ConsentCategory, "necessary">;

export type ConsentChoices = Record<TogglableCategory, boolean>;

/** JSON payload persisted in the first-party consent cookie — the consent record. */
export type StoredConsent = {
  /** Schema/consent version; bump CONSENT_VERSION in config.ts to force re-consent. */
  v: number;
  /** ISO-8601 timestamp of the choice. */
  ts: string;
  choices: ConsentChoices;
};

/** Google Consent Mode v2 signal names. */
export type GcmSignal =
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage"
  | "functionality_storage"
  | "personalization_storage"
  | "security_storage";

export type GcmState = Record<GcmSignal, "granted" | "denied">;
```

- [ ] **Step 2: Create `config.ts`**

```ts
import type { ConsentChoices, GcmSignal, TogglableCategory } from "./types";

/**
 * Project-specific tuning. This is the ONLY file to edit when reusing the
 * module in another project.
 */

/** First-party cookie holding the visitor's choice. */
export const CONSENT_COOKIE = "cs-consent";

/**
 * Bump to force every visitor to re-consent (new category, new tracker,
 * changed policy substance). Stored consent with a different `v` is ignored.
 */
export const CONSENT_VERSION = 1;

/** Days the choice is remembered (GDPR guidance: re-ask at most yearly). */
export const CONSENT_TTL_DAYS = 365;

/** GCM v2 signals controlled by each togglable category. */
export const CATEGORY_GCM_SIGNALS: Record<TogglableCategory, GcmSignal[]> = {
  functional: ["functionality_storage", "personalization_storage"],
  analytics: ["analytics_storage"],
  marketing: ["ad_storage", "ad_user_data", "ad_personalization"],
};

export const ALL_DENIED: ConsentChoices = {
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_GRANTED: ConsentChoices = {
  functional: true,
  analytics: true,
  marketing: true,
};

/** dataLayer event pushed on every choice — usable as a GTM custom-event trigger. */
export const CONSENT_UPDATE_EVENT = "cs_consent_update";

/** Localized cookie-policy URL the banner and preferences link to. */
export function consentPolicyPath(locale: string): string {
  return locale === "en" ? "/en/cookies" : "/cookies";
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: clean exit.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cookie-consent/types.ts src/lib/cookie-consent/config.ts
git commit -m "feat(consent): scaffold cookie-consent module — types and config"
```

---

### Task 2: `core/consent-storage.ts` (TDD)

**Files:**
- Create: `src/lib/cookie-consent/core/consent-storage.test.ts`
- Create: `src/lib/cookie-consent/core/consent-storage.ts`
- Modify: `package.json:10` (append test file to the `test` script list)

- [ ] **Step 1: Write the failing tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  parseStoredConsent,
  serializeStoredConsent,
} from "./consent-storage";
import { CONSENT_VERSION } from "../config";

const CHOICES = { functional: true, analytics: true, marketing: false };

test("serialize → parse round-trips choices, version and timestamp", () => {
  const now = new Date("2026-07-02T12:00:00.000Z");
  const parsed = parseStoredConsent(serializeStoredConsent(CHOICES, now));
  assert.deepEqual(parsed, {
    v: CONSENT_VERSION,
    ts: "2026-07-02T12:00:00.000Z",
    choices: CHOICES,
  });
});

test("empty / null / garbage input parses to null", () => {
  assert.equal(parseStoredConsent(null), null);
  assert.equal(parseStoredConsent(undefined), null);
  assert.equal(parseStoredConsent(""), null);
  assert.equal(parseStoredConsent("not json"), null);
  assert.equal(parseStoredConsent("%7B"), null); // truncated encoded JSON
});

test("version mismatch parses to null (forces re-consent)", () => {
  const stale = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION - 1, ts: "2026-01-01T00:00:00.000Z", choices: CHOICES }),
  );
  assert.equal(parseStoredConsent(stale), null);
});

test("missing or non-boolean category parses to null", () => {
  const bad = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION, ts: "", choices: { functional: true, analytics: "yes" } }),
  );
  assert.equal(parseStoredConsent(bad), null);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --import tsx --test src/lib/cookie-consent/core/consent-storage.test.ts`
Expected: FAIL — module `./consent-storage` not found.

- [ ] **Step 3: Implement `consent-storage.ts`**

```ts
import { CONSENT_COOKIE, CONSENT_TTL_DAYS, CONSENT_VERSION } from "../config";
import type { ConsentChoices, StoredConsent } from "../types";

/** Pure: raw cookie value → validated consent record, or null (→ show banner). */
export function parseStoredConsent(raw: string | null | undefined): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as {
      v?: unknown;
      ts?: unknown;
      choices?: Record<string, unknown>;
    };
    if (parsed.v !== CONSENT_VERSION) return null;
    const c = parsed.choices;
    if (
      !c ||
      typeof c.functional !== "boolean" ||
      typeof c.analytics !== "boolean" ||
      typeof c.marketing !== "boolean"
    ) {
      return null;
    }
    return {
      v: CONSENT_VERSION,
      ts: typeof parsed.ts === "string" ? parsed.ts : "",
      choices: { functional: c.functional, analytics: c.analytics, marketing: c.marketing },
    };
  } catch {
    return null;
  }
}

/** Pure: choices → URL-encoded cookie value. `now` injected for testability. */
export function serializeStoredConsent(choices: ConsentChoices, now: Date): string {
  const value: StoredConsent = { v: CONSENT_VERSION, ts: now.toISOString(), choices };
  return encodeURIComponent(JSON.stringify(value));
}

/** DOM: read the consent cookie. Returns null outside the browser. */
export function readConsentCookie(): StoredConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`),
  );
  return parseStoredConsent(match ? match[1] : null);
}

/**
 * DOM: persist the choice. `Secure` is applied only on HTTPS so the banner
 * remains fully testable on plain-HTTP localhost (a CookieYes pain point).
 */
export function writeConsentCookie(choices: ConsentChoices): StoredConsent {
  const now = new Date();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${serializeStoredConsent(choices, now)}` +
    `; max-age=${CONSENT_TTL_DAYS * 86400}; path=/; SameSite=Lax${secure}`;
  return { v: CONSENT_VERSION, ts: now.toISOString(), choices };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --import tsx --test src/lib/cookie-consent/core/consent-storage.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Register the test file**

In `package.json`, append to the `test` script (single line, before the closing quote):
` src/lib/cookie-consent/core/consent-storage.test.ts`

Run: `npm test` — all suites pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/cookie-consent/core/consent-storage.ts src/lib/cookie-consent/core/consent-storage.test.ts package.json
git commit -m "feat(consent): versioned first-party consent cookie storage"
```

---

### Task 3: `core/consent-mode.ts` (TDD)

**Files:**
- Create: `src/lib/cookie-consent/core/consent-mode.test.ts`
- Create: `src/lib/cookie-consent/core/consent-mode.ts`
- Modify: `package.json:10` (append test file)

- [ ] **Step 1: Write the failing tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { choicesToGcm } from "./consent-mode";

test("all rejected → every signal denied except security_storage", () => {
  assert.deepEqual(choicesToGcm({ functional: false, analytics: false, marketing: false }), {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });
});

test("marketing alone grants exactly the three ad signals", () => {
  const s = choicesToGcm({ functional: false, analytics: false, marketing: true });
  assert.equal(s.ad_storage, "granted");
  assert.equal(s.ad_user_data, "granted");
  assert.equal(s.ad_personalization, "granted");
  assert.equal(s.analytics_storage, "denied");
  assert.equal(s.functionality_storage, "denied");
});

test("analytics alone grants exactly analytics_storage", () => {
  const s = choicesToGcm({ functional: false, analytics: true, marketing: false });
  assert.equal(s.analytics_storage, "granted");
  assert.equal(s.ad_storage, "denied");
});

test("functional grants functionality + personalization storage", () => {
  const s = choicesToGcm({ functional: true, analytics: false, marketing: false });
  assert.equal(s.functionality_storage, "granted");
  assert.equal(s.personalization_storage, "granted");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --import tsx --test src/lib/cookie-consent/core/consent-mode.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `consent-mode.ts`**

```ts
import { CATEGORY_GCM_SIGNALS, CONSENT_UPDATE_EVENT } from "../config";
import type { ConsentChoices, GcmSignal, GcmState, TogglableCategory } from "../types";

/** Pure: category choices → full GCM v2 signal map. */
export function choicesToGcm(choices: ConsentChoices): GcmState {
  const state: GcmState = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  };
  for (const [category, signals] of Object.entries(CATEGORY_GCM_SIGNALS) as Array<
    [TogglableCategory, GcmSignal[]]
  >) {
    if (choices[category]) {
      for (const signal of signals) state[signal] = "granted";
    }
  }
  return state;
}

type WindowWithDataLayer = Window & { dataLayer?: unknown[] };

/**
 * Push the visitor's choice to GTM. The consent API only recognises
 * `arguments` objects (what gtag.js pushes) — a plain array is silently
 * ignored, hence the `function` + cast dance. Also emits a named event so
 * GTM custom-event triggers can react to consent changes.
 */
export function pushConsentUpdate(choices: ConsentChoices): void {
  const w = window as unknown as WindowWithDataLayer;
  const dl = (w.dataLayer = w.dataLayer ?? []);
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dl.push(arguments);
  }
  (gtag as unknown as (...args: unknown[]) => void)("consent", "update", choicesToGcm(choices));
  dl.push({ event: CONSENT_UPDATE_EVENT, consent: choices });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --import tsx --test src/lib/cookie-consent/core/consent-mode.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Register test file in `package.json`, run `npm test`, commit**

```bash
git add src/lib/cookie-consent/core/consent-mode.ts src/lib/cookie-consent/core/consent-mode.test.ts package.json
git commit -m "feat(consent): choices→GCM mapping and dataLayer consent update"
```

---

### Task 4: `core/bootstrap-script.ts` (TDD)

The inline script that must run **before GTM**. Generated from `CATEGORY_GCM_SIGNALS` so the mapping has a single source of truth, and returned as a string so its shape is unit-testable.

**Files:**
- Create: `src/lib/cookie-consent/core/bootstrap-script.test.ts`
- Create: `src/lib/cookie-consent/core/bootstrap-script.ts`
- Modify: `package.json:10` (append test file)

- [ ] **Step 1: Write the failing tests**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { buildBootstrapScript } from "./bootstrap-script";
import { CONSENT_COOKIE, CONSENT_VERSION } from "../config";

const script = buildBootstrapScript();

test("pushes default=denied for all ad/analytics signals with wait_for_update", () => {
  assert.match(script, /"consent","default"/);
  for (const signal of [
    "ad_storage",
    "ad_user_data",
    "ad_personalization",
    "analytics_storage",
    "functionality_storage",
    "personalization_storage",
  ]) {
    assert.match(script, new RegExp(`${signal}:"denied"`));
  }
  assert.match(script, /security_storage:"granted"/);
  assert.match(script, /wait_for_update:2000/);
});

test("default comes before the stored-consent re-apply", () => {
  assert.ok(script.indexOf('"consent","default"') < script.indexOf('"consent","update"'));
});

test("re-apply reads the configured cookie and checks the current version", () => {
  assert.ok(script.includes(CONSENT_COOKIE));
  assert.ok(script.includes(`s.v!==${CONSENT_VERSION}`));
});

test("re-apply maps every configured signal from its category", () => {
  assert.match(script, /ad_storage:g\(c\.marketing\)/);
  assert.match(script, /analytics_storage:g\(c\.analytics\)/);
  assert.match(script, /functionality_storage:g\(c\.functional\)/);
});

test("sets ads_data_redaction and url_passthrough", () => {
  assert.match(script, /"set","ads_data_redaction",true/);
  assert.match(script, /"set","url_passthrough",true/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --import tsx --test src/lib/cookie-consent/core/bootstrap-script.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `bootstrap-script.ts`**

```ts
import { CATEGORY_GCM_SIGNALS, CONSENT_COOKIE, CONSENT_VERSION } from "../config";
import type { GcmSignal, TogglableCategory } from "../types";

/**
 * Vanilla-JS bootstrap that MUST execute before GTM:
 *
 * 1. Pushes GCM v2 `default = denied` (all storage except security) so
 *    GA4/Pixel tags inside GTM stay gated for first-time visitors.
 * 2. Synchronously re-applies a returning visitor's stored choice, so GTM
 *    boots with the correct state without waiting for React hydration.
 *
 * Returned as a string (rendered via dangerouslySetInnerHTML) so unit tests
 * can assert its shape. The category→signal mapping is generated from
 * CATEGORY_GCM_SIGNALS — one source of truth with consent-mode.ts.
 */
export function buildBootstrapScript(): string {
  const updateEntries = (
    Object.entries(CATEGORY_GCM_SIGNALS) as Array<[TogglableCategory, GcmSignal[]]>
  )
    .flatMap(([category, signals]) => signals.map((s) => `${s}:g(c.${category})`))
    .join(",");

  return (
    `window.dataLayer=window.dataLayer||[];` +
    `function gtag(){dataLayer.push(arguments);}` +
    `gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied",functionality_storage:"denied",personalization_storage:"denied",security_storage:"granted",wait_for_update:2000});` +
    `gtag("set","ads_data_redaction",true);` +
    `gtag("set","url_passthrough",true);` +
    `(function(){try{` +
    `var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);if(!m)return;` +
    `var s=JSON.parse(decodeURIComponent(m[1]));` +
    `if(!s||s.v!==${CONSENT_VERSION}||!s.choices)return;` +
    `var c=s.choices,g=function(b){return b?"granted":"denied"};` +
    `gtag("consent","update",{${updateEntries},security_storage:"granted"});` +
    `}catch(e){}})();`
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --import tsx --test src/lib/cookie-consent/core/bootstrap-script.test.ts`
Expected: 5 passing.

- [ ] **Step 5: Register test file, run `npm test`, commit**

```bash
git add src/lib/cookie-consent/core/bootstrap-script.ts src/lib/cookie-consent/core/bootstrap-script.test.ts package.json
git commit -m "feat(consent): generated inline GCM bootstrap script"
```

---

### Task 5: Locales — `locales/{index,uk/consent,en/consent}.ts`

Per-locale folders as agreed; en-GB spellings on the EN side (site is being British-localised).

**Files:**
- Create: `src/lib/cookie-consent/locales/en/consent.ts`
- Create: `src/lib/cookie-consent/locales/uk/consent.ts`
- Create: `src/lib/cookie-consent/locales/index.ts`

- [ ] **Step 1: Create `locales/en/consent.ts` (defines the shape)**

```ts
export const consentCopyEn = {
  banner: {
    title: "We value your privacy",
    body: "We use cookies for analytics and marketing to improve the site. Necessary cookies are always on. See our",
    policyLinkLabel: "Cookie Policy",
    accept: "Accept all",
    reject: "Reject all",
    customise: "Customise",
  },
  preferences: {
    title: "Cookie preferences",
    sub: "Choose which cookies we may use. You can change this any time via “Cookie settings” in the footer.",
    save: "Save choices",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    close: "Close",
    alwaysOn: "Always on",
    categories: {
      necessary: {
        label: "Necessary",
        description:
          "Required for the site to work: remembering this consent choice and keeping the site secure. Cannot be switched off.",
      },
      functional: {
        label: "Functional",
        description: "Remember your preferences, such as interface personalisation.",
      },
      analytics: {
        label: "Analytics",
        description:
          "Google Analytics — anonymous visit statistics that help us improve the site.",
      },
      marketing: {
        label: "Marketing",
        description:
          "Advertising and remarketing (Google Ads, Meta Pixel) — measure campaign performance.",
      },
    },
  },
  settingsLink: "Cookie settings",
} as const;

export type ConsentCopy = {
  banner: {
    title: string;
    body: string;
    policyLinkLabel: string;
    accept: string;
    reject: string;
    customise: string;
  };
  preferences: {
    title: string;
    sub: string;
    save: string;
    acceptAll: string;
    rejectAll: string;
    close: string;
    alwaysOn: string;
    categories: Record<
      "necessary" | "functional" | "analytics" | "marketing",
      { label: string; description: string }
    >;
  };
  settingsLink: string;
};
```

- [ ] **Step 2: Create `locales/uk/consent.ts`**

```ts
import type { ConsentCopy } from "../en/consent";

export const consentCopyUk: ConsentCopy = {
  banner: {
    title: "Ми поважаємо вашу приватність",
    body: "Використовуємо cookies для аналітики та маркетингу, щоб покращувати сайт. Необхідні cookies працюють завжди. Деталі — у",
    policyLinkLabel: "Політиці cookies",
    accept: "Прийняти всі",
    reject: "Відхилити всі",
    customise: "Налаштувати",
  },
  preferences: {
    title: "Налаштування cookies",
    sub: "Оберіть, які cookies ми можемо використовувати. Змінити вибір можна будь-коли через «Налаштування cookies» у футері.",
    save: "Зберегти вибір",
    acceptAll: "Прийняти всі",
    rejectAll: "Відхилити всі",
    close: "Закрити",
    alwaysOn: "Завжди увімкнено",
    categories: {
      necessary: {
        label: "Необхідні",
        description:
          "Потрібні для роботи сайту: зберігають ваш вибір щодо cookies і забезпечують безпеку. Вимкнути неможливо.",
      },
      functional: {
        label: "Функціональні",
        description: "Запам'ятовують ваші налаштування, як-от персоналізацію інтерфейсу.",
      },
      analytics: {
        label: "Аналітичні",
        description:
          "Google Analytics — анонімна статистика відвідувань, що допомагає покращувати сайт.",
      },
      marketing: {
        label: "Маркетингові",
        description:
          "Реклама та ремаркетинг (Google Ads, Meta Pixel) — вимірюють ефективність кампаній.",
      },
    },
  },
  settingsLink: "Налаштування cookies",
};
```

- [ ] **Step 3: Create `locales/index.ts`**

```ts
import { consentCopyEn, type ConsentCopy } from "./en/consent";
import { consentCopyUk } from "./uk/consent";

export type { ConsentCopy };

/** Locale → copy, English fallback for unknown locales. */
export function getConsentCopy(locale: string): ConsentCopy {
  return locale === "uk" ? consentCopyUk : consentCopyEn;
}
```

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck` — clean.

```bash
git add src/lib/cookie-consent/locales
git commit -m "feat(consent): uk/en locale dictionaries"
```

---

### Task 6: Styles — `styles/classes.ts` + `styles/consent.module.css`

Repo pattern: Tailwind class-string constants (see `hp-footer.tsx`). Design tokens from `globals.css`: `bg-bg-raised`, `border-line`, `text-ink`, `text-ink-dim`, `bg-accent`, `font-sans`, `font-mono`.

**Files:**
- Create: `src/lib/cookie-consent/styles/consent.module.css`
- Create: `src/lib/cookie-consent/styles/classes.ts`

- [ ] **Step 1: Create `consent.module.css`**

```css
/* Entry animations only — layout/colors are Tailwind classes in classes.ts. */
.bannerIn {
  animation: consent-slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.dialogIn {
  animation: consent-fade-scale 0.25s ease-out both;
}

@keyframes consent-slide-up {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes consent-fade-scale {
  from { transform: scale(0.97); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bannerIn, .dialogIn { animation: none; }
}
```

- [ ] **Step 2: Create `classes.ts`**

```ts
/**
 * Tailwind class-string constants (project convention — see hp-footer.tsx).
 * Colors come from the app's design tokens; when reusing the module in
 * another project, remap these to that project's tokens.
 */

export const bannerClass =
  "fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-bg-raised/95 backdrop-blur-md px-6 sm:px-8 lg:px-12 py-5";

export const bannerInnerClass =
  "mx-auto max-w-container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between";

export const bannerTitleClass = "font-sans text-[15px] font-bold text-ink";

export const bannerBodyClass =
  "mt-1 font-sans text-[13.5px] leading-[1.55] text-ink-dim max-w-[720px] [&_a]:text-accent-soft [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ink";

export const bannerActionsClass = "flex flex-wrap items-center gap-3 shrink-0";

/* Buttons: Accept and Reject share size and weight — GDPR requires rejecting
   to be as easy and as prominent as accepting. */
export const buttonBaseClass =
  "inline-flex h-11 items-center justify-center rounded-full px-5 font-sans text-[13.5px] font-semibold transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft";

export const buttonPrimaryClass =
  "bg-accent text-white hover:bg-accent-soft";

export const buttonSecondaryClass =
  "border border-line-strong bg-[oklch(1_0_0/0.04)] text-ink hover:bg-[oklch(1_0_0/0.09)]";

export const buttonGhostClass =
  "text-ink-dim hover:text-ink underline underline-offset-4 decoration-line-strong px-2";

export const overlayClass =
  "fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-[oklch(0.06_0.005_300/0.6)] backdrop-blur-[6px] p-0 sm:p-6";

export const dialogClass =
  "w-full sm:max-w-[560px] max-h-[85vh] overflow-y-auto rounded-t-[22px] sm:rounded-[22px] border border-line bg-[oklch(0.13_0.005_300)] text-ink p-6 sm:p-7";

export const dialogTitleClass =
  "font-sans text-[22px] font-bold tracking-[-0.01em] text-ink";

export const dialogSubClass = "mt-1 text-[13.5px] leading-[1.5] text-ink-dim";

export const categoryRowClass =
  "flex items-start justify-between gap-4 border-t border-line py-4 first:border-t-0";

export const categoryLabelClass = "font-sans text-[14.5px] font-semibold text-ink";

export const categoryDescClass = "mt-0.5 text-[13px] leading-[1.5] text-ink-dim";

export const alwaysOnClass =
  "font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3 whitespace-nowrap pt-1";

export const dialogFooterClass =
  "mt-5 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5";

export const switchTrackClass =
  "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft aria-checked:bg-accent bg-[oklch(1_0_0/0.14)] disabled:cursor-not-allowed disabled:opacity-60";

export const switchThumbClass =
  "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200";

export const switchThumbCheckedClass = "translate-x-5";

export const settingsLinkClass =
  "inline-flex items-center h-5 font-sans text-[13px] text-ink-dim no-underline transition-colors duration-200 hover:text-ink cursor-pointer bg-transparent border-0 p-0";
```

- [ ] **Step 3: Typecheck + commit**

```bash
git add src/lib/cookie-consent/styles
git commit -m "feat(consent): banner/dialog style constants and keyframes"
```

---

### Task 7: Primitives — button, switch, focus trap, dialog

Custom components, no HeroUI (per spec).

**Files:**
- Create: `src/lib/cookie-consent/hooks/use-focus-trap.ts`
- Create: `src/lib/cookie-consent/components/primitives/consent-button.tsx`
- Create: `src/lib/cookie-consent/components/primitives/consent-switch.tsx`
- Create: `src/lib/cookie-consent/components/primitives/consent-dialog.tsx`

- [ ] **Step 1: Create `hooks/use-focus-trap.ts`**

```ts
"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), [role="switch"]:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab focus inside the returned ref while `active`; Escape calls
 * `onEscape`; focus is moved to the first focusable on activate and
 * restored to the previously focused element on deactivate.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onEscape: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, onEscape]);

  return ref;
}
```

- [ ] **Step 2: Create `primitives/consent-button.tsx`**

```tsx
"use client";

import type { ButtonHTMLAttributes } from "react";
import {
  buttonBaseClass,
  buttonGhostClass,
  buttonPrimaryClass,
  buttonSecondaryClass,
} from "../../styles/classes";

const VARIANT_CLASS = {
  primary: buttonPrimaryClass,
  secondary: buttonSecondaryClass,
  ghost: buttonGhostClass,
} as const;

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANT_CLASS;
};

export function ConsentButton({ variant = "secondary", className, ...rest }: Props) {
  return (
    <button
      type="button"
      className={`${buttonBaseClass} ${VARIANT_CLASS[variant]}${className ? ` ${className}` : ""}`}
      {...rest}
    />
  );
}
```

- [ ] **Step 3: Create `primitives/consent-switch.tsx`**

```tsx
"use client";

import {
  switchThumbCheckedClass,
  switchThumbClass,
  switchTrackClass,
} from "../../styles/classes";

type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  /** id of the visible label element. */
  labelledBy: string;
};

export function ConsentSwitch({ checked, onChange, disabled, labelledBy }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={switchTrackClass}
    >
      <span
        aria-hidden="true"
        className={`${switchThumbClass}${checked ? ` ${switchThumbCheckedClass}` : ""}`}
      />
    </button>
  );
}
```

- [ ] **Step 4: Create `primitives/consent-dialog.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { useFocusTrap } from "../../hooks/use-focus-trap";
import { dialogClass, overlayClass } from "../../styles/classes";
import styles from "../../styles/consent.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  /** id of the dialog title element. */
  labelledBy: string;
  children: ReactNode;
};

export function ConsentDialog({ open, onClose, labelledBy, children }: Props) {
  const trapRef = useFocusTrap<HTMLDivElement>(open, onClose);
  if (!open) return null;
  return (
    <div
      className={overlayClass}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`${dialogClass} ${styles.dialogIn}`}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Typecheck + commit**

```bash
git add src/lib/cookie-consent/hooks/use-focus-trap.ts src/lib/cookie-consent/components/primitives
git commit -m "feat(consent): custom button/switch/dialog primitives with focus trap"
```

---

### Task 8: Provider, context hook, gate

**Files:**
- Create: `src/lib/cookie-consent/components/consent-provider.tsx`
- Create: `src/lib/cookie-consent/hooks/use-consent.ts`
- Create: `src/lib/cookie-consent/components/consent-gate.tsx`

- [ ] **Step 1: Create `consent-provider.tsx`**

Note: the banner/preferences components are created in Task 9 — this file imports them, so **typecheck only passes after Task 9**. Work on a branch commit or implement Tasks 8+9 back-to-back.

```tsx
"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ALL_DENIED, ALL_GRANTED } from "../config";
import { readConsentCookie, writeConsentCookie } from "../core/consent-storage";
import { pushConsentUpdate } from "../core/consent-mode";
import { getConsentCopy, type ConsentCopy } from "../locales";
import type { ConsentCategory, ConsentChoices, StoredConsent } from "../types";
import { ConsentBanner } from "./consent-banner";
import { ConsentPreferences } from "./consent-preferences";

export type ConsentContextValue = {
  /** null = no valid stored consent (first visit, expired, or version bump). */
  consent: StoredConsent | null;
  /** True for "necessary" always; otherwise the stored choice (false when unset). */
  isGranted: (category: ConsentCategory) => boolean;
  openPreferences: () => void;
  copy: ConsentCopy;
  locale: string;
};

export const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const [consent, setConsent] = useState<StoredConsent | null>(null);
  // Nothing renders until the cookie is read on the client — avoids any
  // SSR/hydration mismatch and any banner flash for consented visitors.
  const [ready, setReady] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    setConsent(readConsentCookie());
    setReady(true);
  }, []);

  const decide = useCallback((choices: ConsentChoices) => {
    const stored = writeConsentCookie(choices);
    pushConsentUpdate(choices);
    setConsent(stored);
    setPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => decide(ALL_GRANTED), [decide]);
  const rejectAll = useCallback(() => decide(ALL_DENIED), [decide]);
  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const copy = useMemo(() => getConsentCopy(locale), [locale]);

  const isGranted = useCallback(
    (category: ConsentCategory) =>
      category === "necessary" ? true : (consent?.choices[category] ?? false),
    [consent],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({ consent, isGranted, openPreferences, copy, locale }),
    [consent, isGranted, openPreferences, copy, locale],
  );

  const showBanner = ready && consent === null && !preferencesOpen;

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {showBanner && (
        <ConsentBanner
          copy={copy}
          locale={locale}
          onAcceptAll={acceptAll}
          onRejectAll={rejectAll}
          onCustomise={openPreferences}
        />
      )}
      <ConsentPreferences
        open={preferencesOpen}
        copy={copy}
        locale={locale}
        initialChoices={consent?.choices ?? ALL_DENIED}
        onSave={decide}
        onAcceptAll={acceptAll}
        onRejectAll={rejectAll}
        onClose={closePreferences}
      />
    </ConsentContext.Provider>
  );
}
```

- [ ] **Step 2: Create `hooks/use-consent.ts`**

```ts
"use client";

import { useContext } from "react";
import { ConsentContext, type ConsentContextValue } from "../components/consent-provider";

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
```

- [ ] **Step 3: Create `consent-gate.tsx`**

```tsx
"use client";

import type { ReactNode } from "react";
import { useConsent } from "../hooks/use-consent";
import type { TogglableCategory } from "../types";

/**
 * Renders children only after the visitor granted the category — the hook
 * for any future non-GTM script (chat widget, Calendly embed, …):
 *
 *   <ConsentGate category="functional"><CalendlyEmbed /></ConsentGate>
 */
export function ConsentGate({
  category,
  children,
}: {
  category: TogglableCategory;
  children: ReactNode;
}) {
  const { isGranted } = useConsent();
  return isGranted(category) ? <>{children}</> : null;
}
```

- [ ] **Step 4: Commit (typecheck deferred to Task 9 — provider imports Task-9 files)**

```bash
git add src/lib/cookie-consent/components/consent-provider.tsx src/lib/cookie-consent/hooks/use-consent.ts src/lib/cookie-consent/components/consent-gate.tsx
git commit -m "feat(consent): provider state machine, useConsent hook, ConsentGate"
```

---

### Task 9: Banner, preferences, settings link, bootstrap component, barrel, README

**Files:**
- Create: `src/lib/cookie-consent/components/consent-banner.tsx`
- Create: `src/lib/cookie-consent/components/consent-preferences.tsx`
- Create: `src/lib/cookie-consent/components/cookie-settings-link.tsx`
- Create: `src/lib/cookie-consent/components/consent-bootstrap.tsx`
- Create: `src/lib/cookie-consent/index.ts`
- Create: `src/lib/cookie-consent/README.md`

- [ ] **Step 1: Create `consent-banner.tsx`**

```tsx
"use client";

import Link from "next/link";
import { consentPolicyPath } from "../config";
import type { ConsentCopy } from "../locales";
import {
  bannerActionsClass,
  bannerBodyClass,
  bannerClass,
  bannerInnerClass,
  bannerTitleClass,
} from "../styles/classes";
import styles from "../styles/consent.module.css";
import { ConsentButton } from "./primitives/consent-button";

type Props = {
  copy: ConsentCopy;
  locale: string;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomise: () => void;
};

export function ConsentBanner({ copy, locale, onAcceptAll, onRejectAll, onCustomise }: Props) {
  return (
    <section
      className={`${bannerClass} ${styles.bannerIn}`}
      role="region"
      aria-label={copy.banner.title}
    >
      <div className={bannerInnerClass}>
        <div>
          <p className={bannerTitleClass}>{copy.banner.title}</p>
          <p className={bannerBodyClass}>
            {copy.banner.body}{" "}
            <Link href={consentPolicyPath(locale)}>{copy.banner.policyLinkLabel}</Link>.
          </p>
        </div>
        <div className={bannerActionsClass}>
          <ConsentButton variant="ghost" onClick={onCustomise}>
            {copy.banner.customise}
          </ConsentButton>
          <ConsentButton variant="secondary" onClick={onRejectAll}>
            {copy.banner.reject}
          </ConsentButton>
          <ConsentButton variant="primary" onClick={onAcceptAll}>
            {copy.banner.accept}
          </ConsentButton>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `consent-preferences.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { ConsentCopy } from "../locales";
import type { ConsentChoices, TogglableCategory } from "../types";
import {
  alwaysOnClass,
  categoryDescClass,
  categoryLabelClass,
  categoryRowClass,
  dialogFooterClass,
  dialogSubClass,
  dialogTitleClass,
} from "../styles/classes";
import { ConsentButton } from "./primitives/consent-button";
import { ConsentDialog } from "./primitives/consent-dialog";
import { ConsentSwitch } from "./primitives/consent-switch";

const TOGGLABLE: TogglableCategory[] = ["functional", "analytics", "marketing"];

type Props = {
  open: boolean;
  copy: ConsentCopy;
  locale: string;
  initialChoices: ConsentChoices;
  onSave: (choices: ConsentChoices) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
};

export function ConsentPreferences({
  open,
  copy,
  initialChoices,
  onSave,
  onAcceptAll,
  onRejectAll,
  onClose,
}: Props) {
  const [choices, setChoices] = useState<ConsentChoices>(initialChoices);

  // Re-sync draft state each time the dialog opens.
  useEffect(() => {
    if (open) setChoices(initialChoices);
  }, [open, initialChoices]);

  return (
    <ConsentDialog open={open} onClose={onClose} labelledBy="consent-prefs-title">
      <h2 id="consent-prefs-title" className={dialogTitleClass}>
        {copy.preferences.title}
      </h2>
      <p className={dialogSubClass}>{copy.preferences.sub}</p>

      <div className="mt-5">
        <div className={categoryRowClass}>
          <div>
            <p id="consent-cat-necessary" className={categoryLabelClass}>
              {copy.preferences.categories.necessary.label}
            </p>
            <p className={categoryDescClass}>
              {copy.preferences.categories.necessary.description}
            </p>
          </div>
          <span className={alwaysOnClass}>{copy.preferences.alwaysOn}</span>
        </div>

        {TOGGLABLE.map((category) => (
          <div key={category} className={categoryRowClass}>
            <div>
              <p id={`consent-cat-${category}`} className={categoryLabelClass}>
                {copy.preferences.categories[category].label}
              </p>
              <p className={categoryDescClass}>
                {copy.preferences.categories[category].description}
              </p>
            </div>
            <ConsentSwitch
              checked={choices[category]}
              labelledBy={`consent-cat-${category}`}
              onChange={(next) => setChoices((prev) => ({ ...prev, [category]: next }))}
            />
          </div>
        ))}
      </div>

      <div className={dialogFooterClass}>
        <ConsentButton variant="ghost" onClick={onRejectAll}>
          {copy.preferences.rejectAll}
        </ConsentButton>
        <ConsentButton variant="secondary" onClick={onAcceptAll}>
          {copy.preferences.acceptAll}
        </ConsentButton>
        <ConsentButton variant="primary" onClick={() => onSave(choices)}>
          {copy.preferences.save}
        </ConsentButton>
      </div>
    </ConsentDialog>
  );
}
```

- [ ] **Step 3: Create `cookie-settings-link.tsx`**

```tsx
"use client";

import { useConsent } from "../hooks/use-consent";
import { settingsLinkClass } from "../styles/classes";

/** Footer trigger that reopens the preferences dialog (GDPR: consent must be
 *  as easy to withdraw as it was to give). */
export function CookieSettingsLink() {
  const { openPreferences, copy } = useConsent();
  return (
    <button type="button" className={settingsLinkClass} onClick={openPreferences}>
      {copy.settingsLink}
    </button>
  );
}
```

- [ ] **Step 4: Create `consent-bootstrap.tsx`**

```tsx
import { buildBootstrapScript } from "../core/bootstrap-script";

/**
 * Inline GCM v2 bootstrap — MUST render before <GoogleTagManager /> in the
 * root layouts. Server component; a single inline script guarantees the
 * default-denied push executes before GTM regardless of script hoisting
 * (React 19 moves async scripts into <head>).
 */
export function ConsentBootstrap() {
  return (
    <script
      id="consent-gcm"
      dangerouslySetInnerHTML={{ __html: buildBootstrapScript() }}
    />
  );
}
```

- [ ] **Step 5: Create `index.ts` (public API)**

```ts
export { ConsentBootstrap } from "./components/consent-bootstrap";
export { ConsentProvider } from "./components/consent-provider";
export { ConsentGate } from "./components/consent-gate";
export { CookieSettingsLink } from "./components/cookie-settings-link";
export { useConsent } from "./hooks/use-consent";
export { consentPolicyPath, CONSENT_COOKIE, CONSENT_VERSION } from "./config";
export type { ConsentCategory, ConsentChoices, StoredConsent, TogglableCategory } from "./types";
```

- [ ] **Step 6: Create module `README.md`**

```markdown
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
```

- [ ] **Step 7: Typecheck + lint + run all unit tests**

Run: `npm run typecheck && npm run lint && npm test`
Expected: all clean (Task 8's provider now resolves its imports).

- [ ] **Step 8: Commit**

```bash
git add src/lib/cookie-consent
git commit -m "feat(consent): banner, preferences dialog, settings link, bootstrap, public API"
```

---

### Task 10: Wire into the app — replace CookieYes

**Files:**
- Modify: `src/app/(uk)/layout.tsx` (import at line ~15, body at line ~115)
- Modify: `src/app/(en)/layout.tsx` (same pattern)
- Modify: `src/app/providers.tsx`
- Delete: `src/components/analytics/cookie-yes.tsx`
- Modify: `src/constants/site.ts` (remove `COOKIEYES_ID` block)

- [ ] **Step 1: Both layouts — swap the import**

Replace:
```tsx
import { CookieYes } from "@/components/analytics/cookie-yes";
```
with:
```tsx
import { ConsentBootstrap } from "@/lib/cookie-consent";
```

- [ ] **Step 2: Both layouts — swap the body element**

Replace:
```tsx
        <CookieYes />
        <GoogleTagManager />
```
with:
```tsx
        <ConsentBootstrap />
        <GoogleTagManager />
```

- [ ] **Step 3: `providers.tsx` — mount the provider (inside NextIntl context, so `useLocale` works)**

```tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { LeadModalProvider } from "@/components/blocks/lead-modal";
import { ConsentProvider } from "@/lib/cookie-consent";

export function Providers({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <HeroUIProvider>
        <PageViewTracker />
        <ConsentProvider locale={locale}>
          <LeadModalProvider>{children}</LeadModalProvider>
        </ConsentProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}
```

- [ ] **Step 4: Delete CookieYes remnants**

```bash
git rm src/components/analytics/cookie-yes.tsx
```
In `src/constants/site.ts` delete the whole `COOKIEYES_ID` block (constant + its doc comment). `GTM_ID` stays.

- [ ] **Step 5: Verify**

Run: `npm run typecheck && npm run lint && npm test` — clean.
Run: `grep -ri cookieyes src/ --include='*.ts*'` — no hits.

- [ ] **Step 6: Commit**

```bash
git add -A src/app src/constants/site.ts
git commit -m "feat(consent): replace CookieYes with in-house consent module"
```

---

### Task 11: Footer — cookie settings link + /cookies nav link

**Files:**
- Modify: `src/components/layout/hp-footer.tsx` (LEGAL_HREFS ~line 82; legal column render ~line 218)
- Modify: `messages/uk.json`, `messages/en.json` (`Footer.legal` namespace)

- [ ] **Step 1: Add the policy page to `LEGAL_HREFS`**

```ts
const LEGAL_HREFS: Array<{ key: string; href: string }> = [
  { key: "privacy", href: "/policy" },
  { key: "cookies", href: "/cookies" },
  { key: "terms", href: "/offer" },
  { key: "publicContract", href: "/public-contract" },
  { key: "legalData", href: "/legal" },
];
```

- [ ] **Step 2: Add messages**

`messages/uk.json` → `Footer.legal`: `"cookies": "Політика cookies"`
`messages/en.json` → `Footer.legal`: `"cookies": "Cookie Policy"`

- [ ] **Step 3: Render the settings trigger in the legal column**

Import at top of `hp-footer.tsx`:
```tsx
import { CookieSettingsLink } from "@/lib/cookie-consent";
```
In the legal column `<ul>` (after the mapped `LEGAL_HREFS` items):
```tsx
          <ul className={footerColListClass}>
            {LEGAL_HREFS.map(({ key, href }) => (
              <li key={key}>
                <Link href={href}>{tLeg(key)}</Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
```

Note: legal hrefs are locale-agnostic in this footer (existing behavior); `/cookies` follows suit — the (uk) route renders Ukrainian, and EN visitors get the `/en/cookies` link from the banner itself. If footer locale-awareness is wanted later, wrap with `localizePath` like the company column.

- [ ] **Step 4: Typecheck + commit**

```bash
git add src/components/layout/hp-footer.tsx messages/uk.json messages/en.json
git commit -m "feat(consent): footer cookie-settings trigger and policy link"
```

---

### Task 12: Cookie policy pages (separate concern)

**Files:**
- Create: `src/content/uk/cookie-policy.ts`
- Create: `src/content/en/cookie-policy.ts`
- Create: `src/components/legal/cookie-policy.tsx`
- Create: `src/app/(uk)/cookies/page.tsx`
- Create: `src/app/(en)/en/cookies/page.tsx`

- [ ] **Step 1: Create `src/content/en/cookie-policy.ts` (defines shape + the cookie inventory)**

```ts
export type CookieRow = { name: string; provider: string; purpose: string; ttl: string };
export type CookiePolicySection = { heading: string; rows: CookieRow[] };

export type CookiePolicyCopy = {
  eyebrow: string;
  title: string;
  sub: string;
  intro: string;
  manage: string;
  updated: string;
  tableHead: { name: string; provider: string; purpose: string; ttl: string };
  sections: CookiePolicySection[];
};

export const cookiePolicyEn: CookiePolicyCopy = {
  eyebrow: "/ LEGAL",
  title: "Cookie Policy",
  sub: "Which cookies code-site.art uses, why, and how to change your choice.",
  intro:
    "Cookies are small text files stored in your browser. We only set analytics and marketing cookies after you allow them via the consent banner (Google Consent Mode v2). Your choice is kept for 12 months and can be changed at any time.",
  manage:
    "To change or withdraw consent, use “Cookie settings” in the site footer — the preferences window reopens instantly.",
  updated: "Last updated: 2 July 2026",
  tableHead: { name: "Cookie", provider: "Provider", purpose: "Purpose", ttl: "Duration" },
  sections: [
    {
      heading: "Necessary — always on",
      rows: [
        {
          name: "cs-consent",
          provider: "code-site.art (first-party)",
          purpose: "Stores your cookie consent choice.",
          ttl: "12 months",
        },
      ],
    },
    {
      heading: "Analytics — only with your consent",
      rows: [
        {
          name: "_ga",
          provider: "Google Analytics 4",
          purpose: "Distinguishes visitors for anonymous usage statistics.",
          ttl: "2 years",
        },
        {
          name: "_ga_*",
          provider: "Google Analytics 4",
          purpose: "Keeps session state for usage statistics.",
          ttl: "2 years",
        },
      ],
    },
    {
      heading: "Marketing — only with your consent",
      rows: [
        {
          name: "_gcl_au",
          provider: "Google Ads",
          purpose: "Measures ad-campaign conversions.",
          ttl: "3 months",
        },
        {
          name: "_fbp",
          provider: "Meta Pixel",
          purpose: "Measures ad performance and enables remarketing.",
          ttl: "3 months",
        },
      ],
    },
  ],
};
```

- [ ] **Step 2: Create `src/content/uk/cookie-policy.ts`**

```ts
import type { CookiePolicyCopy } from "../en/cookie-policy";

export const cookiePolicyUk: CookiePolicyCopy = {
  eyebrow: "/ LEGAL",
  title: "Політика cookies",
  sub: "Які cookies використовує code-site.art, навіщо та як змінити свій вибір.",
  intro:
    "Cookies — це невеликі текстові файли, які зберігаються у вашому браузері. Аналітичні та маркетингові cookies ми встановлюємо лише після вашої згоди через банер (Google Consent Mode v2). Вибір зберігається 12 місяців, і його можна змінити будь-коли.",
  manage:
    "Щоб змінити або відкликати згоду, натисніть «Налаштування cookies» у футері сайту — вікно налаштувань відкриється одразу.",
  updated: "Оновлено: 2 липня 2026",
  tableHead: { name: "Cookie", provider: "Провайдер", purpose: "Призначення", ttl: "Строк" },
  sections: [
    {
      heading: "Необхідні — працюють завжди",
      rows: [
        {
          name: "cs-consent",
          provider: "code-site.art (first-party)",
          purpose: "Зберігає ваш вибір щодо cookies.",
          ttl: "12 місяців",
        },
      ],
    },
    {
      heading: "Аналітичні — лише за вашою згодою",
      rows: [
        {
          name: "_ga",
          provider: "Google Analytics 4",
          purpose: "Розрізняє відвідувачів для анонімної статистики.",
          ttl: "2 роки",
        },
        {
          name: "_ga_*",
          provider: "Google Analytics 4",
          purpose: "Підтримує стан сесії для статистики.",
          ttl: "2 роки",
        },
      ],
    },
    {
      heading: "Маркетингові — лише за вашою згодою",
      rows: [
        {
          name: "_gcl_au",
          provider: "Google Ads",
          purpose: "Вимірює конверсії рекламних кампаній.",
          ttl: "3 місяці",
        },
        {
          name: "_fbp",
          provider: "Meta Pixel",
          purpose: "Вимірює ефективність реклами та уможливлює ремаркетинг.",
          ttl: "3 місяці",
        },
      ],
    },
  ],
};
```

- [ ] **Step 3: Create `src/components/legal/cookie-policy.tsx`**

Follows the LegalStub page frame (header + hero + footer) but with real content and the settings trigger.

```tsx
import { HpHeader, HpFooter } from "@/components/homepage";
import { PageHero } from "@/components/blocks/page-hero";
import { CookieSettingsLink } from "@/lib/cookie-consent";
import type { CookiePolicyCopy } from "@/content/en/cookie-policy";

const tableClass =
  "w-full mt-4 border-collapse text-[13.5px] leading-[1.5] [&_th]:text-left [&_th]:font-mono [&_th]:text-[10.5px] [&_th]:tracking-[0.14em] [&_th]:uppercase [&_th]:text-ink-3 [&_th]:pb-2 [&_td]:py-2.5 [&_td]:pr-4 [&_td]:border-t [&_td]:border-line [&_td]:text-ink-dim [&_td:first-child]:text-ink [&_td:first-child]:font-mono [&_td:first-child]:text-[12.5px]";

export function CookiePolicy({ copy }: { copy: CookiePolicyCopy }) {
  return (
    <>
      <HpHeader />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} sub={copy.sub} />
      <section className="px-6 sm:px-8 lg:px-12 pb-16">
        <div className="mx-auto max-w-container-narrow">
          <p className="text-[14.5px] leading-[1.65] text-ink-dim">{copy.intro}</p>
          {copy.sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2 className="font-sans text-[18px] font-bold text-ink">{section.heading}</h2>
              <div className="overflow-x-auto">
                <table className={tableClass}>
                  <thead>
                    <tr>
                      <th>{copy.tableHead.name}</th>
                      <th>{copy.tableHead.provider}</th>
                      <th>{copy.tableHead.purpose}</th>
                      <th>{copy.tableHead.ttl}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.provider}</td>
                        <td>{row.purpose}</td>
                        <td>{row.ttl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <p className="mt-10 text-[14.5px] leading-[1.65] text-ink-dim">
            {copy.manage} <CookieSettingsLink />
          </p>
          <p className="mt-6 font-mono text-[11px] text-ink-3">{copy.updated}</p>
        </div>
      </section>
      <HpFooter />
    </>
  );
}
```

Verified: `PageHero` (`src/components/blocks/page-hero/index.tsx`) takes exactly `eyebrow: string`, `title`, `sub: ReactNode`, and `max-w-container-narrow` is a defined utility (`globals.css:179`).

- [ ] **Step 4: Create the two routes**

`src/app/(uk)/cookies/page.tsx`:
```tsx
import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/cookie-policy";
import { cookiePolicyUk } from "@/content/uk/cookie-policy";

export const metadata: Metadata = {
  title: "Політика cookies | Code-Site.Art",
  description:
    "Які cookies використовує code-site.art, навіщо, і як змінити або відкликати згоду.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return <CookiePolicy copy={cookiePolicyUk} />;
}
```

`src/app/(en)/en/cookies/page.tsx`:
```tsx
import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/cookie-policy";
import { cookiePolicyEn } from "@/content/en/cookie-policy";

export const metadata: Metadata = {
  title: "Cookie Policy | Code-Site.Art",
  description:
    "Which cookies code-site.art uses, why, and how to change or withdraw your consent.",
  alternates: { canonical: "/en/cookies" },
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return <CookiePolicy copy={cookiePolicyEn} />;
}
```

- [ ] **Step 5: Verify both pages render**

Run: `npm run typecheck`, then with the dev server up open `http://localhost:3000/cookies` and `http://localhost:3000/en/cookies` (no domain lock anymore — plain localhost works).

- [ ] **Step 6: Commit**

```bash
git add src/content/uk/cookie-policy.ts src/content/en/cookie-policy.ts src/components/legal/cookie-policy.tsx "src/app/(uk)/cookies" "src/app/(en)/en/cookies"
git commit -m "feat(consent): cookie policy pages (uk + en)"
```

---### Task 13: E2E verifier — `tools/consent-verify.mjs`

Permanent replacement for the throwaway Playwright scripts used during the CookieYes rollout. Runs against any base URL (localhost works now).

**Files:**
- Create: `tools/consent-verify.mjs`
- Modify: `package.json` (add `consent:verify` script)

- [ ] **Step 1: Create `tools/consent-verify.mjs`**

```js
/**
 * E2E verification of the cookie-consent module. Requires a running server:
 *   npm run dev   →   npm run consent:verify [baseUrl]
 * Default baseUrl: http://localhost:3000
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const consentEntries = () =>
  (window.dataLayer || [])
    .filter((e) => e[0] === "consent")
    .map((e) => ({ type: `${e[0]}:${e[1]}`, state: e[2] }));

const trackingCookies = () =>
  document.cookie.split(";").map((c) => c.trim()).filter((c) => /^(_ga|_gid|_gcl|_fbp)/.test(c));

const browser = await chromium.launch();

// ---------- Scenario 1: first visit — defaults, banner, reject-all ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const before = await page.evaluate(consentEntries);
  check("GCM default is the first consent entry", before[0]?.type === "consent:default");
  check("default denies analytics_storage", before[0]?.state?.analytics_storage === "denied");
  check("no tracking cookies before consent", (await page.evaluate(trackingCookies)).length === 0);
  check("banner is visible", await page.locator('[role="region"] >> text=/cookies/i').first().isVisible());

  await page.getByRole("button", { name: /reject all|відхилити всі/i }).click();
  await page.waitForTimeout(500);
  const afterReject = await page.evaluate(consentEntries);
  const lastReject = afterReject[afterReject.length - 1];
  check("reject-all pushes update: denied", lastReject?.type === "consent:update" && lastReject?.state?.analytics_storage === "denied");

  await page.reload({ waitUntil: "networkidle" });
  check(
    "choice persists across reload (no banner)",
    (await page.getByRole("button", { name: /reject all|відхилити всі/i }).count()) === 0,
  );
  const reapplied = await page.evaluate(consentEntries);
  check("bootstrap re-applies stored choice before GTM", reapplied.some((e) => e.type === "consent:update"));
  await page.context().close();
}

// ---------- Scenario 2: accept-all grants everything ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /accept all|прийняти всі/i }).click();
  await page.waitForTimeout(500);
  const entries = await page.evaluate(consentEntries);
  const last = entries[entries.length - 1];
  check("accept-all pushes update: granted", last?.state?.ad_storage === "granted" && last?.state?.analytics_storage === "granted");
  const cookie = await page.evaluate(() => document.cookie.includes("cs-consent="));
  check("cs-consent cookie written", cookie);
  await page.context().close();
}

// ---------- Scenario 3: preferences — granular choice ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /customise|налаштувати/i }).click();
  const dialog = page.getByRole("dialog");
  check("preferences dialog opens", await dialog.isVisible());
  await dialog.getByRole("switch").nth(1).click(); // analytics (order: functional, analytics, marketing)
  await dialog.getByRole("button", { name: /save|зберегти/i }).click();
  await page.waitForTimeout(500);
  const entries = await page.evaluate(consentEntries);
  const last = entries[entries.length - 1];
  check("granular save: analytics granted, ads denied", last?.state?.analytics_storage === "granted" && last?.state?.ad_storage === "denied");
  await page.context().close();
}

// ---------- Scenario 4: footer settings link reopens preferences ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /accept all|прийняти всі/i }).click();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("footer").getByRole("button", { name: /cookie|cookies/i }).click();
  check("footer link reopens preferences", await page.getByRole("dialog").isVisible());
  await page.context().close();
}

// ---------- Scenario 5: EN locale copy ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  check("EN banner copy", await page.getByText("We value your privacy").isVisible());
  await page.context().close();
}

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
```

- [ ] **Step 2: Add npm script**

`package.json` scripts: `"consent:verify": "node tools/consent-verify.mjs"`

- [ ] **Step 3: Run it**

Run: `npm run dev` (background) then `npm run consent:verify`
Expected: `ALL CHECKS PASSED`. Fix any failure at its source before proceeding (systematic-debugging skill).

- [ ] **Step 4: Commit**

```bash
git add tools/consent-verify.mjs package.json
git commit -m "test(consent): Playwright e2e verifier for the consent flow"
```

---

### Task 14: Docs, GTM sanity check, close-out

**Files:**
- Modify: `docs/cookie-consent-plan.md` (§0 status)
- Modify: `src/lib/README.md` (document the module exception)
- Modify: `docs/cookie-consent-custom-plan.md` (tick checkboxes)

- [ ] **Step 1: Update `docs/cookie-consent-plan.md` §0**

Append:
```markdown
- **Superseded (date):** CookieYes replaced by the in-house module
  `src/lib/cookie-consent/` (see [cookie-consent-custom-plan.md](cookie-consent-custom-plan.md)).
  CookieYes account can be closed; the `local.code-site.art` hosts alias is no
  longer needed (no domain lock).
```

- [ ] **Step 2: Update `src/lib/README.md`**

Add under Layout:
```markdown
├── cookie-consent/  # self-contained consent module (components + hooks +
                     # locales + styles) — exception to the "pure logic" rule
                     # so the whole folder is copy-paste reusable; see its README
```

- [ ] **Step 3: GTM sanity check (manual, in GTM admin)**

The module keeps pushing the same GCM v2 signals CookieYes did, so tags need no changes **if** they rely on built-in consent checks. Verify in GTM: Admin → Container Settings → “Enable consent overview” → confirm GA4/Pixel tags list `analytics_storage`/`ad_storage` under built-in consent. If any tag used a CookieYes-specific trigger/variable (none expected — script method was used, not their GTM template), retarget it to the `cs_consent_update` event.

- [ ] **Step 4: Full verification sweep**

Run: `npm run typecheck && npm run lint && npm test && npm run build`
Then: `npm run consent:verify` against the dev server, both `/` and `/en` visually via preview (banner styling, dialog, mobile viewport 375px).

- [ ] **Step 5: Commit**

```bash
git add docs/cookie-consent-plan.md docs/cookie-consent-custom-plan.md src/lib/README.md
git commit -m "docs(consent): custom module supersedes CookieYes"
```

**Post-merge notes (outside the repo):**
- Deploy → re-run `node tools/consent-verify.mjs https://www.code-site.art`.
- Close the CookieYes account (optional; script tag is already gone).
- Optionally remove the `127.0.0.1 local.code-site.art` hosts entry.
- Update assistant memory: consent module replaces CookieYes notes.

---

## Compliance checklist (final acceptance)

- [ ] No non-essential cookie/tag before opt-in (verifier scenario 1).
- [ ] Reject as prominent and as easy as Accept (same row, same size).
- [ ] Granular per-category control (scenario 3).
- [ ] Choice persisted 12 months; withdrawal via footer link (scenario 4).
- [ ] Consent record kept (version + ISO timestamp in `cs-consent`).
- [ ] Localized banner + linked cookie policy on both locales.
- [ ] Banner does not block browsing (no cookie wall) and is keyboard-accessible.
- [ ] Re-consent on `CONSENT_VERSION` bump (unit-tested).

## Known trade-offs (accepted in the estimate discussion)

- **No server-side consent log** — the record lives in the visitor's cookie
  only. If wanted later: POST to an API route on `decide()` (+2–4 h).
- **We own regulatory upkeep** — GCM signal changes, new-category needs
  (bump `CONSENT_VERSION` when they land).
- Banner text is bundled per locale in the module (not in `messages/*.json`) —
  deliberate, for module portability.

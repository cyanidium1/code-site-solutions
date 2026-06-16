import test from "node:test";
import assert from "node:assert/strict";

import { resolveLocaleAlternate } from "./i18n-routes";
import { FALLBACK_REGISTRY } from "@/lib/shared/i18n-registry-types";

const reg = FALLBACK_REGISTRY;

test("homepage '/' offers both locales", () => {
  assert.deepEqual(resolveLocaleAlternate("/", reg), { uk: "/", en: "/en" });
});

test("EN homepage '/en' offers both locales", () => {
  assert.deepEqual(resolveLocaleAlternate("/en", reg), { uk: "/", en: "/en" });
});

// Regression: Next prerenders the root route with usePathname() === "/index".
// Before normalization this fell through to the root-match branch, "/index"
// wasn't in EN_LOCALIZED_ROOTS, and EN resolved to null — disabling the
// UA → EN switch on the homepage ("EN version coming soon").
test("prerender index alias '/index' resolves like the homepage", () => {
  assert.deepEqual(resolveLocaleAlternate("/index", reg), { uk: "/", en: "/en" });
});

test("localized top-level root maps to /en twin", () => {
  assert.deepEqual(resolveLocaleAlternate("/pricing", reg), {
    uk: "/pricing",
    en: "/en/pricing",
  });
});

test("UA-only top-level root has no EN twin", () => {
  assert.deepEqual(resolveLocaleAlternate("/stories", reg), {
    uk: "/stories",
    en: null,
  });
});

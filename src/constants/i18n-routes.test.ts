import test from "node:test";
import assert from "node:assert/strict";

import { localizePath, resolveLocaleAlternate, resolveRootHref } from "./i18n-routes";
import { DEFAULT_LOCALE, LOCALES, localeFromPathname, toCanonicalPath } from "./locales";
import { FALLBACK_REGISTRY } from "@/lib/shared/i18n-registry-types";

test("localeFromPathname detects secondary prefix", () => {
  assert.equal(localeFromPathname("/en"), "en");
  assert.equal(localeFromPathname("/en/about"), "en");
  assert.equal(localeFromPathname("/enigma"), "uk"); // prefix must be segment-aligned
  assert.equal(localeFromPathname("/about"), "uk");
  assert.equal(localeFromPathname("/"), "uk");
});

test("ru locale is configured and prefix-detected", () => {
  assert.equal(localeFromPathname("/ru/pricing"), "ru");
  assert.deepEqual(toCanonicalPath("/ru"), { locale: "ru", path: "/" });
});

test("toCanonicalPath strips secondary prefix", () => {
  assert.deepEqual(toCanonicalPath("/en/about"), { locale: "en", path: "/about" });
  assert.deepEqual(toCanonicalPath("/en"), { locale: "en", path: "/" });
  assert.deepEqual(toCanonicalPath("/about"), { locale: DEFAULT_LOCALE, path: "/about" });
});

const reg = FALLBACK_REGISTRY;

test("localizePath prefixes secondary locales only", () => {
  assert.equal(localizePath("/about", "en"), "/en/about");
  assert.equal(localizePath("/about", "uk"), "/about");
  assert.equal(localizePath("/", "en"), "/en");
});

// Regression: header/footer chrome once ran every root through a raw
// localizePath, emitting /ru/about, /ru/pricing, /ru/vs-* … on RU pages —
// all 404s while the RU surface is partial. resolveRootHref falls back to
// the UA page for roots outside LOCALIZED_ROOTS[locale].
test("resolveRootHref localizes only roots the locale actually has", () => {
  assert.equal(resolveRootHref("/blog", "ru"), "/ru/blog");
  assert.equal(resolveRootHref("/contacts", "ru"), "/ru/contacts");
  assert.equal(resolveRootHref("/about", "ru"), "/about");
  assert.equal(resolveRootHref("/pricing", "ru"), "/pricing");
  assert.equal(resolveRootHref("/portfolio", "ru"), "/ru/portfolio");
  assert.equal(resolveRootHref("/vs-wordpress", "ru"), "/vs-wordpress");
  assert.equal(resolveRootHref("/about", "en"), "/en/about");
  assert.equal(resolveRootHref("/cookies", "en"), "/en/cookies");
  assert.equal(resolveRootHref("/about", "uk"), "/about");
});

test("resolveLocaleAlternate returns an entry for every configured locale", () => {
  const r = resolveLocaleAlternate("/about", reg);
  assert.deepEqual(Object.keys(r).sort(), [...LOCALES].sort());
});

test("homepage '/' offers both locales", () => {
  assert.deepEqual(resolveLocaleAlternate("/", reg), { uk: "/", en: "/en", ru: "/ru" });
});

test("EN homepage '/en' offers both locales", () => {
  assert.deepEqual(resolveLocaleAlternate("/en", reg), { uk: "/", en: "/en", ru: "/ru" });
});

// Regression: Next prerenders the root route with usePathname() === "/index".
// Before normalization this fell through to the root-match branch, "/index"
// wasn't in LOCALIZED_ROOTS.en, and EN resolved to null — disabling the
// UA → EN switch on the homepage ("EN version coming soon").
test("prerender index alias '/index' resolves like the homepage", () => {
  assert.deepEqual(resolveLocaleAlternate("/index", reg), { uk: "/", en: "/en", ru: "/ru" });
});

test("localized top-level root maps to /en twin", () => {
  // /pricing is not in LOCALIZED_ROOTS.ru yet -> ru disabled.
  assert.deepEqual(resolveLocaleAlternate("/pricing", reg), {
    uk: "/pricing",
    en: "/en/pricing",
    ru: null,
  });
});

test("UA-only top-level root has no EN twin", () => {
  assert.deepEqual(resolveLocaleAlternate("/stories", reg), {
    uk: "/stories",
    en: null,
    ru: null,
  });
});

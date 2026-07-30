import test from "node:test";
import assert from "node:assert/strict";

import { buildAlternates } from "./alternates";

test("default-locale page with all secondary locales available", () => {
  assert.deepEqual(buildAlternates({ locale: "uk", uaPath: "/about" }), {
    canonical: "/about",
    languages: {
      uk: "/about",
      "en-GB": "/en/about",
      ru: "/ru/about",
      "x-default": "/about",
    },
  });
});

test("secondary-locale page canonicalizes to its own URL", () => {
  assert.equal(buildAlternates({ locale: "en", uaPath: "/about" }).canonical, "/en/about");
});

test("homepage special case", () => {
  assert.equal(buildAlternates({ locale: "en", uaPath: "/" }).canonical, "/en");
});

test("unavailable secondary locale omitted", () => {
  const a = buildAlternates({ locale: "uk", uaPath: "/stories/x", available: [] });
  assert.deepEqual(a.languages, { uk: "/stories/x", "x-default": "/stories/x" });
});

test("path override for translated slugs", () => {
  const a = buildAlternates({
    locale: "uk",
    uaPath: "/blog/ua-slug",
    paths: { en: "/en/blog/en-slug" },
  });
  assert.equal(a.languages!["en-GB"], "/en/blog/en-slug");
});

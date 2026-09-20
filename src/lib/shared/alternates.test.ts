import test from "node:test";
import assert from "node:assert/strict";

import { buildAlternates } from "./alternates";

test("default availability follows LOCALIZED_ROOTS per locale", () => {
  // /vs-wordpress exists in EN but not (yet) in RU.
  assert.deepEqual(buildAlternates({ locale: "uk", uaPath: "/vs-wordpress" }), {
    canonical: "/vs-wordpress",
    languages: {
      uk: "/vs-wordpress",
      "en": "/en/vs-wordpress",
      "x-default": "/vs-wordpress",
    },
  });
  // /blog exists in both secondary locales.
  assert.deepEqual(
    buildAlternates({ locale: "uk", uaPath: "/blog" }).languages,
    { uk: "/blog", "en": "/en/blog", ru: "/ru/blog", "x-default": "/blog" },
  );
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
    available: ["en"],
    paths: { en: "/en/blog/en-slug" },
  });
  assert.equal(a.languages!["en"], "/en/blog/en-slug");
});

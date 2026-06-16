import test from "node:test";
import assert from "node:assert/strict";

import { normalizePathname } from "./normalize-pathname";

test("normalizePathname maps the Next prerender index alias to root", () => {
  assert.equal(normalizePathname("/index"), "/");
});

test("normalizePathname maps nullish/empty to root", () => {
  assert.equal(normalizePathname(null), "/");
  assert.equal(normalizePathname(undefined), "/");
  assert.equal(normalizePathname(""), "/");
});

test("normalizePathname leaves real paths untouched", () => {
  assert.equal(normalizePathname("/"), "/");
  assert.equal(normalizePathname("/en"), "/en");
  assert.equal(normalizePathname("/pricing"), "/pricing");
  // Only the exact "/index" alias is rewritten — deeper paths are preserved.
  assert.equal(normalizePathname("/blog/index-of-things"), "/blog/index-of-things");
});

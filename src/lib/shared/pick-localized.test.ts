import test from "node:test";
import assert from "node:assert/strict";

import { pickLocalized } from "./pick-localized";

test("returns the locale's value when non-empty", () => {
  assert.equal(pickLocalized({ uk: "а", en: "a" }, "en"), "a");
});

test("default locale falls back to nothing extra", () => {
  assert.equal(pickLocalized({ en: "a" }, "uk"), undefined);
});

test("secondary locale returns undefined when missing (never wrong-language)", () => {
  assert.equal(pickLocalized({ uk: "а" }, "en"), undefined);
});

test("empty array and empty string count as missing", () => {
  assert.equal(pickLocalized({ en: [] as string[] }, "en"), undefined);
  assert.equal(pickLocalized({ en: "" }, "en"), undefined);
});

test("nullish container", () => {
  assert.equal(pickLocalized(undefined, "en"), undefined);
  assert.equal(pickLocalized(null, "uk"), undefined);
});

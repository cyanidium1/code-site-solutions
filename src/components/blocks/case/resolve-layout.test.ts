import test from "node:test";
import assert from "node:assert/strict";

import { resolveCaseLayout } from "./resolve-layout";

test("explicit comparison/afterOnly override the before-image heuristic", () => {
  assert.equal(resolveCaseLayout("comparison", false), "comparison");
  assert.equal(resolveCaseLayout("comparison", true), "comparison");
  assert.equal(resolveCaseLayout("afterOnly", true), "afterOnly");
  assert.equal(resolveCaseLayout("afterOnly", false), "afterOnly");
});

test("auto picks comparison only when a before image exists", () => {
  assert.equal(resolveCaseLayout("auto", true), "comparison");
  assert.equal(resolveCaseLayout("auto", false), "afterOnly");
});

test("undefined (legacy docs) behaves like auto", () => {
  assert.equal(resolveCaseLayout(undefined, true), "comparison");
  assert.equal(resolveCaseLayout(undefined, false), "afterOnly");
});

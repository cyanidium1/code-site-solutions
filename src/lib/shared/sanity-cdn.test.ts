import test from "node:test";
import assert from "node:assert/strict";

import {
  cropRect,
  croppedDims,
  sanityCdn,
  sanitySrcSet,
} from "./sanity-cdn";

const SANITY_URL =
  "https://cdn.sanity.io/images/4lk0x7o9/production/abc123-2000x1000.png";

test("sanityCdn appends transform params to Sanity URLs", () => {
  const out = sanityCdn(SANITY_URL, { w: 800, q: 60 });
  assert.ok(out.includes("auto=format"));
  assert.ok(out.includes("fit=max"));
  assert.ok(out.includes("w=800"));
  assert.ok(out.includes("q=60"));
});

test("sanityCdn passes non-Sanity URLs through untouched", () => {
  assert.equal(sanityCdn("/blog/cover.webp", { w: 800 }), "/blog/cover.webp");
  assert.equal(sanityCdn(null), "");
  assert.equal(sanityCdn(undefined), "");
});

test("cropRect converts a fractional Studio crop to a pixel rect", () => {
  const rect = cropRect(
    { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
    { width: 2000, height: 1000 },
  );
  assert.equal(rect, "500,100,1000,800");
});

test("cropRect returns undefined for missing or no-op crops", () => {
  assert.equal(cropRect(undefined, { width: 100, height: 100 }), undefined);
  assert.equal(cropRect(null, { width: 100, height: 100 }), undefined);
  assert.equal(
    cropRect({ top: 0, bottom: 0, left: 0, right: 0 }, { width: 100, height: 100 }),
    undefined,
  );
  assert.equal(
    cropRect({ top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 }, undefined),
    undefined,
  );
});

test("croppedDims shrinks intrinsic dimensions by the crop", () => {
  assert.deepEqual(
    croppedDims(
      { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
      { width: 2000, height: 1000 },
    ),
    { width: 1000, height: 800 },
  );
  assert.deepEqual(croppedDims(null, { width: 2000, height: 1000 }), {
    width: 2000,
    height: 1000,
  });
  assert.equal(croppedDims(null, undefined), undefined);
});

test("sanityCdn includes ?rect= when crop+dims provided", () => {
  const out = sanityCdn(SANITY_URL, {
    w: 800,
    crop: { top: 0.1, bottom: 0.1, left: 0.25, right: 0.25 },
    dims: { width: 2000, height: 1000 },
  });
  assert.ok(out.includes("rect=500%2C100%2C1000%2C800"));
});

test("sanitySrcSet caps candidates at the intrinsic (cropped) width", () => {
  const out = sanitySrcSet(SANITY_URL, {
    widths: [400, 800, 1600, 2400],
    dims: { width: 2000, height: 1000 },
  });
  assert.ok(out);
  assert.ok(out.includes("w=400") && out.includes(" 400w"));
  assert.ok(out.includes("w=1600"));
  assert.ok(out.includes(" 2000w")); // capped candidate at intrinsic width
  assert.ok(!out.includes("w=2400")); // upscale candidate dropped
});

test("sanitySrcSet returns undefined for non-Sanity URLs", () => {
  assert.equal(sanitySrcSet("/blog/cover.webp", {}), undefined);
  assert.equal(sanitySrcSet(undefined, {}), undefined);
});

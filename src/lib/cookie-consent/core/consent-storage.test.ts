import test from "node:test";
import assert from "node:assert/strict";
import { parseStoredConsent, serializeStoredConsent } from "./consent-storage";
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

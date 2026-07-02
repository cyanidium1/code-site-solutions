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

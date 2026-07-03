import test from "node:test";
import assert from "node:assert/strict";
import { buildBootstrapScript } from "./bootstrap-script";
import { CONSENT_COOKIE, CONSENT_VERSION } from "../config";

const script = buildBootstrapScript();

test("pushes default=denied for all ad/analytics signals with wait_for_update", () => {
  assert.match(script, /"consent","default"/);
  for (const signal of [
    "ad_storage",
    "ad_user_data",
    "ad_personalization",
    "analytics_storage",
    "functionality_storage",
    "personalization_storage",
  ]) {
    assert.match(script, new RegExp(`${signal}:"denied"`));
  }
  assert.match(script, /security_storage:"granted"/);
  assert.match(script, /wait_for_update:2000/);
});

test("default comes before the stored-consent re-apply", () => {
  assert.ok(script.indexOf('"consent","default"') < script.indexOf('"consent","update"'));
});

test("re-apply reads the configured cookie and checks the current version", () => {
  assert.ok(script.includes(CONSENT_COOKIE));
  assert.ok(script.includes(`s.v!==${CONSENT_VERSION}`));
});

test("re-apply maps every configured signal from its category", () => {
  assert.match(script, /ad_storage:g\(c\.marketing\)/);
  assert.match(script, /analytics_storage:g\(c\.analytics\)/);
  assert.match(script, /functionality_storage:g\(c\.functional\)/);
});

test("sets ads_data_redaction and url_passthrough", () => {
  assert.match(script, /"set","ads_data_redaction",true/);
  assert.match(script, /"set","url_passthrough",true/);
});

/**
 * E2E verification of the cookie-consent module. Requires a running server:
 *   npm run dev   →   npm run consent:verify [baseUrl]
 * Default baseUrl: http://localhost:3000
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
let failures = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const consentEntries = () =>
  (window.dataLayer || [])
    .filter((e) => e[0] === "consent")
    .map((e) => ({ type: `${e[0]}:${e[1]}`, state: e[2] }));

const trackingCookies = () =>
  document.cookie.split(";").map((c) => c.trim()).filter((c) => /^(_ga|_gid|_gcl|_fbp)/.test(c));

const browser = await chromium.launch();

// ---------- Scenario 1: first visit — defaults, banner, reject-all ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const before = await page.evaluate(consentEntries);
  check("GCM default is the first consent entry", before[0]?.type === "consent:default");
  check("default denies analytics_storage", before[0]?.state?.analytics_storage === "denied");
  check("no tracking cookies before consent", (await page.evaluate(trackingCookies)).length === 0);
  // The banner mounts after hydration — wait for it rather than checking instantly.
  const bannerVisible = await page
    .getByRole("button", { name: /accept all|прийняти всі/i })
    .waitFor({ state: "visible", timeout: 10000 })
    .then(() => true)
    .catch(() => false);
  check("banner is visible", bannerVisible);

  await page.getByRole("button", { name: /reject all|відхилити всі/i }).click();
  await page.waitForTimeout(500);
  const afterReject = await page.evaluate(consentEntries);
  const lastReject = afterReject[afterReject.length - 1];
  check(
    "reject-all pushes update: denied",
    lastReject?.type === "consent:update" && lastReject?.state?.analytics_storage === "denied",
  );

  await page.reload({ waitUntil: "networkidle" });
  check(
    "choice persists across reload (no banner)",
    (await page.getByRole("button", { name: /reject all|відхилити всі/i }).count()) === 0,
  );
  const reapplied = await page.evaluate(consentEntries);
  check(
    "bootstrap re-applies stored choice before GTM",
    reapplied.some((e) => e.type === "consent:update"),
  );
  await page.context().close();
}

// ---------- Scenario 2: accept-all grants everything ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /accept all|прийняти всі/i }).click();
  await page.waitForTimeout(500);
  const entries = await page.evaluate(consentEntries);
  const last = entries[entries.length - 1];
  check(
    "accept-all pushes update: granted",
    last?.state?.ad_storage === "granted" && last?.state?.analytics_storage === "granted",
  );
  const cookie = await page.evaluate(() => document.cookie.includes("cs-consent="));
  check("cs-consent cookie written", cookie);
  await page.context().close();
}

// ---------- Scenario 3: preferences — granular choice ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /customise|налаштувати/i }).click();
  const dialog = page.getByRole("dialog");
  check("preferences dialog opens", await dialog.isVisible());
  await dialog.getByRole("switch").nth(1).click(); // analytics (order: functional, analytics, marketing)
  await dialog.getByRole("button", { name: /save|зберегти/i }).click();
  await page.waitForTimeout(500);
  const entries = await page.evaluate(consentEntries);
  const last = entries[entries.length - 1];
  check(
    "granular save: analytics granted, ads denied",
    last?.state?.analytics_storage === "granted" && last?.state?.ad_storage === "denied",
  );
  await page.context().close();
}

// ---------- Scenario 4: footer settings link reopens preferences ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /accept all|прийняти всі/i }).click();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page
    .locator("footer")
    .getByRole("button", { name: /cookie|cookies/i })
    .click();
  check("footer link reopens preferences", await page.getByRole("dialog").isVisible());
  await page.context().close();
}

// ---------- Scenario 5: EN locale copy ----------
{
  const page = await (await browser.newContext()).newPage();
  await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
  const enCopyVisible = await page
    .getByText("We value your privacy")
    .waitFor({ state: "visible", timeout: 10000 })
    .then(() => true)
    .catch(() => false);
  check("EN banner copy", enCopyVisible);
  await page.context().close();
}

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);

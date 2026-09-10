/**
 * Restructure of industryPage "medicine" — 10.09.2026.
 *
 * Measured before: 20 480px over 17 rendered blocks, 2 293 words. The page
 * answered "how much and what for" on the fifteenth screen, and three
 * consecutive blocks (caseBlock + imageTextBlock + outcomeBlock) spent
 * 6 032px — 29% of the page — telling the same client story three times.
 *
 * DROP  gscgrowth (imageTextBlock, 522px)   — third telling of the case
 * DROP  secp      (outcomeBlock, 3 644px)   — second telling, and the single
 *                                             biggest block on the page at
 *                                             17px of page per word
 * MOVE  sect      (comparisonBlock)         — below the calculator: it argues
 *                                             against WordPress rather than
 *                                             for the clinic, so it belongs
 *                                             after the price, not before it.
 *                                             Kept, not cut — it is the only
 *                                             place on the page answering
 *                                             "why not a template" and it
 *                                             carries that H2's keywords.
 *
 * The calculator follows servicesBlock on this page (see calcAfterType in
 * industry-page/index.tsx), so the resulting read is:
 *   pain → proof → scope → price → objection → SEO scope text → FAQ → audit.
 *
 * Restore: docs/medicine-restructure/industryPage-medicine-backup-2026-09-10.json
 * Run:     node docs/medicine-restructure/apply-sections.cjs [--dry]
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DROP = ["gscgrowth", "secp"];
const ORDER = ["sec1", "sec2e", "sec2m", "sect", "secScope", "sec14", "sec27"];

const envFile = path.join(__dirname, "../../../code-site-solutions-admin/.env");
const token = fs
  .readFileSync(envFile, "utf8")
  .split(/\r?\n/)
  .map((l) => l.match(/^SANITY_API_WRITE_TOKEN=(.+)$/))
  .find(Boolean)?.[1]
  ?.trim();
if (!token) throw new Error("SANITY_API_WRITE_TOKEN not found in admin .env");

const client = createClient({
  projectId: "4lk0x7o9",
  dataset: "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  token,
});

(async () => {
  const dry = process.argv.includes("--dry");
  const doc = await client.fetch(
    '*[_type=="industryPage" && slug.current=="medicine"][0]{_id, sections}',
  );
  if (!doc) throw new Error("medicine industryPage not found");

  const byKey = new Map(doc.sections.map((s) => [s._key, s]));
  const kept = ORDER.map((k) => {
    const s = byKey.get(k);
    if (!s) throw new Error(`section ${k} missing — aborting rather than dropping it`);
    return s;
  });

  const unaccounted = doc.sections
    .map((s) => s._key)
    .filter((k) => !ORDER.includes(k) && !DROP.includes(k));
  if (unaccounted.length) {
    throw new Error(`unexpected sections ${unaccounted.join(",")} — update the script`);
  }

  console.log("before:", doc.sections.map((s) => `${s._key}:${s._type}`).join(" "));
  console.log("after: ", kept.map((s) => `${s._key}:${s._type}`).join(" "));
  console.log("dropped:", DROP.join(", "));

  if (dry) return console.log("\n--dry: nothing written");
  await client.patch(doc._id).set({ sections: kept }).commit();
  console.log("\ncommitted to", doc._id);
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});

/* Throw-away verifier — fetch NBYG doc from Sanity and dump fields. */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@sanity/client";

function loadEnv(f: string) {
  const p = join(process.cwd(), f);
  if (!existsSync(p)) return;
  for (const l of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = l.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    if (process.env[k] === undefined) process.env[k] = v;
  }
}
loadEnv(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
const doc = await client.fetch(`*[_id == "caseStudy.nbyg-kobenhavn"][0]{
  _id, _type, status, order, featured,
  "slug": slug.current,
  title, client, region, year, duration, stack, budget,
  seo,
  hero,
  sections[]{
    _type, _key,
    variant, imageVariant, bulletIcon,
    eyebrow, heading, subheading,
    body, bodyEn,
    bulletList,
    items,
    quote, authorName, authorRole
  }
}`);

console.log(JSON.stringify(doc, null, 2));
}
main();

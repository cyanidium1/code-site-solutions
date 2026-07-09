/**
 * Rank Tailwind class stacks on a served page by bytes × instances — the
 * "paid twice" cost driver from docs/rsc-payload-report.md (each class string
 * ships once in the HTML markup and again in the RSC flight payload).
 *
 * Usage:
 *   node tools/perf/classname-audit.mjs [url] [minBytes] [minCount]
 * Defaults: http://localhost:3111/en, 600, 3 (the conversion threshold).
 */

const url = process.argv[2] ?? "http://localhost:3111/en";
const minBytes = Number(process.argv[3] ?? 600);
const minCount = Number(process.argv[4] ?? 3);

const html = await (await fetch(url)).text();
const kb = (n) => (n / 1024).toFixed(1) + " KB";

// HTML side
const htmlGroups = new Map();
let htmlBytes = 0, htmlAttrs = 0;
for (const m of html.matchAll(/class="([^"]*)"/g)) {
  htmlBytes += m[1].length;
  htmlAttrs++;
  const g = htmlGroups.get(m[1]) ?? 0;
  htmlGroups.set(m[1], g + 1);
}

// Flight side (className props inside escaped __next_f strings)
let flightBytes = 0, flightProps = 0;
for (const m of html.matchAll(/\\"className\\":\\"((?:[^\\"]|\\\\.)*?)\\"/g)) {
  flightBytes += m[1].length;
  flightProps++;
}

console.log(`page: ${url}`);
console.log(`document: ${kb(html.length)} raw`);
console.log(`HTML class attrs: ${htmlAttrs} → ${kb(htmlBytes)}`);
console.log(`flight className props: ${flightProps} → ${kb(flightBytes)}`);
console.log(`className share of document: ${(100 * (htmlBytes + flightBytes) / html.length).toFixed(0)}%`);

const ranked = [...htmlGroups.entries()]
  .map(([cls, n]) => ({ cls, n, bytes: cls.length, total: cls.length * n }))
  .filter((r) => r.bytes >= minBytes && r.n >= minCount || (r.bytes >= 1024 && r.n >= 2))
  .sort((a, b) => b.total - a.total);

console.log(`\n== conversion candidates (≥${minBytes} B × ≥${minCount}, or ≥1 KB × ≥2) ==`);
console.log("HTML-side totals; double them (≈) for the flight twin.\n");
for (const r of ranked) {
  console.log(`${kb(r.total).padStart(9)}  ${String(r.bytes).padStart(5)} B × ${r.n}   ${r.cls.slice(0, 100)}`);
}
if (ranked.length === 0) console.log("(none above threshold)");

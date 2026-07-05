/**
 * Consistent Lighthouse runs for perf work. Wraps the CLI so every
 * measurement uses identical flags (mobile emulation, performance-only).
 *
 * Usage:
 *   node tools/perf/run-lighthouse.mjs --url <url> --label <name> [--runs N]
 *
 * Windows quirk: the CLI often exits non-zero with an EPERM while deleting
 * Chrome's temp profile AFTER the report is written. We therefore judge
 * success by the presence of the report file, not the exit code.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const url = arg("url", "https://www.code-site.art/en");
const label = arg("label", "run");
const runs = Number(arg("runs", "1"));

const outDir = resolve(".lighthouse");
mkdirSync(outDir, { recursive: true });

const results = [];

for (let i = 1; i <= runs; i++) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const base = resolve(outDir, `${label}-${stamp}-${i}`);
  const jsonPath = `${base}.report.json`;

  console.log(`\n[${i}/${runs}] lighthouse ${url}`);
  spawnSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=performance",
      "--output=json",
      "--output=html",
      `--output-path=${base}`,
      '--chrome-flags="--headless=new"',
      "--quiet",
    ],
    { stdio: "inherit", shell: true },
  );

  if (!existsSync(jsonPath)) {
    console.error(`Run ${i}: no report written (${jsonPath}) — real failure.`);
    process.exit(1);
  }

  const r = JSON.parse(readFileSync(jsonPath, "utf8"));
  const a = r.audits;
  results.push({
    score: Math.round(r.categories.performance.score * 100),
    lcp: a["largest-contentful-paint"].numericValue,
    tbt: a["total-blocking-time"].numericValue,
    fcp: a["first-contentful-paint"].numericValue,
    cls: a["cumulative-layout-shift"].numericValue,
  });
}

const median = (key) => {
  const s = results.map((r) => r[key]).sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

console.log(`\n=== ${label} @ ${url} (${runs} run${runs > 1 ? "s" : ""}) ===`);
for (const [i, r] of results.entries()) {
  console.log(
    `  run ${i + 1}: score=${r.score} LCP=${(r.lcp / 1000).toFixed(1)}s ` +
      `TBT=${Math.round(r.tbt)}ms FCP=${(r.fcp / 1000).toFixed(1)}s CLS=${r.cls.toFixed(3)}`,
  );
}
console.log(
  `  MEDIAN: score=${median("score")} LCP=${(median("lcp") / 1000).toFixed(1)}s ` +
    `TBT=${Math.round(median("tbt"))}ms FCP=${(median("fcp") / 1000).toFixed(1)}s CLS=${median("cls").toFixed(3)}`,
);
console.log(`  Reports: ${outDir}\\${label}-*.report.html`);

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Bilingual-assumption tripwire. These patterns were eliminated in the
 * 2026-07 multilocale-debt sweep; new occurrences would silently break
 * locale N. If you legitimately need one, add the file to ALLOW below
 * with a comment explaining why.
 */
const PATTERNS = [
  'locale === "en"',
  'locale !== "en"',
  'locale === "uk"',
  '"uk" | "en"',
  '? "uk" : "en"',
  '? "en" : "uk"',
];

const ALLOW = new Set<string>([
  "src/constants/locales.ts", // the definition site
]);

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("no bilingual-only locale patterns in src/", () => {
  const hits: string[] = [];
  for (const p of PATTERNS) {
    let out = "";
    try {
      out = execFileSync(
        "git",
        ["grep", "-nF", p, "--", "src/*.ts", "src/*.tsx", "src/**/*.ts", "src/**/*.tsx"],
        { cwd: REPO_ROOT, encoding: "utf8" },
      );
    } catch {
      continue; // git grep exits 1 on no matches
    }
    for (const line of out.split("\n")) {
      if (!line) continue;
      const file = line.split(":")[0].replaceAll("\\", "/");
      if (ALLOW.has(file) || file.endsWith(".test.ts")) continue;
      hits.push(line);
    }
  }
  assert.deepEqual(
    hits,
    [],
    `bilingual-only locale patterns found (fix or allowlist with a reason):\n${hits.join("\n")}`,
  );
});

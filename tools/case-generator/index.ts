import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { caseDraftToMarkdown, generateCaseDraft } from "./analyzer";
import { crawlSite, launchBrowser } from "./crawler";
import type { SiteConfig } from "./types";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(HERE, "config", "sites.json");
const OUTPUT_ROOT = path.join(HERE, "output");

async function readSites(): Promise<SiteConfig[]> {
  const raw = await readFile(CONFIG_PATH, "utf8");
  const parsed = JSON.parse(raw) as SiteConfig[];
  if (!Array.isArray(parsed)) {
    throw new Error("config/sites.json must be a JSON array of sites");
  }
  return parsed;
}

async function main(): Promise<void> {
  const sites = await readSites();
  if (sites.length === 0) {
    console.log("No sites in config/sites.json — nothing to do.");
    return;
  }

  console.log(`Launching Chromium for ${sites.length} site(s)…`);
  const browser = await launchBrowser();

  try {
    for (const site of sites) {
      const outputDir = path.join(OUTPUT_ROOT, site.slug);
      await mkdir(outputDir, { recursive: true });

      console.log(`\n▶ ${site.name} (${site.url})`);
      const raw = await crawlSite(browser, site, outputDir);

      await writeFile(
        path.join(outputDir, "raw-data.json"),
        JSON.stringify(raw, null, 2),
        "utf8",
      );

      const draft = await generateCaseDraft(raw);
      await writeFile(
        path.join(outputDir, "case-draft.json"),
        JSON.stringify(draft, null, 2),
        "utf8",
      );
      await writeFile(
        path.join(outputDir, "case-draft.md"),
        caseDraftToMarkdown(draft),
        "utf8",
      );

      console.log(
        `✓ ${site.slug}: ${raw.pages.length} page(s) → tools/case-generator/output/${site.slug}/`,
      );
    }
  } finally {
    await browser.close();
  }

  console.log("\nDone. Drafts are saved locally and NOT published anywhere.");
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`\nCase generator failed: ${message}`);
  if (/Executable doesn't exist|playwright install/i.test(message)) {
    console.error(
      "Chromium is missing. Run: npx playwright install chromium",
    );
  }
  process.exitCode = 1;
});

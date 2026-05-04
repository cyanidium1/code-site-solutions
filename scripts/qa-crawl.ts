/* QA crawler — fetches every URL discoverable from sitemap + page links
   on the local dev server, then runs a battery of checks. Output is a
   structured report grouped by category. */

export {};
const BASE = "http://localhost:3000";

type PageProbe = {
  url: string;
  status: number | null;
  redirected?: boolean;
  finalUrl?: string;
  htmlLen?: number;
  title?: string;
  h1Count?: number;
  ldJsonCount?: number;
  ldJsonValid?: boolean;
  hreflangs?: Array<{ hreflang: string; href: string }>;
  internalLinks?: string[];
  externalLinks?: string[];
  /** Suspicious content markers (raw markdown, untranslated strings, etc.) */
  flags?: string[];
  error?: string;
};

const seen = new Set<string>();
const pages: Record<string, PageProbe> = {};
const queue: string[] = [];
const issues: string[] = [];

function enqueue(url: string) {
  // Normalize: drop fragment + query
  let u = url.split("#")[0].split("?")[0];
  if (u.endsWith("/") && u !== "/") u = u.slice(0, -1);
  if (!u) u = "/";
  if (!u.startsWith("/")) return; // skip external
  if (seen.has(u)) return;
  seen.add(u);
  queue.push(u);
}

function classifyLink(href: string): "internal" | "external" | "skip" {
  if (!href) return "skip";
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:"))
    return "skip";
  if (href.startsWith("http://") || href.startsWith("https://")) {
    if (href.startsWith(BASE) || href.startsWith("https://code-site.art"))
      return "internal";
    return "external";
  }
  if (href.startsWith("/")) return "internal";
  return "skip";
}

function normalizeInternal(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const u = new URL(href);
      return u.pathname;
    } catch {
      return "";
    }
  }
  return href.split("#")[0].split("?")[0];
}

const RAW_MARKDOWN_RE = /(\*[^\s*]([^*\n]*[^\s*])?\*)/; // *x* style raw em
const MISSING_TRANSLATION_RE = /\b(MISSING_TRANSLATION|TODO_TRANSLATE|undefined undefined|\[object Object\])\b/;
const PLACEHOLDER_LIVE_RE = /(coming soon|незабаром)/i;

async function probe(path: string): Promise<PageProbe> {
  const url = `${BASE}${path === "/" ? "" : path}`;
  const probe: PageProbe = { url: path, status: null };
  try {
    const res = await fetch(url, { redirect: "manual" });
    probe.status = res.status;
    if (res.status >= 300 && res.status < 400) {
      probe.redirected = true;
      probe.finalUrl = res.headers.get("location") || undefined;
      return probe;
    }
    if (res.status >= 400) return probe;
    const html = await res.text();
    probe.htmlLen = html.length;

    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    probe.title = titleMatch?.[1].trim();

    // H1 count
    const h1s = html.match(/<h1\b[^>]*>/gi) || [];
    probe.h1Count = h1s.length;

    // JSON-LD blocks
    const ldBlocks = Array.from(
      html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
    );
    probe.ldJsonCount = ldBlocks.length;
    probe.ldJsonValid = true;
    for (const m of ldBlocks) {
      try {
        JSON.parse(m[1]);
      } catch {
        probe.ldJsonValid = false;
      }
    }

    // hreflang
    const hreflangs = Array.from(
      html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi),
    ).map((m) => ({ hreflang: m[1], href: m[2] }));
    const hreflangs2 = Array.from(
      html.matchAll(/<link[^>]+hreflang=["']([^"']+)["'][^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["']/gi),
    ).map((m) => ({ hreflang: m[1], href: m[2] }));
    probe.hreflangs = [...hreflangs, ...hreflangs2];

    // Links (anchor href)
    const internal: string[] = [];
    const external: string[] = [];
    const linkRe = /<a\b[^>]+href=["']([^"']+)["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      const k = classifyLink(href);
      if (k === "internal") internal.push(normalizeInternal(href));
      else if (k === "external") external.push(href);
    }
    probe.internalLinks = [...new Set(internal)].filter(Boolean);
    probe.externalLinks = [...new Set(external)];

    // Visible-text checks (strip tags, collapse whitespace)
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const flags: string[] = [];
    if (RAW_MARKDOWN_RE.test(text)) {
      const sample = text.match(RAW_MARKDOWN_RE)?.[0];
      flags.push(`raw markdown leak: ${sample}`);
    }
    if (MISSING_TRANSLATION_RE.test(text)) {
      flags.push(`untranslated marker present`);
    }
    if (PLACEHOLDER_LIVE_RE.test(text)) {
      const sample = text.match(PLACEHOLDER_LIVE_RE)?.[0];
      flags.push(`placeholder visible: ${sample}`);
    }
    if (!probe.title || probe.title.length < 5) {
      flags.push(`title missing/short`);
    }
    if (probe.h1Count === 0) {
      flags.push(`no h1`);
    }
    if (probe.h1Count && probe.h1Count > 1) {
      flags.push(`multiple h1 (${probe.h1Count})`);
    }
    if (!probe.ldJsonValid) {
      flags.push(`ld+json parse error`);
    }

    probe.flags = flags;
    return probe;
  } catch (e) {
    probe.error = (e as Error).message;
    return probe;
  }
}

async function main() {
  // Seed from sitemap
  const sitemapXml = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
  const locs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(
    (m) => m[1],
  );
  console.log(`→ Sitemap entries: ${locs.length}`);
  for (const loc of locs) {
    try {
      const u = new URL(loc);
      enqueue(u.pathname);
    } catch {
      issues.push(`Invalid sitemap URL: ${loc}`);
    }
  }

  // Manual seeds for top-level pages that may not be in sitemap
  for (const p of [
    "/",
    "/en",
    "/about",
    "/pricing",
    "/process",
    "/portfolio",
    "/calculator",
    "/contacts",
    "/blog",
    "/vs-wordpress",
    "/vs-constructors",
    "/vs-freelancers",
    "/en/vs-wordpress",
    "/en/vs-constructors",
    "/en/vs-freelancers",
    "/portfolio/efedra-clinic",
    "/portfolio/nbyg-kobenhavn",
    "/en/portfolio/nbyg-kobenhavn",
    "/sites-for/medicine",
    "/en/sites-for/medicine",
  ]) {
    enqueue(p);
  }

  // BFS crawl
  while (queue.length > 0) {
    const path = queue.shift()!;
    const p = await probe(path);
    pages[path] = p;
    if (p.internalLinks) {
      for (const l of p.internalLinks) enqueue(l);
    }
  }

  // Hreflang reciprocity check
  for (const [path, p] of Object.entries(pages)) {
    if (!p.hreflangs?.length) continue;
    for (const a of p.hreflangs) {
      try {
        const u = new URL(a.href);
        const target = u.pathname;
        const targetPage = pages[target];
        if (!targetPage) {
          issues.push(`hreflang target uncrawled: ${path} → ${a.hreflang}=${target}`);
        } else if (targetPage.status && targetPage.status >= 400) {
          issues.push(`hreflang target broken: ${path} → ${a.hreflang}=${target} (status ${targetPage.status})`);
        }
      } catch {
        issues.push(`hreflang URL malformed: ${path} → ${a.href}`);
      }
    }
  }

  // Compile report
  const sorted = Object.values(pages).sort((a, b) => a.url.localeCompare(b.url));
  const ok: PageProbe[] = [];
  const broken: PageProbe[] = [];
  const flagged: PageProbe[] = [];

  for (const p of sorted) {
    if (p.error) {
      broken.push(p);
      continue;
    }
    if ((p.status ?? 0) >= 400) {
      broken.push(p);
      continue;
    }
    if (p.flags && p.flags.length > 0) {
      flagged.push(p);
    }
    ok.push(p);
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Crawled:  ${sorted.length}`);
  console.log(`OK:       ${ok.length}`);
  console.log(`Broken:   ${broken.length}`);
  console.log(`Flagged:  ${flagged.length}`);
  console.log(`Issues:   ${issues.length}`);

  if (broken.length) {
    console.log(`\n=== BROKEN ===`);
    for (const p of broken) {
      console.log(`  ${p.status ?? "ERR"} ${p.url}${p.error ? ` (${p.error})` : ""}${p.redirected ? ` → ${p.finalUrl}` : ""}`);
    }
  }

  if (flagged.length) {
    console.log(`\n=== FLAGGED (content issues) ===`);
    for (const p of flagged) {
      console.log(`  ${p.url}`);
      for (const f of p.flags!) console.log(`    · ${f}`);
    }
  }

  if (issues.length) {
    console.log(`\n=== HREFLANG / META ISSUES ===`);
    for (const i of issues) console.log(`  · ${i}`);
  }

  console.log(`\n=== ALL PAGES ===`);
  for (const p of sorted) {
    const flagsTag = p.flags?.length ? ` [⚑${p.flags.length}]` : "";
    console.log(`  ${p.status} ${p.url}${flagsTag} — ${p.title?.slice(0, 60) ?? ""}`);
  }

  // External links overview
  const allExternal = new Set<string>();
  for (const p of sorted) {
    p.externalLinks?.forEach((l) => allExternal.add(l));
  }
  console.log(`\n=== EXTERNAL LINKS (unique, ${allExternal.size}) ===`);
  for (const l of [...allExternal].sort()) console.log(`  ${l}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

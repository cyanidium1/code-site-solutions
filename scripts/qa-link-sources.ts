/* For each broken target URL, list which pages link to it. */

export {};
const BASE = "http://localhost:3000";

const BROKEN = [
  "/sites-for/accounting",
  "/sites-for/cosmetology",
  "/sites-for/ecommerce",
  "/sites-for/education",
  "/sites-for/legal",
  "/sites-for/real-estate",
  "/sites-for/saas",
];

const FLAGGED_COMING_SOON = ["/", "/about", "/en"];

async function main() {
  // Crawl every reachable page
  const seen = new Set<string>();
  const queue: string[] = [];

  function enqueue(p: string) {
    if (!p.startsWith("/")) return;
    let u = p.split("#")[0].split("?")[0];
    if (u.endsWith("/") && u !== "/") u = u.slice(0, -1);
    if (!u) u = "/";
    if (seen.has(u)) return;
    seen.add(u);
    queue.push(u);
  }

  // Seed
  for (const p of [
    "/", "/en", "/about", "/pricing", "/process", "/portfolio",
    "/calculator", "/contacts", "/blog", "/vs-wordpress",
    "/vs-constructors", "/vs-freelancers", "/en/vs-wordpress",
    "/en/vs-constructors", "/en/vs-freelancers",
    "/portfolio/efedra-clinic", "/portfolio/nbyg-kobenhavn",
    "/en/portfolio/nbyg-kobenhavn", "/sites-for/medicine",
    "/sites-for/renovation", "/en/sites-for/medicine",
  ]) enqueue(p);

  const linksOnPage: Record<string, string[]> = {};
  const htmlOf: Record<string, string> = {};

  while (queue.length) {
    const path = queue.shift()!;
    try {
      const url = `${BASE}${path === "/" ? "" : path}`;
      const res = await fetch(url, { redirect: "manual" });
      if (res.status >= 300) continue;
      const html = await res.text();
      htmlOf[path] = html;

      const links = new Set<string>();
      for (const m of html.matchAll(/<a\b[^>]+href=["']([^"']+)["'][^>]*>/gi)) {
        const href = m[1];
        if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
        if (href.startsWith("http://localhost:3000") || href.startsWith("https://code-site.art")) {
          try { const u = new URL(href); links.add(u.pathname); } catch {}
        } else if (href.startsWith("/")) {
          links.add(href.split("#")[0].split("?")[0]);
        }
      }
      linksOnPage[path] = [...links];
      for (const l of links) enqueue(l);
    } catch (e) {
      console.error(`crawl ${path}: ${(e as Error).message}`);
    }
  }

  // Build reverse index
  const linkedFrom: Record<string, string[]> = {};
  for (const [from, links] of Object.entries(linksOnPage)) {
    for (const l of links) {
      const norm = l.endsWith("/") && l !== "/" ? l.slice(0, -1) : l;
      if (!linkedFrom[norm]) linkedFrom[norm] = [];
      linkedFrom[norm].push(from);
    }
  }

  console.log(`=== LINK SOURCES FOR BROKEN TARGETS ===`);
  for (const broken of BROKEN) {
    const sources = linkedFrom[broken] ?? [];
    console.log(`\n${broken}  (${sources.length} sources)`);
    for (const s of sources) console.log(`  ← ${s}`);
  }

  console.log(`\n=== "Coming soon" CONTEXT ON FLAGGED PAGES ===`);
  for (const path of FLAGGED_COMING_SOON) {
    const html = htmlOf[path];
    if (!html) continue;
    console.log(`\n${path}:`);
    const lines = html.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (/coming soon/i.test(lines[i])) {
        const ctx = [
          lines[Math.max(0, i - 1)],
          lines[i],
          lines[Math.min(lines.length - 1, i + 1)],
        ]
          .join("\n")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 200);
        console.log(`  L${i + 1}: …${ctx}…`);
      }
    }
  }
}
main();

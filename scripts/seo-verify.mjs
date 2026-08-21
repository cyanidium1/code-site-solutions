/**
 * SEO acceptance verification (Aug 2026 overhaul).
 *
 * Runs against a local production build:
 *   npm run build && npm run start   (or next start -p 3000)
 *   node scripts/seo-verify.mjs [baseUrl]
 *
 * Crawls every URL in the sitemap index, parses the server-rendered HTML
 * (no JS execution — client-injected markup deliberately doesn't count)
 * and prints one pass/fail line per acceptance check. Exit code 0 only
 * when every check passes.
 */

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://www.code-site.art";

/* ─── tiny HTML helpers (regex-based; fine for our own SSR output) ──────── */

const stripScripts = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const decode = (s) =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'");

function getTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decode(stripTags(m[1])) : "";
}
function getMetaDescription(html) {
  const m =
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ??
    html.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  return m ? decode(m[1]) : "";
}
function getH1s(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(stripTags(m[1])),
  );
}
function getCanonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return m ? m[1] : "";
}
function getHreflangs(html) {
  return [
    ...html.matchAll(
      /<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi,
    ),
  ].map((m) => ({ hreflang: m[1], href: m[2] }));
}
function getJsonLd(html) {
  const out = [];
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    out.push(m[1]);
  }
  return out;
}
/** Anchor list: [{href, text}] for internal links, normalized to a path. */
function getInternalLinks(html) {
  const out = [];
  for (const m of html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1];
    const hrefM = attrs.match(/href="([^"]*)"/);
    if (!hrefM) continue;
    let href = decode(hrefM[1]);
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    href = href.split("#")[0].split("?")[0];
    if (!href) continue;
    if (href !== "/" && href.endsWith("/")) href = href.slice(0, -1);
    out.push({ href, text: decode(stripTags(m[2])) });
  }
  return out;
}
/** Body without <header>/<footer>/<nav> subtrees (for "in-content" checks). */
function contentOnly(html) {
  return html
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "");
}

/* ─── crawl ─────────────────────────────────────────────────────────────── */

async function fetchText(url, redirect = "follow") {
  const res = await fetch(url, { redirect });
  return { res, text: redirect === "follow" ? await res.text() : "" };
}

async function sitemapUrls() {
  const { text: index } = await fetchText(`${BASE}/sitemap.xml`);
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const child of children) {
    const local = child.replace(SITE, BASE);
    const { text } = await fetchText(local);
    for (const m of text.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(m[1]);
  }
  return [...new Set(urls)].map((u) => {
    const p = u.replace(SITE, "") || "/";
    return p;
  });
}

/* ─── checks ────────────────────────────────────────────────────────────── */

let passCount = 0;
let failCount = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    passCount++;
    console.log(`  [pass] ${name}`);
  } else {
    failCount++;
    failures.push(name);
    console.log(`  [FAIL] ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

const GENERIC_ANCHOR =
  /^(читайте( тут)?|детальніше|тут|за посиланням|link|here|click here|подробнее|read more)$/i;

const REDIRECTS_301 = [
  ["/services", "/pricing"],
  ["/uk", "/"],
  ["/uk/legal", "/legal"],
  ["/uk/offer", "/offer"],
  ["/uk/services", "/pricing"],
  ["/ru/services", "/ru"],
  ["/ru/public-contract", "/public-contract"],
  ["/portfolio/efedra-sait-dlya-centra-mediciny-2", "/portfolio/efedra-clinic"],
  ["/blog/skilky-koshtuye-sayt-2026", "/blog/vartist-rozrobky-saytu-2026"],
  [
    "/blog/custom-code-website-development-what-it-is-what-it-costs-and-why-it-is-the-best-fit-for-business",
    "/blog/vartist-rozrobky-saytu-2026",
  ],
  [
    "/blog/pochemu-saity-na-kode-rabotayut-bystree-i-prinosyat-bolshe-klientov",
    "/blog/nextjs-proty-wordpress-ta-konstruktoriv",
  ],
  [
    "/blog/pochemu-saity-na-kode-rabotayut-bystree-i-prinosyat-bolshe-klientov-7",
    "/blog/nextjs-proty-wordpress-ta-konstruktoriv",
  ],
];

const main = async () => {
  console.log(`\nSEO verification against ${BASE}\n`);

  /* BUILD checks are implicit: this script requires a running production
     build; build/typecheck results are reported by the caller. */

  const paths = await sitemapUrls();
  console.log(`sitemap URLs: ${paths.length}\n`);

  const pages = new Map(); // path -> parsed page
  for (const path of paths) {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
    const status = res.status;
    const html = status === 200 ? await res.text() : "";
    pages.set(path, {
      status,
      title: getTitle(html),
      description: getMetaDescription(html),
      h1s: getH1s(html),
      canonical: getCanonical(html),
      hreflangs: getHreflangs(html),
      jsonld: getJsonLd(html),
      links: getInternalLinks(html),
      contentLinks: getInternalLinks(contentOnly(html)),
      html,
    });
    process.stdout.write(".");
  }
  console.log("\n");

  /* ── ROUTING ── */
  console.log("ROUTING");
  const notOk = [...pages].filter(([, p]) => p.status !== 200);
  check(
    "every URL in the sitemap returns 200 — zero 404s, zero redirects",
    notOk.length === 0,
    notOk.map(([u, p]) => `${u}:${p.status}`).join(", "),
  );

  let redirOk = true;
  const redirBad = [];
  for (const [src, dst] of REDIRECTS_301) {
    const res = await fetch(`${BASE}${src}`, { redirect: "manual" });
    const loc = (res.headers.get("location") ?? "")
      .replace(BASE, "")
      .replace(SITE, "");
    const single =
      res.status === 301 && (loc === dst || loc === (dst === "/" ? "" : dst));
    if (single) {
      // destination must serve 200 directly (single hop)
      const res2 = await fetch(`${BASE}${dst}`, { redirect: "manual" });
      if (res2.status !== 200) {
        redirOk = false;
        redirBad.push(`${src}→${dst} lands on ${res2.status}`);
      }
    } else {
      redirOk = false;
      redirBad.push(`${src}: ${res.status} → ${loc || "(none)"}`);
    }
  }
  check(
    "every redirect in the mapping table returns 301 in a single hop",
    redirOk,
    redirBad.join("; "),
  );

  const probe302 = ["/", "/pricing", "/seo", "/calculator", "/blog", "/en", "/ru"];
  let no302 = true;
  const bad302 = [];
  for (const p of probe302) {
    const res = await fetch(`${BASE}${p}`, {
      redirect: "manual",
      headers: { "accept-language": "" },
    });
    if (res.status === 302) {
      no302 = false;
      bad302.push(`${p}:302`);
    }
  }
  check("zero 302 responses across known routes", no302, bad302.join(", "));

  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  check(
    "robots.txt disallows /_next/static/ and declares exactly one sitemap",
    /Disallow:\s*\/_next\/static\//.test(robots) &&
      (robots.match(/Sitemap:/gi) ?? []).length === 1,
    robots.slice(0, 200).replace(/\n/g, " | "),
  );

  /* ── METADATA ── */
  console.log("\nMETADATA");
  const multiH1 = [...pages].filter(([, p]) => p.h1s.length !== 1);
  check(
    "every page has exactly one <h1>",
    multiH1.length === 0,
    multiH1.map(([u, p]) => `${u}:${p.h1s.length}`).join(", "),
  );

  const titles = new Map();
  const badTitleLen = [];
  for (const [u, p] of pages) {
    if (!titles.has(p.title)) titles.set(p.title, []);
    titles.get(p.title).push(u);
    if (p.title.length < 30 || p.title.length > 65) {
      badTitleLen.push(`${u} (${p.title.length})`);
    }
  }
  const dupTitles = [...titles].filter(([, us]) => us.length > 1);
  check(
    "every page has a unique <title>",
    dupTitles.length === 0,
    dupTitles.map(([t, us]) => `"${t.slice(0, 40)}" × ${us.length}`).join("; "),
  );
  check(
    "every <title> is 30–65 characters",
    badTitleLen.length === 0,
    badTitleLen.slice(0, 30).join(", "),
  );

  const descs = new Map();
  const badDescLen = [];
  for (const [u, p] of pages) {
    if (!descs.has(p.description)) descs.set(p.description, []);
    descs.get(p.description).push(u);
    if (p.description.length < 120 || p.description.length > 165) {
      badDescLen.push(`${u} (${p.description.length})`);
    }
  }
  const dupDescs = [...descs].filter(([, us]) => us.length > 1);
  check(
    "every page has a unique meta description",
    dupDescs.length === 0,
    dupDescs.map(([, us]) => us.join("=")).join("; "),
  );
  check(
    "every meta description is 120–165 characters",
    badDescLen.length === 0,
    badDescLen.slice(0, 40).join(", "),
  );

  const med = pages.get("/sites-for/medicine");
  check(
    '/sites-for/medicine title contains "Створення медичних сайтів"',
    med?.title.includes("Створення медичних сайтів") ?? false,
    med?.title,
  );
  check(
    '/sites-for/medicine h1 contains "Створення медичних сайтів"',
    med?.h1s[0]?.includes("Створення медичних сайтів") ?? false,
    med?.h1s[0],
  );
  check(
    '/pricing h1 contains "Ціна створення сайту"',
    pages.get("/pricing")?.h1s[0]?.includes("Ціна створення сайту") ?? false,
    pages.get("/pricing")?.h1s[0],
  );
  const seoH1 = pages.get("/seo")?.h1s[0] ?? "";
  check(
    '/seo h1 contains "Просування сайту" and "$300"',
    seoH1.includes("Просування сайту") && seoH1.includes("$300"),
    seoH1,
  );
  check(
    '/calculator h1 contains "Калькулятор вартості сайту"',
    pages.get("/calculator")?.h1s[0]?.includes("Калькулятор вартості сайту") ??
      false,
    pages.get("/calculator")?.h1s[0],
  );

  const calcHtml = pages.get("/calculator")?.html ?? "";
  // Promotion-pricing copy: a sentence carrying both a promotion word and a
  // price word. Links TO /seo (the replacement the task asks for) and their
  // anchors are excluded first.
  const calcText = stripTags(
    stripScripts(contentOnly(calcHtml)).replace(
      /<a\s[^>]*href="\/seo"[\s\S]*?<\/a>/gi,
      "",
    ),
  );
  const promoSentences = calcText
    .split(/[.!?]/)
    .filter(
      (s) =>
        /просуванн|розкрутк/i.test(s) && /ціна|вартість|коштує|\$\d/i.test(s),
    );
  check(
    "/calculator body contains no promotion-pricing copy",
    promoSentences.length === 0,
    promoSentences.slice(0, 2).join(" | "),
  );

  const INDUSTRY_KEYWORDS = {
    "/sites-for/renovation": ["розробка сайту для будівельної компанії", "сайт для будівельної компанії", "розробка сайту для будівельної фірми"],
    "/sites-for/legal": ["створення сайту для юридичної фірми", "розробка сайту для юриста", "сайт під ключ для адвоката"],
    "/sites-for/auto": ["розробка сайту автосервісу", "створення сайту для автосервісу"],
    "/sites-for/real-estate": ["створення сайту нерухомості", "сайт для агентства нерухомості"],
    "/sites-for/finance": ["сайт для фінансової компанії", "лендінг для бухгалтерських послуг"],
    "/sites-for/courses": ["створення сайту для онлайн-курсів"],
    "/sites-for/ecommerce": ["створення інтернет-магазину під ключ"],
  };
  for (const [path, kws] of Object.entries(INDUSTRY_KEYWORDS)) {
    const page = pages.get(path);
    const text =
      (page?.title ?? "") + " " + stripTags(stripScripts(page?.html ?? ""));
    const missing = kws.filter((kw) => !text.toLowerCase().includes(kw.toLowerCase()));
    check(
      `${path} contains its assigned anchor keywords`,
      missing.length === 0,
      missing.length ? `missing: ${missing.join("; ")}` : "",
    );
  }

  /* ── STRUCTURED DATA ── */
  console.log("\nSTRUCTURED DATA");
  const badLd = [];
  for (const [u, p] of pages) {
    if (p.jsonld.length === 0) {
      badLd.push(`${u}: none`);
      continue;
    }
    for (const raw of p.jsonld) {
      try {
        JSON.parse(raw);
      } catch {
        badLd.push(`${u}: parse error`);
      }
    }
  }
  check(
    "every page emits valid JSON-LD",
    badLd.length === 0,
    badLd.slice(0, 6).join(", "),
  );

  const needsCrumbs = paths.filter(
    (p) =>
      /^\/(en\/|ru\/)?(blog|portfolio|sites-for)\/.+/.test(p),
  );
  const noCrumbs = needsCrumbs.filter(
    (p) => !pages.get(p)?.jsonld.some((j) => j.includes('"BreadcrumbList"')),
  );
  check(
    "BreadcrumbList on all blog, portfolio and /sites-for/* pages",
    noCrumbs.length === 0,
    noCrumbs.slice(0, 6).join(", "),
  );

  for (const p of ["/sites-for/medicine", "/pricing", "/seo"]) {
    const ld = pages.get(p)?.jsonld.join("") ?? "";
    const faqM = ld.match(/"FAQPage"[\s\S]*?"mainEntity":\s*\[/);
    const count = faqM ? (ld.match(/"@type":\s*"Question"/g) ?? []).length : 0;
    check(`FAQPage on ${p} with >= 4 questions`, count >= 4, `questions: ${count}`);
  }

  const homeLd = pages.get("/")?.jsonld.join("") ?? "";
  check(
    'Organization on homepage includes alternateName "CodeSite" and "Code Site"',
    homeLd.includes('"CodeSite"') && homeLd.includes('"Code Site"'),
  );

  /* ── INTERNAL LINKS ── */
  console.log("\nINTERNAL LINKS");
  const pairs = new Set();
  const inbound = new Map(); // target -> Set(sources)
  const inboundContent = new Map(); // same, from content region only
  for (const [src, p] of pages) {
    for (const l of p.links) pairs.add(`${src} -> ${l.href}`);
    for (const l of p.contentLinks) {
      if (l.href === src) continue;
      if (!inboundContent.has(l.href)) inboundContent.set(l.href, new Set());
      inboundContent.get(l.href).add(src);
    }
    for (const l of p.links) {
      if (l.href === src) continue;
      if (!inbound.has(l.href)) inbound.set(l.href, new Set());
      inbound.get(l.href).add(src);
    }
  }
  console.log(`  (total unique source→target pairs: ${pairs.size})`);
  check("total internal links >= 900", pairs.size >= 900, `${pairs.size}`);

  const orphans = paths.filter((p) => (inbound.get(p)?.size ?? 0) < 2);
  check(
    "zero orphan pages (every sitemap URL linked from >= 2 pages)",
    orphans.length === 0,
    orphans.slice(0, 8).join(", "),
  );

  const industryPaths = paths.filter((p) => /^\/sites-for\/[^/]+$/.test(p));
  for (const ip of industryPaths) {
    const fromBlog = [...(inboundContent.get(ip) ?? [])].filter((s) =>
      s.startsWith("/blog/"),
    );
    check(
      `${ip} has >= 3 inbound links from /blog/*`,
      fromBlog.length >= 3,
      `${fromBlog.length}`,
    );
    const fromCases = [...(inboundContent.get(ip) ?? [])].filter((s) =>
      s.startsWith("/portfolio/"),
    );
    check(
      `${ip} has >= 2 inbound links from /portfolio/*`,
      fromCases.length >= 2,
      `${fromCases.length}`,
    );
  }

  const COMMERCIAL = /^\/(pricing|calculator|seo|support|landing|corporate-site|online-store|sites-for\/|vs-|portfolio$|contacts)/;
  const ukBlogPaths = paths.filter((p) => /^\/blog\/.+/.test(p));
  const weakPosts = [];
  for (const bp of ukBlogPaths) {
    const out = (pages.get(bp)?.contentLinks ?? []).filter(
      (l) => COMMERCIAL.test(l.href) && l.href !== bp,
    );
    const uniq = new Set(out.map((l) => l.href));
    if (uniq.size < 2) weakPosts.push(`${bp} (${uniq.size})`);
  }
  check(
    "every /blog/* article has >= 2 outbound links to commercial pages",
    weakPosts.length === 0,
    weakPosts.slice(0, 8).join(", "),
  );

  const homeContent = pages.get("/")?.contentLinks ?? [];
  const homeKeyword = homeContent.filter(
    (l) => COMMERCIAL.test(l.href) && l.text.length > 10 && !GENERIC_ANCHOR.test(l.text),
  );
  check(
    "homepage has >= 6 in-content keyword-anchored internal links",
    new Set(homeKeyword.map((l) => l.href)).size >= 6,
    `${new Set(homeKeyword.map((l) => l.href)).size}`,
  );

  const genericHits = [];
  for (const [src, p] of pages) {
    for (const l of p.contentLinks) {
      if (GENERIC_ANCHOR.test(l.text.trim())) genericHits.push(`${src}: "${l.text}"`);
    }
  }
  check(
    "zero internal links with generic anchors",
    genericHits.length === 0,
    genericHits.slice(0, 6).join("; "),
  );

  /* ── I18N ── */
  console.log("\nI18N");
  const badCanon = [];
  for (const [u, p] of pages) {
    const canon = p.canonical.replace(SITE, "") || "/";
    if (canon !== u) badCanon.push(`${u} → ${p.canonical}`);
  }
  check(
    "canonical is self-referencing on every page",
    badCanon.length === 0,
    badCanon.slice(0, 6).join(", "),
  );

  const badHref = [];
  const nonReciprocal = [];
  for (const [u, p] of pages) {
    for (const alt of p.hreflangs) {
      const altPath = alt.href.replace(SITE, "") || "/";
      const target = pages.get(altPath);
      if (!target) {
        // must at least serve 200
        const res = await fetch(`${BASE}${altPath}`, { redirect: "manual" });
        if (res.status !== 200) {
          badHref.push(`${u}: hreflang ${alt.hreflang} → ${altPath} (${res.status})`);
        }
        continue;
      }
      if (target.status !== 200) {
        badHref.push(`${u}: hreflang ${alt.hreflang} → ${altPath} (${target.status})`);
      } else if (
        !target.hreflangs.some((a) => (a.href.replace(SITE, "") || "/") === u)
      ) {
        nonReciprocal.push(`${u} ↔ ${altPath}`);
      }
    }
    if (p.hreflangs.length > 0 && !p.hreflangs.some((a) => a.hreflang === "x-default")) {
      nonReciprocal.push(`${u}: no x-default`);
    }
  }
  check(
    "no hreflang entry points at a URL that 404s or redirects",
    badHref.length === 0,
    badHref.slice(0, 6).join(", "),
  );
  check(
    "hreflang sets are reciprocal and include x-default",
    nonReciprocal.length === 0,
    nonReciprocal.slice(0, 6).join(", "),
  );

  /* ── summary ── */
  console.log(`\n${passCount} passed, ${failCount} failed`);
  if (failCount) {
    console.log("failing checks:");
    for (const f of failures) console.log(`  - ${f}`);
  }
  process.exit(failCount ? 1 : 0);
};

main().catch((e) => {
  console.error(e);
  process.exit(2);
});

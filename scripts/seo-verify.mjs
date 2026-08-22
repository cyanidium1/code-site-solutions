/**
 * SEO acceptance verification — round 2.
 *
 * Runs against PRODUCTION by default (the round-1 suite ran against
 * localhost and three checks passed falsely because of it):
 *
 *   node scripts/seo-verify.mjs                       # https://www.code-site.art
 *   node scripts/seo-verify.mjs http://localhost:3008 # local prod build
 *
 * Three fixes over round 1, all of which previously produced false passes:
 *
 *   1. Requests NEVER follow redirects (`redirect: "manual"`) and never
 *      send cookies. The old suite followed the `/` -> `/en` redirect
 *      silently, so its canonical + hreflang checks validated `/en` while
 *      claiming to validate `/`.
 *   2. Locale-sensitive checks are repeated under three explicit
 *      `Accept-Language` values AND with the header absent.
 *   3. Internal links are counted IN-BODY only — `<header>`, `<footer>`
 *      and `<nav>` subtrees are stripped first. The old suite counted the
 *      global nav on every page and reported 6,999 links, which was really
 *      ~205 pages x ~34 chrome links that predate this project.
 */

const BASE = (process.argv[2] ?? "https://www.code-site.art").replace(/\/$/, "");
const SITE = "https://www.code-site.art";

/* ─── fetch helpers ─────────────────────────────────────────────────────── */

/** Never follows redirects, never sends cookies. */
async function get(path, { acceptLanguage } = {}) {
  const headers = {};
  if (acceptLanguage) headers["Accept-Language"] = acceptLanguage;
  const res = await fetch(`${BASE}${path}`, { redirect: "manual", headers });
  const body = res.status === 200 ? await res.text() : "";
  return { status: res.status, headers: res.headers, html: body };
}

/* ─── HTML helpers ──────────────────────────────────────────────────────── */

const ENTITIES = [
  ["&amp;", "&"],
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&quot;", '"'],
  ["&#x27;", "'"],
  ["&#39;", "'"],
];
function decode(s) {
  let out = s;
  for (const [from, to] of ENTITIES) out = out.split(from).join(to);
  return out;
}
const stripScripts = (s) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
const stripTags = (s) => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Page chrome removed: header, footer and nav subtrees. */
const inBody = (html) =>
  html
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ");

const title = (h) => {
  const m = h.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decode(stripTags(m[1])) : "";
};
const metaDesc = (h) => {
  const m =
    h.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ??
    h.match(/<meta\s+content="([^"]*)"\s+name="description"/i);
  return m ? decode(m[1]) : "";
};
const h1s = (h) =>
  [...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(stripTags(m[1])));
const canonical = (h) => {
  const m = h.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return m ? m[1] : "";
};
const htmlLang = (h) => {
  const m = h.match(/<html[^>]*\slang="([^"]*)"/i);
  return m ? m[1] : "";
};
const hreflangs = (h) =>
  [...h.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/gi)].map(
    (m) => ({ hreflang: m[1], href: m[2] }),
  );
const jsonLd = (h) =>
  [...h.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1],
  );

/** Internal links as {href, text}, normalized to a path. */
function links(html) {
  const out = [];
  for (const m of html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const hrefM = m[1].match(/href="([^"]*)"/);
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

/* ─── reporting ─────────────────────────────────────────────────────────── */

let pass = 0;
const failures = [];
function check(name, ok, detail = "") {
  if (ok) {
    pass++;
    console.log(`  [pass] ${name}`);
  } else {
    failures.push(name);
    console.log(`  [FAIL] ${name}${detail ? ` — ${detail}` : ""}`);
  }
}
const info = (line) => console.log(`  [info] ${line}`);

/* ─── constants ─────────────────────────────────────────────────────────── */

const GENERIC =
  /^(читайте( тут)?|детальніше|тут|за посиланням|link|here|click here|подробнее|read more|дізнатися більше)$/i;
const COMMERCIAL =
  /^\/(pricing|calculator|seo|support|landing|corporate-site|online-store|sites-for\/|vs-|portfolio$|contacts)/;
const REDIRECTS = [
  ["/services", "/pricing"],
  ["/uk", "/"],
  ["/uk/legal", "/legal"],
  ["/uk/offer", "/offer"],
  ["/uk/services", "/pricing"],
  ["/ru/services", "/ru"],
  ["/ru/public-contract", "/public-contract"],
  ["/portfolio/efedra-sait-dlya-centra-mediciny-2", "/portfolio/efedra-clinic"],
  ["/blog/skilky-koshtuye-sayt-2026", "/blog/vartist-rozrobky-saytu-2026"],
  ["/blog/skilky-koshtuye-zrobyty-sait-2026", "/blog/vartist-rozrobky-saytu-2026"],
  [
    "/blog/custom-code-website-development-what-it-is-what-it-costs-and-why-it-is-the-best-fit-for-business",
    "/blog/vartist-rozrobky-saytu-2026",
  ],
  [
    "/blog/pochemu-saity-na-kode-rabotayut-bystree-i-prinosyat-bolshe-klientov",
    "/blog/nextjs-proty-wordpress-ta-konstruktoriv",
  ],
];
const VERIFIED = {
  "/pricing": {
    title: "Ціна створення сайту 2026 — фіксовані пакети | Code-Site.Art",
    h1: "Ціна створення сайту у 2026 — фіксовані пакети від $800",
  },
  "/seo": {
    title: "Просування сайту: ціна від $300/міс | Code-Site.Art",
    h1: "Просування сайту — ціна від $300/міс, без «гарантій топ-1»",
  },
  "/calculator": {
    title: "Калькулятор вартості сайту — розрахувати ціну онлайн",
    h1: "Калькулятор вартості сайту: дізнайтеся ціну за 60 секунд",
  },
};
const INDUSTRY_KEYWORDS = {
  "/sites-for/renovation": [
    "розробка сайту для будівельної компанії",
    "сайт для будівельної компанії",
  ],
  "/sites-for/legal": ["створення сайту для юридичної фірми", "сайт під ключ для адвоката"],
  "/sites-for/auto": ["розробка сайту автосервісу"],
  "/sites-for/real-estate": ["створення сайту нерухомості", "сайт для агентства нерухомості"],
  "/sites-for/finance": ["сайт для фінансової компанії"],
  "/sites-for/courses": ["створення сайту для онлайн-курсів"],
  "/sites-for/ecommerce": ["створення інтернет-магазину під ключ"],
};

/* ─── main ──────────────────────────────────────────────────────────────── */

const main = async () => {
  console.log(`\nSEO verification (round 2) against ${BASE}\n`);

  /* ── HOMEPAGE LOCALE ── */
  console.log("HOMEPAGE LOCALE");
  const langCases = [
    ["en-US", "en-US,en;q=0.9"],
    ["ru-RU", "ru-RU,ru;q=0.9"],
    ["uk-UA", "uk-UA,uk;q=0.9"],
    ["(no header)", undefined],
  ];
  const homeResults = [];
  for (const [label, al] of langCases) {
    const r = await get("/", { acceptLanguage: al });
    homeResults.push({ label, r });
    check(
      `GET / with ${label} → 200, no redirect, <html lang="uk">`,
      r.status === 200 && htmlLang(r.html) === "uk",
      r.status !== 200
        ? `status ${r.status} → ${r.headers.get("location")}`
        : `lang=${htmlLang(r.html)}`,
    );
  }
  // RFC 3986: an empty path and "/" are the same resource, and Next
  // normalizes the homepage canonical to the bare origin. Both forms are
  // accepted; what the audit actually flagged — a canonical that did not
  // resolve to itself because `/` redirected — is covered by the 200 +
  // no-redirect checks above.
  const canonOk = (h) => canonical(h) === `${SITE}/` || canonical(h) === SITE;
  check(
    `canonical on / is exactly ${SITE}/ in all four cases`,
    homeResults.every(({ r }) => r.status === 200 && canonOk(r.html)),
    homeResults
      .map(({ label, r }) => `${label}:${r.status === 200 ? canonical(r.html) : r.status}`)
      .join(" | "),
  );

  const vary = homeResults[0].r.headers.get("vary") ?? "";
  const langsSeen = new Set(
    homeResults.filter(({ r }) => r.status === 200).map(({ r }) => htmlLang(r.html)),
  );
  const adaptive =
    langsSeen.size > 1 || homeResults.some(({ r }) => r.status >= 300 && r.status < 400);
  check(
    "/ either includes Accept-Language in Vary, or is not locale-adaptive at all",
    !adaptive || /accept-language/i.test(vary),
    `adaptive=${adaptive}, vary="${vary}"`,
  );

  const uk = await get("/uk");
  const ukLoc = (uk.headers.get("location") ?? "").replace(SITE, "").replace(BASE, "") || "/";
  let ukOk = false;
  let ukNote = `${uk.status} → ${ukLoc}`;
  if (uk.status === 301 && (ukLoc === "/" || ukLoc === "")) {
    const hop2 = await get("/", { acceptLanguage: "en-US,en;q=0.9" });
    ukOk = hop2.status === 200;
    ukNote += ` → ${hop2.status}`;
  }
  check("/uk 301s to / in a single hop and lands on /, not /en", ukOk, ukNote);

  for (const [path, lang] of [
    ["/en", "en"],
    ["/ru", "ru"],
  ]) {
    const r = await get(path, { acceptLanguage: "uk-UA,uk;q=0.9" });
    check(
      `${path} still serves ${lang} with a self-referencing canonical`,
      r.status === 200 && htmlLang(r.html) === lang && canonical(r.html) === `${SITE}${path}`,
      `status ${r.status}, lang=${htmlLang(r.html)}, canonical=${canonical(r.html)}`,
    );
  }

  const homeOk = homeResults.find(({ r }) => r.status === 200);
  let hrefOk = true;
  const hrefNote = [];
  if (homeOk) {
    for (const a of hreflangs(homeOk.r.html).filter(
      (x) => x.hreflang === "uk" || x.hreflang === "x-default",
    )) {
      const p = a.href.replace(SITE, "") || "/";
      const r = await get(p);
      if (r.status !== 200) {
        hrefOk = false;
        hrefNote.push(`${a.hreflang}→${p}:${r.status}`);
      }
    }
  }
  check("hreflang uk and x-default point at a 200, no-redirect URL", hrefOk, hrefNote.join(", "));

  /* ── crawl the sitemap ── */
  const idx = await get("/sitemap.xml");
  const children = [...idx.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const uaUrls = [];
  const allUrls = [];
  for (const child of children) {
    const r = await get(child.replace(SITE, ""));
    const locs = [...r.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1].replace(SITE, "") || "/",
    );
    allUrls.push(...locs);
    if (child.includes("sitemap-ua")) uaUrls.push(...locs);
  }
  const paths = [...new Set(allUrls)];
  console.log(`\n  (sitemap: ${paths.length} URLs, ${uaUrls.length} UA)\n`);

  const pages = new Map();
  for (const p of paths) {
    const r = await get(p, { acceptLanguage: "uk-UA,uk;q=0.9" });
    const body = inBody(r.html);
    pages.set(p, {
      status: r.status,
      title: title(r.html),
      description: metaDesc(r.html),
      h1s: h1s(r.html),
      canonical: canonical(r.html),
      hreflangs: hreflangs(r.html),
      jsonld: jsonLd(r.html),
      bodyLinks: links(body),
      text: stripTags(stripScripts(body)),
    });
    process.stdout.write(".");
  }
  console.log("\n");

  /* ── INTERNAL LINKS ── */
  console.log("INTERNAL LINKS  (in-body only: header/footer/nav stripped)");
  const inbound = new Map();
  let total = 0;
  const perPage = [];
  for (const [src, pg] of pages) {
    const uniq = new Set(pg.bodyLinks.map((l) => l.href).filter((h) => h !== src));
    total += uniq.size;
    perPage.push(uniq.size);
    for (const h of uniq) {
      if (!inbound.has(h)) inbound.set(h, new Set());
      inbound.get(h).add(src);
    }
  }
  perPage.sort((a, b) => a - b);
  info(
    `in-body internal links: ${total} total, median ${perPage[Math.floor(perPage.length / 2)]} per page (baseline 473 / 6)`,
  );
  const topTargets = [...inbound.entries()]
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 8)
    .map(([h, s]) => `${h}:${s.size}`);
  info(`most-linked: ${topTargets.join(", ")}`);

  check("in-body internal links across sitemap >= 600", total >= 600, `${total}`);

  const under = paths.filter((p) => (inbound.get(p)?.size ?? 0) < 2);
  check(
    "every sitemap URL has >= 2 in-body inbound links",
    under.length === 0,
    `${under.length} fail: ${under.slice(0, 12).join(", ")}`,
  );

  const seoIn = inbound.get("/seo")?.size ?? 0;
  check("/seo has >= 15 in-body inbound links", seoIn >= 15, `${seoIn}`);

  const industries = paths.filter((p) => /^\/sites-for\/[^/]+$/.test(p));
  const indUnder = industries.filter((p) => (inbound.get(p)?.size ?? 0) < 2);
  check(
    "every /sites-for/* has >= 2 in-body inbound links",
    indUnder.length === 0,
    indUnder.map((p) => `${p}:${inbound.get(p)?.size ?? 0}`).join(", "),
  );

  const ukBlog = paths.filter((p) => /^\/blog\/.+/.test(p));
  const weak = ukBlog.filter((p) => {
    const outs = new Set(
      (pages.get(p)?.bodyLinks ?? [])
        .map((l) => l.href)
        .filter((h) => COMMERCIAL.test(h) && h !== p),
    );
    return outs.size < 2;
  });
  check(
    "every /blog/* has >= 2 outbound in-body commercial links",
    weak.length === 0,
    weak.join(", "),
  );

  const generic = [];
  for (const [src, pg] of pages) {
    for (const l of pg.bodyLinks) {
      if (GENERIC.test(l.text.trim())) generic.push(`${src}: "${l.text}"`);
    }
  }
  check(
    "zero in-body links with generic anchors",
    generic.length === 0,
    generic.slice(0, 6).join("; "),
  );

  /* ── METADATA ── */
  console.log("\nMETADATA");
  const badH1 = [...pages].filter(([, p]) => p.h1s.length !== 1);
  check(
    "every page has exactly one <h1>",
    badH1.length === 0,
    badH1.map(([u, p]) => `${u}:${p.h1s.length}`).join(", "),
  );

  const byTitle = new Map();
  const badTLen = [];
  for (const [u, p] of pages) {
    if (!byTitle.has(p.title)) byTitle.set(p.title, []);
    byTitle.get(p.title).push(u);
    if (p.title.length < 30 || p.title.length > 65) badTLen.push(`${u}(${p.title.length})`);
  }
  const dupT = [...byTitle].filter(([, us]) => us.length > 1);
  check(
    "every page has a unique <title>",
    dupT.length === 0,
    `${dupT.length} dupes: ${dupT.slice(0, 5).map(([t]) => `"${t.slice(0, 30)}"`).join(", ")}`,
  );
  check(
    "every <title> is 30–65 characters",
    badTLen.length === 0,
    `${badTLen.length}: ${badTLen.slice(0, 12).join(", ")}`,
  );

  const byDesc = new Map();
  const badDLen = [];
  for (const [u, p] of pages) {
    if (!byDesc.has(p.description)) byDesc.set(p.description, []);
    byDesc.get(p.description).push(u);
    if (p.description.length < 120 || p.description.length > 165)
      badDLen.push(`${u}(${p.description.length})`);
  }
  const dupD = [...byDesc].filter(([, us]) => us.length > 1);
  check("every page has a unique meta description", dupD.length === 0, `${dupD.length} dupes`);
  check(
    "every meta description is 120–165 characters",
    badDLen.length === 0,
    `${badDLen.length}: ${badDLen.slice(0, 12).join(", ")}`,
  );

  const med = pages.get("/sites-for/medicine");
  check(
    'medicine title contains "Створення медичних сайтів"',
    med?.title.includes("Створення медичних сайтів") ?? false,
    med?.title,
  );
  check(
    'medicine h1 contains "Створення медичних сайтів"',
    med?.h1s[0]?.includes("Створення медичних сайтів") ?? false,
    med?.h1s[0],
  );

  for (const [path, kws] of Object.entries(INDUSTRY_KEYWORDS)) {
    const pg = pages.get(path);
    const hay = `${pg?.title ?? ""} ${pg?.text ?? ""}`.toLowerCase();
    const missing = kws.filter((k) => !hay.includes(k.toLowerCase()));
    check(`${path} contains its assigned anchor keywords`, missing.length === 0, missing.join("; "));
  }

  for (const [path, want] of Object.entries(VERIFIED)) {
    const pg = pages.get(path);
    check(
      `${path} keeps its verified title + H1`,
      pg?.title === want.title && pg?.h1s[0] === want.h1,
      `title="${pg?.title}" h1="${pg?.h1s[0]}"`,
    );
  }

  /* ── STRUCTURED DATA ── */
  console.log("\nSTRUCTURED DATA");
  const badLd = [];
  for (const [u, p] of pages) {
    if (!p.jsonld.length) {
      badLd.push(`${u}:none`);
      continue;
    }
    for (const raw of p.jsonld) {
      try {
        JSON.parse(raw);
      } catch {
        badLd.push(`${u}:parse`);
      }
    }
  }
  check("every page emits valid JSON-LD", badLd.length === 0, badLd.slice(0, 6).join(", "));

  const needCrumbs = paths.filter((p) => /^\/(en\/|ru\/)?(blog|portfolio|sites-for)\/.+/.test(p));
  const noCrumbs = needCrumbs.filter(
    (p) => !pages.get(p)?.jsonld.some((j) => j.includes('"BreadcrumbList"')),
  );
  check(
    "BreadcrumbList on all blog, portfolio and /sites-for/* pages",
    noCrumbs.length === 0,
    noCrumbs.slice(0, 6).join(", "),
  );

  for (const p of ["/sites-for/medicine", "/pricing", "/seo"]) {
    const ld = pages.get(p)?.jsonld.join("") ?? "";
    const n = ld.includes('"FAQPage"') ? (ld.match(/"@type":\s*"Question"/g) ?? []).length : 0;
    check(`FAQPage on ${p} with >= 4 questions`, n >= 4, `${n}`);
  }

  const homeLd = pages.get("/")?.jsonld.join("") ?? "";
  check(
    'Organization on / includes alternateName "CodeSite" and "Code Site"',
    homeLd.includes('"CodeSite"') && homeLd.includes('"Code Site"'),
  );

  /* ── ROUTING ── */
  console.log("\nROUTING");
  const robots = (await get("/robots.txt")).html;
  check(
    "robots.txt does NOT disallow /_next/static/, keeps /stories/, one Sitemap",
    !/Disallow:\s*\/_next\/static\//.test(robots) &&
      /Disallow:\s*\/stories\//.test(robots) &&
      (robots.match(/Sitemap:/gi) ?? []).length === 1,
    robots.replace(/\n/g, " | ").slice(0, 160),
  );

  const notOk = [...pages].filter(([, p]) => p.status !== 200);
  check(
    "every URL in the sitemap returns 200 — zero 404s, zero redirects",
    notOk.length === 0,
    notOk.map(([u, p]) => `${u}:${p.status}`).join(", "),
  );

  const badRedir = [];
  for (const [src, dst] of REDIRECTS) {
    const r = await get(src);
    const loc = (r.headers.get("location") ?? "").replace(BASE, "").replace(SITE, "") || "/";
    if (r.status !== 301 || loc !== dst) {
      badRedir.push(`${src}:${r.status}→${loc}`);
      continue;
    }
    const final = await get(dst);
    if (final.status !== 200) badRedir.push(`${src}→${dst} lands ${final.status}`);
  }
  check(
    "every mapped redirect returns 301 in a single hop",
    badRedir.length === 0,
    badRedir.join("; "),
  );

  const probe = ["/", "/pricing", "/seo", "/calculator", "/blog", "/en", "/ru", "/support"];
  const bad302 = [];
  for (const p of probe) {
    for (const al of ["uk-UA,uk;q=0.9", "en-US,en;q=0.9", undefined]) {
      const r = await get(p, { acceptLanguage: al });
      if (r.status === 302 || r.status === 307) bad302.push(`${p}[${al ?? "none"}]:${r.status}`);
    }
  }
  check("zero 302/307 responses across known routes", bad302.length === 0, bad302.join(", "));

  /* ── summary ── */
  const totalChecks = pass + failures.length;
  console.log(`\n${pass}/${totalChecks} passed, ${failures.length} failed`);
  if (failures.length) {
    console.log("failing checks:");
    for (const f of failures) console.log(`  - ${f}`);
  }
  process.exit(failures.length ? 1 : 0);
};

main().catch((e) => {
  console.error(e);
  process.exit(2);
});

import { mkdir } from "node:fs/promises";
import path from "node:path";

import {
  chromium,
  devices,
  type Browser,
  type Page,
} from "playwright";

import type {
  ExtractedPageData,
  PageData,
  RawData,
  SiteConfig,
} from "./types";

const DESKTOP_VIEWPORT = { width: 1440, height: 1200 };
const MOBILE_DEVICE = devices["iPhone 13"];
const NAV_TIMEOUT = 60_000;
const NETWORK_IDLE_TIMEOUT = 15_000;
const TEXT_PREVIEW_LIMIT = 8_000;

// Best-effort cookie / consent dismissal. We try a handful of well-known
// selectors first, then fall back to clicking any button whose label looks
// like an "accept" action (EN / RU / UA). Everything is wrapped so a missing
// banner never aborts the crawl.
const COOKIE_SELECTORS = [
  "#onetrust-accept-btn-handler",
  "[aria-label*='accept' i]",
  ".cookie-accept",
  ".cc-allow",
  "[id*='cookie'] button",
  "[class*='cookie'] button",
];

const COOKIE_TEXTS = [
  "accept all",
  "accept",
  "i agree",
  "agree",
  "allow all",
  "got it",
  "ok",
  "принять все",
  "принять",
  "согласен",
  "хорошо",
  "прийняти",
  "погоджуюсь",
  "дозволити",
];

/** "/" -> "home", "/about" -> "about", "/a/b" -> "a-b". */
export function pageLabel(p: string): string {
  const clean = p.replace(/^\/+|\/+$/g, "");
  return clean === "" ? "home" : clean.replace(/\//g, "-");
}

async function gotoSafe(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  // networkidle is the goal, but chatty sites (analytics, chat widgets) may
  // never settle — wait for it, then move on regardless.
  await page
    .waitForLoadState("networkidle", { timeout: NETWORK_IDLE_TIMEOUT })
    .catch(() => {});
}

// Many sites reveal content on scroll (IntersectionObserver / AOS-style
// animations) and lazy-load images. A bare screenshot can catch those blocks
// mid-animation or unloaded. So before extracting/snapshotting we walk the
// whole page top → bottom → top to fire every reveal and trigger lazy loads,
// then wait for the network to settle and give CSS transitions a moment.
async function settlePage(page: Page): Promise<void> {
  await page
    .evaluate(async () => {
      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));
      const pageHeight = () =>
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
        );

      const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
      // Height can grow as lazy content loads, so re-read it each iteration
      // and cap the number of steps to avoid an infinite loop.
      for (let y = 0, guard = 0; y < pageHeight() && guard < 200; guard++) {
        window.scrollTo(0, y);
        await sleep(120);
        y += step;
      }
      window.scrollTo(0, pageHeight());
      await sleep(300);
      window.scrollTo(0, 0);
      await sleep(300);
    })
    .catch(() => {});
  // Lazy images that just entered the viewport may still be fetching.
  await page
    .waitForLoadState("networkidle", { timeout: NETWORK_IDLE_TIMEOUT })
    .catch(() => {});
  // Final settle so in-flight CSS transitions finish before we snapshot.
  await page.waitForTimeout(600);
}

async function dismissPopups(page: Page): Promise<void> {
  try {
    for (const sel of COOKIE_SELECTORS) {
      const el = page.locator(sel).first();
      if ((await el.count()) && (await el.isVisible().catch(() => false))) {
        await el.click({ timeout: 2_000 }).catch(() => {});
        return;
      }
    }
    for (const text of COOKIE_TEXTS) {
      const btn = page
        .getByRole("button", { name: new RegExp(text, "i") })
        .first();
      if ((await btn.count()) && (await btn.isVisible().catch(() => false))) {
        await btn.click({ timeout: 2_000 }).catch(() => {});
        return;
      }
    }
  } catch {
    // Popups are nice-to-dismiss, never required.
  }
}

async function extractPageData(page: Page): Promise<ExtractedPageData> {
  return page.evaluate((textLimit: number): ExtractedPageData => {
    const clean = (el: Element | null): string =>
      (el?.textContent ?? "").replace(/\s+/g, " ").trim();

    const pickAll = (selector: string): string[] =>
      Array.from(document.querySelectorAll(selector))
        .map((el) => clean(el))
        .filter(Boolean);

    const title = document.title ?? "";
    const metaDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content")
        ?.trim() ?? "";

    const origin = location.origin;
    const internalLinks: { href: string; text: string }[] = [];
    const externalLinks: { href: string; text: string }[] = [];
    const seenLinks = new Set<string>();
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = (a as HTMLAnchorElement).href;
      if (
        !href ||
        href.startsWith("javascript:") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }
      if (seenLinks.has(href)) return;
      seenLinks.add(href);
      const rec = { href, text: clean(a) };
      try {
        if (new URL(href).origin === origin) internalLinks.push(rec);
        else externalLinks.push(rec);
      } catch {
        /* ignore malformed URLs */
      }
    });

    const images: { src: string; alt: string }[] = [];
    const seenImg = new Set<string>();
    document.querySelectorAll("img").forEach((img) => {
      const el = img as HTMLImageElement;
      const src = el.currentSrc || el.getAttribute("src") || "";
      if (!src || seenImg.has(src)) return;
      seenImg.add(src);
      images.push({ src, alt: el.getAttribute("alt") ?? "" });
    });

    // visibleTextPreview: the meaningful copy blocks only, de-duped and capped.
    const blocks: string[] = [];
    document
      .querySelectorAll("h1,h2,h3,p,li,button,a")
      .forEach((el) => {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return;
        const text = clean(el);
        if (text) blocks.push(text);
      });
    let visibleTextPreview = Array.from(new Set(blocks)).join("\n");
    if (visibleTextPreview.length > textLimit) {
      visibleTextPreview = visibleTextPreview.slice(0, textLimit);
    }

    return {
      title,
      metaDescription,
      h1: pickAll("h1"),
      h2: pickAll("h2"),
      h3: pickAll("h3"),
      visibleTextPreview,
      internalLinks,
      externalLinks,
      images,
    };
  }, TEXT_PREVIEW_LIMIT);
}

export async function launchBrowser(): Promise<Browser> {
  return chromium.launch();
}

/**
 * Crawl every configured path of a site, writing full-page desktop + mobile
 * screenshots into `outputDir` and returning the structured data. Page-level
 * failures are logged and skipped so one bad URL doesn't sink the whole run.
 */
export async function crawlSite(
  browser: Browser,
  site: SiteConfig,
  outputDir: string,
): Promise<RawData> {
  const paths = site.paths?.length ? site.paths : ["/"];
  const desktopCtx = await browser.newContext({ viewport: DESKTOP_VIEWPORT });
  const mobileCtx = await browser.newContext({ ...MOBILE_DEVICE });

  // tsx/esbuild transpiles `page.evaluate`'s callback with `keepNames`, which
  // injects a `__name` helper into the serialized source. That helper isn't
  // defined in the browser, so shim it as identity before any page script runs.
  const NAME_SHIM = "globalThis.__name = globalThis.__name || ((fn) => fn);";
  await desktopCtx.addInitScript(NAME_SHIM);
  await mobileCtx.addInitScript(NAME_SHIM);

  // Screenshots live in a dedicated subfolder so the site folder root stays
  // readable (raw-data.json, content-summary.md, case-final.*).
  const shotsDir = path.join(outputDir, "screenshots");
  await mkdir(shotsDir, { recursive: true });

  const pages: PageData[] = [];

  try {
    for (const p of paths) {
      const url = new URL(p, site.url).href;
      const label = pageLabel(p);
      // Paths stored in the data are relative to the site's output folder.
      const desktopShot = `screenshots/desktop-${label}.png`;
      const mobileShot = `screenshots/mobile-${label}.png`;

      let extracted: ExtractedPageData | null = null;

      const dPage = await desktopCtx.newPage();
      try {
        await gotoSafe(dPage, url);
        await dismissPopups(dPage);
        await settlePage(dPage);
        extracted = await extractPageData(dPage);
        await dPage.screenshot({
          path: path.join(outputDir, desktopShot),
          fullPage: true,
        });
      } catch (err) {
        console.warn(`  ! desktop ${url}: ${(err as Error).message}`);
      } finally {
        await dPage.close();
      }

      const mPage = await mobileCtx.newPage();
      try {
        await gotoSafe(mPage, url);
        await dismissPopups(mPage);
        await settlePage(mPage);
        await mPage.screenshot({
          path: path.join(outputDir, mobileShot),
          fullPage: true,
        });
      } catch (err) {
        console.warn(`  ! mobile ${url}: ${(err as Error).message}`);
      } finally {
        await mPage.close();
      }

      if (extracted) {
        pages.push({
          ...extracted,
          url,
          screenshots: [desktopShot, mobileShot],
        });
      }
    }
  } finally {
    await desktopCtx.close();
    await mobileCtx.close();
  }

  return { site, crawledAt: new Date().toISOString(), pages };
}

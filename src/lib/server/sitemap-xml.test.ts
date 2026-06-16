import test from "node:test";
import assert from "node:assert/strict";

import { escapeXml, renderUrlset, renderSitemapIndex } from "./sitemap-xml";
import type { SitemapEntry } from "./sitemap-data";

test("escapeXml escapes the five XML entities", () => {
  assert.equal(escapeXml(`a&b<c>d"e'f`), "a&amp;b&lt;c&gt;d&quot;e&apos;f");
});

test("renderUrlset includes XML decl, stylesheet PI and namespaces", () => {
  const xml = renderUrlset([]);
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'));
  assert.ok(xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  assert.ok(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
});

test("renderUrlset emits loc/lastmod/changefreq/priority and alternates", () => {
  const entry: SitemapEntry = {
    url: "https://www.code-site.art/blog/x",
    lastModified: new Date("2025-06-01T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: {
      languages: {
        uk: "https://www.code-site.art/blog/x",
        en: "https://www.code-site.art/en/blog/x-en",
        "x-default": "https://www.code-site.art/blog/x",
      },
    },
  };
  const xml = renderUrlset([entry]);
  assert.ok(xml.includes("<loc>https://www.code-site.art/blog/x</loc>"));
  assert.ok(xml.includes("<lastmod>2025-06-01T00:00:00.000Z</lastmod>"));
  assert.ok(xml.includes("<changefreq>monthly</changefreq>"));
  assert.ok(xml.includes("<priority>0.6</priority>"));
  assert.ok(
    xml.includes(
      '<xhtml:link rel="alternate" hreflang="en" href="https://www.code-site.art/en/blog/x-en"/>',
    ),
  );
});

test("renderUrlset escapes ampersands in URLs", () => {
  const entry: SitemapEntry = {
    url: "https://www.code-site.art/x?a=1&b=2",
    lastModified: new Date("2025-06-01T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: 0.5,
  };
  assert.ok(
    renderUrlset([entry]).includes(
      "<loc>https://www.code-site.art/x?a=1&amp;b=2</loc>",
    ),
  );
});

test("renderSitemapIndex lists each sitemap with loc and lastmod", () => {
  const xml = renderSitemapIndex([
    {
      loc: "https://www.code-site.art/sitemap-ua.xml",
      lastmod: "2026-01-01T00:00:00.000Z",
    },
  ]);
  assert.ok(xml.includes("<sitemapindex"));
  assert.ok(xml.includes("<loc>https://www.code-site.art/sitemap-ua.xml</loc>"));
  assert.ok(xml.includes("<lastmod>2026-01-01T00:00:00.000Z</lastmod>"));
});

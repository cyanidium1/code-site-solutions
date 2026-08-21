import test from "node:test";
import assert from "node:assert/strict";

import { buildEntries } from "./sitemap-data";
import { fromWire } from "@/lib/shared/i18n-registry-types";
import type {
  BlogPostListItem,
  CaseStudyRef,
  IndustryPageRef,
} from "@/types/sanity";

function baseInput(
  en: { industries?: string[]; cases?: string[]; blogPairs?: Array<[string, string]> } = {},
) {
  return {
    industryPages: [] as IndustryPageRef[],
    caseStudies: [] as CaseStudyRef[],
    blogPosts: [] as BlogPostListItem[],
    registry: fromWire({
      en: {
        industries: en.industries ?? [],
        cases: en.cases ?? [],
        blogPairs: en.blogPairs ?? [],
      },
    }),
  };
}

test("homepage emits UA + EN entries with shared alternates", () => {
  const { uk, en } = buildEntries(baseInput());
  const home = uk.find((e) => e.url.endsWith("code-site.art"));
  assert.ok(home, "UA homepage entry present");
  assert.ok(home!.alternates, "homepage has alternates");
  assert.equal(en.some((e) => e.url.endsWith("/en")), true);
});

test("industry page without EN twin appears only in uk", () => {
  const input = baseInput();
  input.industryPages = [{ _id: "i1", slug: "medicine" } as IndustryPageRef];
  const { uk, en } = buildEntries(input);
  assert.equal(uk.some((e) => e.url.endsWith("/sites-for/medicine")), true);
  assert.equal(en.some((e) => e.url.endsWith("/sites-for/medicine")), false);
});

test("industry page with EN twin appears in both with matching alternates", () => {
  const input = baseInput({ industries: ["medicine"] });
  input.industryPages = [{ _id: "i1", slug: "medicine" } as IndustryPageRef];
  const { uk, en } = buildEntries(input);
  const ukEntry = uk.find((e) => e.url.endsWith("/sites-for/medicine"));
  const enEntry = en.find((e) => e.url.endsWith("/en/sites-for/medicine"));
  assert.ok(ukEntry?.alternates && enEntry?.alternates);
  assert.equal(ukEntry!.alternates!.languages["en-GB"], enEntry!.url);
});

test("case study EN entry only when registry reports EN content", () => {
  const input = baseInput({ cases: ["has-en"] });
  input.caseStudies = [
    { _id: "c1", slug: "no-en" } as CaseStudyRef,
    { _id: "c2", slug: "has-en", title: { en: "X" } } as CaseStudyRef,
  ];
  const { en } = buildEntries(input);
  assert.equal(en.some((e) => e.url.endsWith("/en/portfolio/has-en")), true);
  assert.equal(en.some((e) => e.url.endsWith("/en/portfolio/no-en")), false);
});

test("blog uses publishedAt for lastModified and gates EN on registry pair", () => {
  const input = baseInput({ blogPairs: [["pair", "pair-en"]] });
  input.blogPosts = [
    {
      _id: "b1",
      slugs: { uk: { current: "ua-only" } },
      publishedAt: "2025-05-01T00:00:00.000Z",
    } as BlogPostListItem,
    {
      _id: "b2",
      slugs: { uk: { current: "pair" }, en: { current: "pair-en" } },
      title: { uk: "Пара", en: "Pair" },
      publishedAt: "2025-06-01T00:00:00.000Z",
    } as BlogPostListItem,
  ];
  const { uk, en } = buildEntries(input);
  const uaOnly = uk.find((e) => e.url.endsWith("/blog/ua-only"));
  assert.equal(uaOnly!.lastModified?.toISOString(), "2025-05-01T00:00:00.000Z");
  assert.equal(en.some((e) => e.url.endsWith("/en/blog/pair-en")), true);
  assert.equal(en.some((e) => e.url.endsWith("/blog/ua-only")), false);
});

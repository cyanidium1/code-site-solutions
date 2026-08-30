import test from "node:test";
import assert from "node:assert/strict";

import { buildJsonLd, buildReviewNodes, organizationNode } from "./jsonld";
import { ORG_ID } from "@/constants/site";

const SEED = [
  {
    body: "Great work.",
    authorName: "Client",
    rating: 5,
    datePublished: "2026-06-04",
  },
];

/** A review of something other than ourselves — the only eligible shape. */
const PRODUCT_ID = "https://www.code-site.art/#some-product";
const review = () => buildReviewNodes(SEED, PRODUCT_ID);

test("reviews of our own Organization are not emitted", () => {
  // Google dropped self-serving reviews of Organization/LocalBusiness in 2019,
  // and Organization is not an eligible review-snippet type at all. GSC
  // reported this as a markup error on /ru/sites-for/medicine.
  assert.deepEqual(buildReviewNodes(SEED, ORG_ID), []);
});

test("reviews of a reviewable entity are still emitted", () => {
  const nodes = buildReviewNodes(SEED, PRODUCT_ID) as Record<string, unknown>[];
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0]["@type"], "Review");
  assert.deepEqual(nodes[0].itemReviewed, { "@id": PRODUCT_ID });
});

test("a graph referencing ORG_ID gets the Organization node added", () => {
  // GSC flagged review snippets as "no name" because itemReviewed pointed at
  // an @id that appeared nowhere in the page graph.
  const graph = buildJsonLd([[{ "@type": "WebPage", publisher: { "@id": ORG_ID } }]]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  const org = nodes.find((n) => n["@id"] === ORG_ID);
  assert.ok(org, "Organization node should be present");
  assert.equal(org!["@type"], "Organization");
  assert.equal(org!.name, "Code-Site.Art");
});

test("an already-declared Organization is not duplicated", () => {
  const graph = buildJsonLd([
    organizationNode(),
    [{ "@type": "WebPage", publisher: { "@id": ORG_ID } }],
    review(),
  ]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  const orgs = nodes.filter((n) => n["@id"] === ORG_ID);
  assert.equal(orgs.length, 1);
});

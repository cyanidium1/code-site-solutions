import test from "node:test";
import assert from "node:assert/strict";

import { buildJsonLd, buildReviewNodes, organizationNode } from "./jsonld";
import { ORG_ID } from "@/constants/site";

const review = () =>
  buildReviewNodes(
    [
      {
        body: "Great work.",
        authorName: "Client",
        rating: 5,
        datePublished: "2026-06-04",
      },
    ],
    ORG_ID,
  );

test("a graph referencing ORG_ID gets the Organization node added", () => {
  // GSC flagged review snippets as "no name" because itemReviewed pointed at
  // an @id that appeared nowhere in the page graph.
  const graph = buildJsonLd([review()]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  const org = nodes.find((n) => n["@id"] === ORG_ID);
  assert.ok(org, "Organization node should be present");
  assert.equal(org!["@type"], "Organization");
  assert.equal(org!.name, "Code-Site.Art");
});

test("an already-declared Organization is not duplicated", () => {
  const graph = buildJsonLd([organizationNode(), review()]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  const orgs = nodes.filter((n) => n["@id"] === ORG_ID);
  assert.equal(orgs.length, 1);
});

test("a graph with no ORG_ID reference stays untouched", () => {
  const graph = buildJsonLd([{ "@type": "WebPage", name: "x" }]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  assert.equal(nodes.length, 1);
  assert.equal(nodes[0]["@type"], "WebPage");
});

test("nested references are detected, not just top-level ones", () => {
  const graph = buildJsonLd([
    { "@type": "Service", provider: { "@id": ORG_ID } },
  ]);
  const nodes = graph["@graph"] as Record<string, unknown>[];
  assert.ok(nodes.some((n) => n["@id"] === ORG_ID));
});

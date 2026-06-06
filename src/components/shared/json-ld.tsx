import type { JsonLdNode } from "@/lib/shared/jsonld";

/**
 * Emits a `<script type="application/ld+json">` tag with the given graph.
 * Pages build the graph via `buildJsonLd([...])` from `@/lib/shared/jsonld`
 * and pass the result as `data`.
 */
export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

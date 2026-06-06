import type { JsonLdNode } from "@/lib/shared/jsonld";

/**
 * Characters that must be escaped before inlining JSON into an HTML
 * `<script>` body:
 *   - `<`, `>`, `&` protect against a stray `</script>` inside a string
 *     terminating the tag early.
 *   - U+2028 / U+2029 are valid in JSON strings but illegal in JavaScript
 *     source, so they'd be a SyntaxError if any renderer re-parses the
 *     body as JS.
 *   - Everything U+0080 and above is escaped so the output stays pure
 *     ASCII. JSON parsers always decode `\uXXXX` back to the correct
 *     character even when the surrounding tool misrenders raw UTF-8 bytes
 *     (some validators show Cyrillic / em-dashes as `??` in their preview
 *     UI; escape sequences round-trip cleanly because the parser converts
 *     them before the display layer sees anything non-ASCII).
 */
const ESCAPE_RE = /[<>&-￿]/g;

function asciiSafeJson(data: JsonLdNode): string {
  return JSON.stringify(data).replace(ESCAPE_RE, (c) =>
    "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"),
  );
}

/**
 * Emits a `<script type="application/ld+json">` tag with the given graph.
 * Pages build the graph via `buildJsonLd([...])` from `@/lib/shared/jsonld`
 * and pass the result as `data`.
 *
 * Output is ASCII-only — non-ASCII characters become `\uXXXX` escape
 * sequences. Semantically identical for JSON consumers; broader tool
 * compatibility with validators that don't handle UTF-8 cleanly.
 */
export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: asciiSafeJson(data) }}
    />
  );
}

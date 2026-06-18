export type CaseLayout = "auto" | "comparison" | "afterOnly";

/**
 * Resolves the effective case layout. Explicit "comparison"/"afterOnly" win;
 * "auto" (and undefined, for legacy docs without the field) picks "afterOnly"
 * when there is no before image, else the full before/after comparison.
 */
export function resolveCaseLayout(
  layout: CaseLayout | undefined,
  hasBeforeImage: boolean,
): "comparison" | "afterOnly" {
  if (layout === "comparison" || layout === "afterOnly") return layout;
  return hasBeforeImage ? "comparison" : "afterOnly";
}

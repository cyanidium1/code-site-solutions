/**
 * Barrel re-export for the "comparison" block components.
 *
 * Each component lives in its own file:
 *   - tier.tsx       — Tier pricing card
 *   - table-row.tsx  — TableRow for the WP/Wix vs custom comparison table
 *   - comparison.tsx — Comparison (composed section)
 */

import "./comparison.css";

export { Tier } from "./tier";
export { TableRow } from "./table-row";
export { Comparison } from "./comparison";
export type { TableRowData, TierProps } from "@/types/pricing";

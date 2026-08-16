import { notFound } from "next/navigation";

// Catch-all for unmatched root-level URLs. Calls notFound() so the (uk)
// group's not-found.tsx renders inside the (uk) root layout with a real
// 404 status. Static segments and dynamic routes always win over this
// catch-all, so real pages are unaffected.
export default function CatchAllNotFound() {
  notFound();
}

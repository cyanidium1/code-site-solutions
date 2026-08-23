import { notFound } from "next/navigation";

// Catch-all for unmatched root-level URLs. Calls notFound() so the (uk)
// group's not-found.tsx renders inside the (uk) root layout with a real
// 404 status. Static segments and dynamic routes always win over this
// catch-all, so real pages are unaffected.
export default function CatchAllNotFound() {
  notFound();
}

// SEO audit Aug 2026 — do not add `export const metadata` here.
// notFound() hands rendering to the not-found boundary, and Next 15
// ignores metadata exported from the page that threw. The 404 keeps
// the layout's title and canonical; the 404 status already keeps it
// out of the index, so this is cosmetic and not worth a second layout.

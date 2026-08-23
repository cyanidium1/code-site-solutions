import { notFound } from "next/navigation";

// Catch-all for unmatched /en/* URLs — renders the (en) group's 404.
export default function CatchAllNotFound() {
  notFound();
}

// SEO audit Aug 2026 — do not add `export const metadata` here.
// notFound() hands rendering to the not-found boundary, and Next 15
// ignores metadata exported from the page that threw. The 404 keeps
// the layout's title and canonical; the 404 status already keeps it
// out of the index, so this is cosmetic and not worth a second layout.

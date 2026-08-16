import { notFound } from "next/navigation";

// Catch-all for unmatched /en/* URLs — renders the (en) group's 404.
export default function CatchAllNotFound() {
  notFound();
}

import { notFound } from "next/navigation";

// Catch-all for unmatched /ru/* URLs — renders the (ru) group's 404.
export default function CatchAllNotFound() {
  notFound();
}

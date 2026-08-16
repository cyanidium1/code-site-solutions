import Link from "next/link";

// 404 for the English route group. Rendered inside the (en) root layout,
// so no <html>/<body> here. Unmatched /en/* URLs reach this via the
// (en)/en/[...not-found] catch-all.
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-[120px] leading-none font-bold bg-brand-gradient bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-ink-dim max-w-md">
        This page doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/en"
          className="rounded-full bg-brand-gradient px-6 py-3 font-medium text-white"
        >
          Home
        </Link>
        <Link
          href="/en/portfolio"
          className="rounded-full border border-line px-6 py-3 font-medium text-ink-dim"
        >
          Case studies
        </Link>
      </div>
    </main>
  );
}

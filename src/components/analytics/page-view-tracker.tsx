"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/lib/client/attribution";
import { trackContactClick } from "@/lib/client/analytics";
import { normalizePathname } from "@/lib/shared/normalize-pathname";

/**
 * Records each route change into the session attribution record so leads carry
 * the visitor's referrer, landing page, and page journey. Renders nothing.
 */
export function PageViewTracker() {
  const pathname = normalizePathname(usePathname());

  useEffect(() => {
    recordPageView(pathname);
  }, [pathname]);

  // One delegated listener covers every phone / messenger link on the site,
  // including ones rendered later by CMS content.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const channel = a ? contactChannel(a.getAttribute("href") ?? "") : null;
      if (channel) trackContactClick(channel, window.location.pathname);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

function contactChannel(href: string): string | null {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (/^https?:\/\/(t\.me|telegram\.me)\//.test(href)) return "telegram";
  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return "whatsapp";
  if (href.startsWith("viber:")) return "viber";
  return null;
}

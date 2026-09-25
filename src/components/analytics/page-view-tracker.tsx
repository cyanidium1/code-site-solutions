"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/lib/client/attribution";
import { trackContactClick, trackCtaClick } from "@/lib/client/analytics";
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

  // One delegated listener covers every phone / messenger link and every
  // `data-cta` button on the site, including ones rendered later by CMS
  // content. Delegation is the point: a per-element onClick would have to be
  // threaded through every block, and CMS-authored links would never get one.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.("a[href]");
      const channel = a ? contactChannel(a.getAttribute("href") ?? "") : null;
      const cta = target?.closest?.("[data-cta]");
      const ctaId = cta?.getAttribute("data-cta") ?? undefined;
      const page = window.location.pathname;
      if (channel) {
        // A contact link reports once, as a contact click carrying its id.
        trackContactClick(channel, page, ctaId);
        return;
      }
      if (ctaId) trackCtaClick(ctaId, page);
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

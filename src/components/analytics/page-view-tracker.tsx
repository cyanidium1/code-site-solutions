"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordPageView } from "@/lib/client/attribution";
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

  return null;
}

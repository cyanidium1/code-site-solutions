"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useLocale } from "next-intl";
import type { ReactNode } from "react";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { LeadModalProvider } from "@/components/blocks/lead-modal";
import { ConsentProvider } from "@/lib/cookie-consent";

export function Providers({ children }: { children: ReactNode }) {
  const locale = useLocale();
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <PageViewTracker />
      <ConsentProvider locale={locale}>
        <LeadModalProvider>{children}</LeadModalProvider>
      </ConsentProvider>
    </NextThemesProvider>
  );
}

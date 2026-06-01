"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { LeadModalProvider } from "@/components/blocks/lead-modal";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <HeroUIProvider>
        <PageViewTracker />
        <LeadModalProvider>{children}</LeadModalProvider>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

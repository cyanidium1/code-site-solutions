import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import enMessages from "../../../messages/en.json";

import { Providers } from "../providers";
import { SITE_ORIGIN } from "@/constants/site";
import { getEnRegistrySafe, toWire } from "@/lib/server/i18n-registry";
import { fetchCaseStudyCount } from "@/lib/server/fetch-case-study-count";
import { CaseCountProvider } from "@/components/layout/case-count-provider";
import { I18nRegistryProvider } from "@/components/layout/i18n-registry-provider";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";

import "../globals.css";
import "../keyframes.css";
import "../vendor.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const actay = localFont({
  src: [
    { path: "../../../public/fonts/ActayWide-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../../public/fonts/ActayWide-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-actay",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "ᐈ Custom Website Development Studio | Code-Site.Art",
  description:
    "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £1,000 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: `${SITE_ORIGIN}/en`,
    languages: {
      uk: SITE_ORIGIN,
      "en-GB": `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £1,000 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
    type: "website",
    locale: "en_GB",
    url: `${SITE_ORIGIN}/en`,
  },
  twitter: {
    card: "summary_large_image",
    title: "ᐈ Custom Website Development Studio | Code-Site.Art",
    description:
      "➤ Custom-coded websites for UK SMBs & startups ✔️ Fixed price from £1,000 ✔️ Next.js + Sanity ✔️ Delivered in 4–10 weeks ✔️ 1-year warranty ➤ Book a free call today.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#121212",
};

/**
 * Root layout for the English route group. The English routes live under
 * `app/(en)/en/*` so URLs remain `/en/...`; the `(en)` group disappears
 * from the URL but gives EN its own `<html lang>` and static rendering.
 *
 * See the (uk) layout for the rationale on static `<html lang>` + inlineCss.
 */
export default async function EnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("en");
  // Fetch once per layout render — `unstable_cache` shares the Sanity
  // round-trip across every page in the (en) group within the revalidate
  // window. Wire-format keeps RSC serialization happy across versions.
  // Case count matches portfolio index (`CASE_STUDIES_QUERY`), both locales.
  const [i18nRegistry, caseCount] = await Promise.all([
    toWire(await getEnRegistrySafe()),
    fetchCaseStudyCount(),
  ]);
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased overflow-x-clip">
        <GoogleTagManager />
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <Providers>
            <I18nRegistryProvider value={i18nRegistry}>
              <CaseCountProvider count={caseCount}>{children}</CaseCountProvider>
            </I18nRegistryProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

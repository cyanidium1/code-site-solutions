import type { Metadata, Viewport } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import enMessages from "../../../messages/en.json";

import { Providers } from "../providers";
import { SITE_ORIGIN } from "@/constants/site";

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
  title:
    "Code-Site.Art — Custom websites that book meetings 24/7. Live in 4–10 weeks.",
  description:
    "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: {
    canonical: `${SITE_ORIGIN}/en`,
    languages: {
      uk: SITE_ORIGIN,
      en: `${SITE_ORIGIN}/en`,
      "x-default": SITE_ORIGIN,
    },
  },
  openGraph: {
    title:
      "Custom websites that book meetings 24/7 — Code-Site.Art",
    description:
      "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups in the US, EU, and DK. Fixed price from $1,000. 1-year warranty + 30% rebate if we miss the deadline.",
    type: "website",
    locale: "en_US",
    url: `${SITE_ORIGIN}/en`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Root layout for the English route group. The English routes live under
 * `app/(en)/en/*` so URLs remain `/en/...`; the `(en)` group disappears
 * from the URL but gives EN its own `<html lang>` and static rendering.
 *
 * See the (uk) layout for the rationale on static `<html lang>` + inlineCss.
 */
export default function EnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  setRequestLocale("en");
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${jetbrains.variable} ${actay.variable}`}
    >
      <body className="font-sans bg-bg text-ink antialiased">
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "./providers";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Code-Site.Art — Custom-coded сайти від $1 000 з Києва",
  description:
    "Бутик-студія в Києві. Робимо сайти для клінік, юристів, бухгалтерських компаній, e-commerce і SaaS на Next.js. Запуск 4-10 тижнів, гарантія 1 рік.",
  metadataBase: new URL("https://code-site.art"),
  openGraph: {
    title: "Code-Site.Art — Custom-coded сайти від $1 000 з Києва",
    description:
      "Бутик-студія в Києві. Сайти для клінік, юристів, бухгалтерії, e-commerce і SaaS на Next.js.",
    type: "website",
    locale: "uk_UA",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <html
      lang="uk"
      suppressHydrationWarning
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@300..800&display=swap"
        />
      </head>
      <body className="font-sans bg-bg text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

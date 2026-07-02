import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/cookie-policy";
import { cookiePolicyUk } from "@/content/uk/cookie-policy";

export const metadata: Metadata = {
  title: "Політика cookies | Code-Site.Art",
  description:
    "Які cookies використовує code-site.art, навіщо, і як змінити або відкликати згоду.",
  alternates: { canonical: "/cookies" },
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return <CookiePolicy copy={cookiePolicyUk} />;
}

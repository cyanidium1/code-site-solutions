import type { Metadata } from "next";
import { CookiePolicy } from "@/components/legal/cookie-policy";
import { cookiePolicyEn } from "@/content/en/cookie-policy";

export const metadata: Metadata = {
  title: "Cookie Policy | Code-Site.Art",
  description:
    "Which cookies code-site.art uses, why, and how to change or withdraw your consent.",
  alternates: { canonical: "/en/cookies" },
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return <CookiePolicy copy={cookiePolicyEn} />;
}

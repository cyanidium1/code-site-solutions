import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";
import { privacyPolicyEn } from "@/content/en/privacy-policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Code-Site.Art",
  description:
    "What code-site.art collects through the enquiry form, where it goes, how long it is kept and how to have it deleted.",
  alternates: { canonical: "/en/policy" },
  robots: { index: false, follow: false },
};

export default function PolicyPage() {
  return <LegalDoc copy={privacyPolicyEn} />;
}

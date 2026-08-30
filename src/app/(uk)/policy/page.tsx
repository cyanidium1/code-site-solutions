import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";
import { privacyPolicyUk } from "@/content/uk/privacy-policy";

export const metadata: Metadata = {
  title: "Політика конфіденційності | Code-Site.Art",
  description:
    "Які дані збирає code-site.art через форму заявки, куди вони йдуть, скільки зберігаються і як їх видалити.",
  alternates: { canonical: "/policy" },
  robots: { index: false, follow: false },
};

export default function PolicyPage() {
  return <LegalDoc copy={privacyPolicyUk} />;
}

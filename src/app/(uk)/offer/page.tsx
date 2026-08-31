import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";
import { offerUk } from "@/content/uk/legal-docs";

export const metadata: Metadata = {
  title: "Публічна оферта | Code-Site.Art",
  description:
    "Публічна оферта на послуги веб-розробки: загальні положення, предмет, вартість, права та обов'язки сторін.",
  alternates: { canonical: "/offer" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalDoc copy={offerUk} />;
}

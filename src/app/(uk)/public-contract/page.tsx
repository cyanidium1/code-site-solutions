import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";
import { publicContractUk } from "@/content/uk/legal-docs";

export const metadata: Metadata = {
  title: "Публічний договір | Code-Site.Art",
  description:
    "Публічний договір на розробку веб-сайтів: предмет, терміни, оплата, гарантія 1 рік і відповідальність сторін. Реквізити виконавця включені.",
  alternates: { canonical: "/public-contract" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalDoc copy={publicContractUk} />;
}

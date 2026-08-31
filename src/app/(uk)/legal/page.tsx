import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/legal-doc";
import { legalUk } from "@/content/uk/legal-docs";

export const metadata: Metadata = {
  title: "Юридична інформація — ФОП Алпатов Федір Михайлович | Code-Site.Art",
  description:
    "Реквізити Code-Site.Art для договорів, рахунків і актів: ФОП, ІПН, IBAN, банк. Договір українською або англійською, безготівка на ФОП, Stripe або USDT.",
  alternates: { canonical: "/legal" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalDoc copy={legalUk} />;
}

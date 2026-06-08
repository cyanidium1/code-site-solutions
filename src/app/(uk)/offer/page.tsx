import type { Metadata } from "next";
import { LegalStub } from "@/components/legal/legal-stub";

export const metadata: Metadata = {
  title: "Public Offer — Web Development Services | Code-Site.Art",
  description:
    "Public offer agreement for web development services by Code-Site.Art. Read the full terms before accepting our services.",
  alternates: { canonical: "/offer" },
  robots: { index: false, follow: false },
};

export default function OfferPage() {
  return (
    <LegalStub
      eyebrow="/ LEGAL"
      title="Умови послуг"
      sub="Загальні умови надання послуг розробки сайтів."
      body="Документ зараз готується юристом до публікації. У ньому буде описано порядок укладення договору, етапи робіт, оплату, права на код і дизайн, гарантію 1 рік на запущені проєкти, відповідальність сторін і порядок розв&apos;язання спорів."
      finalHeading={
        <>
          Готові <em>обговорити</em> проєкт?
        </>
      }
      finalSub="Безкоштовна 30-хв консультація. Без зобов'язань."
    />
  );
}

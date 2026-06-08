import type { Metadata } from "next";
import { LegalStub } from "@/components/legal/legal-stub";

export const metadata: Metadata = {
  title: "Public Contract — Web Development Services | Code-Site.Art",
  description:
    "Public contract for web development services provided by Code-Site.Art (FOP Alpatov Fedir Mykhailovych). Terms, pricing and obligations for all client engagements.",
  alternates: { canonical: "/public-contract" },
  robots: { index: false, follow: false },
};

export default function PublicContractPage() {
  return (
    <LegalStub
      eyebrow="/ LEGAL"
      title="Публічний договір (оферта)"
      sub="Публічна оферта на надання послуг розробки."
      body="Документ зараз готується юристом до публікації. У ньому буде викладено умови, на яких Code-Site.Art пропонує послуги розробки сайтів — обов&apos;язки виконавця і замовника, порядок прийняття робіт, фіксована вартість, строки запуску, повернення коштів та гарантія."
      finalHeading={
        <>
          Готові <em>обговорити</em> проєкт?
        </>
      }
      finalSub="Безкоштовна 30-хв консультація. Без зобов'язань."
    />
  );
}

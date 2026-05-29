import type { Metadata } from "next";
import { LegalStub } from "@/components/legal/legal-stub";

export const metadata: Metadata = {
  title: "Юридична інформація — Code-Site.Art",
  description:
    "Реквізити, юридична адреса і контакти Code-Site.Art для договірної та податкової документації.",
  alternates: { canonical: "/legal" },
  robots: { index: false, follow: false },
};

export default function LegalPage() {
  return (
    <LegalStub
      eyebrow="/ LEGAL"
      title="Юридична інформація"
      sub="Реквізити та контакти для договірної документації."
      body="Документ зараз готується. У ньому будуть розміщені реквізити Code-Site.Art (юридична адреса, ІПН/ЄДРПОУ, банківські реквізити для рахунків і актів), а також контакти юридичного представника. Поки що для отримання договору або акту виконаних робіт зв&apos;яжіться з нами напряму."
      finalHeading={
        <>
          Готові <em>обговорити</em> проєкт?
        </>
      }
      finalSub="Безкоштовна 30-хв консультація. Без зобов'язань."
    />
  );
}

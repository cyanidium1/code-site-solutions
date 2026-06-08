import type { Metadata } from "next";
import { LegalStub } from "@/components/legal/legal-stub";

export const metadata: Metadata = {
  title: "Privacy Policy | Code-Site.Art",
  description:
    "Privacy policy for code-site.art — how we collect, use and protect your personal data in line with GDPR requirements.",
  alternates: { canonical: "/policy" },
  robots: { index: false, follow: false },
};

export default function PolicyPage() {
  return (
    <LegalStub
      eyebrow="/ LEGAL"
      title="Політика конфіденційності"
      sub="Як ми збираємо, зберігаємо та обробляємо персональні дані."
      body="Документ зараз готується юристом до публікації. У ньому буде описано, які дані ми отримуємо через форми на сайті, як їх використовуємо для зв&apos;язку з вами та надання послуг, скільки часу зберігаємо і як їх захищаємо. Працюємо в межах GDPR (EU) і Закону України «Про захист персональних даних»."
      finalHeading={
        <>
          Готові <em>обговорити</em> проєкт?
        </>
      }
      finalSub="Безкоштовна 30-хв консультація. Без зобов'язань."
    />
  );
}

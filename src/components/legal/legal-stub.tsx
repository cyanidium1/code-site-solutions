/**
 * Shared layout for legal/policy stub pages. Renders header, hero,
 * a "document in progress" body and footer. Replace with real content
 * once the legal team approves wording.
 */

import { HpHeader, HpFooter, FinalCta3 } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { PageHero } from "@/components/blocks/page-hero";

export function LegalStub({
  eyebrow,
  title,
  sub,
  body,
  finalHeading,
  finalSub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  body: string;
  finalHeading: React.ReactNode;
  finalSub: string;
}) {
  return (
    <>
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Головна", href: "/" },
          { label: title },
        ]}
        eyebrow={eyebrow}
        headline={title}
        sub={sub}
      />

      <section style={{ background: "var(--bg)", padding: "60px 48px" }}>
        <div
          style={{
            maxWidth: "var(--container-prose)",
            margin: "0 auto",
            fontFamily: "Manrope, sans-serif",
            fontSize: 16,
            lineHeight: 1.7,
            color: "var(--ink-2)",
          }}
        >
          <p style={{ marginBottom: 16 }}>{body}</p>
          <p style={{ marginBottom: 16 }}>
            Поточну версію документа можна запросити email&apos;ом —{" "}
            <a
              href="mailto:hi@code-site.art"
              style={{
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              hi@code-site.art
            </a>
            .
          </p>
        </div>
      </section>

      <FinalCta3
        eyebrow="/ GET IN TOUCH"
        heading={finalHeading}
        sub={finalSub}
      />

      <HpFooter />
    </>
  );
}

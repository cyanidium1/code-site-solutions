/**
 * Shared layout for legal/policy stub pages. Renders header, hero,
 * a "document in progress" body and footer. Replace with real content
 * once the legal team approves wording.
 */

import { HpHeader, HpFooter } from "@/components/homepage";
import { LaunchCta } from "@/components/blocks/launch-cta";
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

      <section className="bg-bg px-12 py-[60px]">
        <div className="mx-auto max-w-container-prose font-sans text-base leading-relaxed text-ink-dim">
          <p className="mb-4">{body}</p>
          <p className="mb-4">
            Поточну версію документа можна запросити email&apos;ом —{" "}
            <a
              href="mailto:hi@code-site.art"
              className="text-ink underline underline-offset-[3px]"
            >
              hi@code-site.art
            </a>
            .
          </p>
        </div>
      </section>

      <LaunchCta locale="uk" heading={finalHeading} sub={finalSub} />

      <HpFooter />
    </>
  );
}

/**
 * Phase 1 parity-check page for the new primitives in src/components/ui/.
 * Renders each primitive side-by-side with its legacy semantic-class
 * equivalent so a reviewer can eyeball visual parity. Deleted in Task 46.
 */
import {
  Container,
  Section,
  H1,
  H2,
  Btn,
  MetaStrip,
  GradPlaceholder,
  ScreenshotPending,
  DotGrid,
  TextGradient,
} from "@/components/ui";

export default function PrimitivesDemo() {
  return (
    <main>
      <Section>
        <Container>
          <H1>Primitives parity demo</H1>
          <p className="mt-4 text-ink-dim">
            Each block shows the new primitive (left) next to its legacy
            semantic-class equivalent (right). They should look identical.
          </p>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Heading</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <H1 variant="hp">Primitive H1 hp</H1>
            <h1 className="h1">Legacy .h1</h1>
            <H2 variant="case">Primitive H2 case</H2>
            <h2 className="case-h2">Legacy .case-h2</h2>
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Buttons</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Btn variant="primary">Primary</Btn>
              <Btn variant="ghost">Ghost</Btn>
            </div>
            <div className="flex gap-4">
              <button className="btn-primary"><span>Legacy primary</span></button>
              <button className="btn-ghost">Legacy ghost</button>
            </div>
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Gradient placeholder</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <GradPlaceholder from="#7c4dde" to="#5d2dad" label="Primitive" />
            <GradPlaceholder from="#0EA5E9" to="#7c4dde" label="Sky → purple" />
          </div>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Meta strip</H2>
          <MetaStrip
            items={[
              { label: "Client", value: "Acme Co." },
              { label: "Year", value: "2026" },
              { label: "Role", value: "Design + Dev" },
            ]}
          />
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Text gradient</H2>
          <p className="mt-6 text-4xl">
            Hello <TextGradient>gradient</TextGradient> world &middot;{" "}
            <span className="text-gradient">legacy .text-gradient</span>
          </p>
        </Container>
      </Section>

      <Section variant="tight">
        <Container>
          <H2>Screenshot pending + dot grid</H2>
          <div className="mt-6 grid grid-cols-2 gap-8">
            <ScreenshotPending />
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-bg-subtle">
              <DotGrid />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

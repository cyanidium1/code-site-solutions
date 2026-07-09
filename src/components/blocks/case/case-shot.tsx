import { SanityImg } from "@/lib/shared/sanity-image";

// React-hoisted style (see blocks/case/index.tsx for the rationale): costs
// bytes only on routes that render this placeholder, no extra request.
const SHOT_CSS = `
.csb-case-shot-ph{background-image:radial-gradient(ellipse at 30% 20%,oklch(from var(--color-accent) l c h / 0.18) 0%,transparent 55%),radial-gradient(ellipse at 78% 80%,oklch(0.5 0.18 280 / 0.16) 0%,transparent 55%),linear-gradient(160deg,oklch(0.16 0.012 240) 0%,oklch(0.11 0.006 250) 100%)}
`;

// Screenshot card (plain image / placeholder — no browser chrome). aspect-ratio
// preserved at 3/2 across breakpoints (legacy media queries repeated the same
// value, so single utility suffices).
const SHOT_CLASS =
  "relative rounded-[14px] overflow-hidden bg-[oklch(0.18_0.005_300)] border border-line-strong mb-[18px] aspect-[3/2] " +
  "md:mb-6";

const SHOT_IMG_WRAP_CLASS = "absolute inset-0 overflow-hidden";

// Placeholder shown when no screenshot is uploaded — mimics a page layout with
// the same accent-tinted radial gradient palette used by other placeholders.
const SHOT_PLACEHOLDER_CLASS =
  "absolute inset-0 px-[22px] py-7 flex flex-col gap-3.5 csb-case-shot-ph";

const SHOT_PLACEHOLDER_LINE_CLASS =
  "h-3.5 w-[70%] rounded bg-[oklch(1_0_0_/_0.10)]";

const SHOT_PLACEHOLDER_LINE_SHORT_CLASS =
  "!w-[45%] !bg-[oklch(1_0_0_/_0.06)]";

const SHOT_PLACEHOLDER_GRID_CLASS =
  "flex-1 grid grid-cols-2 gap-2.5 mt-1 [&>span]:rounded-md [&>span]:bg-[oklch(1_0_0_/_0.04)] [&>span]:border [&>span]:border-[oklch(1_0_0_/_0.05)]";

export function CaseShot({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  return (
    <div className={SHOT_CLASS}>
      <div className={SHOT_IMG_WRAP_CLASS}>
        {src ? (
          <SanityImg
            image={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 50vw, 92vw"
            className="object-cover object-top"
          />
        ) : (
          <div className={SHOT_PLACEHOLDER_CLASS} aria-hidden="true">
            <style href="csb-case-shot" precedence="csb">{SHOT_CSS}</style>
            <div className={SHOT_PLACEHOLDER_LINE_CLASS} />
            <div
              className={`${SHOT_PLACEHOLDER_LINE_CLASS} ${SHOT_PLACEHOLDER_LINE_SHORT_CLASS}`}
            />
            <div className={SHOT_PLACEHOLDER_GRID_CLASS}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { SanityImg } from "@/lib/shared/sanity-image";

// Screenshot frame (browser chrome + image / placeholder). aspect-ratio
// preserved at 3/2 across breakpoints (legacy media queries repeated the same
// value, so single utility suffices).
const SHOT_CLASS =
  "relative rounded-[14px] overflow-hidden bg-[oklch(0.18_0.005_300)] border border-line-strong mb-[18px] aspect-[3/2] " +
  "md:mb-6";

const SHOT_BAR_CLASS =
  "absolute top-0 left-0 right-0 h-7 flex items-center gap-1.5 px-3 bg-[oklch(0.16_0.004_300)] border-b border-[oklch(1_0_0_/_0.06)] z-[2]";

const SHOT_DOT_CLASS =
  "w-2.5 h-2.5 rounded-full bg-[oklch(0.3_0.005_60)]";

const SHOT_URL_CLASS =
  "flex-1 ml-2 h-[18px] bg-[oklch(0.22_0.005_300)] rounded-md flex items-center px-2.5 font-mono text-[9px] text-ink-3 tracking-[0.04em] max-w-[240px]";

const SHOT_IMG_WRAP_CLASS =
  "absolute inset-x-0 bottom-0 top-7 w-full h-[calc(100%-28px)] overflow-hidden";

// Placeholder shown when no screenshot is uploaded — mimics a page layout with
// the same accent-tinted radial gradient palette used by other placeholders.
const SHOT_PLACEHOLDER_CLASS =
  "absolute inset-0 px-[22px] py-7 flex flex-col gap-3.5 " +
  "bg-[radial-gradient(ellipse_at_30%_20%,oklch(from_var(--color-accent)_l_c_h_/_0.18)_0%,transparent_55%),radial-gradient(ellipse_at_78%_80%,oklch(0.5_0.18_280_/_0.16)_0%,transparent_55%),linear-gradient(160deg,oklch(0.16_0.012_240)_0%,oklch(0.11_0.006_250)_100%)]";

const SHOT_PLACEHOLDER_LINE_CLASS =
  "h-3.5 w-[70%] rounded bg-[oklch(1_0_0_/_0.10)]";

const SHOT_PLACEHOLDER_LINE_SHORT_CLASS =
  "!w-[45%] !bg-[oklch(1_0_0_/_0.06)]";

const SHOT_PLACEHOLDER_GRID_CLASS =
  "flex-1 grid grid-cols-2 gap-2.5 mt-1 [&>span]:rounded-md [&>span]:bg-[oklch(1_0_0_/_0.04)] [&>span]:border [&>span]:border-[oklch(1_0_0_/_0.05)]";

export function CaseShot({
  src,
  url,
  alt,
}: {
  src?: string;
  url: string;
  alt: string;
}) {
  return (
    <div className={SHOT_CLASS}>
      <div className={SHOT_BAR_CLASS}>
        <span className={SHOT_DOT_CLASS} />
        <span className={SHOT_DOT_CLASS} />
        <span className={SHOT_DOT_CLASS} />
        <span className={SHOT_URL_CLASS}>{url}</span>
      </div>
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

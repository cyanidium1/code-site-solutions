import { cn } from "@/components/ui";
import { H2 } from "@/components/ui";

export type ImageTextCta = { label: string; href: string };

export type ImageTextVariant = "side" | "side-with-list" | "centered";

export type ImageTextProps = {
  variant: ImageTextVariant;
  imageVariant?: "imageLeft" | "imageRight";
  /** Only consumed when variant="centered". "horizontal" + both images
      renders text-in-middle with two absolute side mockups (OUTCOME style). */
  centeredLayout?: "vertical" | "horizontal";
  eyebrow?: string;
  heading: React.ReactNode;
  body: React.ReactNode | React.ReactNode[];
  bulletList?: React.ReactNode[];
  bulletIcon?: "check" | "cross";
  cta?: ImageTextCta;
  image: React.ReactNode;
  /** Second image — only rendered when variant="centered" and
      centeredLayout="horizontal". Goes on the right; `image` goes on the left. */
  secondImage?: React.ReactNode;
  /** Додаткові класи для `<section>` (наприклад, зменшений верхній відступ після галереї). */
  sectionClassName?: string;
};

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12h14M13 5l7 7-7 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CHECK = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12l5 5L20 6"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CROSS = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

export function ImageText({
  variant,
  imageVariant = "imageRight",
  centeredLayout = "vertical",
  eyebrow,
  heading,
  body,
  bulletList,
  bulletIcon = "check",
  cta,
  image,
  secondImage,
  sectionClassName,
}: ImageTextProps) {
  const bodyArr = Array.isArray(body) ? body : [body];
  const showList =
    variant === "side-with-list" && bulletList && bulletList.length > 0;
  const showCta = variant === "side-with-list" && cta;
  const isCentered = variant === "centered";

  const containerClass = isCentered
    ? "max-w-container mx-auto grid grid-cols-1 gap-12 text-center"
    : "max-w-container mx-auto grid grid-cols-2 gap-16 items-center max-[1080px]:gap-10 max-[960px]:grid-cols-1 max-[960px]:gap-8";

  const imageImgClass =
    "[&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:object-top";

  const imageClass = isCentered
    ? `rounded-[22px] overflow-hidden border border-line bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center relative max-w-[920px] mx-auto w-full aspect-[4/3] lg:aspect-[16/9] ${imageImgClass}`
    : `rounded-[22px] overflow-hidden border border-line bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center relative aspect-[4/3] max-[960px]:-order-1 ${imageImgClass}`;

  const contentClass = isCentered
    ? "flex flex-col max-w-[720px] mx-auto items-center"
    : "flex flex-col";

  const eyebrowClass = `inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-ink-3)] before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shadow-[0_0_8px_oklch(from_var(--color-accent)_l_c_h_/_0.6)] ${
    isCentered ? "self-center" : "self-start"
  }`;

  const listClass = `mt-7 flex flex-col gap-3 ${
    isCentered ? "self-center text-left" : ""
  }`;

  const checkBaseClass =
    "inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full mt-px";
  const checkColorClass =
    bulletIcon === "cross"
      ? "bg-[oklch(0.65_0.18_25_/_0.15)] text-[oklch(0.78_0.16_25)]"
      : "bg-accent-18 text-accent-soft";

  const imageBlock = <div className={imageClass}>{image}</div>;
  const contentBlock = (
    <div className={contentClass}>
      {eyebrow ? <span className={eyebrowClass}>{eyebrow}</span> : null}
      <H2
        variant="image-text"
        className="mt-6 text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent"
      >
        {heading}
      </H2>
      <div className="mt-6 flex flex-col gap-4 [&_p]:text-[16px] [&_p]:leading-[1.6] [&_p]:text-[var(--color-ink-dim)] [&_p_em]:italic [&_p_em]:text-ink">
        {bodyArr.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {showList ? (
        <ul className={listClass}>
          {bulletList!.map((it, i) => (
            <li
              key={i}
              className="flex gap-3 items-start font-sans text-[15px] text-[var(--color-ink-dim)] leading-[1.5]"
            >
              <span className={`${checkBaseClass} ${checkColorClass}`}>
                {bulletIcon === "cross" ? CROSS : CHECK}
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {showCta ? (
        <div className="mt-8">
          <a
            href={cta!.href}
            className="inline-flex items-center gap-2.5 px-[22px] py-3 rounded-full bg-brand-gradient text-white font-sans font-semibold text-[13px] tracking-[0.04em] no-underline transition-transform duration-200 shadow-[0_4px_20px_oklch(0.55_0.18_295/_0.3)] hover:-translate-y-px"
          >
            {cta!.label}
            {ARROW}
          </a>
        </div>
      ) : null}
    </div>
  );

  const sectionClass = cn(
    "relative py-14 lg:py-[100px] px-6 lg:px-12 bg-bg",
    sectionClassName,
  );

  if (isCentered) {
    const isHorizontal =
      centeredLayout === "horizontal" && Boolean(image) && Boolean(secondImage);

    if (isHorizontal) {
      // Floating side-mockup classes: position absolute, anchored to vertical
      // center of the inner container, with responsive size + visibility steps
      // that match the legacy ithc-mockup--left/--right rules.
      const mockupBase =
        "absolute z-[1] flex pointer-events-none [filter:drop-shadow(0_30px_40px_oklch(0_0_0_/_0.45))] " +
        "bottom-1/2 translate-y-1/2 h-full w-auto max-w-[500px] " +
        "max-2xl:h-[400px] max-2xl:max-w-[400px] " +
        "max-[1200px]:h-[300px] max-[1200px]:max-w-[380px] " +
        "max-[1024px]:h-[320px] max-[1024px]:max-w-[380px] " +
        "max-[900px]:hidden " +
        "[&_img]:block [&_img]:w-full [&_img]:h-auto [&_img]:object-contain " +
        "[&>span_img]:block [&>span_img]:w-full [&>span_img]:h-auto [&>span_img]:object-contain " +
        "[&>div_img]:block [&>div_img]:w-full [&>div_img]:h-auto [&>div_img]:object-contain";

      return (
        <section
          className={cn(
            "relative bg-bg pb-14 lg:pb-[100px] overflow-hidden",
            sectionClassName,
          )}
        >
          <div className="relative w-full max-w-container mx-auto flex items-center justify-center min-h-[560px] max-[1200px]:min-h-[480px] max-[1024px]:min-h-[440px] max-[900px]:min-h-[320px] max-[900px]:px-4 max-[900px]:py-8 max-sm:min-h-[280px] max-sm:py-6 max-sm:px-3">
            <div className={cn(mockupBase, "left-[-10%] max-2xl:left-[-5%]")} aria-hidden="true">
              {image}
            </div>
            <div className="relative z-[2] flex flex-col items-center w-full max-w-[720px] text-center px-4 py-8 bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.008_60_/_0.7)_0%,oklch(0.18_0.008_60_/_0)_70%)] max-2xl:max-w-[560px] max-[1200px]:max-w-[400px] max-[900px]:max-w-container-prose max-sm:px-2 max-sm:py-4">
              {eyebrow ? <span className={eyebrowClass}>{eyebrow}</span> : null}
              <H2
                variant="image-text"
                className="mt-4 text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent"
              >
                {heading}
              </H2>
              <div className="mt-[18px] flex flex-col gap-3 [&_p]:text-[16px] [&_p]:leading-[1.6] [&_p]:text-[var(--color-ink-dim)]">
                {bodyArr.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {showList ? (
                <ul className={listClass}>
                  {bulletList!.map((it, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-start font-sans text-[15px] text-[var(--color-ink-dim)] leading-[1.5]"
                    >
                      <span className={`${checkBaseClass} ${checkColorClass}`}>
                        {bulletIcon === "cross" ? CROSS : CHECK}
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className={cn(mockupBase, "right-[-10%] max-2xl:right-[-5%]")}>
              {secondImage}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className={sectionClass}>
        <div className={containerClass}>
          {imageBlock}
          {contentBlock}
        </div>
      </section>
    );
  }

  const reverse = imageVariant === "imageRight";
  return (
    <section className={sectionClass}>
      <div className={containerClass}>
        {reverse ? (
          <>
            {contentBlock}
            {imageBlock}
          </>
        ) : (
          <>
            {imageBlock}
            {contentBlock}
          </>
        )}
      </div>
    </section>
  );
}

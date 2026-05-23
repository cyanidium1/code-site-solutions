import { cn } from "@/lib/shared/cn";

import "./image-text.css";

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
    ? `rounded-[22px] overflow-hidden border border-line bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center relative max-w-[920px] mx-auto w-full aspect-[16/9] max-[800px]:aspect-[4/3] ${imageImgClass}`
    : `rounded-[22px] overflow-hidden border border-line bg-[oklch(1_0_0_/_0.02)] flex items-center justify-center relative aspect-[4/3] max-[960px]:-order-1 ${imageImgClass}`;

  const contentClass = isCentered
    ? "flex flex-col max-w-[720px] mx-auto items-center"
    : "flex flex-col";

  const eyebrowClass = `image-text-eyebrow inline-flex items-center gap-2.5 px-3 py-1.5 border border-line rounded-full bg-[oklch(1_0_0_/_0.03)] font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--ink-3)] ${
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
      : "bg-[oklch(from_var(--accent)_l_c_h_/_0.18)] text-accent-soft";

  const imageBlock = <div className={imageClass}>{image}</div>;
  const contentBlock = (
    <div className={contentClass}>
      {eyebrow ? <span className={eyebrowClass}>{eyebrow}</span> : null}
      <h2 className="mt-6 font-display font-bold text-[clamp(28px,3.4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink [&_em]:italic [&_em]:bg-brand-gradient [&_em]:bg-clip-text [&_em]:text-transparent max-[800px]:text-[clamp(24px,6vw,36px)]">
        {heading}
      </h2>
      <div className="mt-6 flex flex-col gap-4 [&_p]:text-[16px] [&_p]:leading-[1.6] [&_p]:text-[var(--ink-2)] [&_p_em]:italic [&_p_em]:text-ink">
        {bodyArr.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {showList ? (
        <ul className={listClass}>
          {bulletList!.map((it, i) => (
            <li
              key={i}
              className="flex gap-3 items-start font-sans text-[15px] text-[var(--ink-2)] leading-[1.5]"
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
    "relative py-[var(--section-y)] px-12 bg-bg max-[800px]:px-6",
    sectionClassName,
  );

  if (isCentered) {
    const isHorizontal =
      centeredLayout === "horizontal" && Boolean(image) && Boolean(secondImage);

    if (isHorizontal) {
      return (
        <section
          className={cn("image-text-centered-horizontal", sectionClassName)}
        >
          <div className="ithc-inner">
            <div className="ithc-mockup ithc-mockup--left" aria-hidden="true">
            {image}
          </div>
            <div className="ithc-body">
              {eyebrow ? <span className={eyebrowClass}>{eyebrow}</span> : null}
              <h2 className="ithc-h2">{heading}</h2>
              <div className="ithc-text">
                {bodyArr.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {showList ? (
                <ul className={listClass}>
                  {bulletList!.map((it, i) => (
                    <li
                      key={i}
                      className="flex gap-3 items-start font-sans text-[15px] text-[var(--ink-2)] leading-[1.5]"
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
             <div className="ithc-mockup ithc-mockup--right">{secondImage}</div>
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

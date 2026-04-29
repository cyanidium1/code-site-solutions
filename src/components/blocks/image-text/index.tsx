import "./image-text.css";

export type ImageTextCta = { label: string; href: string };

export type ImageTextVariant = "side" | "side-with-list" | "centered";

export type ImageTextProps = {
  variant: ImageTextVariant;
  imageVariant?: "imageLeft" | "imageRight";
  eyebrow?: string;
  heading: React.ReactNode;
  body: React.ReactNode | React.ReactNode[];
  bulletList?: React.ReactNode[];
  cta?: ImageTextCta;
  image: React.ReactNode;
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

export function ImageText({
  variant,
  imageVariant = "imageRight",
  eyebrow,
  heading,
  body,
  bulletList,
  cta,
  image,
}: ImageTextProps) {
  const bodyArr = Array.isArray(body) ? body : [body];
  const showList =
    variant === "side-with-list" && bulletList && bulletList.length > 0;
  const showCta = variant === "side-with-list" && cta;

  const imageBlock = <div className="image-text-image">{image}</div>;
  const contentBlock = (
    <div className="image-text-content">
      {eyebrow ? <span className="image-text-eyebrow">{eyebrow}</span> : null}
      <h2 className="image-text-h2">{heading}</h2>
      <div className="image-text-body">
        {bodyArr.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {showList ? (
        <ul className="image-text-list">
          {bulletList!.map((it, i) => (
            <li key={i}>
              <span className="image-text-list-check">{CHECK}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {showCta ? (
        <div className="image-text-cta">
          <a href={cta!.href} className="image-text-btn">
            {cta!.label}
            {ARROW}
          </a>
        </div>
      ) : null}
    </div>
  );

  // centered: image on top, content below
  if (variant === "centered") {
    return (
      <section className="image-text image-text--centered">
        <div className="image-text-container">
          {imageBlock}
          {contentBlock}
        </div>
      </section>
    );
  }

  // side / side-with-list: order depends on imageVariant
  const reverse = imageVariant === "imageRight";
  return (
    <section className={`image-text image-text--${variant}`}>
      <div className="image-text-container">
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

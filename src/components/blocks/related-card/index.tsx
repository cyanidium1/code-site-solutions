import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type RelatedCardProps = {
  eyebrow?: string;
  category?: string;
  title: string;
  sub?: string;
  metrics?: string[];
  coverImage?: { src: string; alt: string };
  /** Fallback gradient for the mockup cover when no image is provided. */
  gradient?: string;
  /** `null` renders the card as a non-clickable "Coming soon" tile. */
  href: string | null;
};

const DEFAULT_GRADIENT =
  "linear-gradient(135deg, oklch(0.30 0.10 290), oklch(0.22 0.06 250))";

export function RelatedCard({
  eyebrow,
  category,
  title,
  sub,
  metrics = [],
  coverImage,
  gradient,
  href,
}: RelatedCardProps) {
  const disabled = !href;
  const chips = [category, ...metrics].filter(
    (c): c is string => Boolean(c && c.trim()),
  );

  const cover = (
    <div className="hp-case-cover">
      {coverImage ? (
        <img
          src={coverImage.src}
          alt={coverImage.alt}
          className="absolute inset-0 block h-full w-full object-cover object-top"
        />
      ) : (
        <>
          <div
            className="hp-case-cover-bg"
            style={{ background: gradient ?? DEFAULT_GRADIENT }}
          />
          <div className="hp-case-cover-dots" />
          <div className="hp-case-shot">
            <div className="hp-case-shot-bar">
              <span className="hp-case-shot-dot" />
              <span className="hp-case-shot-dot" />
              <span className="hp-case-shot-dot" />
            </div>
            <div className="hp-case-shot-body">
              <div className="hp-case-shot-line s1" />
              <div className="hp-case-shot-line s2" />
              <div className="hp-case-shot-line s3" />
            </div>
          </div>
        </>
      )}
      {disabled ? (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "4px 10px",
            border: "1px solid oklch(1 0 0 / 0.18)",
            borderRadius: 999,
            background: "oklch(0 0 0 / 0.40)",
            backdropFilter: "blur(6px)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "oklch(1 0 0 / 0.85)",
          }}
        >
          Coming soon
        </span>
      ) : null}
    </div>
  );

  const body = (
    <div className="hp-case-body">
      {chips.length > 0 ? (
        <div className="hp-case-chips">
          {chips.map((ch) => (
            <span key={ch} className="hp-case-chip">
              {ch}
            </span>
          ))}
        </div>
      ) : null}
      <div className="hp-case-name-row">
        <h3 className="hp-case-name">{title}</h3>
        {!disabled ? (
          <ArrowUpRight
            size={20}
            strokeWidth={1.6}
            className="hp-case-arrow"
          />
        ) : null}
      </div>
      {eyebrow ? <div className="hp-case-meta">{eyebrow}</div> : null}
      {sub ? <div className="hp-case-metrics">{sub}</div> : null}
    </div>
  );

  if (disabled) {
    return (
      <div
        className="hp-case-link"
        style={{
          cursor: "default",
          pointerEvents: "none",
          opacity: 0.78,
        }}
      >
        {cover}
        {body}
      </div>
    );
  }

  return (
    <Link href={href} className="hp-case-link">
      {cover}
      {body}
    </Link>
  );
}

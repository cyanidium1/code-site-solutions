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
            // eslint-disable-next-line react/forbid-dom-props -- dynamic gradient string per card
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
        <span className="absolute right-3.5 top-3.5 rounded-full border border-[oklch(1_0_0/0.18)] bg-[oklch(0_0_0/0.4)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[oklch(1_0_0/0.85)] backdrop-blur-md">
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
      <div className="hp-case-link pointer-events-none cursor-default opacity-[0.78]">
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

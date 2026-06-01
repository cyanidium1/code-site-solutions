import type { ReactElement } from "react";

/**
 * Brand `</>` mark on the purple gradient, rendered for `next/og`
 * (satori) image routes — apple touch icon and the JSON-LD logo PNG.
 * Kept as plain inline styles + an inline <svg> because satori only
 * supports a CSS subset and no className resolution.
 */
export function BrandMark({ size }: { size: number }): ReactElement {
  const glyph = size * 0.5;
  const stroke = Math.max(4, size * 0.045);
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #7c4dde 0%, #5d2dad 100%)",
      }}
    >
      <svg
        width={glyph}
        height={glyph}
        viewBox="0 0 64 64"
        fill="none"
        stroke="#ffffff"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M25 23 L16 32 L25 41" />
        <path d="M39 23 L48 32 L39 41" />
        <path d="M35 19 L29 45" />
      </svg>
    </div>
  );
}

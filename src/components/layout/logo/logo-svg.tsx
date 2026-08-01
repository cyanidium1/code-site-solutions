"use client";
import { twMerge } from "tailwind-merge";
import { useId } from "react";
import { LOGO_PATHS } from "./logo-paths";

interface LogoSVGProps {
  className?: string;
  variant?: "blue" | "pink" | "dark";
  animated?: boolean;
}


// Static glow color per variant (the peak of the old drop-shadow pulse). Held
// on a duplicate layer whose OPACITY breathes via `animate-logo-glow` — an
// opacity animation is GPU-compositable, unlike the previous `filter` keyframes
// (which repainted the logo on the main thread every frame — flagged by
// Lighthouse as a non-composited animation).
const GLOW_CLASS: Record<NonNullable<LogoSVGProps["variant"]>, string> = {
  blue: "[filter:drop-shadow(0_0_8px_oklch(0.70_0.14_295_/_0.55))]",
  pink: "[filter:drop-shadow(0_0_8px_oklch(0.78_0.16_350_/_0.55))]",
  dark: "[filter:drop-shadow(0_0_8px_oklch(0.70_0.14_295_/_0.55))]",
};

export default function LogoSVG({
  className = "",
  variant = "blue",
  animated = true,
}: LogoSVGProps) {
  // useId() returns ":r0:" style ids; sanitize so they're valid SVG ids.
  const rawId = useId().replace(/:/g, "").replace(/[^a-zA-Z0-9]/g, "");
  const uniqueId = rawId || `id-${Math.random().toString(36).substring(2, 9)}`;
  const gradientId = `logo-gradient-${variant}-${uniqueId}`;

  const stop2 =
    variant === "pink" ? "#ffb5e6" : variant === "dark" ? "#b5daff" : "#b5daff";
  const stop1 = variant === "dark" ? "#000" : "#fff";
  const fillValue = animated ? `url(#${gradientId})` : "currentColor";

  const svgClass = twMerge("w-auto h-[12px]", className);

  // Crisp logo (gradient fill).
  const crisp = (
    <svg viewBox="0 0 129 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
          <stop offset="22.37%" stopColor={stop1} />
          <stop offset="94.04%" stopColor={stop2} />
        </linearGradient>
      </defs>
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} fill={fillValue} />
      ))}
    </svg>
  );

  if (!animated) {
    return <div className="inline-block">{crisp}</div>;
  }

  return (
    <div className="relative inline-block">
      {/* Glow layer: solid-fill duplicate behind the crisp logo, with a static
          soft glow; its opacity breathes (compositable) so the halo pulses
          without repainting the logo each frame. Solid fill (no gradient) keeps
          ids unique; the crisp layer above covers its body, leaving only the
          drop-shadow halo visible. */}
      <span aria-hidden="true" className={`absolute inset-0 animate-logo-glow motion-reduce:animate-none ${GLOW_CLASS[variant]}`}>
        <svg viewBox="0 0 129 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={svgClass} preserveAspectRatio="xMidYMid meet">
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#dfeeff" />
          ))}
        </svg>
      </span>
      {crisp}
    </div>
  );
}

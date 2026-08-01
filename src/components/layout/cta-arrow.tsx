/**
 * 36px white circle + black ↗ arrow from the header CTA pill.
 * Exact geometry from Figma «код сайт арт» node 1729:1920 (Group 8) —
 * asset f3624484dbe6d26f888bc03546a5f11469271398.svg. Server component,
 * inline SVG (no request, themable via className scale).
 */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="18" r="18" fill="white" />
      <path
        d="M11.1497 22.7512C10.8324 23.0174 10.7911 23.4905 11.0573 23.8078C11.3236 24.1251 11.7966 24.1665 12.1139 23.9002L11.6318 23.3257L11.1497 22.7512ZM25.701 12.2125C25.7371 11.7999 25.4319 11.4361 25.0192 11.4L18.2949 10.8117C17.8823 10.7756 17.5185 11.0809 17.4824 11.4935C17.4463 11.9061 17.7515 12.2699 18.1642 12.306L24.1413 12.829L23.6184 18.8061C23.5823 19.2188 23.8876 19.5825 24.3002 19.6186C24.7128 19.6547 25.0766 19.3495 25.1127 18.9369L25.701 12.2125ZM11.6318 23.3257L12.1139 23.9002L25.436 12.7217L24.9539 12.1472L24.4718 11.5726L11.1497 22.7512L11.6318 23.3257Z"
        fill="#0B0B0B"
      />
    </svg>
  );
}

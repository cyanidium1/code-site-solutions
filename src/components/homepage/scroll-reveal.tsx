"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollReveal({
  children,
  className = "",
  threshold = 0.2,
  rootMargin = "0px 0px -8% 0px",
}: {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  // `data-visible` lets consumers attach Tailwind variants
  // (e.g. group-data-[visible=true]/reveal:opacity-100) without coupling
  // to a legacy `.is-visible` class on a CSS sidecar.
  return (
    <div
      ref={ref}
      data-visible={visible ? "true" : "false"}
      className={className}
    >
      {children}
    </div>
  );
}

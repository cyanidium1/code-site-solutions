"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { TestimonialSlide } from "@/lib/server/fetch-testimonials";

/**
 * Client-only, lazily-loaded wrapper around the testimonial carousel.
 *
 * The carousel sits well below the fold, and Swiper (JS + CSS) is otherwise
 * the heaviest non-critical dependency on the homepage. Loading it with
 * `ssr: false` keeps Swiper's bundle off the server HTML and off the initial
 * render-blocking path — it streams in as its own chunk after hydration.
 *
 * The parent reserves vertical space (min-height) so this swap-in does not
 * cause layout shift (CLS).
 */
const PullQuoteSwiperClient = dynamic(
  () => import("./client").then((m) => m.PullQuoteSwiperClient),
  { ssr: false },
);

export function PullQuoteSwiperLazy({
  slides,
}: {
  slides: TestimonialSlide[];
}) {
  // Viewport gate: don't mount Swiper on hydration — wait until the section
  // approaches the viewport. `dynamic(ssr:false)` alone still fetches the
  // chunk and runs Swiper's `updateSize()` (a synchronous clientWidth/
  // clientHeight + getComputedStyle read → forced reflow) during the initial
  // hydration burst, where it collides with the hero LCP paint on slow 4G.
  // Gating the mount pushes both the chunk fetch and that reflow off the
  // critical path. CLS stays ≈0 because the parent reserves the height.
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
            break;
          }
        }
      },
      // Load ~one viewport early so the carousel is ready before the user
      // reaches it — the fetch + init happen ahead of view but still long
      // after the LCP window has closed.
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  return (
    <div ref={ref}>
      {inView ? <PullQuoteSwiperClient slides={slides} /> : null}
    </div>
  );
}

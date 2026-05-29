"use client";

import dynamic from "next/dynamic";

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
  return <PullQuoteSwiperClient slides={slides} />;
}

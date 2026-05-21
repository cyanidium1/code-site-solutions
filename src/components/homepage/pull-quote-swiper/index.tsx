import type { Locale } from "@/lib/sanity/types";

import { fetchTestimonialSlides } from "./fetch-testimonials";
import { PullQuoteSwiperClient } from "./client";
import "./pull-quote-swiper.css";

/**
 * Homepage testimonials slider. Fetches `featured` testimonial docs from
 * Sanity (server-side) and hands off to a client child that mounts Swiper.
 *
 * Returns `null` if Sanity has no testimonials yet — the homepage simply
 * skips this section rather than rendering an empty block.
 */
export async function PullQuoteSwiper({
  locale = "uk",
}: {
  locale?: Locale;
}) {
  const slides = await fetchTestimonialSlides(locale);
  if (slides.length === 0) return null;
  return (
    <section className="hp-section">
      <div className="hp-pqs">
        <div className="hp-pqs-bg" aria-hidden="true" />
        <PullQuoteSwiperClient slides={slides} />
      </div>
    </section>
  );
}

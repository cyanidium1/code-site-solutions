"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import { Linkedin, ArrowUpRight } from "lucide-react";

import SwiperWrapper from "@/components/shared/swiper/SwiperWrapper";
import { btnClass } from "@/components/ui";
import { SanityImg } from "@/lib/shared/sanity-image";

import type { TestimonialSlide } from "@/lib/server/fetch-testimonials";

export function PullQuoteSwiperClient({
  slides,
}: {
  slides: TestimonialSlide[];
}) {
  const single = slides.length <= 1;
  return (
    <SwiperWrapper
      uniqueKey="hp-pqs"
      swiperClassName="hp-pqs-swiper"
      loop={!single}
      showNavigation={!single}
      buttonsPosition="center"
      buttonsClassName="hp-pqs-nav-row"
      additionalOptions={{ slidesPerView: 1, slidesPerGroup: 1 }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.key}>
          <Slide slide={slide} />
        </SwiperSlide>
      ))}
    </SwiperWrapper>
  );
}

function Slide({ slide }: { slide: TestimonialSlide }) {
  return (
    <article className="hp-pqs-slide">
      <div className="hp-pqs-slide-inner">
        {slide.mockupLeft ? (
          <div className="hp-pqs-mockup hp-pqs-mockup--left">
            {/* No lqip: mockups are transparent PNGs — the background blur
                would show through permanently (see docs/images.md). */}
            <SanityImg
              image={slide.mockupLeft.src}
              alt={slide.mockupLeft.alt}
              width={slide.mockupLeft.width ?? 400}
              height={slide.mockupLeft.height ?? 800}
              widths={[280, 400, 560, 800]}
              sizes="(max-width: 900px) 0px, (max-width: 1100px) 220px, 280px"
            />
          </div>
        ) : null}

        <div className="hp-pqs-body">
          <blockquote className="hp-pqs-quote">«{slide.quote}»</blockquote>

          <div className="hp-pqs-author">
            {slide.authorInitials ? (
              <div className="hp-pqs-avatar">{slide.authorInitials}</div>
            ) : null}
            <div>
              <div className="hp-pqs-name">{slide.authorName}</div>
              <div className="hp-pqs-role">{slide.authorRole}</div>
            </div>
            {slide.linkedinUrl ? (
              <a
                href={slide.linkedinUrl}
                className="hp-pqs-li"
                target="_blank"
                rel="noreferrer"
                aria-label={`${slide.authorName} on LinkedIn`}
              >
                <Linkedin size={12} strokeWidth={1.6} /> LinkedIn
              </a>
            ) : null}
          </div>

          {slide.caseHref ? (
            <div className="hp-pqs-cta">
              <Link href={slide.caseHref} className={btnClass("primary")}>
                <span>{slide.caseLabel ?? "See the full case study"}</span>
                <ArrowUpRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          ) : null}
        </div>

        {slide.mockupRight ? (
          <div className="hp-pqs-mockup hp-pqs-mockup--right">
            <SanityImg
              image={slide.mockupRight.src}
              alt={slide.mockupRight.alt}
              width={slide.mockupRight.width ?? 800}
              height={slide.mockupRight.height ?? 500}
              widths={[280, 400, 560, 800]}
              sizes="(max-width: 900px) 0px, (max-width: 1100px) 300px, 380px"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

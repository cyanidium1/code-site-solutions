"use client";

/**
 * Generic Swiper wrapper.
 *
 * Wraps Swiper's React bindings + the prev/next button ref dance so consumers
 * can focus on slide content. Adapted from a reference template; Lucide
 * Chevrons replace the original external icon, and arrow styling moves into
 * swiper-wrapper.css so themes can change without editing this file.
 *
 * Reusable by any future slider (Cases carousel, Process slider, etc.).
 */

// Swiper's base CSS lives here (not in app/layout.tsx) so it loads with this
// component's lazy chunk instead of render-blocking every route. vendor.css
// only styles custom classes (.swiper-nav-btn, .hp-pqs-*), never Swiper's base
// selectors, so load order vs. vendor.css doesn't affect correctness.
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import {
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Navigation, EffectCoverflow, Keyboard, A11y } from "swiper/modules";
import { Swiper } from "swiper/react";
import type { SwiperOptions } from "swiper/types";
import type { Swiper as SwiperType } from "swiper";
import type { SwiperModule } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

type ButtonPosition = "right" | "center" | "onSlides";

interface SwiperWrapperProps {
  children: ReactNode;
  breakpoints?: SwiperOptions["breakpoints"];
  swiperClassName?: string;
  loop?: boolean;
  uniqueKey?: string;
  buttonsPosition?: ButtonPosition;
  /** Optional extra slot in the nav row (e.g. a heading or counter). */
  component?: ReactNode;
  additionalModules?: SwiperModule[];
  additionalOptions?: Partial<SwiperOptions>;
  showNavigation?: boolean;
  buttonsClassName?: string;
  showCoverflowEffect?: boolean;
  centeredSlides?: boolean;
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
}

const buttonsPositionClass: Record<ButtonPosition, string> = {
  right: "sm:justify-end sm:ml-auto",
  center: "sm:justify-center",
  onSlides: "w-full justify-between",
};

export default function SwiperWrapper({
  children,
  breakpoints,
  swiperClassName,
  loop = false,
  buttonsPosition = "right",
  uniqueKey,
  component,
  additionalModules = [],
  additionalOptions = {},
  showNavigation = true,
  buttonsClassName,
  showCoverflowEffect = false,
  centeredSlides = false,
  onSwiper,
  onSlideChange,
}: SwiperWrapperProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperInstanceRef = useRef<SwiperType | null>(null);
  const navigationSetupRef = useRef(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const setupNavigation = (swiperInstance: SwiperType) => {
    if (
      prevRef.current &&
      nextRef.current &&
      swiperInstance.params.navigation &&
      typeof swiperInstance.params.navigation === "object" &&
      !navigationSetupRef.current
    ) {
      navigationSetupRef.current = true;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      setIsBeginning(swiperInstance.isBeginning);
      setIsEnd(swiperInstance.isEnd);

      swiperInstance.on("slideChange", () => {
        if (swiperInstanceRef.current) {
          setIsBeginning(swiperInstanceRef.current.isBeginning);
          setIsEnd(swiperInstanceRef.current.isEnd);
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (!showNavigation) return;
    const swiperInstance = swiperInstanceRef.current;
    if (swiperInstance && prevRef.current && nextRef.current) {
      setupNavigation(swiperInstance);
    }
  });

  const modules: SwiperModule[] = [
    ...(showNavigation ? [Navigation] : []),
    ...(showCoverflowEffect ? [EffectCoverflow] : []),
    Keyboard,
    A11y,
    ...additionalModules,
  ];

  return (
    <>
      <Swiper
        key={`${uniqueKey}-swiper`}
        onSwiper={(swiper) => {
          swiperInstanceRef.current = swiper;
          onSwiper?.(swiper);
        }}
        onSlideChange={onSlideChange}
        centeredSlides={centeredSlides}
        breakpoints={breakpoints}
        navigation={
          showNavigation
            ? { prevEl: ".custom-prev", nextEl: ".custom-next" }
            : false
        }
        keyboard={{ enabled: true }}
        a11y={{ enabled: true }}
        loop={loop}
        speed={1000}
        coverflowEffect={
          showCoverflowEffect
            ? {
                rotate: 0,
                depth: 100,
                stretch: 0,
                modifier: 1,
                slideShadows: false,
              }
            : {}
        }
        effect={showCoverflowEffect ? "coverflow" : undefined}
        modules={modules}
        className={swiperClassName}
        {...additionalOptions}
      >
        {children}
      </Swiper>
      {showNavigation && (
        <div
          key={`${uniqueKey}-buttons`}
          className={twMerge(
            "swiper-nav-row flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-10 mb-0.5",
            buttonsClassName,
          )}
        >
          {component}
          <div
            className={`flex justify-between sm:gap-3 items-center pointer-events-none ${buttonsPositionClass[buttonsPosition]}`}
          >
            <button
              ref={prevRef}
              type="button"
              aria-label="Previous slide"
              disabled={isBeginning && !loop}
              className="swiper-nav-btn"
            >
              <ChevronLeft size={20} strokeWidth={2} aria-hidden />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label="Next slide"
              disabled={isEnd && !loop}
              className="swiper-nav-btn"
            >
              <ChevronRight size={20} strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      )}
      {!showNavigation && component && (
        <div key={`${uniqueKey}-component`}>{component}</div>
      )}
    </>
  );
}

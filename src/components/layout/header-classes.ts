/**
 * Class strings shared between the desktop header (`hp-header.tsx`) and
 * the mobile drawer (`mobile-menu.tsx`). Lives in its own module so both
 * components can import it without circular dependencies.
 *
 * Legacy class: `.hp-header-brand` from `homepage.css`. Kept as a single
 * string export rather than a styled-component so the Logo's `className`
 * prop (the existing API) keeps working unchanged.
 */
export const headerBrandClass =
  "inline-flex items-center text-ink no-underline whitespace-nowrap shrink-0";

/** Right-side cluster: desktop nav + locale + CTA; mobile locale + burger. */
export const headerEndClass =
  "flex flex-1 items-center justify-end min-w-0 gap-7 max-2xl:gap-[22px] max-xl:gap-4 max-lg:gap-2";

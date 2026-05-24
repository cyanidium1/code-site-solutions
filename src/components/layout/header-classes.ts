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

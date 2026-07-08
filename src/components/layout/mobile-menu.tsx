"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

// Drawer JS loads only after the first tap —
// it's never needed for first paint. ssr:false is safe: the drawer is
// closed (renders nothing user-visible) until opened.
const MobileMenuDrawer = dynamic(
  () => import("./mobile-menu-drawer").then((m) => m.MobileMenuDrawer),
  { ssr: false },
);

// Burger button — only visible below 800px (lg breakpoint). Mobile-first:
// shown by default, hidden at lg+.
const burgerBtnClass =
  "inline-flex items-center justify-center w-11 h-11 -mr-2.5 p-0 border-0 bg-transparent text-ink cursor-pointer rounded-xl transition-colors duration-150 hover:bg-[oklch(1_0_0/0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-2 lg:hidden";
const burgerIconClass = "relative w-[22px] h-[14px] inline-block";
// Burger 3-line ↔ X morph. The data-open attribute lives on the parent
// .burgerIcon and the children read it via the `group-data-[open=true]`
// modifier. The transitions are intentionally different per state so the
// closed→open animation feels distinct from open→closed.
const burgerLineBaseClass =
  "absolute left-0 right-0 h-[1.5px] bg-current rounded-[1px] " +
  "transition-[transform,top,opacity] duration-[280ms,280ms,180ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "motion-reduce:transition-none";
// Each line has its own resting top + open transform.
const burgerLine1Class = `${burgerLineBaseClass} top-0 group-data-[open=true]/burger:top-[6px] group-data-[open=true]/burger:rotate-45`;
const burgerLine2Class = `${burgerLineBaseClass} top-[6px] group-data-[open=true]/burger:opacity-0`;
const burgerLine3Class = `${burgerLineBaseClass} top-[12px] group-data-[open=true]/burger:top-[6px] group-data-[open=true]/burger:-rotate-45`;

/** Animated 3-line → X morph. Pure CSS via data-open. */
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`group/burger ${burgerIconClass}`}
      data-open={open ? "true" : "false"}
      aria-hidden="true"
    >
      <span className={burgerLine1Class} />
      <span className={burgerLine2Class} />
      <span className={burgerLine3Class} />
    </span>
  );
}

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // Once true, the drawer chunk stays mounted so close animations work.
  const [hasOpened, setHasOpened] = useState(false);
  const t = useTranslations("Nav");

  const openMenu = useCallback(() => {
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={burgerBtnClass}
        aria-label={t("menuLabel")}
        aria-expanded={isOpen}
        onClick={openMenu}
      >
        <BurgerIcon open={isOpen} />
      </button>
      {hasOpened ? (
        <MobileMenuDrawer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          onClose={closeMenu}
        />
      ) : null}
    </>
  );
}

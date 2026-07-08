"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { X } from "lucide-react";
import { cn } from "./cn";

/**
 * Modal + Drawer on the native <dialog> element — the in-house replacement
 * for HeroUI's Modal/Drawer (removed 2026-07, see docs/superpowers/specs/
 * 2026-07-08-drop-heroui-and-split-css-design.md).
 *
 * `showModal()` provides the hard parts for free: top-layer rendering, focus
 * containment, Esc-to-close (the `cancel` event), and focus return to the
 * opener on close. This file adds: prop-driven open/close sync, backdrop
 * click dismissal, and a CSS exit transition (entry uses @starting-style via
 * the Tailwind `starting:` variant).
 *
 * Background scroll lock lives in globals.css: `html:has(dialog:modal)`.
 */

/** How long the exit transition runs; close() fires after this. */
const EXIT_MS = 200;

function useDialogSync(
  ref: RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Children stay mounted from showModal() until the dialog actually closes,
  // so the exit animation never runs on an empty panel (isOpen can flip false
  // a whole animation-length before close() fires).
  const [isPresent, setIsPresent] = useState(false);

  // Animate out, then actually close. Reduced-motion still works: the
  // timeout fires regardless of whether a transition ran.
  const requestClose = useCallback(() => {
    const dialog = ref.current;
    if (!dialog || !dialog.open || closeTimer.current) return;
    dialog.setAttribute("data-closing", "");
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      dialog.removeAttribute("data-closing");
      dialog.close();
    }, EXIT_MS);
  }, [ref]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      setIsPresent(true);
    } else if (!isOpen && dialog.open) {
      requestClose();
    }
  }, [isOpen, ref, requestClose]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    // Esc (cancel) → run our exit animation instead of the instant close.
    const onCancel = (e: Event) => {
      e.preventDefault();
      requestClose();
    };
    // Native close (any path) → report state up.
    const onClose = () => {
      setIsPresent(false);
      onOpenChange(false);
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [ref, onOpenChange, requestClose]);

  // A click that lands on the <dialog> itself (not its children) is a
  // backdrop click — the panel fills the dialog box, so only the backdrop
  // area hits the dialog element directly.
  const onBackdropClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) requestClose();
    },
    [requestClose],
  );

  return { onBackdropClick, requestClose, isPresent };
}

export type DialogClassNames = {
  base?: string;
  header?: string;
  body?: string;
  footer?: string;
  closeButton?: string;
};

const BACKDROP_CLASS =
  "backdrop:bg-[oklch(0.06_0.005_300/0.6)] backdrop:backdrop-blur-[6px]";

const CLOSE_BUTTON_BASE =
  "absolute top-3 end-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full " +
  "text-ink-3 cursor-pointer transition-colors hover:bg-[oklch(1_0_0/0.06)] hover:text-ink " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft";

// ─── Modal ──────────────────────────────────────────────────────────────────

const MODAL_SIZE: Record<"lg" | "2xl", string> = {
  lg: "max-w-[512px]",
  "2xl": "max-w-[672px]",
};

const MODAL_BASE =
  // Centered top-layer panel. `m-auto` centers because a modal dialog's
  // default position is a fixed-pos grid over the viewport.
  "m-auto w-[calc(100vw-2rem)] flex-col max-h-[calc(100dvh-4rem)] " +
  "rounded-[22px] border border-line bg-[oklch(0.13_0.005_300)] text-ink p-0 " +
  // display:flex only while open — <dialog> must stay display:none when closed.
  "open:flex " +
  // Entry/exit: fade + slight scale. @starting-style drives the entry.
  "opacity-100 scale-100 transition-[opacity,transform,display,overlay] duration-200 transition-discrete " +
  "starting:opacity-0 starting:scale-95 " +
  "data-[closing]:opacity-0 data-[closing]:scale-95 " +
  "backdrop:transition-opacity backdrop:duration-200 starting:backdrop:opacity-0 data-[closing]:backdrop:opacity-0 " +
  "motion-reduce:transition-none motion-reduce:backdrop:transition-none";

export function Modal({
  isOpen,
  onOpenChange,
  size = "lg",
  hideCloseButton,
  classNames,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "lg" | "2xl";
  hideCloseButton?: boolean;
  classNames?: DialogClassNames;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { onBackdropClick, requestClose, isPresent } = useDialogSync(ref, isOpen, onOpenChange);

  // Children mount while the dialog is actually open (isPresent) so closed
  // dialogs cost nothing (parity with HeroUI, which unmounts its portal) and
  // the exit animation keeps its content.
  return (
    <dialog
      ref={ref}
      className={cn(MODAL_BASE, MODAL_SIZE[size], BACKDROP_CLASS, classNames?.base)}
      onClick={onBackdropClick}
    >
      {isOpen || isPresent ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {!hideCloseButton ? (
            <button
              type="button"
              aria-label="Close"
              className={cn(CLOSE_BUTTON_BASE, classNames?.closeButton)}
              onClick={requestClose}
            >
              <X size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : null}
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

export function ModalHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("flex flex-col gap-1 px-6 pt-6 pb-2", className)}>{children}</div>;
}

/** Scroll container — HeroUI's `scrollBehavior="inside"`. */
export function ModalBody({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-2", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex justify-end gap-3 px-6 pb-6 pt-2", className)}>{children}</div>
  );
}

// ─── Drawer ─────────────────────────────────────────────────────────────────

const DRAWER_BASE =
  // Full-height right slide-over panel.
  "me-0 ms-auto mt-0 mb-0 h-dvh max-h-dvh w-screen max-w-[420px] " +
  "flex-col rounded-none border-0 border-l border-line bg-bg text-ink p-0 " +
  "open:flex " +
  "translate-x-0 transition-[translate,transform,display,overlay] duration-300 ease-out transition-discrete " +
  "starting:translate-x-full " +
  "data-[closing]:translate-x-full " +
  "backdrop:transition-opacity backdrop:duration-300 starting:backdrop:opacity-0 data-[closing]:backdrop:opacity-0 " +
  "motion-reduce:transition-none motion-reduce:backdrop:transition-none";

export function Drawer({
  isOpen,
  onOpenChange,
  hideCloseButton = true,
  classNames,
  children,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hideCloseButton?: boolean;
  classNames?: DialogClassNames;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { onBackdropClick, requestClose, isPresent } = useDialogSync(ref, isOpen, onOpenChange);

  return (
    <dialog
      ref={ref}
      className={cn(DRAWER_BASE, BACKDROP_CLASS, classNames?.base)}
      onClick={onBackdropClick}
    >
      {isOpen || isPresent ? (
        <div className="relative flex min-h-0 flex-1 flex-col">
          {!hideCloseButton ? (
            <button
              type="button"
              aria-label="Close"
              className={cn(CLOSE_BUTTON_BASE, classNames?.closeButton)}
              onClick={requestClose}
            >
              <X size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : null}
          {children}
        </div>
      ) : null}
    </dialog>
  );
}

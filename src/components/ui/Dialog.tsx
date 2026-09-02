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
 * Background scroll lock lives in globals.css (`html.dialog-open`); the class
 * is toggled here, ref-counted so nested dialogs cannot unlock each other.
 */

/** Открытых модалок сейчас. Разблокируем скролл только когда закрылась последняя. */
let openDialogs = 0;

function lockScroll() {
  openDialogs += 1;
  document.documentElement.classList.add("dialog-open");
}

function unlockScroll() {
  openDialogs = Math.max(0, openDialogs - 1);
  if (openDialogs === 0) document.documentElement.classList.remove("dialog-open");
}

/** Скільки триває анімація виходу; close() викликається після неї.
 *  Модалка згасає за 200 мс, шухляда їде за 300 — одна константа на двох
 *  обрізала шухляді анімацію на третині. */
const MODAL_EXIT_MS = 200;
const DRAWER_EXIT_MS = 300;

function useDialogSync(
  ref: RefObject<HTMLDialogElement | null>,
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  exitMs: number,
) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Блокировка скролла парная: снять её можно только если этот диалог её ставил.
  const locked = useRef(false);
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
      // `data-closing` НЕ знімаємо тут. У переході є `overlay` з
      // allow-discrete, тож після close() елемент ще лишається у top layer
      // на час анімації. Якщо зняти атрибут до close(), панель на цей час
      // повертається у видимий стан — і користувач бачить, як меню блимає
      // вже після того, як закрив його. Атрибут знімає обробник `close`,
      // коли ховати вже нічого.
      dialog.close();
    }, exitMs);
  }, [ref, exitMs]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.removeAttribute("data-closing");
      dialog.showModal();
      if (!locked.current) {
        locked.current = true;
        lockScroll();
      }
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
      dialog.removeAttribute("data-closing");
      if (locked.current) {
        locked.current = false;
        unlockScroll();
      }
      setIsPresent(false);
      onOpenChange(false);
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (locked.current) {
        locked.current = false;
        unlockScroll();
      }
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

// Затемнение везде, размытие — только с md. На телефоне это размытие ложится
// поверх страницы, где уже около тридцати слоёв backdrop-filter (шапка, карточки,
// селекты), и мобильный GPU пересобирает всё это на открытии и на закрытии.
// Затемнения достаточно: панель и так перекрывает фон.
const BACKDROP_CLASS =
  "backdrop:bg-[oklch(0.06_0.005_300/0.6)] md:backdrop:backdrop-blur-[6px]";

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
  const { onBackdropClick, requestClose, isPresent } = useDialogSync(
    ref, isOpen, onOpenChange, MODAL_EXIT_MS,
  );

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
  const { onBackdropClick, requestClose, isPresent } = useDialogSync(
    ref, isOpen, onOpenChange, DRAWER_EXIT_MS,
  );

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

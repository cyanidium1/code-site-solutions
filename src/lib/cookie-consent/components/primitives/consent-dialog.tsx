"use client";

import type { ReactNode } from "react";
import { useFocusTrap } from "../../hooks/use-focus-trap";
import { dialogClass, overlayClass } from "../../styles/classes";
import styles from "../../styles/consent.module.css";

type Props = {
  open: boolean;
  onClose: () => void;
  /** id of the dialog title element. */
  labelledBy: string;
  children: ReactNode;
};

export function ConsentDialog({ open, onClose, labelledBy, children }: Props) {
  const trapRef = useFocusTrap<HTMLDivElement>(open, onClose);
  if (!open) return null;
  return (
    <div
      className={overlayClass}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`${dialogClass} ${styles.dialogIn}`}
      >
        {children}
      </div>
    </div>
  );
}

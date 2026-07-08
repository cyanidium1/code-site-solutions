"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import type { LeadFormLocale } from "@/constants/form-options";

// Modal UI + LeadForm (formik/yup + ui primitives) load only on first open —
// none of it is needed for first paint on any page. ssr:false is safe:
// the modal renders nothing until opened.
const LeadModalDialog = dynamic(
  () => import("./dialog").then((m) => m.LeadModalDialog),
  { ssr: false },
);

export type OpenLeadModalOptions = {
  /** Recorded as the lead source so the owner sees which CTA was clicked. */
  source?: string;
  locale?: LeadFormLocale;
  /** Preselects a pricing tier in the form. */
  tier?: string;
  /** Overrides the modal heading. */
  title?: string;
  /** Overrides the modal subheading. */
  sub?: string;
};

type LeadModalContextValue = {
  open: (opts?: OpenLeadModalOptions) => void;
  close: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

export function LeadModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Once true, the dialog chunk stays mounted so close animations work.
  const [hasOpened, setHasOpened] = useState(false);
  const [opts, setOpts] = useState<OpenLeadModalOptions>({});

  const open = useCallback((next?: OpenLeadModalOptions) => {
    setOpts(next ?? {});
    setHasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<LeadModalContextValue>(
    () => ({ open, close }),
    [open, close],
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      {hasOpened ? (
        <LeadModalDialog isOpen={isOpen} onOpenChange={setIsOpen} opts={opts} />
      ) : null}
    </LeadModalContext.Provider>
  );
}

export function useLeadModal(): LeadModalContextValue {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal must be used within a LeadModalProvider");
  }
  return ctx;
}

"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { LeadForm } from "@/components/blocks/lead-form";
import type { LeadFormLocale } from "@/constants/form-options";
import type { OpenLeadModalOptions } from "./index";

const COPY: Record<LeadFormLocale, { title: string; sub: string }> = {
  uk: {
    title: "Залиште заявку",
    sub: "Відповідаємо протягом 1–2 годин у робочий час.",
  },
  en: {
    title: "Request an estimate",
    sub: "We reply within 1–2 hours during business hours.",
  },
};

const MODAL_CLASSNAMES = {
  base: "!bg-[oklch(0.13_0.005_300)] !border !border-line text-ink !rounded-[22px]",
  backdrop: "!bg-[oklch(0.06_0.005_300/0.6)] !backdrop-blur-[6px]",
  header: "flex flex-col gap-1 px-6 pt-6 pb-2",
  body: "px-6 pb-7 pt-2",
  closeButton:
    "text-ink-3 hover:bg-[oklch(1_0_0/0.06)] hover:text-ink transition-colors",
};

export function LeadModalDialog({
  isOpen,
  onOpenChange,
  opts,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  opts: OpenLeadModalOptions;
}) {
  const locale = opts.locale ?? "uk";
  const copy = COPY[locale];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      classNames={MODAL_CLASSNAMES}
    >
      <ModalContent>
        <ModalHeader>
          <span className="font-sans text-[22px] font-bold tracking-[-0.01em] text-ink">
            {opts.title ?? copy.title}
          </span>
          <span className="text-[13.5px] leading-[1.5] text-ink-dim font-normal">
            {opts.sub ?? copy.sub}
          </span>
        </ModalHeader>
        <ModalBody>
          {/* Remount per open so the form resets between sessions. */}
          <LeadForm
            key={`${opts.source ?? "modal"}-${isOpen}`}
            variant="compact"
            source={opts.source ?? "modal"}
            locale={locale}
            tier={opts.tier}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

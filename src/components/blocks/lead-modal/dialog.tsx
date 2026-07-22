"use client";

import { Modal, ModalBody, ModalHeader } from "@/components/ui";
import { LeadForm } from "@/components/blocks/lead-form";
import type { LeadFormLocale } from "@/constants/form-options";
import type { OpenLeadModalOptions } from "./index";

type ModalCopy = { title: string; sub: string };

const COPY: Record<LeadFormLocale, Record<"default" | "demo", ModalCopy>> = {
  uk: {
    default: {
      title: "Залиште заявку",
      sub: "Відповідаємо протягом 1–2 годин у робочий час.",
    },
    demo: {
      title: "Тестовий доступ до адмін-панелі",
      sub: "Залишіть контакт — надішлемо посилання на тестову адмін-панель і дані для входу.",
    },
  },
  en: {
    default: {
      title: "Request an estimate",
      sub: "We reply within 1–2 hours during business hours.",
    },
    demo: {
      title: "Demo admin panel access",
      sub: "Leave a contact and we'll send a link to the demo admin panel with login details.",
    },
  },
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
  const variant = opts.formVariant ?? "compact";
  const copy = COPY[locale][variant === "demo" ? "demo" : "default"];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
      <ModalHeader>
        <span className="font-sans text-[22px] font-bold tracking-[-0.01em] text-ink">
          {opts.title ?? copy.title}
        </span>
        <span className="text-[13.5px] leading-[1.5] text-ink-dim font-normal">
          {opts.sub ?? copy.sub}
        </span>
      </ModalHeader>
      <ModalBody className="pb-7">
        {/* Remount per open so the form resets between sessions. */}
        <LeadForm
          key={`${opts.source ?? "modal"}-${isOpen}`}
          variant={variant}
          source={opts.source ?? "modal"}
          locale={locale}
          tier={opts.tier}
        />
      </ModalBody>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { hpInnerClass } from "@/components/homepage/shared";

type Status = "idle" | "submitting" | "success" | "error";

export function Newsletter() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: email,
          source: "newsletter",
          description: "Newsletter signup",
        }),
      });
      if (!res.ok) throw new Error("Lead endpoint returned non-OK");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const buttonLabel =
    status === "submitting"
      ? "…"
      : status === "success"
        ? t("success")
        : t("button");

  return (
    <section className="relative py-9 lg:py-14 px-6 sm:px-8 lg:px-12 overflow-hidden bg-bg">
      <div className={hpInnerClass}>
        <div className="flex flex-col gap-6 rounded-[22px] border border-line bg-[oklch(1_0_0_/_0.02)] px-9 py-8 min-[800px]:flex-row min-[800px]:items-center min-[800px]:justify-between">
          <div>
            <div className="font-sans text-[22px] font-semibold text-ink">{t("heading")}</div>
            <p className="mt-1.5 max-w-[420px] text-[13.5px] leading-[1.55] text-ink-dim">
              {t("sub")}
            </p>
          </div>
          <form className="flex flex-wrap gap-2.5" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              required
              placeholder={t("placeholder")}
              className="min-w-[260px] flex-1 rounded-full border border-line-strong bg-[oklch(1_0_0_/_0.04)] px-[18px] py-3 font-sans text-[14px] text-ink outline-none transition-colors duration-200 placeholder:text-ink-3 focus:border-accent aria-[invalid=true]:border-[oklch(0.65_0.18_25)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              disabled={status === "submitting" || status === "success"}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center min-h-11 cursor-pointer rounded-full border-0 bg-brand-gradient px-6 py-3 font-sans text-[13px] font-semibold text-white transition-transform duration-200 hover:-translate-y-px"
              disabled={status === "submitting" || status === "success"}
            >
              {buttonLabel}
            </button>
          </form>
          {status === "error" ? (
            <p
              id="newsletter-error"
              role="alert"
              className="mt-2.5 font-sans text-[13px] text-[oklch(0.78_0.16_25)]"
            >
              {t("error")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

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
    <section className="hp-section tight">
      <div className="hp-inner">
        <div className="hp-news-card">
          <div>
            <div className="hp-news-h">{t("heading")}</div>
            <p className="hp-news-sub">{t("sub")}</p>
          </div>
          <form className="hp-news-form" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              required
              placeholder={t("placeholder")}
              className="hp-news-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "newsletter-error" : undefined}
              disabled={status === "submitting" || status === "success"}
            />
            <button
              type="submit"
              className="hp-news-btn"
              disabled={status === "submitting" || status === "success"}
            >
              {buttonLabel}
            </button>
          </form>
          {status === "error" ? (
            <p
              id="newsletter-error"
              role="alert"
              className="hp-news-error"
            >
              Не вдалося надіслати. Спробуйте ще раз.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

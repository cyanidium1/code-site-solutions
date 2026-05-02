"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="hp-section tight">
      <div className="hp-inner">
        <div className="hp-news-card">
          <div>
            <div className="hp-news-h">{t("heading")}</div>
            <p className="hp-news-sub">{t("sub")}</p>
          </div>
          <form
            className="hp-news-form"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="email"
              required
              placeholder={t("placeholder")}
              className="hp-news-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="hp-news-btn">
              {submitted ? t("success") : t("button")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

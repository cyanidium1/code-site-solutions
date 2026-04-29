"use client";

import { useState } from "react";

export function Newsletter({
  heading = "Newsletter",
  sub = "Раз на місяць — добірка з 3 сильних статей. Без спаму.",
  placeholder = "email@example.com",
  buttonLabel = "Subscribe",
}: Partial<{
  heading: string;
  sub: string;
  placeholder: string;
  buttonLabel: string;
}> = {}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="hp-section tight">
      <div className="hp-inner">
        <div className="hp-news-card">
          <div>
            <div className="hp-news-h">{heading}</div>
            <p className="hp-news-sub">{sub}</p>
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
              placeholder={placeholder}
              className="hp-news-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="hp-news-btn">
              {submitted ? "Готово ✓" : buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

import type * as React from "react";

/**
 * Off-screen honeypot input. Real users never see or focus it; bots that blindly
 * fill every field will set it, and the server drops any lead whose `hp` value
 * is non-empty. Hidden via off-screen positioning (not display:none) so naive
 * bots still render and fill it. Kept out of the tab order and the a11y tree.
 */
const HP_WRAP_CLASS =
  "absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0";

export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={HP_WRAP_CLASS} aria-hidden="true">
      <label>
        Company website
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

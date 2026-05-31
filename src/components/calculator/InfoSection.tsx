import type { ReactNode } from "react";
import {
  hpEyebrowClass,
  hpEyebrowDotClass,
  hpH2Class,
  hpInnerClass,
  hpSectionClass,
  hpSubClass,
} from "@/components/homepage/shared";

type InfoSectionProps = {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  /** Tailwind padding override. Defaults to py-24/16. */
  padding?: string;
  children: ReactNode;
};

export function InfoSection({
  eyebrow,
  title,
  sub,
  padding = "py-24 max-md-wide:py-16",
  children,
}: InfoSectionProps) {
  return (
    <section className={`${hpSectionClass} ${padding}`}>
      <div className={hpInnerClass}>
        <div className="mb-14 flex flex-col items-start gap-0 max-md-wide:mb-8">
          <span className={hpEyebrowClass}>
            <span className={hpEyebrowDotClass} />
            <span>{eyebrow}</span>
          </span>
          <h2 className={hpH2Class}>{title}</h2>
          {sub ? <p className={hpSubClass}>{sub}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { consentPolicyPath } from "../config";
import type { ConsentCopy } from "../locales";
import {
  bannerActionsClass,
  bannerBodyClass,
  bannerClass,
  bannerInnerClass,
  bannerTitleClass,
} from "../styles/classes";
import styles from "../styles/consent.module.css";
import { ConsentButton } from "./primitives/consent-button";

type Props = {
  copy: ConsentCopy;
  locale: string;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomise: () => void;
};

export function ConsentBanner({ copy, locale, onAcceptAll, onRejectAll, onCustomise }: Props) {
  return (
    <section
      className={`${bannerClass} ${styles.bannerIn}`}
      role="region"
      aria-label={copy.banner.title}
    >
      <div className={bannerInnerClass}>
        <div>
          <p className={bannerTitleClass}>{copy.banner.title}</p>
          <p className={bannerBodyClass}>
            {copy.banner.body}{" "}
            <Link href={consentPolicyPath(locale)}>{copy.banner.policyLinkLabel}</Link>.
          </p>
        </div>
        <div className={bannerActionsClass}>
          <ConsentButton variant="ghost" onClick={onCustomise}>
            {copy.banner.customise}
          </ConsentButton>
          <ConsentButton variant="secondary" onClick={onRejectAll}>
            {copy.banner.reject}
          </ConsentButton>
          <ConsentButton variant="primary" onClick={onAcceptAll}>
            {copy.banner.accept}
          </ConsentButton>
        </div>
      </div>
    </section>
  );
}

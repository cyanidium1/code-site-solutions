"use client";

import Link from "next/link";
import { consentPolicyPath } from "../config";
import type { ConsentCopy } from "../locales";
import {
  bannerActionsClass,
  bannerBodyClass,
  bannerChoiceRowClass,
  bannerClass,
  bannerInnerClass,
  bannerTitleClass,
} from "../styles/classes";
import { ConsentEntryCss, consentBannerInClass } from "../styles/entry-animations";
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
      className={`${bannerClass} ${consentBannerInClass}`}
      role="region"
      aria-label={copy.banner.title}
    >
      <ConsentEntryCss />
      <div className={bannerInnerClass}>
        <div>
          <p className={bannerTitleClass}>{copy.banner.title}</p>
          <p className={bannerBodyClass}>
            {copy.banner.body}{" "}
            {/* Policy sentence: inline continuation on mobile, own line on desktop. */}
            <span className="lg:block">
              {copy.banner.policyLead}{" "}
              <Link href={consentPolicyPath(locale)} prefetch={false}>{copy.banner.policyLinkLabel}</Link>.
            </span>
          </p>
        </div>
        <div className={bannerActionsClass}>
          <ConsentButton variant="ghost" onClick={onCustomise} className="self-start lg:self-auto">
            {copy.banner.customise}
          </ConsentButton>
          <div className={bannerChoiceRowClass}>
            <ConsentButton variant="secondary" onClick={onRejectAll}>
              {copy.banner.reject}
            </ConsentButton>
            <ConsentButton variant="primary" onClick={onAcceptAll}>
              {copy.banner.accept}
            </ConsentButton>
          </div>
        </div>
      </div>
    </section>
  );
}

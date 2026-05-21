import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { localizePath } from "@/lib/i18n-routes";
import "./launch-cta.css";

export function LaunchCta({ locale = "uk" }: { locale?: "uk" | "en" } = {}) {
  const t = useTranslations("LaunchCta");
  const href = localizePath("/contacts", locale === "en");

  return (
    <section className="lcta-section" aria-labelledby="launch-cta-heading">
      <div className="lcta-inner">
        <div className="lcta-content">
          <div className="lcta-intro">
            <div className="lcta-dots" aria-hidden="true">
              <span className="lcta-dot" />
              <span className="lcta-dot" />
              <span className="lcta-dot" />
            </div>
            <h2 id="launch-cta-heading" className="lcta-heading">
              {t("heading")}
            </h2>
          </div>
          <p className="lcta-sub">{t("sub")}</p>
          <Link href={href} className="lcta-button">
            {t("button")}
          </Link>
        </div>
        <div className="lcta-image-wrap" aria-hidden="false">
          <Image
            src="/home/launch-cta-devices.webp"
            alt={t("imageAlt")}
            width={1119}
            height={549}
            sizes="(max-width: 1024px) 90vw, 60vw"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}

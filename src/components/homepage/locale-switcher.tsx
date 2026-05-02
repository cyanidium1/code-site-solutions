"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  const ukHref =
    pathname === "/en"
      ? "/"
      : pathname.startsWith("/en/")
        ? pathname.slice(3)
        : "/";
  const enHref = pathname.startsWith("/en") ? pathname : "/en";

  const currentLabel = locale === "en" ? t("en") : t("uk");

  return (
    <Dropdown
      backdrop="blur"
      placement="bottom-end"
      disableAnimation
      classNames={{
        content: "hp-locale-menu",
      }}
    >
      <DropdownTrigger>
        <button
          type="button"
          className="hp-locale-trigger"
          aria-label={t("ariaLabel")}
        >
          <span>{currentLabel}</span>
          <ChevronDown size={12} strokeWidth={2} aria-hidden />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("ariaLabel")}
        selectionMode="single"
        selectedKeys={new Set([locale])}
        disallowEmptySelection
        onAction={(key) => {
          const target = key === "en" ? enHref : ukHref;
          router.push(target);
        }}
        itemClasses={{
          base: "hp-locale-item",
          title: "hp-locale-item-title",
          selectedIcon: "hp-locale-item-check",
        }}
      >
        <DropdownItem key="uk" hrefLang="uk">
          {t("uk")}
        </DropdownItem>
        <DropdownItem key="en" hrefLang="en">
          {t("en")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

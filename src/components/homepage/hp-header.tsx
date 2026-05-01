"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_NAV_LINKS } from "./header-services";

const NAV_LINKS = [
  { href: "/about", label: "Про нас" },
  { href: "/blog", label: "Блог" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/portfolio", label: "Кейси" },
  { href: "/pricing", label: "Прайс" },
  { href: "/process", label: "Процес" },
  { href: "/contacts", label: "Контакти" },
] as const;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HpHeader() {
  const ddRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ddRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeDd = () => ddRef.current?.removeAttribute("open");

  const servicesActive = SERVICE_NAV_LINKS.some((s) =>
    isActive(pathname, s.href),
  );

  return (
    <header className="hp-header">
      <div className="hp-header-inner">
        <Link href="/" className="hp-header-brand" onClick={closeDd}>
          <em>Code-Site</em>.art
        </Link>
        <nav className="hp-header-nav" aria-label="Головне меню">
          <details ref={ddRef} className="hp-nav-dd">
            <summary
              className={`hp-nav-dd-trigger${servicesActive ? " active" : ""}`}
              aria-current={servicesActive ? "page" : undefined}
            >
              Послуги
              <ChevronDown className="hp-nav-dd-chevron" size={14} strokeWidth={2} aria-hidden />
            </summary>
            <div className="hp-nav-dd-panel">
              {SERVICE_NAV_LINKS.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hp-nav-dd-link${active ? " active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={closeDd}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/#solutions" className="hp-nav-dd-footer" onClick={closeDd}>
                Усі галузі →
              </Link>
            </div>
          </details>
          {NAV_LINKS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
                onClick={closeDd}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/contacts" className="hp-header-cta" onClick={closeDd}>
          Обговорити проєкт
        </Link>
      </div>
    </header>
  );
}

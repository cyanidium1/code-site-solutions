"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { SERVICE_NAV_LINKS } from "./header-services";

export function HpHeader() {
  const ddRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ddRef.current?.removeAttribute("open");
  }, [pathname]);

  const closeDd = () => ddRef.current?.removeAttribute("open");

  return (
    <header className="hp-header">
      <div className="hp-header-inner">
        <Link href="/" className="hp-header-brand" onClick={closeDd}>
          <em>Code-Site</em>.art
        </Link>
        <nav className="hp-header-nav" aria-label="Головне меню">
          <details ref={ddRef} className="hp-nav-dd">
            <summary className="hp-nav-dd-trigger">
              Послуги
              <ChevronDown className="hp-nav-dd-chevron" size={14} strokeWidth={2} aria-hidden />
            </summary>
            <div className="hp-nav-dd-panel">
              {SERVICE_NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hp-nav-dd-link"
                  onClick={closeDd}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/#solutions" className="hp-nav-dd-footer" onClick={closeDd}>
                Усі галузі →
              </Link>
            </div>
          </details>
          <Link href="/about">Про нас</Link>
          <Link href="/blog">Блог</Link>
          <Link href="/calculator">Калькулятор</Link>
          <Link href="/portfolio" onClick={closeDd}>
            Кейси
          </Link>
          <Link href="/pricing" onClick={closeDd}>
            Прайс
          </Link>
          <Link href="/#process" onClick={closeDd}>
            Процес
          </Link>
          <Link href="/#contact" onClick={closeDd}>
            Контакти
          </Link>
        </nav>
        <Link href="/#contact" className="hp-header-cta" onClick={closeDd}>
          Обговорити проєкт
        </Link>
      </div>
    </header>
  );
}

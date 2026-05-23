import Link from "next/link";
import { twMerge } from "tailwind-merge";
import LogoSVG from "./logo-svg";

interface LogoProps {
  className?: string;
  href?: string;
  variant?: "blue" | "pink" | "dark";
  onClick?: () => void;
}

export default function Logo({
  className = "",
  href = "/",
  variant = "blue",
  onClick,
}: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={twMerge(
        "relative inline-block outline-none text-white",
        className,
      )}
      aria-label="Code-Site.Art — home"
    >
      <LogoSVG variant={variant} animated={true} />
    </Link>
  );
}

"use client";
import { twMerge } from "tailwind-merge";
import { useId } from "react";

interface LogoSVGProps {
  className?: string;
  variant?: "blue" | "pink" | "dark";
  animated?: boolean;
}

export default function LogoSVG({
  className = "",
  variant = "blue",
  animated = true,
}: LogoSVGProps) {
  // useId() returns ":r0:" style ids; sanitize so they're valid SVG ids.
  const rawId = useId().replace(/:/g, "").replace(/[^a-zA-Z0-9]/g, "");
  const uniqueId = rawId || `id-${Math.random().toString(36).substring(2, 9)}`;
  const gradientIdBlue = `logo-gradient-blue-${uniqueId}`;
  const gradientIdPink = `logo-gradient-pink-${uniqueId}`;
  const gradientIdDark = `logo-gradient-dark-${uniqueId}`;

  const fillValue = animated
    ? variant === "blue"
      ? `url(#${gradientIdBlue})`
      : variant === "pink"
        ? `url(#${gradientIdPink})`
        : `url(#${gradientIdDark})`
    : "currentColor";

  const animationClass = animated
    ? variant === "blue"
      ? "animate-svg-glow-blue"
      : variant === "pink"
        ? "animate-svg-glow-pink"
        : "animate-svg-glow-dark"
    : "";

  return (
    <div className={twMerge("inline-block", animationClass)}>
      <svg
        viewBox="0 0 129 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={twMerge("w-auto h-[12px]", className)}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientIdBlue} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#fff" />
            <stop offset="94.04%" stopColor="#b5daff" />
          </linearGradient>
          <linearGradient id={gradientIdPink} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#fff" />
            <stop offset="94.04%" stopColor="#ffb5e6" />
          </linearGradient>
          <linearGradient id={gradientIdDark} x1="129" y1="10" x2="0" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="rotate(125 64.5 5)">
            <stop offset="22.37%" stopColor="#000" />
            <stop offset="94.04%" stopColor="#b5daff" />
          </linearGradient>
        </defs>
        <path d="M16.7342 7.52095V9.98699L10.8677 6.26807V3.71898L16.7342 4.95911e-05V2.46609L12.5662 4.99352L16.7342 7.52095Z" fill={fillValue} />
        <path d="M22.8121 4.99357L18.6442 2.46614V9.53674e-05L24.5106 3.71902V6.26811L18.6442 9.98704V7.52099L22.8121 4.99357Z" fill={fillValue} />
        <path d="M2.87258 9.03033C0.67314 9.03033 0 8.38764 0 6.26822V3.27141C0 1.14115 0.669226 0.509296 2.87258 0.509296H8.05418C9.42393 0.509296 10.054 1.28919 10.2693 1.75857L9.11476 2.84897C8.9543 2.51318 8.63339 2.19184 7.93286 2.19184H2.88432C2.07812 2.19184 1.79634 2.46264 1.79634 3.2678V6.27544C1.79634 6.99395 1.9568 7.3514 2.88432 7.3514H7.99547C8.70775 7.3514 9.00127 7.01561 9.16173 6.69427L10.3162 7.77023C10.1166 8.23961 9.4709 9.0195 8.10114 9.0195H2.87258V9.03033Z" fill={fillValue} />
        <path d="M25.9122 9.03035V0.509315H33.6807C35.9232 0.509315 36.5807 1.19172 36.5807 3.27143V6.26824C36.5807 8.35878 35.9232 9.03035 33.6807 9.03035H25.9122ZM34.7687 3.28226C34.7687 2.44099 34.4752 2.19186 33.6807 2.19186H27.736V7.35503H33.6807C34.4987 7.35503 34.7687 7.12034 34.7687 6.27907V3.28226Z" fill={fillValue} />
        <path d="M38.251 9.03035V0.509315H47.1231V2.19186H40.063V4.07299H46.9196V5.45224H40.063V7.35864H47.1231V9.03035H38.251Z" fill={fillValue} />
        <path d="M66.3979 6.56436C66.3979 8.37328 65.5917 9.0268 63.3923 9.0268H56.1208C56.5161 7.3587 56.1208 9.00152 56.5083 7.35508H63.271C64.2494 7.35508 64.5312 7.14567 64.5312 6.41272C64.5312 5.69421 64.2611 5.47035 63.3101 5.47035H59.5648C57.3497 5.47035 56.6374 4.741 56.6374 3.18122V2.89598C56.6374 1.199 57.3771 0.50576 59.6157 0.50576H66.7736C66.5584 1.1304 66.7619 0.541867 66.1984 2.20275H59.6157C58.7312 2.20275 58.4768 2.46271 58.4768 3.13067C58.4768 3.79864 58.7312 4.07304 59.6157 4.07304H63.3062C65.5996 4.07304 66.394 4.76628 66.394 6.26468V6.56436H66.3979Z" fill={fillValue} />
        <path d="M66.4374 9.03024L69.2943 0.51281H71.3333L68.5194 8.99052L66.4374 9.03024Z" fill={fillValue} />
        <path d="M74.7222 9.03023V2.19535H71.5718L72.1236 0.512806H79.8999V2.19535H76.5303V9.03023H74.7222Z" fill={fillValue} />
        <path d="M80.6913 9.03035V0.509315H89.5634V2.19186H82.5033V4.07299H89.3599V5.45224H82.5033V7.35864H89.5634V9.03035H80.6913Z" fill={fillValue} />
        <path d="M101.503 0.509315L96.4462 9.03035H98.3756L103.178 0.509315H101.503ZM103.859 1.28921L102.919 2.96092L104.551 5.71581H101.369L100.618 7.05174H105.24L106.395 9.03396H108.461L103.859 1.28921Z" fill={fillValue} />
        <path d="M117.047 9.03032L113.854 6.24293H110.942V9.03032H109.118V0.509285H116.66C118.621 0.509285 119.306 1.21335 119.306 3.14503V3.66496C119.306 5.74467 118.46 6.21405 116.179 6.21405L119.599 9.0231H117.047V9.03032ZM117.505 3.43388C117.505 2.60344 117.4 2.20988 116.605 2.20988H110.942V4.84562H116.605C117.251 4.84562 117.505 4.58566 117.505 3.84188V3.43388Z" fill={fillValue} />
        <path d="M123.822 9.03023V2.19535H120.453V0.512806H129V2.19535H125.63V9.03023H123.822Z" fill={fillValue} />
        <path d="M92.1452 9.05203C92.7655 9.05203 93.2684 8.58808 93.2684 8.01578C93.2684 7.44348 92.7655 6.97954 92.1452 6.97954C91.5248 6.97954 91.022 7.44348 91.022 8.01578C91.022 8.58808 91.5248 9.05203 92.1452 9.05203Z" fill={fillValue} />
        <path d="M53.8825 4.05475H48.877V5.42678H53.8825V4.05475Z" fill={fillValue} />
      </svg>
    </div>
  );
}

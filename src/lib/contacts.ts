import type { LucideIcon } from "lucide-react";
import {
  Send,
  MessageCircle,
  MessageSquare,
  Phone,
  Mail,
  Instagram,
  Linkedin,
} from "lucide-react";

export type ChannelKind =
  | "telegram"
  | "whatsapp"
  | "viber"
  | "phone"
  | "email"
  | "instagram"
  | "linkedin";

export type Channel = {
  kind: ChannelKind;
  icon: LucideIcon;
  label: string;
  handle: string;
  href: string;
  responseTime: string;
  external?: boolean;
  featured?: boolean;
};

const PHONE_RAW = "+380970068707";
const PHONE_DISPLAY = "+380 97 006 87 07";
const TG_GREETING = "Доброго дня, хочу обговорити сайт";
const EMAIL_SUBJECT = "Запит на сайт — Code-Site.Art";

export const CHANNELS: readonly Channel[] = [
  {
    kind: "telegram",
    icon: Send,
    label: "Telegram",
    handle: "@fedirdev",
    href: `https://t.me/fedirdev?text=${encodeURIComponent(TG_GREETING)}`,
    responseTime: "30 хв в робочий час",
    external: true,
    featured: true,
  },
  {
    kind: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    handle: PHONE_DISPLAY,
    href: `https://wa.me/${PHONE_RAW.replace("+", "")}?text=${encodeURIComponent(
      TG_GREETING,
    )}`,
    responseTime: "30 хв в робочий час",
    external: true,
  },
  {
    kind: "viber",
    icon: MessageSquare,
    label: "Viber",
    handle: PHONE_DISPLAY,
    href: `viber://chat?number=${encodeURIComponent(PHONE_RAW)}`,
    responseTime: "до 1 години",
  },
  {
    kind: "phone",
    icon: Phone,
    label: "Дзвінок",
    handle: PHONE_DISPLAY,
    href: `tel:${PHONE_RAW}`,
    responseTime: "Пн-Пт 09:00-19:00 EET",
  },
  {
    kind: "email",
    icon: Mail,
    label: "Email",
    handle: "hi@code-site.art",
    href: `mailto:hi@code-site.art?subject=${encodeURIComponent(EMAIL_SUBJECT)}`,
    responseTime: "1-2 робочі години",
  },
  {
    kind: "instagram",
    icon: Instagram,
    label: "Instagram",
    handle: "@cyanidium",
    href: "https://instagram.com/cyanidium",
    responseTime: "до 4 годин",
    external: true,
  },
  {
    kind: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    handle: "/in/fediralpatov",
    href: "https://linkedin.com/in/fediralpatov",
    responseTime: "1-2 дні",
    external: true,
  },
] as const;

export const CONTACT_META = {
  city: "Київ",
  hours: "Пн-Пт 09:00-19:00 EET",
  languages: "UA · RU · EN",
} as const;

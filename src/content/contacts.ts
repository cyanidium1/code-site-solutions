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
import { SITE_CONTACT } from "@/constants/site";

export type ContactsLocale = "uk" | "en";

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

const PHONE_RAW = SITE_CONTACT.phoneRaw;
const PHONE_DISPLAY = SITE_CONTACT.phoneDisplay;

/* ─── UA channels (default) ──────────────────────────────────────────────── */

const TG_GREETING_UK = "Доброго дня, хочу обговорити сайт";
const EMAIL_SUBJECT_UK = "Запит на сайт — Code-Site.Art";

const CHANNELS_UK: readonly Channel[] = [
  {
    kind: "telegram",
    icon: Send,
    label: "Telegram",
    handle: SITE_CONTACT.telegramHandle,
    href: `${SITE_CONTACT.telegram}?text=${encodeURIComponent(TG_GREETING_UK)}`,
    responseTime: "30 хв в робочий час",
    external: true,
    featured: true,
  },
  {
    kind: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    handle: SITE_CONTACT.whatsappDisplay,
    href: `https://wa.me/${SITE_CONTACT.whatsapp}?text=${encodeURIComponent(
      TG_GREETING_UK,
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
    handle: SITE_CONTACT.email,
    href: `mailto:${SITE_CONTACT.email}?subject=${encodeURIComponent(EMAIL_SUBJECT_UK)}`,
    responseTime: "1-2 робочі години",
  },
  {
    kind: "instagram",
    icon: Instagram,
    label: "Instagram",
    handle: SITE_CONTACT.instagramHandle,
    href: SITE_CONTACT.instagram,
    responseTime: "до 4 годин",
    external: true,
  },
  {
    kind: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    handle: SITE_CONTACT.linkedinHandle,
    href: SITE_CONTACT.linkedin,
    responseTime: "1-2 дні",
    external: true,
  },
] as const;

/* ─── EN channels ────────────────────────────────────────────────────────── */

const TG_GREETING_EN = "Hi — I'd like to discuss a website project";
const EMAIL_SUBJECT_EN = "Project inquiry — Code-Site.Art";

const CHANNELS_EN: readonly Channel[] = [
  {
    kind: "telegram",
    icon: Send,
    label: "Telegram",
    handle: SITE_CONTACT.telegramHandle,
    href: `${SITE_CONTACT.telegram}?text=${encodeURIComponent(TG_GREETING_EN)}`,
    responseTime: "within 30 minutes (business hours)",
    external: true,
    featured: true,
  },
  {
    kind: "whatsapp",
    icon: MessageCircle,
    label: "WhatsApp",
    handle: SITE_CONTACT.whatsappDisplay,
    href: `https://wa.me/${SITE_CONTACT.whatsapp}?text=${encodeURIComponent(
      TG_GREETING_EN,
    )}`,
    responseTime: "within 30 minutes (business hours)",
    external: true,
  },
  {
    kind: "viber",
    icon: MessageSquare,
    label: "Viber",
    handle: PHONE_DISPLAY,
    href: `viber://chat?number=${encodeURIComponent(PHONE_RAW)}`,
    responseTime: "within 1 hour",
  },
  {
    kind: "phone",
    icon: Phone,
    label: "Phone",
    handle: PHONE_DISPLAY,
    href: `tel:${PHONE_RAW}`,
    responseTime: "Mon-Fri 09:00-19:00 EET",
  },
  {
    kind: "email",
    icon: Mail,
    label: "Email",
    handle: SITE_CONTACT.email,
    href: `mailto:${SITE_CONTACT.email}?subject=${encodeURIComponent(EMAIL_SUBJECT_EN)}`,
    responseTime: "within 1-2 business hours",
  },
  {
    kind: "instagram",
    icon: Instagram,
    label: "Instagram",
    handle: SITE_CONTACT.instagramHandle,
    href: SITE_CONTACT.instagram,
    responseTime: "within 4 hours",
    external: true,
  },
  {
    kind: "linkedin",
    icon: Linkedin,
    label: "LinkedIn",
    handle: SITE_CONTACT.linkedinHandle,
    href: SITE_CONTACT.linkedin,
    responseTime: "within 1-2 days",
    external: true,
  },
] as const;

export const CHANNELS_BY_LOCALE: Record<ContactsLocale, readonly Channel[]> = {
  uk: CHANNELS_UK,
  en: CHANNELS_EN,
};

/** Default UA channels — preserved for back-compat with existing imports. */
export const CHANNELS = CHANNELS_UK;

export type ContactMeta = {
  city: string;
  hours: string;
  languages: string;
};

export const CONTACT_META_BY_LOCALE: Record<ContactsLocale, ContactMeta> = {
  uk: {
    city: "Київ",
    hours: "Пн-Пт 09:00-19:00 EET",
    languages: "UA · RU · EN",
  },
  en: {
    city: "Kyiv",
    hours: "Mon-Fri 09:00-19:00 EET",
    languages: "UA · RU · EN",
  },
};

/** Default UA meta — preserved for back-compat. */
export const CONTACT_META = CONTACT_META_BY_LOCALE.uk;

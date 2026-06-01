import { NextResponse } from "next/server";
import type { LeadAttribution } from "@/types/lead";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

type LeadPayload = {
  name?: string;
  contact?: string;
  business?: string;
  tier?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  source?: string;
  attribution?: LeadAttribution;
};

function escapeMd(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function buildAttributionBlock(a: LeadAttribution | undefined): string {
  if (!a) return "";
  const line = (label: string, value: string | undefined) =>
    value ? `*${label}:* ${escapeMd(value)}\n` : "";

  const utm =
    a.utm && Object.keys(a.utm).length
      ? Object.entries(a.utm)
          .map(([k, v]) => `${k.replace(/^utm_/, "")}=${v}`)
          .join(", ")
      : "";
  const journey =
    a.journey && a.journey.length ? a.journey.join(" → ") : "";
  const firstVisit = a.firstVisit
    ? a.firstVisit.replace("T", " ").slice(0, 16)
    : "";

  const body =
    line("Реферер", a.referrer || "прямий захід") +
    line("Перша сторінка", a.landingPage) +
    line("UTM", utm || undefined) +
    line("Перший візит", firstVisit) +
    (journey ? `*Шлях по сайту:*\n${escapeMd(journey)}\n` : "");

  return body ? `\n📊 *Звідки прийшов:*\n${body}` : "";
}

function buildMessage(d: LeadPayload): string {
  const line = (label: string, value: string | undefined) =>
    value ? `*${label}:* ${escapeMd(value)}\n` : "";

  return (
    `🆕 *Нова заявка з сайту*\n\n` +
    line("Джерело форми", d.source ?? "/contacts") +
    line("Ім'я", d.name) +
    line("Контакт", d.contact) +
    line("Бізнес", d.business) +
    line("Tier", d.tier) +
    line("Бюджет", d.budget) +
    line("Терміни", d.timeline) +
    `\n*Опис:*\n${d.description ? escapeMd(d.description) : "—"}\n` +
    buildAttributionBlock(d.attribution)
  );
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as LeadPayload;
    const message = buildMessage(data);

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const tgRes = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "MarkdownV2",
          }),
        },
      );

      if (!tgRes.ok) {
        console.error("Telegram API error:", await tgRes.text());
      }
    } else {
      console.log("[LEAD]", message);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Lead error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

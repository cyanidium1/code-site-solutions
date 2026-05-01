import { NextResponse } from "next/server";

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
};

function escapeMd(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function buildMessage(d: LeadPayload): string {
  const line = (label: string, value: string | undefined) =>
    value ? `*${label}:* ${escapeMd(value)}\n` : "";

  return (
    `🆕 *Нова заявка з сайту*\n\n` +
    line("Сторінка", d.source ?? "/contacts") +
    line("Ім'я", d.name) +
    line("Контакт", d.contact) +
    line("Бізнес", d.business) +
    line("Tier", d.tier) +
    line("Бюджет", d.budget) +
    line("Терміни", d.timeline) +
    `\n*Опис:*\n${d.description ? escapeMd(d.description) : "—"}`
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

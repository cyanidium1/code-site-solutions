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
  /** Honeypot — hidden field that only bots fill in. Must stay empty. */
  hp?: string;
};

// Per-field length caps. Keep the rendered Telegram message comfortably under
// the 4096-char limit and reject abusive oversized payloads. description and
// the attribution journey are the two that can realistically blow up.
const CAPS = {
  name: 120,
  contact: 200,
  business: 120,
  tier: 80,
  budget: 80,
  timeline: 80,
  source: 120,
  description: 1500,
  attrValue: 200,
  journeyEntry: 60,
  journeyJoined: 700,
} as const;

function cap(v: string | undefined, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

// In-memory sliding-window rate limit. Best-effort: serverless instances each
// keep their own window, so this blunts naive single-IP floods rather than
// being a hard guarantee. Pair it with the honeypot for real coverage.
const RATE_LIMIT = { windowMs: 60_000, max: 6 };
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;
  const recent = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function escapeMd(s: string): string {
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

function buildAttributionBlock(a: LeadAttribution | undefined): string {
  if (!a) return "";
  const line = (label: string, value: string | undefined) =>
    value ? `*${label}:* ${escapeMd(value)}\n` : "";

  const utm =
    a.utm && Object.keys(a.utm).length
      ? cap(
          Object.entries(a.utm)
            .map(([k, v]) => `${k.replace(/^utm_/, "")}=${v}`)
            .join(", "),
          CAPS.attrValue,
        )
      : "";
  const journey =
    a.journey && a.journey.length
      ? cap(
          a.journey
            .slice(-15)
            .map((p) => (p.length > CAPS.journeyEntry ? `${p.slice(0, CAPS.journeyEntry)}…` : p))
            .join(" → "),
          CAPS.journeyJoined,
        )
      : "";
  const firstVisit = a.firstVisit
    ? a.firstVisit.replace("T", " ").slice(0, 16)
    : "";

  const body =
    line("Реферер", cap(a.referrer, CAPS.attrValue) || "прямий захід") +
    line("Перша сторінка", cap(a.landingPage, CAPS.attrValue)) +
    line("UTM", utm || undefined) +
    line("Перший візит", firstVisit) +
    (journey ? `*Шлях по сайту:*\n${escapeMd(journey)}\n` : "");

  return body ? `\n📊 *Звідки прийшов:*\n${body}` : "";
}

function buildMessage(d: LeadPayload): string {
  const line = (label: string, value: string | undefined) =>
    value ? `*${label}:* ${escapeMd(value)}\n` : "";

  const description = cap(d.description, CAPS.description);

  return (
    `🆕 *Нова заявка з сайту*\n\n` +
    line("Джерело форми", cap(d.source, CAPS.source) ?? "/contacts") +
    line("Ім'я", cap(d.name, CAPS.name)) +
    line("Контакт", cap(d.contact, CAPS.contact)) +
    line("Бізнес", cap(d.business, CAPS.business)) +
    line("Tier", cap(d.tier, CAPS.tier)) +
    line("Бюджет", cap(d.budget, CAPS.budget)) +
    line("Терміни", cap(d.timeline, CAPS.timeline)) +
    `\n*Опис:*\n${description ? escapeMd(description) : "—"}\n` +
    buildAttributionBlock(d.attribution)
  );
}

export async function POST(req: Request) {
  try {
    if (rateLimited(clientIp(req))) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const data = (await req.json()) as LeadPayload;

    // Honeypot tripped → almost certainly a bot. Pretend success and drop the
    // submission silently so the bot doesn't learn it was filtered.
    if (typeof data.hp === "string" && data.hp.trim()) {
      return NextResponse.json({ ok: true });
    }

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

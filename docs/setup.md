# Local setup

## Telegram bot для лідів

Заявки з форми `/contacts/` шлються через бота в особистий чат власника.

### Створення бота

1. Відкрити [@BotFather](https://t.me/BotFather) в Telegram.
2. Команда `/newbot`.
3. Дати ім'я (наприклад `code-site-leads-bot`) і username (`code_site_leads_bot`).
4. Скопіювати токен — це `TELEGRAM_BOT_TOKEN`.

### Отримання chat_id

1. Знайти свого новоствореного бота у Telegram → `/start` (інакше Telegram заблокує доставку).
2. Відкрити [@userinfobot](https://t.me/userinfobot) → `/start` → отримати свій `Id`. Це `TELEGRAM_CHAT_ID`.

### Заповнення `.env.local`

```env
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
```

Якщо ENV vars порожні — `/api/lead` пише лід у `console.log` (для dev). У проді обидва обовʼязкові.

### Перевірка

`POST /api/lead` з body:

```json
{
  "name": "Test",
  "contact": "@test",
  "business": "Healthcare",
  "description": "Перевірка інтеграції бота"
}
```

→ повідомлення приходить у Telegram (Markdown formatting).

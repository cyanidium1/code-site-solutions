# Журнал лідів у Google Sheets

`/api/lead` після відправки в Telegram робить POST на `LEADS_WEBHOOK_URL` з JSON-рядком:
`date, source, page, name, contact, tier, budget, hasSite, siteUrl, config, comment,
gclid, utm_source, utm_medium, utm_campaign, utm_term, utm_content, referrer, landingPage`.
Збій таблиці не ламає заявку — вона вже в Telegram.

## Налаштування (5 хвилин)

1. Створіть Google Sheet, у першому рядку — заголовки в порядку вище.
2. Extensions → Apps Script, вставте:

```js
const COLS = ["date","source","page","name","contact","tier","budget","hasSite","siteUrl",
  "config","comment","gclid","utm_source","utm_medium","utm_campaign","utm_term",
  "utm_content","referrer","landingPage"];

function doPost(e) {
  const row = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow(COLS.map((k) => row[k] ?? ""));
  return ContentService.createTextOutput("ok");
}
```

3. Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone.
4. URL деплою → Vercel env `LEADS_WEBHOOK_URL` (Production + Preview), redeploy.

## GTM / Google Ads

Подія `generate_lead` у dataLayer несе `lead_source`, `lead_tier`, `lead_gclid`, `ads_send_to`.
Подія `contact_click` — `contact_channel` (phone / telegram / whatsapp / email / viber), `contact_page`.
У GTM: тригери Custom Event на обидві, GA4 Event теги, і Google Ads Conversion тег на
`generate_lead` з ID/label з `NEXT_PUBLIC_GADS_LEAD_SEND_TO` (або прописаними в тегу).

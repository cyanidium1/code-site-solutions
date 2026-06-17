# Calendly — temporarily disabled (2026-06-17)

Calendly links were commented out because the booking page looked broken.
`SITE_CONTACT.calendly` (`src/constants/site.ts`) is left in place. To re-enable,
uncomment the blocks marked `CALENDLY DISABLED` at:

- `src/components/calculator/GetFinalCta.tsx` — alt "book a call" link (also restore the `CalendarCheck` import on line 4 and the `getFinal.altOr` separator span)
- `src/components/calculator/EstimateSummary.tsx` — ghost "book a call" button (also restore the `SITE_CONTACT` import and the `CALC_BTN_GHOST` const)
- `src/content/comparisons/vs-wordpress.tsx` — two "30-min teardown" CTA cards (also restore the `SITE_CONTACT` import)
- `src/content/comparisons/vs-constructors.tsx` — two CTA cards (also restore the `SITE_CONTACT` import)
- `src/content/comparisons/vs-freelancers.tsx` — two CTA cards (also restore the `SITE_CONTACT` import)
- `src/app/(uk)/contacts/page.tsx` — FAQ sentence "Calendly: бронюєте слот напряму."

Before re-enabling, confirm the Calendly URL works.

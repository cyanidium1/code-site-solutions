# Full EN Localization — Sprint 2B+2C combined

> All EN content for missing pages + 3 blog article translations + Claude Code prompt.

## Scope

EN versions to ship:
- **Core pages:** `/en/pricing`, `/en/about`, `/en/process`, `/en/contacts`, `/en/portfolio`
- **Blog:** extend `blogPost` schema with EN shadow fields, add `/en/blog` + `/en/blog/[slug]` routes, translate 3 existing articles
- **Routes registration:** add all 5 paths + `/blog` + `/blog/[slug]` to `EN_LOCALIZED_ROOTS`

Out of scope (separate sprints):
- EN content for industry pages other than `medicine` (which already has EN)
- EN translations of legal pages (`/policy`, `/offer`, etc.) — separate compliance sprint
- DE / PL locales

## Tone reference (match existing `/en` homepage)

Direct, native English. Em-dashes, contractions, short sentences. Numbers in writing. No marketing fluff. Examples already on the site:
- "Custom websites that book meetings 24/7"
- "Pricing in the brief. No 'request a quote.' A real number, in writing."
- "Boutique studio in Kyiv shipping custom-coded sites for SMBs and startups."

If a UA-specific tool has no Western equivalent, keep the name with a brief gloss (e.g., "Diia.Sign — Ukraine's e-signature standard").

---

# PART A — EN content for 5 core pages

---

## A.1 — `/en/pricing`

**Meta title:** `Pricing — $1,000 to $14,000+ fixed in contract | Code-Site.Art`
**Meta description:** `Transparent pricing for custom-coded websites. From $1,000 to $14,000+. Fixed in contract. 1-year warranty. 30% rebate if we miss the deadline.`

**Breadcrumb:** `Home / Pricing`

### Hero

- **Eyebrow:** `/ PRICING`
- **H1:** `Pricing is what you get. Not "on request."`
- **Sub:** `From $1,000 to $14,000+, fixed in the contract. The price includes everything — copywriting, design, frontend, code, domain, hosting, launch, one year of support. You pay once, you get a finished product.`

### Section "9 things included in every tier" (`/ 02 TURNKEY`)

**Heading:** `9 things included in every tier`

**Sub:** `You pay a fixed sum and get a finished site. No briefs to write. No references to hunt down. No photographer to chase. Here's what's in every project — no extra charges.`

**9 items (mirror UA order):**

1. **Copywriting** — Hero, SEO articles, opening cases
2. **Design** — 2 rounds of revisions included
3. **Frontend** — Responsive: mobile / tablet / desktop
4. **Engineering** — Next.js, all integrations
5. **CMS** — Sanity, edit content from your phone
6. **Domain & SSL** — We set it up for you
7. **Hosting** — Vercel or Cloudflare on your account
8. **Launch** — Search Console, Analytics, 301 redirects
9. **1 year of support** — Bugs, updates, advice

**"What we don't do" sub-list:**
- Product photography
- Paid ads (Google Ads / Facebook)
- Maintenance of third-party code / WordPress sites

**Footer line:** `If you need any of these — we'll connect you with vetted partners. We don't mark up other people's work.`

### Pricing tiers (4 tiers — same prices as UA)

**Tier 1 — Landing**
- Price: `from $1,000`
- Timeline: `1–2 weeks`
- Best for: `Fast launch of one offer, MVP, hypothesis testing.`
- Includes:
  - 1 page with responsive layout
  - SEO structure (title, meta, schema)
  - Lighthouse 90+
  - 1 lead form
  - Integration with 1 system (CRM or email)
  - Google Analytics + Tag Manager
  - Documentation and training
  - 1-year warranty
- Doesn't include:
  - Multilingual support
  - CMS for self-editing
  - Blog
  - Complex integrations
- CTA: `Choose Starter →` (link: `/en/contacts?tier=starter`)

**Tier 2 — Industry Pro** (★ MOST POPULAR)
- Price: `from $3,500`
- Timeline: `4–8 weeks`
- Best for: `Businesses with compliance needs (healthcare, legal, accounting) that need industry-specific integrations.`
- Includes:
  - Industry compliance (GDPR / HIPAA-aware)
  - 5+ industry integrations (Helsi/Clio/MEDoc and others)
  - Local SEO targeting your area
  - Client account area
  - E-signature (Diia.Sign / DocuSign)
  - UA + RU multilingual
  - Cost calculators (1–3)
  - Up to 30 pages
  - 1-year warranty + 30% rebate for delays
- Doesn't include:
  - EN locale (available in Pro Plus)
  - Complex SaaS logic
  - 24/7 SLA
- CTA: `Choose Industry Pro →` (link: `/en/contacts?tier=industry`)

**Tier 3 — Pro Plus**
- Price: `from $7,500`
- Timeline: `6–10 weeks`
- Best for: `Businesses growing across multiple markets that need EN locale, 30+ pages, and one deep integration (CRM / ERP / payments).`
- Everything in Industry Pro, plus:
  - EN locale
  - 30+ pages
  - 1 custom integration
  - Dedicated PM with weekly status updates
  - Advanced SEO (programmatic landing pages)
  - 1-year warranty + 30% rebate for delays
- Doesn't include:
  - 24/7 SLA (only in Custom)
  - Dedicated team of 5-7 people
  - Complex SaaS architecture
- CTA: `Choose Pro Plus →` (link: `/en/contacts?tier=proplus`)

**Tier 4 — Custom**
- Price: `from $14,000`
- Timeline: `8–16 weeks`
- Best for: `Complex products with bespoke logic — SaaS, marketplace, B2B portal.`
- Everything in Pro Plus, plus:
  - Architecture session before kickoff
  - Dedicated team (5-7 people on your project)
  - UA + RU + EN + other languages on request
  - Complex payment flows
  - APIs for external integrations
  - 24/7 SLA with 4-hour response
  - SOC 2-ready architecture (for B2B SaaS)
  - Custom modules
  - Post-warranty support under SLA
- Doesn't include:
  - Photo/video content creation
  - Branding from scratch (logo, brand book)
  - Legal consulting
- CTA: `Talk to us →` (link: `/en/contacts?tier=enterprise`)

### Section "What's included in every tier — no exceptions" (`/ 02 INCLUDED`)

**Heading:** `What's included in every tier — no exceptions`

**Sub:** `Regardless of tier — here's the baseline you get on every Code-Site.Art project. You don't pay separately for any of this.`

- Custom design (no templates) — every site is unique
- Responsive build for mobile / tablet / desktop
- SEO structure from day one (title, meta, sitemap, robots)
- Lighthouse Performance 90+, SEO 95+, Accessibility 95+
- GitHub repository with full code — yours to own
- 1-year warranty on bug fixes
- Free 30-min Zoom consult at kickoff
- Documentation and 1-hour admin training
- Handover of all accounts and passwords after launch
- Google Analytics + Search Console setup

### Section "What's NOT included — honestly" (`/ 03 NOT INCLUDED`)

**Heading:** `What's NOT included — honestly`

**Sub:** `We don't hide our limits. Here's what's NOT in the price — but we can help separately or recommend partners.`

- Content: copy, photo, video — separate service or your copywriter
- Branding from scratch: logo, brand book — partner referral
- Legal consulting — only technical compliance
- Google Ads / Meta Ads — separate service from a performance marketer
- Hosting after year one — we hand over Vercel/Cloudflare accounts to you
- Social media strategy or management — separate service
- SEO campaigns after warranty year — separate package from $300/mo

CTA: `Discuss what you need →` (link: `/en/contacts`)

### Section "Add-ons" (`/ 04 ADD-ONS`)

**Heading:** `Add-ons outside the standard packages`

- **$300 — SEO audit** — Technical + content audit of your current site. Prioritized list of fixes.
- **$500–$2,000 — WordPress migration** — Move to Next.js without losing SEO history. 301 redirects, Search Console handoff.
- **$200/mo or $40/hr — Post-warranty support** — Fixes, updates, advice. Monthly retainer or by the hour.
- **$1,500 — Express landing** — Simplified landing for a time-sensitive campaign. 7-14 days from brief to launch.
- **From $1,500 — Branding (via partners)** — Logo, brand identity, brand book. Through our vetted partners.
- **$200/article — Content** — B2B copywriter. Copy for landings, cases, blog.

### Section "Payment" (`/ 05 PAYMENT`)

**Heading:** `How payment works`

**Sub:** `An honest schedule with no surprises. Everything fixed in the contract before kickoff.`

- 50% upfront — work starts. 50% on delivery — after acceptance.
- Bank transfer to PE (Ukrainian sole proprietor, UAH) — standard for UA clients
- Stripe (USD/EUR) — for international clients
- USDT TRC20 — if convenient
- Mono Pay / LiqPay — for smaller amounts
- 3-payment installment — for projects $10,000+
- 10% discount on full upfront payment
- Fixed-sum contract. If we miss the deadline through our fault — we pay you the rebate.

### Section "Not sure which tier fits?"

**Heading:** `Not sure which tier is right?`

**Sub:** `Our calculator runs 60 seconds and gives you a price range for your project, plus a detailed estimate by email.`

- CTA: `Try the calculator →` (link: `/en/calculator`)
- CTA-2: `Or talk to us →` (link: `/en/contacts`)

### FAQ (pricing-specific — 8 items)

1. **Why a fixed price, not "on request"?**
A: Because your time matters. You shouldn't spend 3 hours on a consultation to find out you can't afford a tier. And it's a discipline for us — if we can't quote in 30 minutes on the brief, we don't fully understand the project yet.

2. **Why is Pro Plus more expensive than Industry Pro?**
A: Two reasons: EN locale doubles your SEO/CMS structure, and a dedicated PM costs us money. If you don't need multi-market reach, Industry Pro is the right tier.

3. **Can we negotiate a discount?**
A: 10% off if you pay 100% upfront. Beyond that — we'd rather not. The price already accounts for fixed-cost overhead. Discounting it means cutting corners somewhere.

4. **What if my project doesn't fit any tier?**
A: Tell us. Sometimes it's a tier with one extra add-on; sometimes it's a true Custom. We'll be honest on the 30-min call.

5. **Can I pay in crypto?**
A: USDT TRC20. We confirm receipt within hours and treat it like any other invoice.

6. **Is there an installment plan for large projects?**
A: Projects from $10,000 can be paid in three installments — at kickoff, mid-project, and on delivery.

7. **How do integrations get counted?**
A: Base CRM/email integration is $150. CRM systems (HubSpot, Pipedrive, KeyCRM) — $500. Industry integrations (Clio, MEDoc, etc.) — $500–$1,200 depending on API. Payment gateways — $900. All transparent in the calculator.

8. **What if I need changes after launch?**
A: First year — included in warranty for bug fixes. New features — separate scope, priced per hour or per scope.

### Final CTA section ("Get in touch")

**Heading:** `Ready to discuss your project?`
**Sub:** `Free 30-min consult. No obligation.`

- Book a call — 30-min Zoom: `Open Calendly →`
- Telegram — fastest channel, usually under 30 minutes: `Write @fedirdev →`
- Send a brief — detailed form, reply within 4 business hours: `Open form →` (link `/en/contacts`)

---

## A.2 — `/en/about`

**Meta title:** `About — boutique studio of 12 in Kyiv | Code-Site.Art`
**Meta description:** `Not an agency, not a freelancer. 12 people building custom sites for SMBs. 47 projects across UA, EU, US, DK. You talk to the people who code and design.`

**Breadcrumb:** `Home / About`

### Hero

- **Eyebrow:** `/ ABOUT`
- **H1:** `12 people who build sites that bring leads.`
- **Sub:** `Boutique studio out of Kyiv. 47 projects across 4 regions in 3 years. You talk directly to the people who write code and design — no account managers as filters, no "I'll pass that to the team."`

**Metrics row:**
- `47 projects in 3 years`
- `4 regions of launch: UA · EU · US · DK`
- `4.9/5 average client rating`
- `×3.2 more inquiries on average`

### Section `/ 02 ABOUT`

**H2:** `Not an agency. Not a freelancer.`

**Body:** `We deliberately don't grow to 50 employees. At a big agency, your project is one of thirty, and a manager runs it — not the person writing the code. With a freelancer, your project depends on one person who can disappear for 3 weeks.`

`12 people is the size where the team keeps quality high, and you know everyone involved in your project. Since 2022 we've built sites for clinics, law firms, accounting offices, renovation companies, e-commerce, and SaaS — mostly in Ukraine and the EU.`

### Section `/ 04 TEAM`

**H2:** `12 people. You'll hear from four every day.`

**Body:** `This is the core — the people you'll talk to directly: tech lead, designer, frontend, marketing. Behind them, 8 more work in the background: 4 developers, 2 designers, 2 QA engineers. You see results, not process.`

**4 team cards (mirror UA — keep photos, translate names if needed, translate quotes):**

1. **Fedir Alpatov** — Tech Lead · Founder
   Quote: `"Every site is a sales tool. Everything technical should serve that, not the other way around."`

2. **Diana Merkatun** — Lead Designer
   Quote: `"Design should sell, not get likes on Behance. So I think about conversion before grid and colors."`

3. **Olga Mykhalkova** — Senior Frontend
   Quote: `"A site that loads in 5 seconds loses half its visitors. So I push speed to 90+ on Lighthouse while others are still writing specs."`

4. **Kristina Bondarenko** — SEO & Marketing Strategy
   Quote: `"A site without traffic is a shop in a back alley. I make sure clients find you on Google within 3 months of launch."`

### Section `/ 05 VALUES`

**H2:** `What we won't compromise on`

6 values (mirror UA):

1. **Clean code**
`We write code so another developer can pick it up in a week, not rewrite it from scratch in a month. Your site doesn't depend on us personally.`

2. **Loading speed**
`Lighthouse 90+ at launch. Pages load under 1 second. Every second of delay is -7% conversion.`

3. **Reliability**
`Code in your GitHub from the first commit. Fixed-sum contract with a 30% rebate for missed deadlines. If someone on the team is sick — the project doesn't stop.`

4. **Honesty**
`If something isn't in the package — we say so before signing, not after. If it's technically impossible — we say so. Prices in the brief, not "on request."`

5. **Support**
`1-year warranty included in the price. Something breaks through no fault of yours — we fix it within 4 business hours. First 2 months — free revisions.`

6. **Communication**
`We work in your timezone. Weekly status updates. All revisions tracked in Notion — you always know where the project stands.`

### Section `/ 06 STACK`

**H2:** `Technologies we go deep on`

**Sub:** `We don't try everything. 10 tools we're strong in. No experiments on your money.`

Stack list (same as UA — keep brand names):
- Next.js — Framework
- Astro — Static sites
- React — UI library
- TypeScript — Language
- Tailwind — Styling
- HeroUI — Components
- Sanity — CMS
- Strapi — Headless CMS
- Vercel — Hosting
- Cloudflare — CDN + DNS

### Section `/ 07 DIFFERENCE`

**H2:** `How we differ from others`

**Card 1: vs Big agency**
`A big agency costs $15-50k. Your project is one of thirty. You speak to developers through two managers. Decision speed — one week.`
`With us — $1.5-8k. You talk to the tech lead and designer directly. Decisions in a day.`

**Card 2: vs Freelancer**
`A freelancer is cheaper — $500-3k. But no contract, no warranty, no rebate clause. Sick — your project stalls. Disappears — you're at zero.`
`With us — contract, fixed deadline, 30% rebate for delays. 12 people — someone always covers your project.`

**Card 3: vs WordPress / page builders**
`WordPress and Tilda — fast, but expensive in maintenance: $500/year in plugins + $300/year in updates. The site breaks after every plugin update.`
`Custom code on Next.js — 3× faster. No plugin dependency. Code in your GitHub. Pay once, own forever.`

### Section `/ 08 PROCESS` (reuse existing process block — link to `/en/process`)

**H2:** `How we work`

**Steps (same 5 as homepage):**
1. Brief — 1 day · free
2. Design — 1-2 weeks
3. Development — 2-6 weeks
4. Testing — 1 week
5. Launch + Support — + 1 year

CTA: `See the full process →` (link `/en/process`)

### Section `/ 09 CASES`

**H2:** `Real projects with real metrics.`

(Same cards as homepage — pull from Sanity, reuse component.)

CTA: `See all work →` (link `/en/portfolio`)

### FAQ (about-specific — 8 items)

1. **How many people are on your team?**
A: 12 total. 4 you'll talk to daily (tech lead, designer, frontend, marketing). 8 in the background (4 developers, 2 designers, 2 QA).

2. **Do you work abroad?**
A: Yes. 4 regions: Ukraine, EU, US, Denmark. We work in your timezone for daily Telegram comms.

3. **How fast do you reply to inquiries?**
A: Telegram — usually within 30 minutes (business hours). Email — within 1-2 business hours. Brief form — within 4 business hours.

4. **Can we meet in person?**
A: We're based in Kyiv. We meet in person there. For EU/US/UK clients — Zoom is the default, occasional travel for large projects.

5. **Can I see examples of unfinished projects?**
A: On the call, yes. We show 2-3 in-progress staging URLs that match your industry. Not posted publicly because clients sign NDAs.

6. **Do you take small projects ($1-3k)?**
A: Yes — Landing tier from $1,000. But not below that. If your budget is $500, a freelancer is the right choice.

7. **Do you take enterprise projects ($30k+)?**
A: Yes — Custom tier from $14,000. We've shipped projects up to ~$80k. Beyond that scope, we'd recommend you talk to an agency with 50+ people.

8. **Do you do rebranding or logo design?**
A: No. We partner with branding studios. We'll connect you, we don't mark up their work.

### Final CTA section

**H2:** `30 minutes — and you'll know if we're a fit.`
**Sub:** `No commitment. We show real cases, listen to your task, and honestly say whether we can build what you need.`

Same 3 channel cards as elsewhere.

---

## A.3 — `/en/process`

**Meta title:** `Process — 7 steps from brief to launch | Code-Site.Art`
**Meta description:** `4-10 weeks end-to-end. Your time: 5 hours total. Fixed price, fixed deadline, 30% rebate for delays. Here's how we work.`

**Breadcrumb:** `Home / Process`

### Hero

- **Eyebrow:** `/ PROCESS · 4-10 WEEKS END-TO-END`
- **H1:** `9 things we do for you. Your time: under 5 hours.`
- **Sub:** `You don't write specs. You don't hunt for references. You don't chase a photographer. You spend 30 minutes telling us about your business — and 4-10 weeks later, you have a finished site.`

**Metrics row:**
- `4-10 weeks total timeline`
- `5 hours of your time total`
- `100% fixed price`
- `30% rebate for delays`

### 7 process steps

For each step: title + duration + intro + "What we do" / "What you do" / "Deliverable"

**Step 01 — Brief** · 1 day · free

Intro: `30-min call or Telegram chat. We dig into the task, goals, audience, budget, timeline, references. By the end — an exact price range and tier recommendation.`

What we do:
- Listen to the task and ask follow-up questions
- Analyze 2-3 of your competitors
- Recommend a tier and timeline
- Give you the exact price range

What you do:
- Tell us about your business and the site's goal
- Share 3-5 reference sites
- Share your budget and deadline (if any)

Deliverable:
- Written estimate (PDF) with price range and timeline
- Tier and scope recommendation
- List of next steps and timeline

**Step 02 — Contract & deposit** · 1-3 days

Intro: `We sign the contract — via Diia.Sign (Ukraine's e-signature standard) or PDF with signature. You pay 50% upfront. The contract locks the price, the deadline, and the 30% rebate for delays.`

What we do:
- Draft the contract with a fixed sum
- Break it into milestones with deliverables
- Issue a 50% deposit invoice
- Run the kickoff after payment clears

What you do:
- Review the contract, ask questions
- Sign via Diia.Sign or PDF
- Pay the 50% deposit (UAH bank transfer, Stripe, USDT, Mono)

Deliverable:
- Signed contract with fixed terms
- Right to 2 full design revision rounds
- Right to a 30% rebate for missed deadlines

**Step 03 — Design** · 1-2 weeks

Intro: `We design in Figma. First a moodboard, then the homepage, then internal pages. 2 full rounds of revisions included. You see and approve every milestone.`

What we do:
- Gather a moodboard from references and your brand
- Design the homepage (1-3 versions to pick from)
- After approval — design internal pages
- Adapt to mobile (375px) and tablet

What you do:
- Approve the moodboard (1-2 iterations)
- Approve the homepage design (2 revision rounds)
- Check the mobile version on your phone

Deliverable:
- Figma file with full design (all pages + states)
- Mobile + Tablet + Desktop layouts
- Design rights handed over to you

**Step 04 — Development** · 2-6 weeks

Intro: `We write code on Next.js + Sanity. Commits in GitHub daily. Weekly screencast of progress (3-5 min). Telegram chat — daily.`

What we do:
- Write code in your GitHub repo
- Commit daily (full progress visible)
- Record a weekly screencast
- Wire up integrations (CRM, analytics, forms)
- Build the CMS admin (Sanity or Strapi)

What you do:
- Fill in content in the admin
- Watch the weekly screencasts
- Ask in Telegram if anything's unclear

Deliverable:
- Access to GitHub repo from the first commit
- Staging URL for real-time preview
- Admin with your login credentials
- Documentation on how to edit

**Step 05 — Testing** · 1 week

Intro: `We run a 60-point QA checklist. We test on 5 devices and 3 browsers. We run Lighthouse audit. You run your own 10-point checklist and approve.`

What we do:
- Run the 60-point QA checklist
- Test on iPhone, Android, iPad, Chrome/Safari/Firefox
- Lighthouse — target Performance 90+, SEO/A11y 95+
- Check all forms, integrations, analytics
- Schema.org through the Rich Results Test

What you do:
- Run our 10-point client checklist (we send it)
- Test all forms with your email
- Approve before launch

Deliverable:
- 60-point QA report
- Lighthouse screenshot
- Fix list (if any) with fix date

**Step 06 — Launch** · 1 day

Intro: `We migrate to your domain. We set up Search Console + Analytics + 301 redirects from your old site. You make the final 50% payment and receive all credentials.`

What we do:
- Set up the domain (DNS, SSL)
- Production deploy on Vercel/Cloudflare
- 301 redirects from old URLs
- Submit sitemap to Search Console
- Hand over credentials (hosting, CMS, GitHub, Analytics)

What you do:
- Make the final 50% payment
- Verify the site on the live domain
- Sign the acceptance protocol

Deliverable:
- Live site on your domain
- Access to all systems
- Documentation on how to manage and publish
- 1-hour admin training (Zoom)

**Step 07 — Support** · + 1 year (included)

Intro: `We fix any bugs for free. We update dependencies. We give advice. If something breaks through no fault of yours — we fix it within 4 business hours, business hours.`

What we do:
- Fix bugs (4 business-hour SLA, in business hours)
- Update dependencies
- Help with the admin and content
- Run quarterly security checks
- Take weekly backups

What you do:
- Write to Telegram or email when something's off
- Back up your Sanity content (optional)

Deliverable:
- Free support for 365 days from launch
- Quarterly security check
- Option for a support package after year one ($200-500/mo)

### Section "Communication"

**H2:** `How we communicate during the project`

**Sub:** `You don't disappear for 6 weeks and get the site "out of nowhere." Every step is a checkpoint where you see and approve.`

- Telegram chat daily — replies within 30 minutes in business hours
- Weekly screencast (3-5 minutes)
- Email status report every week with milestone status
- Zoom call once per sprint (optional, on your request)
- GitHub commits visible daily — full transparency
- Staging URL for real-time preview
- If you're unreachable for a week — project pauses, the deadline shifts

### FAQ "What if…" (8 items)

1. **What if you miss the deadline through your fault?**
A: We pay you a 30% rebate from the contract sum. Automatically. We've done this twice in 3 years — both times we wired the rebate without being asked.

2. **What if I want more than 2 design revisions?**
A: Each extra revision round is billed at $40/hr. We tell you upfront if a request crosses the limit.

3. **What if I don't like the design result?**
A: That's exactly what the 2 revision rounds are for. We rework it. If after 2 rounds you still don't like it, we discuss — often the issue is in the brief, not the design.

4. **What if I need changes after launch?**
A: First year — fixes and small tweaks are in the warranty. New features — separate scope, priced per hour or per project.

5. **What if I want to change the scope mid-project?**
A: We pause, re-estimate the new scope, sign an addendum. Honest. The original contract stays for what was agreed; new scope is its own line.

6. **What if I don't have time to fill in content?**
A: We have a copywriter — add-on, $200/page. We can also extend the timeline if you'd rather write it yourself.

7. **What if a new project comes up in 6 months?**
A: We hold a quarterly slot for repeat clients. Telegram us when it's time — we schedule.

8. **What if I need an urgent fix for an event?**
A: 4-hour SLA in business hours. Outside business hours — we charge an emergency rate, but we respond.

### Final CTA section

**H2:** `Ready to walk through the process with us?`
**Sub:** `First step is free. 30-min consult — and you know the price range and timeline.`

- CTA-1: `Calculate the price →` (link `/en/calculator`)
- CTA-2: `Or talk to us →` (link `/en/contacts`)

---

## A.4 — `/en/contacts`

**Meta title:** `Contact us — talk in Telegram or send a brief | Code-Site.Art`
**Meta description:** `Telegram replies in 30 minutes. Detailed brief — reply in 4 business hours. No bots — Fedir himself writes.`

**Breadcrumb:** `Home / Contact`

### Hero

- **Eyebrow:** `/ CONTACT`
- **H1:** `Want to discuss your project?`
- **Sub:** `Telegram chat within 30 minutes, or send a detailed brief — whichever suits you.`

### Section "Channels"

**H2:** `Pick your channel`
**Sub:** `Telegram is fastest. The rest are fallback. No bots — Fedir replies personally.`

7 channels (same as UA — translate labels and response-time copy):

- **Telegram** — @fedirdev — within 30 minutes (business hours)
- **WhatsApp** — +380 97 006 87 07 — within 30 minutes (business hours)
- **Viber** — +380 97 006 87 07 — within 1 hour
- **Phone** — +380 97 006 87 07 — Mon-Fri 09:00-19:00 EET
- **Email** — hi@code-site.art — within 1-2 business hours
- **Instagram** — @cyanidium — within 4 hours
- **LinkedIn** — /in/fediralpatov — within 1-2 days

Footer line: `📍 Kyiv · 🕒 Mon-Fri 09:00-19:00 EET · 🌐 UA · RU · EN`

### Section "Brief form"

**H2:** `Or send a brief`
**Sub:** `4 fields. Details — if you want. Everything here is confidential.`

Form fields (EN labels):
- Phone, Telegram, or email
- Business type (dropdown: Healthcare / Legal / Accounting / E-commerce / SaaS / Construction or renovation / Other)
- Project description (textarea, placeholder: "Add details — tier, budget, timeline")

Submit button: `Send — we reply within 1-2 hours`

Footer: `We don't share your data with third parties. We only store it to reply to your inquiry.`

### Hero-audit banner (when `?source=hero-audit`)

`Drop a link to your current site — we'll come back with an audit within 24 hours.`

### FAQ "Common questions before inquiring" (5 items)

1. **How fast do you reply?**
A: Telegram — within 30 minutes (business hours). Email — 1-2 business hours. Brief form — 4 business hours.

2. **What happens on the 30-min call?**
A: You tell us about the project. We ask 5-7 clarifying questions. We give you a price range and timeline. Total: 30 minutes. No pitching.

3. **I haven't decided on a tier — what do I write in the form?**
A: Write "I don't know yet." We'll ask the questions that matter on the call and recommend a tier.

4. **I'm abroad — do you work with international clients?**
A: Yes. Half our work is outside Ukraine. We work in your timezone for daily comms.

5. **What if I want to sign an NDA before you show cases?**
A: Standard. We have a one-page NDA template, signable via Diia.Sign or DocuSign. Email us — we'll send it.

---

## A.5 — `/en/portfolio` (listing)

**Meta title:** `Portfolio — 8 public cases, more under NDA | Code-Site.Art`
**Meta description:** `Real projects with real numbers. ×3.2 inquiries, $4M raised, 24 leads/mo. Cases you can check in Google and ask the client about.`

**Breadcrumb:** `Home / Portfolio`

### Hero

- **Eyebrow:** `/ PORTFOLIO`
- **H1:** `8 public cases. 39 under NDA. The numbers are real.`
- **Sub:** `Every case is a full breakdown with "before / after" and metrics. ×3.2 inquiries, $4M raised, 24 leads/mo. Cases you can verify on Google and email the client about.`

### Filters (if implementing)

`Filter: by industry · by region · by budget · by tech`

### Cards

Reuse Sanity-driven cards. EN labels and copy come from each case's localized fields. For the listing page itself, only the chrome (H1/sub/filters/CTA) needs EN translation.

### Final CTA section

**H2:** `Want a similar result?`
**Sub:** `Free 30-min consult. Tell us about the project — we'll come back with a price range within 24 hours.`

CTA: `Calculate price →` (link `/en/calculator`) · `Or talk to us →` (link `/en/contacts`)

---

# PART B — EN translations of 3 blog articles

> Adapted for DACH/UK reader. UA-specific tools kept with brief gloss only where they're meaningful (Diia.Sign, Helsi — UA references stay; AmoCRM/Bitrix24 — kept; BAS/1С — replaced with "ERP systems"). Numbers preserved.

---

## B.1 — `/en/blog/website-cost-2026-breakdown`

**Slug (EN):** `website-cost-2026-breakdown`
**Title:** `How much does a website cost in 2026: a breakdown of 47 real quotes`
**Meta title:** `Website cost in 2026 — breakdown of 47 quotes | Code-Site.Art`
**Meta description:** `Real numbers from 47 projects across 3 years. What a landing page, business site, e-commerce, and custom build cost in 2026. With a line-by-line breakdown.`

**Eyebrow:** `Budget · 9 min read`

**Lede:** `Over 3 years we've shipped 47 websites across 4 regions. Here are the actual numbers from those quotes — what a small or mid-size business owner pays in 2026. No "on request." No "it depends." Real ranges, broken down by line item.`

### TL;DR (block)

- **Landing page:** $1,000–$2,500 (1-2 weeks)
- **Industry business site:** $3,500–$7,500 (4-10 weeks)
- **E-commerce:** $5,000–$10,000 (6-10 weeks)
- **Custom product (SaaS, B2B portal):** $14,000+ (8-16 weeks)
- **WordPress + plugins, real cost over 3 years:** $4,200–$6,800
- **Page builder over 3 years:** $720–$7,200 in subscriptions

### Body

#### 4 factors that actually shape the price

A business owner Googles "how much does a website cost." They get 200 studios and 200 prices that differ by 30×. The reason is simple — none of those vendors were taught to break a quote into line items. Everyone gives one number and asks you to send a spec.

The actual cost comes from four things:

1. **How many pages** and how custom each one is. 5 simple pages ≠ 5 custom ones with calculators.
2. **How many integrations.** Helsi, AmoCRM, Stripe, e-signature, Telegram bridge — each is 4-12 hours of work plus testing.
3. **Who writes the content.** If the client does — we save $1,500-$2,500 on a copywriter. If we do — that's an added line.
4. **How many languages.** Each language doubles the SEO structure + CMS config + adds 15-25% to scope.

Design matters less than people think. Design complexity shifts the price by 0-40%, not by multiples. Most of the tier is engineering and integrations.

#### What "on request" hides in a quote

Of our 47 clients, 40 came to us after another studio refused to give a number. The standard script: "send a detailed spec and we'll quote it." In practice, that means one of two things:

- The studio doesn't know their real cost and is afraid of being wrong
- The studio knows the bill is large and wants to lock you into a discovery call first

Either way, you lose. Time spent on briefs and discovery without a number means 2-3 weeks of effective standstill.

If you want a price range for your project in 60 seconds, no email or signup — we have a [calculator](/en/calculator). It doesn't replace a brief, but it gives an honest range.

#### Industry Pro ($3,500) — line by line

This is our most-picked tier. Covers clinics, law firms, accounting offices, renovation companies — anyone who needs an industry-specific site with 2-3 integrations and compliance requirements.

| Line item | Cost | Days |
|---|---|---|
| Copywriting (10 pages + 2 SEO articles) | $400 | 3 |
| Design (Figma, 2 revision rounds) | $700 | 4-5 |
| Frontend (Next.js, responsive, animations) | $1,200 | 6-8 |
| Backend / API / integrations | $600 | 4 |
| Sanity CMS + onboarding | $250 | 2 |
| QA (60-point checklist) | $150 | 1 |
| Launch + domain + analytics | $100 | 0.5 |
| Year of support (reserved) | $100 | — |
| **Total** | **$3,500** | 20-24 |

What's missing from this list — but often appears at competitors — are separate lines for "content strategy," "UX research," "team comms." With us, that's bundled into design and copywriting, not invoiced separately.

#### What WordPress really costs over 3 years

Of our 47 clients, 14 came from a WordPress site that needed a rebuild. In 12 of those 14, total WordPress spend over the previous 2-3 years exceeded the price of a new custom site:

- **18 paid plugins** (our average sample) — $300-$800/year
- **Developer support** (fixes after plugin updates) — $400-$800/year
- **Hosting + SSL** — $120-$300/year
- **Theme + license** — $60-$200/year
- **Backup + security plugins** — $100-$200/year

Total over 3 years: **$2,940-$6,300** — not counting the owner's hours spent on "figuring out why the Yoast plugin broke the services page after the last update."

Custom site on Next.js — **one payment** ($3,500) and **$0/mo** after launch. We break this down in detail on [vs WordPress](/en/vs-wordpress).

#### How integrations get counted (the formula)

This is the most common quote-surprise source. Our formula is simple:

- **Basic REST integration** (form → Telegram, form → email): $150
- **CRM integration** (Bitrix24, AmoCRM, HubSpot, Pipedrive, KeyCRM): $500
- **Industry-specific system** (Helsi, Clio, MEDoc — UA), or EU equivalents: $500-$1,200 depending on API
- **Payment gateway** (Stripe, LiqPay, WayForPay): $900
- **Booking system** (Calendly, YClients, Booksy): $600
- **ERP system** (Odoo, SAP B1, 1C/BAS): $1,200-$2,500

All of this is in the [calculator](/en/calculator) as separate checkboxes.

#### Real example: Efedra Clinic, Odesa

Base tier Industry Pro $3,500. What went into the project:

- 12 pages (home, dental services, aesthetic services, doctors, prices, contact, FAQ, blog, promotions, cases, about, booking)
- Integration with Helsi (online booking) — $500
- UA/RU bilingual — +15% on base price (~$525)
- 2 service lines (dental + aesthetics) under one brand — without doubling the design cost
- Compliance with the Ukrainian Ministry of Health (legal-correct pricing and licensing)

Final price: **$4,525**, timeline 4 weeks. Result after 6 months — 3.2× more inquiries, 4× more organic traffic from Google.

#### When the price goes over $14,000

If you're planning a project with:
- User accounts with roles (more than 2)
- Complex payment flow (subscriptions, upsells, referrals)
- SaaS logic (multi-tenancy, billing)
- 4+ languages
- 24/7 SLA support

— that's Custom tier from $14,000. Not because "the studio is profiteering," but because that's 8-16 weeks of work for 5-7 people with QA, DevOps, and an architect. That kind of project has different economics.

> **Want a number for your project?**
> 60-second calculator: project type, page count, languages, integrations — get a price range with a breakdown. No email. No sales call.
> [Try the calculator →](/en/calculator)

#### How to verify your quote is honest

5 questions to ask any studio before signing:

1. **Is the price fixed in the contract?** If "approximate" or "depending on" — it's not a quote, it's marketing.
2. **Is one year of support in the price?** At 80% of studios — no. With us — yes.
3. **Is the work broken down by line item?** If you only see "development $X" — half the work can vanish along the way.
4. **Is there a rebate clause for missed deadlines?** Without a rebate, a deadline is a guideline, not a commitment.
5. **Who writes the content?** That's a separate $200-$2,000. Has to be agreed upfront.

We cover these in detail in [Web studio contract: 7 things to check before paying](/en/blog/web-studio-contract-7-items).

#### Why we quote a fixed price, not "on request"

Two reasons:

1. **Respect for your time.** A business owner shouldn't spend 3 hours on a consult to find out they can't afford a tier.
2. **Discipline for us.** If we can't put a number on the brief within 30 minutes, we don't fully understand the project yet — and that's a risk.

In 47 projects over 3 years, **we haven't missed the price range** on a single one. Not because we're geniuses — because we've seen 47 similar projects and know what really goes into what.

If your project looks like something in our [portfolio](/en/portfolio), we'll give you a price range on the 30-min call. If it's non-standard — we'll still give you one, but with a wider band.

### Mid-article CTA (insert after "Industry Pro line by line")

> **Here's exactly what yours costs.**
> Run the calculator and get a price range for your project in 60 seconds. No sales call. No email list.
> [Calculate price →](/en/calculator)

### End-article CTA

> **Want to discuss your project?**
> Free 30-min consult. We'll quote you on the call and honestly say whether we're a fit.
> [Book a call →](/en/contacts) · [Or write on Telegram](https://t.me/fedirdev)

### FAQ

**Q: How much does a website cost for a small business?**
A: In 2026, the real range is $1,000 for a landing page up to $14,000+ for a custom product. Most SMBs land in the Industry Pro tier at $3,500 (full site with CMS, integrations, and compliance).

**Q: Why does one studio quote $500 and another $5,000 for "the same" site?**
A: "The same" usually isn't. The difference hides in page count, integrations, team competence, warranties, and whether one year of support is in the price. If the quote looks suspiciously low — half the work usually isn't included.

**Q: How much does a landing page cost in 2026?**
A: $1,000–$2,500 in our range. Cheaper means template on a builder (with all the trade-offs). More expensive isn't a landing page — it's a multi-page site.

**Q: How much does e-commerce cost?**
A: $5,000–$10,000 for a catalog up to 200 SKU with payments and shipping. If you need multi-vendor, complex discount logic, or a B2B portal — that's Custom tier from $14,000.

**Q: Is hosting included in the price?**
A: We set it up on your Vercel or Cloudflare account. Year one is effectively free (free tier covers most small sites). After that, $20-$50/mo depending on traffic.

### Related articles

- [Tilda at $200/mo is $7,200 over 3 years](/en/blog/tilda-7200-over-3-years)
- [Web studio contract: 7 things to check before paying](/en/blog/web-studio-contract-7-items)

---

## B.2 — `/en/blog/tilda-7200-over-3-years`

**Slug (EN):** `tilda-7200-over-3-years`
**Title:** `Tilda at $200/mo is $7,200 over 3 years. The math from 12 migrations.`
**Meta title:** `Tilda vs custom site — real cost over 3 years | Code-Site.Art`
**Meta description:** `Why a page builder looks cheaper only in month one. Real costs from 12 projects that moved off Tilda to custom code.`

**Eyebrow:** `Platforms · 8 min read`

**Lede:** `A page builder looks cheaper until you add 36 months of subscription and the price of switching. Of our 12 clients who migrated from Tilda to Next.js, not one went back. Here's why.`

### TL;DR

- Tilda Business: $20/mo. Over 3 years: **$720**.
- Tilda Personal + add-ons (forms, domain, SEO): **$50/mo** × 36 = **$1,800**.
- Tilda Business Pro + integrations + plugins: **$200/mo** × 36 = **$7,200**.
- Custom site on Next.js: **$3,500** once. Hosting: $0-50/mo.
- **After 3 years:** you've paid the same for the builder — and you own nothing. The code stays with Tilda.
- **Export:** Tilda gives you static HTML without form backends. That's not "your site."

### Body

#### How we got to $7,200

This isn't theoretical from Tilda's marketing page. It's what our clients actually paid before they came to us. We pulled **12 invoices** from companies running 50-300 leads/month who used Tilda for 2-3 years.

The real business stack on Tilda — not "Personal at $10/mo," but **Tilda Business + Tilda Pro + add-ons:**

- Tilda Business: $20/mo (your domain, no block limits)
- Pro blocks (forms with validation, multi-step): included in Pro at $30/mo
- Zapier integrations (Tilda is narrow natively): Zapier from $30/mo
- Analytics + GTM setup: ~$0 (manual)
- Paid templates/blocks from Tilda Market: $50-$200 one-time
- SSL + CDN speed: included
- **Technical consultant** (because something always breaks): $50-$100/mo

**Average across 12 quotes: $180-$220/mo.** Let's say $200/mo.

Over 36 months that's **$7,200**. For that money you could have bought a custom site **twice**, with budget left over for a year of support.

#### What $7,200 actually buys you

A template site with limited customization that:

- Loads in 2-4 seconds on mobile (custom — 0.6-1.5)
- Depends on Tilda's platform — if it goes down, your site disappears
- Has limited SEO (full schema.org control, server-side rendering, programmatic SEO — unavailable)
- Has no "your code" — export gives static HTML without server logic
- Can't change URL structure without losing SEO

This isn't a critique of Tilda as a tool. Tilda is **great** for:
- Personal pages
- Promo pages for one campaign
- Hypothesis testing on a 1-3 month horizon
- MVPs before serious investment

Tilda is **bad** for:
- Businesses planning to operate beyond 2 years
- Sites with complex integrations (CRM, ERP, healthcare systems)
- Projects where SEO is the primary channel
- Multilingual sites with serious SEO

#### What happened to our clients who migrated

Of 12 clients who moved from Tilda to custom:

- **9 of 12** — main reason: "can't go beyond the template," "need an integration Tilda doesn't allow"
- **2 of 12** — slow mobile speed killed conversion (Google Search Console showed CTR drop after the Core Web Vitals update)
- **1 of 12** — Tilda broke custom JS after an update, and the owner decided they'd had enough

Average migration timeline: **4-6 weeks** with SEO transfer (no traffic loss). Our standard migration runs $500-$2,000 depending on the number of 301 redirects.

We break this down on [vs Constructors](/en/vs-constructors).

#### Can you export your Tilda site?

Technically — yes. Tilda Business gives you static HTML export. But it's **not a solution**, it's a trap:

- Export is HTML/CSS/JS only — no form backend
- Forms stop submitting until you wire up your own backend
- Dynamic elements (booking, cart, accounts) — not exported
- If you used Tilda Zero Block — the JS can break post-export

Of our 12 migrants, **none** could effectively use the export. They all rebuilt on the new stack.

#### What if I'm on Tilda Personal at $10/mo?

Different math. $10/mo × 36 = $360 over 3 years. Less than our cheapest Landing tier ($1,000).

Question: is Personal enough for a business?

Personal is 1 site without your domain (URL looks like `yourbiz.tilda.ws`), 500-block limit, no multilingual. A serious business doesn't live there. As soon as you want a custom domain — that's Business $20/mo. As soon as you want real SEO + integrations — Pro $30/mo.

The cost for a business setup on Tilda **always** lands at $40-$80/mo after add-ons, even without the agency tier.

#### What about Wix? Webflow?

Same math with small differences:

| Platform | Business plan | Over 36 mo | Code export |
|---|---|---|---|
| Tilda Business + Pro | $50/mo | $1,800 | HTML without backend |
| Wix Business | $32/mo | $1,152 | No export |
| Webflow Business | $39/mo | $1,404 | HTML+CSS, no CMS |
| Squarespace Business | $33/mo | $1,188 | No export |

All of them — rent, not ownership. Each one costs more over 2-3 years than a one-time custom site purchase in our Industry Pro tier.

> **Want to check what migrating off a builder actually costs?**
> 60-second calculator + our standard migration with 301 redirects.
> [Calculate migration →](/en/calculator)

#### When a builder is still the right call

Honestly:

1. **Demand validation for a new product.** If you don't know if the idea will work — Tilda in a week is cheaper than a custom site in a month.
2. **Promo page for one campaign.** If the site lives 3 months and gets thrown away — no point coding.
3. **Personal page or portfolio.** If you're a photographer or designer — Tilda is enough.

In every other case, **the math kills the builder**.

#### The hidden cost no one counts

Beyond money, there's your time:

- Fix a form that won't submit — 1-3 hours
- Figure out why SEO tanked after an update — 4-6 hours
- Maintain plugins/blocks after updates — 2-4 hours per quarter
- Find a contractor "who knows Tilda" — 1-2 weeks of searching

That's **30-50 hours/year** of an owner's time, which averages $50-$150/hour. Add another $1,500-$7,500/year to your Tilda tab.

A custom site doesn't demand those hours. We run weekly security checks and updates — included in the warranty year. See [Pricing](/en/pricing).

### End-article CTA

> **Thinking about moving off Tilda / Wix / Webflow?**
> We'll honestly tell you if you need to. If your business is still fine on a builder — we'll say so. If it's time — we'll quote the migration without SEO loss.
> [Discuss migration →](/en/contacts) · [Or write on Telegram](https://t.me/fedirdev)

### FAQ

**Q: How much does Tilda actually cost a business?**
A: Real quote with add-ons and integrations — $50-$200/mo. Over 3 years, $1,800-$7,200 — not counting owner hours spent on maintenance.

**Q: Can you export your site from Tilda?**
A: There is an HTML export, but no form backend, no dynamics. In practice, using the export as "your site" is impossible — you end up rebuilding on a new platform anyway.

**Q: Is Tilda really worse for SEO?**
A: Technically Tilda gives basic SEO (meta, sitemap, schema), but no server-side rendering, no programmatic landing pages, no custom schema.org for complex data types. For serious SEO, those are blockers.

**Q: How long does migration from Tilda to Next.js take?**
A: 4-6 weeks for a typical business site. 301 redirects preserve SEO history. Search Console handoff we do alongside the client so positions in Google stay.

**Q: How do you know Tilda's worse — maybe you're just biased?**
A: 12 of our clients went that route. If any go back to Tilda — we'll write a separate article. None have.

### Related articles

- [How much does a website cost in 2026: 47 quotes broken down](/en/blog/website-cost-2026-breakdown)
- [Web studio contract: 7 things to check before paying](/en/blog/web-studio-contract-7-items)

---

## B.3 — `/en/blog/web-studio-contract-7-items`

**Slug (EN):** `web-studio-contract-7-items`
**Title:** `Web studio contract: 7 things to check before paying`
**Meta title:** `Web studio contract — 7-item checklist before signing | Code-Site.Art`
**Meta description:** `What needs to be in a web studio contract in 2026. Rebate clauses, code ownership, scope, and 7 items to verify before paying the deposit.`

**Eyebrow:** `Legal · 10 min read`

**Lede:** `Over 3 years we've reviewed 30+ contracts from other studios that clients brought in for a second opinion. Most had at least one trap the business owner didn't see until the problem hit. Here are 7 items to verify before you wire the deposit.`

### TL;DR

**Verify your contract includes:**
1. Fixed price in the agreed currency
2. Fixed deadline with a rebate clause for delays (minimum 10-30%)
3. Code and design IP transfer — from the first commit, not "after completion"
4. Concrete scope (what's in, what's out) — itemized, not generic
5. Number of revision rounds (typically 2 on design)
6. Who writes the content — and at whose cost
7. Post-launch support — and whether it's included

### Body

#### Why this matters

A web project contract isn't a **letter of intent**. It's the legal document you'll point to if something goes wrong. And "something" goes wrong in **40%** of projects by our count — late, off-spec, off-quality. When it does, the business owner needs in writing: what was promised, by when, and what happens if it isn't delivered.

Of 30 competitor contracts we've reviewed over 3 years, **24 of 30** had at least one of three critical gaps: vague IP transfer, no rebate clause, or "scope under request" (scope to be determined later).

Here's how to avoid that.

#### Item 1: Fixed price in the agreed currency

❌ **Bad:** "Approximate cost $3,500-$5,000"
✅ **Good:** "Total fee is 3,500 USD, fixed, with no additional charges except those listed in Appendix 1"

If the contract says "approximate," "around," "depending on" — that's not a price. It's marketing. You have no legal basis to say "wait, we agreed on $3,500" when the studio invoices $4,800.

Pin down **the currency**. If the contract is in UAH and the site costs $3,500 — write in the exchange rate as of the signing date or until payment. Otherwise a 2-month FX shift becomes an unpleasant surprise for both sides.

#### Item 2: Fixed deadline with a rebate clause

❌ **Bad:** "Approximate timeline — 6 weeks"
✅ **Good:** "Delivery in 6 weeks from contract signing. If the deadline is missed through the studio's fault, the studio pays a 30% rebate from the total project value."

The rebate clause isn't decoration. It's **the only** mechanism that holds the studio to its deadline. Without it, the deadline is a guideline, not a commitment.

Market standard for a rebate is **10-30%**. Ours is 30% because we really don't want to pay it. Over 3 years we've paid it **twice** — both times we wired 30% to the client without being asked.

⚠️ **Fine print:** make sure the rebate applies only to delays caused by the **studio's** fault. If you as the client sit on content for 3 weeks and miss a deadline — that's your delay, not theirs.

#### Item 3: Code and design IP transfer — from the first commit

❌ **Bad:** "All rights to the created code transfer to the Client after full payment"
✅ **Good:** "The studio commits to your GitHub repository from the first commit. All intellectual property rights belong to the Client from the moment of creation."

This is the most common trap in contracts from smaller studios and freelancers. "After full payment" looks innocent but creates a legal situation where:

- If you withhold the final payment (say, due to a quality dispute), the code isn't legally yours
- You can't hire another contractor to finish the project
- The studio can reuse your code for another client (this actually happens)

The right wording: **code in your GitHub from the first commit**. We do this with every client — push to your repo from day one. Everything we write is yours.

#### Item 4: Concrete scope — itemized

❌ **Bad:** "Web development, including design, frontend, and engineering"
✅ **Good:** "Website development in the following scope:
- 8 pages (listed in Appendix 2)
- Responsive build for 3 screen sizes
- Integration with 2 systems: Helsi and AmoCRM
- 1 lead form with email notification
- Lighthouse Performance ≥ 90, SEO ≥ 95
- Sanity CMS for self-editing"

If scope isn't written down — it gets discovered "along the way." In practice that means:
- Every clarification of yours is "an additional request"
- Every "additional request" is a separate fee or a contract amendment
- 2 months in, you're paying double for not the site you wanted

A good contract has **Appendix 1: Scope** on 1-2 pages with concrete page lists, integrations, features, and quality metrics. Anything not in it is a separate fee, also priced upfront.

#### Item 5: Revision rounds

❌ **Bad:** "The studio makes revisions until the Client approves the result"
✅ **Good:** "The studio provides 2 full revision rounds on design and 2 on frontend after staging URL handover. Each additional round is billed at $40/hour."

Without a revision limit you face risk from both sides:

- The studio tries to wrap up faster, ignoring small concerns → you're unhappy with quality
- Or revisions go "forever" and the deadline blows because the project gets sent back 5 times

2 rounds is standard. Round 1: you give all your feedback in one list, the studio fixes it. Round 2: you give last small notes. More than that — separate billing.

We use exactly this model — details on [Process](/en/process).

#### Item 6: Who writes the content — and at whose cost

❌ **Bad:** "Client provides content"
✅ **Good:** "Client provides text content for all pages before the development phase. If content is not provided, the studio may offer copywriting at the standard rate of $200/page. The rate is documented in Appendix 3."

This is the most common source of conflicts and project stalls. The owner orders a site, not understanding that **the text on it has to be written**. The studio assumes the client will deliver. The client assumes the studio will write.

3 weeks in: the project stalls. Studio waits for content. Client didn't know they had to write it, or doesn't have the bandwidth.

Right: **write it into the contract** — who's writing, at whose cost. If you want the studio to write — that's a separate line in the quote.

Our base Industry Pro package includes copywriting for the homepage and 5 standard pages (about, services, contact, etc.). If you need more — $200/page.

#### Item 7: Post-launch support

❌ **Bad:** "Warranty obligations of the studio remain in force for 30 days"
✅ **Good:** "The studio provides 1 year of warranty support starting from the launch date. Warranty includes: bug fixes, dependency updates, advisory. Response time: 4 business hours during studio business hours. Warranty does NOT include: new feature development, design changes, content rework."

30-day warranty is an **anti-standard**. Real post-launch issues often surface 2-3 months in: when clients actively use the site and find rare bugs, or when dependencies update and something breaks.

A good warranty is **1 year**. Not "free forever," but coverage for typical post-launch problems.

⚠️ Specify **what's in** the warranty. Bug fixes — yes. New features — no (otherwise a year of warranty equals a free new project). We list this explicitly in our contract.

#### Bonus: Who's on the studio side

Doesn't directly appear in the contract, but you can ask for **Appendix 4: Project team**. It should list:

- Tech lead and designer names, with their LinkedIn / GitHub profiles
- Email and Telegram for direct contact

This lowers the risk of "the manager went silent for 2 weeks because they quit." If you see names and profiles — you know who you're dealing with.

> **Not sure what a fair contract looks like?**
> We have a template we sign with clients. Happy to walk through it on a 30-min consult. I'll explain every clause.
> [Book a call →](/en/contacts)

#### Red flags: when to walk

5 phrases in a contract that should make you nervous:

1. **"The studio commits to best efforts..."** — that's intention, not obligation. Permission to underperform.
2. **"Timelines are approximate..."** — without a rebate, there are no timelines.
3. **"Handover happens orally..."** — accept in writing, with a signed handover protocol.
4. **"100% upfront..."** — standard is 50/50. More than that — either you have 5+ years of trust with the studio, or you're risking everything.
5. **"Early termination requires the Client to pay 100%..."** — that makes you a hostage. Standard is staged payment for work already completed.

We've seen all of these in freelancer contracts. Details in [vs Freelancers](/en/vs-freelancers).

#### Who reviews the contract on your side

Ideal — a lawyer. Realistic — self-review with this checklist + Google + 30 minutes of focus.

If the project costs more than **$5,000** — it's worth paying a lawyer $50-$100 for a review. The cheapest insurance policy in IT.

### End-article CTA

> **Want to see what an honest contract looks like?**
> We'll show you our template. I'll explain every clause. No obligation.
> [Book a 30-min consult →](/en/contacts) · [Or write on Telegram](https://t.me/fedirdev)

### FAQ

**Q: Does the contract really need a rebate clause?**
A: Legally — no. Ethically — yes. Without one, the deadline is a recommendation, not a commitment. Market standard is 10-30% of the project value.

**Q: What if the studio refuses to add their team to the contract appendix?**
A: Red flag. If a studio can't name who'll lead your project — either they have team issues, or they don't intend to keep specific people on yours.

**Q: Can I sign a contract via Diia.Sign (Ukraine's e-signature)?**
A: Yes. Diia.Sign has the same legal force as a handwritten signature in Ukraine. We sign via Diia.Sign as our default. For EU clients, we sign via DocuSign or equivalent.

**Q: How much does a contract review by a lawyer cost?**
A: $50-$150 from a generalist. If the project costs more than $5,000 — it's the cheapest insurance you can buy.

**Q: What if the studio refuses to add a rebate clause?**
A: Pick a different studio. It's a baseline norm in 2026. The lack of one is either unprofessionalism or lack of confidence in their own work.

### Related articles

- [How much does a website cost in 2026: 47 quotes broken down](/en/blog/website-cost-2026-breakdown)
- [Tilda at $200/mo is $7,200 over 3 years](/en/blog/tilda-7200-over-3-years)

---

# PART C — Claude Code prompt

> Paste into Claude Code along with this entire file. Phase 0 inventory first, then Phase 1.

````
Sprint 2BC: full EN localization for 5 core pages + 3 blog articles.

═══════════════════════════════════════════════
PHASE 0 — INVENTORY (mandatory, no implementation yet)
═══════════════════════════════════════════════

Branch: `audit-sprint-2bc`. Commit `docs/sprint-2bc-inventory.md` only, push, open draft PR, STOP.

Inventory needed:

1. Current EN coverage in routes.
   - List every `app/en/**/page.tsx` that exists today.
   - For each, identify what UA route it mirrors.
   - Flag every UA page that does NOT have an EN twin.

2. Where each page's content lives.
   For /pricing, /about, /process, /contacts, /portfolio (listing):
   - Is content hardcoded in the TSX file, or pulled from Sanity, or split?
   - If from Sanity, which document type and which fields?
   - Are localized fields already structured (uk/en split) or UA-only?
   For /blog, /blog/[slug]:
   - blogPost schema currently has flat (non-localized) fields per Sprint 2A. Confirm.
   - Are there any blocking dependencies on localized blog content elsewhere in the codebase (related-posts queries, sitemap, navigation, etc.)?

3. Component-level localization gaps.
   - Which components hardcode UA strings vs which already use `useTranslations` from `next-intl`?
   - For each of the 5 core pages, list any inline-string components that need extraction.

4. EN_LOCALIZED_ROOTS.
   - Current contents of the set in `src/lib/i18n-routes.ts`.
   - What needs to be added after Phase 1.

5. Sitemap.
   - How blog posts and other pages are emitted in `src/app/sitemap.ts` today.
   - What new entries need to be added for EN routes.

6. Translation strategy for each page.
   For each of the 5 core pages, recommend ONE of three patterns:
   - Pattern A: New `app/en/<page>/page.tsx` file with hardcoded EN content (fastest, mirrors existing /en/page.tsx pattern)
   - Pattern B: Sanity schema extension with EN shadow fields, both UA and EN pages query the same document
   - Pattern C: Extracted strings into `messages/en.json` namespace, shared component

   Whichever pattern fits the existing codebase, recommend it. Different pages can use different patterns if that's what existing code already does.

7. Blog schema extension shape.
   Propose the EN-extension shape for `blogPost`. Likely needs: titleEn, metaTitleEn, metaDescriptionEn, eyebrowEn, ledeEn, bodyEn (portable text), faqEn, slugEn (different slug for EN URL). Confirm or adjust.

Stop after committing `docs/sprint-2bc-inventory.md` with the 7 sections.

═══════════════════════════════════════════════
PHASE 1 — IMPLEMENTATION (after Phase 0 approval)
═══════════════════════════════════════════════

Five core pages + extend blog schema + translate 3 articles + register all routes.

Source of truth for EN content: the file `en-localization-full.md` (the user will paste it after Phase 0 approval). Use the EN copy verbatim. Do not paraphrase.

For each core page, follow the pattern recommended in Phase 0:

a) /en/pricing — full EN content from PART A.1. JSON-LD (BreadcrumbList + Service). CTAs link to /en/contacts and /en/calculator.

b) /en/about — full EN content from PART A.2. Team cards reuse existing component, only labels change. JSON-LD (BreadcrumbList + Organization).

c) /en/process — full EN content from PART A.3. 7 steps reuse existing component. JSON-LD (BreadcrumbList + HowTo if it exists).

d) /en/contacts — full EN content from PART A.4. 7 channel cards reuse existing component. Lead form reads `?source=` URL param and tier query — already works, just ensure the EN page uses the same shared LeadForm component with EN labels.

e) /en/portfolio — full EN content from PART A.5. Card content comes from Sanity (case studies already have EN fields). Only the chrome (hero, sub, CTAs, filters) needs new EN strings.

Blog work:

f) Extend `blogPost` schema in admin repo with EN shadow fields per Phase 0 inventory:
   - titleEn, metaTitleEn, metaDescriptionEn, eyebrowEn, ledeEn (strings)
   - slugEn (separate EN URL slug — see source file for slugs)
   - bodyEn (portable text — same custom blocks as UA body)
   - faqEn (array of { question, answer })
   - All EN fields are optional. If absent on a doc, the EN route returns 404 (do not fall back to UA — that would defeat the locale).

g) Update GROQ queries in `src/lib/sanity/queries.ts` to fetch EN fields. Resolve `body`/`bodyEn` and `faq`/`faqEn` based on locale param.

h) Create `app/en/blog/page.tsx` (listing) and `app/en/blog/[slug]/page.tsx` (post) routes. Reuse same components as UA pages. Render based on locale.

i) Re-run the seed script (or run a new EN-specific one) to populate EN fields on the 3 existing blog posts. EN content from PART B (file).

EN blog slugs (separate from UA):
   - skilky-koshtuye-sayt-2026 → website-cost-2026-breakdown
   - tilda-7200-za-3-roky → tilda-7200-over-3-years
   - dohovir-z-veb-studieyu-7-punktiv → web-studio-contract-7-items

j) Update `EN_LOCALIZED_ROOTS` in `src/lib/i18n-routes.ts` to include: /pricing, /about, /process, /contacts, /portfolio, /blog, /blog/[slug]. So the locale switcher routes correctly between locales — no more disabled state on these.

k) Update `src/app/sitemap.ts` to emit EN URLs for all of the above.

l) JSON-LD on each EN page: same types as UA equivalents (Article, FAQPage, BreadcrumbList, Organization, etc.). Reuse helpers where they exist.

Acceptance:
- /en/pricing renders the full EN page (matches PART A.1 from source file)
- /en/about renders the full EN page (matches PART A.2)
- /en/process renders the full EN page (matches PART A.3)
- /en/contacts renders the full EN page (matches PART A.4) — banner appears on `?source=hero-audit`
- /en/portfolio lists EN cards
- /en/blog lists 3 EN posts in reverse-chronological order
- Each /en/blog/<en-slug> renders the full EN article with all blocks, FAQ, related cards, JSON-LD
- Locale switcher works both ways on all these pages (no disabled state)
- sitemap.xml includes all new EN URLs
- tsc --noEmit clean, next build clean
- Lighthouse Performance ≥ 90, SEO ≥ 95 on /en/pricing and /en/blog/website-cost-2026-breakdown

Commits on audit-sprint-2bc:
- docs(sprint-2bc): inventory
- feat(en): pricing page
- feat(en): about page
- feat(en): process page
- feat(en): contacts page
- feat(en): portfolio listing
- feat(blog): extend blogPost schema with EN shadow fields
- feat(blog): EN routes /en/blog and /en/blog/[slug]
- feat(blog): seed EN translations of 3 articles
- chore(i18n): add EN_LOCALIZED_ROOTS entries for new routes
- chore(sitemap): emit EN URLs for new pages

Open PR ready-to-merge when done. Report back per usual format.
````

---

## Что я перевёл, что осталось за рамками

✅ В этом файле:
- /pricing, /about, /process, /contacts, /portfolio listing — полный EN текст
- 3 блог-статьи — полные EN переводы с локализацией под DACH/UK

❌ Не вошло (отдельные мини-спринты):
- 6 disabled industry pages (Legal, Accounting, E-commerce, SaaS, Cosmetology, Education) — UA контента для них ещё нет, EN их и не делается до публикации UA
- Legal pages (/policy, /offer, /public-contract, /legal) — нужны юристом-локализатором, не нашей переводческой работой
- DE и PL локали — отдельный sprint после стабилизации EN

import { TeamCards } from "@/components/blocks/team-cards";

export const metadata = { title: "Story · team-cards" };

export default function TeamCardsStory() {
  return (
    <TeamCards
      eyebrow="/ 04 TEAM"
      heading={
        <>
          Маленька команда. <em>Велика</em> мережа.
        </>
      }
      sub="Постійне ядро + перевірена мережа партнерів, з якими ми вже робили спільні проекти 2+ років."
      groups={[
        {
          label: "/ CORE TEAM",
          members: [
            {
              name: "Fedir Alpatov",
              role: "Founder · Full-stack",
              initials: "FA",
              experience: "8+ років",
              location: "Київ",
              tag: "Available",
              spec: "Next.js, Astro, headless CMS. 30+ проектів як founder. Спікер на українських dev-конференціях.",
              socials: [
                { kind: "li", href: "https://www.linkedin.com/in/fediralpatov/" },
                { kind: "tg", href: "https://t.me/fedirdev" },
                { kind: "gh", href: "https://github.com/fedirdev" },
                { kind: "tt", href: "https://www.tiktok.com/@cyanidium.dev" },
              ],
            },
            {
              name: "Anna Skrypka",
              role: "Senior Designer · UX",
              initials: "AS",
              experience: "6+ років",
              location: "Київ / Варшава",
              tag: "Contractor",
              spec: "Figma, дослідження користувачів, brand systems. Працює з Code-Site.Art з 2024 року.",
              socials: [
                { kind: "li", href: "#" },
                { kind: "ig", href: "#" },
              ],
            },
            {
              name: "Bohdan Drozdov",
              role: "Backend · DevOps",
              initials: "BD",
              experience: "7+ років",
              location: "Київ",
              tag: "Contractor",
              spec: "Node.js, Postgres, Vercel/Cloudflare. Інтеграції з мед.CRM, бух-системами, e-commerce.",
              socials: [
                { kind: "gh", href: "#" },
                { kind: "tg", href: "#" },
              ],
            },
          ],
        },
        {
          label: "/ EXTENDED NETWORK · ON-DEMAND",
          members: [
            {
              name: "Marta Veselovska",
              role: "Frontend Engineer",
              initials: "MV",
              experience: "5+ років",
              location: "Львів",
              spec: "React, Next.js, складна анімація (Framer Motion, GSAP).",
              socials: [{ kind: "li", href: "#" }],
            },
            {
              name: "Oleksii Hrynenko",
              role: "Content · SEO",
              initials: "OH",
              experience: "9+ років",
              location: "Київ",
              spec: "Технічне SEO, контент-маркетинг для медичних і юр-компаній.",
              socials: [{ kind: "li", href: "#" }],
            },
            {
              name: "Sofiia Levchenko",
              role: "QA Engineer",
              initials: "SL",
              experience: "4+ роки",
              location: "Дніпро",
              spec: "Automated test suites (Playwright), 60-point pre-launch checklist.",
              socials: [{ kind: "li", href: "#" }],
            },
          ],
        },
      ]}
    />
  );
}

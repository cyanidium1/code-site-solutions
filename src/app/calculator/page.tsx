import type { Metadata } from "next";
import { HpFooter, HpHeader } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { PageHero } from "@/components/blocks/page-hero";
import { StatsBar } from "@/components/blocks/stats-bar";
import { WebsiteCalculator } from "@/components/calculator";

export const metadata: Metadata = {
  title: "Website Cost Calculator — Code-Site.Art",
  description:
    "Estimate your custom-coded website in 60 seconds. Honest range, no 'price on request', no sales pressure. See what drives the price.",
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: "Website Cost Calculator — Code-Site.Art",
    description:
      "Estimate your custom-coded website in 60 seconds. Honest range, no 'price on request'.",
    type: "website",
    locale: "en_US",
    url: "/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <>
      <HpHeader />

      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Calculator" },
        ]}
        eyebrow="/ CALCULATOR"
        headline={
          <>
            Know your website price <em>in 60 seconds</em>
          </>
        }
        sub="No sales call, no “price on request”, no hidden lines. An honest range — and a clear breakdown of what drives it. Built for people deciding right now."
      />

      <StatsBar
        items={[
          { value: "47", label: "projects · last 3 years" },
          { value: "$1,500–$10,000", label: "typical price range" },
          { value: "4–10 weeks", label: "from brief to launch" },
          { value: "1 year", label: "warranty included" },
        ]}
      />

      <WebsiteCalculator />
      <HpFooter />
    </>
  );
}

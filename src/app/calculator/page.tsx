import type { Metadata } from "next";
import { HpFooter, HpHeader } from "@/components/homepage";
import "@/components/homepage/homepage.css";
import { WebsiteCalculator } from "@/components/calculator";

export const metadata: Metadata = {
  title: "Website Development Calculator — Code-Site.Art",
  description:
    "Estimate website development budget for custom-coded projects. Includes pages, design complexity, multilingual support, CMS, SEO and integrations.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <>
      <HpHeader />
      <WebsiteCalculator />
      <HpFooter />
    </>
  );
}

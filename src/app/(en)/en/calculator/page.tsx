import {
  CalculatorPageView,
  calculatorMetadata,
} from "@/components/calculator/CalculatorPageView";

export const metadata = calculatorMetadata("en");

export default function CalculatorPageEn() {
  return <CalculatorPageView locale="en" />;
}

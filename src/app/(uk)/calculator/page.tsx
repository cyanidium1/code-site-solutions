import {
  CalculatorPageView,
  calculatorMetadata,
} from "@/components/calculator/CalculatorPageView";

export const metadata = calculatorMetadata("uk");

export default function CalculatorPage() {
  return <CalculatorPageView locale="uk" />;
}

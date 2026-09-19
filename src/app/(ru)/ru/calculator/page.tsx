import {
  CalculatorPageView,
  calculatorMetadata,
} from "@/components/calculator/CalculatorPageView";

export const metadata = calculatorMetadata("ru");

export default function CalculatorPageRu() {
  return <CalculatorPageView locale="ru" />;
}

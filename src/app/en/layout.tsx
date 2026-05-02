import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../../messages/en.json";

export default function EnLocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      {children}
    </NextIntlClientProvider>
  );
}

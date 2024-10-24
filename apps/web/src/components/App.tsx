import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import Masthead from "@/components/Masthead";
import QueryProvider from "@/components/QueryProvider";
import { Locale } from "@/i18n/routing";
import { extract } from "@/lib/i18n/utils";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  locale: Locale;
};

export default async function App(props: Props) {
  const locale = props.locale as Locale;
  const messages = await getMessages();

  return (
    <ThemeProvider defaultTheme="light">
      <NextIntlClientProvider messages={messages}>
        <QueryProvider>
          <div className="flex h-[100vh] flex-col">
            <Masthead />
            <Header locale={locale} />
            <div className="flex-1">{props.children}</div>
            <Footer
              ministry={extract(messages, "common.names.kd")}
              descriptionWithNewlines={extract(
                messages,
                "components.Footer.address",
              )}
              links={
                [
                  // Put links here
                ]
              }
              showLastUpdated
            />
          </div>
        </QueryProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

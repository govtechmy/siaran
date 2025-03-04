import { SearchDialogProvider } from "@/components/SearchDialog";
import appleIcon from "@repo/icons/web/apple-icon.png";
import icon from "@repo/icons/web/icon.svg";
import { I18nProvider, Translations } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import "./global.css";

type Locale = "en-MY" | "ms-MY";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
};

const inter = Inter({
  subsets: ["latin"],
});

const locales = [
  { locale: "en-MY", name: "English" },
  { locale: "ms-MY", name: "B. Malaysia" },
];

const translations: Record<Locale, Partial<Translations>> = {
  ["en-MY"]: {
    toc: "On this page",
    nextPage: "Next",
    previousPage: "Previous",
  },
  ["ms-MY"]: {
    toc: "Pada halaman ini",
    nextPage: "Seterusnya",
    previousPage: "Sebelumnya",
  },
};

export async function generateStaticParams() {
  return [
    {
      lang: "en-MY",
    },
    {
      lang: "ms-MY",
    },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Props["params"];
}): Promise<Metadata> {
  return {
    icons: {
      icon: icon.src,
      apple: appleIcon.src,
    },
  };
}

export default async function Layout({
  params,
  children,
}: {
  params: Props["params"];
  children: ReactNode;
}) {
  const locale = (await params).lang;

  return (
    <html className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <I18nProvider
          locale={locale}
          locales={locales}
          translations={translations[locale]}
        >
          <RootProvider
            search={{
              enabled: false,
            }}
          >
            <SearchDialogProvider>{children}</SearchDialogProvider>
          </RootProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

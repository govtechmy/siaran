import appleIcon from "@repo/icons/web/apple-icon.png";
import icon from "@repo/icons/web/icon.svg";
import { I18nProvider } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";

type Props = {
  children: React.ReactNode;
  params: { lang: string };
};

const inter = Inter({
  subsets: ["latin"],
});

const locales = [
  { locale: "en-MY", name: "English" },
  { locale: "ms-MY", name: "B. Malaysia" },
];

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
  params: Promise<Props["params"]>;
  children: ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <I18nProvider locale={(await params).lang} locales={locales}>
          <RootProvider>{children}</RootProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

import App from "@/components/App";
import { Locale } from "@/i18n/routing";
import { getPageMetadata } from "@/lib/page/utils";
import { cn } from "@/lib/ui/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata({
  params: { locale },
}: {
  params: Props["params"];
}): Promise<Metadata> {
  const t = await getTranslations({ locale });

  return getPageMetadata({
    title: t("metadata.site.title"),
    description: t("metadata.site.description"),
    imageUrl: t("metadata.site.openGraph.images.1.url"),
    siteName: t("app.name"),
  });
}

export default async function Layout({ children, params }: Readonly<Props>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, poppins.variable)}>
        <App locale={params.locale}>{children}</App>
      </body>
    </html>
  );
}

import App from "@/components/App";
import { cn } from "@/lib/ui/utils";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

type Props = {
  children: React.ReactNode;
  params: { locale: string };
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function Layout({ children, params }: Readonly<Props>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, poppins.variable)}>
        <App locale={params.locale}>{children}</App>
      </body>
    </html>
  );
}

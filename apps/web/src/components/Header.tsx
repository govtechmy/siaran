"use client";

import { buttonVariants } from "@/components/Button";
import Locale from "@/components/Locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
} from "@/components/Sheet";
import { Link, type Locale as AppLocale, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/ui/utils";
import { getLocalizedURL } from "@/lib/url/utils";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { ReactNode, Suspense, useState } from "react";

type NavItem = {
  href: string;
  component: ReactNode;
  target?: string;
  sheetOnly?: boolean;
  variant: VariantProps<typeof buttonVariants>["variant"];
};

export function Header({ locale }: { locale: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href) && href !== "/";
  const navItems: NavItem[] = [
    // Put navigation items here
  ];

  const [showMenu, setMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background lg:bg-background/80 lg:backdrop-blur-[30px]">
      <div className="max-lg:border-b container flex w-full items-center justify-between gap-3 bg-background py-3 lg:gap-4 lg:bg-transparent xl:px-0">
        <a
          href={getLocalizedURL(locale as AppLocale, "index")}
          className="flex h-full flex-none items-center"
        >
          <img
            width={32}
            height={32}
            src="/logo.svg"
            alt="Logo"
            className={cn("object-contain")}
          />
          <h1 className="ml-[0.625rem] text-[1.125rem] font-semibold leading-[1.625rem]">
            {t("app.name")}
          </h1>
        </a>

        <Sheet open={showMenu} onOpenChange={setMenu}>
          <SheetContent
            side="top"
            className="absolute top-full -z-10 flex flex-col gap-0 rounded-b-xl p-3 lg:hidden"
          >
            {navItems.map(({ component, href, target, variant }, i) => (
              <SheetClose asChild key={i}>
                <Link
                  href={href}
                  target={target || "_self"}
                  data-state={isActive(href) ? "open" : "close"}
                  className={cn(
                    buttonVariants({
                      variant,
                      size: "md",
                    }),
                    "w-full justify-start gap-x-[0.5rem] text-[1rem] leading-[1.5rem] lg:data-[state=open]:bg-washed-100",
                  )}
                >
                  {component}
                </Link>
              </SheetClose>
            ))}
          </SheetContent>
          <SheetPortal>
            <SheetOverlay className="z-40" />
          </SheetPortal>
        </Sheet>

        <NavigationMenu.Root className="z-10 hidden w-full items-center lg:flex">
          <NavigationMenu.List className="group flex list-none items-center justify-center space-x-1">
            {navItems
              .filter((item) => !item.sheetOnly)
              .map(({ component, href }, i) => (
                <NavigationMenu.Item key={i}>
                  <Link
                    href={href}
                    data-state={isActive(href) ? "open" : "close"}
                    className={cn(
                      buttonVariants({ variant: "tertiary" }),
                      "w-max bg-transparent transition-colors data-[state=open]:bg-washed-100",
                    )}
                  >
                    {component}
                  </Link>
                </NavigationMenu.Item>
              ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2">
          <Suspense>
            <Locale locale={locale} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

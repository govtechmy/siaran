import { cn } from "@/lib/ui/utils";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "default";
  roundness?: "default" | "full";
  padding?: "default" | "none";
} & ComponentProps<"a"> &
  ComponentProps<"button">;

const variants = cva(
  cn(
    "border-[1px] border-theme-600",
    "focus:outline-none focus:ring-[0.1875rem] focus:ring-theme-600/40",
    "bg-gradient-to-b from-theme-300 to-theme-600",
    "flex items-center justify-center",
    "text-white-force_white",
    "transition-transform active:translate-y-[0.0625rem]",
    "data-[disabled=true]:pointer-events-none",
    "stroke-[0.09375rem]",
  ),
  {
    variants: {
      variant: {
        default: cn("rounded-[.5rem]"),
      },
      roundness: {
        default: "rounded-[.5rem]",
        full: "rounded-full",
      },
      padding: {
        default: "px-[.75rem] py-[.5rem]",
        none: "p-0",
      },
    },
  },
);

export default function ThemeButton({
  children,
  className,
  disabled,
  href,
  variant = "default",
  roundness = "default",
  padding = "default",
  ...props
}: Props) {
  return href ? (
    <Link
      {...props}
      href={href}
      className={cn(variants({ variant, roundness, padding }), className)}
    >
      {children}
    </Link>
  ) : (
    <button
      {...props}
      className={cn(variants({ variant, roundness, padding }), className)}
      data-disabled={disabled}
    >
      {children}
    </button>
  );
}

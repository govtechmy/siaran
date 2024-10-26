"use client";

import * as Base from "@/components/base/calendar";
import React from "react";

import { cn } from "@/lib/ui/utils";

type Props = React.ComponentPropsWithoutRef<typeof Base.Calendar>;

export const Calendar = ({ className, ...props }: Props) => (
  <Base.Calendar
    showOutsideDays={true}
    className={cn("p-[.75rem]", className)}
    classNames={{
      weekday: cn(
        "h-[2.125rem] w-[2.5rem]",
        "text-black-500 text-xs font-normal",
      ),
      button_next: cn("absolute right-0", "size-[2rem]", "rounded-[.375rem]"),
      button_previous: cn(
        "absolute left-auto right-[2.5rem]",
        "size-[2rem]",
        "rounded-[.375rem]",
      ),
      month_caption: cn("w-fit"),
      day: cn(
        "z-5",
        "relative",
        "size-[2.5rem]",
        "text-sm text-black-700",
        "font-medium",
      ),
      disabled: cn("disabled:text-black-text_only-disabled"),
      selected: cn("text-white-force_white", "bg-theme-600"),
      // outside: cn("text-theme-600"),
    }}
    {...props}
  />
);

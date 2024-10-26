"use client";

import * as Base from "@/components/base/popover";
import React from "react";

import { cn } from "@/lib/ui/utils";

const PopoverClose = React.forwardRef<
  React.ElementRef<typeof Base.PopoverClose>,
  React.ComponentPropsWithoutRef<typeof Base.PopoverClose>
>(({ className, ...props }, ref) => (
  <Base.PopoverClose
    ref={ref}
    className={cn("w-full", "text-start", className)}
    {...props}
  />
));

PopoverClose.displayName = "PopoverClose";

export { PopoverClose };

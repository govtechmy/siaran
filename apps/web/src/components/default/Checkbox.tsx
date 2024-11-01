"use client";

import * as Base from "@/components/base/Checkbox";
import React from "react";

import { cn } from "@/lib/ui/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Base.Checkbox>,
  React.ComponentPropsWithoutRef<typeof Base.Checkbox>
>(({ className, ...props }, ref) => (
  <Base.Checkbox
    ref={ref}
    className={cn(
      "rounded-[.25rem]",
      "bg-force-white",
      props.checked && "bg-theme-600",
      "text-black-700",
      props.checked && "text-white-force_white",
      "shadow-none",
      className,
    )}
    {...props}
  />
));

Checkbox.displayName = "Checkbox";

export { Checkbox };

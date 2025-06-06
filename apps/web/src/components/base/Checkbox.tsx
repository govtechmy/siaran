"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@/lib/ui/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "rounded-sm border border-gray-outline-200",
      "shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-700/30",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground peer h-4 w-4 shrink-0 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("text-black-300 flex items-center justify-center")}
    >
      <CheckIcon className="h-4 w-4 stroke-current" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

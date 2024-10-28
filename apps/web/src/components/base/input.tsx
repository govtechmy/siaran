import { cn } from "@/lib/ui/utils";
import { forwardRef, useEffect } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-full w-full",
          "max-h-[2.75rem]",
          "shadow-button",
          "rounded-[1.375rem]",
          "border border-outline-200 focus:border-theme-300",
          "focus:outline-none",
          "focus:ring-[.1875rem] focus:ring-theme-600/[.2]",
          "bg-white-background-0",
          "block",
          "px-4 py-2",
          "placeholder:text-muted-foreground text-sm",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };

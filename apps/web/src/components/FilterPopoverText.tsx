import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A pre-styled component that renders text in a row the popover.
 */
export default function FilterPopoverText({ children, className }: Props) {
  return (
    <span className={cn("text-start text-sm text-black-700", className)}>
      {children}
    </span>
  );
}

import { cn } from "@/lib/ui/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A pre-styled component that renders secondary text in a row the popover.
 */
export default function FilterPopoverSecondaryText({
  children,
  className,
}: Props) {
  return (
    <small className={cn("text-start text-xs text-black-500", className)}>
      {children}
    </small>
  );
}

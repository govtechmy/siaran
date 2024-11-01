import { cn } from "@/lib/ui/utils";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * A pre-styled component that renders a row in the popover.
 */
export default function FilterPopoverItem({ children, className }: Props) {
  return (
    <div
      className={cn(
        "w-full",
        "rounded-[.25rem]",
        "hover:bg-gray-focus_washed-100 focus:bg-gray-focus_washed-100",
        "px-2 py-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

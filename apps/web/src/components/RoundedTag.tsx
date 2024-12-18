import { cn } from "@/lib/ui/utils";
import { ReactNode } from "react";

type Props = {
  // TODO: To support other variants "danger" | "success" | "warning"
  children: ReactNode;
  className?: string;
};

export default function RoundedTag({ children, className }: Props) {
  return (
    <div
      className={cn(
        "rounded-full",
        "h-[1.375rem] w-fit",
        "bg-danger-50",
        "px-2",
        "flex items-center justify-center",
        "text-xs uppercase text-danger-600",
        className,
      )}
    >
      {children}
    </div>
  );
}

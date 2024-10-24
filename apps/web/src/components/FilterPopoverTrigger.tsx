import ChevronDown from "@/icons/chevron-down";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  className?: {
    container?: string;
    label?: string;
    value?: string;
  };
};

export default function FilterPopoverTrigger({
  label,
  value,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-row items-center",
        "gap-[.375rem]",
        "text-sm",
        className?.container,
      )}
    >
      <span className={cn("text-gray-dim-500", className?.label)}>
        {label}:
      </span>
      <span
        className={cn("grow-1 shrink-1", "text-gray-700", className?.value)}
      >
        {value}
      </span>
      <ChevronDown className="h-[20px] w-4 shrink-0" />
    </div>
  );
}

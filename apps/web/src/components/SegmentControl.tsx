import { cn } from "@/lib/ui/utils";
import { ReactNode } from "react";

type Props = {
  items: Item[];
  active: Item;
  onSegment?: (id: Item) => void;
  className?: string;
};

export type Item = {
  id: string;
  getLabel: ({ isActive }: { isActive: boolean }) => ReactNode;
};

export function SegmentControl({ active, items, onSegment, className }: Props) {
  function isActive(item: Item) {
    return item.id === active.id;
  }

  return (
    <div className={cn("flex flex-row items-center gap-x-[.25rem]", className)}>
      {items.map((item, i) => (
        <button
          key={i}
          className={cn(
            "rounded-full border-b-[2px]",
            isActive(item)
              ? cn("border-gray-outline-200", "bg-gray-outline-200")
              : cn("border-transparent", "bg-transparent"),
            "px-[0.625rem] py-[0.375rem]",
            !isActive(item) && "hover:bg-washed-100",
          )}
          onClick={() => onSegment?.(item)}
        >
          {item.getLabel({ isActive: isActive(item) })}
        </button>
      ))}
    </div>
  );
}

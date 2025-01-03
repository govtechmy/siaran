import { cn } from "@/lib/ui/utils";
import { ReactNode } from "react";

type Props<Id extends string> = {
  items: Item<Id>[];
  active: Item<Id>;
  onSegment?: (id: Item<Id>) => void;
  className?: string;
};

export interface Item<Id extends string> {
  id: Id;
  getLabel: ({ isActive }: { isActive: boolean }) => ReactNode;
}

export function SegmentControl<Id extends string>({
  active,
  items,
  onSegment,
  className,
}: Props<Id>) {
  function isActive(item: Item<Id>) {
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

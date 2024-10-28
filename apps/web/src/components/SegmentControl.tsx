import { cn } from "@/lib/ui/utils";

type Props = {
  items: Item[];
  active: Item;
  onSegment?: (id: Item) => void;
  className?: string;
};

export type Item = {
  id: string;
  label: string;
  [key: string]: unknown;
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
            "shrink-0",
            "rounded-full border-b-[2px]",
            isActive(item)
              ? cn("border-gray-outline-200", "bg-gray-outline-200")
              : cn("border-transparent", "bg-transparent"),
            "px-[0.625rem] py-[0.375rem]",
            !isActive(item) && "hover:bg-washed-100",
          )}
          onClick={() => onSegment?.(item)}
        >
          <span
            className={cn(
              "text-base font-medium",
              isActive(item) ? "text-black-900" : "text-gray-dim-500",
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

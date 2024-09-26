import { cn } from "@/lib/utils";

type Props = {
  items: Item[];
  active: Item;
  onSegment?: (id: Item) => void;
};

export type Item = {
  id: string;
  label: string;
  [key: string]: unknown;
};

export function SegmentControl(props: Props) {
  function isActive(item: Item) {
    return item.id === props.active.id;
  }

  return (
    <div className={cn("flex flex-row items-center")}>
      {props.items.map((item, i) => (
        <button
          key={i}
          className={cn(
            "rounded-full border-b-[2px]",
            isActive(item)
              ? cn("border-gray-outline-200", "bg-gray-outline-200")
              : cn("border-transparent", "bg-transparent"),
            "px-[0.625rem] py-[0.375rem]",
          )}
          onClick={() => props.onSegment?.(item)}
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

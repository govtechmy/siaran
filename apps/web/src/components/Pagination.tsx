import RightArrow from "@/components/icons/rightarrow";
import { cn } from "@/lib/ui/utils";
import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import LeftArrow from "./icons/leftarrow";

type Props = {
  current: number;
  total: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

export default function Pagination({
  current,
  total,
  onPageChange,
  className,
}: Props) {
  const smallest = Math.max(1, current - 13);
  const largest = Math.min(total, current + 13);
  const adjacent = (
    current === 1
      ? [2, 3]
      : current === total
        ? [total - 2, total - 1]
        : [current - 1, current, current + 1]
  ).filter((n) => n > smallest && n < largest);

  const gapPageOrOverflow = 1; // The number of pages allowed before overflowing (ellipsis)
  const overflowMidSmallest = adjacent[0] - smallest > gapPageOrOverflow + 1;
  const overflowMidLargest =
    largest - adjacent[adjacent.length - 1] > gapPageOrOverflow + 1;

  const pages = [
    <Page
      key={smallest}
      variant={smallest === current ? "theme" : "default"}
      onClick={() => notifyPageChange(smallest)}
    >
      {smallest}
    </Page>,
    overflowMidSmallest ? (
      <PageEllipsis />
    ) : (
      adjacent.length > 0 &&
      smallest + 1 === adjacent[0] - 1 && (
        <Page
          key={smallest + 1}
          variant={smallest + 1 === current ? "theme" : "default"}
          onClick={() => notifyPageChange(smallest + 1)}
        >
          {smallest + 1}
        </Page>
      )
    ),
    adjacent.map((n) => (
      <Page
        key={n}
        variant={n === current ? "theme" : "default"}
        onClick={() => notifyPageChange(n)}
      >
        {n}
      </Page>
    )),
    overflowMidLargest ? (
      <PageEllipsis />
    ) : (
      adjacent.length > 0 &&
      largest - 1 === adjacent[adjacent.length - 1] + 1 && (
        <Page
          key={largest - 1}
          variant={largest - 1 === current ? "theme" : "default"}
          onClick={() => notifyPageChange(largest - 1)}
        >
          {largest - 1}
        </Page>
      )
    ),
    largest > smallest && ( // edge case when there's only 1 page (smallest)
      <Page
        key={largest}
        variant={largest === current ? "theme" : "default"}
        onClick={() => notifyPageChange(largest)}
      >
        {largest}
      </Page>
    ),
  ];

  function notifyPageChange(page: number) {
    if (page === current || page < 1 || page > total) {
      return;
    }

    onPageChange?.(page);
  }

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center",
        "text-black-900",
        className,
      )}
    >
      <Page
        variant="outline"
        shadow="button"
        disabled={current === 1}
        onClick={() => notifyPageChange(current - 1)}
        className={cn("mr-[.75rem]")}
      >
        <LeftArrow className={cn("size-[1.25rem]", "stroke-current")} />
      </Page>
      {...pages}
      <Page
        variant="outline"
        shadow="button"
        disabled={current === total}
        onClick={() => notifyPageChange(current + 1)}
        className={cn("ml-[.75rem]")}
      >
        <RightArrow className={cn("size-[1.25rem]", "stroke-current")} />
      </Page>
    </div>
  );
}

function PageEllipsis() {
  return <Page variant="ellipsis">...</Page>;
}

const variants = cva(
  cn(
    "rounded-[.375rem] text-current",
    "size-[2.5rem]",
    "hover:bg-washed-100",
    "flex flex-row items-center justify-center",
    "font-medium",
    "cursor-pointer",
  ),
  {
    variants: {
      variant: {
        outline: cn("border border-gray-outline-200"),
        theme: cn(
          "bg-theme-50 text-theme-600 hover:bg-theme-50",
          "cursor-default",
        ),
        ellipsis: cn("hover:bg-transparent", "cursor-default"),
        default: "border border-transparent",
      },
      shadow: {
        button: "shadow-button",
      },
      defaultVariants: {
        variant: "default",
      },
    },
  },
);

function Page({
  children,
  disabled,
  onClick,
  className,
  variant,
  shadow,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "outline" | "theme" | "ellipsis" | "default";
  shadow?: "button";
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "shrink-0",
        disabled && "opacity-30",
        variants({ variant, shadow }),
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

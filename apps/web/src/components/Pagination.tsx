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

  const size = 3;
  const distanceFromCurrent = Math.floor(size / 2);

  const midNumbers = new Array(size)
    .fill(current - distanceFromCurrent)
    .map((n, i) => n + i)
    .filter((n) => n > 0);

  const mid = (
    <>
      {midNumbers.map(
        (n) =>
          n !== smallest && (
            <Page
              key={n}
              variant={n === current ? "theme" : "default"}
              onClick={() => notifyPageChange(n)}
            >
              {n}
            </Page>
          ),
      )}
      <PageEllipsis />
    </>
  );

  const pages = [
    // 1 or the local minima relative to the current page
    <Page
      key={smallest}
      variant={smallest === current ? "theme" : "default"}
      onClick={() => notifyPageChange(smallest)}
    >
      {smallest}
    </Page>,
    midNumbers.length > 0 && midNumbers[0] - smallest > distanceFromCurrent && (
      <PageEllipsis />
    ),
    mid,
    <Page key={largest} onClick={() => notifyPageChange(largest)}>
      {largest}
    </Page>,
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

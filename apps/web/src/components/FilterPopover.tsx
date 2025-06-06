import { Button } from "@/components/Button";
import * as Base from "@/components/base/popover";
import { cn } from "@/lib/ui/utils";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";

export type Ref = {
  open: () => void;
  close: () => void;
};

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  side?: PopoverContentProps["side"];
  align?: PopoverContentProps["align"];
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const Popover = forwardRef<Ref, Props>(
  ({ trigger, children, side, align, onOpenChange, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        open() {
          setIsOpen(true);
        },
        close() {
          setIsOpen(false);
        },
      };
    }, []);

    return (
      <Base.Popover
        open={isOpen}
        onOpenChange={function updateState(open) {
          setIsOpen(open);
          onOpenChange?.(open);
        }}
      >
        <Base.PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            className={cn(
              "rounded-[0.5rem]",
              "h-[2rem] w-fit",
              "px-[0.625rem] py-[0.375rem]",
              "justify-between gap-[0.375rem]",
              isOpen
                ? "ring-[0.1875rem] ring-theme-600 ring-opacity-20 ring-offset-theme-600"
                : "border border-gray-outline-200",
            )}
          >
            {trigger}
          </Button>
        </Base.PopoverTrigger>
        <Base.PopoverContent
          align={align}
          side={side}
          className={cn(
            "rounded-[0.5rem]",
            "mt-[0.3rem]",
            "max-w-100vw h-fit w-auto",
            "p-[0.3125rem]",
            "bg-white-background-0",
            className,
          )}
        >
          {children}
        </Base.PopoverContent>
      </Base.Popover>
    );
  },
);

Popover.displayName = "Popover";

export { Popover };

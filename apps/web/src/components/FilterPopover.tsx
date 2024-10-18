import { Button } from "@/components/base/button";
import * as Base from "@/components/base/popover";
import { cn } from "@/lib/utils";
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
  className?: string;
};

const Popover = forwardRef<Ref, Props>(
  ({ trigger, children, side, align, className }, ref) => {
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
      <Base.Popover open={isOpen} onOpenChange={setIsOpen}>
        <Base.PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={`max-w[10.3125rem] h-[2rem] w-fit justify-between gap-[0.375rem] rounded-[0.5rem] px-[0.625rem] py-[0.375rem] ${
              isOpen
                ? "ring-[0.1875rem] ring-theme-600 ring-opacity-20 ring-offset-theme-600"
                : "border border-gray-outline-200"
            }`}
          >
            {trigger}
          </Button>
        </Base.PopoverTrigger>
        <Base.PopoverContent
          align={align}
          side={side}
          className={cn(
            "mt-[0.3rem]",
            "h-fit w-fit",
            "p-[0.3125rem]",
            "rounded-[0.5rem] bg-white-background-0",
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

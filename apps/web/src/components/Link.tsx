import { cn } from "@/lib/ui/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const Link = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(
  ({ href, target, rel, className, children, ...props }, ref) => {
    return (
      <a
        className={cn(
          "hover:cursor-pointer",
          "active:translate-y-[.0625rem]",
          className,
        )}
        href={href}
        target={target || "_self"}
        rel={rel}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  },
);

Link.displayName = "Link";

export { Link };

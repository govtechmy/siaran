import { cn } from "@/lib/ui/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-washed-100", className)}
      {...props}
    />
  );
}

export { Skeleton };

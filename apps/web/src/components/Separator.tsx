import { cn } from "@/lib/ui/utils";

export default function Separator({
  type,
  className,
}: {
  type: "bullet" | "pipe";
  className?: string;
}) {
  return (
    <div className={cn("text-xs text-gray-outline-300", className)}>
      {type === "bullet" && "•"}
      {type === "pipe" && "|"}
    </div>
  );
}

import { cn } from "@/lib/ui/utils";

export default function HorizontalRule({ className }: { className?: string }) {
  return <hr className={cn("border-t border-t-gray-outline-200", className)} />;
}

import CurrentStrokeIcon from "@/components/utils/CurrentStrokeIcon";
import Search from "@/icons/search";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function SearchButton(props: Props) {
  return (
    <button
      className={cn(
        "rounded-full",
        "border-[1px] border-theme-600",
        "focus:outline-none focus:ring-[0.1875rem] focus:ring-theme-600/40",
        "bg-gradient-to-b from-theme-300 to-theme-600",
        "flex items-center justify-center",
        "text-white-force_white",
        "transition-transform active:translate-y-[0.0625rem]",
        "data-[disabled=true]:pointer-events-none",
        "stroke-[0.09375rem]",
        props.className,
      )}
      data-disabled={props.disabled}
      type={props.type}
    >
      <CurrentStrokeIcon icon={<Search />} />
    </button>
  );
}

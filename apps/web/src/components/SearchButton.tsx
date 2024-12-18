import CurrentStrokeIcon from "@/components/utils/CurrentStrokeIcon";
import Search from "@/icons/search";
import { cn } from "@/lib/ui/utils";
import ThemeButton from "./ThemeButton";

type Props = {
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export default function SearchButton(props: Props) {
  return (
    <ThemeButton
      className={cn(props.className)}
      data-disabled={props.disabled}
      type={props.type}
      roundness="full"
      padding="none"
    >
      <CurrentStrokeIcon icon={<Search />} />
    </ThemeButton>
  );
}

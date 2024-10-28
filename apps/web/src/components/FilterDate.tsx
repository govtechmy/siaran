import { Calendar } from "@/components/default/Calendar";
import {
  Popover as FilterPopover,
  type Ref as FilterPopoverRef,
} from "@/components/FilterPopover";
import FilterPopoverTrigger from "@/components/FilterPopoverTrigger";
import { cn } from "@/lib/ui/utils";
import { format } from "date-fns";
import { RefObject } from "react";
import { useDateLocale } from "./hooks/date";
import { useTranslations } from "next-intl";

type Props = {
  label: string;
  onChange: (date?: Date) => void;
  selected?: Date;
  notBefore?: Date;
  popoverRef?: RefObject<FilterPopoverRef>;
};

export type Ref = FilterPopoverRef;

export function Filter({
  label,
  selected,
  notBefore,
  onChange,
  popoverRef,
}: Props) {
  const t = useTranslations();
  const locale = useDateLocale();

  return (
    <FilterPopover
      ref={popoverRef}
      className="p-0"
      align="start"
      side="bottom"
      trigger={
        <FilterPopoverTrigger
          label={label}
          value={
            selected
              ? format(selected, "d/M/yyyy")
              : t("components.FilterDate.labels.trigger")
          }
          className={{ value: cn() }}
        />
      }
    >
      <Calendar
        locale={locale}
        className="w-full"
        mode="single"
        selected={selected}
        onSelect={function onSelect(day) {
          onChange(day);
        }}
        disabled={(date) => {
          const now = new Date();

          if (notBefore) {
            return date < notBefore || date > now;
          }

          return date > now;
        }}
      />
    </FilterPopover>
  );
}

import { Command, CommandItem, CommandList } from "@/components/base/command";
import { Popover as FilterPopover } from "@/components/FilterPopover";
import FilterPopoverClose from "@/components/FilterPopoverClose";
import FilterPopoverItem from "@/components/FilterPopoverItem";
import FilterPopoverText from "@/components/FilterPopoverText";
import FilterTrigger from "@/components/FilterPopoverTrigger";
import CheckCircle from "@/icons/check-circle";
import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";

export interface Option<Id extends string> {
  id: Id;
  label: string;
}

type Props<OptionId extends string> = {
  options: Option<OptionId>[];
  selected?: Option<OptionId>;
  onChange: (option: Option<OptionId>) => void;
};

export function Filter<OptionId extends string>({
  options,
  selected,
  onChange,
}: Props<OptionId>) {
  const t = useTranslations();

  return (
    <FilterPopover
      align="start"
      side="bottom"
      trigger={
        <FilterTrigger
          label={t("common.filters.labels.type")}
          value={selected?.label ?? ""}
        />
      }
    >
      <Command>
        <CommandList>
          {Object.values(options).map((option, index) => (
            <CommandItem
              key={index}
              value={option.label}
              onSelect={function onSelect(value) {
                onChange(option);
              }}
            >
              <FilterPopoverItem>
                <FilterPopoverClose
                  className={cn("flex flex-row items-center gap-x-[.5rem]")}
                >
                  <FilterPopoverText className={cn("flex-1")}>
                    {option.label}
                  </FilterPopoverText>
                  <div
                    className={cn(
                      "flex flex-none flex-row items-center",
                      "size-[1.25rem]",
                    )}
                  >
                    {selected?.id === option.id && (
                      <CheckCircle className="stroke-current text-theme-600" />
                    )}
                  </div>
                </FilterPopoverClose>
              </FilterPopoverItem>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </FilterPopover>
  );
}

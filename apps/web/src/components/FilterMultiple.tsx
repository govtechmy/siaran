import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/base/command";
import { Checkbox } from "@/components/default/Checkbox";
import { Popover as FilterPopover } from "@/components/FilterPopover";
import FilterPopoverItem from "@/components/FilterPopoverItem";
import FilterPopoverText from "@/components/FilterPopoverText";
import FilterPopoverTrigger from "@/components/FilterPopoverTrigger";
import { cn } from "@/lib/ui/utils";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import FilterPopoverSecondaryText from "./FilterPopoverSecondaryText";

export type Option = {
  id: string;
  label: string;
  info?: string;
};

type Props = {
  trigger: {
    label: string;
  };
  options: Option[];
  selected?: Option[];
  sort?: (a: Option, b: Option) => number;
  onChange: (data: Option[]) => void;
};

export function Filter({
  trigger,
  options,
  selected = [],
  sort,
  onChange,
}: Props) {
  const t = useTranslations();
  const [sortedOptions, setSortedOptions] = useState(options.sort(sort));
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function hasChecked(option: Option) {
    return !!selected.find((value) => value.id === option.id);
  }

  function hasCheckedAll() {
    return selected.length === options.length;
  }

  function onOptions(value: Option[]) {
    onChange(value);
  }

  useEffect(
    function sortOptionsOnClose() {
      if (isOpen) {
        return;
      }

      // Set a timeout for the animation to finish before sorting
      const timeout = setTimeout(function sortOptions() {
        setSortedOptions((sortedOptions) => [
          ...sortedOptions.filter(hasChecked).sort(sort),
          ...sortedOptions.filter((current) => !hasChecked(current)).sort(sort),
        ]);
      }, 300);

      return () => clearTimeout(timeout);
    },
    [isOpen],
  );

  return (
    <FilterPopover
      align="start"
      side="bottom"
      onOpenChange={setIsOpen}
      trigger={
        <FilterPopoverTrigger
          label={trigger.label}
          value={
            hasCheckedAll()
              ? t("common.filters.labels.all")
              : selected.length === 0
                ? t("common.filters.labels.none")
                : selected.length === 1
                  ? selected[0].label
                  : t("common.filters.labels.multiple")
          }
          className={{ value: cn("max-w-[8ch]", "truncate") }}
        />
      }
    >
      <Command>
        <CommandInput
          className={cn(
            "h-[2rem] w-fit",
            "rounded-[0.5rem]",
            "text-sm text-gray-500",
          )}
          placeholder={t("common.filters.labels.search")}
        />
        <CommandList className={cn("mt-[.3125rem]")}>
          <CommandEmpty asChild>
            <FilterPopoverItem>
              <FilterPopoverText>
                {t("common.errors.notFound")}
              </FilterPopoverText>
            </FilterPopoverItem>
          </CommandEmpty>
          <CommandGroup>
            <CheckboxItem
              id={t("common.filters.labels.all")}
              label={t("common.filters.labels.selectAll")}
              checked={hasCheckedAll()}
              onCheckedChange={function checkAll(checked) {
                if (hasCheckedAll()) {
                  onOptions([]);
                } else {
                  onOptions(options);
                }
              }}
            />
            {sortedOptions.map((option, index) => (
              <CheckboxItem
                key={option.id}
                id={option.id}
                label={option.label}
                info={option.info}
                checked={hasChecked(option)}
                onCheckedChange={function toggleCheck(checked) {
                  if (hasChecked(option)) {
                    onOptions(
                      selected.filter((value) => value.id !== option.id),
                    );
                  } else {
                    onOptions([...selected, option]);
                  }
                }}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </FilterPopover>
  );
}

function CheckboxItem({
  id,
  label,
  info,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  info?: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <CommandItem value={id} asChild>
      <label htmlFor={id} className={cn("h-full w-full")}>
        <FilterPopoverItem
          className={cn("flex flex-row items-start gap-[1ch]")}
        >
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={cn("mt-[.175rem]")} // Small margin to align with the text
          />
          <div className={cn("flex flex-col items-start")}>
            <FilterPopoverText>{label}</FilterPopoverText>
            {info && (
              <FilterPopoverSecondaryText>{info}</FilterPopoverSecondaryText>
            )}
          </div>
        </FilterPopoverItem>
      </label>
    </CommandItem>
  );
}

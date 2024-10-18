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
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type Option = {
  id: string;
  label: string;
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

  function hasSelected(option: Option) {
    return !!selected.find((value) => value.id === option.id);
  }

  function hasSelectedAll() {
    return selected.length === options.length;
  }

  function onOptions(value: Option[]) {
    onChange(value);
  }

  return (
    <FilterPopover
      align="start"
      side="bottom"
      trigger={
        <FilterPopoverTrigger
          label={trigger.label}
          value={
            hasSelectedAll()
              ? t("common.filters.labels.all")
              : selected.length === 0
                ? t("common.filters.labels.none")
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
              checked={hasSelectedAll()}
              onCheckedChange={function toggleAll(checked) {
                if (hasSelectedAll()) {
                  onOptions([]);
                } else {
                  onOptions(options);
                }
              }}
            />
            {options.sort(sort).map((option, index) => (
              <CheckboxItem
                key={index}
                id={option.id}
                label={option.label}
                checked={hasSelected(option)}
                onCheckedChange={function toggleItem(checked) {
                  if (hasSelected(option)) {
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
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <CommandItem value={id} asChild>
      <label htmlFor={id} className={cn("h-full w-full")}>
        <FilterPopoverItem
          className={cn("flex flex-row items-center gap-[1ch]")}
        >
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <FilterPopoverText>{label}</FilterPopoverText>
        </FilterPopoverItem>
      </label>
    </CommandItem>
  );
}

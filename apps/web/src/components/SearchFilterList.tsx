"use client";

import * as FilterDate from "@/components/FilterDate";
import * as FilterMultiple from "@/components/FilterMultiple";
import * as FilterOneOf from "@/components/FilterOneOf";
import { useEffectMounted } from "@/components/hooks/mounted";
import CrossX from "@/components/icons/cross-x";
import { cn } from "@/lib/ui/utils";
import type { Agency, PressReleaseType } from "@repo/api/cms/types";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

interface FilterTypeOption
  extends FilterOneOf.Option<Exclude<PressReleaseType, "other"> | "all"> {}

export type Filters = {
  agencies?: Agency[];
  type?: PressReleaseType;
  startDate?: string;
  endDate?: string;
};

type Props = {
  agencies: Agency[];
  initialData?: Filters;
  className?: string;
  onFiltersChange?: (filters: Filters) => void;
};

type FilterArg =
  | { type: "agencies"; value: FilterMultiple.Option[] }
  | { type: "type"; value: FilterTypeOption }
  | { type: "startDate"; value?: Date }
  | { type: "endDate"; value?: Date };

export default function SearchFilterList({
  agencies,
  initialData,
  onFiltersChange,
  className,
}: Props) {
  const t = useTranslations();

  // Map agency to filter option
  function mapAgency(agency: Agency): FilterMultiple.Option {
    return {
      id: agency.id,
      label: agency.acronym,
      info: t(`common.agencies.${agency.acronym}`),
    };
  }

  const allAgencies = agencies.map(mapAgency) satisfies FilterMultiple.Option[];
  const initialAgencies = initialData?.agencies?.map(mapAgency) || [];
  const [selectedAgencies, setSelectedAgencies] = useState<
    FilterMultiple.Option[]
  >(initialAgencies.length > 0 ? initialAgencies : allAgencies);

  const allPostTypes = [
    {
      id: "all",
      label: t("common.filters.types.all"),
    },
    {
      id: "kenyataan_media",
      label: t("common.filters.types.mediaRelease"),
    },
    {
      id: "ucapan",
      label: t("common.filters.types.speech"),
    },
  ] satisfies FilterTypeOption[];
  const defaultPostType = allPostTypes[0];
  const initialPostType = initialData?.type
    ? allPostTypes.find((type) => type.id === initialData?.type)
    : undefined;
  const [selectedPostType, setSelectedPostType] = useState(
    initialPostType || defaultPostType,
  );

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const startDateRef = useRef<FilterDate.Ref>(null);
  const endDateRef = useRef<FilterDate.Ref>(null);

  const isFilterApplied =
    selectedAgencies.length !== allAgencies.length ||
    selectedPostType.id !== defaultPostType.id ||
    !!startDate ||
    !!endDate;

  function onFilter({ type, value }: FilterArg) {
    switch (type) {
      case "agencies":
        setSelectedAgencies(value);
        break;
      case "type":
        setSelectedPostType({
          id: value.id,
          label: value.label,
        });
        break;
      case "startDate":
        setStartDate(value);
        closeStartDatePopover();

        const isEndDateOutOfRange = endDate && value && value > endDate;

        if (isEndDateOutOfRange) {
          setEndDate(undefined);
        }

        // if (!endDate || isEndDateOutOfRange) {
        //   openEndDatePopover();
        // }

        break;
      case "endDate":
        setEndDate(value);
        closeEndDatePopover();
        break;
    }
  }

  function onClear() {
    setSelectedAgencies(allAgencies);
    setSelectedPostType(defaultPostType);
    setStartDate(undefined);
    setEndDate(undefined);
  }

  function openEndDatePopover() {
    endDateRef.current?.open();
  }

  function closeEndDatePopover() {
    endDateRef.current?.close();
  }

  function closeStartDatePopover() {
    startDateRef.current?.close();
  }

  useEffectMounted(
    function updateParams() {
      onFiltersChange?.({
        agencies: agencies.filter((agency) =>
          selectedAgencies.find((option) => option.id === agency.id),
        ),
        type: selectedPostType.id === "all" ? undefined : selectedPostType.id,
        startDate: startDate && format(startDate, "yyyy-MM-dd"),
        endDate: endDate && format(endDate, "yyyy-MM-dd"),
      });
    },
    [selectedAgencies, selectedPostType, startDate, endDate],
  );

  return (
    <div
      className={cn(
        "h-fit w-fit",
        "flex flex-row flex-wrap items-center gap-[.5rem] lg:flex-nowrap",
        className,
      )}
    >
      <span className={cn("hidden lg:block", "text-sm text-gray-500")}>
        {t("components.SearchFilterList.labels.filterBy")}:
      </span>
      <FilterMultiple.Filter
        trigger={{ label: t("common.filters.labels.agency") }}
        options={allAgencies}
        selected={selectedAgencies}
        sort={(a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)}
        onChange={(value) => onFilter({ type: "agencies", value })}
      />
      <FilterOneOf.Filter
        options={allPostTypes}
        selected={selectedPostType}
        onChange={(value) => onFilter({ type: "type", value })}
      />
      <FilterDate.Filter
        label={t("common.filters.labels.from")}
        selected={startDate}
        onChange={(value) => onFilter({ type: "startDate", value })}
        popoverRef={startDateRef}
      />
      <FilterDate.Filter
        label={t("common.filters.labels.to")}
        notBefore={startDate}
        selected={endDate}
        onChange={(value) => onFilter({ type: "endDate", value })}
        popoverRef={endDateRef}
      />
      {isFilterApplied && (
        <button
          onClick={onClear}
          className="flex h-[1.25rem] w-[5.625rem] items-center gap-1 text-sm text-gray-dim-500"
        >
          <CrossX className="h-[1.25rem] w-[1.125rem]" />
          {t("common.filters.labels.clear")}
        </button>
      )}
    </div>
  );
}

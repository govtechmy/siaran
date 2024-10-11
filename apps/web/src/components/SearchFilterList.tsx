"use client";

import type { Agency } from "@/app/types/types";
import * as FilterDate from "@/components/FilterDate";
import * as FilterMultiple from "@/components/FilterMultiple";
import * as FilterOneOf from "@/components/FilterOneOf";
import CrossX from "@/components/icons/cross-x";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  agencies: Agency[];
  className?: string;
};

type FilterArg =
  | { type: "agency"; value: FilterMultiple.Option[] }
  | { type: "type"; value: FilterOneOf.Option }
  | { type: "startDate"; value?: Date }
  | { type: "endDate"; value?: Date };

function mapAgency(agency: Agency) {
  return {
    id: agency.id,
    label: agency.acronym,
  } satisfies FilterMultiple.Option;
}

export default function SearchFilterList({ agencies, className }: Props) {
  const t = useTranslations();

  const allAgencies = agencies.map(mapAgency);
  const [selectedAgencies, setSelectedAgencies] = useState(allAgencies);

  const allPostTypes = [
    {
      id: "all",
      label: t("common.filters.types.all"),
    },
    {
      id: "mediaRelease",
      label: t("common.filters.types.mediaRelease"),
    },
    {
      id: "speech",
      label: t("common.filters.types.speech"),
    },
  ] satisfies FilterOneOf.Option[];
  const defaultPostType = allPostTypes[0];
  const [selectedPostType, setSelectedPostType] = useState(defaultPostType);

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
      case "agency":
        setSelectedAgencies(value);
        break;
      case "type":
        setSelectedPostType(value);
        break;
      case "startDate":
        setStartDate(value);
        closeStartDatePopover();

        const isEndDateOutOfRange = endDate && value && value > endDate;

        if (isEndDateOutOfRange) {
          setEndDate(undefined);
        }

        if (!endDate || isEndDateOutOfRange) {
          openEndDatePopover();
        }

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

  return (
    <div
      className={cn(
        "h-fit w-fit",
        "flex flex-row flex-wrap items-center gap-[.5rem] md:flex-nowrap",
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
        onChange={(value) => onFilter({ type: "agency", value })}
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

"use client";

import SearchFilterList from "@/components/SearchFilterList";
import { ComponentProps } from "react";

// An implementation of business logic when filters change
export default function SearchFilterListProxy({
  onFiltersChange,
  agencies,
  className,
}: ComponentProps<typeof SearchFilterList>) {
  return (
    <SearchFilterList
      className={className}
      agencies={agencies}
      onFiltersChange={onFiltersChange}
    />
  );
}

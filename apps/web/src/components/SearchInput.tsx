"use client";

import { Input } from "@/components/base/input";
import ChevronRight from "@/icons/chevron-right";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { ReactNode, useRef, useState } from "react";
import CrossX from "./icons/cross-x";
import SearchButton from "./SearchButton";

import { useTRPCQuery } from "@/api/hooks/query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/base/command";
import { cn } from "@/lib/utils";
import type { PaginatedSearchResponse } from "@repo/api/cms/types";
import { useTranslations } from "next-intl";
import PressToSearch from "./PressToSearch";

type Props = {
  className?: string;
};

export default function SearchInput({ className }: Props) {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useClickAway<HTMLDivElement>(() =>
    setIsDropdownOpen(false),
  );
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useTRPCQuery({
    type: "search",
    queryKey: [debouncedQuery],
    queryFn: async (trpc) => await trpc.searchAll.query({ q: debouncedQuery }),
  });

  return (
    <div
      className={cn(
        "relative",
        "max-h-[5.5rem] w-full max-w-[40rem]",
        className,
      )}
      ref={containerRef}
    >
      <InputWithOverlay
        query={query}
        onDropdown={setIsDropdownOpen}
        onQuery={setQuery}
        className={cn("z-0")}
      />
      <QueryResultDropdown
        data={data}
        isDropdownOpen={isDropdownOpen}
        query={debouncedQuery}
        className={cn("z-1")}
      />
    </div>
  );
}

function InputWithOverlay({
  query,
  onDropdown,
  onQuery,
  className,
}: {
  query: string;
  onDropdown: (isOpen: boolean) => void;
  onQuery: (query: string) => void;
  className?: string;
}) {
  const t = useTranslations();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSearchInput(input: string) {
    const newQuery = input.trim();
    onDropdown(!!newQuery);
    onQuery(newQuery);
  }

  function onClearQuery() {
    onDropdown(false);
    onQuery("");

    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      className={cn("relative", "h-[2.75rem] w-full", className)}
    >
      <Input
        ref={inputRef}
        className={cn(
          "absolute",
          "bottom-0 left-0 right-0 top-0",
          "h-full w-full",
          "pb-[.375rem] pl-[1.125rem] pr-[4.375rem] pt-[.375rem]",
        )}
        placeholder={t("components.SearchInput.placeholders.searchInput")}
        onChange={(e) => onSearchInput(e.target.value)}
        onFocus={() => {
          onDropdown(!!query);
          setIsInputFocused(true);
        }}
        onBlur={() => {
          // onDropdown(false);
          setIsInputFocused(false);
        }}
      />
      <div
        className={cn(
          "absolute",
          "flex flex-row items-center gap-[.4375rem]",
          "bottom-[.375rem] right-[.375rem] top-[.375rem]",
          "pointer-events-none",
        )}
      >
        {query ? (
          <button
            className={cn("focus:outline-none", "pointer-events-auto")}
            onClick={onClearQuery}
          >
            <CrossX />
          </button>
        ) : (
          <PressToSearchWithInputFocus
            isInputFocused={isInputFocused}
            onShortcutPressed={() => {
              if (!isInputFocused) {
                inputRef.current?.focus();
              }
            }}
          />
        )}
        <SearchButton
          className={cn("h-[2rem] w-[2rem]", "pointer-events-auto")}
        />
      </div>
    </form>
  );
}

function QueryResultDropdown({
  data,
  isDropdownOpen,
  query,
  className,
}: {
  data: PaginatedSearchResponse;
  isDropdownOpen: boolean;
  query: string;
  className?: string;
}) {
  const t = useTranslations();

  if (!isDropdownOpen) {
    return;
  }

  return (
    <Command
      className={cn(
        "mt-[-2.75rem]",
        "rounded-[1.375rem]",
        "h-fit max-h-[19.375rem] w-full",
        "pt-[2.75rem]",
        "overflow-y-auto bg-white-focus_white-200 shadow-lg",
        "dropdown-scrollbar",
        className,
      )}
    >
      <CommandList>
        {data.agencies.length > 0 && (
          <CommandGroup
            heading={
              <CommandGroupHeading className={cn("mt-[.875rem]")}>
                {t("components.SearchInput.titles.agencies")}
              </CommandGroupHeading>
            }
          >
            {data.agencies.map((agency, index) => (
              <QueryResultItem key={index}>
                <span className={cn("truncate")}>
                  {agency.name} ({agency.acronym})
                </span>
                <ChevronRight
                  className={cn("size-[1rem]", "text-gray-dim-500")}
                />
              </QueryResultItem>
            ))}
          </CommandGroup>
        )}
        {data.pressReleases.length > 0 && (
          <CommandGroup
            heading={
              <CommandGroupHeading>
                {t("components.SearchInput.titles.pressReleases")}
              </CommandGroupHeading>
            }
          >
            {data.pressReleases.map((pressRelease, index) => (
              <QueryResultItem key={index}>
                <div className="min-w-0 flex-1 truncate">
                  {highlightText(pressRelease.title, query)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-black-800">
                    {pressRelease.relatedAgency.acronym.toUpperCase()}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </QueryResultItem>
            ))}
          </CommandGroup>
        )}
        {data.agencies.length === 0 && data.pressReleases.length === 0 && (
          <CommandEmpty>
            <div
              className={cn(
                "mb-[1.375rem]",
                "pl-[1.125rem] pt-[1.5rem]",
                "text-start",
                "text-gray-dim-500",
                "font-medium",
              )}
            >
              {t("components.SearchInput.labels.noResults")}
            </div>
          </CommandEmpty>
        )}
      </CommandList>
    </Command>
  );
}

function QueryResultItem({ children }: { children: ReactNode }) {
  return (
    <CommandItem
      className={cn(
        "ml-[.375rem] mr-[.875rem]",
        "h-[2.25rem]",
        "rounded-[.375rem]",
        "flex items-center justify-between gap-x-[.75rem]",
        "py-[.5rem] pl-[.75rem] pr-[.75rem]",
        "text-sm text-black-800",
        "hover:bg-gray-washed-100",
        "cursor-pointer",
      )}
    >
      {children}
    </CommandItem>
  );
}

function CommandGroupHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-[.25rem] ml-[1.125rem] mt-[1rem]",
        "text-sm text-gray-dim-500",
        className,
      )}
    >
      {children}
    </div>
  );
}

function PressToSearchWithInputFocus(props: {
  isInputFocused: boolean;
  onShortcutPressed?: () => void;
}) {
  const { isInputFocused, onShortcutPressed } = props;

  if (isInputFocused) {
    return;
  }

  return (
    <PressToSearch
      className={cn("hidden md:block", "shrink-0", "pointer-events-none")}
      shortcut="/"
      onShortcutPressed={onShortcutPressed}
    />
  );
}

function highlightText(text: string, query: string) {
  if (!query) {
    return text;
  }

  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(escapedQuery, "gi");
  const parts = text.split(regex);
  const matches = text.match(regex);
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts[i]);

    if (matches && matches[i]) {
      result.push(
        <span key={i} className={cn("text-theme-600", "font-medium")}>
          {matches[i]}
        </span>,
      );
    }
  }

  return result;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

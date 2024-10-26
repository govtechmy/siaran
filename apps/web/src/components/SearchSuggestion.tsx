"use client";

import { Input } from "@/components/base/input";
import CrossX from "@/components/icons/cross-x";
import SearchButton from "@/components/SearchButton";
import ChevronRight from "@/icons/chevron-right";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import {
  MutableRefObject,
  ReactNode,
  RefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { useTRPCQuery } from "@/api/hooks/query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/base/command";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import PressToSearch from "./PressToSearch";
import { isLoadingAtom } from "./stores/press-releases";

type Props = {
  onSubmitQuery?: (query: string) => void;
  onClearQuery?: () => void;
  className?: string;
};

export default function SearchSuggestion({
  className,
  onSubmitQuery,
  onClearQuery,
}: Props) {
  const [currentQuery, setCurrentQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useClickAway<HTMLDivElement>(() =>
    setIsDropdownOpen(false),
  );
  const searchInputRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const searchResultListRef = useRef<HTMLDivElement>(null);

  const [isLoading] = useAtom(isLoadingAtom);

  function closeSearchResults() {
    searchResultListRef.current?.blur();
    setIsDropdownOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        "max-h-[5.5rem] w-full max-w-[40rem]",
        className,
      )}
    >
      <SearchForm
        query={currentQuery}
        isLoading={isLoading}
        onInputFocusChange={setIsDropdownOpen}
        onQueryClear={function clearParams() {
          // setParams({ query });
          setCurrentQuery("");
          onClearQuery?.();
        }}
        onQueryChange={setCurrentQuery}
        onSubmit={function updateParamsAndCloseSearchResults() {
          // setParams({ query: currentQuery });
          closeSearchResults();
          onSubmitQuery?.(currentQuery);
        }}
        onKeyArrowDown={() => searchResultListRef.current?.focus()}
        searchInputRef={function setSearchInputRef(ref) {
          searchInputRef.current = ref;
        }}
        className={cn("z-0")}
      />
      {isDropdownOpen && (
        <SearchResult
          query={currentQuery}
          className={cn("z-1")}
          onKeyEscape={closeSearchResults}
          searchResultListRef={searchResultListRef}
        />
      )}
    </div>
  );
}

function SearchForm({
  query,
  isLoading,
  onInputFocusChange,
  onQueryClear,
  onQueryChange,
  onKeyArrowDown,
  onSubmit,
  searchInputRef,
  className,
}: {
  query: string;
  isLoading: boolean;
  onInputFocusChange?: (isOpen: boolean) => void;
  onQueryClear?: () => void;
  onQueryChange: (query: string) => void;
  onKeyArrowDown?: () => void;
  onSubmit?: () => void;
  searchInputRef?: (ref: HTMLInputElement | null) => void;
  className?: string;
}) {
  const t = useTranslations();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function hardUnfocus() {
    inputRef.current?.blur();
    setIsInputFocused(false);
    onInputFocusChange?.(false);
  }

  function softUnfocus() {
    inputRef.current?.blur();
    setIsInputFocused(false);
  }

  function updateInputFocus(focused: boolean, shouldNotify: boolean = false) {
    setIsInputFocused(focused);
    onInputFocusChange?.(shouldNotify && focused);
  }

  useEffect(() => updateInputFocus(!!query, true), [query]);
  useEffect(() => searchInputRef?.(inputRef.current), [searchInputRef]);

  return (
    <form
      ref={formRef}
      className={cn(
        "relative",
        "focus:outline-none",
        "h-[2.75rem] w-full",
        className,
      )}
      onSubmit={function notify(e) {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <Input
        name="search"
        type="text"
        ref={inputRef}
        className={cn(
          "absolute",
          "bottom-0 left-0 right-0 top-0",
          "h-full w-full",
          "pb-[.375rem] pl-[1.125rem] pr-[4.375rem] pt-[.375rem]",
        )}
        placeholder={t("components.SearchInput.placeholders.searchInput")}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={(e) => updateInputFocus(true, !!e.target.value)}
        onKeyDown={function unfocusInput(e) {
          switch (e.key) {
            case "Escape":
              e.preventDefault();
              hardUnfocus();
              break;
            case "ArrowDown":
              e.preventDefault();
              softUnfocus();
              onKeyArrowDown?.();
              break;
          }
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
        {query && !isLoading && (
          <button
            type="button"
            className={cn("focus:outline-none", "pointer-events-auto")}
            onClick={function clearQuery() {
              formRef.current?.reset();
              onQueryChange("");
              onQueryClear?.();
            }}
          >
            <CrossX />
          </button>
        )}
        {
          <PressToSearch
            className={cn(
              "hidden md:block",
              "shrink-0",
              "pointer-events-none",
              {
                "w-0 overflow-hidden": isInputFocused || query,
              },
            )}
            shortcut={"/"}
            disabled={isInputFocused}
            onShortcutPressed={function focusInput() {
              inputRef.current?.focus();
            }}
          />
        }
        <div className={cn("h-[2rem] w-[2rem]")}>
          {isLoading ? (
            <LoaderCircle
              className={cn(
                "size-full",
                "text-gray-outline-200",
                "duration-600 animate-spin",
              )}
            />
          ) : (
            <SearchButton
              className={cn("size-full", "pointer-events-auto")}
              type="submit"
            />
          )}
        </div>
      </div>
    </form>
  );
}

function SearchResult({
  query,
  className,
  onKeyEscape,
  searchResultListRef,
}: {
  query: string;
  className?: string;
  onKeyEscape?: () => void;
  searchResultListRef?: RefObject<HTMLDivElement>;
}) {
  return (
    <Command
      onKeyDown={function unfocusInput(e) {
        switch (e.key) {
          case "Escape":
            e.preventDefault();
            onKeyEscape?.();
            break;
        }
      }}
      ref={searchResultListRef}
      className={cn(
        "mt-[-2.75rem]",
        "outline-none",
        "rounded-[1.375rem]",
        "h-fit max-h-[19.375rem] w-full",
        "pt-[2.75rem]",
        "overflow-y-auto bg-white-focus_white-200 shadow-lg",
        "dropdown-scrollbar",
        className,
      )}
    >
      <Suspense fallback={<SearchResultNone />}>
        <SearchResultDropdown
          query={query}
          searchResultListRef={searchResultListRef}
        />
      </Suspense>
    </Command>
  );
}

function SearchResultDropdown({
  query,
  searchResultListRef,
}: {
  query: string;
  searchResultListRef?: RefObject<HTMLDivElement>;
}) {
  const t = useTranslations();
  const debouncedQuery = useDebounce(query, 300);
  const { data } = useTRPCQuery({
    type: "search",
    queryKey: [debouncedQuery],
    queryFn: async (trpc) => await trpc.searchAll.query({ q: debouncedQuery }),
  });

  return (
    <CommandList ref={searchResultListRef} className={cn("outline-none")}>
      {data.agencies.length === 0 && data.pressReleases.length === 0 && (
        <SearchResultNone />
      )}
      {data.agencies.length > 0 && (
        <CommandGroup
          className={cn("mt-[.875rem]")}
          heading={
            <CommandGroupHeading>
              {t("components.SearchInput.titles.agencies")}
            </CommandGroupHeading>
          }
        >
          {data.agencies.map((agency, index) => (
            <SearchSuggestionItem key={index} value={agency.id}>
              <span className={cn("truncate")}>
                {agency.name} ({agency.acronym})
              </span>
              <ChevronRight
                className={cn("size-[1rem]", "text-gray-dim-500")}
              />
            </SearchSuggestionItem>
          ))}
        </CommandGroup>
      )}
      {data.pressReleases.length > 0 && (
        <CommandGroup
          className={cn("mb-[0.5rem] mt-[1rem]")}
          heading={
            <CommandGroupHeading>
              {t("components.SearchInput.titles.pressReleases")}
            </CommandGroupHeading>
          }
        >
          {data.pressReleases.map((pressRelease, index) => (
            <SearchSuggestionItem key={index} value={pressRelease.id}>
              <div className="min-w-0 flex-1 truncate">
                {highlightText(pressRelease.title, query)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-black-800">
                  {pressRelease.relatedAgency.acronym.toUpperCase()}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </SearchSuggestionItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}

function SearchResultNone() {
  const t = useTranslations();

  return (
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
  );
}

function SearchSuggestionItem({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  return (
    <CommandItem
      tabIndex={0}
      value={value}
      className={cn(
        "ml-[.375rem] mr-[.875rem]",
        "h-[2.25rem]",
        "rounded-[.375rem]",
        "flex items-center justify-between gap-x-[.75rem]",
        "py-[.5rem] pl-[.75rem] pr-[.75rem]",
        "text-sm text-black-800",
        "cursor-pointer",
      )}
    >
      {children}
    </CommandItem>
  );
}
``;

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
        "mb-[.25rem] ml-[1.125rem]",
        "text-sm text-gray-dim-500",
        className,
      )}
    >
      {children}
    </div>
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

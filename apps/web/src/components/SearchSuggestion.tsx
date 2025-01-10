"use client";

import { Input } from "@/components/base/input";
import CrossX from "@/components/icons/cross-x";
import SearchButton from "@/components/SearchButton";
import ChevronRight from "@/icons/chevron-right";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import {
  ComponentProps,
  forwardRef,
  Ref,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { useTRPCSuspenseQuery } from "@/api/hooks/query";
import { cn } from "@/lib/ui/utils";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocaleURL } from "./hooks/url";
import PressToSearch from "./PressToSearch";

type Props = {
  isLoading: boolean;
  onSubmitQuery?: (query: string) => void;
  onClearQuery?: () => void;
  className?: string;
};

type SearchResultDropdownRef = {
  blur: () => void;
  focusNextItem: () => void;
};

export default function SearchSuggestion({
  isLoading,
  className,
  onSubmitQuery,
  onClearQuery,
}: Props) {
  const [currentQuery, setCurrentQuery] = useState("");
  const debouncedQuery = useDebounce(currentQuery, 300);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useClickAway<HTMLDivElement>(() =>
    setIsDropdownOpen(false),
  );
  const searchResultDropdownRef = useRef<SearchResultDropdownRef>(null);

  function closeSearchResults() {
    searchResultDropdownRef.current?.blur();
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
          setCurrentQuery("");
          onClearQuery?.();
        }}
        onQueryChange={setCurrentQuery}
        onSubmit={function updateParamsAndCloseSearchResults() {
          closeSearchResults();
          onSubmitQuery?.(currentQuery);
        }}
        onKeyArrowDown={() => searchResultDropdownRef.current?.focusNextItem()}
        className={cn("z-0")}
      />
      {isDropdownOpen && (
        <SearchResult
          dropdownRef={searchResultDropdownRef}
          query={debouncedQuery}
          className={cn("z-1")}
          onKeyEscape={closeSearchResults}
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
  className,
}: {
  query: string;
  isLoading: boolean;
  onInputFocusChange?: (isOpen: boolean) => void;
  onQueryClear?: () => void;
  onQueryChange: (query: string) => void;
  onKeyArrowDown?: () => void;
  onSubmit?: () => void;
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
        autoComplete="off"
        type="text"
        ref={inputRef}
        className={cn(
          "absolute",
          "bottom-0 left-0 right-0 top-0",
          "h-full w-full",
          "pb-[.375rem] pl-[1.125rem] pr-[4.375rem] pt-[.375rem]",
        )}
        placeholder={t("components.SearchSuggestion.placeholders.searchInput")}
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
            className={cn("pointer-events-auto")}
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
  dropdownRef,
}: {
  query: string;
  className?: string;
  onKeyEscape?: () => void;
  dropdownRef?: Ref<SearchResultDropdownRef>;
}) {
  return (
    <div
      onKeyDown={function unfocusInput(e) {
        switch (e.key) {
          case "Escape":
            e.preventDefault();
            onKeyEscape?.();
            break;
        }
      }}
      tabIndex={-1}
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
      <Suspense fallback={<SearchResultSearching />}>
        <SearchResultDropdown query={query} ref={dropdownRef} />
      </Suspense>
    </div>
  );
}

const SearchResultDropdown = forwardRef<
  SearchResultDropdownRef,
  { query: string }
>(({ query }, ref) => {
  const t = useTranslations();
  const { url } = useLocaleURL();

  const {
    data: { docs: pressReleases },
  } = useTRPCSuspenseQuery({
    route: "search",
    method: "pressReleases",
    params: { q: query },
    queryFn: async (trpc) => {
      if (query === "") {
        return { docs: [] };
      }

      return trpc.query({ q: query });
    },
  });

  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const searchItemRefs = useRef<(HTMLAnchorElement | null)[]>(
    new Array(pressReleases.length),
  );

  const setNextActiveItem = useCallback(
    (e?: globalThis.KeyboardEvent) => {
      if (!e || pressReleases.length === 0) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveItemIndex((index) => (index + 1) % pressReleases.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveItemIndex(
            (index) =>
              (index - 1 + pressReleases.length) % pressReleases.length,
          );
          break;
        default:
          break;
      }
    },
    [pressReleases],
  );

  useImperativeHandle(
    ref,
    function init() {
      return {
        blur() {
          //
        },
        focusNextItem() {
          setNextActiveItem();
        },
      };
    },
    [setNextActiveItem],
  );

  useEffect(
    function resetActiveItemIndex() {
      setActiveItemIndex(-1);
    },
    [query],
  );

  useEffect(
    function listenToKeyDown() {
      window.addEventListener("keydown", setNextActiveItem);

      return () => window.removeEventListener("keydown", setNextActiveItem);
    },
    [setNextActiveItem],
  );

  useEffect(
    function focusActiveItem() {
      if (activeItemIndex >= 0) {
        searchItemRefs.current[activeItemIndex]?.focus();
      }
    },
    [activeItemIndex],
  );

  return (
    <div className={cn(pressReleases.length > 0 && "pb-[.5rem]")}>
      {pressReleases.length === 0 && <SearchResultNone />}
      {pressReleases.length > 0 && (
        <SearchResultHeading>
          {t("components.SearchSuggestion.titles.pressReleases")}
        </SearchResultHeading>
      )}
      {pressReleases.length > 0 &&
        pressReleases.map((pressRelease, index) => (
          <SearchSuggestionLink
            key={pressRelease.id || index}
            href={url("press-releases", pressRelease.id)}
            data-id={pressRelease.id}
            ref={function setRef(el) {
              searchItemRefs.current[index] = el;
            }}
          >
            <span className="min-w-0 flex-1 truncate">
              {highlightText(pressRelease.title, query)}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-sm text-black-800">
                {pressRelease.relatedAgency.acronym}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </span>
          </SearchSuggestionLink>
        ))}
    </div>
  );
});

SearchResultDropdown.displayName = "SearchResultDropdown";

function SearchResultSearching() {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "mb-[1.375rem]",
        "pl-[1.125rem] pt-[1.5rem]",
        "text-start",
        "text-gray-dim-500",
        "font-medium",
      )}
    >
      {t("components.SearchSuggestion.labels.searching")}
    </div>
  );
}

function SearchResultNone() {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "mb-[1.375rem]",
        "pl-[1.125rem] pt-[1.5rem]",
        "text-start",
        "text-gray-dim-500",
        "font-medium",
      )}
    >
      {t("components.SearchSuggestion.labels.noResults")}
    </div>
  );
}

const SearchSuggestionLink = forwardRef<HTMLAnchorElement, ComponentProps<"a">>(
  ({ children, ...props }, ref) => (
    <a
      {...props}
      ref={ref}
      className={cn(
        "mx-[.375rem]",
        "h-[2.25rem]",
        "rounded-[.375rem]",
        "flex flex-row items-center justify-between gap-x-[.75rem]",
        "py-[.5rem] pl-[.75rem] pr-[.75rem]",
        "text-sm text-black-800",
        "cursor-pointer",
        "hover:bg-gray-washed-100 focus:bg-gray-washed-100 focus:outline-none",
      )}
    >
      {children}
    </a>
  ),
);

SearchSuggestionLink.displayName = "SearchSuggestionLink";

function SearchResultHeading({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
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

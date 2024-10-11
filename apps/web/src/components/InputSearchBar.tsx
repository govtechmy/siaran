import { Input } from "@/components/ui/input";
import ChevronRight from "@/icons/chevron-right";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from "react";
import CrossX from "./icons/cross-x";
import SearchButton from "./icons/searchbutton";
import SearchSlash from "./icons/searchslash";

import { useTRPCQuery } from "@/api/hooks/query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function InputSearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useTRPCQuery({
    type: "search",
    queryKey: [debouncedQuery],
    queryFn: async (trpc) => await trpc.searchAll.query({ q: debouncedQuery }),
  });

  function onQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = e.target.value.trim();

    setIsOpen(!!newQuery);
    setQuery(newQuery);
  }

  function onClearQuery() {
    setIsOpen(false);
    setQuery("");
    inputRef.current?.focus();
  }

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(escapedQuery, "gi");
    const parts = text.split(regex);
    const matches = text.match(regex);
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(parts[i]);

      if (matches && matches[i]) {
        result.push(
          <span key={i} className="text-siaran-600">
            {matches[i]}
          </span>,
        );
      }
    }

    return result;
  };

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mousedown", onClickOutside);

    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative w-[37.5rem]">
      <div className="relative mb-[0.375rem]">
        <Input
          ref={inputRef}
          className="w-full"
          placeholder="Search by keywords"
          value={query}
          onChange={onQueryChange}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
        />
        <div
          className={cn(
            "absolute",
            "flex flex-row items-center",
            "bottom-0 right-0 top-0",
            "pointer-events-none",
          )}
        >
          {query ? (
            <button
              className="flex items-center justify-center rounded-full focus:outline-none"
              style={{ minWidth: "1rem", minHeight: "1rem" }}
              onClick={onClearQuery}
            >
              <CrossX className="h-full w-full" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Press</span>
              <SearchSlash />
              <span className="text-sm text-gray-400">to search</span>
            </div>
          )}
          <button
            className="flex items-center justify-center rounded-full focus:outline-none"
            style={{ minWidth: "3rem", minHeight: "3rem" }}
          >
            <SearchButton className="h-full w-full" />
          </button>
        </div>
      </div>
      {isOpen && (
        <Command
          ref={commandRef}
          className="custom-scrollbar absolute z-10 mt-[0.075rem] h-[16.625rem] w-full overflow-y-auto rounded-[1.375rem] bg-white-focus_white-200 shadow-lg"
        >
          <CommandList>
            {data.agencies.length > 0 && (
              <CommandGroup
                className="mt-1 text-sm text-gray-500"
                heading="Agencies"
              >
                {data.agencies.map((agency) => (
                  <CommandItem
                    key={agency.id}
                    className="flex h-[2.25rem] w-full items-center justify-between rounded-[0.375rem] px-3 text-sm text-black-800 hover:bg-gray-100"
                  >
                    <span className="truncate">
                      {agency.name} ({agency.acronym})
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data.pressReleases.length > 0 && (
              <CommandGroup
                className="text-sm text-gray-500"
                heading="Press Releases"
              >
                {data.pressReleases.map((pressRelease) => (
                  <CommandItem
                    key={pressRelease.id}
                    className="flex h-[2.25rem] w-full items-center justify-between rounded-[0.375rem] px-3 text-sm text-black-800 hover:bg-gray-100"
                  >
                    <div className="min-w-0 flex-1 truncate">
                      {highlightText(pressRelease.title, debouncedQuery)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-black-800">
                        {pressRelease.relatedAgency.acronym.toUpperCase()}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {data.agencies.length === 0 && data.pressReleases.length === 0 && (
              <CommandEmpty>No results found</CommandEmpty>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
}

export default InputSearchBar;

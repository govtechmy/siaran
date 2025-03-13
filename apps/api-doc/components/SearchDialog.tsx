"use client";

import { getString, Locale } from "@/lib/i18n";
import { getPath } from "@/lib/path";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@govtechmy/myds-react/dialog";
import {
  SearchBar,
  SearchBarClearButton,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarResults,
  SearchBarResultsItem,
  SearchBarResultsList,
  SearchBarSearchButton,
} from "@govtechmy/myds-react/search-bar";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { cn } from "fumadocs-ui/components/api";
import { useParams } from "next/navigation";
import Script from "next/script";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type SearchResultItem = {
  url: string;
  title: string;
  excerpt: string;
};

export const SearchDialogContext = createContext<{
  isOpen: boolean;
  isPagefindReady: boolean;
  onToggle: () => void;
} | null>(null);

export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPagefindReady, setIsPagefindReady] = useState(false);

  function onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      setIsOpen(true);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  function onPagefindLoaded() {
    setIsPagefindReady(true);
  }

  function onToggle() {
    setIsOpen(!isOpen);
  }

  function getPagefindBundle(assetPath: string) {
    return getPath(`/pagefind/${assetPath}`);
  }

  useEffect(function setUp() {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pagefind-loaded", onPagefindLoaded);

    return function cleanUp() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pagefind-loaded", onPagefindLoaded);
    };
  }, []);

  return (
    <SearchDialogContext.Provider value={{ isOpen, isPagefindReady, onToggle }}>
      {/* If you need pagefind default UI */}
      {/* <link href={getPagefindBundle("pagefind-ui.css")} rel="stylesheet" />
      <Script
        src={getPagefindBundle("pagefind-ui.js")}
        strategy="beforeInteractive"
      /> */}
      <Script strategy="afterInteractive">
        {`
          import("${getPagefindBundle("pagefind.js")}").then(mod => {
            window.pagefind = mod;
            window.dispatchEvent(new Event("pagefind-loaded"));
          });
        `}
      </Script>
      {children}
      <SearchDialog />
    </SearchDialogContext.Provider>
  );
}

export function SearchDialog() {
  const { isOpen, isPagefindReady, onToggle } =
    useContext(SearchDialogContext)!;
  const { lang } = useParams();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [resultItems, setResultItems] = useState<SearchResultItem[]>([]);

  const searchBarRef = useClickAway<HTMLDivElement>(onToggle);
  const shouldOpen = !!query;

  async function searchWithQuery(query: string) {
    if (!isPagefindReady) {
      return;
    }

    const response = await window.pagefind.search(query);
    const promises = response.results.map((result) => result.data());
    const items = await Promise.all(promises);
    const data = items.map((item) => ({
      url: item.url,
      title: item.meta.title,
      excerpt: item.excerpt,
    })) as SearchResultItem[];
    const localized = data.filter((item) => item.url.startsWith(`/${lang}`));

    setResultItems(localized.length > 0 ? localized : data);
  }

  useEffect(
    function search() {
      searchWithQuery(debouncedQuery);
    },
    [debouncedQuery],
  );

  return (
    <Dialog open={isOpen}>
      <DialogBody
        dismissible={false}
        className={cn("top-[20%]", "bg-transparent", "border-none")}
      >
        <DialogContent className="h-0">
          <DialogHeader>
            <DialogTitle className="hidden">Search</DialogTitle>
          </DialogHeader>
          <SearchBar size="large" ref={searchBarRef}>
            <SearchBarInputContainer>
              <SearchBarInput value={query} onValueChange={setQuery} />
              {query && <SearchBarClearButton onClick={() => setQuery("")} />}
              <SearchBarSearchButton />
            </SearchBarInputContainer>
            <SearchBarResults open={shouldOpen}>
              <SearchBarResultsList className="max-h-[350px] overflow-y-scroll">
                {resultItems.length > 0 ? (
                  resultItems.map((item) => (
                    <SearchBarResultsItem key={item.url} value={item.url}>
                      <a href={item.url} className="flex flex-col items-start">
                        <p className={cn("line-clamp-1", "text-sm")}>
                          {item.title}
                        </p>
                        <p
                          className={cn(
                            "mt-[0.25rem]",
                            "flex-1",
                            "line-clamp-2",
                            "text-xs text-txt-black-500",
                            "leading-normal",
                            "[&_mark]:bg-transparent",
                            "[&_mark]:text-txt-black-900",
                          )}
                          dangerouslySetInnerHTML={{
                            __html: item.excerpt,
                          }}
                        ></p>
                      </a>
                    </SearchBarResultsItem>
                  ))
                ) : (
                  <SearchBarResultsItem>
                    <p className="text-sm">
                      {getString("noResults", lang as Locale)}
                    </p>
                  </SearchBarResultsItem>
                )}
              </SearchBarResultsList>
            </SearchBarResults>
          </SearchBar>
        </DialogContent>
      </DialogBody>
    </Dialog>
  );
}

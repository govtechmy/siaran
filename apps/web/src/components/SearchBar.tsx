"use client";

import type { Agency } from "@/app/types/types";
import FilterTab from "./FilterTab";
import GovBadge from "./icons/govbadge";
import InputSearchBar from "./InputSearchBar";

interface SearchBarProps {
  agencies: Agency[];
}

export default function SearchBar({ agencies }: SearchBarProps) {
  return (
    <div className="flex min-h-[15rem] w-full flex-col items-center bg-[radial-gradient(117.1%_158.96%_at_50%_-58.96%,#FFD0A9_0%,#FFF6ED_100%)] px-[1.5rem] py-[3rem]">
      <section className="relative flex w-full items-center">
        <h1 className="text-siaran-text_hero text-xxl mx-auto h-[2rem] text-center font-semibold">
          One Stop Government Press Releases & Announcements
        </h1>
        <div className="absolute right-0 pt-7">
          <GovBadge className="ml-auto" />
        </div>
      </section>
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="flex h-[5.5rem] w-[37.5rem] flex-col items-center pt-[1.75rem]">
            <InputSearchBar />
          </div>
        </div>
        <FilterTab agencies={agencies} />
      </section>
    </div>
  );
}

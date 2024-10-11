'use client'
import React from "react";
import GovBadge from "./icons/govbadge";
import Section from "./Section";
import InputSearchBar from "./InputSearchBar";
import FilterTab from "./FilterTab";
import type { Agency } from '@/app/types/types';

interface SearchBarProps {
  agencies: Agency[];
}

export default function SearchBar({ agencies }: SearchBarProps) {
  
  return (
    <div
      className="flex flex-col items-center py-[3rem] px-[1.5rem] min-h-[15rem] w-full bg-[radial-gradient(117.1%_158.96%_at_50%_-58.96%,#FFD0A9_0%,#FFF6ED_100%)]"
    >
      <Section>
        <div className="flex items-center w-full relative">
          <h1 className="text-siaran-text_hero text-xxl h-[2rem] mx-auto text-center font-semibold">
            One Stop Government Press Releases & Announcements
          </h1>
          <div className="absolute right-0 pt-7">
            <GovBadge className="ml-auto" />
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center w-[37.5rem] h-[5.5rem] pt-[1.75rem]">
              <InputSearchBar />
            </div>
          </div>
          <FilterTab agencies={agencies} />
        </div>
      </Section>
    </div>
  );
}
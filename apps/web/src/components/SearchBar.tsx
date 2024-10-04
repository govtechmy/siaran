'use client'
import React from "react";
import GovBadge from "./icons/govbadge";
import Section from "./Section";
import InputSearchBar from "./InputSearchBar";
import AgencyDropDown from "./AgencyDropdown";
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
            <h1 className="text-siaran-text_hero text-xxl h-[2rem] mx-auto text-center">
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
              <div className="flex flex-col items-center w-[600px] h-[88px] pt-7">
                <InputSearchBar />
              </div>
            </div>
            <div className="w-[503px] h-[32px] flex mt-1 items-center gap-3">
              <span className="text-sm text-gray-500">Filter by:</span>
              <AgencyDropDown agencies={agencies} />
            </div>
          </div>
        </Section>
      </div>
    );
  }
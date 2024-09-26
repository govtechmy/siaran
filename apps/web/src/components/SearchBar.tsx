import React from "react";
import GovBadge from "./icons/govbadge";
import Section from "./Section";

export default function SearchBar() {
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
            <GovBadge className="ml-auto"/>
          </div>
        </div>
      </Section>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import SearchButton from './icons/searchbutton';
import SearchSlash from './icons/searchslash';
import CrossX from './icons/cross-x';
import type { PressRelease, Agency } from '@/app/types/types';
import { searchContent } from '../../api/press-release';
import ChevronRight from '@/icons/chevron-right';

import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';


function InputSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        const data = await searchContent(query);
        setPressReleases(data.pressReleases);
        setAgencies(data.agencies);
        setIsOpen(true);
      } catch (error) {
        console.error('Error searching:', error);
      }
    } else {
      setPressReleases([]);
      setAgencies([]);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-[600px] relative">
      <div className="relative mb-[6px]"> 
        <Input
          ref={inputRef}
          className="w-full pr-[8rem]"
          placeholder="Search by keywords"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(searchTerm);
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-sm">Press</span>
            <SearchSlash />
            <span className="text-gray-400 text-sm">to search</span>
          </div>
          <button
            className="flex items-center justify-center rounded-full focus:outline-none"
            style={{ minWidth: '3rem', minHeight: '3rem' }}
            onClick={() => handleSearch(searchTerm)}
          >
            <SearchButton className="w-full h-full" />
          </button>
        </div>
      </div>
      {isOpen && (
        <Command
          ref={commandRef}
          className="absolute w-full mt-[1.2px] h-[266px] overflow-y-auto bg-white-focus_white-200 shadow-lg rounded-[22px] z-10 custom-scrollbar"
        >
          <CommandList>
            {agencies.length > 0 && (
              <CommandGroup className='text-gray-500 text-sm mt-1' heading="Agencies">
                {agencies.map((agency) => (
                  <CommandItem
                    key={agency.id}
                    className="flex items-center justify-between w-[588px] h-[36px] px-3 text-black-800 text-sm rounded-[6px] hover:bg-gray-100"
                  >
                    <span className="max-w-[535px] line-clamp-1">
                      {agency.name} ({agency.acronym})
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {pressReleases.length > 0 && (
              <CommandGroup className='text-gray-500 text-sm' heading="Press Releases">
                {pressReleases.map((pressRelease) => (
                  <CommandItem
                  key={pressRelease.id}
                  className="flex items-center justify-between w-[588px] h-[36px] px-3 text-black-800 text-sm rounded-[6px] hover:bg-gray-100"
                  >
                  <div className="flex-1 max-w-[478px] line-clamp-1">
                    {pressRelease.title}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-black-800">
                      {pressRelease.relatedAgency.acronym.toUpperCase()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {agencies.length === 0 && pressReleases.length === 0 && (
              <CommandEmpty>No results found</CommandEmpty>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
}

export default InputSearchBar;

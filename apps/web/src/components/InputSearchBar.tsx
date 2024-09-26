import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import SearchButton from './icons/searchbutton';
import SearchSlash from './icons/searchslash';
import CrossX from './icons/cross-x';

function InputSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {

    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        <Input
          className="w-full pr-[8rem]"
          placeholder="Search by keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === '/') handleSearch();
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
            onClick={handleSearch}
          >
            <SearchButton className="w-full h-full" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputSearchBar;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import ChevronDown from './icons/chevron-down';

interface MediaTypeDropdownProps {
  selectedType: string;
  onTypeChange: (newType: string) => void;
}

const MediaTypeDropdown: React.FC<MediaTypeDropdownProps> = ({
  selectedType,
  onTypeChange,
}) => {
  const [open, setOpen] = useState(false);

  const options = ['All', 'Media Release', 'Speech Collection'];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-fit max-w-[14.685rem] h-[2rem] justify-between gap-[0.375rem] rounded-[0.5rem] px-[0.625rem] py-[0.375rem]
            ${
              open
                ? 'ring-[0.1875rem] ring-siaran-600 ring-offset-siaran-600 ring-opacity-20'
                : 'border border-gray-200'
            }`}
        >
          <span className="text-sm text-gray-dim-500">Type:</span>
          {selectedType}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mt-[0.3rem] mr-[3rem] w-[10rem] max-h-[6.625rem] p-0 px-[0.3125rem] pt-1 bg-white-background-0 border rounded-[0.5rem] custom-scrollbar"
      >
        <Command>
          <CommandList>
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={(currentValue) => {
                  onTypeChange(currentValue);
                  setOpen(false);
                }}
                className="hover:bg-gray-100 rounded-[0.25rem]"
              >
                {option}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MediaTypeDropdown;

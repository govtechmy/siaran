import React, { useState } from 'react';
import { Agency } from '@/app/types/types';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import ChevronDown from './icons/chevron-down';
import { cn } from '@/lib/utils';

interface AgencyDropDownProps {
  agencies: Agency[];
}

const AgencyDropDown: React.FC<AgencyDropDownProps> = ({ agencies }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(''); 

  const selectedAgency = agencies.find((agency) => agency.id === value) || null;

  const [inputValue, setInputValue] = useState('');

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    agency.acronym.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-fit max-w[10.3125rem] h-[2rem] justify-between gap-[0.375rem] rounded-[0.5rem] border border-gray-200 px-[0.625rem] py-[0.375rem]"
        >
          <span className='text-sm text-gray-500'>
            Agency: 
          </span>
          {selectedAgency ? selectedAgency.acronym : 'All'}
          <ChevronDown className=" h-4 w-4" />
        </Button> 
      </PopoverTrigger>
      <PopoverContent 
      className=" w-fit ml-[7.4rem] min-w-[15rem] h-[14.0625rem] p-0 bg-white-background-0 pr-[0.5rem] pt-[0.5rem] pl-[0.5rem] rounded-[0.875rem]"
      >
        <Command onValueChange={(val) => setInputValue(val)}>
        <CommandInput 
          className='w-fit h-[2rem] rounded-[0.5rem] text-sm text-gray-500' 
          placeholder="Type to search" 
        />
          <CommandList className='custom-scrollbar'>
            <CommandEmpty>No agency found.</CommandEmpty>
            <CommandGroup className='text-sm text-black-900'>
              <CommandItem
                value=""
                onSelect={(currentValue) => {
                  setValue('');
                  setOpen(false);
                  setInputValue('');
                }}
                className='hover:bg-gray-100 rounded-[0.25rem]'
              >
                All
              </CommandItem>
              {filteredAgencies.map((agency) => (
                <CommandItem
                  key={agency.id}
                  value={agency.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    setInputValue('');
                  }}
                  className='hover:bg-gray-100 rounded-[0.25rem]'
                >
                  {agency.acronym}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AgencyDropDown;

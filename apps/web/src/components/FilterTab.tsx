import React, { useState } from 'react';
import AgencyDropDown from './AgencyDropdown';
import DatePicker from './DatePicker';
import MediaTypeDropdown from './MediaTypeDropdown';
import type { Agency } from '@/app/types/types';
import CrossX from './icons/cross-x';

interface FilterTabProps {
  agencies: Agency[];
}

export default function FilterTab({ agencies }: FilterTabProps) {
  const [selectedAgency, setSelectedAgency] = useState<string | undefined>(
    undefined
  );
  const [selectedType, setSelectedType] = useState<string>('All');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);

  function handleFilterChange(
    filterType: 'Agency' | 'Media Type' | 'From Date' | 'To Date',
    value: any
  ) {
    switch (filterType) {
      case 'Agency':
        setSelectedAgency(value);
        break;
      case 'Media Type':
        setSelectedType(value);
        break;
      case 'From Date':
        setFromDate(value);
        break;
      case 'To Date':
        setToDate(value);
        break;
      default:
        break;
    }
  }

  function clearAllFilters() {
    setSelectedAgency(undefined);
    setSelectedType('All');
    setFromDate(undefined);
    setToDate(undefined);
  }

  const isFilterApplied =
    selectedAgency !== undefined ||
    selectedType !== 'All' ||
    fromDate !== undefined ||
    toDate !== undefined;

  return (
    <div className="w-fit max-w-[53rem] h-[2rem] flex mt-[0.0625rem] items-center gap-3">
      <span className="text-sm text-gray-500">Filter by:</span>
      <AgencyDropDown
        agencies={agencies}
        selectedAgency={selectedAgency}
        onAgencyChange={(newAgency) => handleFilterChange('Agency', newAgency)}
      />
      <MediaTypeDropdown
        selectedType={selectedType}
        onTypeChange={(newType) => handleFilterChange('Media Type', newType)}
      />
      <DatePicker
        label="From"
        selectedDate={fromDate}
        onDateChange={(newDate) => handleFilterChange('From Date', newDate)}
      />
      <DatePicker
        label="To"
        selectedDate={toDate}
        onDateChange={(newDate) => handleFilterChange('To Date', newDate)}
      />
      {isFilterApplied && (
        <button
          onClick={clearAllFilters}
          className="w-[5.625rem] h-[1.25rem] gap-1 text-sm flex items-center text-gray-dim-500"
        >
          <CrossX className="w-[1.125rem] h-[1.25rem]" />
          Clear all
        </button>
      )}
    </div>
  );
}

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import CalendarIcon from './icons/calendar-icon';

interface DatePickerProps {
  label: string;
  selectedDate: Date | undefined;
  onDateChange: (newDate: Date | undefined) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  selectedDate,
  onDateChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-auto max-w-[9.25rem] h-[2rem] justify-between gap-[0.375rem] rounded-[0.5rem] px-[0.625rem] py-[0.375rem]
            ${
              open
                ? 'ring-[0.1875rem] ring-siaran-600 ring-offset-siaran-600 ring-opacity-20'
                : 'border border-gray-200'
            }`}
        >
          <span className="text-sm text-gray-dim-500">{label}</span>
          {selectedDate ? (
            formatDate(selectedDate)
          ) : (
            <span>Pick a Date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white-background-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(day) => {
            onDateChange(day);
            setOpen(false);
          }}
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;


import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeFilterProps {
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onDateRangeChange }) => {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleSelect = (selectedDate: any) => {
    const { from, to } = selectedDate;
    setDate({ from, to });
    onDateRangeChange({ from, to });
  };

  const clearDateRange = () => {
    setDate({ from: undefined, to: undefined });
    onDateRangeChange({ from: undefined, to: undefined });
  };

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="border-gray-300 text-gray-600">
            <CalendarIcon size={16} className="mr-2" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, 'MMM dd, yyyy')} - {format(date.to, 'MMM dd, yyyy')}
                </>
              ) : (
                format(date.from, 'MMM dd, yyyy')
              )
            ) : (
              'Date Range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearDateRange} 
              className="text-sm border-gray-300"
            >
              <X size={14} className="mr-1" /> Clear
            </Button>
            <Button
              size="sm"
              className="bg-bcs-green hover:bg-bcs-green/90 text-sm"
            >
              Apply Range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;

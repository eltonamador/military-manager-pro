import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parse, addDays } from "date-fns";

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DateFilter = ({ selectedDate, onDateChange }: DateFilterProps) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = event.target.value;
    
    if (!inputDate) {
      onDateChange(undefined);
      return;
    }

    try {
      // Parse the input date string to a Date object
      const parsedDate = parse(inputDate, 'yyyy-MM-dd', new Date());
      // Set time to noon to avoid timezone issues
      parsedDate.setHours(12, 0, 0, 0);
      onDateChange(parsedDate);
    } catch (error) {
      console.error('Error parsing date:', error);
      onDateChange(undefined);
    }
  };

  // Format the date for display without any adjustments
  const displayDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="date-input" className="font-semibold text-gray-900">
          Data
        </Label>
        <Input
          id="date-input"
          type="date"
          value={displayDate}
          onChange={handleDateChange}
          className="w-full"
        />
      </div>
    </Card>
  );
};
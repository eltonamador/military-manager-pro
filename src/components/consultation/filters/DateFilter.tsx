import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { startOfDay } from "date-fns";

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export const DateFilter = ({ selectedDate, onDateChange }: DateFilterProps) => {
  const handleDateChange = (date: Date | undefined) => {
    // Ensure we're working with the start of the day to avoid timezone issues
    const normalizedDate = date ? startOfDay(date) : undefined;
    onDateChange(normalizedDate);
  };

  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Data</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateChange}
        className="border rounded-md w-full"
        locale={ptBR}
        classNames={{
          head_cell: "text-red-600 font-medium",
          day_selected: "bg-red-600 hover:bg-red-600",
          day_today: "bg-red-100 text-red-900",
        }}
      />
    </Card>
  );
};
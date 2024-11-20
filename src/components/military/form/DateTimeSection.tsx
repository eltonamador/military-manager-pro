import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface DateTimeSectionProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export const DateTimeSection = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimeSectionProps) => {
  // Set current time when component mounts
  useEffect(() => {
    if (!selectedTime) {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      onTimeChange(currentTime);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Data do Serviço</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="time">Horário da Inclusão</Label>
        <Input
          type="time"
          id="time"
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
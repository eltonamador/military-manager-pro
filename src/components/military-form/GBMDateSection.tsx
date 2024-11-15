import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface GBMDateSectionProps {
  selectedGBM: string;
  selectedDate: Date | undefined;
  gbmOptions: string[];
  onGBMChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  hasExistingMilitary: boolean;
}

export const GBMDateSection = ({
  selectedGBM,
  selectedDate,
  gbmOptions,
  onGBMChange,
  onDateChange,
  hasExistingMilitary,
}: GBMDateSectionProps) => {
  if (hasExistingMilitary) {
    return (
      <div className="text-center font-medium text-gray-700 bg-gray-100 py-2 rounded-md">
        {selectedGBM} - Dia: {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="gbm">GBM</Label>
        <Select onValueChange={onGBMChange} value={selectedGBM}>
          <SelectTrigger id="gbm">
            <SelectValue placeholder="Selecione o GBM" />
          </SelectTrigger>
          <SelectContent>
            {gbmOptions.map((gbm) => (
              <SelectItem key={gbm} value={gbm}>
                {gbm}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
    </div>
  );
};
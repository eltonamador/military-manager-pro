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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VTRSelect } from "@/components/vehicle/form/VTRSelect";

interface MilitaryFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date;
  shiftDuration?: string;
  gbmOptions: string[];
  vtrOptions: string[];
  militaryOptions: string[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onShiftDurationChange?: (value: string) => void;
  onAddMilitary: (alterations?: string) => void;
}

const MilitaryForm = ({
  selectedGBM,
  selectedVTR,
  selectedMilitary,
  militaryFunction,
  selectedDate,
  shiftDuration,
  gbmOptions,
  militaryOptions,
  onGBMChange,
  onVTRChange,
  onMilitaryChange,
  onFunctionChange,
  onDateChange,
  onShiftDurationChange,
  onAddMilitary,
}: MilitaryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onSelect={(date) => date && onDateChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <VTRSelect selectedVTR={selectedVTR} onVTRChange={onVTRChange} />

      <div>
        <Label htmlFor="military">Nome do Militar</Label>
        <Select onValueChange={onMilitaryChange} value={selectedMilitary}>
          <SelectTrigger id="military">
            <SelectValue placeholder="Selecione o Militar" />
          </SelectTrigger>
          <SelectContent>
            {militaryOptions.map((military) => (
              <SelectItem key={military} value={military}>
                {military}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="function">Função</Label>
        <Select onValueChange={onFunctionChange} value={militaryFunction}>
          <SelectTrigger id="function">
            <SelectValue placeholder="Selecione a Função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Comandante">Comandante</SelectItem>
            <SelectItem value="Motorista">Motorista</SelectItem>
            <SelectItem value="Chefe">Chefe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {onShiftDurationChange && (
        <div>
          <Label htmlFor="shiftDuration">Duração do Turno</Label>
          <Select onValueChange={onShiftDurationChange} value={shiftDuration}>
            <SelectTrigger id="shiftDuration">
              <SelectValue placeholder="Selecione a Duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24h</SelectItem>
              <SelectItem value="12">12h</SelectItem>
              <SelectItem value="6">6h</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        onClick={() => onAddMilitary()} 
        className="w-full"
        disabled={!selectedGBM || !selectedVTR || !selectedMilitary || !militaryFunction || !selectedDate}
      >
        Adicionar Militar
      </Button>
    </div>
  );
};

export default MilitaryForm;
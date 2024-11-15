import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface MilitaryFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date | undefined;
  shiftDuration: string;
  gbmOptions: string[];
  vtrOptions: Record<string, string[]>;
  militaryOptions: Record<string, string[]>;
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onShiftDurationChange: (value: string) => void;
  onAddMilitary: () => void;
}

const militaryFunctionOptions = [
  "Condutor",
  "Adjunto do Oficial",
  "Resgateiro",
  "Cmdt de GU",
  "Cmdt de 1º linha",
  "ajudante de 1º linha",
  "Cmdt de 2º linha",
  "ajudante de 2º linha"
];

const shiftDurationOptions = ["6", "8", "12", "24"];

const MilitaryForm = ({
  selectedGBM,
  selectedVTR,
  selectedMilitary,
  militaryFunction,
  selectedDate,
  shiftDuration,
  gbmOptions,
  vtrOptions,
  militaryOptions,
  onGBMChange,
  onVTRChange,
  onMilitaryChange,
  onFunctionChange,
  onDateChange,
  onShiftDurationChange,
  onAddMilitary,
}: MilitaryFormProps) => {
  const hasExistingMilitary = selectedGBM !== "" && selectedDate !== undefined;

  return (
    <div className="space-y-6">
      {!hasExistingMilitary ? (
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
      ) : (
        <div className="text-center font-medium text-gray-700 bg-gray-100 py-2 rounded-md">
          {selectedGBM} - Dia: {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="vtr">VTR</Label>
          <Select onValueChange={onVTRChange} value={selectedVTR} disabled={!selectedGBM}>
            <SelectTrigger id="vtr">
              <SelectValue placeholder="Selecione a VTR" />
            </SelectTrigger>
            <SelectContent>
              {selectedGBM &&
                vtrOptions[selectedGBM].map((vtr) => (
                  <SelectItem key={vtr} value={vtr}>
                    {vtr}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="military">Nome do Militar</Label>
          <Select onValueChange={onMilitaryChange} value={selectedMilitary} disabled={!selectedGBM}>
            <SelectTrigger id="military">
              <SelectValue placeholder="Selecione o Militar" />
            </SelectTrigger>
            <SelectContent>
              {selectedGBM &&
                militaryOptions[selectedGBM].map((military) => (
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
              {militaryFunctionOptions.map((func) => (
                <SelectItem key={func} value={func}>
                  {func}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="shiftDuration">Jornada</Label>
          <Select onValueChange={onShiftDurationChange} value={shiftDuration}>
            <SelectTrigger id="shiftDuration">
              <SelectValue placeholder="Selecione a Jornada" />
            </SelectTrigger>
            <SelectContent>
              {shiftDurationOptions.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration} horas
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Button
            onClick={onAddMilitary}
            className="w-full bg-military-orange hover:bg-military-red transition-colors"
            disabled={!selectedMilitary || !militaryFunction || !selectedDate || !shiftDuration}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Militar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilitaryForm;
import { Button } from "@/components/ui/button";
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
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { VTRSelect } from "./form/VTRSelect";
import { StatusSelect } from "./form/StatusSelect";
import { DescriptionField } from "./form/DescriptionField";

interface VehicleFormProps {
  selectedVTR: string;
  selectedGBM: string;
  selectedDate: Date;
  selectedTime: string;
  status: string;
  description: string;
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddVehicle: () => void;
  editingIndex: number | null;
}

const gbmOptions = [
  "1º GBM",
  "2º GBM",
  "5º GBM",
  "GAPH",
  "GMAF",
  "MCPB"
];

const VehicleForm = ({
  selectedVTR,
  selectedGBM,
  selectedDate,
  selectedTime,
  status,
  description,
  onGBMChange,
  onVTRChange,
  onDateChange,
  onTimeChange,
  onStatusChange,
  onDescriptionChange,
  onAddVehicle,
  editingIndex,
}: VehicleFormProps) => {
  // Set current time when component mounts
  useEffect(() => {
    if (!selectedTime && typeof onTimeChange === 'function') {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      onTimeChange(currentTime);
    }
  }, [selectedTime, onTimeChange]);

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="gbm_vtr">GBM</Label>
          <Select onValueChange={onGBMChange} value={selectedGBM}>
            <SelectTrigger id="gbm_vtr">
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
          <Input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="hidden"
          />
        </div>
      </div>

      <VTRSelect selectedVTR={selectedVTR} onVTRChange={onVTRChange} />
      <StatusSelect status={status} onStatusChange={onStatusChange} />
      <DescriptionField description={description} onDescriptionChange={onDescriptionChange} />

      <Button
        onClick={onAddVehicle}
        className="w-full bg-military-orange hover:bg-military-red transition-colors"
        disabled={!selectedGBM || !selectedVTR || !status}
      >
        <Plus className="mr-2 h-4 w-4" />
        {editingIndex !== null ? "Atualizar VTR" : "Adicionar VTR"}
      </Button>
    </div>
  );
};

export default VehicleForm;
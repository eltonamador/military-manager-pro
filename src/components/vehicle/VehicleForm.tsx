import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleFormProps {
  selectedVTR: string;
  selectedGBM: string;
  selectedDate: Date;
  status: string;
  description: string;
  vtrOptions?: string[];
  gbmOptions?: string[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onStatusChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onAddVehicle: () => void;
  editingIndex: number | null;
}

const VehicleForm = ({
  selectedVTR,
  selectedGBM,
  selectedDate,
  status,
  description,
  vtrOptions = [],
  gbmOptions = [],
  onGBMChange,
  onVTRChange,
  onDateChange,
  onStatusChange,
  onDescriptionChange,
  onAddVehicle,
  editingIndex,
}: VehicleFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="gbm_vtr">GBM_vtr</Label>
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
        </div>
      </div>

      <div>
        <Label htmlFor="vtr">VTR</Label>
        <Select onValueChange={onVTRChange} value={selectedVTR}>
          <SelectTrigger id="vtr">
            <SelectValue placeholder="Selecione a VTR" />
          </SelectTrigger>
          <SelectContent>
            {vtrOptions.map((vtr) => (
              <SelectItem key={vtr} value={vtr}>
                {vtr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={onStatusChange} value={status}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operante">Operante</SelectItem>
            <SelectItem value="parcialmente">Parcialmente Operante</SelectItem>
            <SelectItem value="inoperante">Inoperante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descrição das Alterações</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva as alterações ou observações sobre a VTR"
          className="min-h-[100px]"
        />
      </div>

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
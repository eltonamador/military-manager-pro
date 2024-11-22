import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Military } from "@/types/military";
import MilitarySearch from "./MilitarySearch";
import { VTRSelect } from "./form/VTRSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilitaryContainerProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date;
  shiftDuration: string;
  gbmOptions: string[];
  militaryOptions: string[];
  militaryList: Military[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onShiftDurationChange: (value: string) => void;
  onAddMilitary: (alterations?: string) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onFinishOperation: () => void;
}

const MilitaryContainer = ({
  selectedGBM,
  selectedVTR,
  selectedMilitary,
  militaryFunction,
  selectedDate,
  shiftDuration,
  gbmOptions,
  militaryOptions,
  militaryList,
  onGBMChange,
  onVTRChange,
  onMilitaryChange,
  onFunctionChange,
  onDateChange,
  onShiftDurationChange,
  onAddMilitary,
  onEdit,
  onDelete,
  onFinishOperation,
}: MilitaryContainerProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <Label htmlFor="vtr">VTR</Label>
          <VTRSelect selectedVTR={selectedVTR} onVTRChange={onVTRChange} />
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
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
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
          <Label htmlFor="shift_duration">Duração do Serviço</Label>
          <Select onValueChange={onShiftDurationChange} value={shiftDuration}>
            <SelectTrigger id="shift_duration">
              <SelectValue placeholder="Selecione a duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12h</SelectItem>
              <SelectItem value="24">24h</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="military">Militar</Label>
          <MilitarySearch
            selectedMilitary={selectedMilitary}
            onMilitaryChange={onMilitaryChange}
          />
        </div>

        <div>
          <Label htmlFor="function">Função</Label>
          <Select onValueChange={onFunctionChange} value={militaryFunction}>
            <SelectTrigger id="function">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comandante">Comandante</SelectItem>
              <SelectItem value="Motorista">Motorista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button onClick={() => onAddMilitary()} className="w-full sm:w-auto">
          Adicionar Militar
        </Button>
      </div>

      {militaryList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Militares Adicionados</h3>
          <div className="space-y-4">
            {militaryList.map((military, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{military.name}</p>
                  <p className="text-sm text-gray-600">
                    {military.function} - {military.vtr}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(index)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(index)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              onClick={onFinishOperation}
              className="w-full"
              variant="default"
            >
              Finalizar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilitaryContainer;
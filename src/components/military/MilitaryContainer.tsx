import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Military } from "@/types/military";
import MilitaryTable from "@/components/MilitaryTable";
import { useVTRs } from "@/hooks/useVTRs";

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
  onAddMilitary: () => void;
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
  const { data: vtrOptions, isLoading } = useVTRs();

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-6">
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
          <Select onValueChange={onVTRChange} value={selectedVTR}>
            <SelectTrigger id="vtr">
              <SelectValue placeholder={isLoading ? "Carregando VTRs..." : "Selecione a VTR"} />
            </SelectTrigger>
            <SelectContent>
              {vtrOptions?.map((vtr) => (
                <SelectItem key={vtr} value={vtr}>
                  {vtr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="military">Militar</Label>
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
          <Input
            id="function"
            value={militaryFunction}
            onChange={(e) => onFunctionChange(e.target.value)}
            placeholder="Digite a função"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          <Label htmlFor="shiftDuration">Duração do Serviço</Label>
          <Select onValueChange={onShiftDurationChange} value={shiftDuration}>
            <SelectTrigger id="shiftDuration">
              <SelectValue placeholder="Selecione a duração" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24h</SelectItem>
              <SelectItem value="12">12h</SelectItem>
              <SelectItem value="6">6h</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={onAddMilitary}
        className="w-full bg-military-orange hover:bg-military-red transition-colors mb-6"
        disabled={!selectedGBM || !selectedVTR || !selectedMilitary || !militaryFunction}
      >
        Adicionar Militar
      </Button>

      <div className="overflow-x-auto">
        <MilitaryTable
          militaryList={militaryList}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <Button
        onClick={onFinishOperation}
        className="w-full mt-6 bg-military-red hover:bg-military-orange transition-colors"
        disabled={militaryList.length === 0}
      >
        Finalizar Militares
      </Button>
    </main>
  );
};

export default MilitaryContainer;
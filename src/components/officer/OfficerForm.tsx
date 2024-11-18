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
import { Button } from "@/components/ui/button";
import OfficerSearch from "./OfficerSearch";

interface OfficerFormProps {
  selectedFunction: string;
  selectedOfficer: string;
  selectedDate: Date;
  selectedVTR: string;
  officerOptions: string[];
  vtrOptions: string[];
  isLoadingOfficers: boolean;
  onFunctionChange: (value: string) => void;
  onOfficerChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onVTRChange: (value: string) => void;
}

const OfficerForm = ({
  selectedFunction,
  selectedOfficer,
  selectedDate,
  selectedVTR,
  officerOptions,
  vtrOptions,
  isLoadingOfficers,
  onFunctionChange,
  onOfficerChange,
  onDateChange,
  onVTRChange,
}: OfficerFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="function">Função</Label>
          <Select onValueChange={onFunctionChange} value={selectedFunction}>
            <SelectTrigger id="function">
              <SelectValue placeholder="Selecione a Função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Superior de dia">Superior de dia</SelectItem>
              <SelectItem value="Oficial de Área 1">Oficial de Área 1</SelectItem>
              <SelectItem value="Oficial de Área 2">Oficial de Área 2</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OfficerSearch
          selectedOfficer={selectedOfficer}
          officerOptions={officerOptions}
          isLoading={isLoadingOfficers}
          onOfficerChange={onOfficerChange}
        />

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
      </div>
    </div>
  );
};

export default OfficerForm;
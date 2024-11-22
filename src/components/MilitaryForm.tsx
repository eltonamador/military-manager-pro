import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MilitarySearch from "./military/MilitarySearch";
import { useState } from "react";
import { GBMSection } from "./military/form/GBMSection";
import { DateTimeSection } from "./military/form/DateTimeSection";

interface MilitaryFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date | undefined;
  shiftDuration: string;
  gbmOptions: string[];
  vtrOptions: string[];
  militaryOptions: string[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onShiftDurationChange: (value: string) => void;
  onAddMilitary: (alterations?: string, time?: string) => void;
}

const militaryFunctionOptions = [
  "Condutor",
  "Condutor/Operador",
  "Adjunto do Oficial",
  "Resgateiro 1",
  "Resgateiro 2",
  "Socorrista",
  "Cmdt de GU",
  "Cmdt de GU/Condutor",
  "Cmdt de 1º linha",
  "ajudante de 1º linha",
  "Cmdt de 2º linha",
  "ajudante de 2º linha",
  "GV 1",
  "GV 2",
  "Piloto"
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
  onGBMChange,
  onVTRChange,
  onMilitaryChange,
  onFunctionChange,
  onDateChange,
  onShiftDurationChange,
  onAddMilitary,
}: MilitaryFormProps) => {
  const [hasAlterations, setHasAlterations] = useState(false);
  const [alterations, setAlterations] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const isAdjuntoDoOficial = militaryFunction === "Adjunto do Oficial";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GBMSection
          selectedGBM={selectedGBM}
          gbmOptions={gbmOptions}
          onGBMChange={onGBMChange}
        />
        <DateTimeSection
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateChange={onDateChange}
          onTimeChange={setSelectedTime}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isAdjuntoDoOficial && (
          <div>
            <Label htmlFor="vtr">VTR</Label>
            <Select onValueChange={onVTRChange} value={selectedVTR}>
              <SelectTrigger id="vtr">
                <SelectValue placeholder="Selecione a VTR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sem VTR">Sem VTR</SelectItem>
                {vtrOptions.map((vtr) => (
                  <SelectItem key={vtr} value={vtr}>
                    {vtr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <MilitarySearch 
          selectedMilitary={selectedMilitary}
          onMilitaryChange={onMilitaryChange}
        />

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
          <Select onValueChange={onShiftDurationChange} value={shiftDuration || "24"}>
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

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="alterations"
            checked={hasAlterations}
            onCheckedChange={(checked) => {
              setHasAlterations(checked === true);
              if (!checked) setAlterations("");
            }}
          />
          <Label htmlFor="alterations">Alterações</Label>
        </div>

        {hasAlterations && (
          <div className="md:col-span-2">
            <Label htmlFor="alterationsText">Descrição das Alterações</Label>
            <Textarea
              id="alterationsText"
              value={alterations}
              onChange={(e) => setAlterations(e.target.value)}
              placeholder="Descreva as alterações"
              className="min-h-[100px]"
            />
          </div>
        )}

        <div className="md:col-span-2">
          <Button
            onClick={() => onAddMilitary(alterations, selectedTime)}
            className="w-full bg-military-orange hover:bg-military-red transition-colors"
            disabled={
              !selectedMilitary || 
              !militaryFunction || 
              !selectedDate || 
              !shiftDuration || 
              !selectedTime || 
              (!isAdjuntoDoOficial && !selectedVTR)
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar Militar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilitaryForm;
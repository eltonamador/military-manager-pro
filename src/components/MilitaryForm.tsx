import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GBMDateSection } from "./military-form/GBMDateSection";
import { MilitarySearch } from "./military-form/MilitarySearch";
import { SelectionSection } from "./military-form/SelectionSection";

interface MilitaryFormProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date | undefined;
  shiftDuration: string;
  gbmOptions: string[];
  vtrOptions: Record<string, string[]>;
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onShiftDurationChange: (value: string) => void;
  onAddMilitary: () => void;
}

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
  const hasExistingMilitary = selectedGBM !== "" && selectedDate !== undefined;

  return (
    <div className="space-y-6">
      <GBMDateSection
        selectedGBM={selectedGBM}
        selectedDate={selectedDate}
        gbmOptions={gbmOptions}
        onGBMChange={onGBMChange}
        onDateChange={onDateChange}
        hasExistingMilitary={hasExistingMilitary}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectionSection
          selectedVTR={selectedVTR}
          militaryFunction={militaryFunction}
          shiftDuration={shiftDuration}
          vtrOptions={vtrOptions}
          selectedGBM={selectedGBM}
          onVTRChange={onVTRChange}
          onFunctionChange={onFunctionChange}
          onShiftDurationChange={onShiftDurationChange}
        />
        <MilitarySearch
          selectedMilitary={selectedMilitary}
          onMilitaryChange={onMilitaryChange}
        />
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
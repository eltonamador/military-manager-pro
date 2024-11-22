import { GBMFilter } from "./filters/GBMFilter";
import { VTRFilter } from "./filters/VTRFilter";
import { DateFilter } from "./filters/DateFilter";
import { OfficerFilter } from "./filters/OfficerFilter";

interface ConsultationFiltersProps {
  selectedDate: Date | undefined;
  selectedMilitaryGBMs: string[];
  selectedVehicleGBMs: string[];
  selectedVTRs: string[];
  selectedOfficerTypes: string[];
  onDateChange: (date: Date | undefined) => void;
  onMilitaryGBMChange: (gbm: string, checked: boolean) => void;
  onVehicleGBMChange: (gbm: string, checked: boolean) => void;
  onVTRChange: (vtr: string, checked: boolean) => void;
  onOfficerTypeChange: (types: string[]) => void;
}

const gbmOptions = [
  "1º GBM",
  "2º GBM",
  "5º GBM",
  "GAPH",
  "GMAF",
  "MCPB"
];

const vtrOptions = [
  { prefix: "ABT", description: "ABT" },
  { prefix: "ABS", description: "ABS" },
  { prefix: "USB", description: "USB" },
  { prefix: "AEM", description: "AEM" },
  { prefix: "ACA", description: "ACA" },
  { prefix: "LANCHA", description: "LANCHA" }
];

export const ConsultationFilters = ({
  selectedDate,
  selectedMilitaryGBMs,
  selectedVehicleGBMs,
  selectedVTRs,
  selectedOfficerTypes,
  onDateChange,
  onMilitaryGBMChange,
  onVehicleGBMChange,
  onVTRChange,
  onOfficerTypeChange,
}: ConsultationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      <GBMFilter
        title="Militares"
        selectedGBMs={selectedMilitaryGBMs}
        onGBMChange={onMilitaryGBMChange}
        gbmOptions={gbmOptions}
      />
      
      <GBMFilter
        title="Viaturas"
        selectedGBMs={selectedVehicleGBMs}
        onGBMChange={onVehicleGBMChange}
        gbmOptions={gbmOptions}
      />

      <VTRFilter
        selectedVTRs={selectedVTRs}
        onVTRChange={onVTRChange}
        vtrOptions={vtrOptions}
      />

      <OfficerFilter
        selectedOfficerTypes={selectedOfficerTypes}
        onOfficerTypeChange={onOfficerTypeChange}
      />

      <DateFilter
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
    </div>
  );
};
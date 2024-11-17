import { GBMFilter } from "./filters/GBMFilter";
import { VTRFilter } from "./filters/VTRFilter";
import { DateFilter } from "./filters/DateFilter";
import { OfficerFilter } from "./filters/OfficerFilter";

interface ConsultationFiltersProps {
  selectedDate: Date | undefined;
  selectedMilitaryGBMs: string[];
  selectedVehicleGBMs: string[];
  selectedVTRs: string[];
  selectedOfficerType: string | null;
  onDateChange: (date: Date | undefined) => void;
  onMilitaryGBMChange: (gbm: string, checked: boolean) => void;
  onVehicleGBMChange: (gbm: string, checked: boolean) => void;
  onVTRChange: (vtr: string, checked: boolean) => void;
  onOfficerTypeChange: (type: string | null) => void;
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
  { prefix: "ABT", description: "Auto Bomba Tanque" },
  { prefix: "ABS", description: "Auto Busca e Salvamento" },
  { prefix: "USB", description: "Unidade de Suporte Básico" },
  { prefix: "AEM", description: "Auto Escada Mecânica" },
  { prefix: "ACA", description: "Auto Comando de Área" }
];

export const ConsultationFilters = ({
  selectedDate,
  selectedMilitaryGBMs,
  selectedVehicleGBMs,
  selectedVTRs,
  selectedOfficerType,
  onDateChange,
  onMilitaryGBMChange,
  onVehicleGBMChange,
  onVTRChange,
  onOfficerTypeChange,
}: ConsultationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      <GBMFilter
        title="GBM Militares"
        selectedGBMs={selectedMilitaryGBMs}
        onGBMChange={onMilitaryGBMChange}
        gbmOptions={gbmOptions}
      />
      
      <GBMFilter
        title="GBM Viaturas"
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
        selectedOfficerType={selectedOfficerType}
        onOfficerTypeChange={onOfficerTypeChange}
      />

      <DateFilter
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
    </div>
  );
};
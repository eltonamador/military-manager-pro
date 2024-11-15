import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface ConsultationFiltersProps {
  selectedDate: Date | undefined;
  selectedMilitaryGBMs: string[];
  selectedVehicleGBMs: string[];
  selectedVTRs: string[];
  onDateChange: (date: Date | undefined) => void;
  onMilitaryGBMChange: (gbm: string, checked: boolean) => void;
  onVehicleGBMChange: (gbm: string, checked: boolean) => void;
  onVTRChange: (vtr: string, checked: boolean) => void;
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
  { prefix: "ACA", description: "ACA" }
];

export const ConsultationFilters = ({
  selectedDate,
  selectedMilitaryGBMs,
  selectedVehicleGBMs,
  selectedVTRs,
  onDateChange,
  onMilitaryGBMChange,
  onVehicleGBMChange,
  onVTRChange,
}: ConsultationFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="space-y-4">
        <Label>GBM Militares</Label>
        <div className="grid grid-cols-2 gap-4">
          {gbmOptions.map((gbm) => (
            <div key={gbm} className="flex items-center space-x-2">
              <Checkbox
                id={`military-${gbm}`}
                checked={selectedMilitaryGBMs.includes(gbm)}
                onCheckedChange={(checked) => onMilitaryGBMChange(gbm, !!checked)}
              />
              <Label htmlFor={`military-${gbm}`}>{gbm}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>GBM Viaturas</Label>
        <div className="grid grid-cols-2 gap-4">
          {gbmOptions.map((gbm) => (
            <div key={gbm} className="flex items-center space-x-2">
              <Checkbox
                id={`vehicle-${gbm}`}
                checked={selectedVehicleGBMs.includes(gbm)}
                onCheckedChange={(checked) => onVehicleGBMChange(gbm, !!checked)}
              />
              <Label htmlFor={`vehicle-${gbm}`}>{gbm}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Tipo de VTR</Label>
        <div className="grid grid-cols-1 gap-4">
          {vtrOptions.map(({ prefix, description }) => (
            <div key={prefix} className="flex items-center space-x-2">
              <Checkbox
                id={`vtr-${prefix}`}
                checked={selectedVTRs.includes(prefix)}
                onCheckedChange={(checked) => onVTRChange(prefix, !!checked)}
              />
              <Label htmlFor={`vtr-${prefix}`}>{description}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Data</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="border rounded-md"
          locale={ptBR}
        />
      </div>
    </div>
  );
};
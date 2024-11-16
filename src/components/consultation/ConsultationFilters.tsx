import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";

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
  onDateChange,
  onMilitaryGBMChange,
  onVehicleGBMChange,
  onVTRChange,
}: ConsultationFiltersProps) => {
  const handleSelectAllMilitary = (checked: boolean) => {
    gbmOptions.forEach(gbm => onMilitaryGBMChange(gbm, checked));
  };

  const handleSelectAllVehicles = (checked: boolean) => {
    gbmOptions.forEach(gbm => onVehicleGBMChange(gbm, checked));
  };

  const handleSelectAllVTRs = (checked: boolean) => {
    vtrOptions.forEach(({ prefix }) => onVTRChange(prefix, checked));
  };

  const allMilitarySelected = gbmOptions.every(gbm => selectedMilitaryGBMs.includes(gbm));
  const allVehiclesSelected = gbmOptions.every(gbm => selectedVehicleGBMs.includes(gbm));
  const allVTRsSelected = vtrOptions.every(({ prefix }) => selectedVTRs.includes(prefix));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Card className="p-4 border-red-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">GBM Militares</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-military"
              checked={allMilitarySelected}
              onCheckedChange={handleSelectAllMilitary}
              className="border-red-200 text-red-600"
            />
            <Label 
              htmlFor="select-all-military"
              className="text-sm text-gray-700"
            >
              Selecionar Todos
            </Label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {gbmOptions.map((gbm) => (
            <div key={gbm} className="flex items-center space-x-2">
              <Checkbox
                id={`military-${gbm}`}
                checked={selectedMilitaryGBMs.includes(gbm)}
                onCheckedChange={(checked) => onMilitaryGBMChange(gbm, !!checked)}
                className="border-red-200 text-red-600"
              />
              <Label 
                htmlFor={`military-${gbm}`}
                className="text-sm text-gray-700"
              >
                {gbm}
              </Label>
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="p-4 border-red-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">GBM Viaturas</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-vehicles"
              checked={allVehiclesSelected}
              onCheckedChange={handleSelectAllVehicles}
              className="border-red-200 text-red-600"
            />
            <Label 
              htmlFor="select-all-vehicles"
              className="text-sm text-gray-700"
            >
              Selecionar Todos
            </Label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {gbmOptions.map((gbm) => (
            <div key={gbm} className="flex items-center space-x-2">
              <Checkbox
                id={`vehicle-${gbm}`}
                checked={selectedVehicleGBMs.includes(gbm)}
                onCheckedChange={(checked) => onVehicleGBMChange(gbm, !!checked)}
                className="border-red-200 text-red-600"
              />
              <Label 
                htmlFor={`vehicle-${gbm}`}
                className="text-sm text-gray-700"
              >
                {gbm}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 border-red-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Tipo de VTR</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-vtrs"
              checked={allVTRsSelected}
              onCheckedChange={handleSelectAllVTRs}
              className="border-red-200 text-red-600"
            />
            <Label 
              htmlFor="select-all-vtrs"
              className="text-sm text-gray-700"
            >
              Selecionar Todos
            </Label>
          </div>
        </div>
        <div className="space-y-3">
          {vtrOptions.map(({ prefix, description }) => (
            <div key={prefix} className="flex items-center space-x-2">
              <Checkbox
                id={`vtr-${prefix}`}
                checked={selectedVTRs.includes(prefix)}
                onCheckedChange={(checked) => onVTRChange(prefix, !!checked)}
                className="border-red-200 text-red-600"
              />
              <Label 
                htmlFor={`vtr-${prefix}`}
                className="text-sm text-gray-700"
              >
                <span className="font-medium">{prefix}</span> - {description}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 border-red-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Data</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          className="border rounded-md"
          locale={ptBR}
          classNames={{
            head_cell: "text-red-600 font-medium",
            day_selected: "bg-red-600 hover:bg-red-600",
            day_today: "bg-red-100 text-red-900",
          }}
        />
      </Card>
    </div>
  );
};
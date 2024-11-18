import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsultationFilters } from "./ConsultationFilters";

interface ConsultationCardProps {
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

export const ConsultationCard = ({
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
}: ConsultationCardProps) => {
  return (
    <Card className="border-2 border-red-600/10 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-red-600 to-red-700">
        <CardTitle className="text-white flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filtros de Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <ConsultationFilters
          selectedDate={selectedDate}
          selectedMilitaryGBMs={selectedMilitaryGBMs}
          selectedVehicleGBMs={selectedVehicleGBMs}
          selectedVTRs={selectedVTRs}
          selectedOfficerTypes={selectedOfficerTypes}
          onDateChange={onDateChange}
          onMilitaryGBMChange={onMilitaryGBMChange}
          onVehicleGBMChange={onVehicleGBMChange}
          onVTRChange={onVTRChange}
          onOfficerTypeChange={onOfficerTypeChange}
        />
      </CardContent>
    </Card>
  );
};
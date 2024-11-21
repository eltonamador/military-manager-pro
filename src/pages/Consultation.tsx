import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ConsultationHeader } from "@/components/consultation/ConsultationHeader";
import { ConsultationCard } from "@/components/consultation/ConsultationCard";
import ConsultationResults from "@/components/consultation/ConsultationResults";
import { useConsultationData } from "@/hooks/useConsultationData";

const Consultation = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMilitaryGBMs, setSelectedMilitaryGBMs] = useState<string[]>([]);
  const [selectedVehicleGBMs, setSelectedVehicleGBMs] = useState<string[]>([]);
  const [selectedVTRs, setSelectedVTRs] = useState<string[]>([]);
  const [selectedOfficerTypes, setSelectedOfficerTypes] = useState<string[]>([]);

  const { data: combinedData, isLoading } = useConsultationData(
    selectedMilitaryGBMs,
    selectedVehicleGBMs,
    selectedVTRs,
    selectedOfficerTypes,
    selectedDate
  );

  const handleMilitaryGBMChange = (gbm: string, checked: boolean) => {
    setSelectedMilitaryGBMs(prev => {
      if (checked && !prev.includes(gbm)) {
        return [...prev, gbm];
      }
      return prev.filter(g => g !== gbm);
    });
  };

  const handleVehicleGBMChange = (gbm: string, checked: boolean) => {
    setSelectedVehicleGBMs(prev => {
      if (checked && !prev.includes(gbm)) {
        return [...prev, gbm];
      }
      return prev.filter(g => g !== gbm);
    });
  };

  const handleVTRChange = (vtr: string, checked: boolean) => {
    setSelectedVTRs(prev => {
      if (checked && !prev.includes(vtr)) {
        return [...prev, vtr];
      }
      return prev.filter(v => v !== vtr);
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date || new Date());
  };

  const handleOfficerTypeChange = (types: string[]) => {
    setSelectedOfficerTypes(types);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <ConsultationHeader />
        
        <ConsultationCard
          selectedDate={selectedDate}
          selectedMilitaryGBMs={selectedMilitaryGBMs}
          selectedVehicleGBMs={selectedVehicleGBMs}
          selectedVTRs={selectedVTRs}
          selectedOfficerTypes={selectedOfficerTypes}
          onDateChange={handleDateChange}
          onMilitaryGBMChange={handleMilitaryGBMChange}
          onVehicleGBMChange={handleVehicleGBMChange}
          onVTRChange={handleVTRChange}
          onOfficerTypeChange={handleOfficerTypeChange}
        />

        <Separator className="my-4 sm:my-6" />

        <div className="rounded-lg bg-white shadow-lg p-3 sm:p-6 border border-gray-200 overflow-x-auto">
          <ConsultationResults 
            isLoading={isLoading}
            combinedData={combinedData}
            selectedDate={selectedDate}
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg px-8 py-3"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
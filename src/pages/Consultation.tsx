import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { ConsultationFilters } from "@/components/consultation/ConsultationFilters";
import { Separator } from "@/components/ui/separator";
import ConsultationResults from "@/components/consultation/ConsultationResults";
import { useNavigate } from "react-router-dom";
import { useConsultationData } from "@/hooks/useConsultationData";

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMilitaryGBMs, setSelectedMilitaryGBMs] = useState<string[]>([]);
  const [selectedVehicleGBMs, setSelectedVehicleGBMs] = useState<string[]>([]);
  const [selectedVTRs, setSelectedVTRs] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { isLoading, combinedData } = useConsultationData(
    selectedMilitaryGBMs,
    selectedVehicleGBMs,
    selectedDate,
    selectedVTRs
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Consulta</h1>
          <p className="text-gray-600">Corpo de Bombeiros Militar do Amapá/ COOP</p>
        </div>

        <Card className="border-2 border-red-600/10 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-red-600 to-red-700">
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Consulta
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ConsultationFilters
              selectedDate={selectedDate}
              selectedMilitaryGBMs={selectedMilitaryGBMs}
              selectedVehicleGBMs={selectedVehicleGBMs}
              selectedVTRs={selectedVTRs}
              onDateChange={setSelectedDate}
              onMilitaryGBMChange={handleMilitaryGBMChange}
              onVehicleGBMChange={handleVehicleGBMChange}
              onVTRChange={handleVTRChange}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <div className="rounded-lg bg-white shadow-lg p-6 border border-gray-200">
          <ConsultationResults 
            isLoading={isLoading}
            combinedData={combinedData}
          />
        </div>
      </div>
    </div>
  );
};

export default Consultation;
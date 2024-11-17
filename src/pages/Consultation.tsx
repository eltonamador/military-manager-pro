import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";
import { ConsultationFilters } from "@/components/consultation/ConsultationFilters";
import { Separator } from "@/components/ui/separator";
import ConsultationResults from "@/components/consultation/ConsultationResults";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Consultation = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMilitaryGBMs, setSelectedMilitaryGBMs] = useState<string[]>([]);
  const [selectedVehicleGBMs, setSelectedVehicleGBMs] = useState<string[]>([]);
  const [selectedVTRs, setSelectedVTRs] = useState<string[]>([]);
  const [selectedOfficerType, setSelectedOfficerType] = useState<string | null>(null);

  const formatDateForQuery = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
  };

  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedMilitaryGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);

      const promises = selectedMilitaryGBMs.map(async (gbm) => {
        const tableName = getMilitaryTableName(gbm);
        const query = supabase
          .from(tableName)
          .select("*")
          .eq('data', formattedDate);

        if (selectedVTRs.length > 0) {
          const vtrConditions = selectedVTRs.map(prefix => `viatura.ilike.${prefix}%`);
          query.or(vtrConditions.join(','));
        }

        const { data: queryData, error } = await query;
        
        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          throw error;
        }
        
        return queryData || [];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedMilitaryGBMs.length > 0,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedVehicleGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);

      const promises = selectedVehicleGBMs.map(async (gbm) => {
        const tableName = getVehicleTableName(gbm);
        const query = supabase
          .from(tableName)
          .select("*")
          .eq('data', formattedDate);

        if (selectedVTRs.length > 0) {
          const vtrConditions = selectedVTRs.map(prefix => `vtr.ilike.${prefix}%`);
          query.or(vtrConditions.join(','));
        }

        const { data: queryData, error } = await query;
        
        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          throw error;
        }
        
        return queryData || [];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedVehicleGBMs.length > 0,
  });

  const { data: officerData, isLoading: isOfficerLoading } = useQuery({
    queryKey: ["officer-service", selectedDate, selectedOfficerType],
    queryFn: async () => {
      if (!selectedDate || !selectedOfficerType) return [];

      const formattedDate = formatDateForQuery(selectedDate);
      
      const { data, error } = await supabase
        .from('servico_oficial')
        .select('*')
        .eq('data_serv_of', formattedDate)
        .eq('tipo', selectedOfficerType);

      if (error) {
        console.error('Error querying officer data:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!selectedDate && !!selectedOfficerType,
  });

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

  const formattedMilitaryData = militaryData?.map(item => ({
    name: item.nome_de_guerra || "",
    function: item.funcao || "",
    gbm: item.GBM || "",
    vtr: item.viatura || "",
    date: item.data ? new Date(item.data) : new Date(),
    shiftDuration: "24"
  })) || [];

  const formattedVehicleData = vehicleData?.map(item => ({
    name: item.vtr || "",
    function: item.status || "",
    gbm: item.gbm || "",
    vtr: item.alteracao || "",
    date: item.data ? new Date(item.data) : new Date(),
    shiftDuration: "-"
  })) || [];

  const formattedOfficerData = officerData?.map(item => ({
    name: item.nome_of_area || item.nome_of_sup || "",
    function: item.tipo || "",
    gbm: "-",
    vtr: "-",
    date: item.data_serv_of ? new Date(item.data_serv_of) : new Date(),
    shiftDuration: "24"
  })) || [];

  const isLoading = isMilitaryLoading || isVehicleLoading || isOfficerLoading;
  const combinedData = [...formattedMilitaryData, ...formattedVehicleData, ...formattedOfficerData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sistema de Consulta</h1>
          <p className="text-gray-600">Corpo de Bombeiros Militar do Amapá/ COOP</p>
        </div>

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
              selectedOfficerType={selectedOfficerType}
              onDateChange={setSelectedDate}
              onMilitaryGBMChange={handleMilitaryGBMChange}
              onVehicleGBMChange={handleVehicleGBMChange}
              onVTRChange={handleVTRChange}
              onOfficerTypeChange={setSelectedOfficerType}
            />
          </CardContent>
        </Card>

        <Separator className="my-6 sm:my-8" />

        <div className="rounded-lg bg-white shadow-lg p-3 sm:p-6 border border-gray-200 overflow-x-auto">
          <ConsultationResults 
            isLoading={isLoading}
            combinedData={combinedData}
          />
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            onClick={() => navigate("/login")}
            className="bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg px-8 py-3"
          >
            Finalizar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
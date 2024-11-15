import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MilitaryTable from "@/components/MilitaryTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Search } from "lucide-react";
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";
import { ConsultationFilters } from "@/components/consultation/ConsultationFilters";
import { Separator } from "@/components/ui/separator";

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMilitaryGBMs, setSelectedMilitaryGBMs] = useState<string[]>([]);
  const [selectedVehicleGBMs, setSelectedVehicleGBMs] = useState<string[]>([]);
  const [selectedVTRs, setSelectedVTRs] = useState<string[]>([]);

  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (selectedMilitaryGBMs.length === 0) return [];

      const promises = selectedMilitaryGBMs.map(async (gbm) => {
        const tableName = getMilitaryTableName(gbm);
        let query = supabase.from(tableName).select("*");
        
        if (selectedDate) {
          query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
        }

        if (selectedVTRs.length > 0) {
          query = query.or(
            selectedVTRs.map(prefix => `viatura.ilike.${prefix}%`).join(',')
          );
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: selectedMilitaryGBMs.length > 0,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (selectedVehicleGBMs.length === 0) return [];

      const promises = selectedVehicleGBMs.map(async (gbm) => {
        const tableName = getVehicleTableName(gbm);
        let query = supabase.from(tableName).select("*");
        
        if (selectedDate) {
          query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
        }

        if (selectedVTRs.length > 0) {
          query = query.or(
            selectedVTRs.map(prefix => `vtr.ilike.${prefix}%`).join(',')
          );
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: selectedVehicleGBMs.length > 0,
  });

  const formattedMilitaryData = militaryData?.map(item => ({
    name: item.nome_de_guerra || "",
    function: item.funcao || "",
    gbm: item.GBM || "",
    vtr: item.viatura || "",
    date: new Date(item.data),
    shiftDuration: "24"
  })) || [];

  const formattedVehicleData = vehicleData?.map(item => ({
    name: item.vtr || "",
    function: item.status || "",
    gbm: item.gbm || "",
    vtr: item.alteracao || "",
    date: new Date(item.data),
    shiftDuration: "-"
  })) || [];

  const handleMilitaryGBMChange = (gbm: string, checked: boolean) => {
    if (checked) {
      setSelectedMilitaryGBMs([...selectedMilitaryGBMs, gbm]);
    } else {
      setSelectedMilitaryGBMs(selectedMilitaryGBMs.filter(g => g !== gbm));
    }
  };

  const handleVehicleGBMChange = (gbm: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicleGBMs([...selectedVehicleGBMs, gbm]);
    } else {
      setSelectedVehicleGBMs(selectedVehicleGBMs.filter(g => g !== gbm));
    }
  };

  const handleVTRChange = (vtr: string, checked: boolean) => {
    if (checked) {
      setSelectedVTRs([...selectedVTRs, vtr]);
    } else {
      setSelectedVTRs(selectedVTRs.filter(v => v !== vtr));
    }
  };

  const isLoading = isMilitaryLoading || isVehicleLoading;
  const combinedData = [...formattedMilitaryData, ...formattedVehicleData];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Consulta</h1>
          <p className="text-gray-600">Corpo de Bombeiros Militar</p>
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
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="space-y-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
                <p className="text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Resultados da Consulta
              </h2>
              <MilitaryTable 
                militaryList={combinedData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consultation;
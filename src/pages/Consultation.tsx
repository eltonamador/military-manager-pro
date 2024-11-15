import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import MilitaryTable from "@/components/MilitaryTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMilitaryGBMs, setSelectedMilitaryGBMs] = useState<string[]>([]);
  const [selectedVehicleGBMs, setSelectedVehicleGBMs] = useState<string[]>([]);

  const gbmOptions = [
    "1º GBM",
    "2º GBM",
    "5º GBM",
    "GAPH",
    "GMAF",
    "MCPB"
  ];

  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate],
    queryFn: async () => {
      if (selectedMilitaryGBMs.length === 0) return [];

      const promises = selectedMilitaryGBMs.map(async (gbm) => {
        const tableName = getMilitaryTableName(gbm);
        let query = supabase.from(tableName).select("*");
        
        if (selectedDate) {
          query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
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
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate],
    queryFn: async () => {
      if (selectedVehicleGBMs.length === 0) return [];

      const promises = selectedVehicleGBMs.map(async (gbm) => {
        const tableName = getVehicleTableName(gbm);
        let query = supabase.from(tableName).select("*");
        
        if (selectedDate) {
          query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
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

  const isLoading = isMilitaryLoading || isVehicleLoading;
  const combinedData = [...formattedMilitaryData, ...formattedVehicleData];

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Consulta de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Label>GBM Militares</Label>
              <div className="grid grid-cols-2 gap-4">
                {gbmOptions.map((gbm) => (
                  <div key={gbm} className="flex items-center space-x-2">
                    <Checkbox
                      id={`military-${gbm}`}
                      checked={selectedMilitaryGBMs.includes(gbm)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMilitaryGBMs([...selectedMilitaryGBMs, gbm]);
                        } else {
                          setSelectedMilitaryGBMs(selectedMilitaryGBMs.filter(g => g !== gbm));
                        }
                      }}
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
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedVehicleGBMs([...selectedVehicleGBMs, gbm]);
                        } else {
                          setSelectedVehicleGBMs(selectedVehicleGBMs.filter(g => g !== gbm));
                        }
                      }}
                    />
                    <Label htmlFor={`vehicle-${gbm}`}>{gbm}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Data</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md"
                locale={ptBR}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <MilitaryTable 
          militaryList={combinedData}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

export default Consultation;
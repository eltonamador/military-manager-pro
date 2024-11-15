import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import MilitaryTable from "@/components/MilitaryTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedMilitaryGBM, setSelectedMilitaryGBM] = useState<string>();
  const [selectedVehicleGBM, setSelectedVehicleGBM] = useState<string>();

  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBM, selectedDate],
    queryFn: async () => {
      if (!selectedMilitaryGBM) return [];

      const tableName = getMilitaryTableName(selectedMilitaryGBM);
      let query = supabase.from(tableName).select("*");
      
      if (selectedDate) {
        query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedMilitaryGBM,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBM, selectedDate],
    queryFn: async () => {
      if (!selectedVehicleGBM) return [];

      const tableName = getVehicleTableName(selectedVehicleGBM);
      let query = supabase.from(tableName).select("*");
      
      if (selectedDate) {
        query = query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedVehicleGBM,
  });

  const gbmOptions = [
    "1º GBM",
    "2º GBM",
    "5º GBM",
    "GAPH",
    "GMAF",
    "MCPB"
  ];

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
            <div>
              <Label>GBM Militares</Label>
              <Select value={selectedMilitaryGBM} onValueChange={setSelectedMilitaryGBM}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o GBM" />
                </SelectTrigger>
                <SelectContent>
                  {gbmOptions.map((gbm) => (
                    <SelectItem key={gbm} value={gbm}>
                      {gbm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>GBM Viaturas</Label>
              <Select value={selectedVehicleGBM} onValueChange={setSelectedVehicleGBM}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o GBM" />
                </SelectTrigger>
                <SelectContent>
                  {gbmOptions.map((gbm) => (
                    <SelectItem key={gbm} value={gbm}>
                      {gbm}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
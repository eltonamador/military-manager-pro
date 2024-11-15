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

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedGBM, setSelectedGBM] = useState<string>();

  const { data: militaryData, isLoading } = useQuery({
    queryKey: ["military-service", selectedGBM, selectedDate],
    queryFn: async () => {
      if (!selectedGBM) return [];

      const tableName = `servico_militar_${selectedGBM.toLowerCase().replace(/[ºª\s]/g, '')}`;
      const query = supabase
        .from(tableName)
        .select("*");

      if (selectedDate) {
        query.eq('data', format(selectedDate, 'yyyy-MM-dd'));
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedGBM,
  });

  const gbmOptions = [
    "1º GBM",
    "2º GBM",
    "5º GBM",
    "GAPH",
    "GMAF",
    "MCPB"
  ];

  const formattedData = militaryData?.map(item => ({
    name: item.nome_de_guerra,
    function: item.funcao,
    gbm: item.GBM,
    vtr: item.viatura,
    date: new Date(item.data),
    shiftDuration: "24"
  })) || [];

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Consulta de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>GBM</Label>
              <Select value={selectedGBM} onValueChange={setSelectedGBM}>
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
          militaryList={formattedData}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  );
};

export default Consultation;
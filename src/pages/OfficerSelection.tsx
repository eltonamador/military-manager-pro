import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OfficerForm from "@/components/officer/OfficerForm";

const OfficerSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVTR, setSelectedVTR] = useState("");

  const { data: officerOptions = [], isLoading: isLoadingOfficers } = useQuery({
    queryKey: ["officers", selectedFunction],
    queryFn: async () => {
      if (!selectedFunction) return [];

      if (selectedFunction === "Superior de dia") {
        const { data, error } = await supabase
          .from("superior_de_dia")
          .select("nome_guerra_sup")
          .order("nome_guerra_sup");

        if (error) {
          console.error("Error fetching superior officers:", error);
          return [];
        }

        return data.map(officer => officer.nome_guerra_sup).filter(Boolean) as string[];
      } else {
        // For "Oficial de Área 1" or "Oficial de Área 2"
        const areaNumber = selectedFunction === "Oficial de Área 1" ? "1" : "2";
        
        const { data, error } = await supabase
          .from("oficiais_de_area")
          .select("nome_guerra_of_area")
          .eq("area_number", areaNumber)
          .order("nome_guerra_of_area");

        if (error) {
          console.error("Error fetching area officers:", error);
          return [];
        }

        return data.map(officer => officer.nome_guerra_of_area).filter(Boolean) as string[];
      }
    },
    enabled: !!selectedFunction,
  });

  const { data: vtrOptions = [] } = useQuery({
    queryKey: ["vtrs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("viaturas")
        .select("prefixo")
        .order("prefixo");

      if (error) {
        console.error("Error fetching VTRs:", error);
        return [];
      }

      return data.map(vtr => vtr.prefixo).filter(Boolean) as string[];
    },
  });

  const handleFinalize = () => {
    if (!selectedFunction || !selectedOfficer || !selectedDate || !selectedVTR) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    // Here you would typically save the data to your backend
    toast({
      title: "Sucesso",
      description: "Oficial selecionado com sucesso!",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Seleção de Oficiais</h1>
          <Button
            onClick={() => navigate("/vehicle-receiving")}
            variant="outline"
            className="bg-white"
          >
            Recebimento de Militares
          </Button>
        </div>

        <Card className="border-2 border-red-600/10 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-red-600 to-red-700">
            <CardTitle className="text-white">Dados do Oficial</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <OfficerForm
              selectedFunction={selectedFunction}
              selectedOfficer={selectedOfficer}
              selectedDate={selectedDate}
              selectedVTR={selectedVTR}
              officerOptions={officerOptions}
              vtrOptions={vtrOptions}
              isLoadingOfficers={isLoadingOfficers}
              onFunctionChange={setSelectedFunction}
              onOfficerChange={setSelectedOfficer}
              onDateChange={(date) => date && setSelectedDate(date)}
              onVTRChange={setSelectedVTR}
            />
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleFinalize}
            className="bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg px-8 py-3"
          >
            Finalizar Oficial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfficerSelection;
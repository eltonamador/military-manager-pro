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
        const { data, error } = await supabase
          .from("oficiais_de_area")
          .select("nome_guerra_of_area")
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

  const handleFinalize = async () => {
    if (!selectedFunction || !selectedOfficer || !selectedDate || !selectedVTR) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    try {
      // Insert into servico_oficial table
      const { error: servicoError } = await supabase
        .from("servico_oficial")
        .insert({
          nome_of_area: selectedFunction.includes("Área") ? selectedOfficer : null,
          nome_of_sup: selectedFunction === "Superior de dia" ? selectedOfficer : null,
        });

      if (servicoError) throw servicoError;

      // If it's an area officer, update the area_number
      if (selectedFunction.includes("Área")) {
        const areaNumber = selectedFunction === "Oficial de Área 1" ? "1" : "2";
        const { error: updateError } = await supabase
          .from("oficiais_de_area")
          .update({ area_number: areaNumber })
          .eq("nome_guerra_of_area", selectedOfficer);

        if (updateError) throw updateError;
      }

      toast({
        title: "Sucesso",
        description: "Oficial selecionado com sucesso!",
      });
      navigate("/index");
    } catch (error) {
      console.error("Error saving officer:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar oficial. Tente novamente.",
      });
    }
  };

  return (
    <div className="min-h-screen military-gradient">
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Seleção de Oficiais</h1>
        </div>

        <Card className="border-2 border-military-red/10">
          <CardHeader className="bg-military-red text-white">
            <CardTitle>Dados do Oficial</CardTitle>
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

            <div className="mt-6 flex justify-end gap-4">
              <Button
                onClick={handleFinalize}
                className="bg-military-orange hover:bg-military-red transition-colors text-white font-bold px-8 py-3"
              >
                Avançar para Recebimento de Militares
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficerSelection;
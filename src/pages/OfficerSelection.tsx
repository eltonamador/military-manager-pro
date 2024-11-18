import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OfficerForm from "@/components/officer/OfficerForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

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
      const { error: servicoError } = await supabase
        .from("servico_oficial")
        .insert({
          nome_of_sup: selectedOfficer,
          tipo: selectedFunction,
          data_serv_of: selectedDate.toISOString().split('T')[0]
        });

      if (servicoError) throw servicoError;

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

            {/* Preview Section */}
            {(selectedFunction || selectedOfficer || selectedVTR) && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Confirmação dos Dados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Função</p>
                      <p className="text-gray-900">{selectedFunction || "Não selecionado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Oficial</p>
                      <p className="text-gray-900">{selectedOfficer || "Não selecionado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data do Serviço</p>
                      <p className="text-gray-900">
                        {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Não selecionado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">VTR</p>
                      <p className="text-gray-900">{selectedVTR || "Não selecionado"}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

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
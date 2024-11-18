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
  const [selectedOfficers, setSelectedOfficers] = useState<Array<{
    function: string;
    officer: string;
    vtr: string;
  }>>([]);

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

    // Add current selection to the list
    const newOfficer = {
      function: selectedFunction,
      officer: selectedOfficer,
      vtr: selectedVTR,
    };

    const updatedOfficers = [...selectedOfficers, newOfficer];
    setSelectedOfficers(updatedOfficers);

    // Check if we have both required officer types
    const hasSuperior = updatedOfficers.some(off => off.function === "Superior de dia");
    const hasArea = updatedOfficers.some(off => off.function.includes("Oficial de Área"));

    if (!hasSuperior || !hasArea) {
      toast({
        title: "Oficial Adicionado",
        description: `Você ainda precisa ${!hasSuperior ? "um Superior de dia" : ""}${!hasSuperior && !hasArea ? " e " : ""}${!hasArea ? "um Oficial de Área" : ""}.`,
      });

      // Clear form for next selection
      setSelectedFunction("");
      setSelectedOfficer("");
      setSelectedVTR("");
      return;
    }

    try {
      // Insert all selected officers
      for (const officer of updatedOfficers) {
        const { error: servicoError } = await supabase
          .from("servico_oficial")
          .insert({
            nome_of_sup: officer.officer,
            tipo: officer.function,
            data_serv_of: selectedDate.toISOString().split('T')[0]
          });

        if (servicoError) throw servicoError;
      }

      toast({
        title: "Sucesso",
        description: "Oficiais selecionados com sucesso!",
      });
      navigate("/index");
    } catch (error) {
      console.error("Error saving officers:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar oficiais. Tente novamente.",
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
              officerOptions={officerOptions || []}
              vtrOptions={vtrOptions || []}
              isLoadingOfficers={isLoadingOfficers}
              onFunctionChange={setSelectedFunction}
              onOfficerChange={setSelectedOfficer}
              onDateChange={(date) => date && setSelectedDate(date)}
              onVTRChange={setSelectedVTR}
            />

            {/* Selected Officers List */}
            {selectedOfficers.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Oficiais Selecionados</h3>
                  <div className="space-y-3">
                    {selectedOfficers.map((officer, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{officer.function}</p>
                        <p className="text-sm text-gray-600">Oficial: {officer.officer}</p>
                        <p className="text-sm text-gray-600">VTR: {officer.vtr}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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
                {selectedOfficers.length === 0 ? "Adicionar Oficial" : "Finalizar Seleção"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfficerSelection;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OfficerForm from "@/components/officer/OfficerForm";
import SelectedOfficersList from "@/components/officer/SelectedOfficersList";
import { checkExistingOfficerService } from "@/utils/officerValidation";
import OfficerSelectionHeader from "@/components/officer/OfficerSelectionHeader";
import OfficerPreview from "@/components/officer/OfficerPreview";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
    vtr?: string;
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
    if (!selectedFunction || !selectedOfficer || !selectedDate) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios (Função, Oficial e Data).",
      });
      return;
    }

    const hasExistingService = await checkExistingOfficerService(
      selectedOfficer,
      selectedDate.toISOString().split('T')[0]
    );

    if (hasExistingService) {
      toast({
        title: "Aviso",
        description: "Este oficial já possui serviço registrado para esta data.",
      });
      return;
    }

    const currentTime = format(new Date(), "HH:mm");

    const newOfficer = {
      function: selectedFunction,
      officer: selectedOfficer,
      ...(selectedVTR && { vtr: selectedVTR }),
    };

    const updatedOfficers = [...selectedOfficers, newOfficer];
    setSelectedOfficers(updatedOfficers);

    const hasSuperior = updatedOfficers.some(off => off.function === "Superior de dia");
    const hasArea = updatedOfficers.some(off => off.function.includes("Oficial de Área"));

    if (!hasSuperior || !hasArea) {
      toast({
        title: "Oficial Adicionado",
        description: `Você ainda precisa ${!hasSuperior ? "um Superior de dia" : ""}${!hasSuperior && !hasArea ? " e " : ""}${!hasArea ? "um Oficial de Área" : ""}.`,
      });

      setSelectedFunction("");
      setSelectedOfficer("");
      setSelectedVTR("");
      return;
    }

    try {
      for (const officer of updatedOfficers) {
        const { error: servicoError } = await supabase
          .from("servico_oficial")
          .insert({
            nome_of_sup: officer.officer,
            tipo: officer.function,
            data_serv_of: selectedDate.toISOString().split('T')[0],
            vtr_sup: officer.vtr || null,
            hora_inclusao_sup: currentTime
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
        <OfficerSelectionHeader />

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

            <SelectedOfficersList officers={selectedOfficers} />

            <OfficerPreview
              selectedFunction={selectedFunction}
              selectedOfficer={selectedOfficer}
              selectedDate={selectedDate}
              selectedVTR={selectedVTR}
            />

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
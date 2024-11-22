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
import { Officer, saveOfficerService, validateOfficerSelection } from "@/components/officer/OfficerValidation";

const OfficerSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedOfficers, setSelectedOfficers] = useState<Officer[]>([]);

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
    const validationError = validateOfficerSelection(selectedFunction, selectedOfficer, selectedDate);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: validationError,
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

    try {
      await saveOfficerService(newOfficer, selectedDate, currentTime);

      // Reset form
      setSelectedFunction("");
      setSelectedOfficer("");
      setSelectedVTR("");

      // If at least one Area Officer is selected, allow proceeding
      const hasAreaOfficer = updatedOfficers.some(off => 
        off.function === "Oficial de Área 1" || off.function === "Oficial de Área 2"
      );

      if (hasAreaOfficer) {
        toast({
          title: "Sucesso",
          description: "Oficiais selecionados com sucesso!",
        });
        navigate("/index");
      } else {
        toast({
          title: "Oficial Adicionado",
          description: "Você ainda precisa selecionar pelo menos um Oficial de Área.",
        });
      }
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
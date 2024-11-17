import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import OfficerForm from "@/components/officer/OfficerForm";
import { useToast } from "@/hooks/use-toast";

const OfficerSelection = () => {
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVTR, setSelectedVTR] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: officerOptions = [], isLoading: isLoadingOfficers } = useQuery({
    queryKey: ['officers', selectedFunction],
    queryFn: async () => {
      if (!selectedFunction) return [];

      if (selectedFunction === "Superior de dia") {
        const { data, error } = await supabase
          .from('superior_de_dia')
          .select('nome_guerra_sup')
          .not('nome_guerra_sup', 'is', null);

        if (error) throw error;
        return data.map(item => item.nome_guerra_sup);
      } else {
        const areaNumber = selectedFunction === "Oficial de Área 1" ? "1" : "2";
        const { data, error } = await supabase
          .from('oficiais_de_area')
          .select('nome_guerra_of_area')
          .eq('area_number', areaNumber)
          .not('nome_guerra_of_area', 'is', null);

        if (error) throw error;
        return data.map(item => item.nome_guerra_of_area);
      }
    },
    enabled: !!selectedFunction,
  });

  const { data: vtrOptions = [] } = useQuery({
    queryKey: ['vtrOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('viaturas')
        .select('prefixo')
        .not('prefixo', 'is', null);

      if (error) throw error;
      return data.map(item => item.prefixo);
    },
  });

  const handleFinish = async () => {
    if (!selectedFunction || !selectedOfficer || !selectedDate) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    try {
      // Save the officer selection data
      // Note: You might want to create a new table for this in the future
      toast({
        title: "Sucesso",
        description: "Oficial selecionado com sucesso!",
      });
      navigate("/");
    } catch (error) {
      console.error('Error saving officer selection:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar a seleção do oficial.",
      });
    }
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col p-2 sm:p-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-3 flex-1 max-w-[300px]">
          <h1 className="text-lg sm:text-xl font-bold text-military-red">
            Seleção de Oficiais
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-3 flex-1 max-w-[300px]">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="w-full hover:bg-red-50 flex items-center justify-center"
          >
            <ArrowRight className="h-4 w-4 text-military-red mr-2" />
            <span className="text-lg sm:text-xl font-bold text-black">
              Recebimento de Militares
            </span>
          </Button>
        </div>
      </div>

      <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
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
          onDateChange={setSelectedDate}
          onVTRChange={setSelectedVTR}
        />

        <Button
          onClick={handleFinish}
          className="w-full mt-6 bg-military-red hover:bg-military-orange transition-colors text-white font-bold text-lg py-6"
          disabled={!selectedFunction || !selectedOfficer || !selectedDate}
        >
          Finalizar Oficial
        </Button>
      </main>
    </div>
  );
};

export default OfficerSelection;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

const fetchMilitaryNames = async () => {
  const { data, error } = await supabase
    .from('militares_geral')
    .select('nome_guerra')
    .not('nome_guerra', 'is', null);

  if (error) throw error;
  return data.map(item => item.nome_guerra);
};

const fetchVTRs = async () => {
  const { data, error } = await supabase
    .from('viaturas')
    .select('prefixo')
    .not('prefixo', 'is', null);

  if (error) throw error;
  return data.map(item => item.prefixo);
};

const getTableNameForGBM = (gbm: string) => {
  const tableMap: { [key: string]: string } = {
    "1º GBM": "servico_militar_1gbm",
    "2º GBM": "servico_militar_2gbm",
    "MCPB": "servico_militar_mcpb",
    "5º GBM": "servico_militar_5gbm",
    "GAPH": "servico_militar_gaph",
    "GMAF": "servico_militar_gmaf"
  };
  return tableMap[gbm];
};

const Index = () => {
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftDuration, setShiftDuration] = useState("");
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: militaryNames = [] } = useQuery({
    queryKey: ['militaryNames'],
    queryFn: fetchMilitaryNames,
  });

  const { data: vtrOptions = [] } = useQuery({
    queryKey: ['vtrOptions'],
    queryFn: fetchVTRs,
  });

  const gbmOptions = ["1º GBM", "2º GBM", "GAPH", "GMAF", "5º GBM", "MCPB"];

  const handleAddMilitary = () => {
    if (selectedMilitary && militaryFunction && selectedDate && shiftDuration) {
      if (editingIndex !== null) {
        const updatedList = [...militaryList];
        updatedList[editingIndex] = {
          name: selectedMilitary,
          function: militaryFunction,
          gbm: selectedGBM,
          vtr: selectedVTR,
          date: selectedDate,
          shiftDuration: shiftDuration,
        };
        setMilitaryList(updatedList);
        setEditingIndex(null);
        toast({
          title: "Militar atualizado",
          description: "As informações do militar foram atualizadas com sucesso",
        });
      } else {
        setMilitaryList([
          ...militaryList,
          {
            name: selectedMilitary,
            function: militaryFunction,
            gbm: selectedGBM,
            vtr: selectedVTR,
            date: selectedDate,
            shiftDuration: shiftDuration,
          },
        ]);
        toast({
          title: "Militar adicionado",
          description: "O militar foi adicionado com sucesso à lista",
        });
      }
      setSelectedMilitary("");
      setMilitaryFunction("");
      setShiftDuration("");
    }
  };

  const handleEdit = (index: number) => {
    const military = militaryList[index];
    setSelectedGBM(military.gbm);
    setSelectedVTR(military.vtr);
    setSelectedMilitary(military.name);
    setMilitaryFunction(military.function);
    setSelectedDate(military.date);
    setShiftDuration(military.shiftDuration);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedList = militaryList.filter((_, i) => i !== index);
    setMilitaryList(updatedList);
    toast({
      title: "Militar removido",
      description: "O militar foi removido com sucesso da lista",
    });
  };

  const handleFinishOperation = async () => {
    try {
      for (const military of militaryList) {
        const tableName = getTableNameForGBM(military.gbm);
        
        if (!tableName) {
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: `GBM inválido: ${military.gbm}`,
          });
          continue;
        }

        const { error } = await supabase
          .from(tableName)
          .insert({
            nome_de_guerra: military.name,
            viatura: military.vtr,
            funcao: military.function,
            GBM: military.gbm,
            data: military.date.toISOString().split('T')[0],
          });

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Operação finalizada",
        description: "Todos os dados foram salvos com sucesso",
      });
      setMilitaryList([]);
      setSelectedGBM("");
      setSelectedVTR("");
      navigate("/vehicle-receiving");
    } catch (error) {
      console.error('Error saving military service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados do serviço",
      });
    }
  };

  return (
    <div className="min-h-screen military-gradient flex flex-col p-4 animate-fadeIn">
      <header className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-military-red">
          Gestão de Militares
        </h1>
      </header>
      <main className="flex-grow bg-white rounded-lg shadow-md p-6">
        <MilitaryForm
          selectedGBM={selectedGBM}
          selectedVTR={selectedVTR}
          selectedMilitary={selectedMilitary}
          militaryFunction={militaryFunction}
          selectedDate={selectedDate}
          shiftDuration={shiftDuration}
          gbmOptions={gbmOptions}
          vtrOptions={vtrOptions}
          militaryOptions={militaryNames}
          onGBMChange={setSelectedGBM}
          onVTRChange={setSelectedVTR}
          onMilitaryChange={setSelectedMilitary}
          onFunctionChange={setMilitaryFunction}
          onDateChange={setSelectedDate}
          onShiftDurationChange={setShiftDuration}
          onAddMilitary={handleAddMilitary}
        />
        <MilitaryTable 
          militaryList={militaryList} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
        />
      </main>
      <footer className="mt-6">
        <Button
          onClick={handleFinishOperation}
          className="w-full bg-military-red hover:bg-military-orange transition-colors"
          disabled={militaryList.length === 0}
        >
          Finalizar Operação
        </Button>
      </footer>
    </div>
  );
};

export default Index;
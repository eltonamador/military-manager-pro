import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "@/utils/tableNames";
import MilitaryHeader from "@/components/military/MilitaryHeader";
import MilitaryActions from "@/components/military/MilitaryActions";
import MilitaryContainer from "@/components/military/MilitaryContainer";
import { Military } from "@/types/military";

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

const Index = () => {
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftDuration, setShiftDuration] = useState("24");
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

  const handleEdit = (index: number) => {
    const military = militaryList[index];
    setSelectedGBM(military.gbm);
    setSelectedVTR(military.vtr);
    setSelectedMilitary(military.name);
    setMilitaryFunction(military.function);
    setShiftDuration(military.shiftDuration);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedList = militaryList.filter((_, i) => i !== index);
    setMilitaryList(updatedList);
    toast({
      title: "Militar removido",
      description: "O militar foi removido da lista com sucesso",
    });
  };

  const handleAddMilitary = () => {
    if (selectedMilitary && militaryFunction && selectedDate && shiftDuration) {
      const newMilitary = {
        name: selectedMilitary,
        function: militaryFunction,
        gbm: selectedGBM,
        vtr: selectedVTR,
        date: selectedDate,
        shiftDuration: shiftDuration,
      };

      if (editingIndex !== null) {
        const updatedList = [...militaryList];
        updatedList[editingIndex] = newMilitary;
        setMilitaryList(updatedList);
        setEditingIndex(null);
        toast({
          title: "Militar atualizado",
          description: "As informações do militar foram atualizadas com sucesso",
        });
      } else {
        setMilitaryList([...militaryList, newMilitary]);
        toast({
          title: "Militar adicionado",
          description: "O militar foi adicionado com sucesso à lista",
        });
      }

      setSelectedMilitary("");
      setMilitaryFunction("");
    }
  };

  const handleFinishOperation = async () => {
    try {
      for (const military of militaryList) {
        const tableName = getMilitaryTableName(military.gbm);
        
        const { error } = await supabase
          .from(tableName)
          .insert({
            nome_de_guerra: military.name,
            viatura: military.vtr,
            funcao: military.function,
            GBM: military.gbm,
            data: military.date.toISOString().split('T')[0],
          });

        if (error) throw error;
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
    <div className="min-h-screen military-gradient flex flex-col p-2 sm:p-4 animate-fadeIn">
      <MilitaryHeader />
      <MilitaryActions />
      <MilitaryContainer
        selectedGBM={selectedGBM}
        selectedVTR={selectedVTR}
        selectedMilitary={selectedMilitary}
        militaryFunction={militaryFunction}
        selectedDate={selectedDate}
        shiftDuration={shiftDuration}
        gbmOptions={gbmOptions}
        vtrOptions={vtrOptions}
        militaryOptions={militaryNames}
        militaryList={militaryList}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onMilitaryChange={setSelectedMilitary}
        onFunctionChange={setMilitaryFunction}
        onDateChange={setSelectedDate}
        onShiftDurationChange={setShiftDuration}
        onAddMilitary={handleAddMilitary}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFinishOperation={handleFinishOperation}
      />
    </div>
  );
};

export default Index;
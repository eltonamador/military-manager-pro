import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MilitaryTable from "../MilitaryTable";
import { getServiceMilitaryTableName } from "@/utils/supabase-utils";

interface Military {
  name: string;
  function: string;
  gbm: string;
  vtr: string;
  date: Date;
  shiftDuration: string;
}

interface MilitaryReportProps {
  selectedDate: Date;
}

export const MilitaryReport = ({ selectedDate }: MilitaryReportProps) => {
  const [militaryList, setMilitaryList] = useState<Military[]>([]);
  const { toast } = useToast();

  const handleEditMilitary = async (index: number) => {
    const military = militaryList[index];
    toast({
      title: "Edição iniciada",
      description: `Editando militar: ${military.name}`,
    });
  };

  const handleDeleteMilitary = async (index: number) => {
    try {
      const military = militaryList[index];
      const formattedDate = format(military.date, 'yyyy-MM-dd');
      const tableName = getServiceMilitaryTableName(military.gbm);
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('nome_de_guerra', military.name)
        .eq('data', formattedDate);

      if (error) throw error;

      const updatedList = militaryList.filter((_, i) => i !== index);
      setMilitaryList(updatedList);
      
      toast({
        title: "Militar removido",
        description: "O militar foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting military:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o militar",
      });
    }
  };

  useEffect(() => {
    const fetchMilitaryData = async () => {
      try {
        if (!selectedDate) {
          setMilitaryList([]);
          return;
        }

        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const gbmList = ['1gbm', '2gbm', '5gbm', 'gaph', 'gmaf', 'mcpb'];
        const militaryData = [];

        for (const gbm of gbmList) {
          const tableName = getServiceMilitaryTableName(gbm);
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('data', formattedDate);

          if (error) throw error;
          if (data) militaryData.push(...data);
        }

        const formattedData: Military[] = militaryData.map(item => ({
          name: item.nome_de_guerra || '',
          function: item.funcao || '',
          gbm: item.GBM || '',
          vtr: item.viatura || '',
          date: new Date(item.data),
          shiftDuration: '24',
        }));

        setMilitaryList(formattedData);
      } catch (error) {
        console.error('Error fetching military data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos militares",
        });
      }
    };

    fetchMilitaryData();
  }, [selectedDate, toast]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Militares</h3>
      <MilitaryTable
        militaryList={militaryList}
        onEdit={handleEditMilitary}
        onDelete={handleDeleteMilitary}
      />
    </div>
  );
};
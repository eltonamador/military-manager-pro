import { Button } from "@/components/ui/button";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";
import { Military } from "@/types/military";
import { useNavigate } from "react-router-dom";
import { useVTRs } from "@/hooks/useVTRs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "@/utils/tableNames";
import { format } from "date-fns";

interface MilitaryContainerProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date;
  shiftDuration: string;
  gbmOptions: string[];
  militaryOptions: string[];
  militaryList: Military[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onShiftDurationChange: (value: string) => void;
  onAddMilitary: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onFinishOperation: () => void;
}

const MilitaryContainer = ({
  selectedGBM,
  selectedVTR,
  selectedMilitary,
  militaryFunction,
  selectedDate,
  shiftDuration,
  gbmOptions,
  militaryOptions,
  militaryList,
  onGBMChange,
  onVTRChange,
  onMilitaryChange,
  onFunctionChange,
  onDateChange,
  onShiftDurationChange,
  onAddMilitary,
  onEdit,
  onDelete,
  onFinishOperation,
}: MilitaryContainerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: vtrOptions, isLoading, error } = useVTRs();

  const handleEditMilitary = async (index: number, updatedMilitary: Military) => {
    try {
      const tableName = getMilitaryTableName(updatedMilitary.gbm);
      const formattedDate = format(updatedMilitary.date, 'yyyy-MM-dd');

      // Check for existing record
      const { data: existingData, error: checkError } = await supabase
        .from(tableName)
        .select('*')
        .eq('nome_de_guerra', updatedMilitary.name)
        .eq('data', formattedDate);

      if (checkError) throw checkError;

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from(tableName)
          .update({
            GBM: updatedMilitary.gbm,
            viatura: updatedMilitary.vtr,
            funcao: updatedMilitary.function,
            data: formattedDate,
          })
          .eq('nome_de_guerra', updatedMilitary.name)
          .eq('data', formattedDate);

        if (updateError) throw updateError;

        toast({
          title: "Sucesso",
          description: "Registro atualizado com sucesso!",
        });
      }

      // Update local state
      const newList = [...militaryList];
      newList[index] = updatedMilitary;
      setMilitaryList(newList);

    } catch (error) {
      console.error('Error updating military:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o registro.",
      });
    }
  };

  const handleFinishMilitary = () => {
    onFinishOperation();
    navigate("/vehicle-receiving");
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro ao carregar VTRs",
      description: "Não foi possível carregar a lista de VTRs.",
    });
  }

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
      <MilitaryForm
        selectedGBM={selectedGBM}
        selectedVTR={selectedVTR}
        selectedMilitary={selectedMilitary}
        militaryFunction={militaryFunction}
        selectedDate={selectedDate}
        shiftDuration={shiftDuration}
        gbmOptions={gbmOptions}
        vtrOptions={vtrOptions || []}
        militaryOptions={militaryOptions}
        onGBMChange={onGBMChange}
        onVTRChange={onVTRChange}
        onMilitaryChange={onMilitaryChange}
        onFunctionChange={onFunctionChange}
        onDateChange={onDateChange}
        onShiftDurationChange={onShiftDurationChange}
        onAddMilitary={onAddMilitary}
      />
      <div className="overflow-x-auto">
        <MilitaryTable 
          militaryList={militaryList} 
          onEdit={handleEditMilitary}
          onDelete={onDelete}
          gbmOptions={gbmOptions}
          vtrOptions={vtrOptions || []}
        />
      </div>
      <Button
        onClick={handleFinishMilitary}
        className="w-full mt-6 bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg py-6"
        disabled={militaryList.length === 0}
      >
        Finalizar Militares
      </Button>
    </main>
  );
};

export default MilitaryContainer;
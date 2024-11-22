import { Button } from "@/components/ui/button";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";
import { Military } from "@/types/military";
import { useNavigate } from "react-router-dom";
import { useVTRs } from "@/hooks/useVTRs";
import { useToast } from "@/hooks/use-toast";
import { saveMilitaryList } from "@/utils/militaryService";

interface MilitaryContainerProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedMilitary: string;
  militaryFunction: string;
  selectedDate: Date;
  shiftDuration?: string;  // Made optional
  gbmOptions: string[];
  militaryOptions: string[];
  militaryList: Military[];
  onGBMChange: (value: string) => void;
  onVTRChange: (value: string) => void;
  onMilitaryChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onDateChange: (date: Date) => void;
  onShiftDurationChange?: (value: string) => void;  // Made optional
  onAddMilitary: (alterations?: string) => void;
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

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro ao carregar VTRs",
      description: "Não foi possível carregar a lista de VTRs.",
    });
  }

  const handleFinishMilitary = async () => {
    if (militaryList.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos um militar antes de finalizar.",
      });
      return;
    }

    try {
      await saveMilitaryList(militaryList);
      toast({
        title: "Sucesso",
        description: "Militares salvos com sucesso!",
      });
      onFinishOperation();
      navigate("/vehicle-receiving");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar militares",
        description: "Ocorreu um erro ao salvar os militares. Tente novamente.",
      });
      console.error("Error saving military list:", error);
    }
  };

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
          onEdit={onEdit}
          onDelete={onDelete}
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
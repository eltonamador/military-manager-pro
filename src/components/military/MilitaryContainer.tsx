import { Button } from "@/components/ui/button";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";
import { Military } from "@/types/military";
import { useNavigate } from "react-router-dom";
import { useVTRs } from "@/hooks/useVTRs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import MilitaryUpdateDialog from "./MilitaryUpdateDialog";
import { checkExistingMilitary, saveMilitaryService } from "@/utils/militaryService";

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
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [militaryToUpdate, setMilitaryToUpdate] = useState<Military | null>(null);

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro ao carregar VTRs",
      description: "Não foi possível carregar a lista de VTRs.",
    });
  }

  const handleFinishMilitary = async () => {
    for (const military of militaryList) {
      const exists = await checkExistingMilitary(military);
      
      if (exists) {
        setMilitaryToUpdate(military);
        setShowUpdateDialog(true);
        return;
      }
      
      await saveMilitaryService(military);
    }
    
    onFinishOperation();
    navigate("/vehicle-receiving");
  };

  const handleUpdateConfirm = async () => {
    if (militaryToUpdate) {
      await saveMilitaryService(militaryToUpdate, true);
      setShowUpdateDialog(false);
      setMilitaryToUpdate(null);
      onFinishOperation();
      navigate("/vehicle-receiving");
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

      <MilitaryUpdateDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        onConfirm={handleUpdateConfirm}
      />
    </main>
  );
};

export default MilitaryContainer;
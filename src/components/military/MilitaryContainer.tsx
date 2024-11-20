import { Button } from "@/components/ui/button";
import MilitaryForm from "@/components/MilitaryForm";
import MilitaryTable from "@/components/MilitaryTable";
import { Military } from "@/types/military";
import { useNavigate } from "react-router-dom";
import { useVTRs } from "@/hooks/useVTRs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

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

  const getTableName = (gbm: string) => {
    if (["GAPH", "GMAF", "MCPB"].includes(gbm)) {
      return `servico_militar_${gbm.toLowerCase()}`;
    }
    return `servico_militar_${gbm.replace("°", "")}gbm`.toLowerCase();
  };

  const checkExistingMilitary = async (military: Military) => {
    try {
      const { data, error } = await supabase.rpc('check_military_service_exists', {
        p_nome: military.name,
        p_data: military.date.toISOString().split('T')[0],
        p_gbm: military.gbm
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking existing military:', error);
      return false;
    }
  };

  const saveMilitaryService = async (military: Military, isUpdate = false) => {
    const tableName = getTableName(military.gbm);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .upsert({
          nome_de_guerra: military.name,
          funcao: military.function,
          GBM: military.gbm,
          viatura: military.vtr,
          data: military.date.toISOString().split('T')[0],
        });

      if (error) throw error;

      toast({
        title: isUpdate ? "Registro atualizado" : "Registro salvo",
        description: isUpdate 
          ? "O registro do militar foi atualizado com sucesso!"
          : "O registro do militar foi salvo com sucesso!",
      });
    } catch (error) {
      console.error('Error saving military service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o registro do militar.",
      });
    }
  };

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

      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Militar já registrado</AlertDialogTitle>
            <AlertDialogDescription>
              Este militar já possui um registro para esta data. Deseja atualizar o registro existente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateConfirm}>
              Atualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default MilitaryContainer;
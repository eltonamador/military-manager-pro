import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useVehicleService } from "@/hooks/useVehicleService";
import MilitaryForm from "@/components/MilitaryForm";
import VehicleTable from "@/components/VehicleTable";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getMilitaryTableName } from "@/utils/tableNames";
import { Military } from "@/types/military";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
}

const MilitaryContainer = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedGBM, setSelectedGBM] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showGoodServiceDialog, setShowGoodServiceDialog] = useState(false);
  const { toast } = useToast();
  const { saveVehicleService } = useVehicleService();
  const navigate = useNavigate();

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
      const newList = [...vehicles];
      newList[index] = updatedMilitary;
      setVehicles(newList);

    } catch (error) {
      console.error('Error updating military:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o registro.",
      });
    }
  };

  const handleAddMilitary = (military: Military) => {
    setVehicles([...vehicles, military]);
    toast({
      title: "Militar adicionado",
      description: "O militar foi adicionado com sucesso à lista",
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    const updatedVehicles = vehicles.filter((_, i) => i !== index);
    setVehicles(updatedVehicles);
    toast({
      title: "VTR removida",
      description: "A VTR foi removida com sucesso da lista",
    });
  };

  const handleFinishOperation = async () => {
    const success = await saveVehicleService(vehicles, selectedDate);
    if (success) {
      setShowGoodServiceDialog(true);
    }
  };

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
      <MilitaryForm
        selectedVTR={selectedVTR}
        selectedGBM={selectedGBM}
        selectedDate={selectedDate}
        status={status}
        description={description}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onDateChange={setSelectedDate}
        onStatusChange={setStatus}
        onDescriptionChange={setDescription}
        onAddMilitary={handleAddMilitary}
        editingIndex={editingIndex}
      />

      <div className="overflow-x-auto">
        <VehicleTable
          vehicleList={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Button
        onClick={handleFinishOperation}
        className="w-full mt-6 bg-military-red hover:bg-military-orange transition-colors"
        disabled={vehicles.length === 0}
      >
        Finalizar VTRs
      </Button>

      <AlertDialog open={showGoodServiceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bom Serviço!</AlertDialogTitle>
            <AlertDialogDescription>
              Agradecemos pelo seu trabalho. Tenha um excelente serviço!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowGoodServiceDialog(false);
              navigate("/login");
            }}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default MilitaryContainer;
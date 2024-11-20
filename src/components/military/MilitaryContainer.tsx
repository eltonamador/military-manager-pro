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
import { Vehicle } from "@/types/vehicle";

const MilitaryContainer = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedMilitary, setSelectedMilitary] = useState("");
  const [militaryFunction, setMilitaryFunction] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftDuration, setShiftDuration] = useState("24");
  const [showGoodServiceDialog, setShowGoodServiceDialog] = useState(false);
  const { toast } = useToast();
  const { saveVehicleService } = useVehicleService();
  const navigate = useNavigate();

  const handleEditMilitary = async (index: number, updatedMilitary: Military) => {
    try {
      const tableName = getMilitaryTableName(updatedMilitary.gbm);
      const formattedDate = format(updatedMilitary.date, 'yyyy-MM-dd');

      const { data: existingData, error: checkError } = await supabase
        .from(tableName)
        .select('*')
        .eq('nome_de_guerra', updatedMilitary.name)
        .eq('data', formattedDate);

      if (checkError) throw checkError;

      if (existingData && existingData.length > 0) {
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

      const updatedVehicle: Vehicle = {
        gbm: updatedMilitary.gbm,
        vtr: updatedMilitary.vtr,
        status: status,
        description: description,
        date: updatedMilitary.date,
      };

      const newList = [...vehicles];
      newList[index] = updatedVehicle;
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

  const handleAddMilitary = () => {
    const military: Military = {
      gbm: selectedGBM,
      vtr: selectedVTR,
      name: selectedMilitary,
      function: militaryFunction,
      date: selectedDate,
    };

    const newVehicle: Vehicle = {
      gbm: military.gbm,
      vtr: military.vtr,
      status: status,
      description: description,
      date: military.date,
    };

    setVehicles([...vehicles, newVehicle]);
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

  const gbmOptions = [
    "1º GBM",
    "2º GBM",
    "5º GBM",
    "GAPH",
    "GMAF",
    "MCPB"
  ];

  const vtrOptions = ["VTR1", "VTR2", "VTR3"]; // This should be fetched from your backend

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
      <MilitaryForm
        selectedVTR={selectedVTR}
        selectedGBM={selectedGBM}
        selectedMilitary={selectedMilitary}
        militaryFunction={militaryFunction}
        selectedDate={selectedDate}
        shiftDuration={shiftDuration}
        gbmOptions={gbmOptions}
        vtrOptions={vtrOptions}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onMilitaryChange={setSelectedMilitary}
        onFunctionChange={setMilitaryFunction}
        onDateChange={setSelectedDate}
        onShiftDurationChange={setShiftDuration}
        onAddMilitary={handleAddMilitary}
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useVehicleService } from "@/hooks/useVehicleService";
import VehicleForm from "@/components/vehicle/VehicleForm";
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

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
}

const VehicleContainer = () => {
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

  // Define GBM and VTR options
  const gbmOptions = ["1º GBM", "2º GBM", "5º GBM", "GAPH", "GMAF", "MCPB"];
  const vtrOptions = ["ABT", "ABS", "AR", "ASE", "ATP", "AEM"];

  const handleAddVehicle = () => {
    const newVehicle = {
      gbm: selectedGBM,
      vtr: selectedVTR,
      status,
      description,
      date: selectedDate,
    };

    if (editingIndex !== null) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[editingIndex] = newVehicle;
      setVehicles(updatedVehicles);
      setEditingIndex(null);
      toast({
        title: "VTR atualizada",
        description: "As informações da VTR foram atualizadas com sucesso",
      });
    } else {
      setVehicles([...vehicles, newVehicle]);
      toast({
        title: "VTR adicionada",
        description: "A VTR foi adicionada com sucesso à lista",
      });
    }

    setSelectedVTR("");
    setStatus("");
    setDescription("");
  };

  const handleEdit = (index: number) => {
    const vehicle = vehicles[index];
    setSelectedGBM(vehicle.gbm);
    setSelectedVTR(vehicle.vtr);
    setStatus(vehicle.status);
    setDescription(vehicle.description);
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
      <VehicleForm
        selectedVTR={selectedVTR}
        selectedGBM={selectedGBM}
        selectedDate={selectedDate}
        status={status}
        description={description}
        gbmOptions={gbmOptions}
        vtrOptions={vtrOptions}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onDateChange={setSelectedDate}
        onStatusChange={setStatus}
        onDescriptionChange={setDescription}
        onAddVehicle={handleAddVehicle}
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

export default VehicleContainer;
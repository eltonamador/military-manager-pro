import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVehicleService } from "@/hooks/useVehicleService";
import VehicleForm from "@/components/vehicle/VehicleForm";
import VehicleTable from "@/components/VehicleTable";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EquipmentStatusForm } from "./form/EquipmentStatusForm";
import { FinishOperationDialog } from "./FinishOperationDialog";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
  time: string;
}

interface EquipmentStatus {
  equipmentId: number;
  status: string;
  description: string;
}

const VehicleContainer = () => {
  const [selectedVTR, setSelectedVTR] = useState("");
  const [selectedGBM, setSelectedGBM] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showGoodServiceDialog, setShowGoodServiceDialog] = useState(false);
  const [equipmentStatuses, setEquipmentStatuses] = useState<EquipmentStatus[]>([]);
  
  const { toast } = useToast();
  const { saveVehicleService } = useVehicleService();

  // Fetch vehicle type
  const { data: vehicleType } = useQuery({
    queryKey: ["vehicleType", selectedVTR],
    queryFn: async () => {
      if (!selectedVTR) return null;
      
      const { data, error } = await supabase
        .from("viaturas")
        .select("tipo")
        .eq("prefixo", selectedVTR)
        .single();

      if (error) throw error;
      return data?.tipo || null;
    },
    enabled: !!selectedVTR,
  });

  const handleSaveEquipmentStatus = async (statuses: EquipmentStatus[]) => {
    setEquipmentStatuses(statuses);
  };

  const handleAddVehicle = () => {
    const newVehicle = {
      gbm: selectedGBM,
      vtr: selectedVTR,
      status,
      description,
      date: selectedDate,
      time: selectedTime,
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
    try {
      // First save the vehicles
      const success = await saveVehicleService(vehicles, selectedDate);
      if (!success) return;

      // Then save equipment statuses
      if (equipmentStatuses.length > 0) {
        const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        for (const status of equipmentStatuses) {
          const { error } = await supabase
            .from('equipment_status')
            .insert({
              equipment_type_id: status.equipmentId,
              vtr: selectedVTR,
              gbm: selectedGBM,
              status: status.status,
              description: status.description,
              date: selectedDate.toISOString().split('T')[0],
              time: currentTime,
            });

          if (error) throw error;
        }
      }

      setShowGoodServiceDialog(true);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados",
      });
    }
  };

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
      <VehicleForm
        selectedVTR={selectedVTR}
        selectedGBM={selectedGBM}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        status={status}
        description={description}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
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

      <EquipmentStatusForm
        selectedGBM={selectedGBM}
        selectedVTR={selectedVTR}
        selectedDate={selectedDate}
        vehicleType={vehicleType}
        onStatusChange={handleSaveEquipmentStatus}
      />

      <Button
        onClick={handleFinishOperation}
        className="w-full mt-6 bg-military-orange hover:bg-military-red transition-colors text-white font-bold text-lg py-6"
        disabled={vehicles.length === 0}
      >
        Finalizar VTRs
      </Button>

      <FinishOperationDialog 
        open={showGoodServiceDialog}
        onOpenChange={setShowGoodServiceDialog}
      />
    </main>
  );
};

export default VehicleContainer;
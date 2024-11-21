import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VehicleForm from "@/components/vehicle/VehicleForm";
import VehicleTable from "@/components/VehicleTable";
import { Button } from "@/components/ui/button";
import { EquipmentStatusForm } from "./form/EquipmentStatusForm";
import { FinishOperationDialog } from "./FinishOperationDialog";
import { VehicleStateProvider, useVehicleState } from "./VehicleStateProvider";
import { useVehicleOperations } from "./VehicleOperations";
import { Plus } from "lucide-react";

const VehicleContainerContent = () => {
  const {
    selectedVTR,
    selectedGBM,
    selectedDate,
    selectedTime,
    status,
    description,
    vehicles,
    editingIndex,
    showGoodServiceDialog,
    setShowGoodServiceDialog,
    setSelectedGBM,
    setSelectedVTR,
    setSelectedTime,
    setStatus,
    setDescription,
    setSelectedDate,
    setEquipmentStatuses,
  } = useVehicleState();

  const {
    handleAddVehicle,
    handleEdit,
    handleDelete,
    handleFinishOperation,
  } = useVehicleOperations();

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

  return (
    <main className="flex-grow bg-white rounded-lg shadow-md p-3 sm:p-6">
      <VehicleForm
        selectedVTR={selectedVTR}
        selectedGBM={selectedGBM}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        status={status}
        description={description}
        onAddVehicle={handleAddVehicle}
        editingIndex={editingIndex}
        onGBMChange={setSelectedGBM}
        onVTRChange={setSelectedVTR}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onStatusChange={setStatus}
        onDescriptionChange={setDescription}
      />

      <div className="overflow-x-auto">
        <VehicleTable
          vehicleList={vehicles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Button
        onClick={handleAddVehicle}
        className="w-full mt-4 bg-military-orange hover:bg-military-red transition-colors"
        disabled={!selectedGBM || !selectedVTR || !status}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar VTR
      </Button>

      <EquipmentStatusForm
        selectedGBM={selectedGBM}
        selectedVTR={selectedVTR}
        selectedDate={selectedDate}
        vehicleType={vehicleType}
        onStatusChange={setEquipmentStatuses}
      />

      <Button
        onClick={async () => {
          const success = await handleFinishOperation();
          if (success) {
            setShowGoodServiceDialog(true);
          }
        }}
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

const VehicleContainer = () => {
  return (
    <VehicleStateProvider>
      <VehicleContainerContent />
    </VehicleStateProvider>
  );
};

export default VehicleContainer;
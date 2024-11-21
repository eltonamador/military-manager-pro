import { useToast } from "@/hooks/use-toast";
import { useVehicleService } from "@/hooks/useVehicleService";
import { supabase } from "@/integrations/supabase/client";
import { useVehicleState } from "./VehicleStateProvider";

export const useVehicleOperations = () => {
  const {
    selectedVTR,
    selectedGBM,
    status,
    description,
    vehicles,
    editingIndex,
    selectedDate,
    equipmentStatuses,
    setVehicles,
    setSelectedVTR,
    setStatus,
    setDescription,
    setEditingIndex,
  } = useVehicleState();

  const { toast } = useToast();
  const { saveVehicleService } = useVehicleService();

  const handleAddVehicle = () => {
    const newVehicle = {
      gbm: selectedGBM,
      vtr: selectedVTR,
      status,
      description,
      date: selectedDate,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
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
      const success = await saveVehicleService(vehicles, selectedDate);
      if (!success) return;

      if (equipmentStatuses.length > 0) {
        const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        for (const status of equipmentStatuses) {
          const { error } = await supabase
            .from('equipment_status')
            .insert({
              equipamento: status.equipamento,
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

      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados",
      });
      return false;
    }
  };

  return {
    handleAddVehicle,
    handleEdit,
    handleDelete,
    handleFinishOperation,
  };
};
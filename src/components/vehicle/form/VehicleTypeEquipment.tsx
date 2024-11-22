import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EquipmentStatusSelect } from "./equipment/EquipmentStatusSelect";
import { EquipmentStatus } from "../types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Equipment {
  id: number;
  name: string;
}

interface VehicleTypeEquipmentProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedDate: Date;
  vehicleType: string;
  onStatusChange: (statuses: EquipmentStatus[]) => void;
  onSaveChecklist: () => void;
}

export const VehicleTypeEquipment = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  vehicleType,
  onStatusChange,
  onSaveChecklist,
}: VehicleTypeEquipmentProps) => {
  const [equipmentStatuses, setEquipmentStatuses] = useState<{
    [key: string]: { status: string; description: string };
  }>({});
  const { toast } = useToast();

  // Set default status as "operante" for all equipment when component mounts
  useEffect(() => {
    const equipmentList = vehicleType === 'ABS'
      ? ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor']
      : ['Sistema de LGE', 'Mangueiras 1 1/2\' (metros)', 'Mangueiras 2 1/2\' (metros)'];

    const defaultStatuses = equipmentList.reduce((acc, equipment) => ({
      ...acc,
      [equipment]: { status: 'operante', description: '' }
    }), {});

    setEquipmentStatuses(defaultStatuses);
    
    // Trigger initial status change
    const statusesArray = equipmentList.map(equipName => ({
      vtr: selectedVTR,
      gbm: selectedGBM,
      equipamento: equipName,
      status: 'operante',
      description: null,
      date: selectedDate.toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));
    onStatusChange(statusesArray);
  }, [selectedVTR, selectedGBM, selectedDate, vehicleType, onStatusChange]);

  const { data: equipmentTypes, isLoading } = useQuery({
    queryKey: ["equipmentTypes", vehicleType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Equipment[];
    },
    enabled: !!vehicleType,
  });

  const handleStatusChange = (equipment: string, status: string, description: string = '') => {
    setEquipmentStatuses(prev => ({
      ...prev,
      [equipment]: { status, description }
    }));

    const equipmentList = vehicleType === 'ABS'
      ? ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor']
      : ['Sistema de LGE', 'Mangueiras 1 1/2\' (metros)', 'Mangueiras 2 1/2\' (metros)'];

    const statusesArray = equipmentList.map(equipName => ({
      vtr: selectedVTR,
      gbm: selectedGBM,
      equipamento: equipName,
      status: equipName === equipment ? status : (equipmentStatuses[equipName]?.status || 'operante'),
      description: equipName === equipment ? (description || null) : (equipmentStatuses[equipName]?.description || null),
      date: selectedDate.toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));

    onStatusChange(statusesArray);
  };

  const saveEquipmentStatuses = async () => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    try {
      const equipmentList = vehicleType === 'ABS'
        ? ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor']
        : ['Sistema de LGE', 'Mangueiras 1 1/2\' (metros)', 'Mangueiras 2 1/2\' (metros)'];

      const statusesToSave = equipmentList.map(equipment => ({
        equipamento: equipment,
        vtr: selectedVTR,
        gbm: selectedGBM,
        status: equipmentStatuses[equipment]?.status || 'operante',
        description: equipmentStatuses[equipment]?.description || null,
        date: selectedDate.toISOString().split('T')[0],
        time: currentTime,
      }));

      const { error } = await supabase
        .from('equipment_status')
        .insert(statusesToSave);

      if (error) throw error;

      toast({
        title: "Checklist salvo",
        description: `Checklist da ${selectedVTR} foi salvo com sucesso.`,
      });
      
      onSaveChecklist();
    } catch (error) {
      console.error('Error saving equipment statuses:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o checklist dos equipamentos.",
      });
    }
  };

  if (!vehicleType || (vehicleType !== 'ABS' && vehicleType !== 'ABT')) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-military-orange" />
      </div>
    );
  }

  const getEquipmentOptions = (equipment: string) => {
    if (equipment === 'Sistema de LGE') {
      return ['Operante', 'Nao operante', 'Inoperante'];
    }
    return ['Operante', 'Parcialmente operante', 'Não operante'];
  };

  const equipmentList = vehicleType === 'ABS'
    ? ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor']
    : ['Sistema de LGE', 'Mangueiras 1 1/2\' (metros)', 'Mangueiras 2 1/2\' (metros)'];

  return (
    <div className="space-y-4 mt-6 p-4 border border-military-orange/20 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">
        Checklist de Equipamentos - {selectedVTR}
      </h3>
      <div className="space-y-4">
        {equipmentList.map((equipment) => (
          <EquipmentStatusSelect
            key={equipment}
            label={equipment}
            status={equipmentStatuses[equipment]?.status || 'operante'}
            description={equipmentStatuses[equipment]?.description || ''}
            onStatusChange={(status) => handleStatusChange(equipment, status, equipmentStatuses[equipment]?.description)}
            onDescriptionChange={(description) => handleStatusChange(equipment, equipmentStatuses[equipment]?.status || '', description)}
            options={getEquipmentOptions(equipment)}
          />
        ))}
      </div>
      <Button
        onClick={saveEquipmentStatuses}
        className="w-full mt-4 bg-military-orange hover:bg-military-red transition-colors"
      >
        Salvar Checklist
      </Button>
    </div>
  );
};
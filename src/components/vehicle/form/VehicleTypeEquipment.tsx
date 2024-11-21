import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EquipmentStatusSelect } from "./equipment/EquipmentStatusSelect";
import { EquipmentStatus } from "../types";
import { useState } from "react";

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
}

export const VehicleTypeEquipment = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  vehicleType,
  onStatusChange,
}: VehicleTypeEquipmentProps) => {
  const [equipmentStatuses, setEquipmentStatuses] = useState<{
    [key: string]: { status: string; description: string; number?: string };
  }>({});

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

  const handleStatusChange = (equipment: string, status: string, description: string = '', number?: string) => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setEquipmentStatuses(prev => ({
      ...prev,
      [equipment]: { status, description, number }
    }));

    let requiredEquipment;
    if (vehicleType === 'ABS') {
      requiredEquipment = ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor'];
    } else if (vehicleType === 'ABT') {
      requiredEquipment = ['Sistema de LGE', 'Mangueiras 1 1/2\' (metros)', 'Mangueiras 2 1/2\' (metros)'];
    }

    const statusesArray = requiredEquipment.map(equipName => ({
      vtr: selectedVTR,
      gbm: selectedGBM,
      equipamento: equipName,
      status: equipName === equipment ? status : (equipmentStatuses[equipName]?.status || 'operante'),
      description: equipName === equipment 
        ? (description || (number ? `Quantidade: ${number} metros` : null)) 
        : (equipmentStatuses[equipName]?.description || null),
      date: selectedDate.toISOString().split('T')[0],
      time: currentTime,
    }));

    onStatusChange(statusesArray);
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

  const shouldShowNumberInput = (equipment: string) => {
    return equipment.includes('Mangueiras');
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
            status={equipmentStatuses[equipment]?.status || ''}
            description={equipmentStatuses[equipment]?.description || ''}
            onStatusChange={(status) => handleStatusChange(equipment, status, equipmentStatuses[equipment]?.description, equipmentStatuses[equipment]?.number)}
            onDescriptionChange={(description) => handleStatusChange(equipment, equipmentStatuses[equipment]?.status || '', description, equipmentStatuses[equipment]?.number)}
            options={getEquipmentOptions(equipment)}
            showNumberInput={shouldShowNumberInput(equipment)}
            numberValue={equipmentStatuses[equipment]?.number || ''}
            onNumberChange={(value) => handleStatusChange(
              equipment,
              equipmentStatuses[equipment]?.status || '',
              equipmentStatuses[equipment]?.description || '',
              value
            )}
          />
        ))}
      </div>
    </div>
  );
};
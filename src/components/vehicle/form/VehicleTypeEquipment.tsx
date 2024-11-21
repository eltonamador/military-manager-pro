import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    [key: string]: { status: string; description: string; quantity?: string };
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

  const handleStatusChange = (equipment: Equipment, status: string, description: string = '', quantity?: string) => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setEquipmentStatuses(prev => ({
      ...prev,
      [equipment.name]: { status, description, quantity }
    }));

    let statusesArray: EquipmentStatus[] = [];

    if (vehicleType === 'ABS') {
      const requiredEquipment = ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor'];
      statusesArray = requiredEquipment.map(equipName => ({
        vtr: selectedVTR,
        gbm: selectedGBM,
        equipamento: equipName,
        status: equipName === equipment.name ? status : (equipmentStatuses[equipName]?.status || 'operante'),
        description: equipName === equipment.name ? (description || null) : (equipmentStatuses[equipName]?.description || null),
        date: selectedDate.toISOString().split('T')[0],
        time: currentTime,
      }));
    } else if (vehicleType === 'ABT') {
      const requiredEquipment = ['Sistema de LGE', 'Mangueiras 1 1/2"', 'Mangueiras 2 1/2"'];
      statusesArray = requiredEquipment.map(equipName => ({
        vtr: selectedVTR,
        gbm: selectedGBM,
        equipamento: equipName,
        status: equipName === equipment.name ? status : (equipmentStatuses[equipName]?.status || 'operante'),
        description: equipName === equipment.name ? (description || null) : (equipmentStatuses[equipName]?.description || null),
        date: selectedDate.toISOString().split('T')[0],
        time: currentTime,
        quantity: equipName.includes('Mangueiras') ? quantity : undefined
      }));
    }

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

  const renderEquipmentFields = () => {
    if (vehicleType === 'ABT') {
      return (
        <>
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">Sistema de LGE</Label>
            <Select
              onValueChange={(value) => handleStatusChange({ id: 1, name: 'Sistema de LGE' }, value)}
              value={equipmentStatuses['Sistema de LGE']?.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operante">Operante</SelectItem>
                <SelectItem value="não operante">Não Operante</SelectItem>
                <SelectItem value="inoperante">Inoperante</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Descrição da alteração (se necessário)"
              onChange={(e) => handleStatusChange(
                { id: 1, name: 'Sistema de LGE' },
                equipmentStatuses['Sistema de LGE']?.status || 'operante',
                e.target.value
              )}
              value={equipmentStatuses['Sistema de LGE']?.description || ''}
              className="h-20"
            />
          </div>
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">Mangueiras 1 1/2"</Label>
            <Input
              type="number"
              placeholder="Quantidade"
              onChange={(e) => handleStatusChange(
                { id: 2, name: 'Mangueiras 1 1/2"' },
                'verificado',
                '',
                e.target.value
              )}
              value={equipmentStatuses['Mangueiras 1 1/2"']?.quantity || ''}
              min="0"
              className="mb-2"
            />
            <Textarea
              placeholder="Descrição da alteração (se necessário)"
              onChange={(e) => handleStatusChange(
                { id: 2, name: 'Mangueiras 1 1/2"' },
                'verificado',
                e.target.value,
                equipmentStatuses['Mangueiras 1 1/2"']?.quantity
              )}
              value={equipmentStatuses['Mangueiras 1 1/2"']?.description || ''}
              className="h-20"
            />
          </div>
          <div className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">Mangueiras 2 1/2"</Label>
            <Input
              type="number"
              placeholder="Quantidade"
              onChange={(e) => handleStatusChange(
                { id: 3, name: 'Mangueiras 2 1/2"' },
                'verificado',
                '',
                e.target.value
              )}
              value={equipmentStatuses['Mangueiras 2 1/2"']?.quantity || ''}
              min="0"
              className="mb-2"
            />
            <Textarea
              placeholder="Descrição da alteração (se necessário)"
              onChange={(e) => handleStatusChange(
                { id: 3, name: 'Mangueiras 2 1/2"' },
                'verificado',
                e.target.value,
                equipmentStatuses['Mangueiras 2 1/2"']?.quantity
              )}
              value={equipmentStatuses['Mangueiras 2 1/2"']?.description || ''}
              className="h-20"
            />
          </div>
        </>
      );
    }

    // For ABS, keep existing equipment rendering
    const absEquipment = equipmentTypes?.filter(eq => 
      ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor'].includes(eq.name)
    );

    return absEquipment?.map((equipment) => (
      <div key={equipment.id} className="space-y-2 p-4 bg-gray-50 rounded-md">
        <Label className="font-medium">{equipment.name}</Label>
        <Select
          onValueChange={(value) => handleStatusChange(equipment, value)}
          value={equipmentStatuses[equipment.name]?.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operante">Operante</SelectItem>
            <SelectItem value="verificado">Verificado</SelectItem>
            <SelectItem value="não operante">Não Operante</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Descrição da alteração (se necessário)"
          onChange={(e) => handleStatusChange(equipment, equipmentStatuses[equipment.name]?.status || 'operante', e.target.value)}
          value={equipmentStatuses[equipment.name]?.description || ''}
          className="h-20"
        />
      </div>
    ));
  };

  return (
    <div className="space-y-4 mt-6 p-4 border border-military-orange/20 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Checklist de Equipamentos - {vehicleType} - {selectedVTR}</h3>
      <div className="space-y-4">
        {renderEquipmentFields()}
      </div>
    </div>
  );
};

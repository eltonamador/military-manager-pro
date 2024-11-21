import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EquipmentStatus } from "../types";

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

  const handleStatusChange = (equipment: Equipment, status: string, description: string = '') => {
    const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    onStatusChange([{
      vtr: selectedVTR,
      gbm: selectedGBM,
      equipamento: equipment.name,
      status,
      description: description || null,
      date: selectedDate.toISOString().split('T')[0],
      time: currentTime,
    }]);
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

  const absEquipment = equipmentTypes?.filter(eq => 
    ['Conjunto Desencarcerador', 'Motosserras', 'Roupa de Apicultor'].includes(eq.name)
  );

  const relevantEquipment = vehicleType === 'ABS' ? absEquipment : [];

  return (
    <div className="space-y-4 mt-6 p-4 border border-military-orange/20 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Checklist de Equipamentos - {vehicleType}</h3>
      <div className="space-y-4">
        {relevantEquipment?.map((equipment) => (
          <div key={equipment.id} className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">{equipment.name}</Label>
            <Select
              onValueChange={(value) => handleStatusChange(equipment, value)}
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
              onChange={(e) => handleStatusChange(equipment, "operante", e.target.value)}
              className="h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Equipment {
  id: number;
  name: string;
}

interface EquipmentStatus {
  equipmentId: number;
  status: string;
  description: string;
}

interface EquipmentChecklistProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedDate: Date;
  onSave: (equipmentStatuses: EquipmentStatus[]) => void;
}

export const EquipmentChecklist = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  onSave,
}: EquipmentChecklistProps) => {
  const [equipmentStatuses, setEquipmentStatuses] = useState<EquipmentStatus[]>([]);

  const { data: equipmentTypes, isLoading } = useQuery({
    queryKey: ["equipmentTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_types")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Equipment[];
    },
  });

  const handleStatusChange = (equipmentId: number, status: string) => {
    const existingIndex = equipmentStatuses.findIndex(
      (item) => item.equipmentId === equipmentId
    );

    if (existingIndex >= 0) {
      const newStatuses = [...equipmentStatuses];
      newStatuses[existingIndex] = {
        ...newStatuses[existingIndex],
        status,
      };
      setEquipmentStatuses(newStatuses);
    } else {
      setEquipmentStatuses([
        ...equipmentStatuses,
        { equipmentId, status, description: "" },
      ]);
    }
  };

  const handleDescriptionChange = (equipmentId: number, description: string) => {
    const existingIndex = equipmentStatuses.findIndex(
      (item) => item.equipmentId === equipmentId
    );

    if (existingIndex >= 0) {
      const newStatuses = [...equipmentStatuses];
      newStatuses[existingIndex] = {
        ...newStatuses[existingIndex],
        description,
      };
      setEquipmentStatuses(newStatuses);
    } else {
      setEquipmentStatuses([
        ...equipmentStatuses,
        { equipmentId, status: "", description },
      ]);
    }
  };

  const handleSave = () => {
    onSave(equipmentStatuses);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-military-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6 p-4 border border-military-orange/20 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Checklist de Equipamentos</h3>
      <div className="space-y-4">
        {equipmentTypes?.map((equipment) => (
          <div key={equipment.id} className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">{equipment.name}</Label>
            <Select
              onValueChange={(value) => handleStatusChange(equipment.id, value)}
              value={
                equipmentStatuses.find((status) => status.equipmentId === equipment.id)
                  ?.status || ""
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operante">Operante</SelectItem>
                <SelectItem value="inoperante">Inoperante</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Descrição da alteração (se necessário)"
              value={
                equipmentStatuses.find((status) => status.equipmentId === equipment.id)
                  ?.description || ""
              }
              onChange={(e) =>
                handleDescriptionChange(equipment.id, e.target.value)
              }
              className="h-20"
            />
          </div>
        ))}
      </div>
      <Button
        onClick={handleSave}
        className="w-full bg-military-orange hover:bg-military-red transition-colors"
      >
        Salvar Status dos Equipamentos
      </Button>
    </div>
  );
};
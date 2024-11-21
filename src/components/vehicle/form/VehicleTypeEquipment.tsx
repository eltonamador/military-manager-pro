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
import { Input } from "@/components/ui/input";

interface Equipment {
  id: number;
  name: string;
}

interface EquipmentStatus {
  equipmentId: number;
  status: string;
  description: string;
}

interface VehicleTypeEquipmentProps {
  selectedGBM: string;
  selectedVTR: string;
  selectedDate: Date;
  vehicleType: string;
  onSave: (equipmentStatuses: EquipmentStatus[]) => void;
}

export const VehicleTypeEquipment = ({
  selectedGBM,
  selectedVTR,
  selectedDate,
  vehicleType,
  onSave,
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

  const abtEquipment = equipmentTypes?.filter(eq => 
    ['LGE', 'Mangueiras'].includes(eq.name)
  );

  const relevantEquipment = vehicleType === 'ABS' ? absEquipment : abtEquipment;

  return (
    <div className="space-y-4 mt-6 p-4 border border-military-orange/20 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">
        Checklist de Equipamentos - {vehicleType}
      </h3>
      <div className="space-y-4">
        {relevantEquipment?.map((equipment) => (
          <div key={equipment.id} className="space-y-2 p-4 bg-gray-50 rounded-md">
            <Label className="font-medium">{equipment.name}</Label>
            {equipment.name === 'LGE' ? (
              <Input
                type="number"
                placeholder="Quantidade de LGE utilizado (litros)"
                onChange={(e) => {
                  const status = e.target.value ? 'operante' : 'não operante';
                  onSave([{
                    equipmentId: equipment.id,
                    status,
                    description: e.target.value ? `${e.target.value} litros` : '',
                  }]);
                }}
              />
            ) : equipment.name === 'Mangueiras' ? (
              <Input
                type="number"
                placeholder="Quantidade de mangueiras"
                onChange={(e) => {
                  onSave([{
                    equipmentId: equipment.id,
                    status: 'operante',
                    description: e.target.value ? `${e.target.value} unidades` : '',
                  }]);
                }}
              />
            ) : (
              <>
                <Select
                  onValueChange={(value) =>
                    onSave([{
                      equipmentId: equipment.id,
                      status: value,
                      description: '',
                    }])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operante">Operante</SelectItem>
                    <SelectItem value="parcialmente operante">Parcialmente Operante</SelectItem>
                    <SelectItem value="não operante">Não Operante</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Descrição da alteração (se necessário)"
                  onChange={(e) =>
                    onSave([{
                      equipmentId: equipment.id,
                      status: 'operante',
                      description: e.target.value,
                    }])
                  }
                  className="h-20"
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
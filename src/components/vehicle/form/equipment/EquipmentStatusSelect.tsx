import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EquipmentStatusSelectProps {
  label: string;
  status: string;
  description: string;
  onStatusChange: (status: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const EquipmentStatusSelect = ({
  label,
  status,
  description,
  onStatusChange,
  onDescriptionChange,
}: EquipmentStatusSelectProps) => {
  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-md">
      <Label className="font-medium">{label}</Label>
      <Select onValueChange={onStatusChange} value={status}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="operante">Operante</SelectItem>
          <SelectItem value="parcialmente">Parcialmente Operante</SelectItem>
          <SelectItem value="não operante">Não Operante</SelectItem>
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Descrição da alteração (se necessário)"
        onChange={(e) => onDescriptionChange(e.target.value)}
        value={description}
        className="h-20"
      />
    </div>
  );
};
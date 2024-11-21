import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EquipmentStatusSelectProps {
  label: string;
  status: string;
  description: string;
  options: string[];
  onStatusChange: (status: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const EquipmentStatusSelect = ({
  label,
  status,
  description,
  options,
  onStatusChange,
  onDescriptionChange,
}: EquipmentStatusSelectProps) => {
  const showNumberInput = label.includes("Mangueiras");

  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-md">
      <Label className="font-medium">{label}</Label>
      <Select onValueChange={onStatusChange} value={status}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toLowerCase()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showNumberInput ? (
        <Input
          type="number"
          placeholder="Digite a quantidade em metros"
          value={description.replace(/\D/g, '')}
          onChange={(e) => onDescriptionChange(`Quantidade: ${e.target.value} metros`)}
          min={0}
          className="mt-2"
        />
      ) : (
        <Textarea
          placeholder="Descrição da alteração (se necessário)"
          onChange={(e) => onDescriptionChange(e.target.value)}
          value={description}
          className="h-20"
        />
      )}
    </div>
  );
};
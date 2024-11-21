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
  showNumberInput?: boolean;
  numberValue?: string;
  onNumberChange?: (value: string) => void;
}

export const EquipmentStatusSelect = ({
  label,
  status,
  description,
  options,
  onStatusChange,
  onDescriptionChange,
  showNumberInput = false,
  numberValue = '',
  onNumberChange,
}: EquipmentStatusSelectProps) => {
  return (
    <div className="space-y-2 p-4 bg-gray-50 rounded-md">
      <Label className="font-medium">{label}</Label>
      <div className="flex gap-2">
        <Select onValueChange={onStatusChange} value={status} className="flex-1">
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
        {showNumberInput && (
          <Input
            type="number"
            placeholder="Quantidade"
            value={numberValue}
            onChange={(e) => onNumberChange?.(e.target.value)}
            className="w-32"
            min="0"
          />
        )}
      </div>
      <Textarea
        placeholder="Descrição da alteração (se necessário)"
        onChange={(e) => onDescriptionChange(e.target.value)}
        value={description}
        className="h-20"
      />
    </div>
  );
};
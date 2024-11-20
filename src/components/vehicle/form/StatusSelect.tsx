import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  status: string;
  onStatusChange: (value: string) => void;
}

export const StatusSelect = ({ status, onStatusChange }: StatusSelectProps) => {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select onValueChange={onStatusChange} value={status}>
        <SelectTrigger id="status">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="operante">Operante</SelectItem>
          <SelectItem value="parcialmente">Parcialmente Operante</SelectItem>
          <SelectItem value="inoperante">Inoperante</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
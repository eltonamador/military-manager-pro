import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GBMSectionProps {
  selectedGBM: string;
  gbmOptions: string[];
  onGBMChange: (value: string) => void;
}

export const GBMSection = ({
  selectedGBM,
  gbmOptions,
  onGBMChange,
}: GBMSectionProps) => {
  return (
    <div>
      <Label htmlFor="gbm_mil">GBM_mil</Label>
      <Select onValueChange={onGBMChange} value={selectedGBM}>
        <SelectTrigger id="gbm_mil">
          <SelectValue placeholder="Selecione o GBM" />
        </SelectTrigger>
        <SelectContent>
          {gbmOptions.map((gbm) => (
            <SelectItem key={gbm} value={gbm}>
              {gbm}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
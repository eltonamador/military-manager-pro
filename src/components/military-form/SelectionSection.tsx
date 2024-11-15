import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectionSectionProps {
  selectedVTR: string;
  militaryFunction: string;
  shiftDuration: string;
  vtrOptions: Record<string, string[]>;
  selectedGBM: string;
  onVTRChange: (value: string) => void;
  onFunctionChange: (value: string) => void;
  onShiftDurationChange: (value: string) => void;
}

const militaryFunctionOptions = [
  "Condutor",
  "Adjunto do Oficial",
  "Resgateiro",
  "Cmdt de GU",
  "Cmdt de 1º linha",
  "ajudante de 1º linha",
  "Cmdt de 2º linha",
  "ajudante de 2º linha"
];

const shiftDurationOptions = ["6", "8", "12", "24"];

export const SelectionSection = ({
  selectedVTR,
  militaryFunction,
  shiftDuration,
  vtrOptions,
  selectedGBM,
  onVTRChange,
  onFunctionChange,
  onShiftDurationChange,
}: SelectionSectionProps) => {
  return (
    <>
      <div>
        <Label htmlFor="vtr">VTR</Label>
        <Select onValueChange={onVTRChange} value={selectedVTR} disabled={!selectedGBM}>
          <SelectTrigger id="vtr">
            <SelectValue placeholder="Selecione a VTR" />
          </SelectTrigger>
          <SelectContent>
            {selectedGBM &&
              vtrOptions[selectedGBM]?.map((vtr) => (
                <SelectItem key={vtr} value={vtr}>
                  {vtr}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="function">Função</Label>
        <Select onValueChange={onFunctionChange} value={militaryFunction}>
          <SelectTrigger id="function">
            <SelectValue placeholder="Selecione a Função" />
          </SelectTrigger>
          <SelectContent>
            {militaryFunctionOptions.map((func) => (
              <SelectItem key={func} value={func}>
                {func}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="shiftDuration">Jornada</Label>
        <Select onValueChange={onShiftDurationChange} value={shiftDuration}>
          <SelectTrigger id="shiftDuration">
            <SelectValue placeholder="Selecione a Jornada" />
          </SelectTrigger>
          <SelectContent>
            {shiftDurationOptions.map((duration) => (
              <SelectItem key={duration} value={duration}>
                {duration} horas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
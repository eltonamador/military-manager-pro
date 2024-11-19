import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface VTROption {
  prefix: string;
  description: string;
}

interface VTRFilterProps {
  selectedVTRs: string[];
  onVTRChange: (vtr: string, checked: boolean) => void;
  vtrOptions: VTROption[];
}

export const VTRFilter = ({ selectedVTRs, onVTRChange, vtrOptions }: VTRFilterProps) => {
  const handleSelectAll = (checked: boolean) => {
    vtrOptions.forEach(({ prefix }) => {
      onVTRChange(prefix, checked);
    });
  };

  const allSelected = vtrOptions.every(({ prefix }) => selectedVTRs.includes(prefix));

  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">Tipo VTR</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all-vtrs"
            checked={allSelected}
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
            className="border-red-200 text-red-600"
          />
          <Label 
            htmlFor="select-all-vtrs"
            className="text-sm text-gray-700"
          >
            Todos
          </Label>
        </div>
      </div>
      <div className="space-y-3">
        {vtrOptions.map(({ prefix }) => (
          <div key={prefix} className="flex items-center space-x-2">
            <Checkbox
              id={`vtr-${prefix}`}
              checked={selectedVTRs.includes(prefix)}
              onCheckedChange={(checked) => onVTRChange(prefix, !!checked)}
              className="border-red-200 text-red-600"
            />
            <Label 
              htmlFor={`vtr-${prefix}`}
              className="text-sm text-gray-700"
            >
              {prefix}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};
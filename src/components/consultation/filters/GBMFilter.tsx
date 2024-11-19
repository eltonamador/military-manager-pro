import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface GBMFilterProps {
  title: string;
  selectedGBMs: string[];
  onGBMChange: (gbm: string, checked: boolean) => void;
  gbmOptions: string[];
}

export const GBMFilter = ({ title, selectedGBMs, onGBMChange, gbmOptions }: GBMFilterProps) => {
  const handleSelectAll = (checked: boolean) => {
    gbmOptions.forEach(gbm => {
      onGBMChange(gbm, checked);
    });
  };

  const allSelected = gbmOptions.every(gbm => selectedGBMs.includes(gbm));

  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`select-all-${title}`}
            checked={allSelected}
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
            className="border-red-200 text-red-600"
          />
          <Label 
            htmlFor={`select-all-${title}`}
            className="text-sm text-gray-700"
          >
            Todos
          </Label>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {gbmOptions.map((gbm) => (
          <div key={gbm} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${gbm}`}
              checked={selectedGBMs.includes(gbm)}
              onCheckedChange={(checked) => onGBMChange(gbm, !!checked)}
              className="border-red-200 text-red-600"
            />
            <Label 
              htmlFor={`${title}-${gbm}`}
              className="text-sm text-gray-700"
            >
              {gbm}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};
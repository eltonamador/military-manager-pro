import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface OfficerFilterProps {
  selectedOfficerTypes: string[];
  onOfficerTypeChange: (types: string[]) => void;
}

const officerTypes = [
  { value: 'Superior de dia', label: 'Superior de Dia' },
  { value: 'Oficial de Área 1', label: 'Oficial de Área 1' },
  { value: 'Oficial de Área 2', label: 'Oficial de Área 2' }
];

export const OfficerFilter = ({ 
  selectedOfficerTypes = [], // Provide default empty array
  onOfficerTypeChange 
}: OfficerFilterProps) => {
  const handleCheckboxChange = (type: string, checked: boolean) => {
    if (checked) {
      onOfficerTypeChange([...selectedOfficerTypes, type]);
    } else {
      onOfficerTypeChange(selectedOfficerTypes.filter(t => t !== type));
    }
  };

  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Oficiais</h3>
      <div className="space-y-3">
        {officerTypes.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={`officer-type-${type.value}`}
              checked={selectedOfficerTypes.includes(type.value)}
              onCheckedChange={(checked) => handleCheckboxChange(type.value, checked as boolean)}
            />
            <Label
              htmlFor={`officer-type-${type.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {type.label}
            </Label>
          </div>
        ))}
      </div>
    </Card>
  );
};
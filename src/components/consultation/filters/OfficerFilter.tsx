import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Select from 'react-select';

interface OfficerFilterProps {
  selectedOfficerType: string | null;
  onOfficerTypeChange: (type: string | null) => void;
}

const officerTypes = [
  { value: 'Área 1', label: 'Oficial de Área 1' },
  { value: 'Área 2', label: 'Oficial de Área 2' },
  { value: 'Superior de dia', label: 'Superior de Dia' }
];

export const OfficerFilter = ({ selectedOfficerType, onOfficerTypeChange }: OfficerFilterProps) => {
  return (
    <Card className="p-3 sm:p-4 border-red-100 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Oficiais</h3>
      <div>
        <Label htmlFor="officer-type">Tipo de Oficial</Label>
        <Select
          inputId="officer-type"
          options={officerTypes}
          value={selectedOfficerType ? { value: selectedOfficerType, label: officerTypes.find(t => t.value === selectedOfficerType)?.label } : null}
          onChange={(option) => onOfficerTypeChange(option ? option.value : null)}
          isClearable
          placeholder="Selecione o tipo de oficial"
          className="mt-1"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: 'hsl(var(--border))',
              '&:hover': {
                borderColor: 'hsl(var(--border))',
              },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'transparent',
              color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'inherit',
              '&:active': {
                backgroundColor: 'hsl(var(--accent))',
              },
            }),
          }}
        />
      </div>
    </Card>
  );
};
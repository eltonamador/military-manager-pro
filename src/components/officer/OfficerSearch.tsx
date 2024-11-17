import { Label } from "@/components/ui/label";
import Select from 'react-select';

interface OfficerSearchProps {
  selectedOfficer: string;
  officerOptions: string[];
  isLoading: boolean;
  onOfficerChange: (value: string) => void;
}

const OfficerSearch = ({
  selectedOfficer,
  officerOptions,
  isLoading,
  onOfficerChange,
}: OfficerSearchProps) => {
  const options = officerOptions.map(name => ({ value: name, label: name }));

  return (
    <div>
      <Label htmlFor="officer">Nome do Oficial</Label>
      <Select
        inputId="officer"
        options={options}
        placeholder="DIGITE o nome do Oficial"
        value={selectedOfficer ? { value: selectedOfficer, label: selectedOfficer } : null}
        onChange={(option) => onOfficerChange(option ? option.value : '')}
        isClearable
        isLoading={isLoading}
        className="mt-1"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '40px',
            borderRadius: '6px',
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
  );
};

export default OfficerSearch;
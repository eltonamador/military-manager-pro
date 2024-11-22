import Select from 'react-select';
import { useVTRs } from "@/hooks/useVTRs";

interface VTRSelectProps {
  selectedVTR: string;
  onVTRChange: (value: string) => void;
}

export const VTRSelect = ({ selectedVTR, onVTRChange }: VTRSelectProps) => {
  const { data: vtrOptions, isLoading } = useVTRs();
  const options = vtrOptions?.map(vtr => ({ value: vtr, label: vtr })) || [];

  return (
    <Select
      options={options}
      value={selectedVTR ? { value: selectedVTR, label: selectedVTR } : null}
      onChange={(option) => onVTRChange(option ? option.value : '')}
      placeholder="Digite a VTR"
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
  );
};
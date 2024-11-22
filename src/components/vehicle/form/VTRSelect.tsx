import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VTRSelectProps {
  selectedVTR: string;
  onVTRChange: (value: string) => void;
}

export const VTRSelect = ({ selectedVTR, onVTRChange }: VTRSelectProps) => {
  // Fetch VTRs from Supabase
  const { data: vtrOptions, isLoading } = useQuery({
    queryKey: ["vtrs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("viaturas")
        .select("prefixo")
        .order("prefixo");

      if (error) throw error;
      return data?.map(vtr => vtr.prefixo) || [];
    },
  });

  const options = vtrOptions?.map(vtr => ({ value: vtr, label: vtr })) || [];

  return (
    <div>
      <Label htmlFor="vtr">VTR</Label>
      <Select
        inputId="vtr"
        options={options}
        value={selectedVTR ? { value: selectedVTR, label: selectedVTR } : null}
        onChange={(option) => onVTRChange(option ? option.value : '')}
        placeholder="DIGITE a VTR"
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
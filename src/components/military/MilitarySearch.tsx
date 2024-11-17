import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import Select from 'react-select';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MilitarySearchProps {
  selectedMilitary: string;
  onMilitaryChange: (value: string) => void;
}

const MilitarySearch = ({ selectedMilitary, onMilitaryChange }: MilitarySearchProps) => {
  const [militaryOptions, setMilitaryOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilitaryOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('militares_geral')
          .select('nome_guerra')
          .not('nome_guerra', 'is', null);

        if (error) throw error;
        
        const names = (data || [])
          .map(item => item.nome_guerra)
          .filter((name): name is string => Boolean(name));
        
        setMilitaryOptions(names);
      } catch (error) {
        console.error('Error fetching military names:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar militares",
          description: "Não foi possível carregar a lista de militares.",
        });
        setMilitaryOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilitaryOptions();
  }, [toast]);

  const options = militaryOptions.map(name => ({ value: name, label: name }));

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Select
        inputId="military"
        options={options}
        placeholder="DIGITE o nome do Militar"
        value={selectedMilitary ? { value: selectedMilitary, label: selectedMilitary } : null}
        onChange={(option) => onMilitaryChange(option ? option.value : '')}
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

export default MilitarySearch;
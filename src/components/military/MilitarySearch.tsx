import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Select value={selectedMilitary} onValueChange={onMilitaryChange}>
        <SelectTrigger id="military" className="w-full">
          <SelectValue placeholder="Selecione o Militar" />
        </SelectTrigger>
        <SelectContent>
          {militaryOptions.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MilitarySearch;
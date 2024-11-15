import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MilitarySearchProps {
  onSelect: (military: string) => void;
  selectedMilitary: string;
}

const MilitarySearch = ({ onSelect, selectedMilitary }: MilitarySearchProps) => {
  const [militaryOptions, setMilitaryOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchMilitaryNames = async () => {
      const { data, error } = await supabase
        .from('militares_geral')
        .select('nome_guerra')
        .not('nome_guerra', 'is', null);

      if (error) {
        console.error('Error fetching military names:', error);
        return;
      }

      if (data) {
        const names = data.map(item => item.nome_guerra || '');
        setMilitaryOptions(names);
      }
    };

    fetchMilitaryNames();
  }, []);

  return (
    <Select value={selectedMilitary} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um militar" />
      </SelectTrigger>
      <SelectContent>
        {militaryOptions.map((military) => (
          <SelectItem key={military} value={military}>
            {military}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MilitarySearch;
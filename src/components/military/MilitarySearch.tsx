import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select } from "@/components/ui/select";

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
        const names = data.map(item => item.nome_guerra);
        setMilitaryOptions(names);
      }
    };

    fetchMilitaryNames();
  }, []);

  return (
    <Select
      value={selectedMilitary}
      onChange={onSelect}
      placeholder="Selecione um militar"
    >
      {militaryOptions.map((military) => (
        <Select.Option key={military} value={military}>
          {military}
        </Select.Option>
      ))}
    </Select>
  );
};

export default MilitarySearch;

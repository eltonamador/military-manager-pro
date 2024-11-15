import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MilitarySearchProps {
  selectedMilitary: string;
  onMilitaryChange: (value: string) => void;
}

interface MilitaryData {
  nome_guerra: string | null;
}

export const MilitarySearch = ({
  selectedMilitary,
  onMilitaryChange,
}: MilitarySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [militaryOptions, setMilitaryOptions] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilitaryNames = async () => {
      if (searchQuery.length >= 3) {
        try {
          const { data, error } = await supabase
            .from('militares_1gbm')
            .select('nome_guerra');

          if (error) {
            console.error('Supabase error:', error);
            setMilitaryOptions([]);
            toast({
              variant: "destructive",
              title: "Erro ao buscar militares",
              description: "Não foi possível carregar a lista de militares.",
            });
            return;
          }

          // Safe data handling with Array.isArray and optional chaining
          const safeData = Array.isArray(data) ? data : [];
          const validNames = safeData
            ?.filter((item): item is MilitaryData => 
              item !== null && 
              typeof item === 'object' && 
              'nome_guerra' in item
            )
            ?.map(item => item?.nome_guerra)
            ?.filter((name): name is string => 
              typeof name === 'string' && 
              name.length > 0 && 
              name.toLowerCase().includes(searchQuery.toLowerCase())
            ) ?? [];

          setMilitaryOptions(validNames);
        } catch (error) {
          console.error('Error fetching military names:', error);
          setMilitaryOptions([]);
          toast({
            variant: "destructive",
            title: "Erro ao buscar militares",
            description: "Ocorreu um erro ao buscar a lista de militares.",
          });
        }
      } else {
        setMilitaryOptions([]);
      }
    };

    fetchMilitaryNames();
  }, [searchQuery, toast]);

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Popover open={commandOpen} onOpenChange={setCommandOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={commandOpen}
            className="w-full justify-between"
          >
            {selectedMilitary || "Selecione o Militar"}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder="Buscar militar..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>Nenhum militar encontrado.</CommandEmpty>
            <CommandGroup>
              {militaryOptions.map((military) => (
                <CommandItem
                  key={military}
                  value={military}
                  onSelect={(value) => {
                    onMilitaryChange(value);
                    setCommandOpen(false);
                  }}
                >
                  {military}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
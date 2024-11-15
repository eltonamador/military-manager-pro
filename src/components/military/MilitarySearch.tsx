import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MilitarySearchProps {
  selectedMilitary: string;
  onMilitaryChange: (value: string) => void;
}

const MilitarySearch = ({ selectedMilitary, onMilitaryChange }: MilitarySearchProps) => {
  const [openMilitaryCommand, setOpenMilitaryCommand] = useState(false);
  const [militaryOptions, setMilitaryOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilitaryOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('militares_1gbm')
          .select('nome_guerra')
          .not('nome_guerra', 'is', null);

        if (error) throw error;
        
        // Ensure we have an array of names, even if empty
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
      }
    };

    fetchMilitaryOptions();
  }, [toast]);

  const filteredOptions = militaryOptions.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Popover open={openMilitaryCommand} onOpenChange={setOpenMilitaryCommand}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openMilitaryCommand}
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
              {filteredOptions.map((military) => (
                <CommandItem
                  key={military}
                  onSelect={() => {
                    onMilitaryChange(military);
                    setOpenMilitaryCommand(false);
                    setSearchQuery("");
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

export default MilitarySearch;
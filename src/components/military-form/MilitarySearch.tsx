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

const exampleMilitaries = [
  "SGT SILVA",
  "CB SANTOS",
  "SD OLIVEIRA",
  "TEN COSTA",
  "CAP PEREIRA",
  "MAJ RODRIGUES",
  "CEL ALMEIDA",
  "SGT FERREIRA",
  "CB SOUZA",
  "SD LIMA"
];

export const MilitarySearch = ({
  selectedMilitary,
  onMilitaryChange,
}: MilitarySearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [militaryOptions, setMilitaryOptions] = useState<string[]>(exampleMilitaries);
  const [commandOpen, setCommandOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMilitaryNames = async () => {
      if (searchQuery.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('militares_1gbm')
            .select('nome_guerra');

          if (error) {
            console.error('Supabase error:', error);
            // Fallback to example data if database fetch fails
            const filteredExamples = exampleMilitaries.filter(name =>
              name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setMilitaryOptions(filteredExamples);
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

          // If no database results, use filtered example data
          setMilitaryOptions(validNames.length > 0 ? validNames : 
            exampleMilitaries.filter(name =>
              name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        } catch (error) {
          console.error('Error fetching military names:', error);
          // Fallback to example data on error
          const filteredExamples = exampleMilitaries.filter(name =>
            name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMilitaryOptions(filteredExamples);
        }
      } else {
        setMilitaryOptions(exampleMilitaries);
      }
    };

    fetchMilitaryNames();
  }, [searchQuery]);

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Popover open={commandOpen} onOpenChange={setCommandOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={commandOpen}
            className="w-full justify-between bg-white border border-gray-300"
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
              className="border-none focus:ring-0"
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
                  className="cursor-pointer hover:bg-gray-100"
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
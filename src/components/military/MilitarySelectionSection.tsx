import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useEffect } from "react";

interface MilitarySelectionSectionProps {
  selectedMilitary: string;
  militaryOptions: string[];
  onMilitaryChange: (value: string) => void;
  disabled?: boolean;
}

export const MilitarySelectionSection = ({
  selectedMilitary,
  militaryOptions = [], // Provide default empty array
  onMilitaryChange,
  disabled = false,
}: MilitarySelectionSectionProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Update filtered options whenever militaryOptions or searchQuery changes
  useEffect(() => {
    if (!militaryOptions) {
      setFilteredOptions([]);
      return;
    }

    const filtered = militaryOptions.filter((military) =>
      military.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [militaryOptions, searchQuery]);

  return (
    <div>
      <Label htmlFor="military">Nome do Militar</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedMilitary || "Selecione o Militar"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar militar..." 
              onValueChange={setSearchQuery}
              value={searchQuery}
              className="h-9"
            />
            <CommandEmpty>Nenhum militar encontrado.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((military) => (
                <CommandItem
                  key={military}
                  value={military}
                  onSelect={() => {
                    onMilitaryChange(military);
                    setOpen(false);
                  }}
                >
                  {military}
                  {selectedMilitary === military && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VTRSelectProps {
  selectedVTR: string;
  onVTRChange: (value: string) => void;
}

export const VTRSelect = ({ selectedVTR, onVTRChange }: VTRSelectProps) => {
  // Fetch VTRs from Supabase
  const { data: vtrOptions } = useQuery({
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

  return (
    <div>
      <Label htmlFor="vtr">VTR</Label>
      <Select onValueChange={onVTRChange} value={selectedVTR}>
        <SelectTrigger id="vtr">
          <SelectValue placeholder="Selecione a VTR" />
        </SelectTrigger>
        <SelectContent>
          {vtrOptions?.map((vtr) => (
            <SelectItem key={vtr} value={vtr}>
              {vtr}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVTRs = () => {
  return useQuery({
    queryKey: ["vtrs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("viaturas")
        .select("prefixo")
        .order("prefixo");

      if (error) throw error;
      return data.map(vtr => vtr.prefixo) as string[];
    },
  });
};
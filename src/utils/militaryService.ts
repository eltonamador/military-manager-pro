import { supabase } from "@/integrations/supabase/client";
import { Military } from "@/types/military";
import { format } from "date-fns";

export const saveMilitaryService = async (military: Military) => {
  const tableName = `servico_militar_${military.gbm.toLowerCase().replace(/[°º]/, '')}`;
  
  const { data, error } = await supabase
    .from(tableName)
    .insert({
      GBM: military.gbm,
      viatura: military.vtr,
      nome_de_guerra: military.name,
      funcao: military.function,
      data: format(military.date, 'yyyy-MM-dd'),
      alteracao_mil: military.alterations || null,
    });

  if (error) {
    throw error;
  }

  return data;
};

export const saveMilitaryList = async (militaryList: Military[]) => {
  const results = await Promise.all(
    militaryList.map(military => saveMilitaryService(military))
  );
  return results;
};
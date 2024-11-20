import { supabase } from "@/integrations/supabase/client";
import { Military } from "@/types/military";
import { format } from "date-fns";

type MilitaryServiceTable = 
  | "servico_militar_1gbm"
  | "servico_militar_2gbm"
  | "servico_militar_5gbm"
  | "servico_militar_gaph"
  | "servico_militar_gmaf"
  | "servico_militar_mcpb";

export const saveMilitaryService = async (military: Military) => {
  const tableName = `servico_militar_${military.gbm.toLowerCase().replace(/[°º]/, '')}` as MilitaryServiceTable;
  
  const { data, error } = await supabase
    .from(tableName)
    .insert({
      GBM: military.gbm,
      viatura: military.vtr,
      nome_de_guerra: military.name,
      funcao: military.function,
      data: format(military.date, 'yyyy-MM-dd'),
      alteracao_mil: military.alterations || null,
      horario_inclusao: military.time || format(new Date(), 'HH:mm'),
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
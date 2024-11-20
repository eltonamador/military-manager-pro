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

const getTableName = (gbm: string): MilitaryServiceTable => {
  const normalizedGBM = gbm.toLowerCase().replace(/[°º]/, '');
  return `servico_militar_${normalizedGBM}` as MilitaryServiceTable;
};

export const checkExistingMilitary = async (military: Military): Promise<boolean> => {
  const tableName = getTableName(military.gbm);
  const formattedDate = format(military.date, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from(tableName)
    .select()
    .eq('nome_de_guerra', military.name)
    .eq('data', formattedDate);

  if (error) {
    throw error;
  }

  return data && data.length > 0;
};
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName } from "./tableNames";

export const checkExistingMilitary = async (
  name: string,
  date: Date,
  gbm: string
): Promise<boolean> => {
  try {
    const tableName = getMilitaryTableName(gbm);
    const formattedDate = date.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('nome_de_guerra', name)
      .eq('data', formattedDate);

    if (error) {
      console.error("Error checking existing military:", error);
      throw error;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Failed to check existing military:", error);
    throw error;
  }
};
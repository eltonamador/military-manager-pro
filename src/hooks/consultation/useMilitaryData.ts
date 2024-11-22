import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getMilitaryTableName } from "@/utils/tableNames";

export const fetchMilitaryData = async (
  selectedGBMs: string[],
  selectedVTRs: string[],
  selectedDate: Date
) => {
  if (!selectedDate || selectedGBMs.length === 0) return [];

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const promises = selectedGBMs.map(async (gbm) => {
    const tableName = getMilitaryTableName(gbm);
    const query = supabase
      .from(tableName)
      .select("*")
      .eq('data', formattedDate);

    if (selectedVTRs.length > 0) {
      const vtrConditions = selectedVTRs.map(prefix => `viatura.ilike.${prefix}%`);
      query.or(vtrConditions.join(','));
    }

    const { data: queryData, error } = await query;
    
    if (error) {
      console.error(`Error querying ${tableName}:`, error);
      throw error;
    }
    
    return queryData || [];
  });

  return Promise.all(promises);
};
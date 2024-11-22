import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getVehicleTableName } from "@/utils/tableNames";

export const fetchVehicleData = async (
  selectedGBMs: string[],
  selectedVTRs: string[],
  selectedDate: Date
) => {
  if (!selectedDate || selectedGBMs.length === 0) return [];

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const promises = selectedGBMs.map(async (gbm) => {
    const tableName = getVehicleTableName(gbm);
    const query = supabase
      .from(tableName)
      .select("*")
      .eq('data', formattedDate);

    if (selectedVTRs.length > 0) {
      const vtrConditions = selectedVTRs.map(prefix => `vtr.ilike.${prefix}%`);
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
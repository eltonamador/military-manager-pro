import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const fetchEquipmentData = async (
  selectedGBMs: string[],
  selectedVTRs: string[],
  selectedDate: Date
) => {
  if (!selectedDate || (selectedGBMs.length === 0 && selectedVTRs.length === 0)) return [];

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const query = supabase
    .from('equipment_status')
    .select('*')
    .eq('date', formattedDate);

  if (selectedGBMs.length > 0) {
    query.in('gbm', selectedGBMs);
  }

  if (selectedVTRs.length > 0) {
    const vtrConditions = selectedVTRs.map(prefix => `vtr.ilike.${prefix}%`);
    query.or(vtrConditions.join(','));
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error querying equipment status:', error);
    throw error;
  }

  return data || [];
};
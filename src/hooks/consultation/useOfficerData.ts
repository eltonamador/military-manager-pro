import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export const fetchOfficerData = async (
  selectedDate: Date,
  selectedOfficerTypes: string[]
) => {
  if (!selectedDate || selectedOfficerTypes.length === 0) return [];

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
  
  const { data, error } = await supabase
    .from('servico_oficial')
    .select('*')
    .eq('data_serv_of', formattedDate)
    .in('tipo', selectedOfficerTypes)
    .not('nome_of_sup', 'is', null);

  if (error) {
    console.error('Error querying officer data:', error);
    throw error;
  }

  return data || [];
};
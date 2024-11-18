import { supabase } from "@/integrations/supabase/client";

export const checkExistingOfficerService = async (
  officerName: string,
  serviceDate: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("servico_oficial")
    .select("*")
    .eq("nome_of_sup", officerName)
    .eq("data_serv_of", serviceDate)
    .single();

  return !!data;
};
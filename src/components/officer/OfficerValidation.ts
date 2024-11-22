import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface Officer {
  function: string;
  officer: string;
  vtr?: string;
}

export const saveOfficerService = async (
  officer: Officer,
  date: Date,
  currentTime: string
) => {
  const { error } = await supabase
    .from("servico_oficial")
    .insert({
      nome_of_sup: officer.officer,
      tipo: officer.function,
      data_serv_of: date.toISOString().split('T')[0],
      vtr_sup: officer.vtr || null,
      hora_inclusao_sup: currentTime
    });

  if (error) throw error;
};

export const validateOfficerSelection = (
  selectedFunction: string,
  selectedOfficer: string,
  selectedDate: Date | null
): string | null => {
  if (!selectedFunction || !selectedOfficer || !selectedDate) {
    return "Por favor, preencha os campos obrigatórios (Função, Oficial e Data).";
  }
  return null;
};
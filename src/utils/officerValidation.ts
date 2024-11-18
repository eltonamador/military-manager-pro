import { supabase } from "@/integrations/supabase/client";

export const checkExistingOfficerService = async (
  officer: string,
  date: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('servico_oficial')
      .select('id') // Seleciona apenas o necessário para economizar recursos
      .eq('nome_of_sup', officer)
      .eq('data_serv_of', date);

    if (error) {
      console.error("Erro ao verificar serviço existente:", error);
      throw error; // Propaga o erro para o bloco try/catch superior
    }

    return data && data.length > 0; // Retorna true se encontrar resultados
  } catch (error) {
    throw new Error("Falha na verificação de serviço existente");
  }
};
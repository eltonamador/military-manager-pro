import { supabase } from "@/integrations/supabase/client";
import { Military } from "@/types/military";
import { toast } from "@/hooks/use-toast";

export const getTableName = (gbm: string) => {
  if (["GAPH", "GMAF", "MCPB"].includes(gbm)) {
    return `servico_militar_${gbm.toLowerCase()}` as const;
  }
  return `servico_militar_${gbm.replace("°", "")}gbm`.toLowerCase() as const;
};

export const checkExistingMilitary = async (military: Military) => {
  try {
    const { data, error } = await supabase.rpc('check_military_service_exists', {
      p_nome: military.name,
      p_data: military.date.toISOString().split('T')[0],
      p_gbm: military.gbm
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking existing military:', error);
    return false;
  }
};

export const saveMilitaryService = async (military: Military, isUpdate = false) => {
  const tableName = getTableName(military.gbm);
  
  try {
    const { error } = await supabase
      .from(tableName)
      .upsert({
        nome_de_guerra: military.name,
        funcao: military.function,
        GBM: military.gbm,
        viatura: military.vtr,
        data: military.date.toISOString().split('T')[0],
      });

    if (error) throw error;

    toast({
      title: isUpdate ? "Registro atualizado" : "Registro salvo",
      description: isUpdate 
        ? "O registro do militar foi atualizado com sucesso!"
        : "O registro do militar foi salvo com sucesso!",
    });
  } catch (error) {
    console.error('Error saving military service:', error);
    toast({
      variant: "destructive",
      title: "Erro ao salvar",
      description: "Ocorreu um erro ao salvar o registro do militar.",
    });
  }
};
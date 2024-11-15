import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

const getTableNameForGBM = (gbm: string) => {
  const tableMap: { [key: string]: string } = {
    "1º GBM": "servico_vtrs_1gbm",
    "2º GBM": "servico_vtrs_2gbm",
    "MCPB": "servico_vtrs_mcpb",
    "5º GBM": "servico_vtrs_5gbm",
    "GAPH": "servico_vtrs_gaph",
    "GMAF": "servico_vtrs_gmaf"
  };
  return tableMap[gbm];
};

export const useVehicleService = () => {
  const { toast } = useToast();

  const saveVehicleService = async (vehicles: Vehicle[]) => {
    try {
      for (const vehicle of vehicles) {
        const tableName = getTableNameForGBM(vehicle.gbm);
        
        if (!tableName) {
          toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: `GBM inválido: ${vehicle.gbm}`,
          });
          continue;
        }

        const { error } = await supabase
          .from(tableName)
          .insert({
            vtr: vehicle.vtr,
            status: vehicle.status,
            alteracao: vehicle.description,
            gbm: vehicle.gbm,
            data: new Date().toISOString().split('T')[0],
          });

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Sucesso",
        description: "Dados das viaturas salvos com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Error saving vehicle service:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar os dados das viaturas",
      });
      return false;
    }
  };

  return { saveVehicleService };
};
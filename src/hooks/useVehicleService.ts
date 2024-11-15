import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
}

const getVehicleTableName = (gbm: string) => {
  const normalizedGbm = gbm.toLowerCase().replace(/[º°]/g, '');
  return `servico_vtrs_${normalizedGbm}`;
};

export const useVehicleService = () => {
  const saveVehicleService = async (vehicles: Vehicle[]) => {
    try {
      for (const vehicle of vehicles) {
        const tableName = getVehicleTableName(vehicle.gbm);
        const { error } = await supabase.from(tableName).insert({
          gbm: vehicle.gbm,
          vtr: vehicle.vtr,
          status: vehicle.status,
          alteracao: vehicle.description,
        });

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Dados das VTRs salvos com sucesso",
      });

      return true;
    } catch (error) {
      console.error("Error saving vehicle service:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados das VTRs",
      });
      return false;
    }
  };

  return { saveVehicleService };
};
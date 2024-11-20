import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { getVehicleTableName } from "@/utils/tableNames";

interface Vehicle {
  gbm: string;
  vtr: string;
  status: string;
  description: string;
  date: Date;
  time: string;
}

export const useVehicleService = () => {
  const { toast } = useToast();

  const saveVehicleService = async (vehicles: Vehicle[], selectedDate: Date) => {
    try {
      for (const vehicle of vehicles) {
        const tableName = getVehicleTableName(vehicle.gbm);

        const { error } = await supabase
          .from(tableName)
          .insert({
            vtr: vehicle.vtr,
            status: vehicle.status,
            alteracao: vehicle.description,
            gbm: vehicle.gbm,
            data: selectedDate.toISOString().split('T')[0],
            hora_inclusao_vtr: vehicle.time,
          });

        if (error) {
          console.error('Error saving vehicle:', error);
          throw error;
        }
      }

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
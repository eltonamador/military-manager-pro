import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getMilitaryTableName, getVehicleTableName } from "@/utils/tableNames";
import { formatDateForQuery } from "@/utils/dateUtils";

export const useConsultationData = (
  selectedMilitaryGBMs: string[],
  selectedVehicleGBMs: string[],
  selectedDate: Date | undefined,
  selectedVTRs: string[]
) => {
  const { data: militaryData, isLoading: isMilitaryLoading } = useQuery({
    queryKey: ["military-service", selectedMilitaryGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedMilitaryGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);
      console.log('Querying military data for date:', formattedDate);

      const promises = selectedMilitaryGBMs.map(async (gbm) => {
        const tableName = getMilitaryTableName(gbm);
        const query = supabase
          .from(tableName)
          .select("*")
          .eq('data', formattedDate);

        if (selectedVTRs.length > 0) {
          const vtrConditions = selectedVTRs.map(prefix => `viatura.ilike.${prefix}%`);
          query.or(vtrConditions.join(','));
        }

        const { data: queryData, error } = await query;
        
        if (error) {
          console.error(`Error querying ${tableName}:`, error);
          throw error;
        }
        
        return queryData || [];
      });

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedMilitaryGBMs.length > 0,
  });

  const { data: vehicleData, isLoading: isVehicleLoading } = useQuery({
    queryKey: ["vehicle-service", selectedVehicleGBMs, selectedDate, selectedVTRs],
    queryFn: async () => {
      if (!selectedDate || selectedVehicleGBMs.length === 0) return [];

      const formattedDate = formatDateForQuery(selectedDate);
      console.log('Querying vehicle data for date:', formattedDate);

      const promises = selectedVehicleGBMs.map(async (gbm) => {
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

      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: !!selectedDate && selectedVehicleGBMs.length > 0,
  });

  const formatData = () => {
    const formattedMilitaryData = militaryData?.map(item => ({
      name: item.nome_de_guerra || "",
      function: item.funcao || "",
      gbm: item.GBM || "",
      vtr: item.viatura || "",
      date: item.data ? new Date(item.data) : new Date(),
      shiftDuration: "24"
    })) || [];

    const formattedVehicleData = vehicleData?.map(item => ({
      name: item.vtr || "",
      function: item.status || "",
      gbm: item.gbm || "",
      vtr: item.alteracao || "",
      date: item.data ? new Date(item.data) : new Date(),
      shiftDuration: "-"
    })) || [];

    return [...formattedMilitaryData, ...formattedVehicleData];
  };

  return {
    isLoading: isMilitaryLoading || isVehicleLoading,
    combinedData: formatData()
  };
};